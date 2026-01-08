"use client";

import { useState, useCallback, useMemo } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import dayjs from "dayjs";

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
// Date Utility Functions
// ============================================================================

const formatGregorianDate = (date: dayjs.Dayjs): string => {
  const getOrdinalSuffix = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const dayName = date.format('dddd');
  const day = date.date();
  const month = date.format('MMMM');
  const year = date.year();

  return `${dayName}, ${day}${getOrdinalSuffix(day)} ${month} ${year}`;
};

const formatHijriDate = (date: Date): string => {
  try {
    // Use Intl API with islamic-umalqura calendar for Hijri dates
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });

    const parts = formatter.formatToParts(date);
    const month = parts.find(p => p.type === 'month')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';
    const year = parts.find(p => p.type === 'year')?.value || '';

    return `${month} ${day}, ${year} AH`;
  } catch (error) {
    // Fallback if browser doesn't support islamic calendar
    console.error('Hijri calendar not supported:', error);
    return 'Hijri date unavailable';
  }
};

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
      className="w-8 h-8 shrink-0 flex items-center justify-center text-black hover:text-[#006fee] transition-colors cursor-pointer"
      aria-label="Previous day"
    >
      <IoChevronBack className="w-6 h-6" />
    </button>

    <div className="flex flex-col gap-1 items-center text-center w-42.5 whitespace-nowrap" data-node-id="6634:273185">
      <p className="font-semibold text-sm leading-5 text-black w-full" data-node-id="6634:273183">
        {dateInfo.gregorian}
      </p>
      <p className="font-medium text-xs text leading-4 text-[#006fee] w-full" data-node-id="6634:273184">
        {dateInfo.hijri}
      </p>
    </div>

    <button
      onClick={onNext}
      className="w-8 h-8 shrink-0 flex items-center justify-center text-black hover:text-[#006fee] transition-colors cursor-pointer"
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
  // Dynamic date state - starts with today
  const [selectedDate, setSelectedDate] = useState(() => dayjs());

  const [prayerTimes] = useState<PrayerTime[]>(MOCK_PRAYER_TIMES);
  const [jumuahTimes] = useState<JumuahTime[]>(MOCK_JUMUAH_TIMES);

  // Calculate formatted dates dynamically
  const dateInfo = useMemo<DateInfo>(() => {
    const gregorian = formatGregorianDate(selectedDate);
    const hijri = formatHijriDate(selectedDate.toDate());

    return { gregorian, hijri };
  }, [selectedDate]);

  // Date navigation handlers
  const handlePreviousDay = useCallback(() => {
    setSelectedDate(prev => prev.subtract(1, 'day'));
  }, []);

  const handleNextDay = useCallback(() => {
    setSelectedDate(prev => prev.add(1, 'day'));
  }, []);

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
            {/* Prayer Times Calendar */}
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
