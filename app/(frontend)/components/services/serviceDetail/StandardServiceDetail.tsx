import React from 'react';
import ServiceVisionBanner from '../ServiceVisionBanner';
import EidSalahSchedule from '../EidSalahSchedule';
import PrayerReminder from '../PrayerReminder';
import BreadcrumbSearchSection from '@/components/common/BreadcrumbSearchSection';
import ServiceDetailHero from '../ServiceDetailHero';
import EventMediaSection from '../EventMediaSection';
import { ImpactGallery } from '../../appeals/ImpactGallery';
import MadrasahFAQs from '@/components/madrasah/MadrasahFAQs';
import LiveStreaming from '../LiveStreaming';
import OtherServices from '../OtherServices';
import ServiceQuote from '../ServiceQuote';
import AboutQuoteSection from '@/components/about/AboutQuoteSection';
import ContentImageSection from '@/components/common/ContentImageSection';
import { RichTextRenderer } from '@/components/common/RichTextRenderer';
import { fetchServices } from '../../../../../lib/fetcher';

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

const StandardServiceDetail = async ({ service, params }: { service: any, params: { id: string } }) => {

    // Fetch all services for the "Other Services" section
    const allServices = await fetchServices({
        where: { isActive: { equals: true } },
        limit: 10,
        depth: 1
    });

    // 1. Service Event Banner Data
    const bannerTitle = service.detailBanner?.bannerTitle || service.title || "";
    // Prioritize detailBanner subtitle, then shortDescription, then extraction
    const bannerDescription = service.detailBanner?.bannerSubtitle || service.shortDescription || extractTextFromRichText(service.fullDescription) || "";
    const updatedAt = service.updatedAt;

    // 2. Breadcrumbs Data
    const title = service.title || "Service Detail";
    const slug = service.slug || params.id;

    // 3. Service Detail Hero Data
    const heroImage = service.media?.heroImage?.url || "/assets/placeholder.png";
    const heroImageAlt = service.media?.heroImage?.alt || title;
    // content passed as rich text

    // 4. Event Media Section Data
    const isLive = service.media?.isLive;
    const mediaTitle = isLive ? "Live Streaming" : "Media";
    const mediaVideoUrl = service.media?.videoUrl;

    // 5. FAQs Data
    const faqs = service.faqs?.map((faq: any) => ({
        id: faq.id,
        question: faq.question,
        answer: faq.answer
    })) || [];

    const liveStreamUrl = service.media?.liveStreamUrl || (isLive ? service.media?.videoUrl : null);

    // 6. Notifications Data
    // 6. Notifications Data
    const notificationTitle = service.notifications?.notificationTitle || "";
    const notificationDesc = service.notifications?.notificationDescription || "";

    // Countdown Logic: Prioritize detailBanner > taraweehEid
    const bannerCountdown = service.detailBanner?.countdown;
    const targetDateStr = (bannerCountdown?.enableCountdown && bannerCountdown.countdownTargetTime)
        ? bannerCountdown.countdownTargetTime
        : service.taraweehEid?.countdownTargetDate;
    const targetDate = targetDateStr ? new Date(targetDateStr) : undefined;
    const countdownLabel = (bannerCountdown?.enableCountdown && bannerCountdown.countdownLabel)
        ? bannerCountdown.countdownLabel
        : (service.notifications?.countdownLabel || "Next Prayer in");

    // Button Logic
    let primaryButton = undefined;
    let secondaryButton = undefined;

    if (service.registration?.enableRegistration && service.registration?.registrationButtonText) {
        primaryButton = {
            text: service.registration.registrationButtonText,
            href: service.registration.registrationLink || "#register",
        };
        // Use first CTA as secondary if valid
        if (service.callToActions?.length > 0) {
            secondaryButton = {
                text: service.callToActions[0].text,
                href: service.callToActions[0].url
            };
        }
    } else if (service.callToActions?.length > 0) {
        // Use CTAs for buttons
        const cta1 = service.callToActions[0];
        primaryButton = {
            text: cta1.text,
            href: cta1.url
        };
        if (service.callToActions.length > 1) {
            const cta2 = service.callToActions[1];
            secondaryButton = {
                text: cta2.text,
                href: cta2.url
            };
        }
    }


    return (
        <div>
            {/* 1. Top Component: ServiceEventBanner */}
            <ServiceVisionBanner greeting={bannerTitle} vision={bannerDescription} />

            {/* 2. Breadcrumbs */}
            <BreadcrumbSearchSection
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Our Services", href: "/services" },
                    { label: title, href: `/our-services/${slug}` },
                ]}
                className="pb-0! pt-6! sm:pt-8! bg-white section-padding"
                showSearch={false}
                breadcrumbsItemsStyle={"flex-wrap"}
            />

            {/* 3. ServiceDetailHero */}
            <ServiceDetailHero
                heading={title}
                imageSrc={heroImage}
                imageAlt={heroImageAlt}
                layout="image-left"
                updatedAt={updatedAt}
                content={
                    <div className="text-base text-[#52525B] space-y-4">
                        {service.fullDescription ? (
                            <RichTextRenderer content={service.fullDescription} />
                        ) : (
                            <p></p>
                        )}
                    </div>
                }

                // Optional registration button if present in schema
                primaryButton={primaryButton}
                secondaryButton={secondaryButton}
                Separator={true}
                imageHeight={396}
                imageWidth={420}
            />

            {/* 4. EventMediaSection */}
            <EventMediaSection
                title={mediaTitle}
                description={service.media?.mediaDescription || ""}
                videoThumbnail={heroImage}
                videoUrl={mediaVideoUrl}
                isLive={isLive}
                venueName={service.venue?.venueName}
                venueAddress={service.venue?.fullAddress}
                venueMapsLink={service.venue?.googleMapsLink}
                donationTitle={service.donation?.donationTitle}
                donationDescription={service.donation?.donationDescription}
                donationAmounts={service.donation?.suggestedAmounts?.map((a: any) => a.amount) || []}
                enableDonations={service.donation?.enableDonations}
            />

            {/* 5. MadrasahFAQs */}
            {faqs.length > 0 && (
                <MadrasahFAQs
                    title="Frequently Asked Questions (FAQs)"
                    description="Find answers to common questions about this service."
                    faqs={faqs}
                />
            )}

            {/* 6. LiveStreaming */}
            {liveStreamUrl && (
                <LiveStreaming
                    title="Live Streaming"
                    description="Watch our services live from home."
                    thumbnailUrl={heroImage}
                    videoUrl={liveStreamUrl}
                />
            )}

            {/* Dynamic Content Sections */}
            {service.sections?.map((section: any, index: number) => (
                <ContentImageSection
                    key={section.id || index}
                    heading={section.sectionTitle || section.title}
                    imageSrc={section.image?.url || ""}
                    imageAlt={section.image?.alt || ""}
                    layout={index % 2 === 0 ? "image-right" : "image-left"}
                    content={<RichTextRenderer content={section.content} />}
                />
            ))}

            {/* Gallery Section */}
            {service.impactGallery?.enableGallery && (
                <ImpactGallery
                    title={service.impactGallery.galleryTitle}
                    description={service.impactGallery.galleryDescription || ""}
                    images={service.impactGallery.images || []}
                />
            )}

            {/* Eid Salah Schedule  */}
            {service.taraweehEid?.eidScheduleTitle && (
                <EidSalahSchedule
                    title={service.taraweehEid.eidScheduleTitle}
                    description={service.taraweehEid?.eidNote ? <RichTextRenderer content={service.taraweehEid.eidNote} /> : null}
                    venueName={service.venue?.venueName}
                    venueAddress={service.venue?.fullAddress}
                    schedule={service.schedule?.regularTimes || []}
                />
            )}

            {/* prayer remainder section  */}
            {service.notifications?.enableNotifications && (
                <PrayerReminder
                    title={notificationTitle}
                    description={notificationDesc}
                    cardMessage={service.notifications?.cardMessage || ""}
                    countdownLabel={countdownLabel}
                    targetDate={targetDate || ""}
                />
            )}

            <ServiceQuote
                quote={{
                    text: service.quote?.text || "",
                    attribution: service.quote?.attribution || ""
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
            />


            {/* Footer sections (Standard Practice) */}
            <OtherServices services={allServices
                .filter((s: any) => s.id !== service.id)
                .map((s: any) => ({
                    id: s.id,
                    title: s.title,
                    slug: s.slug,
                    cardImage: s.media?.cardImage
                }))}
            />

            <AboutQuoteSection
                quote={"“Whoever guides someone to goodness will have a reward like the one who did it.”"}
                attribution={"— Prophet Muhammad ﷺ"}
                donateButtonUrl={"/donate"}
            />

        </div>
    );
};

export default StandardServiceDetail;
