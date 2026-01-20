"use client";

import ServiceCard from "./ServiceCard";

interface Service {
    id: string;
    title: string;
    imageSrc: string;
    imageAlt: string;
    href: string;
}


interface ServicesSectionProps {

    className?: string;
    heading?: string;
    description?: string;
    services?: Service[];
}

export default function ServicesSection({
    className = "",
    heading = "Our Services",
    description,
    services = [],
}: ServicesSectionProps) {
    return (
        <section className={`w-full pb-12 sm:pb-16 md:pb-20 lg:pb-28 ${className}`}>
            <div className="hn-container">
                {/* Section Header */}
                {(heading || description) && (
                    <div className="flex flex-col gap-4 mb-8 sm:mb-10 text-center">
                        {heading && (
                            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                                {heading}
                            </h2>
                        )}
                        {description && (
                            <p className="max-w-2xl mx-auto text-lg text-gray-600">
                                {description}
                            </p>
                        )}
                    </div>
                )}

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

export type { Service };
