import { Card } from '../ui';

interface ReviewSectionProps {
  donationAmount: number;
  platformFeeEnabled: boolean;
  platformFeePercentage: number;
  platformFee: number;
  totalAmount: number;
}

export default function ReviewSection({
  donationAmount,
  platformFeeEnabled,
  platformFeePercentage,
  platformFee,
  totalAmount,
}: ReviewSectionProps) {
  return (
    <Card className="w-full flex flex-col">
      <div className="flex flex-col gap-4 w-full">
        <p className="text-base font-medium leading-6 text-[#11181C]">Review</p>
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between text-sm font-normal leading-5 text-[#52525B] w-full">
            <span>Your donation amount</span>
            <span className="text-right">£{donationAmount.toFixed(2)}</span>
          </div>
          {platformFeeEnabled && (
            <div className="flex items-center justify-between text-sm font-normal leading-5 text-[#52525B] w-full">
              <span>Masjid Al-Falah({platformFeePercentage}%)</span>
              <span className="text-right">£{platformFee.toFixed(2)}</span>
            </div>
          )}
          <div className="h-px bg-[rgba(17,17,17,0.15)] w-full" />
          <div className="flex items-center justify-between text-sm font-medium leading-5 text-[#3F3F46] w-full">
            <span>Total amount to pay:</span>
            <span className="text-right">£{totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
