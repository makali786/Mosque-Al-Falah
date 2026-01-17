'use client';

import { useEffect } from 'react';
import { SocialLoginButton } from '../ui';
import { initializeGoogleSignIn, signInWithGoogle } from '@lib/utils/googleAuth';

interface SocialLoginSectionProps {
  onUserDataLoaded?: () => void;
}

export default function SocialLoginSection({ onUserDataLoaded }: SocialLoginSectionProps) {

  // Initialize Google Sign-In on mount
  useEffect(() => {
    initializeGoogleSignIn(
      () => {
        // Success callback
        if (onUserDataLoaded) {
          onUserDataLoaded();
        }
      },
      (error) => {
        // Error callback
        console.error('Google sign-in error:', error);
      }
    );
  }, [onUserDataLoaded]);

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  return (
    <div className="flex flex-col gap-9 w-full">
      <div className="flex gap-3 items-center w-full">
        <div className="bg-[rgba(17,17,17,0.15)] flex-1 h-px" />
        <p className="text-xs font-normal leading-4 text-[#27272A] text-center">
          Sign In with
        </p>
        <div className="bg-[rgba(17,17,17,0.15)] flex-1 h-px" />
      </div>
      <div className="flex gap-8 items-start w-full">
        <SocialLoginButton
          provider="apple"
          onClick={() => console.log('Apple sign-in not implemented')}
        />
        <SocialLoginButton
          provider="google"
          onClick={handleGoogleSignIn}
        />
        <SocialLoginButton
          provider="facebook"
          onClick={() => console.log('Facebook sign-in not implemented')}
        />
      </div>
    </div>
  );
}
