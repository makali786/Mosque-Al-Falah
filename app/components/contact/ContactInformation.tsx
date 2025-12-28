"use client";

import Image from "next/image";
import React from "react";
import { FiPhone, FiMail } from "react-icons/fi";

const ContactInformation = () => {
  return (
    <section className="w-full bg-white dark:bg-gray-950 py-20 md:py-24 lg:py-28">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-9 items-start">
          {/* Left Column - Contact Details */}
          <div className="flex flex-col">
            {/* Title */}
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-8">
              Contact Information
            </h2>

            {/* Description */}
            <p className="text-sm md:text-base lg:text-lg text-black mb-[42px]">
              We're here to serve our community. Feel free to reach out to us for any
              inquiries, support, or suggestions.
            </p>

            {/* Address Section */}
            <div className="mb-8">
              <h3 className="text-sm lg:text-base font-bold text-black uppercase mb-4">
                ADDRESS:
              </h3>
              <div className="text-sm sm:text-base lg:text-lg text-black]">
                <p>Masjid Al-Falah</p>
                <p>North Ilford Islamic Centre</p>
                <p>97 Kensington Gardens, Ilford, Essex IG1 3EN</p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Phone Button */}
              <button 
                onClick={() => window.location.href = "tel:02085185868"}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4D4D866]"
              >
                <Image 
                src="/assets/common/phone-icon.svg"
                alt="Phone icon"
                width={20}
                height={20}
                />
                <span className="text-base">020 8518 5868</span>
              </button>

              {/* Email Button */}
              <button
                onClick={() => window.location.href = "mailto:info@masjid-alfalah.org.uk"}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4D4D866]"
              >
                <Image 
                src="/assets/common/mail-icon.svg"
                alt="Email"
                width={20}
                height={20}
                />
                <span className="text-base">info@masjid-alfalah.org.uk</span>
              </button>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="w-full h-[300px] lg:h-[392px]">
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=0.0675%2C51.5585%2C0.0875%2C51.5735&layer=mapnik&marker=51.566%2C0.0775"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              title="Masjid Al-Falah Location Map"
              className="grayscale-[30%] opacity-90"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactInformation;
