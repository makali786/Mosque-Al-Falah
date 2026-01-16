import { DonationFormData, frequencies } from '../../types';

interface FrequencySelectorProps {
  selectedFrequency: DonationFormData['frequency'];
  onFrequencyChange: (frequency: DonationFormData['frequency']) => void;
}

export default function FrequencySelector({
  selectedFrequency,
  onFrequencyChange,
}: FrequencySelectorProps) {
  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <p className="text-[14px] font-normal leading-5 text-black">
        I Wish To Donate
      </p>

      <div className="flex flex-col gap-6 items-start">
        {/* Frequency Tabs */}
        <div className="bg-[#F4F4F5] flex gap-2 items-start p-1 rounded-xl">
          {frequencies.map(freq => {
            const isActive = selectedFrequency === freq.value;
            return (
              <button
                key={freq.value}
                onClick={() =>
                  onFrequencyChange(freq.value as DonationFormData['frequency'])
                }
                className={`flex items-center justify-center px-[12px] py-[4px] cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#006FEE] text-white rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)]'
                    : 'text-[#71717A] rounded-xl'
                }`}
              >
                <span className="text-[16px] font-normal leading-[24px] text-center whitespace-nowrap">
                  {freq.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Date Information */}
        {selectedFrequency !== 'one-time' && (
          <div className="flex font-normal gap-[4px] items-center text-[14px] whitespace-nowrap">
            <span className="text-[#71717A] leading-[20px]">
              Starts today and ends when this fundraiser ends on
            </span>
            <span className="text-[#27272A] leading-[20px] underline [text-decoration-skip-ink:none] decoration-solid">
              April 6, 2025
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
