import React from 'react'
import ServiceEventBanner from '../ServiceEventBanner';
import ServiceContentCarousel from '../ServiceContentCarousel';
import Image from 'next/image';
import BreadcrumbSearchSection from '@/components/common/BreadcrumbSearchSection';
import ServiceDetailHero from '../ServiceDetailHero';
import OtherServices from '../OtherServices';
import AboutQuoteSection from '@/components/about/AboutQuoteSection';

interface ServiceDetail {
    id: string;
    title: string;
    subtitle: string;
    heroImage: string;
    heroImageAlt: string;
    description: string;
    sections: {
        heading: string;
        content: string;
        image?: string;
        imageAlt?: string;
        layout?: "image-right" | "image-left";
    }[];
    timings?: {
        title: string;
        schedule: {
            day: string;
            time: string;
        }[];
    };
    features?: string[];
    quote?: {
        text: string;
        attribution: string;
    };
}

const NikaahMarriage = ({ service, params }: { service: ServiceDetail, params: { id: string } }) => {
    return (
        <div>
            <ServiceEventBanner
                title="Nikah Booking now available."
                description="Nikaah Marriage Service. It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout."
                updateLabel="Update"
                updateDate="8 February 2025"
                rightContent={
                    <div className="flex items-center gap-6 sm:gap-8.5">
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
                customStyleLeftSection={"md:!max-w-[340px] xl:!min-w-[340px]"}
            />

            <BreadcrumbSearchSection
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Our Services", href: "/services" },
                    { label: service.title, href: `/our-services/${params.id}` },
                ]}
                className="!pb-0 !pt-6 sm:!pt-8 bg-white section-padding"
                showSearch={false}
            />

            <ServiceDetailHero
                heading="Nikaah Marriage"
                imageSrc={service.heroImage || "/assets/common/marrige-and-nikah.svg"}
                imageAlt="Nikaah Marriage Service"
                layout="image-left"
                content={
                    <>
                        <p>
                            Nikaah Marriage Service. It is a long established fact that a reader will be
                            distracted by the readable content of a page when looking at its layout. The
                            point of using Lorem Ipsum is that it has a more-or-less normal distribution of
                            letters, as opposed to using 'Content here, content here', making it look like
                            readable English. Many desktop publishing packages and web page editors
                            now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum'
                            will uncover many web sites still in their infancy. Various versions have evolved
                            over the years, sometimes by accident, sometimes on purpose (injected
                            humour and the like).
                        </p>
                    </>
                }
                primaryButtonClassName="rounded-[12px] !mt-9"
                primaryButton={{
                    text: "Register your interest",
                    href: "#register",
                }}
            
            />

            <ServiceContentCarousel 
                items={[
                    {
                        id: 1,
                        text: "Aisha reported: The Messenger of Allah, peace and blessings be upon him, said, \" There is no marriage unless with a guardian and two credible witnesses. Any marriage contracted with less than that is invalid. If there is a dispute, the ruler is the guardian for one without a guardian.",
                        image: service.heroImage || "/assets/common/marrige-and-nikah.svg"
                    },
                    {
                        id: 2,
                        text: "And of His signs is that He created for you from yourselves mates that you may find tranquility in them; and He placed between you affection and mercy. Indeed in that are signs for a people who give thought.",
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