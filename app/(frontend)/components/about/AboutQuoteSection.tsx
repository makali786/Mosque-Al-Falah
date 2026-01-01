"use client";

import { QuoteSection } from "@/components/common/QuoteSection";

interface AboutQuoteSectionProps {
  quote: string;
  attribution: string;
  donateButtonUrl?: string;
}

export default function AboutQuoteSection({ quote, attribution, donateButtonUrl }: AboutQuoteSectionProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
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
    if (donateButtonUrl) {
      window.location.href = donateButtonUrl;
    }
  };

  return (
    <QuoteSection
      quote={quote}
      attribution={attribution}
      showAttributionSymbol={false} 
      onShare={handleShare}
      onDonate={donateButtonUrl ? handleDonate : undefined}
      shareButtonText="Share this page"
      donateButtonText="Donate Now"
    />
  );
}
