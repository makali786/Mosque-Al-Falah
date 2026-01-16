'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DonationFormData } from '../../types';
import { RadioButton } from '../../ui';
import { DonationHeader } from '../../shared';
import { Button } from '../../ui';

interface Step3GiftAidProps {
  formData: DonationFormData;
  setFormData: (data: DonationFormData) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function Step3GiftAid({
  formData,
  setFormData,
  onNext,
  onBack,
}: Step3GiftAidProps) {
  const donationAmount = formData.customAmount
    ? parseFloat(formData.customAmount)
    : formData.amount;
  const giftAidAmount = donationAmount * 0.25;
  const totalWithGiftAid = donationAmount + giftAidAmount;

  return (
    <div className="w-full flex flex-col gap-8 pt-8 pb-8 px-4 md:px-24 lg:px-96">
      {/* Header with Back Button */}
      <DonationHeader showBackButton onBack={onBack} />

      {/* Gift Aid Section */}
      <div className="bg-[#FAFAFA] flex flex-col gap-8 p-8 rounded-xl w-full">
        {/* Gift Aid Header and Display */}
        <div className="flex items-end justify-between w-full">
          {/* Left: Gift Aid Calculation */}
          <div className="flex flex-col gap-4 w-[415px]">
            <h3 className="text-base font-bold leading-6 text-[#3F3F46]">
              Add Gift Aid and boost your donation at no extra cost
            </h3>
            <div className="flex gap-[22px] items-center">
              {/* Before Gift Aid */}
              <div className="flex flex-col gap-[5px] items-center text-center w-[120px]">
                <p className="text-2xl font-medium leading-8 text-black">
                  £{donationAmount.toFixed(2)}
                </p>
                <p className="text-xs font-normal leading-4 text-[#52525B]">
                  Your donation
                </p>
              </div>

              {/* Arrow */}
              <div className="w-[83px] h-3 relative">
                <Image
                  src="/assets/donation/arrow-right.svg"
                  alt="Arrow"
                  width={83}
                  height={12}
                  className="w-full h-full"
                />
              </div>

              {/* After Gift Aid */}
              <div className="flex flex-col gap-[5px] items-center text-center w-[120px]">
                <p className="text-2xl font-medium leading-8 text-black">
                  £{totalWithGiftAid.toFixed(2)}
                </p>
                <p className="text-xs font-normal leading-4 text-[#52525B]">
                  With Gift Aid
                </p>
              </div>
            </div>
          </div>

          {/* Right: Gift Aid Logo */}
          <div className="flex flex-col h-[50px] w-[125px]">
            <div className="relative w-[120px] h-12">
              <Image
                src="/assets/donation/giftaid-logo.png"
                alt="Gift Aid"
                width={120}
                height={48}
                className="object-cover mix-blend-multiply"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2 w-full">
          <p className="text-sm font-normal leading-5 text-[#52525B]">
            I am a UK taxpayer and understand that if I pay less Income Tax
            and/or Capital Gains Tax in the current tax year than the amount of
            Gift Aid claimed on all my donations, it is my responsibility to pay
            any difference.
          </p>
          <Link
            href="https://www.gov.uk/donating-to-charity/gift-aid"
            target="_blank"
            className="flex gap-1 items-center pl-0 pr-1 py-0 shrink-0 hover:underline"
          >
            <span className="text-sm font-normal leading-5 text-[#11181C]">
              Find out more about Gift Aid.
            </span>
            <div className="overflow-hidden w-3 h-3 relative shrink-0">
              <Image
                src="/assets/donation/external-link.svg"
                alt="external"
                width={20}
                height={20}
                className="object-cover mix-blend-multiply"
              />
            </div>
          </Link>
        </div>

        {/* Gift Aid Options */}
        <div className="flex flex-col gap-4 w-full">
          {/* Yes Option */}
          <div className="flex gap-2 items-center p-2">
            <label className="flex gap-2 items-center cursor-pointer">
              <RadioButton
                name="giftAid"
                checked={formData.giftAidEnabled}
                onChange={() =>
                  setFormData({ ...formData, giftAidEnabled: true })
                }
              />
              <span className="text-base font-normal leading-6 text-[#11181C]">
                Yes, please Gift Aid this donation
              </span>
            </label>
          </div>

          {/* Declaration Box (shown when Yes is selected) */}
          {formData.giftAidEnabled && (
            <div className="bg-[#F4F4F5] flex flex-col gap-3 p-4 rounded-lg w-full">
              <p className="text-base font-normal leading-6 text-black">
                Please read and confirm the following statements:
              </p>
              <div className="flex flex-col gap-2 w-full">
                <label className="flex gap-2 items-start p-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.giftAidDeclaration}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        giftAidDeclaration: e.target.checked,
                      })
                    }
                    className="w-5 h-5 mt-0.5 rounded-md border-2 border-[#D4D4D8] text-[#006FEE] focus:ring-2 focus:ring-[#006FEE] cursor-pointer flex-shrink-0"
                  />
                  <span className="flex-1 text-base font-normal leading-6 text-[#11181C]">
                    This is my own money. I am not paying in donations made by a
                    third party, e.g. money collected at an event, the pub, a
                    company donation or a donation from a friend or family
                    member.
                  </span>
                </label>
                <label className="flex gap-2 items-start p-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-5 h-5 mt-0.5 rounded-md border-2 border-[#D4D4D8] text-[#006FEE] focus:ring-2 focus:ring-[#006FEE] cursor-pointer flex-shrink-0"
                  />
                  <span className="flex-1 text-base font-normal leading-6 text-[#11181C]">
                    This donation is not made as part of a sweepstake, raffle or
                    lottery and I am not receiving anything in return of it,
                    e.g. book, auction prize, ticket to an event.
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* No Option */}
          <div className="flex gap-2 items-center p-2 w-full">
            <label className="flex gap-2 items-center cursor-pointer">
              <RadioButton
                name="giftAid"
                checked={!formData.giftAidEnabled}
                onChange={() =>
                  setFormData({ ...formData, giftAidEnabled: false })
                }
              />
              <span className="text-base font-normal leading-6 text-[#11181C]">
                No, please do not Gift Aid this donation
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Next Button */}
      <button
        onClick={onNext}
        disabled={formData.giftAidEnabled && !formData.giftAidDeclaration}
        className="bg-[#006FEE] flex h-12 items-center justify-center px-6 rounded-xl w-[212px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0055CC] transition-colors"
      >
        <span className="text-base font-normal leading-6 text-white">Next</span>
      </button>
    </div>
  );
}
