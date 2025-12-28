"use client";

import React from "react";
import { FiMap } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Image from "next/image";

const SistersEntrance = () => {
  return (
    <section>
      <div className="py-12 md:py-16 lg:py-20">
        {/* Hero Image */}
        <div className="w-full mb-8 md:mb-10 overflow-hidden">
          <Image
            src="/assets/contact-us/sister-entrance.png"
            alt="Sisters Entrance - Masjid Al-Falah"
            width={624}
            height={380}
            className="w-full h-auto object-cover lg:w-[624px] lg:h-[380px]"
            priority
          />
        </div>

        {/* Content Section */}
        <div className="max-w-[600px]">
          {/* Heading */}
          <h2 className="text-[36px] md:text-[40px] lg:text-[44px] font-bold text-black dark:text-white leading-[1.2] mb-6 md:mb-8">
            Sisters Entrance
          </h2>

          {/* Address Section */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-[11px] md:text-[12px] font-bold text-black dark:text-white uppercase tracking-[0.5px] mb-3">
              ADDRESS:
            </h3>
            <div className="text-[15px] md:text-[16px] text-gray-900 dark:text-gray-100 leading-[1.7]">
              <p>North Ilford Islamic Centre</p>
              <p>97 Kensington Gardens, Ilford, Essex, IG1 3EN</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* Get Directions Button - Blue */}
            <a
              href="https://maps.google.com/?q=97+Kensington+Gardens,+Ilford,+Essex,+IG1+3EN"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white text-[14px] md:text-[15px] font-medium rounded-lg transition-colors duration-200"
            >
              <FiMap className="w-[18px] h-[18px]" />
              <span>Get Directions</span>
            </a>

            {/* WhatsApp Group Button - Light Gray */}
            <a
              href="https://chat.whatsapp.com/your-sisters-group-link"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100 text-[14px] md:text-[15px] font-medium rounded-lg transition-colors duration-200"
            >
              <FaWhatsapp className="w-[18px] h-[18px] text-green-500" />
              <span>Join Al-Falah Sisters Group</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SistersEntrance;
