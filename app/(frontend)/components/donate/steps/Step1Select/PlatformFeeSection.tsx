'use client';

import Image from 'next/image';
import { Card } from '../../ui';
import { DonationSettings } from '../../types';

interface PlatformFeeSectionProps {
  platformFeeEnabled: boolean;
  platformFeePercentage: number;
  donationAmount: number;
  onPlatformFeeChange: (enabled: boolean, percentage: number) => void;
  settings?: DonationSettings;
}

// Default slider points configuration
const DEFAULT_SLIDER_POINTS = [
  { pos: 0, val: 0 },
  { pos: 25, val: 7.5 },
  { pos: 50, val: 12.5 },
  { pos: 75, val: 17.5 },
  { pos: 100, val: 20 },
];

export default function PlatformFeeSection({
  platformFeeEnabled,
  platformFeePercentage,
  donationAmount,
  onPlatformFeeChange,
  settings,
}: PlatformFeeSectionProps) {
  // Use settings from CMS or fall back to defaults
  const platformFeeSettings = settings?.platformFee;
  
  // Build slider points from settings or use defaults
  const sliderPoints = platformFeeSettings?.sliderPoints?.length 
    ? platformFeeSettings.sliderPoints.map(sp => ({
        pos: sp.visualPosition,
        val: sp.percentageValue,
      })).sort((a, b) => a.pos - b.pos)
    : DEFAULT_SLIDER_POINTS;

  const recommendedPosition = platformFeeSettings?.recommendedPosition ?? 50;
  const infoText = platformFeeSettings?.infoText ?? '75% of donors';
  const infoSubtext = platformFeeSettings?.infoSubtext ?? 'have helped keep Masjid System free for our charity in last the 24 hours';

  // Helper to get visual position (0-100) from fee value
  const getPositionFromValue = (value: number) => {
    if (value >= Math.max(...sliderPoints.map(p => p.val))) return 100;
    if (value <= 0) return 0;

    // Find the segment this value belongs to
    for (let i = 0; i < sliderPoints.length - 1; i++) {
      const p1 = sliderPoints[i];
      const p2 = sliderPoints[i + 1];
      if (value >= p1.val && value <= p2.val) {
        // Interpolate
        const rangeVal = p2.val - p1.val;
        const rangePos = p2.pos - p1.pos;
        const percentInRange = (value - p1.val) / rangeVal;
        return p1.pos + percentInRange * rangePos;
      }
    }
    return 0;
  };

  // Helper to get fee value from visual position (0-100)
  const getValueFromPosition = (pos: number) => {
    if (pos >= 100) return Math.max(...sliderPoints.map(p => p.val));
    if (pos <= 0) return 0;

    for (let i = 0; i < sliderPoints.length - 1; i++) {
      const p1 = sliderPoints[i];
      const p2 = sliderPoints[i + 1];
      if (pos >= p1.pos && pos <= p2.pos) {
        // Interpolate
        const rangePos = p2.pos - p1.pos;
        const rangeVal = p2.val - p1.val;
        const percentInRange = (pos - p1.pos) / rangePos;
        const rawValue = p1.val + percentInRange * rangeVal;
        return Math.round(rawValue * 10) / 10;
      }
    }
    return 0;
  };

  const sliderPosition = getPositionFromValue(platformFeePercentage);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const visualPos = parseFloat(e.target.value);
    const newValue = getValueFromPosition(visualPos);
    onPlatformFeeChange(newValue > 0, newValue);
  };

  // Helper to determine if we are "on" a dot for styling (visually close)
  const isNearDot = (pos: number, targetPos: number) =>
    Math.abs(pos - targetPos) < 2;

  const handleCustomAmount = () => {
    const maxValue = Math.max(...sliderPoints.map(p => p.val));
    const customPercentage = prompt(
      `Enter custom platform fee percentage (0-${maxValue}):`,
      platformFeePercentage.toString()
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
        {/* Slider Container */}
        <div className="flex flex-col items-center justify-center w-full relative h-24 mb-4">
          {/* Tooltip - Absolute positioned above thumb */}
          <div
            className="absolute z-20 flex flex-col items-center transition-all duration-75 ease-out pointer-events-none"
            style={{
              left: `${sliderPosition}%`,
              transform: `translateX(-50%)`,
              bottom: '30px',
              opacity: 1,
            }}
          >
            {/* Tooltip Content */}
            <div className="flex flex-col items-center w-[140px] relative filter drop-shadow-md">
              <div className="bg-[#FAFAFA] w-full rounded-lg overflow-hidden flex flex-col items-center shadow-sm border border-gray-100">
                {/* RECOMMENDED Badge - Show only near recommended position */}
                {isNearDot(sliderPosition, recommendedPosition) && (
                  <div className="bg-[#F5A524] w-full py-1 flex items-center justify-center">
                    <p className="text-[10px] font-bold text-white tracking-wider">
                      RECOMMENDED
                    </p>
                  </div>
                )}
                {/* Amount Display */}
                <div className="px-3 py-2 flex flex-col items-center justify-center bg-white w-full">
                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-bold text-[#18181B]">
                      {platformFeePercentage}%
                    </span>
                    <span className="text-sm text-[#52525B]">
                      (£
                      {((donationAmount * platformFeePercentage) / 100).toFixed(
                        2
                      )}
                      )
                    </span>
                  </div>
                </div>
              </div>
              {/* Arrow */}
              <div className="w-4 h-4 bg-white transform rotate-45 -mt-2 z-[-1] border-b border-r border-gray-100"></div>
            </div>
          </div>

          {/* Slider Track Area */}
          <div className="relative w-full h-8 flex items-center justify-center">
            {/* Visual Track Line */}
            <div className="absolute w-full h-1.5 bg-[#E4E4E7] rounded-full overflow-hidden">
              {/* Filled portion of track */}
              <div
                className="h-full bg-[#F5A524] transition-all duration-75 ease-out"
                style={{ width: `${sliderPosition}%` }}
              />
            </div>

            {/* Dots - Positioned based on slider points */}
            <div className="absolute w-full h-full pointer-events-none">
              {sliderPoints.map((pt, i) => {
                const isActive = sliderPosition >= pt.pos;

                return (
                  <div
                    key={i}
                    className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full z-10 transition-colors duration-300 ${isActive ? 'bg-[#F5A524]' : 'bg-[#D4D4D8]'
                      }`}
                    style={{
                      left: `${pt.pos}%`,
                      transform: `translate(-50%, -3%)`,
                    }}
                  />
                );
              })}
            </div>

            {/* Functional Range Input */}
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={sliderPosition}
              onChange={handleSliderChange}
              className="absolute w-full h-full opacity-0 cursor-pointer z-30"
              style={{ margin: 0 }}
              aria-label="Platform fee percentage"
            />

            {/* Visual Thumb - Follows exact position */}
            <div
              className="absolute w-6 h-6 bg-white border-[3px] border-[#F5A524] rounded-full shadow-md z-20 pointer-events-none transition-all duration-75 ease-out flex items-center justify-center"
              style={{
                left: `${sliderPosition}%`,
                transform: 'translateX(-50%)',
              }}
            >
              <div className="w-2 h-2 bg-[#F5A524] rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Other amount button */}
        <button
          onClick={handleCustomAmount}
          className="flex items-center justify-center h-10 px-4 rounded-xl cursor-pointer hover:bg-[#F4F4F5] transition-colors mt-2"
        >
          <p className="text-sm font-normal leading-5 text-black">
            Other amount
          </p>
        </button>

        {/* Green info box */}
        <div className="bg-[#0E793C] rounded-lg px-4 py-3 flex items-center justify-center overflow-hidden w-full mt-2">
          <p className="text-xs leading-4 text-[#E8FAF0] text-center">
            <span className="font-bold">{infoText}</span>
            {' '}{infoSubtext}
          </p>
        </div>
      </div>
    </Card>
  );
}
