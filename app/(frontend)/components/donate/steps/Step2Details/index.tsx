'use client';

import { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { DonationFormData } from '../../types';
import { DonationHeader, SocialLoginSection, NavigationButtons } from '../../shared';
import { FormInput, Checkbox, Button } from '../../ui';
import AddressAutocomplete from '../../ui/AddressAutocomplete';

interface Step2DetailsProps {
  formData: DonationFormData;
  setFormData: (data: DonationFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step2Details({
  formData,
  setFormData,
  onNext,
  onBack,
}: Step2DetailsProps) {
  const [showManualAddress, setShowManualAddress] = useState(false);

  return (
    <div className="w-full flex flex-col gap-8 pt-8 pb-8 px-4 md:px-24 lg:px-96">
      {/* Header with Back Button */}
      <DonationHeader showBackButton onBack={onBack} />

      {/* Email Field */}
      <div className="flex flex-col gap-4 w-full">
        <FormInput
          label="Email address"
          value={formData.email}
          onChange={value => setFormData({ ...formData, email: value })}
          type="email"
          placeholder="e.g. jsmith@yourmail.com"
          required
        />
        <div className="flex items-center">
          <p className="text-xs font-normal leading-4 text-black">
            Donated with Masjid Al-Falah before?
          </p>
          <button
            type="button"
            onClick={() => signIn()}
            className="flex h-8 items-center justify-center px-3 rounded-xl cursor-pointer hover:bg-[#F4F4F5] transition-colors"
          >
            <span className="text-xs font-normal leading-4 text-[#006FEE]">
              Log In
            </span>
          </button>
        </div>
      </div>

      {/* Social Login */}
      <SocialLoginSection />

      {/* Name Fields */}
      <div className="flex flex-col gap-6 w-full">
        <div className="flex gap-6 items-center w-full">
          {/* First Name */}
          <div className="flex-1">
            <FormInput
              label="First Name"
              value={formData.firstName}
              onChange={value => setFormData({ ...formData, firstName: value })}
              placeholder="First Name"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex-1">
            <FormInput
              label="Last Name"
              value={formData.lastName}
              onChange={value => setFormData({ ...formData, lastName: value })}
              placeholder="Last Name"
              required
            />
          </div>
        </div>

        {/* Address Field with Google Places Autocomplete */}
        <AddressAutocomplete
          value={formData.address.line1}
          onInputChange={value => {
            // When user types manually, just update line1
            setFormData({
              ...formData,
              address: { ...formData.address, line1: value },
            });
          }}
          onAddressSelect={address => {
            // When address is selected from Google Places, update ALL fields
            console.log('Address selected in Step2:', address);
            setFormData({
              ...formData,
              address: {
                line1: address.line1 || '',
                line2: address.line2 || '',
                city: address.city || '',
                postcode: address.postcode || '',
                country: address.country || 'GB',
              },
            });
          }}
        />

        {/* Phone Field */}
        <FormInput
          label="Phone number (optional)"
          value={formData.phone}
          onChange={value => setFormData({ ...formData, phone: value })}
          type="tel"
          placeholder="+44"
        />
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-4">
        <Checkbox
          checked={formData.termsAccepted}
          onChange={checked => setFormData({ ...formData, termsAccepted: checked })}
          label={
            <>
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
            </>
          }
          alignItems="start"
        />
        <Checkbox
          checked={formData.marketingConsent}
          onChange={checked =>
            setFormData({ ...formData, marketingConsent: checked })
          }
          label="I'm happy to be contacted by Email"
        />
      </div>

      {/* Next Button */}
      <Button
        onClick={onNext}
        disabled={
          !formData.email ||
          !formData.firstName ||
          !formData.lastName ||
          !formData.termsAccepted
        }
        variant="primary"
        className="w-[212px]"
      >
        Next
      </Button>
    </div>
  );
}
