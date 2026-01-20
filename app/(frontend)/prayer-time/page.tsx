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

  return (
    <div className="bg-white">
      <PrayerTimesWrapper
        initialPrayerTimes={prayerTimes || []}
        settings={settings}
      />
      <QuoteSection
        quote="The best of you is the one who is the best to his family."
        attribution="— Prophet Muhammad ﷺ"
        donateButtonUrl="/donate"
        shareData={{
          title: "Prayer Times",
          text: "The best of you is the one who is the best to his family.",
          url: "/prayer-time"
        }}
      />
    </div>
  );
}
