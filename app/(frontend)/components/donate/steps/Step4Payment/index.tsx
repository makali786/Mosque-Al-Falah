'use client';

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { DonationFormData } from '../../types';
import PaymentForm from './PaymentForm';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Step4PaymentProps {
  formData: DonationFormData;
  onBack: () => void;
  clientSecret: string;
}

export default function Step4Payment({
  formData,
  onBack,
  clientSecret,
}: Step4PaymentProps) {
  // When using individual CardElements (CardNumberElement, etc.),
  // we don't pass clientSecret to Elements - it's only for PaymentElement
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm
        formData={formData}
        onBack={onBack}
        clientSecret={clientSecret}
      />
    </Elements>
  );
}
