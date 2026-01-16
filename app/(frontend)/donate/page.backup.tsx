'use client';

import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY!);

// Types
interface DonationFormData {
  // Step 1: Select
  frequency: 'one-time' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  donationType: string;
  amount: number;
  customAmount: string;
  platformFeeEnabled: boolean;
  platformFeePercentage: number;

  // Step 2: Details
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  address: {
    line1: string;
    line2: string;
    city: string;
    postcode: string;
    country: string;
  };
  isAnonymous: boolean;
  displayName: string;
  marketingConsent: boolean;
  termsAccepted: boolean;

  // Step 3: Gift Aid
  giftAidEnabled: boolean;
  giftAidDeclaration: boolean;
}

const steps = [
  { number: 1, label: 'Select' },
  { number: 2, label: 'Details' },
  { number: 3, label: 'Gift Aid' },
  { number: 4, label: 'Pay' },
  { number: 5, label: 'Complete' },
];

const frequencies = [
  { value: 'one-time', label: 'One-off' },
  { value: 'weekly', label: 'Every Friday' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'yearly', label: 'Yearly' },
];

const donationTypes = [
  { value: 'general', label: 'General Fund' },
  { value: 'zakat', label: 'Zakat' },
  { value: 'sadaqah', label: 'Sadaqah' },
  { value: 'building', label: 'Building Fund' },
  { value: 'ramadan', label: 'Ramadan Appeal' },
  { value: 'gaza', label: 'Gaza Emergency' },
  { value: 'orphan', label: 'Orphan Support' },
  { value: 'education', label: 'Education' },
];

const quickAmounts = [15, 20, 45];

// Donation Step Indicator - Pixel-perfect Figma implementation
function DonationStepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full bg-[#F4F4F5] border border-[#E6F1FE] border-solid">
      {/* Desktop view */}
      <div className="hidden md:flex items-center justify-center gap-4 lg:gap-8 px-4 lg:px-8 py-3">
        {steps.map(step => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div key={step.number} className="flex items-center gap-2 py-3.5">
              {/* Badge with number */}
              <div
                className={`
                  flex items-center justify-center
                  h-6 min-w-6 px-1
                  rounded-full
                  border-2 border-white border-solid
                  ${isActive || isCompleted ? 'bg-[#006FEE]' : 'bg-[#D4D4D8]'}
                `}
              >
                <span
                  className={`
                    text-sm font-normal leading-5 text-center
                    ${isActive || isCompleted ? 'text-white' : 'text-black'}
                  `}
                >
                  {step.number}
                </span>
              </div>

              {/* Step label */}
              <span
                className={`
                  text-sm lg:text-base font-medium leading-6 text-center whitespace-nowrap
                  ${isActive ? 'text-[#18181B]' : 'text-[#52525B]'}
                `}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Mobile view - show only current step */}
      <div className="md:hidden flex items-center justify-center px-4 py-4">
        <div className="flex items-center gap-3">
          {/* Current step badge */}
          <div className="flex items-center justify-center h-6 min-w-6 px-1 rounded-full border-2 border-white border-solid bg-[#006FEE]">
            <span className="text-sm font-normal leading-5 text-center text-white">
              {currentStep}
            </span>
          </div>

          {/* Current step label */}
          <span className="text-base font-medium leading-6 text-[#18181B]">
            {steps.find(s => s.number === currentStep)?.label}
          </span>

          {/* Progress indicator */}
          <span className="text-sm text-[#52525B] ml-2">
            ({currentStep} of {steps.length})
          </span>
        </div>
      </div>
    </div>
  );
}

// Step 1: Select Donation Amount - Pixel-perfect Figma implementation
function SelectDonationStep({
  formData,
  setFormData,
  onNext,
}: {
  formData: DonationFormData;
  setFormData: (data: DonationFormData) => void;
  onNext: () => void;
}) {
  const selectedAmount = formData.amount || 0;
  const isCustom = !quickAmounts.includes(selectedAmount) && selectedAmount > 0;

  const donationAmount = formData.customAmount
    ? parseFloat(formData.customAmount)
    : formData.amount;

  const platformFee = formData.platformFeeEnabled
    ? (donationAmount * formData.platformFeePercentage) / 100
    : 0;

  const totalAmount = donationAmount + platformFee;

  const frequencyLabel = frequencies.find(
    f => f.value === formData.frequency
  )?.label;

  return (
    <div className="w-full flex flex-col gap-8 pt-8 pb-0 px-0">
      {/* Header */}
      <div className="flex flex-col gap-0 px-4 md:px-24 lg:px-96">
        <div className="flex flex-col gap-8">
          <div className="flex items-center">
            <h1 className="text-4xl font-semibold leading-10 text-[#27272A] text-center">
              Donate Online
            </h1>
          </div>
          <p className="text-xl font-medium leading-7 text-[#52525B] w-full">
            We trust Masjid System to handle the processing of our online
            payments. You will see their name mentioned on this form and in the
            address bar.
          </p>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="flex flex-col gap-8 items-end px-4 md:px-24 lg:px-96">
        {/* Selection Card */}
        <div className="w-full bg-[#FAFAFA] rounded-xl p-8 flex flex-col gap-8">
          {/* I Wish To Donate Section */}
          <div className="flex flex-col gap-4 items-start w-full">
            <p className="text-[14px] font-normal leading-5 text-black">
              I Wish To Donate
            </p>

            <div className="flex flex-col gap-6 items-start">
              {/* Frequency Tabs */}
              <div className="bg-[#F4F4F5] flex gap-2 items-start p-1 rounded-xl">
                {frequencies.map(freq => {
                  const isActive = formData.frequency === freq.value;
                  return (
                    <button
                      key={freq.value}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          frequency:
                            freq.value as DonationFormData['frequency'],
                        })
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
              {formData.frequency !== 'one-time' && (
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

          {/* Donation Type Dropdown */}
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
                        value={formData.donationType}
                        onChange={e =>
                          setFormData({
                            ...formData,
                            donationType: e.target.value,
                          })
                        }
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

          {/* Your giving amount */}
          <div className="flex flex-col items-start w-full">
            <div className="flex flex-col gap-[16px] items-start w-full">
              <p className="text-[14px] font-normal leading-[20px] text-black">
                Your giving amount
              </p>
              <div className="flex gap-[16px] items-start w-full flex-nowrap">
                {quickAmounts.map(amount => {
                  const isSelected = formData.amount === amount && !isCustom;
                  return (
                    <button
                      key={amount}
                      onClick={() =>
                        setFormData({ ...formData, amount, customAmount: '' })
                      }
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
                          {formData.frequency !== 'one-time' && (
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
                      setFormData({
                        ...formData,
                        customAmount: customValue,
                        amount: parseFloat(customValue) || 0,
                      });
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
        </div>

        {/* Donation on behalf of */}
        <div className="w-full bg-[#FAFAFA] rounded-xl p-8 flex flex-col gap-4">
          <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-0 not-italic relative shrink-0 text-[14px] text-(--colors/base/default-foreground,black) whitespace-nowrap">
            <p className="leading-5 whitespace-pre">Donation of behalf of</p>
          </div>
          <div className="bg-[#F4F4F5] content-stretch flex items-center justify-between px-3 py-2 relative rounded-lg shrink-0 w-86">
            <div className="content-stretch flex gap-2 isolate items-center justify-center relative rounded-lg shrink-0">
              <div className="bg-(--colors/layout/foreground-400,#a1a1aa) content-stretch flex items-center justify-center overflow-clip relative rounded-[9999px] shrink-0 size-10 z-2">
                <div className="flex-[1_0_0] h-full max-w-10 min-h-px min-w-px relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none"
                  >
                    <div className="absolute bg-black inset-0" />
                    <div className="absolute inset-0 overflow-hidden">
                      <img
                        alt=""
                        className="absolute h-[80.57%] left-[10%] max-w-none top-[9.72%] w-[80%]"
                        src="/assets/donation/avatar-default.png"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal items-start leading-0 pl-0 pr-[1.19px] py-px relative shrink-0 whitespace-nowrap z-1">
                <div
                  className="flex flex-col justify-center relative shrink-0 text-[14px] text-(--colors/layout/foreground,#11181c)"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  <p className="leading-5 whitespace-pre">
                    {formData.isAnonymous
                      ? 'Anonymous kind soul'
                      : formData.displayName || 'Anonymous kind soul'}
                  </p>
                </div>
                <div
                  className="flex flex-col justify-center relative shrink-0 text-[12px] text-[#A1A1AA]"
                  style={{ fontVariationSettings: "'wdth' 100" }}
                >
                  <p className="leading-4 whitespace-pre">
                    £{donationAmount.toFixed(2)} GBP, a few moments ago
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={() =>
                setFormData({ ...formData, isAnonymous: !formData.isAnonymous })
              }
              className="content-stretch cursor-pointer flex h-10 items-center justify-center px-4 py-0 relative rounded-xl shrink-0"
            >
              <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0">
                <div className="content-stretch flex gap-2 items-center justify-center relative shrink-0">
                  <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-(--colors/base/default-foreground,black) text-left whitespace-nowrap">
                    <p className="leading-[20px] whitespace-pre">Edit</p>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Platform Fee Section */}
        <div className="w-full bg-[#FAFAFA] rounded-[14px] px-6 py-12 flex md:flex-row flex-col gap-8 overflow-visible">
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
                  Allows us to provide dedicated support for donors &
                  fundraisers
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
                        setFormData({
                          ...formData,
                          platformFeeEnabled: percentages[i] > 0,
                          platformFeePercentage: percentages[i],
                        });
                      }}
                      className="w-1 h-1 rounded-full shrink-0 cursor-pointer hover:scale-125 transition-transform"
                      style={{
                        backgroundColor:
                          i === 2 && formData.platformFeePercentage === 12.5
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
                    formData.platformFeePercentage === 0
                      ? '-44px'
                      : formData.platformFeePercentage === 7.5
                        ? 'calc(25% - 62px)'
                        : formData.platformFeePercentage === 12.5
                          ? 'calc(50% - 62px)'
                          : formData.platformFeePercentage === 17.5
                            ? 'calc(75% - 62px)'
                            : formData.platformFeePercentage === 20
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
                    {formData.platformFeePercentage === 12.5 && (
                      <div className="bg-[#F5A524] px-3 py-1 flex items-center justify-center w-full">
                        <p className="text-xs font-normal leading-4 text-[#FAFAFA]">
                          RECOMMENDED
                        </p>
                      </div>
                    )}
                    {/* Percentage and Amount */}
                    <div className="flex items-center justify-center gap-2 px-2 py-1 text-sm font-normal leading-5 text-[#18181B] w-full">
                      <span>{formData.platformFeePercentage}%</span>
                      <span className="text-[#52525B]">
                        (£
                        {(
                          (donationAmount * formData.platformFeePercentage) /
                          100
                        ).toFixed(2)}
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
              onClick={() => {
                const customPercentage = prompt(
                  'Enter custom platform fee percentage (0-100):'
                );
                if (customPercentage !== null) {
                  const percentage = parseFloat(customPercentage);
                  if (
                    !isNaN(percentage) &&
                    percentage >= 0 &&
                    percentage <= 100
                  ) {
                    setFormData({
                      ...formData,
                      platformFeeEnabled: percentage > 0,
                      platformFeePercentage: percentage,
                    });
                  }
                }
              }}
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
        </div>

        {/* Review Section */}
        <div className="w-full bg-[#FAFAFA] rounded-[14px] p-6 flex flex-col overflow-hidden">
          <div className="flex flex-col gap-4 w-full">
            <p className="text-base font-medium leading-6 text-[#11181C]">
              Review
            </p>
            <div className="flex flex-col gap-3 w-full">
              <div className="flex items-center justify-between text-sm font-normal leading-5 text-[#52525B] w-full">
                <span>Your donation amount</span>
                <span className="text-right">£{donationAmount.toFixed(2)}</span>
              </div>
              {formData.platformFeeEnabled && (
                <div className="flex items-center justify-between text-sm font-normal leading-5 text-[#52525B] w-full">
                  <span>
                    Masjid Al-Falah({formData.platformFeePercentage}%)
                  </span>
                  <span className="text-right">£{platformFee.toFixed(2)}</span>
                </div>
              )}
              <div className="h-px bg-[rgba(17,17,17,0.15)] w-full" />
              <div className="flex items-center justify-between text-sm font-medium leading-5 text-[#3F3F46] w-full">
                <span>Total amount to pay:</span>
                <span className="text-right">£{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-8 shrink-0">
          <div className="bg-[rgba(63,63,70,0.4)] flex h-12 items-center justify-center px-6 py-0 rounded-lg shrink-0 w-[212px]">
            <div className="flex gap-2 items-center justify-center shrink-0">
              <p className="text-base font-normal leading-6 text-white">
                Previous
              </p>
            </div>
          </div>
          <button
            onClick={onNext}
            disabled={donationAmount <= 0}
            className="bg-[#006FEE] flex h-12 items-center justify-center px-6 py-0 rounded-xl shrink-0 w-[212px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <p className="text-base font-normal leading-6 text-white">Next</p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 2: Details - Pixel-perfect Figma implementation
function Step2Details({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: DonationFormData;
  setFormData: (data: DonationFormData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [showManualAddress, setShowManualAddress] = useState(false);

  return (
    <div className="w-full flex flex-col gap-8 pt-8 pb-8 px-4 md:px-24 lg:px-96">
      {/* Header with Back Button */}
      <div className="flex flex-col gap-8 items-start w-full">
        {/* Back Button and Title */}
        <div className="flex gap-8 items-center">
          <button
            onClick={onBack}
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
          <h1 className="text-4xl font-semibold leading-10 text-[#27272A] text-center">
            Donate Online
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl font-medium leading-7 text-[#52525B] w-full">
          We trust Masjid System to handle the processing of our online
          payments. You will see their name mentioned on this form and in the
          address bar.
        </p>
      </div>

      {/* Email Field */}
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col h-[70px] items-start min-w-[116px] w-full">
          <div className="flex items-center pb-3 pr-2 w-full">
            <p className="text-xs font-normal leading-4 text-[#52525B]">
              Email address
            </p>
            <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
              <p className="text-sm font-normal leading-5 text-[#F31260]">*</p>
            </div>
          </div>
          <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
            <input
              type="email"
              value={formData.email}
              onChange={e =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="e.g. jsmith@yourmail.com"
              className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
            />
          </div>
        </div>
      </div>

      {/* Social Login */}
      <div className="flex flex-col gap-9 w-full">
        <div className="flex gap-3 items-center w-full">
          <div className="bg-[rgba(17,17,17,0.15)] flex-1 h-px" />
          <p className="text-xs font-normal leading-4 text-[#27272A] text-center">
            Sign In with
          </p>
          <div className="bg-[rgba(17,17,17,0.15)] flex-1 h-px" />
        </div>
        <div className="flex gap-8 items-start w-full">
          {/* Apple Button */}
          <button
            type="button"
            onClick={() => signIn('apple', { callbackUrl: '/donate' })}
            className="bg-white border border-[#E4E4E7] flex flex-1 items-center justify-center overflow-hidden pl-0 pr-3 rounded-lg cursor-pointer hover:bg-[#F4F4F5] transition-colors"
          >
            <div className="bg-white overflow-hidden rounded-[1px] w-10 h-10">
              <div className="p-2">
                <Image
                  src="/assets/donation/apple-logo.svg"
                  alt="Apple"
                  width={24}
                  height={24}
                />
              </div>
            </div>
            <p className="text-base text-black leading-normal tracking-[-0.32px]">
              Apple
            </p>
          </button>

          {/* Google Button */}
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/donate' })}
            className="bg-white border border-[#E4E4E7] flex flex-1 gap-2.5 items-center justify-center pl-px pr-2.5 py-px rounded-lg cursor-pointer hover:bg-[#F4F4F5] transition-colors"
          >
            <div className="bg-white rounded-[1px] w-[38px] h-[38px] p-2">
              <Image
                src="/assets/donation/google-logo.svg"
                alt="Google"
                width={22}
                height={22}
              />
            </div>
            <p className="text-sm font-medium text-[#757575] leading-normal">
              Google
            </p>
          </button>

          {/* Facebook Button */}
          <button
            type="button"
            onClick={() => signIn('facebook', { callbackUrl: '/donate' })}
            className="bg-white border border-[#E4E4E7] flex flex-1 items-center justify-center overflow-hidden pl-0 pr-3 rounded-lg cursor-pointer hover:bg-[#F4F4F5] transition-colors"
          >
            <div className="bg-white overflow-hidden rounded-[1px] w-10 h-10">
              <div className="p-2">
                <Image
                  src="/assets/donation/facebook-logo.svg"
                  alt="Facebook"
                  width={24}
                  height={24}
                />
              </div>
            </div>
            <p className="text-base text-[#1877F2] leading-normal tracking-[-0.32px]">
              Facebook
            </p>
          </button>
        </div>
      </div>

      {/* Name Fields */}
      <div className="flex flex-col gap-6 w-full">
        <div className="flex gap-6 items-center w-full">
          {/* First Name */}
          <div className="flex flex-1 flex-col h-[70px] items-start min-w-[116px]">
            <div className="flex items-center pb-3 pr-2 w-full">
              <p className="text-xs font-normal leading-4 text-[#52525B]">
                First Name
              </p>
              <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                <p className="text-sm font-normal leading-5 text-[#F31260]">
                  *
                </p>
              </div>
            </div>
            <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
              <input
                type="text"
                value={formData.firstName}
                onChange={e =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="First Name"
                className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="flex flex-1 flex-col h-[70px] items-start min-w-[116px]">
            <div className="flex items-center pb-3 pr-2 w-full">
              <p className="text-xs font-normal leading-4 text-[#52525B]">
                Last Name
              </p>
              <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                <p className="text-sm font-normal leading-5 text-[#F31260]">
                  *
                </p>
              </div>
            </div>
            <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
              <input
                type="text"
                value={formData.lastName}
                onChange={e =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Last Name"
                className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
              />
            </div>
          </div>
        </div>

        {/* Address Field */}
        <div className="flex flex-col gap-2 w-full">
          <div className="flex flex-col h-[70px] items-start min-w-[116px] w-full">
            <div className="flex items-center pb-3 pr-2 w-full">
              <p className="text-xs font-normal leading-4 text-[#52525B]">
                Find your address
              </p>
              <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                <p className="text-sm font-normal leading-5 text-[#F31260]">
                  *
                </p>
              </div>
            </div>
            <div className="bg-[#F4F4F5] flex items-center min-h-8 px-1.5 py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
              <div className="overflow-hidden w-5 h-5 relative shrink-0">
                <Image
                  src="/assets/donation/search-address.svg"
                  alt="Search"
                  width={20}
                  height={20}
                  className="absolute inset-[2%]"
                />
              </div>
              <input
                type="text"
                value={formData.address.line1}
                onChange={e =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, line1: e.target.value },
                  })
                }
                placeholder="Start typing your address"
                className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowManualAddress(!showManualAddress)}
            className="flex h-8 items-center justify-center px-3 rounded-xl cursor-pointer hover:bg-[#F4F4F5] transition-colors w-fit"
          >
            <span className="text-xs font-normal leading-4 text-black">
              Enter address manually
            </span>
          </button>
        </div>

        {/* Country Selector */}
        <div className="flex flex-col gap-4 w-full">
          <p className="text-xs font-normal leading-4 text-[#52525B]">
            Find your address
          </p>
          <div className="bg-[#F4F4F5] flex items-center justify-between overflow-hidden px-4 py-[13px] rounded-xl w-full">
            <p className="text-base font-normal leading-6 text-black">GB</p>
            <button
              type="button"
              className="flex h-10 items-center justify-center px-4 rounded-xl cursor-pointer hover:bg-white/50 transition-colors"
            >
              <div className="flex gap-2 items-center justify-center">
                <div className="overflow-hidden w-5 h-5">
                  <Image
                    src="/assets/donation/edit-icon.svg"
                    alt="Edit"
                    width={20}
                    height={20}
                  />
                </div>
                <span className="text-sm font-normal leading-5 text-black">
                  Edit
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Phone Field */}
        <div className="flex flex-col h-[70px] items-start min-w-[116px] w-full">
          <div className="flex items-center pb-3 pr-2 w-full">
            <p className="text-xs font-normal leading-4 text-[#52525B]">
              Phone number (optional)
            </p>
          </div>
          <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
            <input
              type="tel"
              value={formData.phone}
              onChange={e =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="+44"
              className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
            />
          </div>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-4">
        <label className="flex gap-2 items-center p-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={e =>
              setFormData({ ...formData, termsAccepted: e.target.checked })
            }
            className="w-5 h-5 rounded-md border-2 border-[#D4D4D8] text-[#006FEE] focus:ring-2 focus:ring-[#006FEE] cursor-pointer"
          />
          <span className="text-base font-normal leading-6 text-[#11181C]">
            I have read and agree to the Enthuse{' '}
            <a
              href="https://www.enthuse.com/legal/"
              className="text-lg underline text-black hover:no-underline"
            >
              terms & conditions
            </a>{' '}
            and{' '}
            <a
              href="https://www.enthuse.com/privacy/"
              className="text-lg underline text-black hover:no-underline"
            >
              privacy policy.
            </a>
          </span>
        </label>
        <label className="flex gap-2 items-center p-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.marketingConsent}
            onChange={e =>
              setFormData({ ...formData, marketingConsent: e.target.checked })
            }
            className="w-5 h-5 rounded-md border-2 border-[#D4D4D8] text-[#006FEE] focus:ring-2 focus:ring-[#006FEE] cursor-pointer"
          />
          <span className="text-base font-normal leading-6 text-[#11181C]">
            I'm happy to be contacted by Email
          </span>
        </label>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={
          !formData.email ||
          !formData.firstName ||
          !formData.lastName ||
          !formData.termsAccepted
        }
        className="bg-[#006FEE] flex h-12 items-center justify-center px-6 rounded-xl w-[212px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0055CC] transition-colors"
      >
        <span className="text-base font-normal leading-6 text-white">Next</span>
      </button>
    </div>
  );
}

// Step 3: Gift Aid
function Step3GiftAid({
  formData,
  setFormData,
  onNext,
  onBack,
}: {
  formData: DonationFormData;
  setFormData: (data: DonationFormData) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const donationAmount = formData.customAmount
    ? parseFloat(formData.customAmount)
    : formData.amount;
  const giftAidAmount = donationAmount * 0.25;
  const totalWithGiftAid = donationAmount + giftAidAmount;

  return (
    <div className="w-full flex flex-col gap-8 pt-8 pb-8 px-4 md:px-24 lg:px-96">
      {/* Header with Back Button */}
      <div className="flex flex-col gap-8 items-start w-full mb-6">
        {/* Back Button and Title */}
        <div className="flex gap-8 items-center">
          <button
            onClick={onBack}
            className="border-2 border-[#D4D4D8] border-solid flex h-12 items-center justify-center px-6 py-0 rounded-lg cursor-pointer hover:bg-[#F4F4F5] transition-colors"
          >
            <div className="flex gap-2 items-center justify-center">
              <div className="w-3 h-3 relative shrink-0">
                <Image
                  src="/assets/donation/arrow-left-black.svg"
                  alt="Back"
                  width={20}
                  height={20}
                  className="w-full h-full"
                />
              </div>
              <span className="text-base font-normal leading-6 text-black">
                Back
              </span>
            </div>
          </button>
          <h1 className="text-4xl font-semibold leading-10 text-[#27272A] text-center">
            Donate Online
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl font-medium leading-7 text-[#52525B] w-full">
          We trust Masjid System to handle the processing of our online
          payments. You will see their name mentioned on this form and in the
          address bar.
        </p>
      </div>

      {/* Gift Aid Section */}
      <div className="bg-[#FAFAFA] flex flex-col gap-8 p-8 rounded-xl w-full">
        {/* Gift Aid Header and Display */}
        <div className="flex items-end justify-between w-full">
          {/* Left: Gift Aid Calculation */}
          <div className="flex flex-col gap-4 w-[415px]">
            <h3 className="text-base font-bold leading-6 text-[#3F3F46]">
              Add Gift Aid and boost your donation at no extra cost
            </h3>
            <div className="flex gap-[22px] items-center">
              {/* Before Gift Aid */}
              <div className="flex flex-col gap-[5px] items-center text-center w-[120px]">
                <p className="text-2xl font-medium leading-8 text-black">
                  £{donationAmount.toFixed(2)}
                </p>
                <p className="text-xs font-normal leading-4 text-[#52525B]">
                  Your donation
                </p>
              </div>

              {/* Arrow */}
              <div className="w-[83px] h-3 relative">
                <Image
                  src="/assets/donation/arrow-right.svg"
                  alt="Arrow"
                  width={83}
                  height={12}
                  className="w-full h-full"
                />
              </div>

              {/* After Gift Aid */}
              <div className="flex flex-col gap-[5px] items-center text-center w-[120px]">
                <p className="text-2xl font-medium leading-8 text-black">
                  £{totalWithGiftAid.toFixed(2)}
                </p>
                <p className="text-xs font-normal leading-4 text-[#52525B]">
                  With Gift Aid
                </p>
              </div>
            </div>
          </div>

          {/* Right: Gift Aid Logo */}
          <div className="flex flex-col h-[50px] w-[125px]">
            <div className="relative w-[120px] h-12">
              <Image
                src="/assets/donation/giftaid-logo.png"
                alt="Gift Aid"
                width={120}
                height={48}
                className="object-cover mix-blend-multiply"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 w-full">
          <p className="text-sm font-normal leading-5 text-[#52525B]">
            I am a UK taxpayer and understand that if I pay less Income Tax
            and/or Capital Gains Tax in the current tax year than the amount of
            Gift Aid claimed on all my donations, it is my responsibility to pay
            any difference.
          </p>
          <Link
            href="https://www.gov.uk/donating-to-charity/gift-aid"
            target="_blank"
            className="flex gap-1 items-center pl-0 pr-1 py-0 shrink-0 hover:underline"
          >
            <span className="text-sm font-normal leading-5 text-[#11181C]">
              Find out more about Gift Aid.
            </span>
            <div className="overflow-hidden w-3 h-3 relative shrink-0">
              <Image
                src="/assets/donation/external-link.svg"
                alt="external"
                width={20}
                height={20}
                className="object-cover mix-blend-multiply"
              />
            </div>
          </Link>
        </div>

        {/* Gift Aid Options */}
        <div className="flex flex-col gap-4 w-full">
          {/* Yes Option */}
          <div className="flex gap-2 items-center p-2">
            <label className="flex gap-2 items-center cursor-pointer">
              <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start">
                <input
                  type="radio"
                  name="giftAid"
                  checked={formData.giftAidEnabled}
                  onChange={() =>
                    setFormData({ ...formData, giftAidEnabled: true })
                  }
                  className={`appearance-none col-1 row-1 ml-0 mt-0 w-5 h-5 rounded-full border-2 cursor-pointer ${
                    formData.giftAidEnabled
                      ? 'bg-[#006FEE] border-[#006FEE]'
                      : 'bg-white border-[#D4D4D8]'
                  }`}
                />
                {formData.giftAidEnabled && (
                  <div className="col-1 row-1 w-[6.22px] h-[4.44px] ml-[7px] mt-[8px] relative pointer-events-none">
                    <Image
                      src="/assets/donation/checkmark-icon.svg"
                      alt="Check"
                      width={7}
                      height={5}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
              <span className="text-base font-normal leading-6 text-[#11181C]">
                Yes, please Gift Aid this donation
              </span>
            </label>
          </div>

          {/* Declaration Box (shown when Yes is selected) */}
          {formData.giftAidEnabled && (
            <div className="bg-[#F4F4F5] flex flex-col gap-3 p-4 rounded-lg w-full">
              <p className="text-base font-normal leading-6 text-black">
                Please read and confirm the following statements:
              </p>
              <div className="flex flex-col gap-2 w-full">
                <label className="flex gap-2 items-start p-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.giftAidDeclaration}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        giftAidDeclaration: e.target.checked,
                      })
                    }
                    className="w-5 h-5 mt-0.5 rounded-md border-2 border-[#D4D4D8] text-[#006FEE] focus:ring-2 focus:ring-[#006FEE] cursor-pointer flex-shrink-0"
                  />
                  <span className="flex-1 text-base font-normal leading-6 text-[#11181C]">
                    This is my own money. I am not paying in donations made by a
                    third party, e.g. money collected at an event, the pub, a
                    company donation or a donation from a friend or family
                    member.
                  </span>
                </label>
                <label className="flex gap-2 items-start p-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-0.5 rounded-md border-2 border-[#D4D4D8] text-[#006FEE] focus:ring-2 focus:ring-[#006FEE] cursor-pointer flex-shrink-0"
                  />
                  <span className="flex-1 text-base font-normal leading-6 text-[#11181C]">
                    This donation is not made as part of a sweepstake, raffle or
                    lottery and I am not receiving anything in return of it,
                    e.g. book, auction prize, ticket to an event.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* No Option */}
          <div className="flex gap-2 items-center p-2 w-full">
            <label className="flex gap-2 items-center cursor-pointer">
              <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start">
                <input
                  type="radio"
                  name="giftAid"
                  checked={!formData.giftAidEnabled}
                  onChange={() =>
                    setFormData({ ...formData, giftAidEnabled: false })
                  }
                  className={`appearance-none col-1 row-1 ml-0 mt-0 w-5 h-5 rounded-full border-2 cursor-pointer ${
                    !formData.giftAidEnabled
                      ? 'bg-[#006FEE] border-[#006FEE]'
                      : 'bg-white border-[#D4D4D8]'
                  }`}
                />
                {!formData.giftAidEnabled && (
                  <div className="col-1 row-1 w-[6.22px] h-[4.44px] ml-[7px] mt-[8px] relative pointer-events-none">
                    <Image
                      src="/assets/donation/checkmark-icon.svg"
                      alt="Check"
                      width={7}
                      height={5}
                      className="w-full h-full"
                    />
                  </div>
                )}
              </div>
              <span className="text-base font-normal leading-6 text-[#11181C]">
                No, please do not Gift Aid this donation
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={formData.giftAidEnabled && !formData.giftAidDeclaration}
        className="bg-[#006FEE] flex h-12 items-center justify-center px-6 rounded-xl w-[212px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0055CC] transition-colors"
      >
        <span className="text-base font-normal leading-6 text-white">Next</span>
      </button>
    </div>
  );
}

// Step 4: Payment (Stripe)
function Step4Payment({
  formData,
  onBack,
  clientSecret,
}: {
  formData: DonationFormData;
  onBack: () => void;
  clientSecret: string;
}) {
  // When using individual CardElements (CardNumberElement, etc.),
  // we don't pass clientSecret to Elements - it's only for PaymentElement
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        formData={formData}
        onBack={onBack}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}

function PaymentForm({
  formData,
  onBack,
  clientSecret,
}: {
  formData: DonationFormData;
  onBack: () => void;
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    'direct-debit' | 'card' | 'paypal'
  >('card');
  const [termsAccepted, setTermsAccepted] = useState(false);

  const donationAmount = formData.customAmount
    ? parseFloat(formData.customAmount)
    : formData.amount;
  const platformFee = formData.platformFeeEnabled
    ? (donationAmount * formData.platformFeePercentage) / 100
    : 0;
  const totalAmount = donationAmount + platformFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    // For card payments with individual card elements
    if (paymentMethod === 'card') {
      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        setError('Card element not found. Please refresh and try again.');
        setIsProcessing(false);
        return;
      }

      const { error: submitError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${formData.firstName} ${formData.lastName}`,
              email: formData.email,
              phone: formData.phone,
              address: {
                line1: formData.address.line1,
                line2: formData.address.line2,
                city: formData.address.city,
                postal_code: formData.address.postcode,
                country: formData.address.country,
              },
            },
          },
        });

      if (submitError) {
        setError(submitError.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
      } else if (paymentIntent?.status === 'succeeded') {
        // Redirect to completion page
        window.location.href = `/donate/complete?payment_intent=${paymentIntent.id}&redirect_status=succeeded`;
      }
    } else {
      // For PaymentElement (other payment methods)
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate/complete`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pt-8 pb-8 px-4 md:px-24 lg:px-96">
      {/* Header with Back Button */}
      <div className="flex flex-col gap-8 items-start w-full mb-6">
        {/* Back Button and Title */}
        <div className="flex gap-8 items-center">
          <button
            onClick={onBack}
            className="border-2 border-[#D4D4D8] border-solid flex h-12 items-center justify-center px-6 py-0 rounded-lg cursor-pointer hover:bg-[#F4F4F5] transition-colors"
          >
            <div className="flex gap-2 items-center justify-center">
              <div className="w-3 h-3 relative shrink-0">
                <Image
                  src="/assets/donation/arrow-left-black.svg"
                  alt="Back"
                  width={20}
                  height={20}
                  className="w-full h-full"
                />
              </div>
              <span className="text-base font-normal leading-6 text-black">
                Back
              </span>
            </div>
          </button>
          <h1 className="text-4xl font-semibold leading-10 text-[#27272A] text-center">
            Donate Online
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl font-medium leading-7 text-[#52525B] w-full">
          We trust Masjid System to handle the processing of our online
          payments. You will see their name mentioned on this form and in the
          address bar.
        </p>
      </div>

      {/* Payment Section Container */}
      <div className="bg-[#FAFAFA] flex flex-col gap-8 p-8 rounded-xl w-full">
        {/* Payment Method Selection */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm font-normal leading-5 text-black">
              Payment Method
            </p>
            {/* Card Logos - only show for card payment */}
            {paymentMethod === 'card' && (
              <div className="flex gap-2 items-center h-5">
                <div className="h-5 w-[30px] relative">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 30 20"
                    fill="none"
                  >
                    <rect width="30" height="20" rx="2" fill="#1434CB" />
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill="white"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      VISA
                    </text>
                  </svg>
                </div>
                <div className="h-5 w-[30px] relative">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 30 20"
                    fill="none"
                  >
                    <rect width="30" height="20" rx="2" fill="#EB001B" />
                    <circle cx="12" cy="10" r="6" fill="#FF5F00" />
                    <circle cx="18" cy="10" r="6" fill="#F79E1B" />
                  </svg>
                </div>
                <div className="h-5 w-[30px] relative">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 30 20"
                    fill="none"
                  >
                    <rect width="30" height="20" rx="2" fill="#006FCF" />
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill="white"
                      fontSize="6"
                      fontWeight="bold"
                    >
                      AMEX
                    </text>
                  </svg>
                </div>
                <div className="h-5 w-[30px] relative">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 30 20"
                    fill="none"
                  >
                    <rect width="30" height="20" rx="2" fill="#FF6000" />
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill="white"
                      fontSize="5"
                      fontWeight="bold"
                    >
                      DISC
                    </text>
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4 w-full">
            {/* Direct Debit */}
            <button
              type="button"
              onClick={() => setPaymentMethod('direct-debit')}
              className="bg-[#F4F4F5] flex flex-1 items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E4E4E7] transition-colors"
            >
              <div className="flex gap-2 items-center p-2">
                <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start">
                  <div
                    className={`col-1 row-1 ml-0 mt-0 w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'direct-debit'
                        ? 'bg-[#006FEE] border-[#006FEE]'
                        : 'border-[#D4D4D8]'
                    }`}
                  />
                  {paymentMethod === 'direct-debit' && (
                    <div className="col-1 row-1 w-[6.22px] h-[4.44px] ml-[5px] mt-[6px] relative pointer-events-none">
                      <Image
                        src="/assets/donation/checkmark-icon.svg"
                        alt="Check"
                        width={7}
                        height={5}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <span className="text-sm font-normal leading-5 text-[#11181C]">
                  Direct Debit
                </span>
              </div>
              <div className="w-4 h-4 relative shrink-0">
                <Image
                  src="/assets/donation/direct-debit-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>

            {/* Debit/Credit Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className="bg-[#F4F4F5] flex flex-1 items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E4E4E7] transition-colors"
            >
              <div className="flex gap-2 items-center p-2">
                <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start">
                  <div
                    className={`col-1 row-1 ml-0 mt-0 w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'card'
                        ? 'bg-[#006FEE] border-[#006FEE]'
                        : 'border-[#D4D4D8]'
                    }`}
                  />
                  {paymentMethod === 'card' && (
                    <div className="col-1 row-1 w-[6.22px] h-[4.44px] ml-[5px] mt-[6px] relative pointer-events-none">
                      <Image
                        src="/assets/donation/checkmark-icon.svg"
                        alt="Check"
                        width={7}
                        height={5}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <span className="text-sm font-normal leading-5 text-[#11181C]">
                  Debit/Credit card
                </span>
              </div>
              <div className="w-4 h-4 relative shrink-0">
                <Image
                  src="/assets/donation/card-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>

            {/* PayPal */}
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className="bg-[#F4F4F5] flex flex-1 items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E4E4E7] transition-colors"
            >
              <div className="flex gap-2 items-center p-2">
                <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start">
                  <div
                    className={`col-1 row-1 ml-0 mt-0 w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'paypal'
                        ? 'bg-[#006FEE] border-[#006FEE]'
                        : 'border-[#D4D4D8]'
                    }`}
                  />
                  {paymentMethod === 'paypal' && (
                    <div className="col-1 row-1 w-[6.22px] h-[4.44px] ml-[5px] mt-[6px] relative pointer-events-none">
                      <Image
                        src="/assets/donation/checkmark-icon.svg"
                        alt="Check"
                        width={7}
                        height={5}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <span className="text-sm font-normal leading-5 text-[#11181C]">
                  Paypal
                </span>
              </div>
              <div className="w-4 h-4 relative shrink-0">
                <Image
                  src="/assets/donation/paypal-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Form Fields Container */}
        <form
          onSubmit={handleSubmit}
          className="border border-[#D4D4D8] flex flex-col gap-6 p-6 rounded-xl w-full"
        >
          {paymentMethod === 'direct-debit' ? (
            <>
              {/* Direct Debit Form Fields */}
              {/* Email */}
              <div className="flex flex-col h-[70px] items-start w-full">
                <div className="flex items-center pb-3 pr-2 w-full">
                  <p className="text-xs font-normal leading-4 text-[#52525B]">
                    Email address
                  </p>
                  <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                    <p className="text-sm font-normal leading-5 text-[#F31260]">
                      *
                    </p>
                  </div>
                </div>
                <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                  <input
                    type="email"
                    value={formData.email}
                    placeholder="e.g. jsmith@yourmail.com"
                    readOnly
                    className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
                  />
                </div>
              </div>

              {/* Account Holder Name */}
              <div className="flex flex-col h-[70px] items-start w-full">
                <div className="flex items-center pb-3 pr-2 w-full">
                  <p className="text-xs font-normal leading-4 text-[#52525B]">
                    Name of account holder:
                  </p>
                  <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                    <p className="text-sm font-normal leading-5 text-[#F31260]">
                      *
                    </p>
                  </div>
                </div>
                <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                  <input
                    type="text"
                    placeholder="Please enter the name of account holder"
                    className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
                  />
                </div>
              </div>

              {/* Sort Code */}
              <div className="flex flex-col h-[70px] items-start w-full">
                <div className="flex items-center pb-3 pr-2 w-full">
                  <p className="text-xs font-normal leading-4 text-[#52525B]">
                    Sort code:
                  </p>
                  <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                    <p className="text-sm font-normal leading-5 text-[#F31260]">
                      *
                    </p>
                  </div>
                </div>
                <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                  <input
                    type="text"
                    placeholder="Please enter your sort code e.g., 10-20-30"
                    className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
                  />
                </div>
              </div>

              {/* Account Number */}
              <div className="flex flex-col h-[70px] items-start w-full">
                <div className="flex items-center pb-3 pr-2 w-full">
                  <p className="text-xs font-normal leading-4 text-[#52525B]">
                    Account Number
                  </p>
                  <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                    <p className="text-sm font-normal leading-5 text-[#F31260]">
                      *
                    </p>
                  </div>
                </div>
                <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                  <input
                    type="text"
                    placeholder="Please enter your account number"
                    className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
                  />
                </div>
              </div>
            </>
          ) : paymentMethod === 'card' ? (
            <>
              {/* Card Payment Form Fields with Stripe Elements */}
              <div className="flex flex-col gap-[30px] w-full">
                {/* Card Number */}
                <div className="flex flex-col items-start w-full">
                  <div className="flex items-center pb-3 pr-2 w-full">
                    <p className="text-xs font-normal leading-4 text-[#52525B]">
                      Card Number
                    </p>
                  </div>
                  <div className="bg-[#F4F4F5] flex items-center min-h-[44px] px-4 py-3 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                    <div className="w-full">
                      <CardNumberElement
                        options={{
                          style: {
                            base: {
                              fontSize: '16px',
                              color: '#11181C',
                              '::placeholder': { color: '#71717A' },
                              fontFamily: 'inherit',
                            },
                            invalid: { color: '#F31260' },
                          },
                          showIcon: true,
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Expiry and CVC */}
                <div className="flex gap-8 w-full">
                  {/* Expiry */}
                  <div className="flex flex-1 flex-col items-start">
                    <div className="flex items-center pb-3 pr-2 w-full">
                      <p className="text-xs font-normal leading-4 text-[#52525B]">
                        Expiry
                      </p>
                    </div>
                    <div className="bg-[#F4F4F5] flex items-center min-h-[44px] px-4 py-3 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                      <div className="w-full">
                        <CardExpiryElement
                          options={{
                            style: {
                              base: {
                                fontSize: '16px',
                                color: '#11181C',
                                '::placeholder': { color: '#71717A' },
                                fontFamily: 'inherit',
                              },
                              invalid: { color: '#F31260' },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* CVC */}
                  <div className="flex flex-1 flex-col items-start">
                    <div className="flex items-center pb-3 pr-2 w-full">
                      <p className="text-xs font-normal leading-4 text-[#52525B]">
                        CVC
                      </p>
                    </div>
                    <div className="bg-[#F4F4F5] flex items-center min-h-[44px] px-4 py-3 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                      <div className="w-full">
                        <CardCvcElement
                          options={{
                            style: {
                              base: {
                                fontSize: '16px',
                                color: '#11181C',
                                '::placeholder': { color: '#71717A' },
                                fontFamily: 'inherit',
                              },
                              invalid: { color: '#F31260' },
                            },
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          ) : null}

          {/* Billing Address Review */}
          <div className="flex flex-col gap-4 w-full">
            <p className="text-xs font-normal leading-4 text-[#52525B]">
              Review your billing address:
            </p>
            <div className="bg-[#F4F4F5] flex items-center justify-between px-4 py-[13px] rounded-xl w-full">
              <p className="text-base font-normal leading-6 text-black whitespace-nowrap overflow-hidden text-ellipsis">
                {formData.address.line1}, {formData.address.city},{' '}
                {formData.address.postcode}, {formData.address.country}
              </p>
              <button
                type="button"
                className="flex h-10 items-center justify-center px-4 rounded-xl cursor-pointer hover:bg-white/50 transition-colors shrink-0"
              >
                <div className="flex gap-2 items-center justify-center">
                  <div className="overflow-hidden w-5 h-5">
                    <Image
                      src="/assets/donation/edit-icon.svg"
                      alt="Edit"
                      width={20}
                      height={20}
                    />
                  </div>
                  <span className="text-sm font-normal leading-5 text-black">
                    Edit
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Terms Checkbox */}
          <label className="flex gap-2 items-start p-2 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded-md border-2 border-[#D4D4D8] text-[#006FEE] focus:ring-2 focus:ring-[#006FEE] cursor-pointer flex-shrink-0"
            />
            <span className="flex-1 text-base font-normal leading-6 text-[#11181C]">
              I understand that Masjid Al-Falah has partnered with Stripe, who
              collects Direct Debits on behalf of Masjid Al-Falah and confirm
              that I am the account holder and the only person required to
              authorise debits from this account.
            </span>
          </label>
        </form>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!stripe || isProcessing || !termsAccepted}
        className="bg-[#006FEE] flex h-12 items-center justify-center px-6 rounded-xl w-[212px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0055CC] transition-colors"
      >
        <span className="text-base font-normal leading-6 text-white">
          {isProcessing
            ? 'Processing...'
            : paymentMethod === 'card'
              ? `Pay £${totalAmount.toFixed(2)}`
              : 'Next'}
        </span>
      </button>
    </div>
  );
}

// Step 5: Complete
function Step5Complete() {
  return (
    <div className="max-w-2xl mx-auto p-6 text-center">
      <div className="text-6xl mb-6">🎉</div>
      <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
      <p className="text-gray-600 mb-8">
        Your donation has been processed successfully. May Allah reward you
        abundantly.
      </p>
      <p className="text-gray-600 mb-8">
        A receipt has been sent to your email address.
      </p>

      <div className="bg-blue-50 rounded-lg p-6 mb-8">
        <p className="text-lg font-medium">
          &quot;Whoever guides someone to goodness will have a reward like the
          one who did it.&quot;
        </p>
        <p className="text-sm text-gray-600 mt-2">— Prophet Muhammad ﷺ</p>
      </div>

      <div className="flex gap-4 justify-center">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg cursor-pointer">
          Share this page
        </button>
        <a
          href="/"
          className="bg-gray-200 hover:bg-gray-300 px-6 py-3 rounded-lg"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}

// Main Donation Form
export default function DonationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [formData, setFormData] = useState<DonationFormData>({
    frequency: 'one-time',
    donationType: 'general',
    amount: 15,
    customAmount: '',
    platformFeeEnabled: true,
    platformFeePercentage: 12.5,
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: {
      line1: '',
      line2: '',
      city: '',
      postcode: '',
      country: 'GB',
    },
    isAnonymous: false,
    displayName: '',
    marketingConsent: false,
    termsAccepted: false,
    giftAidEnabled: false,
    giftAidDeclaration: false,
  });

  const handleCreatePayment = async () => {
    try {
      const donationAmount = formData.customAmount
        ? parseFloat(formData.customAmount)
        : formData.amount;

      console.log('Creating payment with data:', {
        amount: Math.round(donationAmount * 100),
        frequency: formData.frequency,
        email: formData.email,
      });

      const response = await fetch('/api/donations/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: Math.round(donationAmount * 100), // Convert to pence
          currency: 'GBP',
          frequency: formData.frequency,
          donationType: formData.donationType,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          isAnonymous: formData.isAnonymous,
          displayName:
            formData.displayName ||
            `${formData.firstName} ${formData.lastName}`,
          giftAid: formData.giftAidEnabled,
          platformFeePercentage: formData.platformFeeEnabled
            ? formData.platformFeePercentage
            : 0,
          marketingConsent: formData.marketingConsent,
        }),
      });

      const data = await response.json();
      console.log('Payment API response:', data);
      console.log('clientSecret value:', data.clientSecret);
      console.log('clientSecret type:', typeof data.clientSecret);
      console.log('success value:', data.success);

      // Check for success - API returns { success: true, clientSecret: '...' }
      if (data.success === true && data.clientSecret) {
        console.log('✅ Payment created successfully, advancing to step 4');
        setClientSecret(data.clientSecret);
        setCurrentStep(4);
      } else {
        console.error('❌ Failed to create payment:', data.error || data);
        alert(
          `Payment creation failed: ${data.error || 'Unknown error. Check console for details.'}`
        );
      }
    } catch (error) {
      console.error('Payment creation exception:', error);
      alert(
        `Payment error: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  const handleNextStep = () => {
    if (currentStep === 3) {
      // Before payment, create the payment intent
      handleCreatePayment();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="min-h-screen bg-white mb-20">
      <DonationStepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <SelectDonationStep
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextStep}
        />
      )}

      {currentStep === 2 && (
        <Step2Details
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />
      )}

      {currentStep === 3 && (
        <Step3GiftAid
          formData={formData}
          setFormData={setFormData}
          onNext={handleNextStep}
          onBack={handlePrevStep}
        />
      )}

      {currentStep === 4 && clientSecret && (
        <Step4Payment
          formData={formData}
          onBack={handlePrevStep}
          clientSecret={clientSecret}
        />
      )}

      {currentStep === 5 && <Step5Complete />}
    </div>
  );
}
