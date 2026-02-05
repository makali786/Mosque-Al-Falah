'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DonationFormData } from '../../types';
import PaymentForm from './PaymentForm';

const stripePromise = loadStripe("pk_test_lSAe5DVxV0HxJyEBMyUnZpGO00zVoMOeyz");

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
  // Pass clientSecret to Elements for PaymentElement support (PayPal, etc.)
  const options = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm
        formData={formData}
        setFormData={setFormData}
        onBack={onBack}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}
