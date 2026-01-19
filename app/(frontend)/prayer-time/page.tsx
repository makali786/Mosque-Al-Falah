import PrayerTimesWrapper from "@/components/prayer-times/PrayerTimesWrapper";
import { QuoteSection } from "@/components/common/QuoteSection";
import { fetchPrayerTimes, fetchGlobal } from "@lib/fetcher";

export default async function PrayerTimePage() {
  // Fetch current month's prayer times
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const prayerTimes = await fetchPrayerTimes({
    limit: 400,
    depth: 1,
    sort: 'date',
    where: {
      date: {
        greater_than_equal: startOfMonth.toISOString().split('T')[0],
        less_than_equal: endOfMonth.toISOString().split('T')[0],
      },
    },
  });

  // Fetch prayer time settings (Jumuah, Ramadan, etc.)
  const settings = await fetchGlobal({ slug: "prayer-time-settings" });

  console.log('Server-side fetch - Prayer times count:', prayerTimes?.length || 0);
  console.log('Server-side fetch - Settings:', settings ? 'loaded' : 'not found');

  if (prayerTimes && prayerTimes.length > 0) {
    console.log('First prayer time record:', prayerTimes[0]);
    console.log('Sample dates:', prayerTimes.slice(0, 3).map((pt: any) => pt.date));
  }

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
