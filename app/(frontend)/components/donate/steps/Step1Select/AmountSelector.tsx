import { DonationFormData, quickAmounts, frequencies } from '../../types';

interface AmountSelectorProps {
  selectedAmount: number;
  customAmount: string;
  frequency: DonationFormData['frequency'];
  onAmountChange: (amount: number, customAmount: string) => void;
}

export default function AmountSelector({
  selectedAmount,
  customAmount,
  frequency,
  onAmountChange,
}: AmountSelectorProps) {
  const isCustom = customAmount !== '';
  const frequencyLabel = frequencies.find(f => f.value === frequency)?.label.toLowerCase();

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col gap-[16px] items-start w-full">
        <p className="text-[14px] font-normal leading-[20px] text-black">
          Your giving amount
        </p>
        <div className="flex gap-[16px] items-start w-full flex-nowrap">
          {quickAmounts.map(amount => {
            const isSelected = selectedAmount === amount && !isCustom;
            return (
              <button
                key={amount}
                onClick={() => onAmountChange(amount, '')}
                className={`flex flex-[1_0_0] flex-col items-center justify-center min-h-px min-w-px px-[24px] py-[12px] rounded-lg cursor-pointer transition-all border border-solid ${
                  isSelected
                    ? 'bg-[#F4F4F5] border-[#D4D4D8] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]'
                    : 'bg-[#FAFAFA] border-[#E4E4E7]'
                }`}
              >
                <div className="flex flex-col gap-[8px] items-start w-full">
                  <div className="flex gap-[4px] items-end w-full whitespace-nowrap">
                    <p
                      className={`text-[18px] font-semibold leading-[28px] shrink-0 ${
                        isSelected ? 'text-[#18181B]' : 'text-[#3F3F46]'
                      }`}
                    >
                      £{amount}
                    </p>
                    {frequency !== 'one-time' && (
                      <p
                        className={`flex-[1_0_0] text-[12px] font-normal leading-[16px] h-[20px] min-h-px min-w-px ${
                          isSelected ? 'text-[#3F3F46]' : 'text-[#71717A]'
                        }`}
                      >
                        /{frequencyLabel}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            );
          })}

          {/* Custom Amount Button */}
          <button
            onClick={() => {
              const customValue = prompt('Enter custom amount:');
              if (customValue) {
                onAmountChange(parseFloat(customValue) || 0, customValue);
              }
            }}
            className="flex flex-[1_0_0] flex-col items-center justify-center min-h-px min-w-px px-6 py-3 rounded-lg bg-[#FAFAFA] border border-solid border-[#E4E4E7] cursor-pointer"
          >
            <div className="flex flex-col gap-2 items-start w-full">
              <div className="flex gap-1 items-end w-full">
                <p className="text-[18px] font-semibold leading-7 text-[#3F3F46]">
                  Custom
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
