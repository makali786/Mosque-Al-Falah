import { BackButton } from '../ui';

interface DonationHeaderProps {
  showBackButton?: boolean;
  onBack?: () => void;
}

export default function DonationHeader({
  showBackButton = false,
  onBack,
}: DonationHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 items-start w-full donation-padding">
      <div className="flex gap-4 sm:gap-6 lg:gap-8 items-center">
        {showBackButton && onBack && <BackButton onClick={onBack} />}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight text-[#27272A] text-center">
          Donate Online
        </h1>
      </div>
      <p className="text-base sm:text-lg lg:text-xl font-medium leading-relaxed text-[#52525B] w-full">
        We trust Masjid System to handle the processing of our online payments.
        You will see their name mentioned on this form and in the address bar.
      </p>
    </div>
  );
}
