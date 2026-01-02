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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const payload = await getPayload({ config: configPromise });

  try {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

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

          // Update donation status
          await payload.update({
            collection: 'donations',
            id: donation.id,
            data: {
              status: 'completed',
              receiptSent: true, // Stripe sends receipt automatically
            },
          });

          // Update donor statistics
          const donors = await payload.find({
            collection: 'donors',
            where: { email: { equals: donation.donorEmail } },
            limit: 1,
          });

          if (donors.docs.length > 0) {
            const donor = donors.docs[0];
            await payload.update({
              collection: 'donors',
              id: donor.id,
              data: {
                totalDonated:
                  (donor.totalDonated || 0) + (donation.amount || 0),
                donationCount: (donor.donationCount || 0) + 1,
                lastDonationDate: new Date().toISOString(),
              },
            });
          }

          // Update appeal statistics if linked
          if (donation.appeal) {
            const appealId =
              typeof donation.appeal === 'string'
                ? donation.appeal
                : donation.appeal.id;
            const appeal = await payload.findByID({
              collection: 'donation-appeals',
              id: appealId,
            });

            if (appeal) {
              await payload.update({
                collection: 'donation-appeals',
                id: appealId,
                data: {
                  funding: {
                    ...appeal.funding,
                    currentAmount:
                      (appeal.funding?.currentAmount || 0) +
                      (donation.amount || 0),
                    totalDonors: (appeal.funding?.totalDonors || 0) + 1,
                  },
                },
              });
            }
          }

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

          console.log(`✅ Donation ${donation.id} completed successfully`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

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
        break;
      }

      case 'invoice.paid': {
        // Handle recurring subscription payments
        const invoice = event.data.object as Stripe.Invoice;

        if (invoice.subscription) {
          const subscriptionId =
            typeof invoice.subscription === 'string'
              ? invoice.subscription
              : invoice.subscription.id;

          // Find donor by subscription
          const donors = await payload.find({
            collection: 'donors',
            where: {
              'activeSubscriptions.stripeSubscriptionId': {
                equals: subscriptionId,
              },
            },
            limit: 1,
          });

          if (donors.docs.length > 0) {
            const donor = donors.docs[0];

            // Create a new donation record for this payment
            const subscription = donor.activeSubscriptions?.find(
              (s: { stripeSubscriptionId: string }) =>
                s.stripeSubscriptionId === subscriptionId
            );

            if (subscription) {
              await payload.create({
                collection: 'donations',
                data: {
                  amount: (invoice.amount_paid || 0) / 100,
                  currency: invoice.currency?.toUpperCase() || 'GBP',
                  frequency: subscription.frequency,
                  donationType: subscription.donationType,
                  donorEmail: donor.email,
                  donorFirstName: donor.firstName,
                  donorLastName: donor.lastName,
                  payment: {
                    method: 'card',
                    stripeSubscriptionId: subscriptionId,
                    stripePaymentIntentId: invoice.payment_intent as string,
                    stripeCustomerId: donor.stripeCustomerId,
                  },
                  status: 'completed',
                  totalAmount: (invoice.amount_paid || 0) / 100,
                },
              });

              // Update donor statistics
              await payload.update({
                collection: 'donors',
                id: donor.id,
                data: {
                  totalDonated:
                    (donor.totalDonated || 0) +
                    (invoice.amount_paid || 0) / 100,
                  donationCount: (donor.donationCount || 0) + 1,
                  lastDonationDate: new Date().toISOString(),
                },
              });

              console.log(`✅ Recurring donation processed for ${donor.email}`);
            }
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;

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
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;

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
