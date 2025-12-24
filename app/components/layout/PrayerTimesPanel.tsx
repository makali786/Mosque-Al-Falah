"use client";

import Image from "next/image";
import { useState, useEffect, useMemo, useCallback } from "react";
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

interface CountdownTime {
  hours: string;
  minutes: string;
  seconds: string;
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

// Next prayer for countdown (will be dynamic in future)
const NEXT_PRAYER = { name: "ISHA", time: "19:13" };

// ============================================================================
// Utility Functions
// ============================================================================

const calculateCountdown = (targetTime: string): CountdownTime => {
  const now = new Date();
  const [hours, minutes] = targetTime.split(":").map(Number);

  const target = new Date();
  target.setHours(hours, minutes, 0, 0);

  // If target time has passed today, set it for tomorrow
  if (now > target) {
    target.setDate(target.getDate() + 1);
  }

  const diff = target.getTime() - now.getTime();

  if (diff <= 0) {
    return { hours: "00", minutes: "00", seconds: "00" };
  }

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const s = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: h.toString().padStart(2, "0"),
    minutes: m.toString().padStart(2, "0"),
    seconds: s.toString().padStart(2, "0"),
  };
};

const formatTime = (time: string): string => time;

// ============================================================================
// Sub-Components
// ============================================================================

interface CountdownDisplayProps {
  countdown: CountdownTime;
  prayerName: string;
}

const CountdownDisplay = ({ countdown, prayerName }: CountdownDisplayProps) => {
  const timeUnits = [
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Minutes" },
    { value: countdown.seconds, label: "Seconds" },
  ];

  return (
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:w-93.5 w-[calc(100%-2rem)] backdrop-blur-[6.65px] bg-[#18181b]/80 flex flex-col gap-0 items-center md:p-6 p-3 rounded-[14px] sm:mt-0 mt-10"
      style={{ backdropFilter: "blur(6.65px)" }}
    >
      <div className="flex flex-col md:gap-2 gap-1 items-center">
        {/* Timer Title */}
        <div className="flex md:gap-2 gap-1 items-center md:text-lg text-sm text-[#fafafa] text-center md:leading-7 leading-5">
          <p className="font-normal">The Athan of</p>
          <p className="font-semibold">{prayerName}</p>
          <p className="font-normal">is in</p>
        </div>

        {/* Countdown Display */}
        <div className="flex flex-col gap-1 items-start w-full">
          <div className="flex items-center justify-center md:text-5xl text-2xl font-semibold text-[#fafafa] w-full md:leading-12 leading-8">
            {timeUnits.map((unit, index) => (
              <div key={unit.label} className="flex items-center">
                <div className="flex justify-center text-center md:w-17 w-10">
                  <p>{unit.value}</p>
                </div>
                {index < timeUnits.length - 1 && (
                  <div className="flex justify-center text-center md:px-1 px-0.5">
                    <p>:</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Labels */}
          <div className="flex md:gap-3.5 gap-1.5 items-center w-full justify-center">
            {timeUnits.map((unit) => (
              <div
                key={unit.label}
                className="bg-[#27272a] md:h-6.25 h-4 rounded-lg overflow-hidden shrink-0 md:w-17 w-10 flex items-center justify-center"
              >
                <p className="md:text-sm text-[10px] font-normal text-[#a1a1aa] md:leading-5 leading-3">
                  {unit.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface DateNavigationProps {
  dateInfo: DateInfo;
  onPrevious: () => void;
  onNext: () => void;
}

const DateNavigation = ({ dateInfo, onPrevious, onNext }: DateNavigationProps) => (
  <div className="absolute md:top-31.75 top-4 left-1/2 -translate-x-1/2 flex items-center justify-between md:w-81.5 w-[calc(100%-2rem)] z-10">
    <button
      onClick={onPrevious}
      className="md:w-8 md:h-8 w-6 h-6 shrink-0 flex items-center justify-center text-white hover:text-[#006fee] transition-colors"
      aria-label="Previous day"
    >
      <IoChevronBack className="md:w-6 md:h-6 w-5 h-5" />
    </button>

    <div className="flex flex-col gap-1 items-center text-center md:w-42.5 flex-1">
      <p className="md:text-sm text-xs font-semibold text-[#fafafa] md:leading-5 leading-4 w-full">
        {dateInfo.gregorian}
      </p>
      <p className="text-xs font-medium text-[#006fee] leading-4 w-full">
        {dateInfo.hijri}
      </p>
    </div>

    <button
      onClick={onNext}
      className="md:w-8 md:h-8 w-6 h-6 shrink-0 flex items-center justify-center text-white hover:text-[#006fee] transition-colors"
      aria-label="Next day"
    >
      <IoChevronForward className="md:w-6 md:h-6 w-5 h-5" />
    </button>
  </div>
);

interface PrayerTimeRowProps {
  prayer: PrayerTime;
}

const PrayerTimeRow = ({ prayer }: PrayerTimeRowProps) => {
  const isActive = prayer.isActive;
  const bgColor = isActive ? "bg-[#27272a] border border-[#27272a]" : "bg-[#fafafa]";
  const nameColor = isActive ? "text-white" : "text-black";
  const labelColor = isActive ? "text-[#a1a1aa]" : "text-[#71717a]";

  return (
    <div className={`${bgColor} flex items-center justify-between overflow-hidden md:px-4 px-3 md:py-3.5 py-2.5 rounded-lg w-full`}>
      <p className={`md:text-base text-sm font-bold ${nameColor} md:leading-6 leading-5 md:w-24 w-16`}>
        {prayer.name}
      </p>

      <div className="flex gap-1 items-center text-nowrap md:w-24 flex-1 justify-end">
        <p className={`md:text-xs text-[10px] font-normal ${labelColor} md:leading-4 leading-3`}>
          Begins
        </p>
        <p className="md:text-base text-sm font-bold text-[#006fee] md:leading-6 leading-5">
          {formatTime(prayer.begins)}
        </p>
      </div>

      <div className={`flex gap-1 items-center text-nowrap md:w-24 flex-1 justify-end ${!prayer.jamaah ? 'opacity-0' : ''}`}>
        <p className={`md:text-xs text-[10px] font-normal ${labelColor} md:leading-4 leading-3`}>
          Jama'ah
        </p>
        <p className="md:text-base text-sm font-bold text-[#006fee] md:leading-6 leading-5">
          {formatTime(prayer.jamaah || prayer.begins)}
        </p>
      </div>
    </div>
  );
};

interface JumuahTimeRowProps {
  jumuah: JumuahTime;
}

const JumuahTimeRow = ({ jumuah }: JumuahTimeRowProps) => (
  <div className="bg-[#fafafa] flex items-center justify-between overflow-hidden md:px-4 px-3 md:py-3.5 py-2.5 rounded-lg w-full">
    <p className="md:text-base text-sm font-bold text-black md:leading-6 leading-5 md:w-24 w-16">
      {jumuah.name}
    </p>

    <div className="flex gap-1 items-center text-nowrap md:w-24 flex-1 justify-end">
      <p className="md:text-xs text-[10px] font-normal text-[#71717a] md:leading-4 leading-3">
        Khutbah
      </p>
      <p className="md:text-base text-sm font-bold text-[#006fee] md:leading-6 leading-5">
        {formatTime(jumuah.khutbah)}
      </p>
    </div>

    <div className="flex gap-1 items-center text-nowrap md:w-24 flex-1 justify-end">
      <p className="md:text-xs text-[10px] font-normal text-[#71717a] md:leading-4 leading-3">
        Jama'ah
      </p>
      <p className="md:text-base text-sm font-bold text-[#006fee] md:leading-6 leading-5">
        {formatTime(jumuah.jamaah)}
      </p>
    </div>
  </div>
);

// ============================================================================
// Main Component
// ============================================================================

export default function PrayerTimesPanel({ isOpen, onClose }: PrayerTimesPanelProps) {
  const [countdown, setCountdown] = useState<CountdownTime>({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  // Date navigation (ready for future implementation)
  const handlePreviousDay = useCallback(() => {
    // TODO: Implement previous day logic
    console.log("Navigate to previous day");
  }, []);

  const handleNextDay = useCallback(() => {
    // TODO: Implement next day logic
    console.log("Navigate to next day");
  }, []);

  // Countdown timer effect
  useEffect(() => {
    if (!isOpen) return;

    const updateCountdown = () => {
      setCountdown(calculateCountdown(NEXT_PRAYER.time));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

  // Prayer times data (will be fetched from API in future)
  const prayerTimes = useMemo(() => MOCK_PRAYER_TIMES, []);
  const jumuahTimes = useMemo(() => MOCK_JUMUAH_TIMES, []);
  const dateInfo = useMemo(() => MOCK_DATE_INFO, []);

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
          <div className="md:flex-1 w-full min-w-0 relative self-stretch md:min-h-150 min-h-48 bg-[#1a2332] overflow-hidden">
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
            <CountdownDisplay countdown={countdown} prayerName={NEXT_PRAYER.name} />
          </div>

          {/* Right side - Prayer Times List */}
          <div className="md:flex-1 w-full min-w-0 bg-white md:border border-0 border-[#f4f4f5] flex flex-col gap-0 items-center overflow-hidden md:pl-6 md:pr-28 px-4 md:py-8 py-3 md:rounded-xl rounded-none shrink-0 self-stretch">
            <div className="flex flex-col md:gap-5 gap-2 items-start w-full">
              <h2 id="prayer-times-title" className="sr-only">Prayer Times</h2>

              {/* Daily Prayer Times */}
              {prayerTimes.map((prayer) => (
                <PrayerTimeRow key={prayer.name} prayer={prayer} />
              ))}

              {/* Divider */}
              <div className="bg-[rgba(17,17,17,0.15)] h-px w-full" role="separator" />

              {/* Jumua'ah Times */}
              {jumuahTimes.map((jumuah) => (
                <JumuahTimeRow key={jumuah.name} jumuah={jumuah} />
              ))}
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute md:top-0 top-1 md:right-0 right-1 bg-[#f4f4f5] flex items-center justify-center p-0 rounded-full shrink-0 md:w-12 md:h-12 sm:w-9 sm:h-9 w-4 h-4 cursor-pointer hover:bg-[#e4e4e7] transition-colors focus:outline-none focus:ring-2 focus:ring-[#006fee] focus:ring-offset-2"
            aria-label="Close prayer times panel"
          >
            <div className="md:w-5 md:h-5 sm:w-4 sm:h-4 w-3.5 h-3.5 relative">
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
