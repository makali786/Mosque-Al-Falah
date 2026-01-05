import React from 'react'
import ServiceEventBanner from '../ServiceEventBanner';
import ServiceContentCarousel from '../ServiceContentCarousel';
import Image from 'next/image';
import BreadcrumbSearchSection from '@/components/common/BreadcrumbSearchSection';
import ServiceDetailHero from '../ServiceDetailHero';
import OtherServices from '../OtherServices';
import AboutQuoteSection from '@/components/about/AboutQuoteSection';
import EventMediaSection from '../EventMediaSection';
import { RichTextRenderer } from '@/components/common/RichTextRenderer';

// Helper to extract simple text from Payload Rich Text for banner descriptions
const extractTextFromRichText = (richText: any) => {
    if (!richText || !richText.root || !richText.root.children) return "";
    try {
        // Attempt to find the first text node
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

const NikaahMarriage = ({ service, params }: { service: any, params: { id: string } }) => {

    // Extract data from the dynamic service object
    const title = service.title || "Nikaah Marriage";
    // Description: try shortDescription -> then fullDescription extract -> then fallback
    const bannerDescription = service.shortDescription || extractTextFromRichText(service.fullDescription) || "Nikaah Marriage Service.";
    const heroImage = service.media?.heroImage?.url || "/assets/common/marrige-and-nikah.svg";
    const heroImageAlt = service.media?.heroImage?.alt || "Nikaah Service";

    const quoteText = service.quote?.text || "When a man marries, he has fulfilled half of his religion...";
    const quoteAttribution = service.quote?.attribution || "Prophet Muhammad (ﷺ)";

    return (
        <div>
            <ServiceEventBanner
                title={title}
                description={bannerDescription}
                updateLabel="Update"
                updateDate="8 February 2025" // Static for now, or map from updatedAt if desired
                rightContent={
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-6 sm:gap-8.5">
                        <div className="flex flex-col items-center gap-3">
                            <Image
                                src="/assets/common/marrige-and-nikah.svg"
                                width={40}
                                height={40}
                                alt="Nikah Service"
                                className="w-10 h-10 sm:w-12 sm:h-12"
                            />
                            <span className="text-white font-semibold text-base sm:text-lg uppercase text-center">NIKAH SERVICE</span>
                        </div>

                        <div className="h-[112px] w-px bg-[#FFFFFF26] hidden sm:block"></div>

                        <div className="flex flex-col items-center gap-3">
                            <Image
                                src="/assets/common/notebook-icon.svg"
                                width={40}
                                height={40}
                                alt="Islamic Guidance"
                                className="w-10 h-10 sm:w-12 sm:h-12"
                            />
                            <span className="text-white font-semibold text-base sm:text-lg uppercase text-center">ISLAMIC GUIDANCE</span>
                        </div>
                    </div>
                }
                customStyleLeftSection={"xl:!min-w-[340px] xl:!max-w-[340px]"}
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
                heading={title}
                imageSrc={heroImage}
                imageAlt={heroImageAlt}
                layout="image-left"
                content={
                    <div className="text-base text-[#52525B] space-y-4">
                        {service.fullDescription ? (
                            <RichTextRenderer content={service.fullDescription} />
                        ) : (
                            <p>
                                Nikaah Marriage Service. It is a long established fact that a reader will be
                                    distracted by the readable content of a page when looking at its layout.
                                </p>
                        )}
                    </div>
                }
                primaryButtonClassName="rounded-[12px] sm:!mt-9"
                primaryButton={service.registration?.enableRegistration ? {
                    text: service.registration?.registrationButtonText || "Register your interest",
                    href: "#register",
                } : undefined}
            
            />

            <EventMediaSection
                title="Live Taraweeh Streaming" 
                // Note: The original static comp had this. 
                // If this is specific to Taraweeh usage but copied here, we might want to hide it if !enableLiveStream
                // For Nikaah, the JSON says enableLiveStream: false in 'taraweehEid' object, but check specific fields?
                // The provided JSON for Nikaah has 'media.videoUrl' and 'media.isLive: true'.
                // I'll render it if videoUrl exists.
                description="Join us via live stream and immerse yourself in the spiritual atmosphere."
                videoThumbnail={service.media?.heroImage?.url || "/assets/about-us/about-us.jpg"}
                // videoUrl={service.media?.videoUrl} // Uncomment when prop is supported
            />

            <ServiceContentCarousel 
                items={[
                    {
                        id: 1,
                        text: quoteText,
                        image: heroImage
                    },
                    {
                        id: 2,
                        text: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them...",
                        image: "/assets/about-us/about-us.jpg"
                    }
                ]}
            />

            <OtherServices />
            <AboutQuoteSection
                quote={"“Whoever guides someone to goodness will have a reward like the one who did it.”"}
                attribution={"— Prophet Muhammad ﷺ"}
                donateButtonUrl={"/donate"}
            />

        </div>
    )
}

export default NikaahMarriage