import {
  CommitteeMember,
  CommitteesSection,
} from '@/components/about/CommitiesCard';
import MadrasahAdmissions from '../components/madrasah/MadrasahAdmissions';
import MadrasahCoreAims from '../components/madrasah/MadrasahCoreAims';
import MadrasahFAQs from '../components/madrasah/MadrasahFAQs';
import MadrasahGallery from '../components/madrasah/MadrasahGallery';
import MadrasahJourneyCTA from '../components/madrasah/MadrasahJourneyCTA';
import MadrasahLeadership from '../components/madrasah/MadrasahLeadership';
import MadrasahVisitCentre from '../components/madrasah/MadrasahVisitCentre';
import ParentReviews from '../components/madrasah/ParentReviews';
import StructuredCurriculumClient from '../components/madrasah/StructuredCurriculumClient';

import { fetchCommittees, fetchGlobal, findFromPayload } from '@lib/fetcher';
import configPromise from '@payload-config';
import { Metadata } from 'next';
import Link from 'next/link';
import { getPayload } from 'payload';

export const revalidate = 60;

// Define Interfaces based on API response

interface MadrasahPageGlobal {
  hero: {
    title: string;
    subtitle: string;
    description: string;
    tag1: string;
    tag2: string;
    tag3: string;
    button1Text: string;
    button1Url: string;
    button2Text: string;
    button2Url: string;
    backgroundImage?: { url: string } | null;
  };
  mission: {
    enableSection: boolean;
    tag: string;
    title: string;
    description: string;
    image?: { url: string } | null;
    cards: Array<{
      title: string;
      description: string;
    }>;
  };
  classSchedule: {
    enableSection: boolean;
    title: string;
    description: string;
    sessions: Array<{
      sessionTag: string;
      title: string;
      description: string;
      days: string;
      time: string;
      buttonText: string;
      buttonUrl?: string;
      theme: 'light' | 'gold';
    }>;
  };
  structuredCurriculum: {
    enableSection: boolean;
    title: string;
    description: string;
    infoBoxText: string;
    curriculumBlocks: Array<{
      blockTitle: string;
      iconType: 'book' | 'head';
      items: Array<{
        number: string;
        title: string;
        description: string;
      }>;
    }>;
  };
  classesSection: {
    enableSection: boolean;
    sectionTitle: string;
    displayMode: string;
    gridColumns: string;
  };
  admissionsSection: {
    enableSection: boolean;
    title: string;
    description: string;
    eligibilityAgeRange: string;
    eligibilityAgeUnit: string;
    eligibilityBody: string;
    processHeadline: string;
    processBody: string;
    feesBadgeLabel: string;
    feesBody: string;
    feePoints: Array<{ id?: string; text: string }>;
    feesHardshipNote: string;
    feesCtaText: string;
    feesCtaUrl: string;
  };
  committeeSection: {
    enableSection: boolean;
    sectionTitle: string;
    description: string;
    gridColumns: string;
    committeeType?: string;
  };
  coreAimsSection: {
    enableSection: boolean;
    title: string;
    description: string;
    aims: Array<{ id?: string; title: string; description: string }>;
    safeguardingTitle: string;
    safeguardingDescription: string;
    safeguardingPoints: Array<{ id?: string; text: string }>;
  };
  journeyCtaSection: {
    enableSection: boolean;
    title: string;
    description: string;
    primaryButtonText: string;
    primaryButtonUrl: string;
    secondaryButtonText: string;
    secondaryButtonUrl: string;
  };
  visitCentreSection: {
    enableSection: boolean;
    title: string;
    addressLabel: string;
    addressValue: string;
    emailLabel: string;
    emailValue: string;
    phoneLabel: string;
    phoneValue: string;
    latitude: number;
    longitude: number;
  };
  gallerySection: {
    enableSection: boolean;
    sectionLabel: string;
    sectionTitle: string;
    description: string;
    galleryImages: any[];
    contactButtonText: string;
    contactButtonUrl: string;
    enrollButtonText: string;
    enrollButtonUrl: string;
  };
  testimonialsSection: {
    enableSection: boolean;
    sectionLabel: string;
    sectionTitle: string;
  };
  faqsSection: {
    enableSection: boolean;
    sectionTitle: string;
    sectionDescription: string;
    faqs: Array<{
      id: string;
      question: string;
      answer: any;
    }>;
  };
  contactSection: {
    enableSection: boolean;
    sectionTitle: string;
    description: string;
  };
  bottomQuote: {
    enableSection: boolean;
    quoteText: string;
    author: string;
    donateButtonUrl: string;
    showShareButton: boolean;
    showDonateButton: boolean;
  };
  leadershipSection: {
    enableSection: boolean;
    title: string;
    description: string;
    members: Array<{
      id?: string;
      name: string;
      role: string;
      bio: string;
      photo?: { id: string; url: string; alt?: string } | null;
      whatsappUrl?: string | null;
      emailUrl?: string | null;
    }>;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchGlobal<MadrasahPageGlobal>({ slug: 'madrasah-page' });
  return {
    title: data?.seo?.metaTitle || 'Madrasah - Masjid Al-Falah',
    description: data?.seo?.metaDescription || 'Explore our Madrasah programs.',
  };
}

export default async function MadrasahPage() {
  // 1. Fetch Global Data
  const pageData = await fetchGlobal<MadrasahPageGlobal>({
    slug: 'madrasah-page',
  });

  // 2. Fetch Collections
  const classesData = await findFromPayload({ collection: 'madrasah-classes' });
  const testimonialsData = await findFromPayload({
    collection: 'madrasah-testimonials',
  });

  if (!pageData) {
    return <div>Loading...</div>;
  }

  // Map Leadership Section members to CommitteeMember format
  const mappedLeadershipMembers: CommitteeMember[] = (pageData.leadershipSection?.members || []).map((m, idx) => ({
    id: m.id || idx.toString(),
    name: m.name,
    role: m.role,
    bio: m.bio,
    committeeType: 'education',
    photo: {
      id: m.photo?.id || '',
      url: m.photo?.url || '',
      alt: m.name,
      filename: '',
      mimeType: '',
      filesize: 0,
      width: 0,
      height: 0,
    } as any,
    contact: {
      enableWhatsApp: !!m.whatsappUrl,
      whatsappNumber: m.whatsappUrl || '',
      enableEmail: !!m.emailUrl,
      email: m.emailUrl || '',
    },
    order: idx,
    isFeatured: true,
    isActive: true,
  }));

  // Server Action for form submission
  async function handleMadrasahQuestionSubmit(data: any) {
    'use server';
    try {
      const payload = await getPayload({ config: configPromise });

      await payload.create({
        collection: 'questions' as any,
        data: {
          name: data.fullName,
          email: data.email,
          topic: 'madrasah',
          message: `Phone: ${data.phoneNumber}\n\n${data.comments}`,
          status: 'pending',
        },
      });
      console.log('Madrasah question submitted successfully');
    } catch (error) {
      console.error('Error submitting madrasah question:', error);
      throw new Error('Failed to submit question.');
    }
  }

  return (
    <div className="bg-white">
      {/* 1. Hero Section */}
      <div
        className="w-full section-padding py-20 inline-flex flex-col justify-start items-center gap-6 overflow-hidden relative"
      >
        {/* Background Image overlay */}
        {pageData.hero?.backgroundImage ? (
          <div
            className="absolute inset-0 z-[1]"
            style={{
              backgroundImage: `linear-gradient(58.7957deg, rgb(0, 0, 0) 7.3664%, rgba(0, 0, 0, 0) 100%), url('${pageData.hero?.backgroundImage?.url}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : null}
        <div className="absolute inset-0 bg-black/70 z-[-1]"></div>

        <div className="w-full max-w-[1200px] z-[2] flex flex-col justify-start items-center gap-10 z">
          <div className="flex flex-wrap justify-center items-start gap-4 self-stretch">
            <div className="px-5 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-[6px] flex justify-start items-center gap-2">
              <div className="text-yellow-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 6C14 6 11 5 8 5C5 5 2 6 2 6M14 6L8 9L2 6M14 6V10C14 11.1046 11.3137 12 8 12C4.68629 12 2 11.1046 2 10V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center justify-center text-white text-sm font-medium font-sans leading-5">{pageData.hero?.tag1}</div>
            </div>
            <div className="px-5 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-[6px] flex justify-start items-center gap-2">
              <div className="text-yellow-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2.66663" y="2.66663" width="10.6667" height="10.6667" rx="2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M10.6666 1.33337V4.00004M5.33331 1.33337V4.00004M2.66663 6.66671H13.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center justify-center text-white text-sm font-medium font-sans leading-5">{pageData.hero?.tag2}</div>
            </div>
            <div className="px-5 py-2 bg-white/10 rounded-full border border-white/20 backdrop-blur-[6px] flex justify-start items-center gap-2">
              <div className="text-yellow-400">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 2.66663V13.3333H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M8 6.66663V9.33329L10 11.3333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="text-center justify-center text-white text-sm font-medium font-sans leading-5">{pageData.hero?.tag3}</div>
            </div>
          </div>
          <div className="self-stretch flex flex-col justify-start items-center gap-4">

            <h1 className={`font-extrabold text-white text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-[48px] leading-tight sm:leading-tight md:leading-tight lg:leading-tight xl:leading-12`}>{pageData.hero?.title}</h1>
            <div className="text-center justify-center text-yellow-500 text-2xl md:text-4xl font-medium font-sans leading-tight md:leading-[60px]">{pageData.hero?.subtitle}</div>
          </div>
          <div className="w-full max-w-[800px] flex flex-col justify-start items-center">
            <div className="self-stretch text-center justify-center text-slate-200 text-lg md:text-xl font-normal font-sans md:leading-7">{pageData.hero?.description}</div>
          </div>
          <div className="self-stretch inline-flex flex-wrap justify-center items-start gap-5">
            <Link href={pageData.hero?.button1Url || '#'} className="h-12 px-6 bg-white text-black hover:bg-gray-100 transition-colors rounded-full flex justify-center items-center gap-2">
              <div className="flex justify-center items-center gap-2">
                <div className="flex justify-center items-center gap-2">
                  <div className="justify-center text-base font-normal font-sans leading-6">{pageData.hero?.button1Text}</div>
                </div>
              </div>
            </Link>
            <Link href={pageData.hero?.button2Url || '#'} className="h-12 px-6 bg-blue-600 text-white hover:bg-blue-700 transition-opacity rounded-full flex justify-center items-center gap-2">
              <div className="flex justify-center items-center gap-2">
                <div className="flex justify-center items-center gap-2">
                  <div className="justify-center text-base font-normal font-sans leading-6">{pageData.hero?.button2Text}</div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* 1.5 Mission Section */}
      {pageData.mission?.enableSection && (
        <div className="w-full py-20 bg-[#F8F9FA] flex justify-center items-center overflow-hidden">
          <div className="section-padding w-full flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-11">

            {/* Left Column */}
            <div className="w-full lg:w-[546px] flex flex-col justify-start items-start gap-8">
              <div className="px-4 py-2 bg-slate-200/70 rounded-full inline-flex justify-start items-start">
                <div className="text-center justify-center text-zinc-800 text-sm font-semibold font-sans leading-5">{pageData.mission.tag}</div>
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div
                  className="w-full text-zinc-800 text-3xl md:text-4xl font-extrabold font-sans leading-tight md:leading-[36px]"
                  dangerouslySetInnerHTML={{ __html: pageData.mission.title.replace(/\n/g, '<br/>') }}
                />
              </div>
              <div className="w-full flex flex-col justify-start items-start">
                <div
                  className="w-full text-slate-600 text-base md:text-lg font-normal font-sans leading-7"
                  dangerouslySetInnerHTML={{ __html: pageData.mission.description.replace(/\n/g, '<br/>') }}
                />
              </div>
              <div className="w-full lg:h-[224px] flex flex-col justify-end items-start mt-4 lg:mt-0">
                <div className="w-full h-[224px] relative rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)] bg-white">
                  <img
                    className="w-full h-full object-cover absolute inset-0"
                    src={pageData.mission.image?.url || "https://placehold.co/546x307"}
                    alt={pageData.mission.title}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="w-full lg:w-[543px] flex flex-col justify-center">
              <div className="flex flex-row flex-wrap justify-between items-start gap-y-6 lg:gap-6 content-start">
                {pageData.mission.cards?.map((card, idx) => (
                  <div key={idx} className="w-full sm:w-[calc(50%-12px)] lg:w-[259px] px-5 py-8 bg-white rounded-3xl shadow-[0_4px_20px_0_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col justify-start items-start gap-4 hover:shadow-lg transition-all duration-300">
                    <div className="w-11 h-11 text-yellow-500 flex items-center justify-start flex-shrink-0">
                      {/* Icons based on index */}
                      {idx === 0 && (
                        <img src="/assets/madrasah/icon-notebook-bookmark.svg" alt="Education" width={44} height={44} />
                      )}
                      {idx === 1 && (
                        <img src="/assets/madrasah/icon-heart.svg" alt="Care" width={44} height={44} />
                      )}
                      {idx === 2 && (
                        <img src="/assets/madrasah/icon-family.svg" alt="Community" width={44} height={44} />
                      )}
                      {idx === 3 && (
                        <img src="/assets/madrasah/icon-notebook.svg" alt="Excellence" width={44} height={44} />
                      )}
                    </div>
                    <div className="w-full flex flex-col justify-start items-start">
                      <div className="w-full text-zinc-800 text-xl font-bold font-sans leading-7 tracking-tight">{card.title}</div>
                    </div>
                    <div className="w-full flex flex-col justify-start items-start">
                      <div className="w-full text-slate-500 text-[15px] font-normal font-sans leading-relaxed">{card.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Class Schedule Section */}
      {pageData.classSchedule?.enableSection && (
        <div className="w-full py-20 section-padding flex flex-col justify-start items-center gap-16 overflow-hidden relative">

          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: "linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)",
            }}
          >
            <div
              className="absolute inset-0 opacity-30 bg-repeat"
              style={{
                backgroundImage: "url('/assets/services/bg-pattern.png')",
                backgroundSize: "154px 154px",
              }}
            />
          </div>

          <div className="w-full flex flex-col justify-start items-center gap-5 z-10">
            <h2 className="text-center text-white text-4xl md:text-5xl font-semibold font-sans leading-tight md:leading-[48px]">
              {pageData.classSchedule.title}
            </h2>
            <p
              className="text-center text-white text-lg font-medium font-sans leading-7 max-w-[852px]"
              dangerouslySetInnerHTML={{ __html: pageData.classSchedule.description.replace(/\n/g, '<br/>') }}
            />
          </div>

          <div className="w-full flex flex-col lg:flex-row gap-10 items-stretch z-10">
            {pageData.classSchedule.sessions?.map((session, idx) => (
              <div key={idx} className="flex-1 w-full bg-white/5 rounded-[40px] border border-white/10 backdrop-blur-[2px] p-12 flex flex-col justify-start items-start gap-12 relative overflow-hidden">

                {/* Top Tags */}
                <div className="w-full flex justify-between items-center">
                  <div className="px-5 py-1.5 bg-yellow-400/20 rounded-full flex flex-col justify-start items-start">
                    <div className="justify-center text-yellow-500 text-sm font-semibold font-sans leading-5 uppercase tracking-wide">{session.sessionTag}</div>
                  </div>
                  <div className="flex flex-col justify-start items-start">
                    <div className="w-6 h-6  rounded flex items-center justify-center p-1">
                      {idx === 0 ? (
                        <img src="/assets/madrasah/icon-class-session-1.svg" alt="Session 1" width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />
                      ) : (
                        <img src="/assets/madrasah/icon-class-session-2.svg" alt="Session 2" width={24} height={24} style={{ filter: 'brightness(0) invert(1)' }} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Title and Desc */}
                <div className="w-full flex flex-col justify-start items-start gap-4">
                  <h3 className="w-full text-white text-3xl lg:text-4xl font-bold font-sans leading-10">{session.title}</h3>
                  <p className="w-full text-blue-200 text-lg font-normal font-sans leading-7">{session.description}</p>
                </div>

                {/* Schedule Days and Time */}
                <div className="w-full flex flex-col justify-start items-start gap-5">
                  <div className="w-full flex justify-start items-center gap-5">
                    <div className="w-5 h-5 flex justify-center items-center text-yellow-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    </div>
                    <div className="text-white text-lg font-normal font-sans leading-7">{session.days}</div>
                  </div>
                  <div className="w-full flex justify-start items-center gap-5">
                    <div className="w-5 h-5 flex justify-center items-center text-yellow-500">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                    </div>
                    <div className="text-white text-lg font-normal font-sans leading-7">{session.time}</div>
                  </div>
                </div>

                {/* Button */}
                <Link href={session.buttonUrl || '#'} className={`w-full py-4 mt-auto rounded-xl inline-flex justify-center items-center transition-transform hover:scale-[1.02] ${session.theme === 'gold' ? 'bg-[#d6a938] hover:bg-[#c29831] text-cyan-950' : 'bg-white hover:bg-slate-100 text-cyan-950'}`}>
                  <span className="text-center text-base font-bold font-poppins leading-6">{session.buttonText}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. Structured Curriculum Section */}
      <StructuredCurriculumClient data={pageData.structuredCurriculum as any} />

      {/* 4. Core Aims Section */}


      {/* 5. Leadership Section */}
      {pageData.leadershipSection?.enableSection && (
        <MadrasahLeadership
          title={pageData.leadershipSection.title || 'Our Leadership'}
          description={pageData.leadershipSection.description}
          members={mappedLeadershipMembers}
          className="bg-[#E6F1FE]!"
        />
      )}
      {pageData.coreAimsSection?.enableSection && (
        <MadrasahCoreAims data={pageData.coreAimsSection as any} />
      )}
      {/* 6. Admissions Section */}
      {pageData.admissionsSection?.enableSection && (
        <MadrasahAdmissions data={pageData.admissionsSection as any} />
      )}
      {/* 6. FAQs Section */}
      {pageData.faqsSection?.enableSection && (
        <MadrasahFAQs
          faqs={pageData.faqsSection.faqs}
          title={pageData.faqsSection.sectionTitle}
          description={pageData.faqsSection.sectionDescription}
        />
      )}
      {/* 9. Gallery Section */}
      {pageData.gallerySection?.enableSection && (
        <MadrasahGallery
          galleryImages={pageData.gallerySection.galleryImages}
          sectionLabel={pageData.gallerySection.sectionLabel}
          sectionTitle={pageData.gallerySection.sectionTitle}
          description={pageData.gallerySection.description}
          contactButtonText={pageData.gallerySection.contactButtonText}
          contactButtonUrl={pageData.gallerySection.contactButtonUrl}
          enrollButtonText={pageData.gallerySection.enrollButtonText}
          enrollButtonUrl={pageData.gallerySection.enrollButtonUrl}
        />
      )}
      {/* 5. What Parents Say Section */}
      {pageData.testimonialsSection?.enableSection && (
        <ParentReviews
          testimonials={testimonialsData}
          sectionLabel={pageData.testimonialsSection.sectionLabel}
          sectionTitle={pageData.testimonialsSection.sectionTitle}
        />
      )}
      {/* 7. Journey CTA Section */}
      {pageData.journeyCtaSection?.enableSection && (
        <MadrasahJourneyCTA data={pageData.journeyCtaSection as any} />
      )}
      {/* 8. Visit Our Centre Section */}
      {pageData.visitCentreSection?.enableSection && (
        <MadrasahVisitCentre data={pageData.visitCentreSection as any} />
      )}

      {/* 5. Classes Section */}
      {/* {pageData.classesSection?.enableSection && (
        <MadrasahClasses
          classes={classesData}
          sectionTitle={pageData.classesSection.sectionTitle}
        />
      )} */}














      {/* 7. Contact Section */}
      {/* {pageData.contactSection?.enableSection && (
        <div className="section-padding">
          <RequestServiceForm
            sectionTitle={pageData.contactSection.sectionTitle}
            description={pageData.contactSection.description}
            className="my-8 lg:my-18"
            onSubmit={handleMadrasahQuestionSubmit}
          />
        </div>
      )} */}

      {/* 8. Quote Section */}
      {/* {pageData.bottomQuote?.enableSection && (
        <QuoteSectionWrapper
          quote={pageData.bottomQuote.quoteText}
          attribution={pageData.bottomQuote.author}
          donateButtonUrl={pageData.bottomQuote.donateButtonUrl}
          showShareButton={pageData.bottomQuote.showShareButton}
          showDonateButton={pageData.bottomQuote.showDonateButton}
        />
      )} */}
    </div>
  );
}
