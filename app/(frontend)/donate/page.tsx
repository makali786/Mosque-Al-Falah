'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { ToastContainer } from '../components/common/Toast';
import { StepIndicator } from '../components/donate/shared';
import Step1Select from '../components/donate/steps/Step1Select';
import Step2Details from '../components/donate/steps/Step2Details';
import Step3GiftAid from '../components/donate/steps/Step3GiftAid';
import Step4Payment from '../components/donate/steps/Step4Payment';
import { DonationFormData, DonationSettings } from '../components/donate/types';
import GoogleMapsScript from '../components/GoogleMapsScript';
import { useToast } from '../hooks/useToast';

export default function DonatePage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [donationSettings, setDonationSettings] = useState<DonationSettings | undefined>(undefined);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const { toasts, removeToast, success, error } = useToast();

  // Get amount, appealId, and frequency from URL parameters
  const urlAmount = searchParams.get('amount');
  const urlAppealId = searchParams.get('appealId');
  const urlFrequency = searchParams.get('frequency');

  // Fetch donation settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/donation-settings');
        if (response.ok) {
          const settings = await response.json();
          setDonationSettings(settings);
        } else {
          console.error('Failed to fetch donation settings');
        }
      } catch (err) {
        console.error('Error fetching donation settings:', err);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  // Get default amount from settings or fall back to 20
  const defaultSelectedAmount = donationSettings?.defaultAmount?.defaultSelectedAmount ?? 20;
  const initialAmount = urlAmount ? parseFloat(urlAmount) : defaultSelectedAmount;

  // Validate and set frequency from URL, fallback to 'one-time'
  const validFrequencies: DonationFormData['frequency'][] = ['one-time', 'weekly', 'monthly', 'quarterly', 'yearly'];
  const initialFrequency = urlFrequency && validFrequencies.includes(urlFrequency as DonationFormData['frequency'])
    ? (urlFrequency as DonationFormData['frequency'])
    : 'one-time';

  // Get platform fee defaults from settings
  const platformFeeEnabledDefault = donationSettings?.platformFee?.enabledByDefault ?? true;
  const platformFeePercentageDefault = donationSettings?.platformFee?.defaultPercentage ?? 12.5;

  const [formData, setFormData] = useState<DonationFormData>({
    // Step 1: Select
    frequency: initialFrequency,
    donationType: 'general',
    appealId: urlAppealId || undefined,
    amount: initialAmount,
    customAmount: '',
    platformFeeEnabled: platformFeeEnabledDefault,
    platformFeePercentage: platformFeePercentageDefault,

    // Step 2: Details
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

    // Step 3: Gift Aid
    giftAidEnabled: false,
    giftAidDeclaration: false,
  });

  // Update form data when settings are loaded (only if no URL amount override)
  useEffect(() => {
    if (donationSettings && !urlAmount) {
      const newDefaultAmount = donationSettings.defaultAmount?.defaultSelectedAmount ?? 20;
      const newPlatformFeeEnabled = donationSettings.platformFee?.enabledByDefault ?? true;
      const newPlatformFeePercentage = donationSettings.platformFee?.defaultPercentage ?? 12.5;
      
      setFormData(prev => ({
        ...prev,
        amount: newDefaultAmount,
        platformFeeEnabled: newPlatformFeeEnabled,
        platformFeePercentage: newPlatformFeePercentage,
      }));
    }
  }, [donationSettings, urlAmount]);

  // Hydrate state from sessionStorage on mount
  useEffect(() => {
    const savedStateStr = sessionStorage.getItem('donationState');
    if (savedStateStr) {
      try {
        const savedState = JSON.parse(savedStateStr);
        if (savedState.formData) {
          // If URL has a frequency param, override the saved state with URL frequency
          const mergedFormData = {
            ...savedState.formData,
            ...(urlFrequency && validFrequencies.includes(urlFrequency as DonationFormData['frequency']) && {
              frequency: urlFrequency as DonationFormData['frequency']
            }),
            // Also override appealId if present in URL
            ...(urlAppealId && { appealId: urlAppealId }),
            // Also override amount if present in URL
            ...(urlAmount && { amount: parseFloat(urlAmount) }),
          };
          setFormData(mergedFormData);
        }
        if (savedState.currentStep) {
          setCurrentStep(savedState.currentStep);
        }
      } catch (err) {
        console.error('Failed to parse saved donation state:', err);
      }
    }
    setIsHydrated(true);
  }, [urlFrequency, urlAppealId, urlAmount]);

  // Save state to sessionStorage whenever it changes after hydration
  useEffect(() => {
    if (isHydrated) {
      sessionStorage.setItem(
        'donationState',
        JSON.stringify({ formData, currentStep })
      );
    }
  }, [formData, currentStep, isHydrated]);

  const [appealEndDate, setAppealEndDate] = useState<string | null>(null);

  // Fetch appeal details if appealId is in URL to set correct donation type
  useEffect(() => {
    if (urlAppealId) {
      fetch(`/api/donation-appeals/${urlAppealId}`)
        .then(res => res.json())
        .then(appeal => {
          if (appeal) {
            if (appeal.timeline?.endDate) {
              setAppealEndDate(appeal.timeline.endDate);
            }
            if (appeal.category) {
              // If this appeal has online donations disabled, clear it and fall back to general
              if (appeal.disableOnlineDonation) {
                setFormData(prev => ({
                  ...prev,
                  appealId: undefined,
                  donationType: 'general',
                }));
                return;
              }
              setFormData(prev => ({
                ...prev,
                appealId: urlAppealId,
                donationType: appeal.category || 'general',
              }));
            }
          }
        })
        .catch(err => console.error('Failed to fetch appeal:', err));
    }
  }, [urlAppealId]);

  const handleStep1Next = () => {
    setCurrentStep(2);
  };

  const handleStep2Next = () => {
    // Just advance to Gift Aid step — PaymentIntent is created after Gift Aid decision
    setCurrentStep(3);
  };

  const handleStep3Next = async () => {
    setIsLoading(true);
    try {
      const donationAmount = formData.customAmount
        ? parseFloat(formData.customAmount)
        : formData.amount;

      const platformFee = formData.platformFeeEnabled
        ? (donationAmount * formData.platformFeePercentage) / 100
        : 0;

      const totalAmount = donationAmount + platformFee;

      const response = await fetch('/api/donations/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(donationAmount * 100), // Convert to pence
          currency: 'gbp',
          frequency: formData.frequency,
          donationType: formData.donationType,
          appealId: formData.appealId,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          isAnonymous: formData.isAnonymous,
          displayName: formData.displayName,
          giftAid: formData.giftAidEnabled,
          platformFeePercentage: formData.platformFeeEnabled
            ? formData.platformFeePercentage
            : 0,
          marketingConsent: formData.marketingConsent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setClientSecret(data.clientSecret);
        success('Payment intent created successfully');
        setCurrentStep(4);
      } else {
        error(data.error || 'Failed to create payment intent');
      }
    } catch (err) {
      error('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  if (!isHydrated || settingsLoading) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-white mb-20">
        <GoogleMapsScript />
        <StepIndicator currentStep={currentStep} />

        {currentStep === 1 && (
          <Step1Select
            formData={formData}
            setFormData={setFormData}
            onNext={handleStep1Next}
            appealEndDate={appealEndDate}
            settings={donationSettings}
          />
        )}

        {currentStep === 2 && (
          <Step2Details
            formData={formData}
            setFormData={setFormData}
            onNext={handleStep2Next}
            onBack={handleBack}
          />
        )}

        {currentStep === 3 && (
          <Step3GiftAid
            formData={formData}
            setFormData={setFormData}
            onNext={handleStep3Next}
            onBack={handleBack}
          />
        )}

        {currentStep === 4 && clientSecret && (
          <Step4Payment
            formData={formData}
            setFormData={setFormData}
            onBack={handleBack}
            clientSecret={clientSecret}
          />
        )}
      </div>

      {isLoading && <LoadingSpinner />}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
