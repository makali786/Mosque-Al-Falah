"use client";

import Countdown from "react-countdown";
import { useMemo, useState, useEffect } from "react";

interface ServiceEventBannerProps {

  title: string;
  description: string;
  cardMessage?: string;
  countdownLabel: string;
  targetDate: Date | string;
  className?: string;
  updateLabel?: string;
  updateDate?: string;
}

export default function PrayerReminder({
  title,
  description,
  cardMessage = "The time for Taraweeh begins after the Isha prayer",
  countdownLabel,
  targetDate,
  className = "",
}: ServiceEventBannerProps) {
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate the next occurrence of the target time
  const nextOccurrence = useMemo(() => {
    const target = new Date(targetDate);
    const now = new Date();

    // If the target time has passed today, move to tomorrow
    if (target.getTime() <= now.getTime()) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(target.getHours());
      tomorrow.setMinutes(target.getMinutes());
      tomorrow.setSeconds(target.getSeconds());
      tomorrow.setMilliseconds(0);
      return tomorrow;
    }

    return target;
  }, [targetDate]);

  // Current date formatting
  const today = new Date();
  const dateString = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const timeString = "18:01";
  const hijriString = "الثلاثاء 5 شعبان 1446"; 

  // Countdown renderer
  const renderer = ({
    days,
    hours,
    minutes,
    seconds,
    completed,
  }: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    completed: boolean;
  }) => {
    const totalHours = days * 24 + hours;

    if (completed) {
      return (
        <div className="flex items-center">
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight">00</span>
            <span className="text-xs sm:text-sm  bg-[#00000033] px-2 py-1 rounded-lg mt-1">Hours</span>
          </div>
          <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-8">:</span>
          <div className="flex flex-col items-center">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-black tracking-tight">00</span>
            <span className="text-xs sm:text-sm  bg-[#00000033] px-2 py-1 rounded-lg mt-1">Minutes</span>
          </div>
          <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-8">:</span>
          <div className="flex flex-col items-center">
            <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tight">00</span>
            <span className="text-xs sm:text-sm  bg-[#00000033] px-2 py-1 rounded-lg mt-1">Seconds</span>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center">
        {/* Hours */}
        <div className="flex flex-col items-center">
          <span className="text-4xl sm:text-5xl md:text-5xl font-bold text-black tracking-tight">
            {String(totalHours).padStart(2, "0")}
          </span>
          <span className="text-xs sm:text-sm  bg-[#00000033] px-2 py-1 rounded-lg mt-1">
            Hours
          </span>
        </div>

        <span className="text-4xl sm:text-5xl md:text-5xl font-bold text-black mb-8">:</span>

        {/* Minutes */}
        <div className="flex flex-col items-center w-20 sm:w-24">
          <span className="text-4xl sm:text-5xl md:text-5xl font-bold text-black tracking-tight">
            {String(minutes).padStart(2, "0")}
          </span>
          <span className="text-xs sm:text-sm  bg-[#00000033] px-2 py-1 rounded-lg mt-1">
            Minutes
          </span>
        </div>

        <span className="text-4xl sm:text-5xl md:text-5xl font-bold text-black mb-8">:</span>

        {/* Seconds */}
        <div className="flex flex-col items-center w-20 sm:w-24">
          <span className="text-4xl sm:text-5xl md:text-5xl font-bold text-black tracking-tight">
            {String(seconds).padStart(2, "0")}
          </span>
          <span className="text-xs sm:text-sm  bg-[#00000033] px-2 py-1 rounded-lg mt-1">
            Seconds
          </span>
        </div>
      </div>
    );
  };

  return (
    <section className={`w-full bg-[#18181B] py-12 md:py-24 ${className}`}>
      <div className="section-padding">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">

          {/* Left Side: Card */}
          <div className="w-full lg:max-w-[583px]">
            <div className="bg-white rounded-2xl shadow-2xl relative overflow-hidden pb-12">
              {/* Header Info */}
              <div className="flex flex-wrap items-center justify-center text-xs sm:text-sm  mb-8 pb-4 bg-[#F4F4F5] py-4  gap-10">
                <span className="font-medium">{dateString}</span>
                <div className="flex gap-16">
                  <span className="font-medium">{timeString}</span>
                  <span className="font-medium font-arabic">{hijriString}</span>
                </div>
              </div>

              {/* Main Content */}
              <div className="text-center flex flex-col items-center space-y-8">
                <p className="text-gray-800 text-sm sm:text-base font-medium">
                  {cardMessage}
                </p>

                <div className="space-y-2">
                  <p className="font-medium text-sm sm:text-base">
                    {countdownLabel}
                  </p>

                  <div className="flex justify-center">
                    {mounted ? (
                      <Countdown date={nextOccurrence} renderer={renderer} />
                    ) : (
                      <div className="text-black">Loading...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Content & Form */}
          <div className="w-full lg:w-1/2 text-white">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8">
              {title}
            </h2>
            <p className="text-lg mb-[58px]">
              {description}
            </p>

            <form className="flex flex-col sm:flex-row w-full max-w-[503px]" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 bg-[#222222] border border-[#333333] text-white px-3 py-2 placeholder-white"
                required
              />
              <button
                type="submit"
                className="bg-[#333333] text-white px-4 py-3 font-medium transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}