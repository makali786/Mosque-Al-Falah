import PageHero from "@/components/common/PageHero";
import ContentImageSection from "@/components/common/ContentImageSection";
import { CoreValuesSection } from "@/components/about/OurCoreValue";
import { CommitteesSection, CommitteeMember } from "@/components/about/CommitiesCard";
import ConnectWithUsSection from "@/components/about/ConnectWithUs";
import AboutQuoteSection from "@/components/about/AboutQuoteSection";
import { fetchGlobal, fetchCoreValues, fetchCommittees } from "../../../lib/fetcher";
import { RichTextRenderer } from "@/components/common/RichTextRenderer";

export default async function AboutUsPage() {
  const aboutUs = await fetchGlobal({ slug: "about-page" });
  const coreValuesDocs = await fetchCoreValues({ sort: 'order' });
  const committeesDocs = await fetchCommittees<CommitteeMember>({ sort: 'order', where: { isActive: { equals: true } } });
  if (!aboutUs) return null;

  // Transform core values
  const coreValuesItems = coreValuesDocs.map((doc: any) => ({
    id: doc?.id,
    question: doc?.question,
    answer: doc?.answer,
  }));

  // Mission Content
  const missionContent = (
    <div className="flex flex-col gap-4">
      <p className="text-base leading-relaxed text-gray-700 dark:text-gray-300">
        {aboutUs?.mission?.introduction}
      </p>
      {aboutUs?.mission?.missionPoints && (
        <ul className="flex flex-col gap-3 mt-2">
          {aboutUs?.mission?.missionPoints.map((point: any, index: number) => (
            <li key={point?.id || index} className="flex gap-2 text-base text-gray-700 dark:text-gray-300">
              <span className="font-bold whitespace-nowrap">{point.title}</span>
              <span>{point.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-950">
      <PageHero
        title={aboutUs.hero?.title || ""}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "About Us", href: "/about-us" },
        ]}
        backgroundImage={aboutUs.hero?.backgroundImage?.url || ""}
      />

      {aboutUs.history?.enableSection && (
        <ContentImageSection
          heading={aboutUs.history.sectionTitle}
          imageSrc={aboutUs.history.image?.url || ""}
          imageAlt={aboutUs.history.image?.alt || ""}
          layout="image-right"
          imageWidth={664}
          imageHeight={498}
          content={<RichTextRenderer content={aboutUs.history.content} />}
        />
      )}

      {aboutUs.mission?.enableSection && (
        <ContentImageSection
          heading={aboutUs.mission.sectionTitle}
          imageSrc={aboutUs.mission.image?.url || ""}
          imageAlt={aboutUs.mission.image?.alt || ""}
          layout="image-left"
          imageWidth={584}
          imageHeight={438}
          content={missionContent}
        />
      )}

      {aboutUs.coreValues?.enableSection && (
        <CoreValuesSection
          title={aboutUs.coreValues.sectionTitle}
          description={aboutUs.coreValues.description}
          items={coreValuesItems}
        />
      )}

      {aboutUs.committeesSection?.enableSection && (
        <CommitteesSection
          title={aboutUs.committeesSection.sectionTitle}
          description={aboutUs.committeesSection.description}
          members={committeesDocs}
        />
      )}

      {aboutUs.connect?.enableSection && (
        <ConnectWithUsSection
          title={aboutUs.connect.sectionTitle}
          description={aboutUs.connect.description}
          image={{
            src: aboutUs.connect.image?.url || "",
            alt: aboutUs.connect.image?.alt || "Connect with Us"
          }}
          primaryButton={aboutUs.connect.primaryButton}
          secondaryButton={aboutUs.connect.secondaryButton}
        />
      )}

      {aboutUs.quote?.enableSection && (
        <AboutQuoteSection
          quote={aboutUs.quote.quoteText}
          attribution={aboutUs.quote.author}
          donateButtonUrl={aboutUs.quote.donateButtonUrl}
        />
      )}
    </div>
  );
}
