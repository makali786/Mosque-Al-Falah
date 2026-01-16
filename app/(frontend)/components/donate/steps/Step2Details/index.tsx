'use client';

import { useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { DonationFormData } from '../../types';
import { DonationHeader, SocialLoginSection, NavigationButtons } from '../../shared';
import { FormInput, Checkbox, Button, PhoneInput } from '../../ui';
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

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 lg:gap-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8 donation-padding">
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
      </div>

      {/* Social Login */}
      <SocialLoginSection />

      {/* Name Fields */}
      <div className="flex flex-col gap-4 sm:gap-6 w-full">
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-stretch w-full">
          {/* First Name */}
          <div className="flex-1 w-full">
            <FormInput
              label="First Name"
              value={formData.firstName}
              onChange={value => setFormData({ ...formData, firstName: value })}
              placeholder="First Name"
              required
            />
          </div>

          {/* Last Name */}
          <div className="flex-1 w-full">
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
          onAddressSelect={address => {
            setFormData({
              ...formData,
              address: {
                line1: address.line1,
                line2: address.line2,
                city: address.city,
                postcode: address.postcode,
                country: 'GB',
              },
            });
          }}
        />

        {/* Phone Field */}
        <PhoneInput
          label="Phone number (optional)"
          value={formData.phone}
          onChange={value => setFormData({ ...formData, phone: value })}
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
      <div className="flex justify-start w-full">
        <Button
          onClick={onNext}
          disabled={
            !formData.email ||
            !formData.firstName ||
            !formData.lastName ||
            !formData.termsAccepted
          }
          variant="primary"
          className="w-full md:w-[212px]"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
