"use client";

interface QuoteSectionProps {
  quote: string;
  attribution: string;
  showAttributionSymbol?: boolean;
  onShare?: () => void;
  onDonate?: () => void;
  shareButtonText?: string;
  donateButtonText?: string;
  donateButtonUrl?: string;
  shareData?: { title: string; text: string; url: string };
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
  donateButtonUrl,
  shareData,
  backgroundColor = "#f4f4f5",
}: QuoteSectionProps) {
  const handleShare = () => {
    if (onShare) {
      onShare();
      return;
    }
    if (shareData && navigator.share) {
      navigator.share(shareData).catch((err) => console.log("Share failed:", err));
    } else if (shareData) {
      alert("Share this page: " + shareData.url);
    }
  };

  const handleDonate = () => {
    if (onDonate) {
      onDonate();
      return;
    }
    if (donateButtonUrl) {
      window.location.href = donateButtonUrl;
    }
  };

  return (
    <section
      className="w-full py-10 sm:py-11 lg:py-12"
      style={{ backgroundColor }}
    >
      <div className="w-full section-padding flex flex-col lg:flex-row gap-6 sm:gap-8 md:gap-10 lg:gap-12 items-start lg:items-center lg:justify-end">
        {/* Quote and Attribution */}
        <div className="flex-1 w-full">
          <blockquote className="text-lg leading-7 font-medium sm:text-xl sm:leading-8 md:text-[22px] md:leading-7.5 lg:text-[24px] lg:leading-8 text-black">
            <p className="mb-2">
              "{quote}"
            </p>
            <p className="mb-0">
              {attribution}
            </p>
          </blockquote>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 md:gap-6 lg:gap-6 w-full lg:w-auto shrink-0">
          {(onShare || shareData) && (
            <button
              onClick={handleShare}
              className="flex items-center justify-center px-4 sm:px-6 lg:px-6 py-3 bg-[#3f3f46] hover:bg-[#52525b] text-white rounded-lg cursor-pointer"
            >
              <span className="text-sm sm:text-base">
                {shareButtonText}
              </span>
            </button>
          )}
          {(onDonate || donateButtonUrl) && (
            <button
              onClick={handleDonate}
              className="flex items-center justify-center text-sm md:text-base px-4 sm:px-5 md:px-6 lg:px-6 bg-[#006fee] hover:bg-[#005fdd] text-white rounded-lg cursor-pointer"
            >
              {donateButtonText}
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
