import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
} from '@stripe/react-stripe-js';
import { StripeCardNumberElementOptions } from '@stripe/stripe-js';

interface StripeCardInputProps {
  label: string;
  type: 'number' | 'expiry' | 'cvc';
}

const baseStyle: StripeCardNumberElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#11181C',
      '::placeholder': {
        color: '#71717A',
      },
      fontFamily: 'inherit',
    },
    invalid: {
      color: '#F31260',
    },
  },
};

const elementComponents = {
  number: CardNumberElement,
  expiry: CardExpiryElement,
  cvc: CardCvcElement,
};

export default function StripeCardInput({ label, type }: StripeCardInputProps) {
  const Element = elementComponents[type];

  // Add showIcon option for card number element
  const options = type === 'number'
    ? { ...baseStyle, showIcon: true }
    : baseStyle;

  return (
    <div className="flex flex-col items-start w-full">
      <div className="flex items-center pb-3 pr-2 w-full">
        <p className="text-xs font-normal leading-4 text-[#52525B]">{label}</p>
      </div>
      <div className="bg-[#F4F4F5] flex items-center min-h-[44px] px-4 py-3 rounded-xl shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] w-full">
        <div className="w-full">
          <Element options={options} />
        </div>
      </div>
    </div>
  );
}
