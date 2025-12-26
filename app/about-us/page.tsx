import PageHero from "../components/common/PageHero";
import ContentImageSection from "../components/common/ContentImageSection";
import { CoreValuesSection } from "../components/about/OurCoreValue";

export default function AboutUsPage() {
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
      
      {/* Our History Section */}
      <ContentImageSection
        heading="Our History"
        imageSrc="/assets/about-us/our-history.png"
        imageAlt="Masjid Al-Falah - Historical view"
        layout="image-right"
        content={
          <>
            <p>
              In <strong>1996</strong>, a building at{" "}
              <strong>97 Empress Avenue, Ilford</strong> was purchased by a few
              dedicated Muslims to establish a Masjid for the local community. It
              hosted prayers, children's Islamic classes, and Taraweeh during
              Ramadan. However, due to planning restrictions, a mosque couldn't be
              established there.
            </p>
            <p>
              Undeterred, the founders sought a new location.{" "}
              <strong>Alhamdulillah, in 2007</strong>, they secured a
              purpose-built property at <strong>97 Kensington Gardens</strong>,
              originally a <strong>Jehovah's Witness Church</strong> since the
              1960s. The building was converted into{" "}
              <strong>Masjid Al-Falah (North Ilford Islamic Centre)</strong>, and
              daily prayers began immediately.
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

      {/* Add more sections here as needed */}

      <CoreValuesSection />
    </div>
  );
}
