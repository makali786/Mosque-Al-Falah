"use client";

import Image from "next/image";

import { ReactNode } from "react";

interface JamaahTime {
  id: string;
  label: string;
  time: string;
  description?: string;
  imam?: string;
  khutbahLanguage?: string;
}

interface EidSalahScheduleProps {
  title?: string;
  description?: ReactNode;
  venueName?: string;
  venueAddress?: string;
  schedule?: JamaahTime[];
  sectionContainer?: string
  rightSection?: string
}

export default function EidSalahSchedule({
  title = "",
  description = null,
  venueName = "",
  venueAddress = "",
  schedule = [],
  sectionContainer,
  rightSection
}: EidSalahScheduleProps) {
  return (
    <section className="w-full py-16 md:py-20 bg-[#F4F4F5]">
      <div className={`${sectionContainer}`}>
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
              {title}
            </h2>

            <div>
              <div className="text-base sm:text-lg">
                {description}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-1 text-base sm:text-lg font-medium">
                <Image src="/assets/common/map-pin.svg" alt="map-pin" width={24} height={24} />
                <span>Venue</span>
              </div>
              <div className="text-base sm:text-lg">
                <p>{venueName}</p>
                <p>{venueAddress}</p>
              </div>
            </div>
          </div>

          {/* Right Side: Schedule Card */}
          <div className={`w-full lg:w-1/2 max-w-xl ${rightSection}`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* Background from OurCoreValues strategy */}
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

              {/* Content */}
              <div className="relative z-10">

                {schedule.map((slot, index) => (
                  <div
                    key={slot.id}
                    className={`flex items-center w-full ${
                      index !== schedule.length - 1
                      ? "border-b border-[#11111126]"
                        : ""
                    }`}
                  >
                    {/* Left Side: Jamaah Info */}
                    <div className="flex-1 p-6 sm:p-8 hover:bg-white/5 transition-colors">
                      <div className="flex flex-col gap-2">
                        <h3 className="text-base sm:text-lg font-bold uppercase text-white leading-7">
                          {slot.label}
                        </h3>
                        <div className="text-xs flex flex-col gap-1 text-white">
                          {slot.imam && (
                            <div className="flex items-center gap-1">
                              <span>IMAM:</span>
                              <span>{slot.imam}</span>
                            </div>
                          )}
                          {slot.khutbahLanguage && (
                            <div className="flex items-center gap-1">
                              <span>KHUTBAH:</span>
                              <span>{slot.khutbahLanguage}</span>
                            </div>
                          )}
                          {slot.description && !slot.imam && !slot.khutbahLanguage && (
                            <span className="opacity-80">{slot.description}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Right Side: Time Box */}
                    <div className="flex items-center self-stretch">
                      <div
                        className="flex items-center justify-center h-full w-[120px] sm:w-[140px] md:w-[158px]"
                        style={{ backgroundColor: 'rgba(0, 111, 238, 0.2)' }}
                      >
                        <div className="text-3xl sm:text-4xl font-bold text-white leading-10">
                          {slot.time}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
