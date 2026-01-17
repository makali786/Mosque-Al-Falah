/**
 * Stripe Donation API - Create Payment Intent or Subscription
 *
 * POST /api/donations/create-payment
 */

import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import Stripe from 'stripe';

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

interface DonationRequest {
  amount: number; // in pence/cents
  currency: string;
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  donationType: string;
  appealId?: string;

  // Donor info
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isAnonymous?: boolean;
  displayName?: string;

  // Address
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    postcode?: string;
    country?: string;
  };

  // Gift Aid
  giftAid?: boolean;

  // Platform fee
  platformFeePercentage?: number;

  // Marketing
  marketingConsent?: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const body: DonationRequest = await req.json();

    const {
      amount,
      currency = 'gbp',
      frequency,
      donationType,
      appealId,
      email,
      firstName,
      lastName,
      phone,
      isAnonymous,
      displayName,
      address,
      giftAid,
      platformFeePercentage,
      marketingConsent,
    } = body;

    // Validate required fields
    if (!amount || !email) {
      return NextResponse.json(
        { error: 'Amount and email are required' },
        { status: 400 }
      );
    }

    const payload = await getPayload({ config: configPromise });

    // Find or create donor
    let donor;
    const existingDonors = await payload.find({
      collection: 'donors',
      where: { email: { equals: email } },
      limit: 1,
    });

    if (existingDonors.docs.length > 0) {
      donor = existingDonors.docs[0];
    } else {
      // Create new donor
      donor = await payload.create({
        collection: 'donors',
        data: {
          email,
          firstName,
          lastName,
          phone,
          displayName:
            displayName ||
            (isAnonymous ? 'Anonymous kind soul' : `${firstName} ${lastName}`),
          preferAnonymous: isAnonymous,
          address,
          giftAidEligible: giftAid,
          giftAidDeclarationDate: giftAid
            ? new Date().toISOString()
            : undefined,
          marketingConsent,
        },
      });
    }

    // Create or get Stripe customer
    let stripeCustomerId = donor.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await getStripe().customers.create({
        email,
        name: `${firstName || ''} ${lastName || ''}`.trim() || undefined,
        phone,
        address: address
          ? {
              line1: address.line1,
              line2: address.line2,
              city: address.city,
              postal_code: address.postcode,
              country: address.country,
            }
          : undefined,
        metadata: {
          donorId: donor.id,
        },
      });
      stripeCustomerId = customer.id;

      // Update donor with Stripe customer ID
      await payload.update({
        collection: 'donors',
        id: donor.id,
        data: { stripeCustomerId },
      });
    }

    // Calculate amounts
    const donationAmount = amount; // Already in pence/cents
    const platformFee = platformFeePercentage
      ? Math.round(donationAmount * (platformFeePercentage / 100))
      : 0;
    const totalAmount = donationAmount + platformFee;
    const giftAidAmount = giftAid ? Math.round(donationAmount * 0.25) : 0;

    // One-time donation - Create Payment Intent
    if (frequency === 'one-time') {
      const paymentIntent = await getStripe().paymentIntents.create({
        amount: totalAmount,
        currency: currency.toLowerCase(),
        customer: stripeCustomerId,
        metadata: {
          donorId: donor.id,
          donationType,
          appealId: appealId || '',
          giftAid: giftAid ? 'true' : 'false',
          giftAidAmount: giftAidAmount.toString(),
          platformFee: platformFee.toString(),
          frequency: 'one-time',
        },
        receipt_email: email,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      // Create donation record
      const donation = await payload.create({
        collection: 'donations',
        data: {
          amount: donationAmount / 100, // Convert to pounds
          currency: currency.toUpperCase(),
          frequency: 'one-time',
          donationType,
          appeal: appealId || undefined,
          donorEmail: email,
          donorFirstName: firstName,
          donorLastName: lastName,
          donorPhone: phone,
          isAnonymous,
          displayName,
          address,
          giftAid: {
            enabled: giftAid,
            amount: giftAidAmount / 100,
            declaration: giftAid,
          },
          platformFee: {
            enabled: platformFee > 0,
            percentage: platformFeePercentage,
            amount: platformFee / 100,
          },
          payment: {
            method: 'card',
            stripePaymentIntentId: paymentIntent.id,
            stripeCustomerId,
          },
          status: 'pending',
          totalAmount: totalAmount / 100,
          marketingConsent,
        },
      });

      return NextResponse.json({
        success: true,
        type: 'payment_intent',
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        donationId: donation.id,
        amounts: {
          donation: donationAmount / 100,
          platformFee: platformFee / 100,
          giftAid: giftAidAmount / 100,
          total: totalAmount / 100,
        },
      });
    }

    // Recurring donation - Create Subscription
    const intervalMap: Record<
      string,
      { interval: 'week' | 'month' | 'year'; count: number }
    > = {
      weekly: { interval: 'week', count: 1 },
      monthly: { interval: 'month', count: 1 },
      quarterly: { interval: 'month', count: 3 },
      yearly: { interval: 'year', count: 1 },
    };

    const subscriptionInterval = intervalMap[frequency];

    // Check for duplicate active subscription
    if (donor.activeSubscriptions) {
      const duplicate = donor.activeSubscriptions.find(
        (sub: any) =>
          sub.status === 'active' &&
          sub.donationType === donationType &&
          sub.frequency === frequency
      );

      if (duplicate) {
        return NextResponse.json(
          {
            error: 'Duplicate subscription',
            details: `You already have an active ${frequency} subscription for ${donationType}.`,
          },
          { status: 400 }
        );
      }
    }

    // Create a price for this subscription
    const price = await getStripe().prices.create({
      unit_amount: totalAmount,
      currency: currency.toLowerCase(),
      recurring: {
        interval: subscriptionInterval.interval,
        interval_count: subscriptionInterval.count,
      },
      product_data: {
        name: `${donationType} - ${frequency} donation`,
        metadata: {
          donationType,
          appealId: appealId || '',
        },
      },
    });

    // Create subscription
    const subscription = await getStripe().subscriptions.create({
      customer: stripeCustomerId,
      items: [{ price: price.id }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      metadata: {
        donorId: donor.id,
        donationType,
        appealId: appealId || '',
        giftAid: giftAid ? 'true' : 'false',
        frequency,
      },
      expand: ['latest_invoice.payment_intent'],
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let invoice = subscription.latest_invoice as any;
    let clientSecret = null;
    let paymentIntentId = null;

    // 1. Try to get data from the subscription response
    if (invoice && typeof invoice === 'object') {
      if (invoice.payment_intent) {
        if (typeof invoice.payment_intent === 'object') {
          // It's expanded
          clientSecret = invoice.payment_intent.client_secret;
          paymentIntentId = invoice.payment_intent.id;
        } else {
          // It's just an ID
          paymentIntentId = invoice.payment_intent;
        }
      }
    } else if (typeof invoice === 'string') {
      // It's just an ID
      // We'll need to fetch it
    }

    // 2. If we don't have the secret but have PI ID, fetch PI
    if (!clientSecret && paymentIntentId) {
      try {
        const pi = await getStripe().paymentIntents.retrieve(paymentIntentId);
        clientSecret = pi.client_secret;
      } catch (err) {
        console.error('Error fetching PaymentIntent:', err);
      }
    }

    // 3. If we still don't have secret but have Invoice ID (object or string), fetch Invoice
    if (!clientSecret) {
      const invoiceId = typeof invoice === 'string' ? invoice : invoice?.id;
      if (invoiceId) {
        try {
          const fullInvoice = await getStripe().invoices.retrieve(invoiceId, {
            expand: ['payment_intent'],
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const pi = fullInvoice.payment_intent as any;

          if (pi && typeof pi === 'object') {
            clientSecret = pi.client_secret;
            paymentIntentId = pi.id;
          } else if (pi && typeof pi === 'string') {
            // Rare case: PI is still not expanded? Fetch PI directly
            const fetchedPi = await getStripe().paymentIntents.retrieve(pi);
            clientSecret = fetchedPi.client_secret;
          }
        } catch (err) {
          console.error('Error fetching Invoice:', err);
        }
      }
    }

    if (!clientSecret) {
      console.error('CRITICAL: Failed to retrieve client_secret');
      return NextResponse.json(
        {
          error: 'Failed to get payment client secret from Stripe',
          details: 'The subscription was created but payment setup failed',
        },
        { status: 500 }
      );
    }

    // Create donation record
    const donation = await payload.create({
      collection: 'donations',
      data: {
        amount: donationAmount / 100,
        currency: currency.toUpperCase(),
        frequency,
        donationType,
        appeal: appealId || undefined,
        donorEmail: email,
        donorFirstName: firstName,
        donorLastName: lastName,
        donorPhone: phone,
        isAnonymous,
        displayName,
        address,
        giftAid: {
          enabled: giftAid,
          amount: giftAidAmount / 100,
          declaration: giftAid,
        },
        platformFee: {
          enabled: platformFee > 0,
          percentage: platformFeePercentage,
          amount: platformFee / 100,
        },
        payment: {
          method: 'card',
          stripeSubscriptionId: subscription.id,
          stripePaymentIntentId: paymentIntentId,
          stripeCustomerId,
        },
        status: 'pending',
        totalAmount: totalAmount / 100,
        marketingConsent,
      },
    });

    // Update donor with active subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const periodEnd = (subscription as any).current_period_end;
    await payload.update({
      collection: 'donors',
      id: donor.id,
      data: {
        activeSubscriptions: [
          ...(donor.activeSubscriptions || []),
          {
            stripeSubscriptionId: subscription.id,
            amount: donationAmount / 100,
            frequency,
            donationType,
            status: 'active',
            nextPaymentDate:
              periodEnd && !isNaN(periodEnd)
                ? new Date(periodEnd * 1000).toISOString()
                : new Date().toISOString(),
          },
        ],
      },
    });

    // If no clientSecret, we need to handle this
    if (!clientSecret) {
      return NextResponse.json(
        {
          error: 'Failed to get payment client secret from Stripe',
          details: 'The subscription was created but payment setup failed',
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      type: 'subscription',
      clientSecret: clientSecret,
      subscriptionId: subscription.id,
      donationId: donation.id,
      amounts: {
        donation: donationAmount / 100,
        platformFee: platformFee / 100,
        giftAid: giftAidAmount / 100,
        total: totalAmount / 100,
      },
    });
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json(
      {
        error: 'Failed to process donation',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
