import { getPayload } from 'payload';
import configPromise from '@payload-config';

/**
 * Fetches recent multiple donations from donors collection and donation statistics
 * @param limit Number of recent donors to fetch
 */
export async function getRecentDonationData(limit: number = 4) {
  try {
    const payload = await getPayload({ config: configPromise });

    // Fetch recent donors (sorted by most recent donation)
    const recentDonors = await payload.find({
      collection: 'donors' as any,
      limit,
      sort: '-lastDonationDate',
    });

    // Fetch all donors to calculate total count
    const allDonors = await payload.find({
      collection: 'donors' as any,
        limit: 10000,
    });

    // Calculate total funds raised from all donors
    const totalFundsRaised = allDonors.docs.reduce(
      (sum: number, donor: any) => sum + (donor.totalDonated || 0),
      0
    );

    // Count active campaigns (donation appeals)
    const campaigns = await payload.find({
      collection: 'donation-appeals' as any,
      where: {
        isActive: {
          equals: true,
        },
      },
    });

    // Format recent donors for display
    const formattedDonors = recentDonors.docs.map((donor: any) => {
      // Calculate time ago from last donation date
      let timeAgo = ''; // Default fallback
      
      if (donor.lastDonationDate) {
        const lastDonation = new Date(donor.lastDonationDate);
        const now = new Date();
        const diffMs = now.getTime() - lastDonation.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) {
          timeAgo = 'just now';
        } else if (diffMins < 60) {
          timeAgo = `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        } else if (diffHours < 24) {
          timeAgo = `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        } else if (diffDays < 30) {
          timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        } else {
          const diffMonths = Math.floor(diffDays / 30);
          timeAgo = `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
        }
      }

      // Get donor name
      const displayName = donor.isAnonymous
        ? 'An Anonymous kind soul'
        : donor.displayName || `${donor.firstName || ''} ${donor.lastName || ''}`.trim() || 'Anonymous Donor';

      // Get last donation amount (or total if last amount not available)
      const lastAmount = donor.lastDonationAmount || donor.totalDonated || 0;

      return {
        id: donor.id,
        name: displayName,
        amount: `£${lastAmount.toFixed(0)} GBP,`,
        time: timeAgo,
        isAnonymous: donor.isAnonymous || false,
      };
    });

    return {
      success: true,
      recentDonors: formattedDonors,
      stats: {
        campaigns: campaigns.totalDocs,
        donors: allDonors.totalDocs,
        fundsRaised: `£${totalFundsRaised.toLocaleString('en-GB', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })}`,
        fundsRaisedRaw: totalFundsRaised,
      },
    };
  } catch (error) {
    console.error('Error fetching recent donations:', error);
    return {
      success: false,
      error: 'Failed to fetch donations',
      recentDonors: [],
      stats: {
        campaigns: 0,
        donors: 0,
        fundsRaised: '£0',
        fundsRaisedRaw: 0,
      },
    };
  }
}
