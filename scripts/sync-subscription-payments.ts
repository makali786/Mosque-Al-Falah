/**
 * Sync Subscription Payments Script
 * 
 * This script checks Stripe for subscription invoices that may have been paid
 * but not recorded in the database, and creates the missing donation records.
 * 
 * Usage: npx tsx scripts/sync-subscription-payments.ts
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();

import configPromise from '@payload-config';
import { getPayload } from 'payload';
import Stripe from 'stripe';

// Lazy initialization
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      console.error('❌ STRIPE_SECRET_KEY is not set in environment');
      console.log('Current env vars:', Object.keys(process.env).filter(k => k.includes('STRIPE')));
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    console.log(`🔑 Using Stripe key: ${secretKey.substring(0, 7)}... (${secretKey.startsWith('sk_live_') ? 'LIVE' : 'TEST'})`);
    stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }
  return stripe;
}

async function syncSubscriptionPayments() {
  console.log('🔄 Subscription Payment Sync Tool\n');

  try {
    const payload = await getPayload({ config: configPromise });

    // Fetch all donors with subscriptions
    console.log('📥 Fetching donors with subscriptions...');
    const donorsResult = await payload.find({
      collection: 'donors',
      limit: 10000,
    });

    const donorsWithSubs = donorsResult.docs.filter(
      (d: any) => d.activeSubscriptions && d.activeSubscriptions.length > 0
    );

    console.log(`   Found ${donorsWithSubs.length} donors with subscriptions\n`);

    let totalInvoicesChecked = 0;
    let totalMissingPayments = 0;
    let totalSynced = 0;

    // Process each donor
    for (const donor of donorsWithSubs) {
      console.log(`👤 Checking ${donor.email}...`);

      if (!donor.stripeCustomerId) {
        console.log('   ⚠️ No stripeCustomerId, skipping');
        continue;
      }

      // Get all invoices for this customer
      const invoices = await getStripe().invoices.list({
        customer: donor.stripeCustomerId,
        limit: 100,
      });

      console.log(`   📄 Found ${invoices.data.length} invoices`);

      for (const invoice of invoices.data) {
        // Only process paid invoices with subscriptions
        if (invoice.status !== 'paid' || !invoice.subscription) {
          continue;
        }

        totalInvoicesChecked++;

        const subscriptionId = typeof invoice.subscription === 'string'
          ? invoice.subscription
          : invoice.subscription.id;

        // Check if this invoice is already recorded as a donation
        const existingDonations = await payload.find({
          collection: 'donations',
          where: {
            and: [
              { 'payment.stripeSubscriptionId': { equals: subscriptionId } },
              { createdAt: { greater_than: new Date(invoice.created * 1000 - 60000).toISOString() } },
              { createdAt: { less_than: new Date(invoice.created * 1000 + 60000).toISOString() } },
            ],
          },
          limit: 1,
        });

        if (existingDonations.docs.length > 0) {
          // Already recorded
          continue;
        }

        // Missing donation record!
        totalMissingPayments++;
        const amount = (invoice.amount_paid || 0) / 100;

        console.log(`\n   ❌ Missing payment detected:`);
        console.log(`      Invoice: ${invoice.id}`);
        console.log(`      Subscription: ${subscriptionId}`);
        console.log(`      Amount: £${amount}`);
        console.log(`      Date: ${new Date(invoice.created * 1000).toISOString()}`);

        // Find subscription details
        const subDetails = donor.activeSubscriptions?.find(
          (s: any) => s.stripeSubscriptionId === subscriptionId
        );

        // Create the missing donation record
        try {
          const newDonation = await payload.create({
            collection: 'donations',
            data: {
              amount: amount,
              currency: invoice.currency?.toUpperCase() || 'GBP',
              frequency: subDetails?.frequency || 'monthly',
              donationType: subDetails?.donationType || 'general',
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
              totalAmount: amount,
              createdAt: new Date(invoice.created * 1000).toISOString(),
            },
          });

          // Update donor statistics
          await payload.update({
            collection: 'donors',
            id: donor.id,
            data: {
              totalDonated: (donor.totalDonated || 0) + amount,
              donationCount: (donor.donationCount || 0) + 1,
              lastDonationDate: new Date(invoice.created * 1000).toISOString(),
            },
          });

          console.log(`   ✅ Created donation record: ${newDonation.id}`);
          totalSynced++;

        } catch (error: any) {
          console.error(`   ❌ Failed to create donation:`, error.message);
        }
      }

      console.log('');
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SYNC SUMMARY');
    console.log('='.repeat(60));
    console.log(`Invoices checked: ${totalInvoicesChecked}`);
    console.log(`Missing payments found: ${totalMissingPayments}`);
    console.log(`Payments synced: ${totalSynced}`);

    if (totalMissingPayments === 0) {
      console.log('\n✅ All subscription payments are up to date!');
    } else {
      console.log(`\n⚠️  Synced ${totalSynced} missing payments`);
    }

  } catch (error) {
    console.error('\n❌ Sync failed:', error);
    process.exit(1);
  }
}

syncSubscriptionPayments()
  .then(() => {
    console.log('\n✅ Sync complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });
