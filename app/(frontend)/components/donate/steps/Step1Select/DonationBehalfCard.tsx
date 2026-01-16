import { Card } from '../../ui';

interface DonationBehalfCardProps {
  isAnonymous: boolean;
  displayName: string;
  donationAmount: number;
  onToggleAnonymous: () => void;
}

export default function DonationBehalfCard({
  isAnonymous,
  displayName,
  donationAmount,
  onToggleAnonymous,
}: DonationBehalfCardProps) {
  return (
    <Card className="w-full flex flex-col gap-4">
      <p className="text-sm font-normal leading-5 text-black">
        Donation of behalf of
      </p>
      <div className="bg-[#F4F4F5] flex items-center justify-between px-3 py-2 rounded-lg w-full gap-2">
        <div className="flex gap-2 items-center flex-1 min-w-0">
          <div className="bg-[#A1A1AA] flex items-center justify-center overflow-hidden rounded-full w-10 h-10 flex-shrink-0">
            <img
              alt="Avatar"
              className="w-4/5 h-4/5 object-contain"
              src="/assets/donation/avatar-default.png"
            />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <p className="text-sm font-normal leading-5 text-[#11181C] truncate">
              {isAnonymous ? 'Anonymous kind soul' : displayName || 'Anonymous kind soul'}
            </p>
            <p className="text-xs font-normal leading-4 text-[#A1A1AA] truncate">
              £{donationAmount.toFixed(2)} GBP, a few moments ago
            </p>
          </div>
        </div>
        <button
          onClick={onToggleAnonymous}
          className="cursor-pointer flex h-10 items-center justify-center px-3 sm:px-4 rounded-xl hover:bg-black/5 transition-colors flex-shrink-0"
        >
          <p className="text-sm font-normal leading-5 text-black">Edit</p>
        </button>
      </div>
    </Card>
  );
}
