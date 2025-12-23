import HeroBanner from "./components/HeroBanner";
import NewsAndUpdates from "./components/NewsAndUpdates";
import Services from "./components/Services";
import MeetOurImams from "./components/MeetOurImams";
import AyatOfTheMonth from "./components/AyatOfTheMonth";

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
    </div>
  );
}
