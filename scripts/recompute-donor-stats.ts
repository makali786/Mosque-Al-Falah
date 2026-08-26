/**
 * One-shot backfill: recompute every donor's totalDonated / donationCount /
 * lastDonationDate from COMPLETED donations only.
 *
 * Existing donor rows were populated by an older afterChange hook that summed
 * every donation regardless of status, so pending/failed rows inflated the
 * totals. Run this once after deploying the fix:
 *
 *   yarn tsx scripts/recompute-donor-stats.ts
 */

import configPromise from '@payload-config';
import { getPayload } from 'payload';

async function recomputeDonorStats() {
  const payload = await getPayload({ config: configPromise });

  const donors = await payload.find({
    collection: 'donors' as any,
    limit: 100000,
    pagination: false,
  } as any);

  console.log(`Recomputing stats for ${donors.docs.length} donors...`);

  let updated = 0;
  for (const donor of donors.docs as any[]) {
    const completed = await payload.find({
      collection: 'donations' as any,
      where: {
        and: [
          { donorEmail: { equals: donor.email } },
          { status: { equals: 'completed' } },
        ],
      },
      limit: 1000,
    });

    const totalDonated = completed.docs.reduce(
      (sum: number, d: any) => sum + (d.amount || 0),
      0
    );
    const donationCount = completed.docs.length;
    const sorted = [...completed.docs].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const lastDonationDate = (sorted[0] as any)?.createdAt || null;

    if (
      donor.totalDonated !== totalDonated ||
      donor.donationCount !== donationCount
    ) {
      await payload.update({
        collection: 'donors' as any,
        id: donor.id,
        data: {
          totalDonated,
          donationCount,
          lastDonationDate,
        },
      });
      updated += 1;
      console.log(
        `  ${donor.email}: totalDonated £${donor.totalDonated ?? 0} → £${totalDonated}, count ${donor.donationCount ?? 0} → ${donationCount}`
      );
    }
  }

  console.log(`Done. Updated ${updated}/${donors.docs.length} donors.`);
  process.exit(0);
}

recomputeDonorStats().catch(err => {
  console.error('Backfill failed:', err);
  process.exit(1);
});
