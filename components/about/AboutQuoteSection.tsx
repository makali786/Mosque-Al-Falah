import { QuoteSection } from "@/components/common/QuoteSection";

export default function AboutQuoteSection() {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Islamic Guidance",
          text: "Whoever guides someone to goodness will have a reward like the one who did it.",
          url: window.location.href,
        })
        .catch((err) => console.log("Share failed:", err));
    } else {
      alert("Share this page: " + window.location.href);
    }
  };

  const handleDonate = () => {
    window.location.href = "/donate";
  };

  return (
    <QuoteSection
      quote="Whoever guides someone to goodness will have a reward like the one who did it."
      attribution="Prophet Muhammad"
      showAttributionSymbol={true}
      onShare={handleShare}
      onDonate={handleDonate}
      shareButtonText="Share this page"
      donateButtonText="Donate Now"
    />
  );
}
