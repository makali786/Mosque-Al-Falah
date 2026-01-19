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

interface CalendarDay {
  day: string;
  date: number;
  islamicDate: number;
  subhaSadiq: string;
  sunRise: string;
  fajr: { begins: string; jamaah: string };
  zuhr: { begins: string; jamaah: string };
  asr: { begins: string; jamaah: string };
  maghrib: { begins: string; jamaah: string };
  isha: { begins: string; jamaah: string };
  isFriday?: boolean;
  isActive?: boolean;
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

const MOCK_CALENDAR_DATA: CalendarDay[] = [
  {
    day: "TUE", date: 1, islamicDate: 10, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "WED", date: 2, islamicDate: 11, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "THU", date: 3, islamicDate: 12, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "FRI", date: 4, islamicDate: 13, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" },
    isFriday: true
  },
  {
    day: "SAT", date: 5, islamicDate: 14, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "SUN", date: 6, islamicDate: 15, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "MON", date: 7, islamicDate: 16, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "TUE", date: 8, islamicDate: 17, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "WED", date: 9, islamicDate: 18, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:15", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" },
    isActive: true
  },
  {
    day: "THU", date: 10, islamicDate: 19, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "FRI", date: 11, islamicDate: 20, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" },
    isFriday: true
  },
  {
    day: "SAT", date: 12, islamicDate: 21, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "SUN", date: 13, islamicDate: 22, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "MON", date: 14, islamicDate: 23, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  },
  {
    day: "TUE", date: 15, islamicDate: 24, subhaSadiq: "5:59", sunRise: "7:44",
    fajr: { begins: "5:59", jamaah: "7:00" },
    zuhr: { begins: "12:08", jamaah: "1:00" },
    asr: { begins: "2:16", jamaah: "2:45" },
    maghrib: { begins: "4:05", jamaah: "4:07" },
    isha: { begins: "5:42", jamaah: "7:30" }
  }
];

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
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:w-93.5 md:w-72 w-[calc(100%-2rem)] backdrop-blur-[6.65px] bg-[#18181b]/80 flex flex-col gap-0 items-center lg:p-6 md:p-4 p-4 rounded-[14px]"
      style={{ backdropFilter: "blur(6.65px)" }}
    >
      <div className="flex flex-col md:gap-2 gap-1 items-center">
        {/* Timer Title */}
        <div className="flex lg:gap-2 gap-1 items-center lg:text-lg md:text-base text-sm text-[#fafafa] text-center lg:leading-7 md:leading-6 leading-5">
          <p className="font-normal">The Athan of</p>
          <p className="font-semibold">{prayerName}</p>
          <p className="font-normal">is in</p>
        </div>

        {/* Countdown Display */}
        <div className="flex flex-col gap-1 items-start w-full">
          <div className="flex items-center justify-center lg:text-5xl md:text-3xl text-2xl font-semibold text-[#fafafa] w-full lg:leading-12 md:leading-10 leading-8">
            {timeUnits.map((unit, index) => (
              <div key={unit.label} className="flex items-center">
                <div className="flex justify-center text-center lg:w-17 md:w-12 w-10">
                  <p>{unit.value}</p>
                </div>
                {index < timeUnits.length - 1 && (
                  <div className="flex justify-center text-center lg:px-1 px-0.5">
                    <p>:</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Labels */}
          <div className="flex lg:gap-3.5 gap-1.5 items-center w-full justify-center">
            {timeUnits.map((unit) => (
              <div
                key={unit.label}
                className="bg-[#27272a] lg:h-6.25 md:h-5 h-4 rounded-lg overflow-hidden shrink-0 lg:w-17 md:w-12 w-10 flex items-center justify-center"
              >
                <p className="lg:text-sm md:text-xs text-[10px] font-normal text-[#a1a1aa] lg:leading-5 leading-3">
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
  <div className="absolute lg:top-31.75 md:top-24 top-4 left-1/2 -translate-x-1/2 flex items-center justify-between lg:w-81.5 md:w-72 w-[calc(100%-2rem)] z-10">
    <button
      onClick={onPrevious}
      className="md:w-8 md:h-8 w-6 h-6 shrink-0 flex items-center justify-center text-white hover:text-[#006fee] transition-colors"
      aria-label="Previous day"
    >
      <IoChevronBack className="md:w-6 md:h-6 w-5 h-5" />
    </button>

    <div className="flex flex-col gap-1 items-center text-center lg:w-42.5 md:w-36 flex-1">
      <p className="lg:text-sm md:text-xs text-xs font-semibold text-[#fafafa] md:leading-5 leading-4 w-full">
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
    <div className={`${bgColor} flex items-center justify-between overflow-hidden md:px-4 px-3 md:py-3.5 py-3 rounded-lg w-full mb-1`}>
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
          Jama&apos;ah
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
  <div className="bg-[#fafafa] flex items-center justify-between overflow-hidden md:px-4 px-3 md:py-3.5 py-3 rounded-lg w-full mb-1">
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
        Jama&apos;ah
      </p>
      <p className="md:text-base text-sm font-bold text-[#006fee] md:leading-6 leading-5">
        {formatTime(jumuah.jamaah)}
      </p>
    </div>
  </div>
);

const PrayerTimesCalendar = () => {
  return (
    <div className="w-full bg-white rounded-[14px]">
      {/* Header / Month Navigation */}
      <div className="flex items-center justify-between bg-[#F4F4F5] rounded-lg px-4 py-3 mb-8 max-w-[540px] mx-auto">
        <button className="w-8 h-8 flex items-center justify-center text-[#71717A] hover:text-black transition-colors">
          <IoChevronBack className="w-5 h-5" />
        </button>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-black mb-2">December 2025</h3>
          <p className="text-xs font-medium text-[#006FEE]">
            Jamada-Al-Thani, 1447 -Rajab, 1447
          </p>
        </div>
        <button className="w-8 h-8 flex items-center justify-center text-[#71717A] hover:text-black transition-colors">
          <IoChevronForward className="w-5 h-5" />
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-[14px] border border-[#E4E4E7]">
        <table className="w-full text-center border-collapse">
          <thead>
            {/* Top Header Row */}
            <tr className="bg-[#001731] text-white text-sm font-normal">
              <th rowSpan={2} className="p-3 align-bottom font-normal w-16 border-r border-[#002E62] xl:h-18">Day</th>
              <th rowSpan={2} className="px-2 py-3 align-bottom font-normal w-16 border-r border-[#002E62] xl:h-18">Date</th>
              <th rowSpan={2} className="px-2 py-3 font-normal w-24 leading-tight border-r border-[#002E62] xl:h-18">
                Islamic Date
              </th>
              <th rowSpan={2} className="px-2 py-3 font-normal w-20 leading-tight border-r border-[#002E62] xl:h-18">
                Subha Sadiq
              </th>
              <th rowSpan={2} className="px-2 py-3 font-normal w-20 leading-tight border-r border-[#002E62] xl:h-18">
                Sun Rise
              </th>

              <th colSpan={2} className="px-3 py-2 border-b border-[#1F2937] border-r border-[#002E62] xl:h-5">Fajr</th>
              <th colSpan={2} className="px-3 py-2 border-b border-[#1F2937] border-r border-[#002E62] xl:h-5">Zuhr</th>
              <th colSpan={2} className="px-3 py-2 border-b border-[#1F2937] border-r border-[#002E62] xl:h-5">'Asr</th>
              <th colSpan={2} className="px-3 py-2 border-b border-[#1F2937] border-r border-[#002E62] xl:h-5">Maghrib</th>
              <th colSpan={2} className="px-3 py-2 border-b border-[#1F2937] border-r border-[#002E62] xl:h-5">Isha</th>
            </tr>
            {/* Sub Header Row */}
            <tr className="bg-[#001731] text-[#FFFFFF] text-sm h-10">
              {/* Fajr */}
              <th className="px-4 py-2.5 font-normal border-r border-[#002E62]">Begins</th>
              <th className="px-4 py-2.5 font-normal text-white border-r border-[#002E62]">Jama'ah</th>
              {/* Zuhr */}
              <th className="px-4 py-2.5 font-normal border-r border-[#002E62]">Begins</th>
              <th className="px-4 py-2.5 font-normal text-white border-r border-[#002E62]">Jama'ah</th>
              {/* Asr */}
              <th className="px-4 py-2.5 font-normal border-r border-[#002E62]">Begins</th>
              <th className="px-4 py-2.5 font-normal text-white border-r border-[#002E62]">Jama'ah</th>
              {/* Maghrib */}
              <th className="px-4 py-2.5 font-normal border-r border-[#002E62]">Begins</th>
              <th className="px-4 py-2.5 font-normal text-white border-r border-[#002E62]">Jama'ah</th>
              {/* Isha */}
              <th className="px-4 py-2.5 font-normal border-r border-[#002E62]">Begins</th>
              <th className="px-4 py-2.5 font-normal text-white border-r border-[#002E62]">Jama'ah</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_CALENDAR_DATA.map((row, index) => {
              // Row styling logic
              const isFirstRow = index === 0;
              const rowHeight = isFirstRow ? "h-[76px]" : "h-[46px]";
              const baseWidth = "!min-w-[70px]";

              let rowBaseClass = `border-b text-sm ${rowHeight} ${isFirstRow ? 'align-bottom' : ''}`;
              // Zebra striping: alternate background colors for standard rows
              let rowColors = index % 2 !== 0 ? "bg-[#FAFAFA] border-[#F4F4F5]" : "bg-white border-[#F4F4F5]";
              let cellBorder = "border-x border-solid border-[var(--colors-layout-foreground-100,#F4F4F5)]";
              let lastCellBorder = "border-x border-solid border-[var(--colors-layout-foreground-100,#F4F4F5)]";

              let textClass = "";
              let beginsClass = "";
              let islamicDateClass = "";

              if (row.isActive) {
                rowColors = "bg-[#006FEE] text-white border-[#006FEE]";
                cellBorder = "border-x border-white";
                lastCellBorder = "border-x border-white"; 
                textClass = "text-white";
                beginsClass = "text-white";
                islamicDateClass = "text-white font-medium";
              } else if (row.isFriday) {
                rowColors = "bg-[#e6f1fe] border-[#F4F4F5]";
                cellBorder = "border-x border-[#F4F4F5]";
                lastCellBorder = "border-x border-[#F4F4F5]";
                textClass = "text-[#006FEE]";
                beginsClass = "text-[#006FEE]";
                islamicDateClass = "text-[#006FEE]";
              }

              const rowClass = `${rowBaseClass} ${rowColors}`;

              return (
                <tr key={index} className={rowClass}>
                  <td className={`${textClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.day}</td>
                  <td className={`${textClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.date}</td>
                  <td className={`${islamicDateClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>
                    {isFirstRow && <span className="block text-[8px] text-[#006FEE] leading-tight mb-2.5">Jamadi-Ul-Ukhra</span>}
                    {row.islamicDate}
                  </td>
                  <td className={`${textClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.subhaSadiq}</td>
                  <td className={`${textClass} border-x border-solid border-[var(--colors-layout-foreground-100,#F4F4F5)] ${isFirstRow ? 'pb-3' : ''} ${row.isActive ? 'border-white/20' : row.isFriday ? 'border-[#DBEAFE]' : ''} ${baseWidth}`}>{row.sunRise}</td>

                  {/* Fajr */}
                  <td className={`${beginsClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.fajr.begins}</td>
                  <td className={` ${textClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.fajr.jamaah}</td>

                  {/* Zuhr */}
                  <td className={`${beginsClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.zuhr.begins}</td>
                  <td className={` ${textClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.zuhr.jamaah}</td>

                  {/* Asr */}
                  <td className={`${beginsClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.asr.begins}</td>
                  <td className={` ${textClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.asr.jamaah}</td>

                  {/* Maghrib */}
                  <td className={`${beginsClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.maghrib.begins}</td>
                  <td className={` ${textClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.maghrib.jamaah}</td>

                  {/* Isha */}
                  <td className={`${beginsClass} ${cellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.isha.begins}</td>
                  <td className={` ${textClass} ${lastCellBorder} ${isFirstRow ? 'pb-3' : ''} ${baseWidth}`}>{row.isha.jamaah}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

export default function PrayerTimesSection({ activeTab }: { activeTab?: string }) {

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
    const updateCountdown = () => {
      setCountdown(calculateCountdown(NEXT_PRAYER.time));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  // Prayer times data (will be fetched from API in future)
  const prayerTimes = useMemo(() => MOCK_PRAYER_TIMES, []);
  const jumuahTimes = useMemo(() => MOCK_JUMUAH_TIMES, []);
  const dateInfo = useMemo(() => MOCK_DATE_INFO, []);

  return (
    <section className="w-full section-padding py-8">

      {/* Main Content Area */}
      {activeTab === 'prayer-time' ? (
        <div className="flex flex-col xl:flex-row gap-0 xl:gap-12 mb-8 xl:mb-16">
          {/* Left side - Image with countdown */}
          <div className="h-[420px] xl:h-[609px] w-full xl:max-w-[544px] relative overflow-hidden rounded-t-[12px] rounded-b-none xl:rounded-[12px]">
            <Image
              src="/assets/prayer-times/mosque-bg.png"
              alt="Mosque background"
              fill
              className="object-cover xl:min-w-[544px] xl:min-h-[609px]"
              priority
              // sizes="(max-width: 768px) 100vw, 500px"
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/40 pointer-events-none xl:min-w-[544px] xl:min-h-[609px]" />

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
          <div className="bg-white rounded-b-[12px] rounded-t-none xl:rounded-[12px] shadow-[0px_25px_50px_-12px_#00000040] p-4 xl:px-6 xl:py-8 w-full xl:max-w-[544px] xl:max-h-[609px] border border-[#F4F4F5] border-t-0 xl:border-t">
            <div className="flex flex-col gap-2">
              <h2 className="sr-only">Prayer Times</h2>

              {/* Daily Prayer Times */}
              {prayerTimes.map((prayer) => (
                <PrayerTimeRow key={prayer.name} prayer={prayer} />
              ))}

              {/* Jumuah Times */}
              <div className="mt-4 flex flex-col gap-2">
                {jumuahTimes.map((jumuah) => (
                  <JumuahTimeRow key={jumuah.name} jumuah={jumuah} />
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <PrayerTimesCalendar />
      )}
    </section>
  );
}
