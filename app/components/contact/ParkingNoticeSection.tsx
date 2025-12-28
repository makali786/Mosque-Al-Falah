"use client";

import Image from "next/image";

export function ParkingNoticeSection() {
  return (
    <section className="relative w-full px-6 py-12 sm:px-8 sm:py-20 md:px-12 md:py-24 lg:px-20 lg:py-32 xl:px-30 overflow-hidden">
      {/* Background with gradient and pattern - Same as Core Values */}
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
      <div className="relative w-full">
        <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 md:gap-12 lg:gap-16 items-start lg:items-center">
          {/* Left Side - Text Content */}
          <div>
            <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl text-white md:mb-6 xl:mb-8">
              Please Do Not Park Irresponsibly
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-white">
              Please DO NOT block any exits, driveways, Junctions or cause any
              other inconvenience to our neighbours when attending the Masjid
            </p>
          </div>

          {/* Right Side - Quote Card */}
          <div className="w-full lg:w-auto lg:shrink-0 lg:max-w-[400px] xl:max-w-[640px]">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-[14px] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-10 lg:px-12 lg:py-14 relative">
              {/* Opening Quote Icon */}
              <div className="absolute top-6 left-6 sm:top-8 sm:left-8 lg:top-10 lg:left-10">
                <Image
                  src="/assets/common/double-quote-left.svg"
                  alt="Quote Icon"
                  width={24}
                  height={24}
                />
              </div>

              {/* Quote Content */}
              <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 pt-4 sm:pt-4">
                <div className="text-sm sm:text-base text-black">
                  <p className="mb-4">
                    The Prophet peace be upon him said:{" "}
                    <strong>
                      "He Will not enter Jannah Whose neighbour is not secure
                      from his wrongful conduct."
                    </strong>
                  </p>
                  <p className="text-sm sm:text-[14px] md:text-[15px] font-medium">
                    - Bukhari & Muslim
                  </p>
                </div>
              </div>

              {/* Closing Quote Icon */}
              <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 lg:bottom-10 lg:right-10">
              <Image
                  src="/assets/common/double-quote-right.svg"
                  alt="Quote Icon"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
