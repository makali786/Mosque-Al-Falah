import React from 'react';

interface ServiceVisionBannerProps {
    greeting: string;
    vision: string;
}

const ServiceVisionBanner: React.FC<ServiceVisionBannerProps> = ({ greeting, vision }) => {
    return (
        <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-18 overflow-hidden">
            {/* Background */}
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
            <div className="relative hn-container flex flex-col gap-3 sm:items-center justify-center sm:text-center">
                <p className="text-sm sm:text-base md:text-lg font-medium sm:text-center text-[#CCE3FD] uppercase tracking-wide">
                    {greeting}
                </p>
                <h2 className="text-2xl leading-8 font-semibold sm:text-3xl md:text-4xl lg:text-2xl xl:text-3xl text-white max-w-[712px]">
                    {vision}
                </h2>
            </div>
        </section>
    );
};

export default ServiceVisionBanner;
