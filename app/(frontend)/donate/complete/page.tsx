'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function DonationCompleteContent() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'success' | 'processing' | 'error'>(
    'processing'
  );
  const [confirming, setConfirming] = useState(false);
  const paymentIntent = searchParams.get('payment_intent');

  useEffect(() => {
    if (!paymentIntent) {
      setStatus('error');
      return;
    }

    // The payment was successful if we reached this page
    // Stripe redirects here with payment_intent and payment_intent_client_secret
    const redirectStatus = searchParams.get('redirect_status');

    if (redirectStatus === 'succeeded') {
      // Call API to update donation status and appeal stats
      const confirmPayment = async () => {
        if (confirming) return;
        setConfirming(true);

        try {
          const response = await fetch('/api/donations/confirm-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: paymentIntent }),
          });

          if (!response.ok) {
            console.error('Failed to confirm payment:', await response.json());
          } else {
            console.log('Payment confirmed successfully');
            // Tell any mounted listeners (footer stats, etc.) to refetch
            if (typeof window !== 'undefined') {
              window.dispatchEvent(new Event('donation-completed'));
            }
          }
        } catch (error) {
          console.error('Error confirming payment:', error);
        }

        setStatus('success');
      };

      confirmPayment();
    } else if (redirectStatus === 'processing') {
      setStatus('processing');
    } else {
      setStatus('error');
    }
  }, [paymentIntent, searchParams, confirming]);

  if (status === 'processing') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-6">⏳</div>
          <h1 className="text-2xl font-bold mb-4">
            Processing your donation...
          </h1>
          <p className="text-gray-600">
            Please wait while we confirm your payment.
          </p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="text-6xl mb-6">❌</div>
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="text-gray-600 mb-8">
            We couldn&apos;t process your donation. Please try again or contact
            us for assistance.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/donate"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Success Header */}
      <div className="bg-green-50 py-4 text-center">
        <div className="flex items-center justify-center gap-2 text-green-700">
          <span className="text-2xl">✓</span>
          <span className="font-medium">Payment Successful</span>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6 text-center">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl">🎉</span>
        </div>

        <h1 className="text-3xl font-bold mb-4">JazakAllahu Khairan!</h1>
        <h2 className="text-xl text-gray-600 mb-8">
          Thank you for your generous donation
        </h2>

        <p className="text-gray-600 mb-8">
          Your donation has been processed successfully and will make a real
          difference in our community. May Allah reward you abundantly for your
          generosity.
        </p>

        {/* Receipt Info */}
        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h3 className="font-bold mb-4">What happens next?</h3>
          <ul className="text-left space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <span>A receipt has been sent to your email address</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                Your donation will be used according to your specified purpose
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 mt-1">✓</span>
              <span>
                If you enabled Gift Aid, we&apos;ll claim an extra 25% from HMRC
              </span>
            </li>
          </ul>
        </div>

        {/* Hadith Quote */}
        <div className="bg-blue-50 rounded-lg p-6 mb-8">
          <p className="text-lg italic text-gray-700">
            &quot;The believer&apos;s shade on the Day of Resurrection will be
            his charity.&quot;
          </p>
          <p className="text-sm text-gray-600 mt-2">
            — Prophet Muhammad ﷺ (Al-Tirmidhi)
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/donate"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium"
          >
            Donate Again
          </Link>
          <Link
            href="/appeals"
            className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium"
          >
            View Other Appeals
          </Link>
          <Link
            href="/"
            className="bg-gray-100 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium"
          >
            Return Home
          </Link>
        </div>

        {/* Contact Support */}
        <div className="mt-12 text-sm text-gray-500">
          <p>
            Have questions about your donation?{' '}
            <Link href="/contact-us" className="text-blue-500 underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DonationCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-6">⏳</div>
            <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          </div>
        </div>
      }
    >
      <DonationCompleteContent />
    </Suspense>
  );
}
