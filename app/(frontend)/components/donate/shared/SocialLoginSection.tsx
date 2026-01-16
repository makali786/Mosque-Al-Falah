import { signIn } from 'next-auth/react';
import { SocialLoginButton } from '../ui';

export default function SocialLoginSection() {
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
          onClick={() => signIn('apple', { callbackUrl: '/donate' })}
        />
        <SocialLoginButton
          provider="google"
          onClick={() => signIn('google', { callbackUrl: '/donate' })}
        />
        <SocialLoginButton
          provider="facebook"
          onClick={() => signIn('facebook', { callbackUrl: '/donate' })}
        />
      </div>
    </div>
  );
}
