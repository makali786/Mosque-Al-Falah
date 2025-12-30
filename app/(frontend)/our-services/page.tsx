"use client";

import ServicesSection from "../components/services/ServicesSection";
import BreadcrumbSearchSection from "../components/common/BreadcrumbSearchSection";
import RequestServiceForm from "@/components/common/RequestServiceForm";
import { QuoteSection } from "@/components/common/QuoteSection";

export default function OurServicesPage() {
    const handleSearch = (query: string) => {
        console.log("Search query:", query);
        // Implement search functionality here
    };
    const handleShare = () => {
        if (navigator.share) {
            navigator
                .share({
                    title: "Islamic Guidance",
                    text: "Whoever guides someone to goodness will have a reward like the one who did it.",
                    url: window.location.href,
                })
                .catch((err) => console.log("Share failed:", err))
        } else {
            alert("Share this page: " + window.location.href)
        }
    }

    const handleDonate = () => {
        window.location.href = "/donate"
    }

    return (
        <div className="bg-white">
            {/* Vision Section with Blue Background */}
            <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-18 overflow-hidden">
                {/* Background with gradient and pattern */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background:
                            "linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)",
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

                {/* Content Container */}
                <div className="relative hn-container flex flex-col gap-3 items-center justify-center text-center">
                    {/* Greeting */}
                    <p className="text-sm sm:text-base md:text-lg font-medium text-[#CCE3FD] uppercase tracking-wide">
                        ASSALAMU ALAIKUM!
                    </p>

                    {/* Vision Statement */}
                    <h2 className="text-2xl leading-8 font-semibold sm:text-3xl md:text-4xl lg:text-2xl xl:text-3xl text-white max-w-[712px]">
                        Our vision is to be a leader in providing Islamic guidance and
                        services that contributes to the Muslim community.
                    </h2>
                </div>
            </section>

            {/* Breadcrumb and Search Section */}
            <BreadcrumbSearchSection
                breadcrumbs={[
                    { label: "Home", href: "/" },
                    { label: "Our Services", href: "/our-services" },
                ]}
                searchPlaceholder="Search"
                onSearch={handleSearch}
            />

            {/* Services Section */}
            <ServicesSection />


            <div className="hn-container py-17">
                <RequestServiceForm
                    onSubmit={(data) => {
                        console.log("Form submitted:", data);
                        // Handle form submission
                    }}
                />
            </div>
            <QuoteSection
                quote="Whoever guides someone to goodness will have a reward like the one who did it."
                attribution="Prophet Muhammad"
                showAttributionSymbol={true}
                onShare={handleShare}
                onDonate={handleDonate}
                shareButtonText="Share this page"
                donateButtonText="Donate Now"
            />
        </div>
    );
}