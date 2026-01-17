'use client';

import { useState } from 'react';
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
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const isCustom = customAmount !== '';
  const frequencyLabel = frequencies.find(f => f.value === frequency)?.label.toLowerCase();

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex flex-col gap-4 items-start w-full">
        <p className="text-sm font-normal leading-5 text-black">
          Your giving amount
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full">
          {quickAmounts.map(amount => {
            const isSelected = selectedAmount === amount && !isCustom && !showCustomInput;
            return (
              <button
                key={amount}
                onClick={() => {
                  onAmountChange(amount, '');
                  setShowCustomInput(false);
                }}
                className={`flex flex-col items-center justify-center px-4 sm:px-6 py-3 rounded-lg cursor-pointer transition-all border border-solid ${
                  isSelected
                    ? 'bg-[#F4F4F5] border-[#D4D4D8] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]'
                    : 'bg-[#FAFAFA] border-[#E4E4E7]'
                }`}
              >
                <div className="flex flex-col gap-2 items-start w-full">
                  <div className="flex gap-1 items-end w-full whitespace-nowrap">
                    <p
                      className={`text-base sm:text-lg font-semibold leading-tight shrink-0 ${
                        isSelected ? 'text-[#18181B]' : 'text-[#3F3F46]'
                      }`}
                    >
                      £{amount}
                    </p>
                    {frequency !== 'one-time' && (
                      <p
                        className={`flex-1 text-xs font-normal leading-tight ${
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
            type="button"
            onClick={() => {
              setShowCustomInput(!showCustomInput);
              if (!showCustomInput) {
                setCustomValue('');
              }
            }}
            className={`flex flex-col items-center justify-center px-4 sm:px-6 py-3 rounded-lg border border-solid cursor-pointer transition-all ${
              showCustomInput || isCustom
                ? 'bg-[#F4F4F5] border-[#D4D4D8] shadow-[0px_4px_6px_-1px_rgba(0,0,0,0.1),0px_2px_4px_-2px_rgba(0,0,0,0.1)]'
                : 'bg-[#FAFAFA] border-[#E4E4E7] hover:bg-[#F4F4F5]'
            }`}
          >
            <div className="flex flex-col gap-2 items-start w-full">
              <div className="flex gap-1 items-end w-full">
                <p className={`text-base sm:text-lg font-semibold leading-tight ${
                  showCustomInput || isCustom ? 'text-[#18181B]' : 'text-[#3F3F46]'
                }`}>
                  Custom
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Custom Amount Input */}
        {showCustomInput && (
          <div className="flex flex-col gap-3 w-full mt-2">
            <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center w-full">
              <div className="flex-1 bg-[#F4F4F5] flex items-center px-3 py-2 sm:py-2 rounded-xl border border-[#D4D4D8] min-h-[44px]">
                <span className="text-sm sm:text-base font-semibold text-[#3F3F46] mr-1">£</span>
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only numbers and decimal point
                    if (value === '' || /^\d*\.?\d*$/.test(value)) {
                      setCustomValue(value);
                    }
                  }}
                  placeholder="Enter amount"
                  className="flex-1 bg-transparent text-sm sm:text-base font-normal text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
                  inputMode="decimal"
                />
              </div>
              <button
                type="button"
                onClick={() => {
                  const amount = parseFloat(customValue);
                  if (amount && amount > 0) {
                    onAmountChange(amount, customValue);
                    setShowCustomInput(false);
                  }
                }}
                disabled={!customValue || parseFloat(customValue) <= 0}
                className="bg-[#006FEE] text-white px-4 sm:px-6 py-3 sm:py-2 rounded-xl hover:bg-[#0055CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base font-normal w-full sm:w-auto min-h-[44px]"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
