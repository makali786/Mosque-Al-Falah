/**
 * Get Donation Details API
 *
 * GET /api/donations/[id]
 *
 * Fetches donation details by payment intent ID or donation ID
 */

import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const payload = await getPayload({ config: configPromise });

    // Try to find by payment intent ID first
    const donationsByPaymentIntent = await payload.find({
      collection: 'donations' as const,
      where: {
        'payment.stripePaymentIntentId': { equals: id },
      },
      limit: 1,
    });

    let donation = donationsByPaymentIntent.docs[0];

    // If not found, try by donation ID
    if (!donation) {
      try {
        donation = await payload.findByID({
          collection: 'donations' as const,
          id,
        });
      } catch {
        // Not a valid ID, continue
      }
    }

    if (!donation) {
      return NextResponse.json(
        { error: 'Donation not found' },
        { status: 404 }
      );
    }

    // Return sanitized donation data (don't expose sensitive info)
    return NextResponse.json({
      success: true,
      donation: {
        id: donation.id,
        amount: donation.amount,
        currency: donation.currency,
        frequency: donation.frequency,
        donationType: donation.donationType,
        status: donation.status,
        donorFirstName: donation.donorFirstName,
        giftAid: donation.giftAid,
        platformFee: donation.platformFee,
        totalAmount: donation.totalAmount,
        createdAt: donation.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching donation:', error);
    return NextResponse.json(
      { error: 'Failed to fetch donation' },
      { status: 500 }
    );
  }
}
