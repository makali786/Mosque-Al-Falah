import AboutQuoteSection from '@/components/about/AboutQuoteSection';
import BreadcrumbSearchSection from '@/components/common/BreadcrumbSearchSection';
import { RichTextRenderer } from '@/components/common/RichTextRenderer';
import { fetchServices, fetchGlobal } from '../../../../../lib/fetcher';
import EidSalahSchedule from '../EidSalahSchedule';
import LiveStreaming from '../LiveStreaming';
import OtherServices from '../OtherServices';
import PrayerReminder from '../PrayerReminder';
import ServiceDetailHero from '../ServiceDetailHero';
import ServiceEventBanner from '../ServiceEventBanner';
import ServiceQuote from '../ServiceQuote';

// Helper to extract simple text from Payload Rich Text
const extractTextFromRichText = (richText: any) => {
  if (!richText || !richText.root || !richText.root.children) return "";
  try {
    for (const child of richText.root.children) {
      if (child.children) {
        for (const nested of child.children) {
          if (nested.text) return nested.text;
        }
      }
    }
  } catch (e) {
    return "";
  }
  return "";
};

const TaraweehEidPrayers = async ({ service, params }: { service: any, params: { id: string } }) => {

  // Fetch all services for the "Other Services" section
  const allServices = await fetchServices({
    where: { isActive: { equals: true } },
    limit: 10,
    depth: 1
  });

  const servicesPage = await fetchGlobal({
    slug: "services-page",
  }) as any;

  const title = service?.title || "";
  // Attempt to extract text for banner description
  const bannerDescription = service?.shortDescription || "";
  const targetDateStr = service?.taraweehEid?.countdownTargetDate;
  const targetDate = targetDateStr ? new Date(targetDateStr) : undefined;

  // Validate updateAt date
  const updateAt = (() => {
    if (service?.updatedAt) {
      const dateObj = new Date(service.updatedAt);
      // Return only if valid date
      if (!isNaN(dateObj.getTime())) {
        return service.updatedAt;
      }
    }
    return undefined;
  })();

  const heroImage = service?.media?.heroImage?.url || "";
  const heroImageAlt = service?.media?.heroImage?.alt || "";
  const herosectionTitle = service?.title || "";

  const eidScheduleTitle = service?.taraweehEid?.eidScheduleTitle || "";
  const eidScheduleDesc = extractTextFromRichText(service?.taraweehEid?.eidNote) || "";

  const notificationTitle = service.notifications?.notificationTitle || "";
  const notificationDesc = service.notifications?.notificationDescription || "";

  const quoteText = servicesPage?.bottomQuote?.quoteText || "";
  const quoteAttribution = servicesPage?.bottomQuote?.author || "";

  const venueName = service?.venue?.venueName || "";
  const venueAddress = service?.venue?.fullAddress || "";

  const bannerTitle = service?.detailBanner?.bannerTitle || "";


  return (
    <div><ServiceEventBanner
      title={bannerTitle}
      description={bannerDescription}
      updateLabel="Update"
      updateDate={updateAt}
      countdownLabel={service.taraweehEid?.enableCountdown ? "Next Taraweeh Prayer in" : undefined}
      targetDate={service.taraweehEid?.countdownTargetDate ? (targetDate || "") : undefined}
    />

      <BreadcrumbSearchSection
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Our Services", href: "/services" },
          { label: title, href: `/our-services/${params.id}` },
        ]}
        className="pb-0! pt-10! sm:pt-16! bg-white section-padding"
        showSearch={false}
        breadcrumbsItemsStyle={"flex-wrap"}
      />

      <ServiceDetailHero
        heading={herosectionTitle}
        imageSrc={heroImage}
        imageAlt={heroImageAlt}
        layout="image-left"
        content={
          <div className="text-base text-[#52525B] space-y-4">
            {service.fullDescription ? (
              <RichTextRenderer content={service.fullDescription} />
            ) : (
              ""
            )}
          </div>
        }
        primaryButton={{
          text: "View Taraweeh Timings",
          href: "#timings",
        }}
        secondaryButton={{
          text: "Check Eid Salah Schedule",
          href: "#schedule",
        }}
        className='pb-12 sm:pb-16 md:pb-20 lg:pb-21.5'
        sectionMainStyle='section-padding'
      />

      {service.notifications?.enableNotifications && (
        <PrayerReminder
          title={notificationTitle}
          description={notificationDesc}
          cardMessage="The time for Taraweeh begins after the Isha prayer"
          countdownLabel="TARAWEEH 01 is in"
          targetDate={targetDate || ""}
        />
      )}

      {service.taraweehEid?.enableLiveStream && service.taraweehEid?.liveStreamUrl && (
        <LiveStreaming
          title="Live Taraweeh Streaming"
          description={service.taraweehEid?.liveStreamInstructions || ""}
          thumbnailUrl={heroImage}
          videoUrl={service.taraweehEid?.liveStreamUrl}
        />
      )}
      <EidSalahSchedule
        title={eidScheduleTitle}
        description={
          service.taraweehEid?.eidNote ? (
            <RichTextRenderer content={service.taraweehEid.eidNote} />
          ) : (
            ""
          )
        }
        venueName={venueName}
        venueAddress={venueAddress}
        schedule={service.schedule?.regularTimes || []}
        sectionContainer="section-padding"
      />

      <ServiceQuote
        quote={{
          text: quoteText,
          attribution: quoteAttribution
        }}
        testimonials={service.testimonials?.map((t: any) => ({
          text: t.quote,
          attribution: t.author
        })) || []}
        images={[
          heroImage,
          ...(service.media?.photoGallery?.map((img: any) => img.url) || []),
          ...(service.testimonials?.map((t: any) => t.photo?.url).filter(Boolean) || [])
        ].filter(Boolean)}
        sectionContainer='section-padding'
      />

      <OtherServices services={allServices
        .filter((s: any) => s.id !== service.id)
        .map((s: any) => ({
          id: s.id,
          title: s.title,
          slug: s.slug,
          cardImage: s.media?.cardImage
        }))}
        sectionContainer="section-padding"
      />
      {/* <QuoteSection  */}

      <AboutQuoteSection
        quote={quoteText || ""}
        attribution={quoteAttribution || ""}
        donateButtonUrl={service.donation?.donateButtonUrl || "/donate"}
      />
    </div>
  )
}

export default TaraweehEidPrayers