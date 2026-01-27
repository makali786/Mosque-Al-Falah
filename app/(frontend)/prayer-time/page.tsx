import PrayerTimesWrapper from "@/components/prayer-times/PrayerTimesWrapper";
import { QuoteSection } from "@/components/common/QuoteSection";
import { fetchPrayerTimes, fetchGlobal } from "@lib/fetcher";

export default async function PrayerTimePage() {
  // Fetch ALL prayer times from all years in database
  // Setting high limit to ensure we get all records
  const prayerTimes = await fetchPrayerTimes({
    limit: 10000,
    depth: 1,
    sort: 'date',
  });

  // Fetch prayer time settings (Jumuah, Ramadan, etc.)
  const settings = await fetchGlobal({ slug: "prayer-time-settings" });
  const prayerTimesPage = await fetchGlobal({ slug: "prayer-times-page" });

  return (
    <div className="bg-white">
      <PrayerTimesWrapper
        initialPrayerTimes={prayerTimes || []}
        settings={settings}
      />
      {/* Quote Section */}
      {prayerTimesPage?.quoteSection?.showQuote && (
        <QuoteSection
          quote={prayerTimesPage.quoteSection.quoteText}
          attribution={prayerTimesPage.quoteSection.quoteAttribution}
          // Find donate button from CTA buttons if available
          donateButtonUrl={
            prayerTimesPage.ctaButtons?.showCTAButtons
              ? prayerTimesPage.ctaButtons.buttons?.find(
                (b: any) =>
                  b.action === "navigate" &&
                  (b.text.toLowerCase().includes("donate") ||
                    b.url?.toLowerCase().includes("donate"))
              )?.url || "/donate"
              : "/donate"
          }
          // Construct share data
          shareData={{
            title: prayerTimesPage.pageHeader?.title || "Prayer Times",
            text: prayerTimesPage.quoteSection.quoteText,
            url: "/prayer-time",
          }}
          backgroundColor={
            prayerTimesPage.quoteSection.quoteBackgroundColor === "white"
              ? "#ffffff"
              : prayerTimesPage.quoteSection.quoteBackgroundColor === "blue"
                ? "#eff6ff" // blue-50
                : prayerTimesPage.quoteSection.quoteBackgroundColor === "dark"
                  ? "#18181b" // zinc-900
                  : "#f4f4f5" // gray (default)
          }
        />
      )}
    </div>
  );
}
