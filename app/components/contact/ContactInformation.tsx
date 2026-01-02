"use client";

import Image from "next/image";
import React from "react";

interface ContactInfoProps {
  title: string;
  description: string;
  address: {
    line1: string;
    line2: string;
  };
  phone: string;
  email: string;
  mapEmbed?: string;
}

const ContactInformation = ({
  title,
  description,
  address,
  phone,
  email,
  mapEmbed,
}: ContactInfoProps) => {
  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-28 hn-container">
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 lg:gap-9 items-start">
          {/* Left Column - Contact Details */}
          <div className="flex flex-col">
            {/* Title */}
            <h2 className="contact-title text-3xl leading-9 font-semibold sm:text-4xl sm:leading-10 md:text-[42px] md:leading-11 xl:text-[48px] lg:leading-12 text-black mb-6 sm:mb-7 md:mb-8">
              {title}
            </h2>

            {/* Description */}
            <p className="text-base leading-6 sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-7 text-black mb-8 sm:mb-10 md:mb-[42px]">
              {description}
            </p>

            {/* Address Section */}
            <div className="mb-8">
              <h3 className="text-sm md:text-base font-bold text-black uppercase mb-4">
                ADDRESS:
              </h3>
              <div className="text-base leading-6 sm:text-[17px] sm:leading-7 md:text-lg md:leading-7 lg:text-[18px] lg:leading-7 text-black">
                <p>Masjid Al-Falah</p>
                <p>{address.line1}</p>
                <p>{address.line2}</p>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Phone Button */}
              <button
                onClick={() => (window.location.href = `tel:${phone.replace(/\s/g, "")}`)}
                className="inline-flex items-center justify-center gap-2 lg:gap-1.5 xl:gap-2 px-6 lg:px-3 xl:px-6 py-3 bg-[#D4D4D866]"
              >
                <Image
                  src="/assets/common/phone-icon.svg"
                  alt="Phone icon"
                  width={20}
                  height={20}
                />
                <span className="text-sm sm:text-base lg:text-sm xl:text-base text-black">
                  {phone}
                </span>
              </button>

              {/* Email Button */}
              <button
                onClick={() => (window.location.href = `mailto:${email}`)}
                className="inline-flex items-center justify-center gap-2 lg:gap-1.5 xl:gap-2 px-6 lg:px-3 xl:px-6 py-3 bg-[#D4D4D866]"
              >
                <Image
                  src="/assets/common/mail-icon.svg"
                  alt="Email"
                  width={20}
                  height={20}
                />
                <span className="text-sm sm:text-base lg:text-sm xl:text-base text-black">
                  {email}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column - Map */}
          {mapEmbed && (
            <div
              className="w-full h-[300px] lg:h-[392px]"
              dangerouslySetInnerHTML={{ __html: mapEmbed }}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactInformation;
