import HeroBanner from "./components/home/HeroBanner";
import NewsAndUpdates from "./components/home/NewsAndUpdates";
import Services from "./components/home/Services";
import MeetOurImams from "./components/home/MeetOurImams";
import AyatOfTheMonth from "./components/home/AyatOfTheMonth";
import Sermons from "./components/home/Sermons";
import DonationAppeal from "./components/home/DonationAppeal";

export default function Home() {
  return (
    <div className="bg-white dark:bg-gray-950">
      {/* Hero Banner Carousel */}
      <HeroBanner />

      {/* News and Updates Section */}
      <NewsAndUpdates />

      {/* Services Section */}
      <Services />

      {/* Meet Our Imams Section */}
      <MeetOurImams />

      {/* Ayat of the Month Section */}
      <AyatOfTheMonth />

      {/* Sermons Section */}
      <Sermons />

      {/* Donation Appeal Section */}
      <DonationAppeal />
    </div>
  );
}
