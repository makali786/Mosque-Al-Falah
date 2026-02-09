import configPromise from '@payload-config';
import { NextResponse } from 'next/server';
import { getPayload } from 'payload';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getPayload({ config: configPromise });

    const donations = await payload.find({
      collection: 'donations',
      where: {
        status: {
          equals: 'completed',
        },
      },
      sort: '-createdAt',
      limit: 1,
    });

    if (donations.docs.length === 0) {
      return NextResponse.json(null);
    }

    const latestDonation = donations.docs[0];

    // Extract only necessary public info
    const publicData = {
      id: latestDonation.id,
      amount: latestDonation.amount,
      currency: latestDonation.currency,
      donationType: latestDonation.donationType,
      city: latestDonation.address?.city || 'London',
      country:
        latestDonation.address?.country === 'GB'
          ? 'United Kingdom'
          : latestDonation.address?.country || 'United Kingdom',
      timestamp: latestDonation.createdAt,
    };

    return NextResponse.json(publicData);
  } catch (error) {
    console.error('Error fetching latest donation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch latest donation' },
      { status: 500 }
    );
  }
}
