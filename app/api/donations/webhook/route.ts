/**
 * Stripe Webhook Handler
 *
 * POST /api/donations/webhook
 *
 * Handles Stripe webhook events:
 * - payment_intent.succeeded
 * - payment_intent.payment_failed
 * - invoice.paid (for subscriptions)
 * - customer.subscription.updated
 * - customer.subscription.deleted
 */

import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import Stripe from 'stripe';

import {
  sendAdminNotification,
  sendDonationReceipt,
} from '@lib/email/email-service';

// Lazy initialization to avoid build-time errors when env vars aren't available
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-12-18.acacia',
    });
  }
  return stripe;
}

// Helper to handle MongoDB WriteConflicts with retry logic
async function runWithRetry<T>(
  operation: () => Promise<T>,
  retries = 3,
  delay = 500
): Promise<T> {
  try {
    return await operation();
  } catch (error: any) {
    if (
      retries > 0 &&
      (error.code === 112 || // WriteConflict
        error.codeName === 'WriteConflict' ||
        error.message?.includes('WriteConflict') ||
        error.message?.includes('write conflict'))
    ) {
      console.warn(
        `WriteConflict detected, retrying... (${retries} attempts left)`
      );
      await new Promise(resolve => setTimeout(resolve, delay));
      return runWithRetry(operation, retries - 1, delay * 2); // Exponential backoff
    }
    throw error;
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not configured');
    return NextResponse.json(
      { error: 'Webhook not configured' },
      { status: 500 }
    );
  }
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const payload = await getPayload({ config: configPromise });

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await runWithRetry(async () => {
          // Find the donation by payment intent ID
          const donations = await payload.find({
            collection: 'donations',
            where: {
              'payment.stripePaymentIntentId': { equals: paymentIntent.id },
            },
            limit: 1,
          });

          if (donations.docs.length > 0) {
            const donation = donations.docs[0];

            // Skip if already completed (idempotency check)
            if (donation.status === 'completed') {
              console.log(`Donation ${donation.id} already completed, skipping webhook processing`);
              return;
            }

            // Update donation status. The Donations afterChange hook will
            // recompute donor totals from completed donations only —
            // do NOT increment donor stats manually here (would double-count).
            await payload.update({
              collection: 'donations',
              id: donation.id,
              data: {
                status: 'completed',
                receiptSent: true, // Stripe sends receipt automatically
              },
            });

            // Appeal statistics are recomputed by the Donations afterChange hook
            // (from completed donations) — no manual increment needed here.

            // Send donation receipt email
            try {
              await sendDonationReceipt({
                donorEmail: donation.donorEmail as string,
                donorName:
                  `${donation.donorFirstName || ''} ${donation.donorLastName || ''}`.trim() ||
                  'Friend',
                amount: donation.amount as number,
                currency: (donation.currency as string) || 'GBP',
                donationType: (donation.donationType as string) || 'general',
                frequency: (donation.frequency as string) || 'one-time',
                giftAidAmount: donation.giftAid?.amount as number | undefined,
                platformFee: donation.platformFee?.amount as number | undefined,
                totalAmount: donation.totalAmount as number,
                donationId: donation.id,
                date: new Date(),
                isRecurring: donation.frequency !== 'one-time',
              });
              console.log(`📧 Receipt email sent to ${donation.donorEmail}`);
            } catch (emailError) {
              console.error('Failed to send receipt email:', emailError);
            }

            // Send admin notification email
            try {
              await sendAdminNotification({
                donorName:
                  `${donation.donorFirstName || ''} ${donation.donorLastName || ''}`.trim() ||
                  'Anonymous',
                donorEmail: donation.donorEmail as string,
                amount: donation.amount as number,
                currency: (donation.currency as string) || 'GBP',
                donationType: (donation.donationType as string) || 'general',
                frequency: (donation.frequency as string) || 'one-time',
                giftAidAmount: donation.giftAid?.amount as number | undefined,
                totalAmount: donation.totalAmount as number,
                donationId: donation.id,
                date: new Date(),
                isRecurring: donation.frequency !== 'one-time',
              });
            } catch (adminEmailError) {
              console.error(
                'Failed to send admin notification:',
                adminEmailError
              );
            }

            console.log(`✅ Donation ${donation.id} completed successfully`);
          }
        });
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        await runWithRetry(async () => {
          const donations = await payload.find({
            collection: 'donations',
            where: {
              'payment.stripePaymentIntentId': { equals: paymentIntent.id },
            },
            limit: 1,
          });

          if (donations.docs.length > 0) {
            await payload.update({
              collection: 'donations',
              id: donations.docs[0].id,
              data: {
                status: 'failed',
                notes: `Payment failed: ${paymentIntent.last_payment_error?.message || 'Unknown error'}`,
              },
            });
            console.log(`❌ Donation ${donations.docs[0].id} payment failed`);
          }
        });
        break;
      }

      case 'invoice.paid': {
        // Handle recurring subscription payments
        const invoice = event.data.object as Stripe.Invoice;
        
        console.log(`📧 invoice.paid event received:`, {
          invoiceId: invoice.id,
          subscription: invoice.subscription,
          amountPaid: invoice.amount_paid,
          customer: invoice.customer,
        });

        if (!invoice.subscription) {
          console.log('⚠️ Invoice has no subscription, skipping');
          break;
        }

        const subscriptionId =
          typeof invoice.subscription === 'string'
            ? invoice.subscription
            : invoice.subscription.id;

        await runWithRetry(async () => {
          // Find donor by subscription
          let donors = await payload.find({
            collection: 'donors',
            where: {
              'activeSubscriptions.stripeSubscriptionId': {
                equals: subscriptionId,
              },
            },
            limit: 1,
          });

          // Fallback: Try finding by Stripe customer ID if subscription lookup fails
          if (donors.docs.length === 0 && invoice.customer) {
            console.log(`⚠️ Donor not found by subscription ${subscriptionId}, trying customer ID...`);
            const customerId = typeof invoice.customer === 'string' 
              ? invoice.customer 
              : invoice.customer.id;
            
            donors = await payload.find({
              collection: 'donors',
              where: {
                stripeCustomerId: { equals: customerId },
              },
              limit: 1,
            });
          }

          if (donors.docs.length === 0) {
            console.error(`❌ Donor not found for subscription ${subscriptionId} or customer ${invoice.customer}`);
            return;
          }

          const donor = donors.docs[0];
          console.log(`✅ Found donor: ${donor.email} (${donor.id})`);

          // Create a new donation record for this payment
          const subscription = donor.activeSubscriptions?.find(
            (s: { stripeSubscriptionId: string }) =>
              s.stripeSubscriptionId === subscriptionId
          );

          if (!subscription) {
            console.error(`❌ Subscription ${subscriptionId} not found in donor's activeSubscriptions`);
            console.log(`   Donor subscriptions:`, JSON.stringify(donor.activeSubscriptions));
          }

          // Create donation record even if subscription metadata not found
          const donationData = {
            amount: (invoice.amount_paid || 0) / 100,
            currency: invoice.currency?.toUpperCase() || 'GBP',
            frequency: subscription?.frequency || 'monthly',
            donationType: subscription?.donationType || 'general',
            donorEmail: donor.email,
            donorFirstName: donor.firstName,
            donorLastName: donor.lastName,
            isAnonymous: donor.preferAnonymous || false,
            payment: {
              method: 'card',
              stripeSubscriptionId: subscriptionId,
              stripePaymentIntentId: invoice.payment_intent as string,
              stripeCustomerId: donor.stripeCustomerId,
            },
            status: 'completed',
            totalAmount: (invoice.amount_paid || 0) / 100,
          };

          console.log(`📝 Creating donation record:`, donationData);

          try {
            // Donor totals get recomputed by the Donations afterChange hook
            // (only completed donations counted), so no manual increment here.
            const newDonation = await payload.create({
              collection: 'donations',
              data: donationData,
            });

            console.log(
              `✅ Recurring donation processed for ${donor.email}: £${(invoice.amount_paid || 0) / 100} (donation ${newDonation.id})`
            );
          } catch (error) {
            console.error(`❌ Failed to create donation record:`, error);
            throw error;
          }
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

        await runWithRetry(async () => {
          const donors = await payload.find({
            collection: 'donors',
            where: {
              'activeSubscriptions.stripeSubscriptionId': {
                equals: subscription.id,
              },
            },
            limit: 1,
          });

          if (donors.docs.length > 0) {
            const donor = donors.docs[0];
            const updatedSubscriptions = donor.activeSubscriptions?.map(
              (s: { stripeSubscriptionId: string }) => {
                if (s.stripeSubscriptionId === subscription.id) {
                  return {
                    ...s,
                    status:
                      subscription.status === 'active'
                        ? 'active'
                        : subscription.status === 'paused'
                          ? 'paused'
                          : 'cancelled',
                    nextPaymentDate: new Date(
                      subscription.current_period_end * 1000
                    ).toISOString(),
                  };
                }
                return s;
              }
            );

            await payload.update({
              collection: 'donors',
              id: donor.id,
              data: { activeSubscriptions: updatedSubscriptions },
            });

            console.log(`📅 Subscription ${subscription.id} updated`);
          }
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

        await runWithRetry(async () => {
          const donors = await payload.find({
            collection: 'donors',
            where: {
              'activeSubscriptions.stripeSubscriptionId': {
                equals: subscription.id,
              },
            },
            limit: 1,
          });

          if (donors.docs.length > 0) {
            const donor = donors.docs[0];
            const updatedSubscriptions = donor.activeSubscriptions?.map(
              (s: { stripeSubscriptionId: string }) => {
                if (s.stripeSubscriptionId === subscription.id) {
                  return { ...s, status: 'cancelled' };
                }
                return s;
              }
            );

            await payload.update({
              collection: 'donors',
              id: donor.id,
              data: { activeSubscriptions: updatedSubscriptions },
            });

            console.log(`❌ Subscription ${subscription.id} cancelled`);
          }
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
