"use client";

import ServiceCard from "./ServiceCard";

interface Service {
    id: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    href: string;
}

const SERVICES: Service[] = [
    {
        id: "five-daily-prayers",
        title: "Five Daily Prayers",
        imageSrc:"/assets/about-us/about-us.jpg",
        imageAlt: "Five Daily Prayers at Masjid Al-Falah",
        href: "/our-services/five-daily-prayers",
    },
    {
        id: "jummah-prayer",
        title: "Jummah Prayer",
        imageSrc: "/assets/about-us/about-us.jpg",
        imageAlt: "Jummah Prayer at Masjid Al-Falah",
        href: "/our-services/jummah-prayer",
    },
    {
        id: "taraweeh-prayer",
        title: "Taraweeh Prayer",
        imageSrc: "/assets/about-us/about-us.jpg",
        imageAlt: "Taraweeh Prayer during Ramadan",
        href: "/our-services/taraweeh-prayer",
    },
    {
        id: "nikah-marriage",
        title: "Nikah & Marriage",
        imageSrc:"/assets/about-us/about-us.jpg",
        imageAlt: "Nikah and Marriage Services",
        href: "/our-services/nikah-marriage",
    },
    {
        id: "funeral-services",
        title: "Funeral Services",
        imageSrc: "/assets/about-us/about-us.jpg",
        imageAlt: "Islamic Funeral Services",
        href: "/our-services/funeral-services",
    },
    {
        id: "food-bank",
        title: "Food Bank",
        imageSrc: "/assets/about-us/about-us.jpg",
        imageAlt: "Community Food Bank",
        href: "/our-services/food-bank",
    },
    {
        id: "nikah-marriage",
        title: "Nikah & Marriage",
        imageSrc:"/assets/about-us/about-us.jpg",
        imageAlt: "Nikah and Marriage Services",
        href: "/our-services/nikah-marriage",
    },
    {
        id: "funeral-services",
        title: "Funeral Services",
        imageSrc: "/assets/about-us/about-us.jpg",
        imageAlt: "Islamic Funeral Services",
        href: "/our-services/funeral-services",
    },
    {
        id: "food-bank",
        title: "Food Bank",
        imageSrc: "/assets/about-us/about-us.jpg",
        imageAlt: "Community Food Bank",
        href: "/our-services/food-bank",
    },
];

interface ServicesSectionProps {
    /**
     * Optional custom class name for the section container
     */
    className?: string;

    /**
     * Optional heading text (defaults to "Our Services")
     */
    heading?: string;

    /**
     * Optional description text
     */
    description?: string;

    /**
     * Optional custom services array (defaults to SERVICES)
     */
    services?: Service[];
}

export default function ServicesSection({
    className = "",
    heading = "Our Services",
    description,
    services = SERVICES,
}: ServicesSectionProps) {
    return (
        <section className={`w-full pb-12 sm:pb-16 md:pb-20 lg:pb-28 ${className}`}>
            <div className="hn-container">
                {/* Services Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 md:gap-8 lg:gap-8 place-items-center">
                    {services.map((service) => (
                        <ServiceCard
                            key={service.id}
                            title={service.title}
                            imageSrc={service.imageSrc}
                            imageAlt={service.imageAlt}
                            href={service.href}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

export { SERVICES };
export type { Service };
