'use client';

import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { DonationFormData } from '../../types';
import { DonationHeader } from '../../shared';
import AddressAutocomplete from '../../ui/AddressAutocomplete';

interface PaymentFormProps {
  formData: DonationFormData;
  setFormData: (data: DonationFormData) => void;
  onBack: () => void;
  clientSecret: string;
}

export default function PaymentForm({
  formData,
  setFormData,
  onBack,
  clientSecret,
}: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const donationAmount = formData.customAmount
    ? parseFloat(formData.customAmount)
    : formData.amount;
  const platformFee = formData.platformFeeEnabled
    ? (donationAmount * formData.platformFeePercentage) / 100
    : 0;
  const totalAmount = donationAmount + platformFee;

  // Debug: Log when PaymentElement is ready
  useEffect(() => {
    if (elements) {
      const paymentElement = elements.getElement(PaymentElement);
      if (paymentElement) {
        paymentElement.on('ready', () => {
          console.log('PaymentElement is ready');
        });
        paymentElement.on('change', (event) => {
          console.log('PaymentElement changed:', event);
          if (event.value?.type) {
            console.log('Selected payment method:', event.value.type);
          }
        });
      }
    }
  }, [elements]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      console.log('Stripe or Elements not ready');
      return;
    }

    if (!termsAccepted) {
      setError('Please accept the terms and conditions');
      return;
    }

    setIsProcessing(true);
    setError(null);

    console.log('Submitting payment with return_url:', `${window.location.origin}/donate/complete`);

    // Use confirmPayment for all payment methods (Card, PayPal, BACS, etc.)
    const { error: submitError } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/donate/complete`,
      },
    });

    if (submitError) {
      console.error('Payment error:', submitError);
      setError(submitError.message || 'Payment failed. Please try again.');
      setIsProcessing(false);
    } else {
      console.log('Payment redirect initiated');
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 sm:gap-6 lg:gap-8 pt-4 sm:pt-6 lg:pt-8 pb-4 sm:pb-6 lg:pb-8 donation-padding">
      {/* Header with Back Button */}
      <DonationHeader showBackButton onBack={onBack} />

      {/* Payment Section Container */}
      <div className="bg-[#FAFAFA] flex flex-col gap-4 sm:gap-6 lg:gap-8 p-4 sm:p-6 lg:p-8 rounded-xl w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 sm:gap-6 lg:gap-8 w-full"
        >
          {/* Stripe Payment Element - Shows tabs for all payment methods */}
          <div className="flex flex-col gap-4 w-full">
            <p className="text-sm font-normal leading-5 text-black">
              Payment Method
            </p>
            <PaymentElement
              options={{
                layout: 'tabs',
                fields: {
                  billingDetails: {
                    address: 'auto',
                  },
                },
                defaultValues: {
                  billingDetails: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    address: {
                      line1: formData.address.line1,
                      line2: formData.address.line2,
                      city: formData.address.city,
                      postal_code: formData.address.postcode,
                      country: formData.address.country,
                    },
                  },
                },
              }}
            />
          </div>

          {/* Billing Address Section - Hidden, Stripe handles it */}
          <div className="flex flex-col gap-4 w-full hidden">
            <p className="text-xs font-normal leading-4 text-[#52525B]">
              Review your billing address:
            </p>

            {!isEditingAddress ? (
              /* Address Display */
              <div className="bg-[#F4F4F5] flex items-center justify-between px-4 py-[13px] rounded-xl w-full">
                <p className="text-base font-normal leading-6 text-black whitespace-nowrap overflow-hidden text-ellipsis">
                  {formData.address.line1}, {formData.address.city},{' '}
                  {formData.address.postcode}, {formData.address.country}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(true)}
                  className="flex h-10 items-center justify-center px-4 rounded-xl cursor-pointer hover:bg-white/50 transition-colors shrink-0"
                >
                  <div className="flex gap-2 items-center justify-center">
                    <div className="overflow-hidden w-5 h-5">
                      <Image
                        src="/assets/donation/edit-icon.svg"
                        alt="Edit"
                        width={20}
                        height={20}
                      />
                    </div>
                    <span className="text-sm font-normal leading-5 text-black">
                      Edit
                    </span>
                  </div>
                </button>
              </div>
            ) : (
              /* Address Edit with Autocomplete */
              <div className="flex flex-col gap-4">
                <AddressAutocomplete
                  defaultValue={formData.address.line1}
                  onAddressSelect={address =>
                    setFormData({
                      ...formData,
                      address: {
                        line1: address.line1,
                        line2: address.line2,
                        city: address.city,
                        postcode: address.postcode,
                        country: 'GB',
                      },
                    })
                  }
                />
                <button
                  type="button"
                  onClick={() => setIsEditingAddress(false)}
                  className="bg-[#006FEE] hover:bg-[#0055CC] text-white px-6 py-3 rounded-xl transition-colors w-fit"
                >
                  Save Address
                </button>
              </div>
            )}
          </div>

          {/* Terms Checkbox */}
          <label className="flex gap-2 items-start p-2 cursor-pointer">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={e => setTermsAccepted(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded-md border-2 border-[#D4D4D8] text-[#006FEE] focus:ring-2 focus:ring-[#006FEE] cursor-pointer flex-shrink-0"
            />
            <span className="flex-1 text-base font-normal leading-6 text-[#11181C]">
              I understand that Masjid Al-Falah has partnered with Stripe, who
              collects payments on behalf of Masjid Al-Falah and confirm that I
              am authorized to make this payment.
            </span>
          </label>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
          )}

          {/* Submit Button */}
          <div className="flex justify-start md:justify-end w-full">
            <button
              type="submit"
              disabled={!stripe || isProcessing || !termsAccepted}
              className="bg-[#006FEE] flex h-12 items-center justify-center px-6 rounded-xl w-full md:w-[212px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0055CC] transition-colors"
            >
              <span className="text-base font-normal leading-6 text-white">
                {isProcessing ? 'Processing...' : `Pay £${totalAmount.toFixed(2)}`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
