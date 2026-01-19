import HeroBanner from "./components/home/HeroBanner";
import NewsAndUpdates from "./components/home/NewsAndUpdates";
import Services from "./components/home/Services";
import MeetOurImams from "./components/home/MeetOurImams";
import AyatOfTheMonth from "./components/home/AyatOfTheMonth";
import Sermons from "./components/home/Sermons";
import DonationAppeal from "./components/home/DonationAppeal";
import { fetchBanners, fetchEvents, fetchServices, fetchImams, fetchAyatOfTheMonth, fetchSermons, fetchDonationAppeals, fetchNotices, fetchGlobal } from "../../lib/fetcher";

export default async function Home() {
  // Fetch home page configuration
  const homePageConfig = await fetchGlobal({ slug: "home-page" });

  const banners = await fetchBanners({ depth: 1, sort: 'order', where: { isActive: { equals: true, }, }, })
  const events = await fetchEvents({ limit: 4, depth: 1, sort: 'order', where: { isPublished: { equals: true, }, }, })
  const services = await fetchServices({ depth: 1, sort: 'order', where: { isActive: { equals: true, }, }, })
  const imams = await fetchImams({ limit: 4, depth: 1, sort: 'order', where: { isActive: { equals: true, }, }, })
  const ayatOfTheMonth = await fetchAyatOfTheMonth({ depth: 1, sort: 'order', where: { isActive: { equals: true, }, }, })
  const sermons = await fetchSermons({ depth: 1, sort: 'order', where: { isPublished: { equals: true, }, }, })
  const donationAppeal = await fetchDonationAppeals({ depth: 1, sort: 'order', where: { isActive: { equals: true, }, }, })
  const notices = await fetchNotices({ depth: 1, sort: '-noticeDate', where: { isPublished: { equals: true, }, }, })


  return (
    <div className="bg-white">
      {/* Hero Banner Carousel */}
      {homePageConfig?.hero?.enableHero && (
        <HeroBanner banners={banners} />
      )}

      {/* News and Updates Section */}
      {homePageConfig?.upcomingEvents?.enableSection && (
        <NewsAndUpdates events={events} notices={notices} />
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
