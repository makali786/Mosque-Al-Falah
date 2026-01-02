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

const quickAmounts = [15, 20, 45, 100, 250];

// Step Progress Bar
function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-center gap-2 py-4 bg-gray-900 text-white">
      {steps.map((step, index) => (
        <div key={step.number} className="flex items-center">
          <div
            className={`flex items-center gap-2 ${
              currentStep >= step.number ? 'opacity-100' : 'opacity-50'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step.number
                  ? 'bg-blue-500 text-white'
                  : currentStep > step.number
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
              }`}
            >
              {currentStep > step.number ? '✓' : step.number}
            </div>
            <span className="text-sm">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className="w-8 h-px bg-gray-600 mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}

// Step 1: Select Amount & Frequency
function Step1Select({
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

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-2">Donate Online</h1>
      <p className="text-gray-600 mb-8">
        We trust Masjid System to handle the processing of our online payments.
        You will see their name mentioned on this form and in the address bar.
      </p>

      {/* Frequency Selection */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-medium mb-4">I Wish To Donate</h3>
        <div className="flex flex-wrap gap-2">
          {frequencies.map(freq => (
            <button
              key={freq.value}
              onClick={() =>
                setFormData({
                  ...formData,
                  frequency: freq.value as DonationFormData['frequency'],
                })
              }
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                formData.frequency === freq.value
                  ? 'bg-blue-500 text-white'
                  : 'bg-white border border-gray-300 hover:border-blue-500'
              }`}
            >
              {freq.label}
            </button>
          ))}
        </div>

        {formData.frequency !== 'one-time' && (
          <p className="text-sm text-gray-500 mt-2">
            Starts today and ends when this fundraiser ends on{' '}
            <span className="underline">April 6, 2025</span>
          </p>
        )}

        {/* Donation Type */}
        <div className="mt-6">
          <label className="block text-sm font-medium mb-2">
            Donation Type
          </label>
          <select
            value={formData.donationType}
            onChange={e =>
              setFormData({ ...formData, donationType: e.target.value })
            }
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {donationTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Amount Selection */}
        <div className="mt-6">
          <h4 className="font-medium mb-3">Your giving amount</h4>
          <div className="flex flex-wrap gap-3">
            {quickAmounts.map(amount => (
              <button
                key={amount}
                onClick={() =>
                  setFormData({ ...formData, amount, customAmount: '' })
                }
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  formData.amount === amount && !isCustom
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-300 hover:border-gray-400'
                }`}
              >
                £{amount}
                {formData.frequency !== 'one-time' && (
                  <span className="text-xs block text-gray-400">
                    /
                    {
                      frequencies.find(f => f.value === formData.frequency)
                        ?.label
                    }
                  </span>
                )}
              </button>
            ))}
            <div className="relative">
              <input
                type="number"
                placeholder="Custom"
                value={formData.customAmount}
                onChange={e =>
                  setFormData({
                    ...formData,
                    customAmount: e.target.value,
                    amount: parseFloat(e.target.value) || 0,
                  })
                }
                className={`w-32 px-6 py-3 rounded-lg border transition-colors ${
                  isCustom ? 'border-gray-900 bg-gray-50' : 'border-gray-300'
                } focus:ring-2 focus:ring-blue-500`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Anonymous Donation */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-medium mb-2">Donation of behalf of</h3>
        <div className="flex items-center gap-3 p-3 bg-white rounded-lg border">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            😊
          </div>
          <div className="flex-1">
            <p className="font-medium">
              {formData.isAnonymous
                ? 'Anonymous kind soul'
                : formData.displayName || 'Add your name'}
            </p>
            <p className="text-sm text-gray-500">
              £{donationAmount.toFixed(2)} GBP, a few moments ago
            </p>
          </div>
          <button
            onClick={() =>
              setFormData({ ...formData, isAnonymous: !formData.isAnonymous })
            }
            className="text-blue-500 text-sm"
          >
            Edit
          </button>
        </div>
      </div>

      {/* Platform Fee */}
      <div className="bg-orange-50 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-4">
          <div className="text-2xl">🙏</div>
          <div className="flex-1">
            <h3 className="font-medium mb-2">
              Your generosity can help more than just us:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✨ 0% platform fees for charities</li>
              <li>
                💪 Allows us to provide dedicated support for donors &
                fundraisers
              </li>
              <li>❤️ Charities deserve the best technology</li>
            </ul>
          </div>
          <div className="text-right">
            <div className="bg-orange-400 text-white text-xs px-2 py-1 rounded mb-1">
              RECOMMENDED
            </div>
            <select
              value={formData.platformFeePercentage}
              onChange={e =>
                setFormData({
                  ...formData,
                  platformFeePercentage: parseFloat(e.target.value),
                  platformFeeEnabled: parseFloat(e.target.value) > 0,
                })
              }
              className="border rounded px-3 py-2"
            >
              <option value="0">No tip</option>
              <option value="10">
                10% (£{(donationAmount * 0.1).toFixed(2)})
              </option>
              <option value="12.5">
                12.5% (£{(donationAmount * 0.125).toFixed(2)})
              </option>
              <option value="15">
                15% (£{(donationAmount * 0.15).toFixed(2)})
              </option>
            </select>
          </div>
        </div>
        <p className="text-sm text-green-700 bg-green-100 rounded px-3 py-2 mt-4">
          75% of donors have helped keep Masjid System free for our charity in
          last the 24 hours
        </p>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h3 className="font-bold mb-4">Review</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Your donation amount</span>
            <span>£{donationAmount.toFixed(2)}</span>
          </div>
          {formData.platformFeeEnabled && (
            <div className="flex justify-between text-gray-600">
              <span>Masjid Al-Falah ({formData.platformFeePercentage}%)</span>
              <span>£{platformFee.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total amount to pay:</span>
            <span>£{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-4">
        <button
          onClick={onNext}
          disabled={donationAmount <= 0}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
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
        className="flex items-center gap-2 text-gray-600 mb-4"
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
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
            className="flex-1 flex items-center justify-center gap-2 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-[#1877F2]"
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
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium"
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
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
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
        className="flex items-center gap-2 text-gray-600 mb-4"
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
          className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 py-3 rounded-lg font-medium"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={formData.giftAidEnabled && !formData.giftAidDeclaration}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium disabled:opacity-50"
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
        className="flex items-center gap-2 text-gray-600 mb-4"
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
            className="w-full mt-6 bg-blue-500 hover:bg-blue-600 text-white py-4 rounded-lg font-medium text-lg disabled:opacity-50"
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
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg">
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
      <StepProgress currentStep={currentStep} />

      {currentStep === 1 && (
        <Step1Select
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
