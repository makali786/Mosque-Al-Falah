"use client";

import { FaMapMarkerAlt } from "react-icons/fa";

interface JamaahTime {
  id: string;
  label: string; // e.g., "1ST JAMA'AH"
  time: string; // e.g., "07:00"
  imam: string;
  khutbahLanguage: string;
}

interface EidSalahScheduleProps {
  title?: string;
  description?: string;
  venueName?: string;
  venueAddress?: string;
  schedule?: JamaahTime[];
}

export default function EidSalahSchedule({
  title = "Eid Salah Schedule at Masjid Al-Falah",
  description = "Eid is a time of joy, gratitude, and unity. Join us for a spiritually uplifting Eid Salah as we come together to celebrate this blessed day with prayers and community spirit.",
  venueName = "North Ilford Islamic Centre",
  venueAddress = "97 Kensington Gardens, Ilford, Essex IG1 3EN",
  schedule = [
    {
      id: "1",
      label: "1ST JAMA'AH",
      time: "07:00",
      imam: "MOULANA FAROQ",
      khutbahLanguage: "ENGLISH",
    },
    {
      id: "2",
      label: "2ND JAMA'AH",
      time: "08:30",
      imam: "MOULANA FAROQ",
      khutbahLanguage: "ENGLISH",
    },
    {
      id: "3",
      label: "3RD JAMA'AH",
      time: "10:00",
      imam: "MOULANA FAROQ",
      khutbahLanguage: "ENGLISH",
    },
  ],
}: EidSalahScheduleProps) {
  return (
    <section className="w-full py-16 md:py-20 bg-[#F5F5F7]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          
          {/* Left Side: Text Content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-8">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#11181C] leading-tight">
              {title}
            </h2>

            <div className="flex flex-col gap-4">
              <p className="text-sm font-semibold text-[#11181C] flex items-center gap-2">
                <span>🎉</span> Celebrate Eid with Us!
              </p>
              <p className="text-base sm:text-lg text-[#687076] leading-relaxed max-w-xl">
                {description}
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-[#11181C] font-semibold">
                <FaMapMarkerAlt />
                <span>Venue</span>
              </div>
              <div className="text-[#687076] text-base">
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
                        ? "border-b border-white/10"
                        : ""
                    } hover:bg-white/5 transition-colors`}
                  >
                    <div className="flex flex-col gap-1 text-white">
                      <h3 className="text-lg font-bold uppercase tracking-wide">
                        {slot.label}
                      </h3>
                      <div className="text-[10px] sm:text-xs text-blue-100 flex flex-col gap-0.5 opacity-90 font-medium">
                        <span>IMAM: {slot.imam}</span>
                        <span>KHUTBAH: {slot.khutbahLanguage}</span>
                      </div>
                    </div>
                    <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight">
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
