/**
 * Subscription Diagnostic Script
 * 
 * This script checks:
 * 1. All active subscriptions in donor records
 * 2. Missing subscription data
 * 3. Orphaned subscriptions (subscriptions in Stripe but not in donor records)
 * 
 * Usage: npx tsx scripts/diagnose-subscriptions.ts
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();

import configPromise from '@payload-config';
import { getPayload } from 'payload';
import Stripe from 'stripe';

// Lazy initialization to avoid build-time errors when env vars aren't available
let stripe: Stripe | null = null;

function getStripe(): Stripe {
  if (!stripe) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured');
    }
    stripe = new Stripe(secretKey, {
      apiVersion: '2024-12-18.acacia',
    });
  }
  return stripe;
}

async function diagnoseSubscriptions() {
  console.log('🔍 Subscription Diagnostic Tool\n');

  try {
    const payload = await getPayload({ config: configPromise });

    // Fetch all donors with subscriptions
    console.log('📥 Fetching donors with active subscriptions...');
    const donors = await payload.find({
      collection: 'donors',
      limit: 10000,
    });

    const donorsWithSubscriptions = donors.docs.filter(
      (d: any) => d.activeSubscriptions && d.activeSubscriptions.length > 0
    );

    console.log(`   Found ${donorsWithSubscriptions.length} donors with subscriptions\n`);

    // List all subscriptions in donor records
    console.log('📋 Subscriptions in Donor Records:');
    console.log('=' .repeat(80));

    const subscriptionIds: string[] = [];

    for (const donor of donorsWithSubscriptions) {
      console.log(`\n👤 ${donor.email} (${donor.id})`);
      console.log(`   Stripe Customer: ${donor.stripeCustomerId || 'NOT SET'}`);
      console.log(`   Total Donated: £${donor.totalDonated || 0}`);
      console.log(`   Donation Count: ${donor.donationCount || 0}`);
      
      if (donor.activeSubscriptions) {
        for (const sub of donor.activeSubscriptions) {
          console.log(`   📌 Subscription:`);
          console.log(`      ID: ${sub.stripeSubscriptionId}`);
          console.log(`      Type: ${sub.donationType}`);
          console.log(`      Frequency: ${sub.frequency}`);
          console.log(`      Amount: £${sub.amount}`);
          console.log(`      Status: ${sub.status}`);
          console.log(`      Next Payment: ${sub.nextPaymentDate}`);
          subscriptionIds.push(sub.stripeSubscriptionId);
        }
      }
    }

    // Check for recent donations with subscription IDs
    console.log('\n\n📊 Recent Subscription Donations (last 30 days):');
    console.log('=' .repeat(80));

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentDonations = await payload.find({
      collection: 'donations',
      where: {
        and: [
          { 'payment.stripeSubscriptionId': { exists: true } },
          { createdAt: { greater_than: thirtyDaysAgo.toISOString() } },
        ],
      },
      limit: 100,
      sort: '-createdAt',
    });

    if (recentDonations.docs.length === 0) {
      console.log('   No subscription donations found in the last 30 days');
    } else {
      for (const donation of recentDonations.docs) {
        console.log(`\n   💰 £${donation.amount} - ${donation.donorEmail}`);
        console.log(`      Date: ${donation.createdAt}`);
        console.log(`      Subscription: ${donation.payment?.stripeSubscriptionId}`);
        console.log(`      Status: ${donation.status}`);
      }
    }

    // Check Stripe for subscription statuses
    console.log('\n\n🔎 Checking Stripe Subscription Statuses:');
    console.log('=' .repeat(80));

    for (const subId of subscriptionIds) {
      try {
        const stripeSub = await getStripe().subscriptions.retrieve(subId);
        console.log(`\n   ${subId}:`);
        console.log(`      Stripe Status: ${stripeSub.status}`);
        console.log(`      Current Period End: ${new Date(stripeSub.current_period_end * 1000).toISOString()}`);
        console.log(`      Cancel At Period End: ${stripeSub.cancel_at_period_end}`);
        
        // Check for recent invoices
        const invoices = await getStripe().invoices.list({
          subscription: subId,
          limit: 3,
        });
        
        console.log(`      Recent Invoices:`);
        for (const invoice of invoices.data) {
          console.log(`        - ${invoice.id}: £${invoice.amount_paid / 100} (${invoice.status}) on ${new Date(invoice.created * 1000).toISOString()}`);
        }
      } catch (error: any) {
        console.log(`\n   ${subId}: ❌ Error - ${error.message}`);
      }
    }

    // Summary
    console.log('\n\n📈 Summary:');
    console.log('=' .repeat(80));
    console.log(`Total donors: ${donors.totalDocs}`);
    console.log(`Donors with subscriptions: ${donorsWithSubscriptions.length}`);
    console.log(`Active subscription records: ${subscriptionIds.length}`);
    console.log(`Recent subscription donations: ${recentDonations.docs.length}`);

    // Potential Issues
    console.log('\n\n⚠️  Potential Issues:');
    console.log('=' .repeat(80));

    let issueCount = 0;

    // Check for donors without stripeCustomerId
    const donorsWithoutCustomerId = donorsWithSubscriptions.filter(
      (d: any) => !d.stripeCustomerId
    );
    if (donorsWithoutCustomerId.length > 0) {
      console.log(`\n${donorsWithoutCustomerId.length} donors have subscriptions but no stripeCustomerId:`);
      for (const donor of donorsWithoutCustomerId) {
        console.log(`  - ${donor.email}`);
      }
      issueCount++;
    }

    // Check for subscriptions without stripeSubscriptionId in payment
    const donationsWithoutSubId = await payload.find({
      collection: 'donations',
      where: {
        and: [
          { frequency: { not_equals: 'one-time' } },
          { 'payment.stripeSubscriptionId': { exists: false } },
        ],
      },
      limit: 10,
    });

    if (donationsWithoutSubId.docs.length > 0) {
      console.log(`\n${donationsWithoutSubId.docs.length} recurring donations missing stripeSubscriptionId`);
      issueCount++;
    }

    if (issueCount === 0) {
      console.log('   No obvious issues found! ✓');
    }

  } catch (error) {
    console.error('\n❌ Diagnostic failed:', error);
    process.exit(1);
  }
}

diagnoseSubscriptions()
  .then(() => {
    console.log('\n✅ Diagnostic complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });
