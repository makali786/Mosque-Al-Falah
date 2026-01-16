'use client';

import { useState } from 'react';

interface PhoneInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const countryCodes = [
  { code: '+44', country: 'GB', flag: '🇬🇧' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+92', country: 'PK', flag: '🇵🇰' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+966', country: 'SA', flag: '🇸🇦' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+34', country: 'ES', flag: '🇪🇸' },
  { code: '+31', country: 'NL', flag: '🇳🇱' },
  { code: '+32', country: 'BE', flag: '🇧🇪' },
  { code: '+90', country: 'TR', flag: '🇹🇷' },
  { code: '+86', country: 'CN', flag: '🇨🇳' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+64', country: 'NZ', flag: '🇳🇿' },
  { code: '+27', country: 'ZA', flag: '🇿🇦' },
  { code: '+20', country: 'EG', flag: '🇪🇬' },
  { code: '+234', country: 'NG', flag: '🇳🇬' },
  { code: '+254', country: 'KE', flag: '🇰🇪' },
  { code: '+880', country: 'BD', flag: '🇧🇩' },
  { code: '+60', country: 'MY', flag: '🇲🇾' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+63', country: 'PH', flag: '🇵🇭' },
  { code: '+62', country: 'ID', flag: '🇮🇩' },
  { code: '+82', country: 'KR', flag: '🇰🇷' },
  { code: '+7', country: 'RU', flag: '🇷🇺' },
  { code: '+48', country: 'PL', flag: '🇵🇱' },
  { code: '+353', country: 'IE', flag: '🇮🇪' },
];

export default function PhoneInput({
  label,
  value,
  onChange,
  required = false,
}: PhoneInputProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Parse the current value to extract country code and number
  const getSelectedCode = () => {
    for (const c of countryCodes) {
      if (value.startsWith(c.code)) {
        return c;
      }
    }
    return countryCodes[0]; // Default to UK
  };

  const selectedCountry = getSelectedCode();

  const getPhoneNumber = () => {
    if (value.startsWith(selectedCountry.code)) {
      return value.slice(selectedCountry.code.length);
    }
    // If value doesn't start with any code, it's just the number
    for (const c of countryCodes) {
      if (value.startsWith(c.code)) {
        return value.slice(c.code.length);
      }
    }
    return value;
  };

  const phoneNumber = getPhoneNumber();

  const handleCountryChange = (country: typeof countryCodes[0]) => {
    onChange(country.code + phoneNumber);
    setIsOpen(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const numericValue = e.target.value.replace(/[^0-9]/g, '');
    onChange(selectedCountry.code + numericValue);
  };

  return (
    <div className="flex flex-col h-[70px] items-start min-w-[116px] w-full">
      <div className="flex items-center pb-3 pr-2 w-full">
        <p className="text-xs font-normal leading-4 text-[#52525B]">{label}</p>
        {required && (
          <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
            <p className="text-sm font-normal leading-5 text-[#F31260]">*</p>
          </div>
        )}
      </div>
      <div className="bg-[#F4F4F5] flex items-center min-h-[32px] rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full relative">
        {/* Country Code Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1 px-3 py-2 border-r border-[#E4E4E7] hover:bg-[#E4E4E7] rounded-l-xl transition-colors"
          >
            <span className="text-base">{selectedCountry.flag}</span>
            <span className="text-sm text-[#11181C]">{selectedCountry.code}</span>
            <svg
              className={`w-3 h-3 text-[#71717A] transition-transform ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-[#E4E4E7] rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto min-w-[140px]">
              {countryCodes.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleCountryChange(country)}
                  className={`flex items-center gap-2 w-full px-3 py-2 hover:bg-[#F4F4F5] text-left ${
                    selectedCountry.code === country.code ? 'bg-[#F4F4F5]' : ''
                  }`}
                >
                  <span className="text-base">{country.flag}</span>
                  <span className="text-sm text-[#11181C]">{country.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Phone Number Input */}
        <input
          type="tel"
          inputMode="numeric"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder="7911 123456"
          className="flex-1 bg-transparent px-3 py-2 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
        />
      </div>
    </div>
  );
}
