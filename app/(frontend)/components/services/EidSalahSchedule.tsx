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
}

export default function EidSalahSchedule({
  title = "",
  description = null,
  venueName = "",
  venueAddress = "",
  schedule = [],
}: EidSalahScheduleProps) {
  return (
    <section className="w-full py-16 md:py-20 bg-[#F4F4F5]">
      <div className="section-padding">
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
          <div className="w-full lg:w-1/2 max-w-xl">
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
                    className={`flex items-center justify-between p-6 sm:p-8 ${
                      index !== schedule.length - 1
                      ? "border-b border-[#11111126]"
                        : ""
                    } hover:bg-white/5 transition-colors`}
                  >
                    <div className="flex flex-col gap-1 text-white">
                      <h3 className="text-base sm:text-lg font-bold uppercase tracking-wide">
                        {slot.label}
                      </h3>
                      <div className="text-[10px] sm:text-xs flex flex-col uppercase gap-0.5">
                        {slot.imam && <span>IMAM: {slot.imam}</span>}
                        {slot.khutbahLanguage && <span>KHUTBAH: {slot.khutbahLanguage}</span>}
                        {slot.description && !slot.imam && !slot.khutbahLanguage && (
                          <span className="opacity-80">{slot.description}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                      {slot.time}
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
