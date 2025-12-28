"use client";

import React from "react";
import { FiMap } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

const BrothersEntrance = () => {
  return (
    <section>
      <div className="py-12 md:py-16 lg:py-20">
        {/* Hero Image */}
        <div className="w-full mb-8 md:mb-10 overflow-hidden">
          <Image
            src="/assets/contact-us/brother-enterence.png"
            alt="Brothers Entrance - Masjid Al-Falah"
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
            Brothers Entrance
          </h2>

          {/* Address Section */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-sm md:text-base font-bold text-black uppercase mb-4">
              ADDRESS:
            </h3>
            <div className="text-base md:text-lg text-black mb-8">
              <p>North Ilford Islamic Centre</p>
              <p>97 Kensington Gardens, Ilford, Essex, IG1 3EN</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Get Directions Button - Blue */}
            <button
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#006FEE33] text-[#006FEE] text-sm md:text-base"
            >
              <FiMap className="w-[18px] h-[18px]" color="#006FEE" />
              <span>Get Directions</span>
            </button>

            {/* WhatsApp Group Button - Light Gray */}
            <button
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4D4D866] text-sm md:text-base"
            >
              <Image
                src="/assets/common/whatsapp-button-icon.svg"
                alt="WhatsApp icon"
                width={20}
                height={20}
              />
              <span>Join Al-Falah Sisters Group</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrothersEntrance;
