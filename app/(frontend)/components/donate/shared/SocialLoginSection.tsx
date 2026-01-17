'use client';

import { useEffect } from 'react';
import { SocialLoginButton } from '../ui';
import { initializeGoogleSignIn, signInWithGoogle } from '@lib/utils/googleAuth';
import { initializeFacebookSDK, signInWithFacebook } from '@lib/utils/facebookAuth';
import { initializeAppleSignIn, signInWithApple } from '@lib/utils/appleAuth';

interface SocialLoginSectionProps {
  onUserDataLoaded?: () => void;
}

export default function SocialLoginSection({ onUserDataLoaded }: SocialLoginSectionProps) {

  // Initialize Google Sign-In, Facebook, and Apple on mount
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

    initializeFacebookSDK(
      () => {
        // Success callback
        if (onUserDataLoaded) {
          onUserDataLoaded();
        }
      },
      (error) => {
        // Error callback
        console.error('Facebook sign-in error:', error);
      }
    );

    initializeAppleSignIn(
      () => {
        // Success callback
        if (onUserDataLoaded) {
          onUserDataLoaded();
        }
      },
      (error) => {
        // Error callback
        console.error('Apple sign-in error:', error);
      }
    );
  }, [onUserDataLoaded]);

  const handleGoogleSignIn = () => {
    signInWithGoogle();
  };

  const handleFacebookSignIn = () => {
    signInWithFacebook(
      () => {
        // Success callback
        if (onUserDataLoaded) {
          onUserDataLoaded();
        }
      },
      (error) => {
        // Error callback
        console.error('Facebook sign-in error:', error);
      }
    );
  };

  const handleAppleSignIn = () => {
    signInWithApple(
      () => {
        // Success callback
        if (onUserDataLoaded) {
          onUserDataLoaded();
        }
      },
      (error) => {
        // Error callback
        console.error('Apple sign-in error:', error);
      }
    );
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
          onClick={handleAppleSignIn}
        />
        <SocialLoginButton
          provider="google"
          onClick={handleGoogleSignIn}
        />
        <SocialLoginButton
          provider="facebook"
          onClick={handleFacebookSignIn}
        />
      </div>
    </div>
  );
}
