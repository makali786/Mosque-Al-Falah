"use client";

import React from "react";
import { FiMap } from "react-icons/fi";
import Image from "next/image";

interface EntranceSectionProps {
  title: string;
  imageSrc: string;
  imageAlt: string;
  whatsappGroupLabel: string;
  directionsUrl?: string;
  whatsappUrl?: string;
  description?: any
}

const EntranceSection: React.FC<EntranceSectionProps> = ({
  title,
  imageSrc,
  imageAlt,
  whatsappGroupLabel,
  directionsUrl = "https://maps.google.com/?q=97+Kensington+Gardens,+Ilford,+Essex,+IG1+3EN",
  whatsappUrl = "#",
  description
}) => {
  return (
    <section>
      <div>
        {/* Hero Image */}
        <div className="w-full mb-8 md:mb-10 overflow-hidden">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={624}
            height={380}
            className="w-full h-auto object-cover lg:w-[624px] lg:h-[380px]"
            priority
          />
        </div>

        {/* Content Section */}
        <div className="max-w-[600px]">
          {/* Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black mb-6 md:mb-8">
            {title}
          </h2>

          {/* Address Section */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-sm md:text-base font-bold text-black uppercase mb-4">
              ADDRESS:
            </h3>
            <div className="text-base md:text-lg text-black mb-8 whitespace-pre-line">
              <p>{description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Get Directions Button - Blue */}
            <button
              onClick={() => window.open(directionsUrl, "_blank")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#006FEE33] text-[#006FEE] text-sm md:text-base"
            >
              <FiMap className="w-[18px] h-[18px]" color="#006FEE" />
              <span>Get Directions</span>
            </button>

            {/* WhatsApp Group Button - Light Gray */}
            <button
              onClick={() => window.open(whatsappUrl, "_blank")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4D4D866] text-sm md:text-base"
            >
              <Image
                src="/assets/common/whatsapp-button-icon.svg"
                alt="WhatsApp icon"
                width={20}
                height={20}
              />
              <span>{whatsappGroupLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EntranceSection;
