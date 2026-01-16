'use client';

import { CardNumberElement, useElements, useStripe } from '@stripe/react-stripe-js';
import Image from 'next/image';
import { useState } from 'react';
import { DonationFormData } from '../../types';
import { DonationHeader } from '../../shared';
import { StripeCardInput } from '../../ui';
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
  const [paymentMethod, setPaymentMethod] = useState<
    'direct-debit' | 'card' | 'paypal'
  >('card');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  const donationAmount = formData.customAmount
    ? parseFloat(formData.customAmount)
    : formData.amount;
  const platformFee = formData.platformFeeEnabled
    ? (donationAmount * formData.platformFeePercentage) / 100
    : 0;
  const totalAmount = donationAmount + platformFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    // For card payments with individual card elements
    if (paymentMethod === 'card') {
      const cardElement = elements.getElement(CardNumberElement);

      if (!cardElement) {
        setError('Card element not found. Please refresh and try again.');
        setIsProcessing(false);
        return;
      }

      const { error: submitError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement,
            billing_details: {
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
        });

      if (submitError) {
        setError(submitError.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
      } else if (paymentIntent?.status === 'succeeded') {
        // Redirect to completion page
        window.location.href = `/donate/complete?payment_intent=${paymentIntent.id}&redirect_status=succeeded`;
      }
    } else {
      // For PaymentElement (other payment methods)
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/donate/complete`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Payment failed. Please try again.');
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 pt-8 pb-8 px-4 md:px-24 lg:px-96">
      {/* Header with Back Button */}
      <DonationHeader showBackButton onBack={onBack} />

      {/* Payment Section Container */}
      <div className="bg-[#FAFAFA] flex flex-col gap-8 p-8 rounded-xl w-full">
        {/* Payment Method Selection */}
        <div className="flex flex-col gap-4 w-full">
          <div className="flex items-center justify-between w-full">
            <p className="text-sm font-normal leading-5 text-black">
              Payment Method
            </p>
            {/* Card Logos - only show for card payment */}
            {paymentMethod === 'card' && (
              <div className="flex gap-2 items-center h-5">
                <div className="h-5 w-[30px] relative">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 30 20"
                    fill="none"
                  >
                    <rect width="30" height="20" rx="2" fill="#1434CB" />
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill="white"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      VISA
                    </text>
                  </svg>
                </div>
                <div className="h-5 w-[30px] relative">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 30 20"
                    fill="none"
                  >
                    <rect width="30" height="20" rx="2" fill="#EB001B" />
                    <circle cx="12" cy="10" r="6" fill="#FF5F00" />
                    <circle cx="18" cy="10" r="6" fill="#F79E1B" />
                  </svg>
                </div>
                <div className="h-5 w-[30px] relative">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 30 20"
                    fill="none"
                  >
                    <rect width="30" height="20" rx="2" fill="#006FCF" />
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill="white"
                      fontSize="6"
                      fontWeight="bold"
                    >
                      AMEX
                    </text>
                  </svg>
                </div>
                <div className="h-5 w-[30px] relative">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 30 20"
                    fill="none"
                  >
                    <rect width="30" height="20" rx="2" fill="#FF6000" />
                    <text
                      x="50%"
                      y="50%"
                      dominantBaseline="middle"
                      textAnchor="middle"
                      fill="white"
                      fontSize="5"
                      fontWeight="bold"
                    >
                      DISC
                    </text>
                  </svg>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-4 w-full">
            {/* Direct Debit */}
            <button
              type="button"
              onClick={() => setPaymentMethod('direct-debit')}
              className="bg-[#F4F4F5] flex flex-1 items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E4E4E7] transition-colors"
            >
              <div className="flex gap-2 items-center p-2">
                <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start">
                  <div
                    className={`col-1 row-1 ml-0 mt-0 w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'direct-debit'
                        ? 'bg-[#006FEE] border-[#006FEE]'
                        : 'border-[#D4D4D8]'
                    }`}
                  />
                  {paymentMethod === 'direct-debit' && (
                    <div className="col-1 row-1 w-[6.22px] h-[4.44px] ml-[5px] mt-[6px] relative pointer-events-none">
                      <Image
                        src="/assets/donation/checkmark-icon.svg"
                        alt="Check"
                        width={7}
                        height={5}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <span className="text-sm font-normal leading-5 text-[#11181C]">
                  Direct Debit
                </span>
              </div>
              <div className="w-4 h-4 relative shrink-0">
                <Image
                  src="/assets/donation/direct-debit-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>

            {/* Debit/Credit Card */}
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className="bg-[#F4F4F5] flex flex-1 items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E4E4E7] transition-colors"
            >
              <div className="flex gap-2 items-center p-2">
                <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start">
                  <div
                    className={`col-1 row-1 ml-0 mt-0 w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'card'
                        ? 'bg-[#006FEE] border-[#006FEE]'
                        : 'border-[#D4D4D8]'
                    }`}
                  />
                  {paymentMethod === 'card' && (
                    <div className="col-1 row-1 w-[6.22px] h-[4.44px] ml-[5px] mt-[6px] relative pointer-events-none">
                      <Image
                        src="/assets/donation/checkmark-icon.svg"
                        alt="Check"
                        width={7}
                        height={5}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <span className="text-sm font-normal leading-5 text-[#11181C]">
                  Debit/Credit card
                </span>
              </div>
              <div className="w-4 h-4 relative shrink-0">
                <Image
                  src="/assets/donation/card-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>

            {/* PayPal */}
            <button
              type="button"
              onClick={() => setPaymentMethod('paypal')}
              className="bg-[#F4F4F5] flex flex-1 items-center justify-between px-4 py-2 rounded-lg cursor-pointer hover:bg-[#E4E4E7] transition-colors"
            >
              <div className="flex gap-2 items-center p-2">
                <div className="relative inline-grid grid-cols-[max-content] grid-rows-[max-content] items-start justify-items-start">
                  <div
                    className={`col-1 row-1 ml-0 mt-0 w-4 h-4 rounded-full border-2 ${
                      paymentMethod === 'paypal'
                        ? 'bg-[#006FEE] border-[#006FEE]'
                        : 'border-[#D4D4D8]'
                    }`}
                  />
                  {paymentMethod === 'paypal' && (
                    <div className="col-1 row-1 w-[6.22px] h-[4.44px] ml-[5px] mt-[6px] relative pointer-events-none">
                      <Image
                        src="/assets/donation/checkmark-icon.svg"
                        alt="Check"
                        width={7}
                        height={5}
                        className="w-full h-full"
                      />
                    </div>
                  )}
                </div>
                <span className="text-sm font-normal leading-5 text-[#11181C]">
                  Paypal
                </span>
              </div>
              <div className="w-4 h-4 relative shrink-0">
                <Image
                  src="/assets/donation/paypal-icon.svg"
                  alt=""
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
            </button>
          </div>
        </div>

        {/* Form Fields Container */}
        <form
          onSubmit={handleSubmit}
          className="border border-[#D4D4D8] flex flex-col gap-6 p-6 rounded-xl w-full"
        >
          {paymentMethod === 'direct-debit' ? (
            <>
              {/* Direct Debit Form Fields */}
              {/* Email */}
              <div className="flex flex-col h-[70px] items-start w-full">
                <div className="flex items-center pb-3 pr-2 w-full">
                  <p className="text-xs font-normal leading-4 text-[#52525B]">
                    Email address
                  </p>
                  <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                    <p className="text-sm font-normal leading-5 text-[#F31260]">
                      *
                    </p>
                  </div>
                </div>
                <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                  <input
                    type="email"
                    value={formData.email}
                    placeholder="e.g. jsmith@yourmail.com"
                    readOnly
                    className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
                  />
                </div>
              </div>

              {/* Account Holder Name */}
              <div className="flex flex-col h-[70px] items-start w-full">
                <div className="flex items-center pb-3 pr-2 w-full">
                  <p className="text-xs font-normal leading-4 text-[#52525B]">
                    Name of account holder:
                  </p>
                  <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                    <p className="text-sm font-normal leading-5 text-[#F31260]">
                      *
                    </p>
                  </div>
                </div>
                <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                  <input
                    type="text"
                    placeholder="Please enter the name of account holder"
                    className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
                  />
                </div>
              </div>

              {/* Sort Code */}
              <div className="flex flex-col h-[70px] items-start w-full">
                <div className="flex items-center pb-3 pr-2 w-full">
                  <p className="text-xs font-normal leading-4 text-[#52525B]">
                    Sort code:
                  </p>
                  <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                    <p className="text-sm font-normal leading-5 text-[#F31260]">
                      *
                    </p>
                  </div>
                </div>
                <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                  <input
                    type="text"
                    placeholder="Please enter your sort code e.g., 10-20-30"
                    className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
                  />
                </div>
              </div>

              {/* Account Number */}
              <div className="flex flex-col h-[70px] items-start w-full">
                <div className="flex items-center pb-3 pr-2 w-full">
                  <p className="text-xs font-normal leading-4 text-[#52525B]">
                    Account Number
                  </p>
                  <div className="flex flex-col h-[14px] items-center justify-center pl-0.5 w-[7px]">
                    <p className="text-sm font-normal leading-5 text-[#F31260]">
                      *
                    </p>
                  </div>
                </div>
                <div className="bg-[#F4F4F5] flex items-center min-h-[32px] px-[6px] py-2 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
                  <input
                    type="text"
                    placeholder="Please enter your account number"
                    className="flex-1 bg-transparent px-[6px] pb-0.5 text-base font-normal leading-6 text-[#11181C] placeholder:text-[#71717A] border-none outline-none"
                  />
                </div>
              </div>
            </>
          ) : paymentMethod === 'card' ? (
            <>
              {/* Card Payment Form Fields with Stripe Elements */}
              <div className="flex flex-col gap-[30px] w-full">
                {/* Card Number */}
                <StripeCardInput label="Card Number" type="number" />

                {/* Expiry and CVC */}
                <div className="flex gap-8 w-full">
                  <StripeCardInput label="Expiry" type="expiry" />
                  <StripeCardInput label="CVC" type="cvc" />
                </div>
              </div>
            </>
          ) : null}

          {/* Billing Address Section */}
          <div className="flex flex-col gap-4 w-full">
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
                  value={formData.address.line1}
                  onInputChange={value =>
                    setFormData({
                      ...formData,
                      address: { ...formData.address, line1: value },
                    })
                  }
                  onAddressSelect={address =>
                    setFormData({
                      ...formData,
                      address: {
                        ...formData.address,
                        ...address,
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
              collects Direct Debits on behalf of Masjid Al-Falah and confirm
              that I am the account holder and the only person required to
              authorise debits from this account.
            </span>
          </label>
        </form>
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg">{error}</div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        onClick={handleSubmit}
        disabled={!stripe || isProcessing || !termsAccepted}
        className="bg-[#006FEE] flex h-12 items-center justify-center px-6 rounded-xl w-[212px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0055CC] transition-colors"
      >
        <span className="text-base font-normal leading-6 text-white">
          {isProcessing
            ? 'Processing...'
            : paymentMethod === 'card'
              ? `Pay £${totalAmount.toFixed(2)}`
              : 'Next'}
        </span>
      </button>
    </div>
  );
}
