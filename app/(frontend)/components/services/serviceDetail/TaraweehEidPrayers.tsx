import React from 'react'
import ServiceEventBanner from '../ServiceEventBanner';
import BreadcrumbSearchSection from '@/components/common/BreadcrumbSearchSection';
import ServiceDetailHero from '../ServiceDetailHero';
import PrayerReminder from '../PrayerReminder';
import EventMediaSection from '../EventMediaSection';
import EidSalahSchedule from '../EidSalahSchedule';
import ServiceQuote from '../ServiceQuote';
import OtherServices from '../OtherServices';
import AboutQuoteSection from '@/components/about/AboutQuoteSection';
import { RichTextRenderer } from '@/components/common/RichTextRenderer';
import LiveStreaming from '../LiveStreaming';

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

const TaraweehEidPrayers = ({ service, params }: { service: any, params: { id: string } }) => {
  console.log("service", service)

  const title = service?.title || "";
  // Attempt to extract text for banner description
  const bannerDescription = service?.shortDescription || "";
  const targetDateStr = service?.taraweehEid?.countdownTargetDate;
  const targetDate = targetDateStr ? new Date(targetDateStr) : undefined;
  const updateAt = service?.updatedAt || "";

  const heroImage = service?.media?.heroImage?.url || "";
  const heroImageAlt = service?.media?.heroImage?.alt || "";
  const herosectionTitle = service?.serviceType || "";

  const eidScheduleTitle = service?.taraweehEid?.eidScheduleTitle || "";
  const eidScheduleDesc = extractTextFromRichText(service?.taraweehEid?.eidNote) || "";

  const notificationTitle = service.notifications?.notificationTitle || "";
  const notificationDesc = service.notifications?.notificationDescription || "";

  const quoteText = service.quote?.text || "";
  const quoteAttribution = service.quote?.attribution || "";

  const venueName = service?.venue?.venueName || "";
  const venueAddress = service?.venue?.fullAddress || "";


  return (
    <div><ServiceEventBanner
      title={title}
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
        className="!pb-0 !pt-6 sm:!pt-8 bg-white section-padding"
        showSearch={false}
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

      <LiveStreaming
        title="Live Taraweeh Streaming"
        description={service.taraweehEid?.liveStreamInstructions || ""}
        thumbnailUrl={heroImage}
        videoUrl={service.taraweehEid?.liveStreamUrl}
      />
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
      />

      <ServiceQuote
        quote={{
          text: quoteText,
          attribution: quoteAttribution
        }}
        images={[
          heroImage,
          "",
          ""
        ]}
      />

      <OtherServices />
      {/* <QuoteSection  */}


      <AboutQuoteSection
        quote={"“Whoever guides someone to goodness will have a reward like the one who did it.”"}
        attribution={"— Prophet Muhammad ﷺ"}
        donateButtonUrl={"/donate"}
      />
    </div>
  )
}

export default TaraweehEidPrayers