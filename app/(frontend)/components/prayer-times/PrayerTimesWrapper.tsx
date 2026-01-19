"use client"

import PrayerTimesSection from "@/components/common/PrayerTimesSection";
import { useState } from "react";

interface PrayerTimesWrapperProps {
  initialPrayerTimes: any[];
  settings: any;
}

export default function PrayerTimesWrapper({ initialPrayerTimes, settings }: PrayerTimesWrapperProps) {
  const [activeTab, setActiveTab] = useState<'prayer-time' | 'calendar'>('prayer-time');

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4 section-padding pt-8">
        {/* Toggle Switch */}
        <div className="bg-[#FAFAFA] p-1 rounded-lg flex w-full flex-wrap md:w-auto">
          <button
            onClick={() => setActiveTab('prayer-time')}
            className={`flex-1 md:flex-none px-4 md:px-10 py-2.5 rounded-md text-sm md:text-base font-medium transition-all md:min-w-[174px] md:max-w-[174px] cursor-pointer text-center whitespace-nowrap ${
              activeTab === 'prayer-time'
                ? 'bg-white text-[#18181B] shadow-sm'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Prayer Time
          </button>
          <button
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 md:flex-none px-4 md:px-10 py-2.5 rounded-md text-sm md:text-base font-medium transition-all md:min-w-[174px] md:max-w-[174px] cursor-pointer text-center whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-white text-[#18181B] shadow-sm'
                : 'text-[#71717A] hover:text-[#18181B]'
            }`}
          >
            Calendar
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="bg-[#27272A] text-white px-6 py-3 rounded-lg text-base cursor-pointer">
            Download 2025 timetable
          </button>
          <button className="bg-[#27272A] text-white px-6 py-3 rounded-lg text-base cursor-pointer">
            Ramadan Timetable
          </button>
        </div>
      </div>

      <PrayerTimesSection
        activeTab={activeTab}
        prayerTimes={initialPrayerTimes}
        settings={settings}
      />
    </>
  );
}
