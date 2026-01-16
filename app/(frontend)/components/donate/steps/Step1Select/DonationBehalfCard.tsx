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
      <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-0 not-italic relative shrink-0 text-[14px] text-(--colors/base/default-foreground,black) whitespace-nowrap">
        <p className="leading-5 whitespace-pre">Donation of behalf of</p>
      </div>
      <div className="bg-[#F4F4F5] content-stretch flex items-center justify-between px-3 py-2 relative rounded-lg shrink-0 w-86">
        <div className="content-stretch flex gap-2 isolate items-center justify-center relative rounded-lg shrink-0">
          <div className="bg-(--colors/layout/foreground-400,#a1a1aa) content-stretch flex items-center justify-center overflow-clip relative rounded-[9999px] shrink-0 size-10 z-2">
            <div className="flex-[1_0_0] h-full max-w-10 min-h-px min-w-px relative">
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
              >
                <div className="absolute bg-black inset-0" />
                <div className="absolute inset-0 overflow-hidden">
                  <img
                    alt=""
                    className="absolute h-[80.57%] left-[10%] max-w-none top-[9.72%] w-[80%]"
                    src="/assets/donation/avatar-default.png"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex flex-col font-['Roboto:Regular',sans-serif] font-normal items-start leading-0 pl-0 pr-[1.19px] py-px relative shrink-0 whitespace-nowrap z-1">
            <div
              className="flex flex-col justify-center relative shrink-0 text-[14px] text-(--colors/layout/foreground,#11181c)"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <p className="leading-5 whitespace-pre">
                {isAnonymous ? 'Anonymous kind soul' : displayName || 'Anonymous kind soul'}
              </p>
            </div>
            <div
              className="flex flex-col justify-center relative shrink-0 text-[12px] text-[#A1A1AA]"
              style={{ fontVariationSettings: "'wdth' 100" }}
            >
              <p className="leading-4 whitespace-pre">
                £{donationAmount.toFixed(2)} GBP, a few moments ago
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={onToggleAnonymous}
          className="content-stretch cursor-pointer flex h-10 items-center justify-center px-4 py-0 relative rounded-xl shrink-0"
        >
          <div className="content-stretch flex gap-[8px] items-center justify-center relative shrink-0">
            <div className="content-stretch flex gap-2 items-center justify-center relative shrink-0">
              <div className="flex flex-col font-['Inter:Regular',sans-serif] font-normal justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-(--colors/base/default-foreground,black) text-left whitespace-nowrap">
                <p className="leading-[20px] whitespace-pre">Edit</p>
              </div>
            </div>
          </div>
        </button>
      </div>
    </Card>
  );
}
