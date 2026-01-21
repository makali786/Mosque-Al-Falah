"use client";

import Image from "next/image";
import { useEffect } from "react";
import { usePrayerTimesNavigation } from "@hooks/usePrayerTimesNavigation";
import { usePrayerTimes } from "@hooks/usePrayerTimes";
import { useCountdown } from "@hooks/useCountdown";
import {
  CountdownDisplay,
  DateNavigation,
  PrayerTimeRow,
  JumuahTimeRow,
} from "@/components/prayer-times/PrayerTimeComponents";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface PrayerTimesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  prayerTimes?: any[];
  settings?: any;
}

// ============================================================================
// Main Component
// ============================================================================

export default function PrayerTimesPanel({
  isOpen,
  onClose,
  prayerTimes: initialPrayerTimes = [],
  settings,
}: PrayerTimesPanelProps) {
  // Use custom hooks
  const {
    currentDate,
    handlePreviousDay,
    handleNextDay,
    resetToToday,
  } = usePrayerTimesNavigation({ resetOnMount: false });

  // Reset to current date when panel opens
  useEffect(() => {
    if (isOpen) {
      resetToToday();
    }
  }, [isOpen, resetToToday]);

  // Get prayer times data
  const { prayerTimes, dateInfo, nextPrayer, isViewingToday } = usePrayerTimes({
    prayerTimes: initialPrayerTimes,
    settings,
    currentDate,
  });

  // Countdown timer - only count down when viewing today and panel is open
  const countdown = useCountdown({
    targetTime: nextPrayer.time,
    isActive: isOpen && isViewingToday,
  });

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel - Centered Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 z-50 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "-translate-y-1/2" : "translate-y-[150%]"
        }`}
        style={{
          maxWidth: "1200px",
          width: "calc(100% - 48px)",
          maxHeight: "90vh"
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="prayer-times-title"
      >
        <div className="bg-white flex md:flex-row flex-col md:gap-6 gap-0 items-start overflow-hidden md:overflow-visible overflow-y-auto relative md:rounded-3xl rounded-2xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)] max-h-[90vh]">

          {/* Left side - Image with countdown */}
          <div className="md:flex-1 w-full min-w-0 relative self-stretch md:min-h-150 min-h-70 bg-[#1a2332] overflow-hidden rounded-t-2xl md:rounded-l-3xl md:rounded-tr-none">
            <Image
              src="/assets/prayer-times/mosque-bg.png"
              alt="Mosque background"
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

            {/* Date Navigation */}
            <DateNavigation
              dateInfo={dateInfo}
              onPrevious={handlePreviousDay}
              onNext={handleNextDay}
            />

            {/* Countdown Timer */}
            <CountdownDisplay countdown={countdown} prayerName={nextPrayer.name} />
          </div>

          {/* Right side - Prayer Times List */}
          <div className="md:flex-1 w-full min-w-0 bg-white md:border border-0 border-[#f4f4f5] flex flex-col gap-0 items-center overflow-hidden md:pl-6 lg:pr-28 md:pr-16 px-4 md:py-8 py-3 md:rounded-xl rounded-none shrink-0 self-stretch">
            <div className="flex flex-col md:gap-5 gap-2 items-start w-full">
              <h2 id="prayer-times-title" className="sr-only">Prayer Times</h2>

              {/* Prayer Times - conditionally render Jumu'ah rows */}
              {prayerTimes.map((prayer) =>
                prayer.isJumuah ? (
                  <JumuahTimeRow key={prayer.name} jumuah={prayer} />
                ) : (
                  <PrayerTimeRow key={prayer.name} prayer={prayer} />
                )
              )}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute lg:top-0 md:top-3 top-3 lg:right-0 md:right-2 right-3 bg-[#f4f4f5] flex items-center justify-center p-0 rounded-full shrink-0 md:w-12 md:h-12 w-8 h-8 cursor-pointer hover:bg-[#e4e4e7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#006fee] focus:ring-offset-2 z-20"
            aria-label="Close prayer times panel"
          >
            <div className="md:w-5 md:h-5 w-3.5 h-3.5 relative">
              <Image
                src="/assets/prayer-times/close-icon.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </button>
        </div>
      </div>
    </>
  );
}
