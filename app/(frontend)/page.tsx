import HeroBanner, { BannerSlide } from "./components/home/HeroBanner";
import NewsAndUpdates from "./components/home/NewsAndUpdates";
import Services from "./components/home/Services";
import MeetOurImams from "./components/home/MeetOurImams";
import AyatOfTheMonth from "./components/home/AyatOfTheMonth";
import Sermons from "./components/home/Sermons";
import DonationAppeal from "./components/home/DonationAppeal";
import { fetchBanners, fetchEvents, fetchServices, fetchImams, fetchAyatOfTheMonth, fetchSermons, fetchDonationAppeals, fetchNotices } from "../../lib/fetcher";

export default async function Home() {

  const banners = await fetchBanners({ limit: 4, depth: 1, sort: 'order', where: { isActive: { equals: true, }, }, })
  const events = await fetchEvents({ limit: 4, depth: 1, sort: 'order', where: { isPublished: { equals: true, }, }, })

  const services = await fetchServices({ limit: 4, depth: 1, sort: 'order', where: { isActive: { equals: true, }, }, })
  const imams = await fetchImams({ limit: 4, depth: 1, sort: 'order', where: { isActive: { equals: true, }, }, })
  const ayatOfTheMonth = await fetchAyatOfTheMonth({ limit: 4, depth: 1, sort: 'order', where: { isActive: { equals: true, }, }, })
  const sermons = await fetchSermons({ limit: 4, depth: 1, sort: 'order', where: { isPublished: { equals: true, }, }, })

  const donationAppeal = await fetchDonationAppeals({ limit: 4, depth: 1, sort: 'order', where: { isActive: { equals: true, }, }, })
  console.log("donationAppeal", donationAppeal)
  const notices = await fetchNotices({ limit: 4, depth: 1, sort: '-noticeDate', where: { isPublished: { equals: true, }, }, })


  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Banner Carousel */}
      <HeroBanner banners={banners} />

      {/* News and Updates Section */}
      <NewsAndUpdates events={events} notices={notices} />

      {/* Services Section */}
      <Services services={services} />

      {/* Meet Our Imams Section */}
      <MeetOurImams imams={imams} />

      {/* Ayat of the Month Section */}
      <AyatOfTheMonth ayatOfTheMonth={ayatOfTheMonth} />

      {/* Sermons Section */}
      <Sermons sermons={sermons} />

      {/* Donation Appeal Section */}
      <DonationAppeal donationAppeal={donationAppeal} />
    </div>
  );
}
