import { getPayload } from 'payload';
import configPromise from '@payload-config';

/**
 * Fetches recent multiple donations from donors collection and donation statistics
 * @param limit Number of recent donors to fetch
 */
export async function getRecentDonationData(limit: number = 4) {
  try {
    const payload = await getPayload({ config: configPromise });

    // Fetch recent donations (sorted by most recent)
    const recentDonations = await payload.find({
      collection: 'donations' as any,
      limit,
      sort: '-createdAt',
      where: {
        status: {
          equals: 'completed',
        },
      },
    });

    // Fetch ALL completed donations for accurate stats
    // (pending/failed/refunded/cancelled must NOT contribute to totals)
    const completedDonations = await payload.find({
      collection: 'donations' as any,
      limit: 100000,
      where: {
        status: {
          equals: 'completed',
        },
      },
      pagination: false,
    } as any);

    // Total funds raised = sum of completed donation amounts
    const totalFundsRaised = completedDonations.docs.reduce(
      (sum: number, donation: any) => sum + (donation.amount || 0),
      0
    );

    // Unique donors = distinct donor emails among completed donations
    const uniqueDonorEmails = new Set<string>();
    for (const donation of completedDonations.docs as any[]) {
      if (donation.donorEmail) {
        uniqueDonorEmails.add(String(donation.donorEmail).toLowerCase());
      }
    }
    const totalDonorsCount = uniqueDonorEmails.size;

    // Count active campaigns (donation appeals)
    const campaigns = await payload.find({
      collection: 'donation-appeals' as any,
      where: {
        isActive: {
          equals: true,
        },
      },
    });

    // Format recent donations for display
    const formattedDonors = recentDonations.docs.map((donation: any) => {
      // Calculate time ago from donation date
      let timeAgo = ''; // Default fallback

      if (donation.createdAt) {
        const donationDate = new Date(donation.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - donationDate.getTime();
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
      const displayName = donation.isAnonymous
        ? 'An Anonymous kind soul'
        : donation.displayName || `${donation.donorFirstName || ''} ${donation.donorLastName || ''}`.trim() || 'Anonymous Donor';

      // Get donation amount
      const amount = donation.amount || 0;
      const currency = donation.currency || 'GBP';
      const currencySymbol = currency === 'USD' ? '$' : currency === 'EUR' ? '€' : '£';

      return {
        id: donation.id,
        name: displayName,
        amount: `${currencySymbol}${amount.toFixed(0)} ${currency},`,
        time: timeAgo,
        isAnonymous: donation.isAnonymous || false,
      };
    });

    return {
      success: true,
      recentDonors: formattedDonors,
      stats: {
        campaigns: campaigns.totalDocs,
        donors: totalDonorsCount,
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
