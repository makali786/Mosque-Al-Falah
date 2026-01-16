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
    <div className="flex flex-col gap-8 items-start w-full">
      <div className="flex gap-8 items-center">
        {showBackButton && onBack && <BackButton onClick={onBack} />}
        <h1 className="text-4xl font-semibold leading-10 text-[#27272A] text-center">
          Donate Online
        </h1>
      </div>
      <p className="text-xl font-medium leading-7 text-[#52525B] w-full">
        We trust Masjid System to handle the processing of our online payments.
        You will see their name mentioned on this form and in the address bar.
      </p>
    </div>
  );
}
