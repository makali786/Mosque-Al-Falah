import Image from 'next/image';

interface SocialLoginButtonProps {
  provider: 'apple' | 'google' | 'facebook';
  onClick: () => void;
  disabled: boolean;
}

const providerConfig = {
  apple: {
    logo: '/assets/donation/apple-logo.svg',
    text: 'Apple',
    textColor: 'text-black',
  },
  google: {
    logo: '/assets/donation/google-logo.svg',
    text: 'Google',
    textColor: 'text-[#757575]',
    textSize: 'text-sm font-medium',
  },
  facebook: {
    logo: '/assets/donation/facebook-logo.svg',
    text: 'Facebook',
    textColor: 'text-[#1877F2]',
  },
};

export default function SocialLoginButton({
  provider,
  onClick,
  disabled
}: SocialLoginButtonProps) {
  const config = providerConfig[provider];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={` ${disabled ? "cursor-not-allowed" : "cursor-pointer"} bg-white border border-[#E4E4E7] flex flex-1 items-center justify-center overflow-hidden px-0 sm:pl-0 sm:pr-3 rounded-lg  hover:bg-[#F4F4F5] transition-colors`}
    >
      <div className="bg-white overflow-hidden rounded-[1px] w-10 h-10">
        <div className="p-2">
          <Image
            src={config.logo}
            alt={config.text}
            width={24}
            height={24}
          />
        </div>
      </div>
      <p
        className={`${config.textColor} ${config.textSize || 'text-base'} leading-normal tracking-[-0.32px] hidden sm:block`}
      >
        {config.text}
      </p>
    </button>
  );
}
