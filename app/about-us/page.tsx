"use client";

import PageHero from "../components/common/PageHero";
import ContentImageSection from "../components/common/ContentImageSection";
import { CoreValuesSection } from "../components/about/OurCoreValue";
import { TeamMemberCard } from "../components/about/CommitiesCard";
import ConnectWithUsSection from "../components/about/ConnectWithUs";
import { QuoteSection } from "../components/common/QuoteSection";

export default function AboutUsPage() {
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Islamic Guidance",
          text: "Whoever guides someone to goodness will have a reward like the one who did it.",
          url: window.location.href,
        })
        .catch((err) => console.log("Share failed:", err))
    } else {
      alert("Share this page: " + window.location.href)
    }
  }

  const handleDonate = () => {
    window.location.href = "/donate"
  }

  return (
    <div className="bg-white dark:bg-gray-950">
      <PageHero
        title="About Us"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about-us" },
        ]}
        backgroundImage="/assets/about-us/about-us.jpg"
      />
      <ContentImageSection
        heading="Our History"
        imageSrc="/assets/about-us/our-history.png"
        imageAlt="Masjid Al-Falah - Historical view"
        layout="image-right"
        imageWidth={664}
        imageHeight={498}
        content={
          <>
            <p>
              In <strong>1996</strong>, a building at{" "}
              <strong>97 Empress Avenue, Ilford</strong> was purchased by a few
              dedicated Muslims to establish a Masjid for the local community.
              It hosted prayers, children's Islamic classes, and Taraweeh during
              Ramadan. However, due to planning restrictions, a mosque couldn't
              be established there.
            </p>
            <p>
              Undeterred, the founders sought a new location.{" "}
              <strong>Alhamdulillah, in 2007</strong>, they secured a
              purpose-built property at <strong>97 Kensington Gardens</strong>,
              originally a <strong>Jehovah's Witness Church</strong> since the
              1960s. The building was converted into{" "}
              <strong>Masjid Al-Falah (North Ilford Islamic Centre)</strong>,
              and daily prayers began immediately.
            </p>
            <p>
              To accommodate the growing Muslim community, neighboring buildings
              were acquired in <strong>2009</strong> and <strong>2011</strong>.{" "}
              <strong>Masjid Al-Falah</strong> continues to thrive, serving and
              supporting the local community.
            </p>
          </>
        }
      />
      {/* Our Mission Section */}
      <ContentImageSection
        heading="Our Mission"
        imageSrc="/assets/about-us/our-mission.png"
        imageAlt="Masjid Al-Falah - Our Mission"
        layout="image-left"
        imageWidth={584}
        imageHeight={438}
        content={
          <>
            <p>
              Masjid Al-Falah, North Ilford Islamic Centre, is dedicated to
              serving the religious, spiritual, educational, and communal needs
              of the local community by:
            </p>
            <ul>
              <li>
                <strong>Inspiring faith:</strong> in the Almighty and following
                the teachings of Prophet Muhammad (ﷺ).
              </li>
              <li>
                <strong>Educating:</strong> on the true teachings of Islam
                through the <strong>Qur'an and Sunnah</strong>.
              </li>
              <li>
                <strong>Fostering well-being:</strong> through communal worship.
              </li>
              <li>
                <strong>Serving:</strong> our neighbors and community.
              </li>
              <li>
                <strong>Promoting:</strong> peace, harmony, respect, and mercy.
              </li>
            </ul>
          </>
        }
      />
      <CoreValuesSection />
      <QuoteSection
        quote="Whoever guides someone to goodness will have a reward like the one who did it."
        attribution="Prophet Muhammad"
        showAttributionSymbol={true}
        onShare={handleShare}
        onDonate={handleDonate}
        shareButtonText="Share this page"
        donateButtonText="Donate Now"
      />
      <ConnectWithUsSection />
    </div>
  );
}
