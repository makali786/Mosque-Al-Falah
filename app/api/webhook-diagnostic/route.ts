/**
 * Webhook Diagnostic Endpoint
 * 
 * Use this to verify your webhook configuration is working
 * 
 * GET /api/webhook-diagnostic - Check if env vars are set
 * POST /api/webhook-diagnostic - Simulate webhook
 */

import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const checks = {
    stripeSecretKey: {
      present: !!process.env.STRIPE_SECRET_KEY,
      prefix: process.env.STRIPE_SECRET_KEY?.substring(0, 7) + '...',
      mode: process.env.STRIPE_SECRET_KEY?.startsWith('sk_live_') ? 'LIVE' : 
            process.env.STRIPE_SECRET_KEY?.startsWith('sk_test_') ? 'TEST' : 'UNKNOWN',
    },
    stripeWebhookSecret: {
      present: !!process.env.STRIPE_WEBHOOK_SECRET,
      prefix: process.env.STRIPE_WEBHOOK_SECRET?.substring(0, 7) + '...',
    },
    publishableKey: {
      present: !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
      prefix: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY?.substring(0, 7) + '...',
    },
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  };

  const allConfigured = 
    checks.stripeSecretKey.present && 
    checks.stripeWebhookSecret.present;

  return NextResponse.json({
    status: allConfigured ? 'ok' : 'missing_config',
    checks,
    message: allConfigured 
      ? 'All Stripe configuration looks good!' 
      : 'Missing required environment variables',
  }, { status: allConfigured ? 200 : 500 });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    console.log('🧪 Webhook test received:', {
      timestamp: new Date().toISOString(),
      body,
      headers: {
        'stripe-signature': req.headers.get('stripe-signature')?.substring(0, 20) + '...',
        'content-type': req.headers.get('content-type'),
      },
    });

    return NextResponse.json({
      received: true,
      timestamp: new Date().toISOString(),
      message: 'Webhook test successful - your endpoint is reachable!',
    });
  } catch (error) {
    return NextResponse.json({
      received: true,
      error: 'Could not parse JSON body',
      timestamp: new Date().toISOString(),
    });
  }
}
