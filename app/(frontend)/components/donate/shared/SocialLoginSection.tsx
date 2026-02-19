'use client';

import { signIn } from 'next-auth/react';
import { SocialLoginButton } from '../ui';

interface SocialLoginSectionProps {
  onUserDataLoaded?: () => void;
}

export default function SocialLoginSection({ onUserDataLoaded }: SocialLoginSectionProps) {
  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: window.location.href });
  };

  const handleFacebookSignIn = () => {
    signIn('facebook', { callbackUrl: window.location.href });
  };

  const handleAppleSignIn = () => {
    signIn('apple', { callbackUrl: window.location.href });
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
