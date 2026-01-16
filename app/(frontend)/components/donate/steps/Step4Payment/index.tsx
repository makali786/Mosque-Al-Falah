'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DonationFormData } from '../../types';
import PaymentForm from './PaymentForm';

// Initialize Stripe - using hardcoded key since it's a publishable key (safe to expose)
const stripePromise = loadStripe('pk_test_lSAe5DVxV0HxJyEBMyUnZpGO00zVoMOeyz');

interface Step4PaymentProps {
  formData: DonationFormData;
  setFormData: (data: DonationFormData) => void;
  onBack: () => void;
  clientSecret: string;
}

export default function Step4Payment({
  formData,
  setFormData,
  onBack,
  clientSecret,
}: Step4PaymentProps) {
  // When using individual CardElements (CardNumberElement, etc.),
  // we don't pass clientSecret to Elements - it's only for PaymentElement
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        formData={formData}
        setFormData={setFormData}
        onBack={onBack}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}
