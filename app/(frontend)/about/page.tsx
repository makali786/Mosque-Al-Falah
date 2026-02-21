import AboutQuoteSection from '@/components/about/AboutQuoteSection';
import {
  CommitteeMember,
  CommitteesSection,
} from '@/components/about/CommitiesCard';
import ConnectWithUsSection from '@/components/about/ConnectWithUs';
import { CoreValuesSection } from '@/components/about/OurCoreValue';
import ContentImageSection from '@/components/common/ContentImageSection';
import PageHero from '@/components/common/PageHero';
import { RichTextRenderer } from '@/components/common/RichTextRenderer';
import {
  fetchCommittees,
  fetchCoreValues,
  fetchGlobal,
} from '../../../lib/fetcher';

export const revalidate = 60;

export default async function AboutUsPage() {
  const aboutUs = await fetchGlobal({ slug: 'about-page' });
  const coreValuesDocs = await fetchCoreValues({ sort: '_order' });
  const committeesDocs = await fetchCommittees<CommitteeMember>({
    sort: '_order',
    where: { isActive: { equals: true } },
  });
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
      <p className="text-lg">{aboutUs?.mission?.introduction}</p>
      {aboutUs?.mission?.missionPoints && (
        <ul className="list-disc pl-5 space-y-3 mt-2">
          {aboutUs?.mission?.missionPoints.map((point: any, index: number) => (
            <li key={point?.id || index}>
              <span className="font-bold whitespace-nowrap mr-2">
                {point.title}
              </span>
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
        title={aboutUs.hero?.title || ''}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'About Us', href: '/about-us' },
        ]}
        backgroundImage={aboutUs.hero?.backgroundImage?.url || ''}
      />

      {aboutUs.history?.enableSection && (
        <div id="history">
          <ContentImageSection
            heading={aboutUs.history.sectionTitle}
            imageSrc={aboutUs.history.image?.url || ''}
            imageAlt={aboutUs.history.image?.alt || ''}
            layout="image-right"
            imageWidth={664}
            imageHeight={498}
            content={<RichTextRenderer content={aboutUs.history.content} />}
          />
        </div>
      )}

      {aboutUs.mission?.enableSection && (
        <div id="mission">
          <ContentImageSection
            heading={aboutUs.mission.sectionTitle}
            imageSrc={aboutUs.mission.image?.url || ''}
            imageAlt={aboutUs.mission.image?.alt || ''}
            layout="image-left"
            imageWidth={584}
            imageHeight={438}
            content={missionContent}
          />
        </div>
      )}

      {aboutUs.coreValues?.enableSection && (
        <CoreValuesSection
          title={aboutUs.coreValues.sectionTitle}
          description={aboutUs.coreValues.description}
          items={coreValuesItems}
        />
      )}

      {aboutUs.committeesSection?.enableSection && (
        <div id="committees">
          <CommitteesSection
            title={aboutUs.committeesSection.sectionTitle}
            description={aboutUs.committeesSection.description}
            members={committeesDocs}
          />
        </div>
      )}

      {aboutUs.connect?.enableSection && (
        <ConnectWithUsSection
          title={aboutUs.connect.sectionTitle}
          description={aboutUs.connect.description}
          image={{
            src: aboutUs.connect.image?.url || '',
            alt: aboutUs.connect.image?.alt || 'Connect with Us',
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
