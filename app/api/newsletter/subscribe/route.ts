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
    const { email, source = 'footer', firstName, lastName } = body;

    // Validate email
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Valid email address is required' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existing = await payload.find({
      collection: 'newsletter-subscribers',
      where: {
        email: {
          equals: email.toLowerCase().trim(),
        },
      },
    });

    // If already subscribed
    if (existing.docs.length > 0) {
      const subscriber = existing.docs[0];

      // If previously unsubscribed, reactivate
      if (subscriber.status === 'unsubscribed') {
        await payload.update({
          collection: 'newsletter-subscribers',
          id: subscriber.id,
          data: {
            status: 'active',
            subscribedAt: new Date().toISOString(),
            unsubscribedAt: null,
            unsubscribeReason: null,
            unsubscribeFeedback: null,
          },
        });

        return NextResponse.json({
          success: true,
          message: 'Welcome back! Your subscription has been reactivated.',
          reactivated: true,
        });
      }

      // Already active subscriber
      return NextResponse.json({
        success: true,
        message: 'You are already subscribed to our newsletter!',
        alreadySubscribed: true,
      });
    }

    // Get source details from request
    const userAgent = request.headers.get('user-agent') || '';
    const device = userAgent.match(/mobile/i)
      ? 'mobile'
      : userAgent.match(/tablet/i)
        ? 'tablet'
        : 'desktop';

    const referrer = request.headers.get('referer') || '';
    const ipAddress =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'unknown';

    // Create new subscriber
    const newSubscriber = await payload.create({
      collection: 'newsletter-subscribers',
      data: {
        email: email.toLowerCase().trim(),
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        status: 'active', // Can be 'pending' if using double opt-in
        subscribedAt: new Date().toISOString(),
        source,
        sourceDetails: {
          referrer,
          device,
          ipAddress,
        },
        preferences: {
          receiveWeeklyUpdates: true,
          receiveEventNotifications: true,
          receivePrayerTimeUpdates: false,
          receiveDonationAppeals: true,
          receiveRamadanUpdates: true,
        },
      },
    });

    // Send welcome email
    try {
      const { sendNewsletterWelcomeEmail } =
        await import('@/lib/email/email-service');

      await sendNewsletterWelcomeEmail({
        email: newSubscriber.email,
        firstName: newSubscriber.firstName,
        confirmationToken: newSubscriber.confirmationToken,
      });

      console.log(`✅ Welcome email sent to ${newSubscriber.email}`);
    } catch (emailError) {
      // Log error but don't fail the subscription
      console.error('Failed to send welcome email:', emailError);
      // Subscription still succeeds even if email fails
    }

    return NextResponse.json({
      success: true,
      message:
        'Thank you for subscribing! Check your email for a welcome message from Masjid Al-Falah.',
      subscriber: {
        email: newSubscriber.email,
        confirmationToken: newSubscriber.confirmationToken,
      },
    });
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to subscribe. Please try again later.',
        details: error.message,
      },
      { status: 500 }
    );
  }
};

// GET endpoint to check subscription status
export const GET = async (request: NextRequest) => {
  try {
    const payload = await getPayload({
      config: configPromise,
    });

    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const subscriber = await payload.find({
      collection: 'newsletter-subscribers',
      where: {
        email: {
          equals: email.toLowerCase().trim(),
        },
      },
    });

    if (subscriber.docs.length === 0) {
      return NextResponse.json({
        success: true,
        subscribed: false,
        message: 'Email not found in our newsletter list',
      });
    }

    const sub = subscriber.docs[0];

    return NextResponse.json({
      success: true,
      subscribed: sub.status === 'active',
      status: sub.status,
      subscribedAt: sub.subscribedAt,
    });
  } catch (error: any) {
    console.error('Newsletter status check error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to check subscription status' },
      { status: 500 }
    );
  }
};
