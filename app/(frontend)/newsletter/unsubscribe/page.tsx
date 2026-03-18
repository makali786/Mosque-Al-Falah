'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing your unsubscribe request...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Invalid unsubscribe link. Please check your email or contact support.');
      return;
    }

    // Call the unsubscribe API
    fetch('/api/newsletter/unsubscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token }),
    })
      .then(async (res) => {
        const data = await res.json();
        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'You have been successfully unsubscribed from our newsletter.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Failed to unsubscribe. Please try again later.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('An error occurred. Please try again later or contact support.');
      });
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        {/* Logo */}
        <div className="mb-6">
          <img 
            src="/assets/header/logo.svg" 
            alt="Masjid Al-Falah" 
            className="h-16 mx-auto"
          />
        </div>

        {/* Status Icon */}
        {status === 'loading' && (
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        )}
        
        {status === 'success' && (
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
        
        {status === 'error' && (
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          {status === 'loading' && 'Processing...'}
          {status === 'success' && 'Unsubscribed!'}
          {status === 'error' && 'Oops!'}
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">{message}</p>

        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-block bg-[#0c478a] text-white px-6 py-3 rounded-lg font-medium hover:bg-[#0a3a70] transition-colors"
        >
          Back to Home
        </Link>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-sm text-gray-500">
          <p>Masjid Al-Falah</p>
          <p>North Ilford Islamic Centre</p>
        </div>
      </div>
    </div>
  );
}
