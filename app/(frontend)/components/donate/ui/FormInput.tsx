'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: 'text' | 'email' | 'tel' | 'number';
  placeholder?: string;
  required?: boolean;
  icon?: string;
  iconAlt?: string;
}

export default function FormInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder = '',
  required = false,
  icon,
  iconAlt = '',
}: FormInputProps) {
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);

    // Validate email in real-time (only for email type)
    if (type === 'email') {
      if (newValue) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(newValue)) {
          setError('Please enter a valid email address');
        } else {
          setError('');
        }
      } else if (required) {
        setError('Email is required');
      } else {
        setError('');
      }
    }
  };

  return (
    <div className="flex flex-col min-h-[70px] items-start min-w-[116px] w-full">
      <div className="flex items-center pb-3 pr-2 w-full">
        <p className="text-xs font-normal leading-4 text-[#52525B]">{label}</p>
        {required && (
          <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
            <p className="text-sm font-normal leading-5 text-[#F31260]">*</p>
          </div>
        )}
      </div>
      <div className={`bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full ${error ? 'border border-[#F31260]' : ''}`}>
        {icon && (
          <div className="overflow-hidden w-5 h-5 relative shrink-0 mr-1">
            <Image
              src={icon}
              alt={iconAlt}
              width={20}
              height={20}
              className="absolute inset-[2%]"
            />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          className="flex-1 bg-transparent px-1.5 pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
        />
      </div>
      {error && (
        <p className="text-xs font-normal leading-4 text-[#F31260] mt-1">
          {error}
        </p>
      )}
    </div>
  );
}
