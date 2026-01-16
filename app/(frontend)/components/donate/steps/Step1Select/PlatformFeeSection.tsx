import Image from 'next/image';
import { Card } from '../../ui';

interface PlatformFeeSectionProps {
  platformFeeEnabled: boolean;
  platformFeePercentage: number;
  donationAmount: number;
  onPlatformFeeChange: (enabled: boolean, percentage: number) => void;
}

export default function PlatformFeeSection({
  platformFeeEnabled,
  platformFeePercentage,
  donationAmount,
  onPlatformFeeChange,
}: PlatformFeeSectionProps) {
  const platformFeeOptions = [
    { percentage: 0, label: '0%' },
    { percentage: 7.5, label: '7.5%' },
    { percentage: 12.5, label: '12.5%', recommended: true },
    { percentage: 17.5, label: '17.5%' },
    { percentage: 20, label: '20%' },
  ];

  const handleOptionClick = (percentage: number) => {
    onPlatformFeeChange(percentage > 0, percentage);
  };

  const handleCustomAmount = () => {
    const customPercentage = prompt(
      'Enter custom platform fee percentage (0-100):'
    );
    if (customPercentage !== null) {
      const percentage = parseFloat(customPercentage);
      if (!isNaN(percentage) && percentage >= 0 && percentage <= 100) {
        onPlatformFeeChange(percentage > 0, percentage);
      }
    }
  };

  return (
    <Card className="w-full px-6 py-12 flex md:flex-row flex-col gap-8 overflow-visible">
      {/* Left side - Benefits */}
      <div className="flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-3 w-full">
          <div className="w-12 h-12 overflow-hidden shrink-0 relative">
            <Image
              src="/assets/donation/generosity-icon.png"
              alt="Generosity"
              width={48}
              height={48}
              className="object-contain"
            />
          </div>
          <p className="flex-1 text-base font-bold leading-6 text-[#27272A]">
            Your generosity can help more than just us:
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 overflow-hidden shrink-0 relative">
              <Image
                src="/assets/donation/platform-fee-icon.png"
                alt="Platform Fee"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <p className="text-sm font-normal leading-5 text-[#3F3F46] py-1">
              0% platform fees for charities
            </p>
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="w-7 h-7 overflow-hidden shrink-0 relative">
              <Image
                src="/assets/donation/support-icon.png"
                alt="Support"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <p className="flex-1 text-sm font-normal leading-5 text-[#3F3F46] py-1">
              Allows us to provide dedicated support for donors & fundraisers
            </p>
          </div>
          <div className="flex items-center gap-2 w-full">
            <div className="w-7 h-7 overflow-hidden shrink-0 relative">
              <Image
                src="/assets/donation/charity-tech-icon.png"
                alt="Charity Technology"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <p className="flex-1 text-sm font-normal leading-5 text-[#3F3F46] py-1">
              Charities deserve the best technology
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Slider and Controls */}
      <div className="flex flex-col gap-2 w-full md:w-[314px] h-[188px] items-center justify-end shrink-0">
        {/* Slider with Tooltip */}
        <div className="flex flex-col items-center justify-center w-full relative gap-2 px-0 py-[3px]">
          {/* Slider control container */}
          <div className="w-full relative flex flex-col items-start">
            {/* Slider track with dots */}
            <div className="bg-[#E4E4E7] rounded-full px-4 py-0.5 flex items-center justify-between w-full">
              {[0, 1, 2, 3, 4].map(i => (
                <button
                  key={i}
                  onClick={() => {
                    const percentages = [0, 7.5, 12.5, 17.5, 20];
                    handleOptionClick(percentages[i]);
                  }}
                  className="w-1 h-1 rounded-full shrink-0 cursor-pointer hover:scale-125 transition-transform"
                  style={{
                    backgroundColor:
                      i === 2 && platformFeePercentage === 12.5
                        ? '#F9C97C'
                        : '#D4D4D8',
                  }}
                  aria-label={`Set platform fee to ${[0, 7.5, 12.5, 17.5, 20][i]}%`}
                />
              ))}
            </div>
          </div>

          {/* Tooltip and Thumb - Positioned absolutely */}
          <div
            className="absolute bottom-0 flex flex-col gap-2 items-center w-[124px]"
            style={{
              left:
                platformFeePercentage === 0
                  ? '-44px'
                  : platformFeePercentage === 7.5
                    ? 'calc(25% - 62px)'
                    : platformFeePercentage === 12.5
                      ? 'calc(50% - 62px)'
                      : platformFeePercentage === 17.5
                        ? 'calc(75% - 62px)'
                        : platformFeePercentage === 20
                          ? 'calc(100% - 80px)'
                          : 'calc(50% - 62px)',
            }}
          >
            {/* Tooltip */}
            <div className="flex flex-col items-center w-full relative">
              {/* Arrow pointer */}
              <div className="absolute -bottom-[12px] left-1/2 -translate-x-1/2 w-[14.142px] h-[14.142px] flex items-center justify-center">
                <div className="w-[10px] h-[10px] bg-[#F5A524] rotate-45 rounded-[2px] shadow-[0px_0px_5px_0px_rgba(0,0,0,0.02),0px_2px_10px_0px_rgba(0,0,0,0.06),0px_0px_1px_0px_rgba(0,0,0,0.3)]" />
              </div>

              {/* Tooltip container */}
              <div className="bg-[#FAFAFA] flex flex-col items-center justify-center rounded-lg shadow-[0px_0px_15px_0px_rgba(0,0,0,0.03),0px_2px_30px_0px_rgba(0,0,0,0.08),0px_0px_1px_0px_rgba(0,0,0,0.3)] mb-2 overflow-hidden">
                {/* RECOMMENDED header - only show for 12.5% */}
                {platformFeePercentage === 12.5 && (
                  <div className="bg-[#F5A524] px-3 py-1 flex items-center justify-center w-full">
                    <p className="text-xs font-normal leading-4 text-[#FAFAFA]">
                      RECOMMENDED
                    </p>
                  </div>
                )}
                {/* Percentage and Amount */}
                <div className="flex items-center justify-center gap-2 px-2 py-1 text-sm font-normal leading-5 text-[#18181B] w-full">
                  <span>{platformFeePercentage}%</span>
                  <span className="text-[#52525B]">
                    (£
                    {((donationAmount * platformFeePercentage) / 100).toFixed(2)}
                    )
                  </span>
                </div>
              </div>
            </div>

            {/* Slider thumb */}
            <div className="w-4 h-4 relative shrink-0">
              {/* Outline */}
              <div className="absolute -inset-1 bg-white rounded-full" />
              {/* Thumb */}
              <div className="absolute inset-0 bg-white rounded-full border-2 border-[#F5A524]" />
            </div>
          </div>
        </div>

        {/* Other amount button */}
        <button
          onClick={handleCustomAmount}
          className="flex items-center justify-center h-10 px-4 rounded-xl cursor-pointer hover:bg-[#F4F4F5] transition-colors"
        >
          <p className="text-sm font-normal leading-5 text-black">
            Other amount
          </p>
        </button>

        {/* Green info box */}
        <div className="bg-[#0E793C] rounded-lg px-4 py-3 flex items-center justify-center overflow-hidden w-full">
          <p className="text-xs leading-4 text-[#E8FAF0]">
            <span className="font-bold">75% of donors</span>
            {' have helped keep Masjid System '}
            <span className="font-bold">
              free for our charity in last the 24 hours
            </span>
          </p>
        </div>
      </div>
    </Card>
  );
}
