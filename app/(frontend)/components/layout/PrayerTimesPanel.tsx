"use client";

import Image from "next/image";
import { useState, useMemo, useCallback } from "react";
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

interface PrayerTimesPanelProps {
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

const formatTime = (time: string): string => time;

const getOrdinalSuffix = (day: number) => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
};

const formatGregorianDate = (date: Date): string => {
  // Format: "Monday, 3rd March 2025"
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' });
  const day = date.getDate();
  const month = date.toLocaleDateString('en-GB', { month: 'long' });
  const year = date.getFullYear();

  return `${weekday}, ${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

const formatHijriDate = (date: Date): string => {
  // Format: "Ramadan 3, 1446 AH"
  // Using Intl.DateTimeFormat with islamic-umalqura calendar
  const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const parts = formatter.formatToParts(date);
  const day = parts.find(p => p.type === 'day')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const year = parts.find(p => p.type === 'year')?.value;

  return `${month} ${day}, ${year} AH`;
};


interface DateNavigationProps {
  dateInfo: DateInfo;
  onPrevious: () => void;
  onNext: () => void;
}

const DateNavigation = ({ dateInfo, onPrevious, onNext }: DateNavigationProps) => (
  <div className="flex items-center justify-between w-full mb-8 pt-2">
    <button
      onClick={onPrevious}
      className="p-1 text-[#18181B] hover:text-[#006FEE] transition-colors"
      aria-label="Previous day"
    >
      <IoChevronBack className="w-6 h-6" />
    </button>

    <div className="text-center">
      <h2 className="text-base font-bold text-[#18181B] mb-1">
        {dateInfo.gregorian}
      </h2>
      <p className="text-sm font-medium text-[#006FEE]">
        {dateInfo.hijri}
      </p>
    </div>

    <button
      onClick={onNext}
      className="p-1 text-[#18181B] hover:text-[#006FEE] transition-colors"
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
  const bgColor = isActive ? "bg-[#18181B]" : "bg-[#FAFAFA]";
  const nameColor = isActive ? "text-white" : "text-[#18181B]";
  const labelColor = isActive ? "text-[#A1A1AA]" : "text-[#A1A1AA]"; // Kept consistent as per image (gray looking labels)
  const timeColor = "#006FEE"; // Blue for times in both active and inactive states based on my interpretation of "consistent design" and common practices, though image shows distinct blue.

  return (
    <div className={`${bgColor} flex items-center justify-between px-4 py-3.5 rounded-xl w-full`}>
      <p className={`text-base font-bold ${nameColor} w-24`}>
        {prayer.name}
      </p>

      {/* Logic to align items properly */}
      <div className="flex items-center gap-2">
        <span className={`text-xs ${labelColor}`}>Begins</span>
        <span className={`text-base font-bold text-[${timeColor}]`} style={{ color: timeColor }}>{formatTime(prayer.begins)}</span>
      </div>

      {prayer.jamaah && (
        <div className="flex items-center gap-2 w-[100px] justify-end">
          <span className={`text-xs ${labelColor}`}>Jama&apos;ah</span>
          <span className={`text-base font-bold text-[${timeColor}]`} style={{ color: timeColor }}>{formatTime(prayer.jamaah)}</span>
        </div>
      )}
    </div>
  );
};

interface JumuahTimeRowProps {
  jumuah: JumuahTime;
}

const JumuahTimeRow = ({ jumuah }: JumuahTimeRowProps) => (
  <div className="bg-[#FAFAFA] flex items-center justify-between px-6 py-4 rounded-xl w-full">
    <p className="text-base font-bold text-[#18181B] w-24">
      {jumuah.name}
    </p>

    <div className="flex flex-1 justify-end gap-8">
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#A1A1AA]">Khutbah</span>
        <span className="text-base font-bold text-[#006FEE]">{formatTime(jumuah.khutbah)}</span>
      </div>

      <div className="flex items-center gap-2 w-[100px] justify-end">
        <span className="text-xs text-[#A1A1AA]">Jama&apos;ah</span>
        <span className="text-base font-bold text-[#006FEE]">{formatTime(jumuah.jamaah)}</span>
      </div>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export default function PrayerTimesPanel({ isOpen, onClose }: PrayerTimesPanelProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Date navigation
  const handlePreviousDay = useCallback(() => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() - 1);
      return newDate;
    });
  }, []);

  const handleNextDay = useCallback(() => {
    setSelectedDate(prev => {
      const newDate = new Date(prev);
      newDate.setDate(prev.getDate() + 1);
      return newDate;
    });
  }, []);

  // Prayer times data (will be fetched from API in future)
  const prayerTimes = useMemo(() => MOCK_PRAYER_TIMES, []);
  const jumuahTimes = useMemo(() => MOCK_JUMUAH_TIMES, []);

  const dateInfo = useMemo(() => ({
    gregorian: formatGregorianDate(selectedDate),
    hijri: formatHijriDate(selectedDate)
  }), [selectedDate]);

  return (
    <>
      {/* Invisible Backdrop to handle click outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-transparent cursor-default"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Panel - Dropdown */}
      <div
        className={`absolute top-full right-0 mt-2 z-50 transform transition-all duration-200 ease-out origin-top-right ${isOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none lg:max-w-[430px]"
          }`}
        role="dialog" 
        aria-modal="true"
        aria-labelledby="prayer-times-title"
      >
        <div className="bg-white p-6 rounded-3xl shadow-[0px_25px_50px_-12px_#00000040] w-full border border-gray-100">

          <DateNavigation
            dateInfo={dateInfo}
            onPrevious={handlePreviousDay}
            onNext={handleNextDay}
            />

          <div className="space-y-3">
              {/* Daily Prayer Times */}
              {prayerTimes.map((prayer) => (
                <PrayerTimeRow key={prayer.name} prayer={prayer} />
              ))}
          </div>

          {/* Separator */}
          <div className="my-6 border-t border-gray-100 h-px w-full" />

          <div className="space-y-3">
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
