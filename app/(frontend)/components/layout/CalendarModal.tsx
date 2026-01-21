"use client";

import { useCallback, useMemo } from "react";
import { usePrayerTimesNavigation } from "@hooks/usePrayerTimesNavigation";
import { usePrayerTimes } from "@hooks/usePrayerTimes";
import {
  DateNavigation,
  PrayerTimeRow,
  JumuahTimeRow,
} from "@/components/prayer-times/PrayerTimeComponents";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  prayerTimes?: any[];
  settings?: any;
}

// ============================================================================
// Main Component
// ============================================================================

export default function CalendarModal({
  isOpen,
  onClose,
  prayerTimes: initialPrayerTimes = [],
  settings,
}: CalendarModalProps) {
  // Use custom hooks
  const { currentDate, handlePreviousDay, handleNextDay } =
    usePrayerTimesNavigation({ resetOnMount: false });

  // Get prayer times data
  const { prayerTimes, dateInfo } = usePrayerTimes({
    prayerTimes: initialPrayerTimes,
    settings,
    currentDate,
  });

  return (
    <>
      {/* Backdrop - only visible when open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 transition-opacity duration-200"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Dropdown Modal */}
      <div
        className={`absolute top-full right-0 mt-8 lg:mr-16 w-[min(440px,calc(100vw-2rem))] z-50 origin-top-right transition-all duration-300 ease-out ${
          isOpen
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="calendar-modal-title"
      >
        <div
          className="bg-white flex flex-col gap-9 items-center overflow-clip px-6 py-8 rounded-xl shadow-[0px_25px_50px_-12px_rgba(0,0,0,0.25)] w-full"
          data-name="More"
          data-node-id="6603:23518"
        >
          <h2 id="calendar-modal-title" className="sr-only">
            Prayer Times Calendar
          </h2>

          {/* Date Navigation */}
          <DateNavigation
            dateInfo={dateInfo}
            onPrevious={handlePreviousDay}
            onNext={handleNextDay}
            variant="compact"
          />

          {/* Prayer Times List */}
          <div
            className="flex flex-col gap-5 items-start w-full"
            data-node-id="6634:273217"
          >
            {/* Daily Prayer Times */}
            {prayerTimes.map((prayer) =>
              prayer.isJumuah ? (
                <JumuahTimeRow
                  key={prayer.name}
                  jumuah={prayer}
                  variant="compact"
                />
              ) : (
                <PrayerTimeRow
                  key={prayer.name}
                  prayer={prayer}
                  variant="compact"
                />
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
