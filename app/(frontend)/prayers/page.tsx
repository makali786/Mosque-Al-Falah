"use client"
import PrayerTimesSection from "@/components/common/PrayerTimesSection";
import { QuoteSection } from "@/components/common/QuoteSection";
import { useState } from "react";

export default function PrayersPage() {

     const [activeTab, setActiveTab] = useState<'prayer-time' | 'calendar'>('prayer-time');
  return (
    <div className="bg-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 section-padding pt-8">
              {/* Toggle Switch */}
              <div className="bg-[#FAFAFA] p-1 rounded-lg inline-flex">
                <button
                  onClick={() => setActiveTab('prayer-time')}
                  className={`px-10 py-2.5 rounded-md text-base font-medium transition-all min-w-[174px] max-w-[174px] ${
                    activeTab === 'prayer-time'
                      ? 'bg-white text-black'
                      : 'text-[#71717A] hover:text-black'
                  }`}
                >
                  Prayer Time
                </button>
                <button
                  onClick={() => setActiveTab('calendar')}
                  className={`px-10 py-2.5 rounded-md text-base font-medium transition-all min-w-[174px] max-w-[174px] ${
                    activeTab === 'calendar'
                      ? 'bg-white text-black'
                      : 'text-[#71717A] hover:text-black'
                  }`}
                >
                  Calendar
                </button>
              </div>
      
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button className="bg-[#27272A] text-white px-6 py-3 rounded-lg text-base">
                  Download 2025 timetable
                </button>
                <button className="bg-[#27272A] text-white px-6 py-3 rounded-lg text-base">
                  Ramadan Timetable
                </button>
              </div>
            </div>
      <PrayerTimesSection activeTab={activeTab} />
      <QuoteSection
      quote="The best of you is the one who is the best to his family."
      attribution="— Prophet Muhammad ﷺ"
      />
    </div>
  );
}
