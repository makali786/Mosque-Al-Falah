import configPromise from '@payload-config';
import { NextRequest, NextResponse } from 'next/server';
import { getPayload } from 'payload';

export const POST = async (request: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    // Parse request body
    const body = await request.json();
    const { email, token, reason, feedback } = body;

    // Validate input
    if (!email && !token) {
      return NextResponse.json(
        { success: false, error: 'Email or token is required' },
        { status: 400 }
      );
    }

    // Find subscriber by email or token
    const whereClause = token
      ? { confirmationToken: { equals: token } }
      : { email: { equals: email.toLowerCase().trim() } };

    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: whereClause,
    });

    if (existing.docs.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Subscriber not found' },
        { status: 404 }
      );
    }

    const subscriber = existing.docs[0];

    // Update subscriber status to unsubscribed
    await payload.update({
      collection: 'newsletter-subscribers',
      id: subscriber.id,
      data: {
        status: 'unsubscribed',
        unsubscribedAt: new Date().toISOString(),
        unsubscribeReason: reason || undefined,
        unsubscribeFeedback: feedback || undefined,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter.',
    });
  } catch (error: any) {
    console.error('Newsletter unsubscribe error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to unsubscribe. Please try again later.',
        details: error.message,
      },
      { status: 500 }
    );
  }
};
