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
import { fetchServices, fetchGlobal } from '../../../../../lib/fetcher';

export const getServiceBlocks = (contentBlocks: any[] = []) => {
    return {
        twoColumn: contentBlocks.filter(b => b.blockType === "twoColumn"),
        gallery: contentBlocks.filter(b => b.blockType === "gallery"),
        liveStreaming: contentBlocks.filter(b => b.blockType === "liveStreaming"),
        faqs: contentBlocks.filter(b => b.blockType === "faqs"),
        titleSection: contentBlocks.filter(b => b.blockType === "titleBlock"),
    };
};

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

    const servicesPage = await fetchGlobal({
        slug: "services-page",
    }) as any;

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


    /* -------- BLOCK DATA (NO RENDERING) -------- */

    const blocks = getServiceBlocks(service.contentBlocks);

    console.log("service.media?.photoGallery", service.media?.photoGallery);

    return (
        <div>
            {/* 1. Top Component: ServiceEventBanner */}
            {blocks.titleSection.map((block: any) => (
                <ServiceVisionBanner
                    key={block.id}
                    greeting={block.titleBlock?.greeting}
                    vision={block.titleBlock?.title}
                />
            ))}

            {/* 2. Breadcrumbs */}
            <BreadcrumbSearchSection
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Our Services", href: "/our-services" },
                    { label: title, href: `/our-services/${slug}` },
                ]}
                className="pb-0! pt-10! sm:pt-16! bg-white"
                showSearch={false}
                breadcrumbsItemsStyle={"flex-wrap"}
            />

            {/* 3. ServiceDetailHero */}
            <ServiceDetailHero
                heading={title}
                imageSrc={heroImage}
                imageAlt={heroImageAlt}
                imageHeight={340}
                imageWidth={420}
                layout="image-left"
                updatedAt={updatedAt}
                content={
                    <div className="text-lg text-[#52525B] space-y-4">
                        {service.fullDescription && (
                            <RichTextRenderer content={service.fullDescription} />
                        )}
                    </div>
                }

                // Optional registration button if present in schema
                primaryButton={primaryButton}
                secondaryButton={secondaryButton}
                Separator={true}
                contentStyle="lg:!h-[340px] lg:!max-h-[340px] lg:!max-w-[840px]"
                primaryButtonClassName='!rounded-lg !px-6 !py-3'
                sectionImageContainerStyle="lg:!max-w-[420px]"
                sectionMainStyle="hn-container"
                className='sm:!pt-12 md:!pt-14 lg:!pt-16'
            />

            {/* 4. EventMediaSection */}
            <EventMediaSection
                title={mediaTitle}
                description={service.media?.mediaDescription || ""}
                videoThumbnail={heroImage}
                photos={service.media?.photoGallery?.map((item: any) => item.photo?.url).filter(Boolean) || []}
                videoUrl={mediaVideoUrl}
                isLive={isLive}
                venueName={service.venue?.venueName}
                venueAddress={service.venue?.fullAddress}
                venueMapsLink={service.venue?.googleMapsLink}
                donationTitle={service.donation?.donationTitle}
                donationDescription={service.donation?.donationDescription}
                donationAmounts={service.donation?.suggestedAmounts?.map((a: any) => a.amount) || []}
                enableDonations={service.donation?.enableDonations}
                containerStyle='hn-container'
                leftColumnStyle='lg:!max-w-[895px] lg:!max-h-[678px]'
            />

            {/*  FAQS – END */}
            {blocks.faqs.map((block: any) => (
                <MadrasahFAQs
                    key={block.id}
                    title={block.faqsBlock.title}
                    description={block.faqsBlock.subtitle}
                    faqs={block.faqsBlock.faqs}
                />
            ))}


            {/* LIVE STREAM – WHEREVER YOU WANT */}
            {blocks.liveStreaming.map((block: any) => (
                <LiveStreaming
                    key={block.id}
                    title={block.liveStreamingBlock?.title}
                    description={block.liveStreamingBlock?.description}
                    thumbnailUrl={heroImage}
                    videoUrl={liveStreamUrl}
                    isLive={block.liveStreamingBlock?.isLive}
                />
            ))}

            {/* TWO COLUMN – YOU CHOOSE LOCATION */}
            {blocks.twoColumn.map((block: any) => (
                <ContentImageSection
                    key={block.id}
                    heading={block.twoColumnBlock?.heading}
                    imageSrc={block.twoColumnBlock?.image?.url}
                    imageAlt={block.twoColumnBlock?.image?.alt}
                    layout={block.twoColumnBlock?.imagePosition === "right" ? "image-right" : "image-left"}
                    imageWidth={584}
                    imageHeight={438}
                    content={
                        block.twoColumnBlock?.content ? (
                            <RichTextRenderer
                                content={block.twoColumnBlock.content}
                                className="[&_ul]:!space-y-3 [&_ul]:!mt-2 [&_li_strong]:whitespace-nowrap [&_li_strong]:mr-2"
                            />
                        ) : null
                    }
                />
            ))}

            {/* GALLERY – BOTTOM */}
            {blocks.gallery.map((block: any) => (
                <ImpactGallery
                    key={block.id}
                    title={block.galleryBlock.title}
                    description={block.galleryBlock.subtitle}
                    images={block.galleryBlock.images}
                    className="hn-container"
                    headerContainer="!max-w-full"
                />
            ))}


            {/* Eid Salah Schedule  */}
            {service.schedule && (
                <EidSalahSchedule
                    title={service.taraweehEid.eidScheduleTitle}
                    description={service.schedule?.eidNote ? <RichTextRenderer content={service.taraweehEid.eidNote} /> : null}
                    venueName={service.venue?.venueName}
                    venueAddress={service.venue?.fullAddress}
                    schedule={service.schedule?.regularTimes || []}
                    sectionContainer='hn-container'
                    rightSection="!max-w-[619px]"
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
                    ...(service.media?.photoGallery?.map((item: any) => item.photo?.url).filter(Boolean) || []),
                    ...(service.testimonials?.map((t: any) => t.photo?.url).filter(Boolean) || [])
                ].filter(Boolean)}
                sectionContainer='hn-container'
                QuoteSectionStyle="lg:!max-w-[656px] lg:!p-10"
                CarouselSectionStyle="lg:!max-w-[640px]"
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
                sectionContainer="hn-container"
            />

            <AboutQuoteSection
                quote={servicesPage?.bottomQuote?.quoteText || ""}
                attribution={servicesPage?.bottomQuote?.author || ""}
                donateButtonUrl={servicesPage?.bottomQuote?.donateButtonUrl || "/donate"}
            />

        </div>
    );
};

export default StandardServiceDetail;
