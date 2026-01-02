"use client";

import { QuoteSection } from "@/components/common/QuoteSection";

interface QuoteSectionWrapperProps {
  quote: string;
  attribution: string;
  donateButtonUrl?: string;
  showShareButton?: boolean;
  showDonateButton?: boolean;
  backgroundColor?: string;
}

export const QuoteSectionWrapper = ({
  quote,
  attribution,
  donateButtonUrl = "/donate",
  showShareButton = true,
  showDonateButton = true,
  backgroundColor,
}: QuoteSectionWrapperProps) => {

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
          title: "Islamic Guidance",
          text: quote,
          url: window.location.href,
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      alert("Share this page: " + window.location.href);
    }
  };

  const handleDonate = () => {
    window.open(donateButtonUrl, "_blank"); // Or just location.href if internal, but using logic from before
  };

  return (
    <QuoteSection
      quote={quote}
      attribution={attribution}
      onShare={showShareButton ? handleShare : undefined}
      onDonate={showDonateButton ? handleDonate : undefined}
      backgroundColor={backgroundColor}
    />
  );
};
