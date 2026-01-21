"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { addMinutesToTime } from "@lib/prayer-times-helpers";
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

interface CalendarDay {
  day: string;
  date: number;
  islamicDate: number;
  hijriMonthName?: string;
  hijriYear?: string;
  subhaSadiq: string;
  sunRise: string;
  fajr: { begins: string; jamaah: string };
  zuhr: {
    begins: string;
    jamaah: string;
    isJumuah?: boolean;
    jumuahTime?: string | null;
  };
  asr: { begins: string; jamaah: string };
  maghrib: { begins: string; jamaah: string };
  isha: { begins: string; jamaah: string };
  isFriday?: boolean;
  isActive?: boolean;
}

interface PrayerTimesSectionProps {
  activeTab?: string;
  prayerTimes?: any[];
  settings?: any;
  onYearChange?: (year: number) => void;
}

// ============================================================================
// Prayer Times Calendar Component
// ============================================================================

interface PrayerTimesCalendarProps {
  prayerTimes: any[];
  settings?: any;
}

const PrayerTimesCalendar = ({
  prayerTimes,
  settings,
  onYearChange,
}: PrayerTimesCalendarProps & { onYearChange?: (year: number) => void }) => {
  const [calendarDate, setCalendarDate] = useState(new Date());

  // Notify parent when year changes
  useEffect(() => {
    onYearChange?.(calendarDate.getFullYear());
  }, [calendarDate, onYearChange]);

  const handlePreviousMonth = () => {
    setCalendarDate((prev) => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCalendarDate((prev) => {
      const newDate = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return newDate;
    });
  };

  // Transform prayer times data for calendar display
  const calendarData = useMemo(() => {
    if (!prayerTimes || prayerTimes.length === 0) return [];

    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    // Filter prayer times for the selected month
    const filteredPrayerTimes = prayerTimes.filter((pt: any) => {
      const ptDate = new Date(pt.date);
      return (
        ptDate.getMonth() === calendarDate.getMonth() &&
        ptDate.getFullYear() === calendarDate.getFullYear()
      );
    });

    return filteredPrayerTimes.map((pt: any) => {
      const date = new Date(pt.date);
      const dayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
      const isFriday = date.getDay() === 5;
      const isToday = pt.date.split("T")[0] === todayStr;

      // Parse hijri date "1 12 1441446" -> day: 1, month: 12, year: 1441446
      const hijriParts = pt.hijriDate
        ? pt.hijriDate.trim().split(" ")
        : ["1", "1", "1446"];
      const islamicDate = parseInt(hijriParts[0]) || 1;
      const islamicMonth = parseInt(hijriParts[1]) || 1;
      const islamicYear = hijriParts[2] || "1446";

      // Get hijri month name
      const hijriMonths = [
        "Muharram",
        "Safar",
        "Rabi-al-Awwal",
        "Rabi-al-Thani",
        "Jamadi-al-Awwal",
        "Jamadi-al-Thani",
        "Rajab",
        "Shaban",
        "Ramadan",
        "Shawwal",
        "Dhul-Qadah",
        "Dhul-Hijjah",
      ];
      const hijriMonthName = hijriMonths[islamicMonth - 1] || "";

      // Get Jumu'ah time from settings
      const jumuahTime = settings?.jumuahSettings?.iqamahTime || null;

      return {
        day: dayNames[date.getDay()],
        date: date.getDate(),
        islamicDate,
        hijriMonthName,
        hijriYear: islamicYear,
        subhaSadiq: pt.fajr,
        sunRise: pt.sunrise,
        fajr: {
          begins: pt.fajr,
          jamaah: addMinutesToTime(pt.fajr, pt.fajrIqamahDelay),
        },
        zuhr: {
          begins: pt.dhuhr,
          jamaah: addMinutesToTime(pt.dhuhr, pt.dhuhrIqamahDelay),
          isJumuah: pt.isJumuah || isFriday,
          jumuahTime: pt.isJumuah || isFriday ? jumuahTime : null,
        },
        asr: {
          begins: pt.asr,
          jamaah: addMinutesToTime(pt.asr, pt.asrIqamahDelay),
        },
        maghrib: {
          begins: pt.maghrib,
          jamaah: addMinutesToTime(pt.maghrib, pt.maghribIqamahDelay),
        },
        isha: {
          begins: pt.isha,
          jamaah: addMinutesToTime(pt.isha, pt.ishaIqamahDelay),
        },
        isFriday,
        isActive: isToday,
      };
    });
  }, [prayerTimes, calendarDate, settings]);

  // Format month display
  const monthDisplay = useMemo(() => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[calendarDate.getMonth()]} ${calendarDate.getFullYear()}`;
  }, [calendarDate]);

  return (
    <div className="w-full bg-white rounded-[14px]">
      {/* Header / Month Navigation */}
      <div className="flex items-center justify-between bg-[#F4F4F5] rounded-lg px-4 py-3 mb-8 max-w-[540px] mx-auto">
        <button
          onClick={handlePreviousMonth}
          className="w-8 h-8 flex items-center justify-center text-[#71717A] hover:text-black transition-colors"
        >
          <IoChevronBack className="w-5 h-5 cursor-pointer" />
        </button>
        <div className="text-center">
          <h3 className="text-sm font-semibold text-black mb-2">
            {monthDisplay}
          </h3>
          <p className="text-xs font-medium text-[#006FEE]">
            Jamada-Al-Thani, 1447 -Rajab, 1447
          </p>
        </div>
        <button
          onClick={handleNextMonth}
          className="w-8 h-8 flex items-center justify-center text-[#71717A] hover:text-black transition-colors"
        >
          <IoChevronForward className="w-5 h-5 cursor-pointer" />
        </button>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto rounded-[14px] border border-[#E4E4E7]">
        <table className="w-full text-center border-collapse">
          <thead>
            {/* Top Header Row */}
            <tr className="bg-[#001731] text-white text-sm font-normal">
              <th
                rowSpan={2}
                className="p-3 align-bottom font-normal w-16 border-r border-[#002E62] xl:h-18"
              >
                Day
              </th>
              <th
                rowSpan={2}
                className="px-2 py-3 align-bottom font-normal w-16 border-r border-[#002E62] xl:h-18"
              >
                Date
              </th>
              <th
                rowSpan={2}
                className="px-2 py-3 font-normal w-24 leading-tight border-r border-[#002E62] xl:h-18"
              >
                Islamic Date
              </th>
              <th
                rowSpan={2}
                className="px-2 py-3 font-normal w-20 leading-tight border-r border-[#002E62] xl:h-18"
              >
                Subha Sadiq
              </th>
              <th
                rowSpan={2}
                className="px-2 py-3 font-normal w-20 leading-tight border-r border-[#002E62] xl:h-18"
              >
                Sun Rise
              </th>

              <th
                colSpan={2}
                className="px-3 py-2 border-b border-[#1F2937] border-r border-[#002E62] xl:h-5"
              >
                Fajr
              </th>
              <th
                colSpan={2}
                className="px-3 py-2 border-b border-[#1F2937] border-r border-[#002E62] xl:h-5"
              >
                Zuhr
              </th>
              <th
                colSpan={2}
                className="px-3 py-2 border-b border-[#1F2937] border-r border-[#002E62] xl:h-5"
              >
                'Asr
              </th>
              <th
                colSpan={2}
                className="px-3 py-2 border-b border-[#1F2937] border-r border-[#002E62] xl:h-5"
              >
                Maghrib
              </th>
              <th
                colSpan={2}
                className="px-3 py-2 border-b border-[#1F2937] border-r border-[#002E62] xl:h-5"
              >
                Isha
              </th>
            </tr>
            {/* Sub Header Row */}
            <tr className="bg-[#001731] text-[#FFFFFF] text-sm h-10">
              {/* Fajr */}
              <th className="px-4 py-2.5 font-normal border-r border-[#002E62]">
                Begins
              </th>
              <th className="px-4 py-2.5 font-normal text-white border-r border-[#002E62]">
                Jama&apos;ah
              </th>
              {/* Zuhr */}
              <th className="px-4 py-2.5 font-normal border-r border-[#002E62]">
                Begins
              </th>
              <th className="px-4 py-2.5 font-normal text-white border-r border-[#002E62]">
                Jama&apos;ah
              </th>
              {/* Asr */}
              <th className="px-4 py-2.5 font-normal border-r border-[#002E62]">
                Begins
              </th>
              <th className="px-4 py-2.5 font-normal text-white border-r border-[#002E62]">
                Jama&apos;ah
              </th>
              {/* Maghrib */}
              <th className="px-4 py-2.5 font-normal border-r border-[#002E62]">
                Begins
              </th>
              <th className="px-4 py-2.5 font-normal text-white border-r border-[#002E62]">
                Jama&apos;ah
              </th>
              {/* Isha */}
              <th className="px-4 py-2.5 font-normal border-r border-[#002E62]">
                Begins
              </th>
              <th className="px-4 py-2.5 font-normal text-white border-r border-[#002E62]">
                Jama&apos;ah
              </th>
            </tr>
          </thead>
          <tbody>
            {calendarData.map((row, index) => {
              // Row styling logic
              const isFirstRow = index === 0;
              const rowHeight = isFirstRow ? "h-[76px]" : "h-[46px]";
              const baseWidth = "!min-w-[70px]";

              let rowBaseClass = `border-b text-sm ${rowHeight} ${
                isFirstRow ? "align-bottom" : ""
              }`;
              // Zebra striping: alternate background colors for standard rows
              let rowColors =
                index % 2 !== 0
                  ? "bg-[#FAFAFA] border-[#F4F4F5]"
                  : "bg-white border-[#F4F4F5]";
              let cellBorder =
                "border-x border-solid border-[var(--colors-layout-foreground-100,#F4F4F5)]";
              let lastCellBorder =
                "border-x border-solid border-[var(--colors-layout-foreground-100,#F4F4F5)]";

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
                  <td
                    className={`${textClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.day}
                  </td>
                  <td
                    className={`${textClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.date}
                  </td>
                  <td
                    className={`${islamicDateClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {isFirstRow && row.hijriMonthName && (
                      <span className="block text-[8px] text-[#006FEE] leading-tight mb-2.5">
                        {row.hijriMonthName}
                      </span>
                    )}
                    {row.islamicDate}
                  </td>
                  <td
                    className={`${textClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.subhaSadiq}
                  </td>
                  <td
                    className={`${textClass} border-x border-solid border-[var(--colors-layout-foreground-100,#F4F4F5)] ${
                      isFirstRow ? "pb-3" : ""
                    } ${
                      row.isActive
                        ? "border-white/20"
                        : row.isFriday
                        ? "border-[#DBEAFE]"
                        : ""
                    } ${baseWidth}`}
                  >
                    {row.sunRise}
                  </td>

                  {/* Fajr */}
                  <td
                    className={`${beginsClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.fajr.begins}
                  </td>
                  <td
                    className={` ${textClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.fajr.jamaah}
                  </td>

                  {/* Zuhr */}
                  <td
                    className={`${beginsClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.zuhr.begins}
                  </td>
                  <td
                    className={` ${textClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.zuhr.isJumuah ? (
                      <div className="flex flex-col items-center gap-0.5">
                        <span className="font-medium text-xs!">
                          Jumu&apos;ah
                        </span>
                        {row.zuhr.jumuahTime && (
                          <span className="text-[11px] font-normal opacity-90">
                            {row.zuhr.jumuahTime}
                          </span>
                        )}
                      </div>
                    ) : (
                      row.zuhr.jamaah
                    )}
                  </td>

                  {/* Asr */}
                  <td
                    className={`${beginsClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.asr.begins}
                  </td>
                  <td
                    className={` ${textClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.asr.jamaah}
                  </td>

                  {/* Maghrib */}
                  <td
                    className={`${beginsClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.maghrib.begins}
                  </td>
                  <td
                    className={` ${textClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.maghrib.jamaah}
                  </td>

                  {/* Isha */}
                  <td
                    className={`${beginsClass} ${cellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.isha.begins}
                  </td>
                  <td
                    className={` ${textClass} ${lastCellBorder} ${
                      isFirstRow ? "pb-3" : ""
                    } ${baseWidth}`}
                  >
                    {row.isha.jamaah}
                  </td>
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

export default function PrayerTimesSection({
  activeTab,
  prayerTimes: initialPrayerTimes = [],
  settings,
  onYearChange,
}: PrayerTimesSectionProps) {
  // Use custom hooks
  const { currentDate, handlePreviousDay, handleNextDay } =
    usePrayerTimesNavigation({ resetOnMount: false });

  // Get prayer times data
  const { prayerTimes, dateInfo, nextPrayer, isViewingToday } = usePrayerTimes({
    prayerTimes: initialPrayerTimes,
    settings,
    currentDate,
  });

  // Countdown timer - only count down when viewing today
  const countdown = useCountdown({
    targetTime: nextPrayer.time,
    isActive: isViewingToday,
  });

 useEffect(() => {
    if (activeTab === "prayer-time") {
      onYearChange?.(currentDate.getFullYear());
    }
  }, [currentDate, activeTab, onYearChange]);

  return (
    <section className="w-full section-padding py-8">
      {/* Main Content Area */}
      {activeTab === "prayer-time" ? (
        <div className="flex flex-col xl:flex-row gap-0 xl:gap-12 mb-8 xl:mb-16">
          {/* Left side - Image with countdown */}
          <div className="h-105 xl:h-152.25 w-full xl:max-w-136 relative overflow-hidden rounded-t-[12px] rounded-b-none xl:rounded-xl">
            <Image
              src="/assets/prayer-times/mosque-bg.png"
              alt="Mosque background"
              fill
              className="object-cover xl:min-w-136 xl:min-h-152.25"
              priority
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/40 pointer-events-none xl:min-w-136 xl:min-h-152.25" />

            {/* Date Navigation */}
            <DateNavigation
              dateInfo={dateInfo}
              onPrevious={handlePreviousDay}
              onNext={handleNextDay}
              variant="large"
            />

            {/* Countdown Timer */}
            <CountdownDisplay
              countdown={countdown}
              prayerName={nextPrayer.name}
              variant="large"
            />
          </div>

          {/* Right side - Prayer Times List */}
          <div className="bg-white rounded-b-[12px] rounded-t-none xl:rounded-[12px] shadow-[0px_25px_50px_-12px_#00000040] p-4 xl:px-6 xl:py-8 w-full xl:max-w-[544px] xl:max-h-[609px] border border-[#F4F4F5] border-t-0 xl:border-t">
            <div className="flex flex-col gap-2">
              <h2 className="sr-only">Prayer Times</h2>

              {/* Daily Prayer Times (includes Jumu'ah when applicable) */}
              {prayerTimes.map((prayer) =>
                prayer.isJumuah ? (
                  <JumuahTimeRow key={prayer.name} jumuah={prayer} />
                ) : (
                  <PrayerTimeRow key={prayer.name} prayer={prayer} />
                )
              )}
            </div>
          </div>
        </div>
      ) : (
        <PrayerTimesCalendar
          prayerTimes={initialPrayerTimes}
          settings={settings}
          onYearChange={onYearChange}
        />
      )}
    </section>
  );
}
