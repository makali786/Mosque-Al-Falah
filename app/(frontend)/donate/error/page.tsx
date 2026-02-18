'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const errorMessages: Record<string, string> = {
  Configuration: 'There is a problem with the server configuration.',
  AccessDenied: 'You do not have permission to sign in.',
  Verification: 'The sign-in link is no longer valid.',
  OAuthSignin: 'Could not start the sign-in process. Please try again.',
  OAuthCallback: 'Could not complete sign-in. Please try again.',
  OAuthCreateAccount: 'Could not create your account. Please try again.',
  EmailCreateAccount: 'Could not create your account. Please try again.',
  Callback: 'An error occurred during sign-in. Please try again.',
  OAuthAccountNotLinked: 'This email is already linked to another account.',
  EmailSignin: 'The email could not be sent.',
  CredentialsSignin: 'Sign-in failed. Check your credentials and try again.',
  SessionRequired: 'Please sign in to access this page.',
  Default: 'An error occurred during sign-in. Please try again.',
};

export default function DonateErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error') || 'Default';
  const message = errorMessages[error] || errorMessages.Default;

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
            Sign-in Error
          </h1>
          <p className="text-gray-600">{message}</p>
          {process.env.NODE_ENV === 'development' && (
            <p className="mt-2 text-xs text-gray-400">Error code: {error}</p>
          )}
        </div>
        <div className="flex flex-col gap-3">
          <Link
            href="/donate"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Donate
          </Link>
          <Link
            href="/"
            className="inline-block text-gray-500 hover:text-gray-700 text-sm transition-colors"
          >
            Go to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
