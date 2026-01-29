'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { DonationFormData } from '../../types';
import { DonationHeader, SocialLoginSection, NavigationButtons } from '../../shared';
import { FormInput, Checkbox, Button, PhoneInput } from '../../ui';
import AddressAutocomplete from '../../ui/AddressAutocomplete';
import { getUserData } from '@lib/utils/userStorage';

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
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const userData = getUserData();
    if (userData) {
      setIsLoggedIn(true);
      setFormData({
        ...formData,
        email: userData.email || formData.email,
        firstName: userData.firstName || formData.firstName,
        lastName: userData.lastName || formData.lastName,
      });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Handle when user data is loaded from Google Sign-In
  const handleUserDataLoaded = () => {
    const userData = getUserData();
    if (userData) {
      setIsLoggedIn(true);
      setFormData({
        ...formData,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });
    }
  };

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

      {/* Social Login - Only show if user is not logged in */}
      {!isLoggedIn && <SocialLoginSection onUserDataLoaded={handleUserDataLoaded} />}

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
                href="/terms-of-services"
                className="text-lg underline text-black hover:no-underline"
              >
                terms & conditions
              </a>{' '}
              and{' '}
              <a
                href="/privacy-policy"
                className="text-lg underline text-black hover:no-underline"
              >
                privacy policy.
              </a>
            </>
          }
          alignItems="center"
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
            !formData.address?.line1 ||
            !formData.address?.city ||
            !formData.address?.postcode ||
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
