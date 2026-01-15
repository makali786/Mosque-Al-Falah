'use client';

import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

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
        {steps.map((step) => {
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;

          return (
            <div
              key={step.number}
              className="flex items-center gap-2 py-3.5"
            >
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

  const frequencyLabel = frequencies.find(f => f.value === formData.frequency)?.label;

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
            We trust Masjid System to handle the processing of our online payments. You will see their name mentioned on this form and in the address bar.
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
                {frequencies.map((freq) => {
                  const isActive = formData.frequency === freq.value;
                  return (
                    <button
                      key={freq.value}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          frequency: freq.value as DonationFormData['frequency'],
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
                          setFormData({ ...formData, donationType: e.target.value })
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
                <svg className="w-[16px] h-[16px] shrink-0" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 6L8 10L12 6" stroke="#11181C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
                {quickAmounts.map((amount) => {
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
                          <p className={`text-[18px] font-semibold leading-[28px] shrink-0 ${
                            isSelected ? 'text-[#18181B]' : 'text-[#3F3F46]'
                          }`}>
                            £{amount}
                          </p>
                          {formData.frequency !== 'one-time' && (
                            <p className={`flex-[1_0_0] text-[12px] font-normal leading-[16px] h-[20px] min-h-px min-w-px ${
                              isSelected ? 'text-[#3F3F46]' : 'text-[#71717A]'
                            }`}>
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
                  <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
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
                <div className="flex flex-col justify-center relative shrink-0 text-[14px] text-(--colors/layout/foreground,#11181c)" style={{ fontVariationSettings: "'wdth' 100" }}>
                  <p className="leading-5 whitespace-pre">
                    {formData.isAnonymous
                      ? 'Anonymous kind soul'
                      : formData.displayName || 'Anonymous kind soul'}
                  </p>
                </div>
                <div className="flex flex-col justify-center relative shrink-0 text-[12px] text-[#A1A1AA]" style={{ fontVariationSettings: "'wdth' 100" }}>
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
        <div className="w-full bg-[#FAFAFA] rounded-[14px] px-6 py-12 flex gap-8 overflow-hidden">
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
                <p className="text-sm font-normal leading-5 text-[#3F3F46]">
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
                <p className="flex-1 text-sm font-normal leading-5 text-[#3F3F46]">
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
                <p className="flex-1 text-sm font-normal leading-5 text-[#3F3F46]">
                  Charities deserve the best technology
                </p>
              </div>
            </div>
          </div>

          {/* Right side with slider */}
          <div className="flex flex-col gap-2 h-[188px] w-[314px] items-center justify-end shrink-0">
            {/* Slider placeholder */}
            <div className="flex flex-col gap-2 items-center justify-center px-0 py-[3px] w-full">
              <div className="flex flex-col items-start w-full">
                <div className="bg-[#E4E4E7] rounded-full px-4 py-0.5 flex items-center justify-between w-full relative">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-1 h-1 rounded-full shrink-0" style={{
                      backgroundColor: i === 2 ? '#F9C97C' : '#D4D4D8'
                    }} />
                  ))}
                </div>
              </div>
              {/* Tooltip */}
              <div className="flex flex-col gap-2 items-center w-full">
                <div className="flex flex-col items-center w-full">
                  <div className="bg-[#FAFAFA] rounded-lg shadow-[0px_0px_15px_0px_rgba(0,0,0,0.03),0px_2px_30px_0px_rgba(0,0,0,0.08),0px_0px_1px_0px_rgba(0,0,0,0.3)] flex flex-col items-center justify-center overflow-hidden shrink-0">
                    <div className="bg-[#F5A524] px-3 py-1 flex items-center justify-center w-full">
                      <p className="text-xs font-normal leading-4 text-[#FAFAFA]">RECOMMENDED</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 px-2 py-1 text-sm font-normal leading-5 text-[#18181B] w-full">
                      <span>12.5%</span>
                      <span>(£{(donationAmount * 0.125).toFixed(2)})</span>
                    </div>
                  </div>
                </div>
                {/* Slider thumb */}
                <div className="w-4 h-4 relative shrink-0">
                  <div className="absolute bg-white inset-[-25%] rounded-full" />
                  <div className="absolute bg-white border-2 border-[#F5A524] rounded-full inset-0" />
                </div>
              </div>
            </div>

            <button className="flex items-center justify-center px-4 py-0 h-10 rounded-xl cursor-pointer">
              <p className="text-sm font-normal leading-5 text-black">
                Other amount
              </p>
            </button>

            <div className="bg-[#0E793C] rounded-lg px-4 py-3 flex items-center justify-center overflow-hidden w-full">
              <p className="flex-1 text-xs leading-4 text-[#E8FAF0]">
                <span className="font-bold">75% of donors</span>
                {' have helped keep Masjid System '}
                <span className="font-bold">free for our charity in last the 24 hours</span>
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
                  <span>Masjid Al-Falah({formData.platformFeePercentage}%)</span>
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
            <p className="text-base font-normal leading-6 text-white">
              Next
            </p>
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 2: Details
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
  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 mb-4 cursor-pointer"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">Donate Online</h1>
      <p className="text-gray-600 mb-8">
        We trust Masjid System to handle the processing of our online payments.
      </p>

      {/* Email */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Email address <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          placeholder="e.g. jsmith@yourmail.com"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Donated with Masjid Al-Falah before?{' '}
          <Link href="/donate/login" className="text-blue-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>

      {/* Social Login */}
      <div className="mb-6">
        <p className="text-center text-gray-500 mb-4">Or Sign in with</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => signIn('apple', { callbackUrl: '/donate' })}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <span className="font-medium">Apple</span>
          </button>
          <button
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/donate' })}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="font-medium">Google</span>
          </button>
          <button
            type="button"
            onClick={() => signIn('facebook', { callbackUrl: '/donate' })}
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-[#1877F2] cursor-pointer"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
            <span className="font-medium">Facebook</span>
          </button>
        </div>
      </div>

      {/* Name */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.firstName}
            onChange={e =>
              setFormData({ ...formData, firstName: e.target.value })
            }
            placeholder="First Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.lastName}
            onChange={e =>
              setFormData({ ...formData, lastName: e.target.value })
            }
            placeholder="Last Name"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Address */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Find your address <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.address.line1}
          onChange={e =>
            setFormData({
              ...formData,
              address: { ...formData.address, line1: e.target.value },
            })
          }
          placeholder="🔍 Start typing your address"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Phone */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Phone number (optional)
        </label>
        <input
          type="tel"
          value={formData.phone}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+44"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Terms & Marketing */}
      <div className="space-y-4 mb-6">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.termsAccepted}
            onChange={e =>
              setFormData({ ...formData, termsAccepted: e.target.checked })
            }
            className="mt-1"
          />
          <span className="text-sm">
            I have read and agree to the Enthuse{' '}
            <a href="#" className="text-blue-500 underline">
              terms & conditions
            </a>{' '}
            and{' '}
            <a href="#" className="text-blue-500 underline">
              privacy policy
            </a>
            .
          </span>
        </label>
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={formData.marketingConsent}
            onChange={e =>
              setFormData({ ...formData, marketingConsent: e.target.checked })
            }
            className="mt-1"
          />
          <span className="text-sm">
            I&apos;m happy to be contacted by Email
          </span>
        </label>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={
            !formData.email ||
            !formData.firstName ||
            !formData.lastName ||
            !formData.termsAccepted
          }
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
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
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 mb-4 cursor-pointer"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">Donate Online</h1>
      <p className="text-gray-600 mb-8">
        We trust Masjid System to handle the processing of our online payments.
      </p>

      {/* Gift Aid Booster Display */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-medium mb-4">
          Add Gift Aid and boost your donation at no extra cost
        </h3>
        <div className="flex items-center gap-8 mb-4">
          <div className="text-center">
            <p className="text-3xl font-bold">£{donationAmount.toFixed(2)}</p>
            <p className="text-sm text-gray-500">Your donation</p>
          </div>
          <div className="text-2xl">→</div>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              £{totalWithGiftAid.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">With Gift Aid</p>
          </div>
          <div className="text-4xl italic text-gray-300">gift aid it</div>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          I am a UK taxpayer and understand that if I pay less Income Tax and/or
          Capital Gains Tax in the current tax year than the amount of Gift Aid
          claimed on all my donations, it is my responsibility to pay any
          difference.
          <br />
          <br />
          <a href="#" className="text-blue-500">
            Find out more about Gift Aid →
          </a>
        </p>

        {/* Gift Aid Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="giftAid"
              checked={formData.giftAidEnabled}
              onChange={() =>
                setFormData({ ...formData, giftAidEnabled: true })
              }
              className="w-5 h-5 text-blue-500"
            />
            <span>Yes, please Gift Aid this donation</span>
          </label>
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="giftAid"
              checked={!formData.giftAidEnabled}
              onChange={() =>
                setFormData({ ...formData, giftAidEnabled: false })
              }
              className="w-5 h-5"
            />
            <span>No, please do not Gift Aid this donation</span>
          </label>
        </div>
      </div>

      {/* Gift Aid Declaration */}
      {formData.giftAidEnabled && (
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <h4 className="font-medium mb-4">
            Please read and confirm the following statements:
          </h4>
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={formData.giftAidDeclaration}
              onChange={e =>
                setFormData({
                  ...formData,
                  giftAidDeclaration: e.target.checked,
                })
              }
              className="mt-1"
            />
            <span className="text-sm">
              This is my own money. I am not paying in donations made by a third
              party, e.g. money collected at an event, the pub, a company
              donation or a donation from a friend or family member.
            </span>
          </label>
          <label className="flex items-start gap-3 mt-4">
            <input type="checkbox" className="mt-1" />
            <span className="text-sm">
              This donation is not made as part of a sweepstakes, raffle or
              lottery and I am not receiving anything in return of it, e.g.
              book, auction prize, ticket to an event.
            </span>
          </label>
        </div>
      )}

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium cursor-pointer"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={formData.giftAidEnabled && !formData.giftAidDeclaration}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 cursor-pointer"
        >
          Next
        </button>
      </div>
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
  return (
    <Elements stripe={stripePromise} options={{ clientSecret }}>
      <PaymentForm formData={formData} onBack={onBack} />
    </Elements>
  );
}

function PaymentForm({
  formData,
  onBack,
}: {
  formData: DonationFormData;
  onBack: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 mb-4 cursor-pointer"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-2">Donate Online</h1>
      <p className="text-gray-600 mb-8">
        We trust Masjid System to handle the processing of our online payments.
      </p>

      {/* Payment Methods Header */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Payment Method</h3>
          <div className="flex items-center gap-2">
            <img src="/images/visa.svg" alt="Visa" className="h-6" />
            <img
              src="/images/mastercard.svg"
              alt="Mastercard"
              className="h-6"
            />
            <img src="/images/amex.svg" alt="Amex" className="h-6" />
          </div>
        </div>

        {/* Stripe Payment Element */}
        <form onSubmit={handleSubmit}>
          <PaymentElement />

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {/* Billing Address */}
          <div className="mt-6">
            <p className="text-sm text-gray-600">
              <strong>Billing address:</strong>
              <br />
              {formData.address.line1}, {formData.address.city},{' '}
              {formData.address.postcode}, {formData.address.country}
              <button className="text-blue-500 ml-2">✏️ Edit</button>
            </p>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-3 mt-6 text-sm">
            <input type="checkbox" className="mt-1" defaultChecked />
            <span>
              I understand that Masjid Al-Falah has partnered with Stripe, who
              collects Direct Debits on behalf of Masjid Al-Falah and confirm
              that I am the account holder and the only person required to
              authorise debits from this account.
            </span>
          </label>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-medium text-lg disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? 'Processing...' : `Pay £${totalAmount.toFixed(2)}`}
          </button>
        </form>
      </div>
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
    const donationAmount = formData.customAmount
      ? parseFloat(formData.customAmount)
      : formData.amount;

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
          formData.displayName || `${formData.firstName} ${formData.lastName}`,
        giftAid: formData.giftAidEnabled,
        platformFeePercentage: formData.platformFeeEnabled
          ? formData.platformFeePercentage
          : 0,
        marketingConsent: formData.marketingConsent,
      }),
    });

    const data = await response.json();

    if (data.clientSecret) {
      setClientSecret(data.clientSecret);
      setCurrentStep(4);
    } else {
      console.error('Failed to create payment:', data.error);
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
    <div className="min-h-screen bg-white">
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
