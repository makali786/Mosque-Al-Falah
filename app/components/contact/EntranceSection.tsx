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
  description?: string;
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
    <section className="lg:w-[48%]">
      <div>
        {/* Hero Image */}
        <div className="w-full mb-6 sm:mb-7 md:mb-8 lg:mb-10 overflow-hidden xl:w-[624px]">
          <div
            className="relative w-full"
            style={{ aspectRatio: "624 / 380" }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-[600px]">
          {/* Heading */}
          <h2 className="text-3xl leading-9 font-semibold sm:text-4xl sm:leading-10 md:text-[42px] md:leading-11 xl:text-[48px] lg:leading-12 text-black mb-6 md:mb-8">
            {title}
          </h2>

          {/* Address Section */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-sm md:text-base font-bold text-black uppercase mb-4">
              ADDRESS:
            </h3>
            <div className="text-base leading-6 sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-7 text-black mb-8 whitespace-pre-line">
              <p>{description}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Get Directions Button - Blue */}
            <button
              onClick={() => window.open(directionsUrl, "_blank")}
              className="inline-flex items-center justify-center gap-1.5 px-5 lg:px-3 xl:px-5 py-3 bg-[#006FEE33] text-[#006FEE] text-sm md:text-base"
            >
              <FiMap className="w-[18px] h-[18px]" color="#006FEE" />
              <span className="text-xs xl:text-base">Get Directions</span>
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
              <span className="text-sm xl:text-base text-black">{whatsappGroupLabel}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EntranceSection;
