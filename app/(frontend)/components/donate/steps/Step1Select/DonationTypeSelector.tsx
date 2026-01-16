import { donationTypes } from '../../types';

interface DonationTypeSelectorProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
}

export default function DonationTypeSelector({
  selectedType,
  onTypeChange,
}: DonationTypeSelectorProps) {
  return (
    <div className="flex flex-col gap-[4px] items-start w-full">
      <div className="flex flex-col items-start min-w-[116px] w-full">
        <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[12px] py-[10px] rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
          <div className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-start justify-center h-full px-[6px] pb-[2px] pt-0 min-h-px min-w-px">
              <div className="flex items-center pr-[8px] pl-0 py-0 w-full">
                <p className="text-[12px] font-normal leading-[16px] text-[#52525B]">
                  Donation Type
                </p>
              </div>
              <div className="flex items-center w-full">
                <select
                  value={selectedType}
                  onChange={e => onTypeChange(e.target.value)}
                  className="w-full bg-transparent text-[16px] font-normal leading-[24px] text-[#11181C] border-none outline-none appearance-none"
                >
                  {donationTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <svg
            className="w-[16px] h-[16px] shrink-0"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 10L12 6"
              stroke="#11181C"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
