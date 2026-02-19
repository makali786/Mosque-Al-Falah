'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';
import { DonationFormData } from '../../types';
import { DonationHeader, SocialLoginSection, NavigationButtons } from '../../shared';
import { FormInput, Checkbox, Button, PhoneInput } from '../../ui';
import AddressAutocomplete from '../../ui/AddressAutocomplete';
import { getUserData, clearUserData } from '@lib/utils/userStorage';

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
  const { data: session } = useSession();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoadingDonor, setIsLoadingDonor] = useState(false);

  const handleClearForm = async () => {
    // 1. Sign out from NextAuth (Apple/Session) without redirection
    await signOut({ redirect: false });

    // 2. Clear localStorage (Google/Facebook)
    clearUserData();

    // 3. Reset form data
    setFormData({
      ...formData,
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
    });

    setIsLoggedIn(false);
  };

  // Load user data from localStorage or Session on mount/update
  useEffect(() => {
    // 1. Try LocalStorage (legacy/custom flow)
    const userData = getUserData();
    if (userData) {
      setIsLoggedIn(true);
      setFormData({
        ...formData,
        email: userData.email || formData.email,
        firstName: userData.firstName || formData.firstName,
        lastName: userData.lastName || formData.lastName,
      });
      return;
    }

    // 2. Try NextAuth Session (for Apple/Google/Social)
    if (session?.user?.email) {
      setIsLoggedIn(true);

      // Fetch full donor details from DB
      const fetchDonorDetails = async () => {
        setIsLoadingDonor(true);
        try {
          const res = await fetch('/api/donors/me');
          const data = await res.json();

          if (data.found && data.donor) {
            setFormData({
              ...formData,
              email: data.donor.email || session.user?.email || formData.email,
              firstName: data.donor.firstName || formData.firstName,
              lastName: data.donor.lastName || formData.lastName,
              phone: data.donor.phone || formData.phone,
              address: {
                line1: data.donor.address?.line1 || formData.address?.line1 || '',
                line2: data.donor.address?.line2 || formData.address?.line2 || '',
                city: data.donor.address?.city || formData.address?.city || '',
                postcode: data.donor.address?.postcode || formData.address?.postcode || '',
                country: data.donor.address?.country || 'GB',
              }
            });
          } else {
            // Fallback to session data if no donor record found
            const nameParts = session.user?.name ? session.user.name.split(' ') : [];
            let firstName = '';
            let lastName = '';

            if (nameParts.length > 0) {
              firstName = nameParts[0];
              lastName = nameParts.slice(1).join(' ');
            }

            if (!formData.email || formData.email !== session.user?.email) {
              setFormData({
                ...formData,
                email: session.user?.email || formData.email,
                firstName: firstName || formData.firstName,
                lastName: lastName || formData.lastName,
              });
            }
          }
        } catch (error) {
          console.error("Failed to fetch donor details:", error);
        } finally {
          setIsLoadingDonor(false);
        }
      };

      fetchDonorDetails();
    } else {
      setIsLoggedIn(false);
    }
  }, [session]); // Dependent on session

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

      {/* Clear Info Button - Only show if fields are populated */}
      {(formData.email || formData.firstName || formData.lastName) && (
        <div className="flex justify-end -mt-4">
          <button
            onClick={handleClearForm}
            className="text-sm text-gray-400 hover:text-red-500 flex items-center gap-1.5 transition-colors group"
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity">Clear form data</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400 group-hover:text-red-500"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
          </button>
        </div>
      )}

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

      {/* Social Login Options */}
      <SocialLoginSection onUserDataLoaded={handleUserDataLoaded} />

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
              I have read and agree to the{' '}
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
