import Image from 'next/image';

interface BackButtonProps {
  onClick: () => void;
}

export default function BackButton({ onClick }: BackButtonProps) {
  return (
    <button
      onClick={onClick}
      className="border-2 border-[#006FEE] border-solid flex h-12 items-center justify-center px-6 py-0 rounded-[14px] cursor-pointer hover:bg-[#006FEE]/5 transition-colors"
    >
      <div className="flex gap-2 items-center justify-center">
        <div className="w-5 h-5 relative shrink-0">
          <Image
            src="/assets/donation/arrow-left.svg"
            alt="Back"
            width={20}
            height={20}
            className="w-full h-full"
          />
        </div>
        <span className="text-base font-normal leading-6 text-[#006FEE]">
          Back
        </span>
      </div>
    </button>
  );
}
