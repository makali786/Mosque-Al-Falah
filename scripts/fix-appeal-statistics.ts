/**
 * Fix Appeal Statistics Script
 * 
 * This script recalculates all appeal statistics from scratch based on completed donations.
 * It corrects:
 * - currentAmount (total of all completed donations)
 * - totalDonors (unique donors who have completed donations)
 * 
 * Usage: npx tsx scripts/fix-appeal-statistics.ts
 * 
 * WARNING: This modifies live data. Ensure you have a backup first!
 */

import configPromise from '@payload-config';
import { getPayload } from 'payload';

interface AppealStats {
  appealId: string;
  appealTitle: string;
  oldAmount: number;
  newAmount: number;
  oldDonors: number;
  newDonors: number;
  corrections: {
    amount: number;
    donors: number;
  };
}

async function fixAppealStatistics() {
  console.log('🔧 Starting appeal statistics correction...\n');
  console.log('⚠️  Ensure you have a backup before proceeding!\n');

  const payload = await getPayload({ config: configPromise });
  const stats: AppealStats[] = [];
  let updatedCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  try {
    // Fetch all appeals
    console.log('📥 Fetching all donation appeals...');
    const appeals = await payload.find({
      collection: 'donation-appeals',
      limit: 10000,
    });
    console.log(`   ✓ Found ${appeals.docs.length} appeals\n`);

    // Process each appeal
    for (const appeal of appeals.docs) {
      const appealId = appeal.id;
      const appealTitle = appeal.title || 'Untitled Appeal';
      
      console.log(`Processing: ${appealTitle} (${appealId})`);

      try {
        // Get old stats
        const oldAmount = appeal.funding?.currentAmount || 0;
        const oldDonors = appeal.funding?.totalDonors || 0;

        // Fetch all completed donations for this appeal
        const donations = await payload.find({
          collection: 'donations',
          where: {
            and: [
              { appeal: { equals: appealId } },
              { status: { equals: 'completed' } },
            ],
          },
          limit: 10000,
        });

        // Calculate correct statistics
        const newAmount = donations.docs.reduce(
          (sum, d) => sum + (d.amount || 0),
          0
        );

        // Count unique donors (by email)
        const uniqueDonors = new Set(
          donations.docs.map((d) => d.donorEmail)
        );
        const newDonors = uniqueDonors.size;

        const amountDiff = newAmount - oldAmount;
        const donorsDiff = newDonors - oldDonors;

        // Store stats for report
        stats.push({
          appealId,
          appealTitle,
          oldAmount,
          newAmount,
          oldDonors,
          newDonors,
          corrections: {
            amount: amountDiff,
            donors: donorsDiff,
          },
        });

        // Check if update is needed
        const needsUpdate =
          Math.abs(amountDiff) > 0.001 || // Account for floating point
          donorsDiff !== 0;

        if (needsUpdate) {
          console.log(`   ⚠️  Correction needed:`);
          console.log(`      Amount: £${oldAmount.toFixed(2)} → £${newAmount.toFixed(2)} (${amountDiff >= 0 ? '+' : ''}${amountDiff.toFixed(2)})`);
          console.log(`      Donors: ${oldDonors} → ${newDonors} (${donorsDiff >= 0 ? '+' : ''}${donorsDiff})`);

          // Update the appeal
          await payload.update({
            collection: 'donation-appeals',
            id: appealId,
            data: {
              funding: {
                ...appeal.funding,
                currentAmount: newAmount,
                totalDonors: newDonors,
              },
            },
          });

          console.log(`   ✅ Updated successfully\n`);
          updatedCount++;
        } else {
          console.log(`   ✓ Stats are correct, no update needed\n`);
          skippedCount++;
        }
      } catch (error) {
        console.error(`   ❌ Error processing appeal:`, error);
        errorCount++;
      }
    }

    // Print summary report
    console.log('\n' + '='.repeat(60));
    console.log('📊 CORRECTION SUMMARY REPORT');
    console.log('='.repeat(60));
    console.log(`Total appeals processed: ${appeals.docs.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped (no change): ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('\nDetailed Changes:');
    console.log('-'.repeat(60));

    let totalAmountCorrected = 0;
    let totalDonorsCorrected = 0;

    for (const stat of stats) {
      if (stat.corrections.amount !== 0 || stat.corrections.donors !== 0) {
        console.log(`\n${stat.appealTitle}`);
        console.log(`  Amount: £${stat.oldAmount.toFixed(2)} → £${stat.newAmount.toFixed(2)}`);
        console.log(`  Donors: ${stat.oldDonors} → ${stat.newDonors}`);
        totalAmountCorrected += Math.abs(stat.corrections.amount);
        totalDonorsCorrected += Math.abs(stat.corrections.donors);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`Total amount corrected: £${totalAmountCorrected.toFixed(2)}`);
    console.log(`Total donor count corrected: ${totalDonorsCorrected}`);
    console.log('='.repeat(60));

    return {
      success: true,
      stats: {
        total: appeals.docs.length,
        updated: updatedCount,
        skipped: skippedCount,
        errors: errorCount,
        totalAmountCorrected,
        totalDonorsCorrected,
      },
    };

  } catch (error) {
    console.error('\n❌ Script failed:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Run the fix
console.log('\n');
console.log('╔'.padEnd(60, '═') + '╗');
console.log('║' + ' APPEAL STATISTICS CORRECTION TOOL'.padStart(45).padEnd(58) + '║');
console.log('╚'.padEnd(60, '═') + '╝');
console.log('\n');

fixAppealStatistics()
  .then((result) => {
    if (result.success) {
      console.log('\n🎉 Statistics correction completed successfully!');
      process.exit(0);
    } else {
      console.error('\n💥 Statistics correction failed!');
      process.exit(1);
    }
  })
  .catch((error) => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });
