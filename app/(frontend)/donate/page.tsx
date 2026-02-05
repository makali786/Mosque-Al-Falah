'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { StepIndicator } from '../components/donate/shared';
import Step1Select from '../components/donate/steps/Step1Select';
import Step2Details from '../components/donate/steps/Step2Details';
import Step3GiftAid from '../components/donate/steps/Step3GiftAid';
import Step4Payment from '../components/donate/steps/Step4Payment';
import { DonationFormData } from '../components/donate/types';
import GoogleMapsScript from '../components/GoogleMapsScript';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useToast } from '../hooks/useToast';
import { ToastContainer } from '../components/common/Toast';

export default function DonatePage() {
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toasts, removeToast, success, error } = useToast();

  // Get amount and appealId from URL parameters
  const urlAmount = searchParams.get('amount');
  const urlAppealId = searchParams.get('appealId');
  const initialAmount = urlAmount ? parseFloat(urlAmount) : 20;

  const [formData, setFormData] = useState<DonationFormData>({
    // Step 1: Select
    frequency: 'one-time',
    donationType: 'general',
    appealId: urlAppealId || undefined, // Pre-select appeal from URL if present
    amount: initialAmount,
    customAmount: '',
    platformFeeEnabled: true,
    platformFeePercentage: 12.5,

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

  // Fetch appeal details if appealId is in URL to set correct donation type
  useEffect(() => {
    if (urlAppealId) {
      fetch(`/api/donation-appeals/${urlAppealId}`)
        .then(res => res.json())
        .then(appeal => {
          if (appeal && appeal.category) {
            setFormData(prev => ({
              ...prev,
              appealId: urlAppealId,
              donationType: appeal.category || 'general',
            }));
          }
        })
        .catch(err => console.error('Failed to fetch appeal:', err));
    }
  }, [urlAppealId]);

  const handleStep1Next = () => {
    setCurrentStep(2);
  };

  const handleStep2Next = async () => {
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
          amount: Math.round(totalAmount * 100), // Convert to pence
          currency: 'gbp',
          frequency: formData.frequency,
          donationType: formData.donationType,
          appealId: formData.appealId, // Link donation to specific appeal
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          address: formData.address,
          isAnonymous: formData.isAnonymous,
          displayName: formData.displayName,
          giftAid: formData.giftAidEnabled,
          platformFeePercentage: formData.platformFeePercentage,
          marketingConsent: formData.marketingConsent,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setClientSecret(data.clientSecret);
        success('Payment intent created successfully');
        setCurrentStep(3);
      } else {
        error(data.error || 'Failed to create payment intent');
      }
    } catch (err) {
      error('An error occurred while processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep3Next = () => {
    setCurrentStep(4);
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

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
