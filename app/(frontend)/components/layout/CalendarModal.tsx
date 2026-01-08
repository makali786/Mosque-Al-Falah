"use client";

import { useState, useCallback } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface PrayerTime {
  name: string;
  begins: string;
  jamaah?: string;
  isActive?: boolean;
}

interface JumuahTime {
  name: string;
  khutbah: string;
  jamaah: string;
}

interface DateInfo {
  gregorian: string;
  hijri: string;
}

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// ============================================================================
// Data Configuration (Ready for API integration)
// ============================================================================

const MOCK_PRAYER_TIMES: PrayerTime[] = [
  { name: "Fajr", begins: "5:01", jamaah: "5:01" },
  { name: "Sunrise", begins: "6:38" },
  { name: "Zuhr", begins: "12:18", jamaah: "12:45" },
  { name: "'Asr", begins: "3:52", jamaah: "4:15" },
  { name: "Maghrib", begins: "5:48", jamaah: "6:03" },
  { name: "'Isha", begins: "7:13", jamaah: "8:00", isActive: true },
];

const MOCK_JUMUAH_TIMES: JumuahTime[] = [
  { name: "Jumua'ah 1", khutbah: "12:25", jamaah: "1:00" },
  { name: "Jumua'ah 2", khutbah: "12:45", jamaah: "1:15" },
];

const MOCK_DATE_INFO: DateInfo = {
  gregorian: "Monday, 3rd March 2025",
  hijri: "Ramadan 3, 1446 AH",
};

// ============================================================================
// Sub-Components
// ============================================================================

interface DateNavigationProps {
  dateInfo: DateInfo;
  onPrevious: () => void;
  onNext: () => void;
}

const DateNavigation = ({ dateInfo, onPrevious, onNext }: DateNavigationProps) => (
  <div className="flex items-center justify-between w-full" data-node-id="6634:273190">
    <button
      onClick={onPrevious}
      className="w-8 h-8 shrink-0 flex items-center justify-center text-black hover:text-[#006fee] transition-colors"
      aria-label="Previous day"
    >
      <IoChevronBack className="w-6 h-6" />
    </button>

    <div className="flex flex-col gap-1 items-center text-center w-[170px]" data-node-id="6634:273185">
      <p className="font-semibold text-sm leading-5 text-black w-full" data-node-id="6634:273183">
        {dateInfo.gregorian}
      </p>
      <p className="font-medium text-xs leading-4 text-[#006fee] w-full" data-node-id="6634:273184">
        {dateInfo.hijri}
      </p>
    </div>

    <button
      onClick={onNext}
      className="w-8 h-8 shrink-0 flex items-center justify-center text-black hover:text-[#006fee] transition-colors"
      aria-label="Next day"
    >
      <IoChevronForward className="w-6 h-6" />
    </button>
  </div>
);

interface PrayerTimeRowProps {
  prayer: PrayerTime;
}

const PrayerTimeRow = ({ prayer }: PrayerTimeRowProps) => {
  const isActive = prayer.isActive;
  const bgColor = isActive ? "bg-[#27272a]" : "bg-[#fafafa]";
  const nameColor = isActive ? "text-white" : "text-black";
  const labelColor = isActive ? "text-[#a1a1aa]" : "text-[#71717a]";
  const hasJamaah = Boolean(prayer.jamaah);

  return (
    <div
      className={`${bgColor} ${isActive ? 'border border-[#27272a]' : ''} flex items-center justify-between overflow-hidden px-4 py-3.5 rounded-lg w-full`}
      data-name="Namaz time"
      data-node-id={isActive ? "6634:273262" : undefined}
    >
      <p className={`font-bold text-base leading-6 ${nameColor} w-24`}>
        {prayer.name}
      </p>

      <div className="flex gap-1 items-center text-nowrap w-24">
        <p className={`font-normal text-xs leading-4 ${labelColor}`}>
          Begins
        </p>
        <p className="font-bold text-base leading-6 text-[#006fee]">
          {prayer.begins}
        </p>
      </div>

      <div className={`flex gap-1 items-center text-nowrap w-24 ${!hasJamaah ? 'opacity-0' : ''}`}>
        <p className={`font-normal text-xs leading-4 ${labelColor}`}>
          Jama&apos;ah
        </p>
        <p className="font-bold text-base leading-6 text-[#006fee]">
          {prayer.jamaah || "5:01"}
        </p>
      </div>
    </div>
  );
};

interface JumuahTimeRowProps {
  jumuah: JumuahTime;
}

const JumuahTimeRow = ({ jumuah }: JumuahTimeRowProps) => (
  <div
    className="bg-[#fafafa] flex items-center justify-between overflow-hidden px-4 py-3.5 rounded-lg w-full"
    data-name="Namaz time"
  >
    <p className="font-bold text-base leading-6 text-black w-24">
      {jumuah.name}
    </p>

    <div className="flex gap-1 items-center text-nowrap w-24">
      <p className="font-normal text-xs leading-4 text-[#71717a]">
        Khutbah
      </p>
      <p className="font-bold text-base leading-6 text-[#006fee]">
        {jumuah.khutbah}
      </p>
    </div>

    <div className="flex gap-1 items-center text-nowrap w-24">
      <p className="font-normal text-xs leading-4 text-[#71717a]">
        Jama&apos;ah
      </p>
      <p className="font-bold text-base leading-6 text-[#006fee]">
        {jumuah.jamaah}
      </p>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export default function CalendarModal({ isOpen, onClose }: CalendarModalProps) {
  const [prayerTimes] = useState<PrayerTime[]>(MOCK_PRAYER_TIMES);
  const [jumuahTimes] = useState<JumuahTime[]>(MOCK_JUMUAH_TIMES);
  const [dateInfo] = useState<DateInfo>(MOCK_DATE_INFO);

  // Date navigation (ready for future implementation)
  const handlePreviousDay = useCallback(() => {
    console.log("Navigate to previous day");
  }, []);

  const handleNextDay = useCallback(() => {
    console.log("Navigate to next day");
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4"
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
          />

          {/* Prayer Times List */}
          <div className="flex flex-col gap-5 items-start w-full" data-node-id="6634:273217">
            {/* Daily Prayer Times */}
            {prayerTimes.map((prayer) => (
              <PrayerTimeRow key={prayer.name} prayer={prayer} />
            ))}

            {/* Divider */}
            <div
              className="bg-[rgba(17,17,17,0.15)] h-px w-full"
              data-name="orientation=horizontal"
              data-node-id="2584:52"
              role="separator"
            />

            {/* Jumua'ah Times */}
            {jumuahTimes.map((jumuah) => (
              <JumuahTimeRow key={jumuah.name} jumuah={jumuah} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
