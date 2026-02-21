import {
  fetchAyatOfTheMonth,
  fetchBanners,
  fetchDonationAppeals,
  fetchEvents,
  fetchGlobal,
  fetchImams,
  fetchNotices,
  fetchSermons,
  fetchServices,
} from '../../lib/fetcher';
import { getNextOccurrence } from '../../lib/recurring-events';
import AyatOfTheMonth from './components/home/AyatOfTheMonth';
import DonationAppeal from './components/home/DonationAppeal';
import HeroBanner from './components/home/HeroBanner';
import MeetOurImams from './components/home/MeetOurImams';
import NewsAndUpdates from './components/home/NewsAndUpdates';
import Sermons from './components/home/Sermons';
import Services from './components/home/Services';

export const revalidate = 60;

export default async function Home() {
  // Fetch home page configuration
  const homePageConfig = await fetchGlobal({ slug: 'home-page' });

  const banners = await fetchBanners({
    depth: 1,
    sort: '_order',
    where: { isActive: { equals: true } },
  });

  // Fetch all published events (both one-time and recurring)
  const now = new Date();
  const allEvents = await fetchEvents({
    limit: 50, // Fetch more to account for filtering
    depth: 1,
    sort: 'timing.startDate',
    where: {
      isPublished: { equals: true },
    },
  });

  // Process events to include recurring event occurrences
  const upcomingEvents = allEvents
    .map((event: any) => {
      if (event.recurrence?.isRecurring) {
        // For recurring events, calculate next occurrence
        const nextOccurrence = getNextOccurrence(event, now);
        if (nextOccurrence) {
          return {
            ...event,
            nextOccurrenceDate: nextOccurrence,
            displayDate: nextOccurrence,
          };
        }
        return null;
      } else {
        // For one-time events, check if they haven't ended yet
        const endDate = new Date(event.timing.endDate);
        if (endDate >= now) {
          return {
            ...event,
            displayDate: new Date(event.timing.startDate),
          };
        }
        return null;
      }
    })
    .filter((event: any) => event !== null)
    .sort((a: any, b: any) => {
      // Sort by display date
      const dateA = a.displayDate.getTime();
      const dateB = b.displayDate.getTime();
      return dateA - dateB;
    })
    .slice(0, 4); // Take only the first 4 for the homepage

  const services = await fetchServices({
    depth: 1,
    sort: '_order',
    where: { isActive: { equals: true } },
  });
  const imams = await fetchImams({
    limit: 4,
    depth: 1,
    sort: '_order',
    where: { isActive: { equals: true } },
  });
  const ayatOfTheMonth = await fetchAyatOfTheMonth({
    depth: 1,
    sort: '_order',
    where: { isActive: { equals: true } },
  });
  const sermons = await fetchSermons({
    depth: 1,
    sort: '_order',
    where: { isPublished: { equals: true } },
  });
  const donationAppeal = await fetchDonationAppeals({
    depth: 1,
    sort: '_order',
    where: { isActive: { equals: true } },
  });
  const notices = await fetchNotices({
    depth: 1,
    sort: '-noticeDate',
    where: { isPublished: { equals: true } },
  });

  return (
    <div className="bg-white">
      {/* Hero Banner Carousel */}
      {homePageConfig?.hero?.enableHero && <HeroBanner banners={banners} />}

      {/* News and Updates Section */}
      {homePageConfig?.upcomingEvents?.enableSection && (
        <NewsAndUpdates events={upcomingEvents} notices={notices} />
      )}

      {/* Services Section */}
      {homePageConfig?.servicesSection?.enableSection && (
        <Services services={services} />
      )}

      {/* Meet Our Imams Section */}
      {homePageConfig?.imamsSection?.enableSection && (
        <MeetOurImams imams={imams} />
      )}

      {/* Ayat of the Month Section */}
      {homePageConfig?.ayatSection?.enableSection && (
        <AyatOfTheMonth ayatOfTheMonth={ayatOfTheMonth} />
      )}

      {/* Sermons Section */}
      {homePageConfig?.sermonsSection?.enableSection && (
        <Sermons sermons={sermons} />
      )}

      {/* Donation Appeal Section */}
      {homePageConfig?.donationSection?.enableSection && (
        <DonationAppeal donationAppeal={donationAppeal} />
      )}
    </div>
  );
}
