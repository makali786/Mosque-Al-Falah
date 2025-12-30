"use client";

interface QuoteSectionProps {
  quote: string;
  attribution: string;
  showAttributionSymbol?: boolean;
  onShare?: () => void;
  onDonate?: () => void;
  shareButtonText?: string;
  donateButtonText?: string;
  backgroundColor?: string;
}

export function QuoteSection({
  quote,
  attribution,
  showAttributionSymbol = true,
  onShare,
  onDonate,
  shareButtonText = "Share this page",
  donateButtonText = "Donate Now",
  backgroundColor = "#f4f4f5",
}: QuoteSectionProps) {
  return (
    <section
      className="w-full py-10 sm:py-11 lg:py-12"
      style={{ backgroundColor }}
    >
      <div className="w-full hn-container !px-18 flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start lg:items-center lg:justify-end">
        {/* Quote and Attribution */}
        <div className="flex-1 w-full">
          <blockquote className="text-lg leading-7 font-medium sm:text-xl sm:leading-8 md:text-[22px] md:leading-7.5 lg:text-[24px] lg:leading-8 text-black">
            <p className="mb-0">
              &quot;{quote}&quot;
              <br />— {attribution}{" "}
              {showAttributionSymbol && <span className="font-normal text-base">ﷺ</span>}
            </p>
          </blockquote>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-6 w-full lg:w-auto shrink-0">
          {onShare && (
            <button
              onClick={onShare}
              className="flex items-center justify-center h-10 sm:h-11 md:h-12 lg:h-12 px-4 sm:px-5 md:px-6 lg:px-6 bg-[#3f3f46] hover:bg-[#52525b] text-white rounded-md sm:rounded-lg lg:rounded-lg transition-colors cursor-pointer"
            >
              <span className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-6">
                {shareButtonText}
              </span>
            </button>
          )}
          {onDonate && (
            <button
              onClick={onDonate}
              className="flex items-center justify-center h-10 sm:h-11 md:h-12 lg:h-12 px-4 sm:px-5 md:px-6 lg:px-6 bg-[#006fee] hover:bg-[#005fdd] text-white rounded-lg sm:rounded-xl lg:rounded-xl transition-colors cursor-pointer"
            >
              <span className="text-sm leading-5 sm:text-[15px] sm:leading-6 md:text-base md:leading-6 lg:text-[16px] lg:leading-6">
                {donateButtonText}
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
