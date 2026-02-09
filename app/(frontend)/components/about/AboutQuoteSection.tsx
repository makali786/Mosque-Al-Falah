'use client';

import { QuoteSection } from '@/components/common/QuoteSection';

interface AboutQuoteSectionProps {
  quote: string;
  attribution: string;
  donateButtonUrl?: string;
}

export default function AboutQuoteSection({
  quote,
  attribution,
  donateButtonUrl,
}: AboutQuoteSectionProps) {
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
      shareData={{
        title: 'Islamic Guidance',
        text: quote,
        url: typeof window !== 'undefined' ? window.location.href : '',
      }}
      onDonate={donateButtonUrl ? handleDonate : undefined}
      shareButtonText="Share this page"
      donateButtonText="Donate Now"
    />
  );
}
