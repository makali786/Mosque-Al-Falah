/**
 * Confirm Donation Payment
 * 
 * POST /api/donations/confirm-payment
 * 
 * Called when user returns to the complete page after successful payment.
 * Updates donation status and appeal statistics.
 */

import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';
import Stripe from 'stripe';

// Lazy initialization
let stripe: Stripe | null = null;

function getStripe(): Stripe {
    if (!stripe) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not configured');
        }
        stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2024-12-18.acacia' as Stripe.LatestApiVersion,
        });
    }
    return stripe;
}

export async function POST(req: NextRequest) {
    try {
        const { paymentIntentId } = await req.json();

        if (!paymentIntentId) {
            return NextResponse.json(
                { error: 'Payment intent ID is required' },
                { status: 400 }
            );
        }

        const stripeClient = getStripe();
        const payload = await getPayload({ config: configPromise });

        // Retrieve the payment intent from Stripe
        const paymentIntent = await stripeClient.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return NextResponse.json(
                { error: 'Payment has not succeeded', status: paymentIntent.status },
                { status: 400 }
            );
        }

        console.log('Confirming payment for intent:', paymentIntentId);

        // Find the donation by Stripe payment intent ID
        // Try with nested field query first
        let donations = await payload.find({
            collection: 'donations' as any,
            where: {
                'payment.stripePaymentIntentId': {
                    equals: paymentIntentId,
                },
            },
            limit: 1,
        });

        console.log('Found donations with nested query:', donations.docs.length);

        // If not found, try getting recent donations and filter manually
        if (donations.docs.length === 0) {
            console.log('Trying fallback query...');
            const recentDonations = await payload.find({
                collection: 'donations' as any,
                limit: 50,
                sort: '-createdAt',
            });

            const matchingDonation = recentDonations.docs.find((d: any) =>
                d.payment?.stripePaymentIntentId === paymentIntentId
            );

            if (matchingDonation) {
                donations = { docs: [matchingDonation], totalDocs: 1, totalPages: 1, page: 1, pagingCounter: 1, hasPrevPage: false, hasNextPage: false, prevPage: null, nextPage: null, limit: 1 };
                console.log('Found donation with fallback query:', matchingDonation.id);
            }
        }

        if (donations.docs.length === 0) {
            console.log('Donation not found for payment intent:', paymentIntentId);
            return NextResponse.json(
                { error: 'Donation not found' },
                { status: 404 }
            );
        }

        const donation = donations.docs[0] as any;

        // Only update if not already completed
        if (donation.status === 'completed') {
            return NextResponse.json({
                success: true,
                message: 'Donation already confirmed',
                donationId: donation.id,
            });
        }

        // Update donation status to succeeded
        await payload.update({
            collection: 'donations' as any,
            id: donation.id,
            data: {
                status: 'completed',
            },
        });

        // Update appeal statistics if appeal is linked
        if (donation.appeal) {
            const appealId = typeof donation.appeal === 'string'
                ? donation.appeal
                : donation.appeal.id;

            try {
                // Get current appeal data
                const appeal = await payload.findByID({
                    collection: 'donation-appeals' as any,
                    id: appealId,
                }) as any;

                if (appeal) {
                    const currentAmount = appeal.funding?.currentAmount || 0;
                    const totalDonors = appeal.funding?.totalDonors || 0;
                    const donationAmount = donation.amount || 0;

                    // Update appeal with new totals
                    await payload.update({
                        collection: 'donation-appeals' as any,
                        id: appealId,
                        data: {
                            funding: {
                                ...appeal.funding,
                                currentAmount: currentAmount + donationAmount,
                                totalDonors: totalDonors + 1,
                            },
                        },
                    });

                    console.log(`Updated appeal ${appealId}: currentAmount=${currentAmount + donationAmount}, totalDonors=${totalDonors + 1}`);
                }
            } catch (error) {
                console.error('Error updating appeal:', error);
                // Don't fail the whole request if appeal update fails
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Donation confirmed successfully',
            donationId: donation.id,
        });

    } catch (error) {
        console.error('Confirm payment error:', error);
        return NextResponse.json(
            { error: 'Failed to confirm payment' },
            { status: 500 }
        );
    }
}
