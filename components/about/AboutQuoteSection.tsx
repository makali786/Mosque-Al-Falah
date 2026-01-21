"use client";

import { QuoteSection } from "@/components/common/QuoteSection";

interface AboutQuoteSectionProps {
  quote?: string;
  attribution?: string;
  donateButtonUrl?: string;
}

export default function AboutQuoteSection({ quote, attribution, donateButtonUrl }: AboutQuoteSectionProps) {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Islamic Guidance",
          text: quote || "Share this page",
          url: window.location.href,
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      alert("Share this page: " + window.location.href);
    }
  };

  const handleDonate = () => {
    window.location.href = donateButtonUrl || "/donate";
  };

  // Don't render if no quote is provided
  if (!quote) return null;

  return (
    <QuoteSection
      quote={quote}
      attribution={attribution || ""}
      showAttributionSymbol={true}
      onShare={handleShare}
      onDonate={handleDonate}
      shareButtonText="Share this page"
      donateButtonText="Donate Now"
    />
  );
}
