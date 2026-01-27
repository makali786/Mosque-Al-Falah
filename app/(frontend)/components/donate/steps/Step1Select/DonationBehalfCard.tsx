'use client';

import { Card } from '../../ui';
import { DonorProfileCard } from '../../shared';

interface DonationBehalfCardProps {
  donationAmount: number;
  onProfileChange: (isAnonymous: boolean, displayName: string) => void;
}

export default function DonationBehalfCard({
  donationAmount,
  onProfileChange,
}: DonationBehalfCardProps) {
  return (
    <Card className="w-full flex flex-col gap-4 !p-8">
      <p className="text-sm font-normal leading-5 text-black">
        Donation of behalf of
      </p>
      <DonorProfileCard
        donationAmount={donationAmount}
        showAmount={true}
        variant="default"
        onProfileChange={onProfileChange}
      />
    </Card>
  );
}
