"use client";

import Countdown from "react-countdown";
import { useMemo } from "react";
import Separator from "../common/Separator";

interface ServiceEventBannerProps {
  /**
   * Title of the event
   */
  title: string;

  /**
   * Description text
   */
  description: string;

  /**
   * Update label (e.g., "Update")
   */
  updateLabel?: string;

  /**
   * Update date (e.g., "8 February 2025")
   */
  updateDate?: string;

  /**
   * Countdown label (e.g., "Next Taraweeh Prayer in")
   */
  countdownLabel: string;

  /**
   * Target date for countdown (ISO string or Date)
   * If the time has passed today, it will automatically calculate for tomorrow
   */
  targetDate: Date | string;

  /**
   * Optional custom class name
   */
  className?: string;

  /**
   * If true, automatically calculates next occurrence if time has passed
   * @default true
   */
  autoCalculateNext?: boolean;
}

export default function ServiceEventBanner({
  title,
  description,
  updateLabel = "Update",
  updateDate,
  countdownLabel,
  targetDate,
  className = "",
  autoCalculateNext = true,
}: ServiceEventBannerProps) {
  // Calculate the next occurrence of the target time
  const nextOccurrence = useMemo(() => {
    const target = new Date(targetDate);
    const now = new Date();

    if (!autoCalculateNext) {
      return target;
    }

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
  }, [targetDate, autoCalculateNext]);
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
    if (completed) {
      return (
        <div className="flex items-center">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
              00
            </div>
            <div className="text-xs sm:text-sm text-[#99C7FB] mt-1 bg-[#00000033] px-3.5 py-0.75 rounded-lg">Hours</div>
          </div>
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
            :
          </span>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
              00
            </div>
            <div className="text-xs sm:text-sm text-[#99C7FB] mt-1 bg-[#00000033] px-3.5 py-0.75 rounded-lg">Minutes</div>
          </div>5
          <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
            :
          </span>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white">
              00
            </div>
            <div className="text-xs sm:text-sm text-[#99C7FB] mt-1 bg-[#00000033] px-3.5 py-0.75 rounded-lg">Seconds</div>
          </div>
        </div>
      );
    }

    // Calculate total hours including days
    const totalHours = days * 24 + hours;

    return (
      <div className="flex">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
            {String(totalHours).padStart(2, "0")}
          </div>
          <div className="text-xs sm:text-sm text-[#99C7FB] mt-1 bg-[#00000033] px-3.5 py-0.75 rounded-lg">Hours</div>
        </div>
        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
          :
        </span>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
            {String(minutes).padStart(2, "0")}
          </div>
          <div className="text-xs sm:text-sm text-[#99C7FB] mt-1 bg-[#00000033] px-3.5 py-0.75 rounded-lg">Minutes</div>
        </div>
        <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
          :
        </span>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-white">
            {String(seconds).padStart(2, "0")}
          </div>
          <div className="text-xs sm:text-sm text-[#99C7FB] mt-1 bg-[#00000033] px-3.5 py-0.75 rounded-lg">Seconds</div>
        </div>
      </div>
    );
  };

  return (
    <div
      className={`relative w-full py-6 sm:py-8 md:py-10 overflow-hidden ${className}`}
    >
      {/* Background with gradient and pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(170.61deg, rgb(12, 71, 138) 46.629%, rgb(0, 71, 151) 71.1%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30 bg-repeat"
          style={{
            backgroundImage: "url('/assets/services/bg-pattern.png')",
            backgroundSize: "154px 154px",
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative hn-container px-6 sm:!px-18">
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 xl:gap-0">
          {/* Left Section - Title and Description */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 items-start md:items-center w-full xl:w-auto">
            <div className="w-full md:max-w-[495px] xl:min-w-[495px]">
              <div className="flex items-center gap-3 mb-3 sm:mb-4">
                {/* Update Badge */}
                {updateDate && (
                  <>
                    <div className="flex items-center gap-1 bg-white px-3 py-1">
                      <div className="w-1.5 h-1.5 bg-black rounded-full"></div>
                      <span className="text-xs sm:text-sm text-black">
                        {updateLabel}
                      </span>
                    </div>
                    <span className="text-xs sm:text-sm text-white">
                      {updateDate}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl md:text-2xl lg:text-2xl font-semibold text-white mb-2 sm:mb-3">
                {title}
              </h2>

              {/* Description */}
            </div>
            <p className="text-sm sm:text-base md:text-lg text-white w-full md:max-w-[315px]">
              {description}
            </p>
          </div>
          
          {/* Separator - Only visible on XL screens */}
          <div className="hidden xl:flex xl:self-stretch px-[34px]">
            <Separator orientation="vertical" className="w-px h-full" color="#FFFFFF26" thickness={1} />
          </div>

          {/* Right Section - Countdown Timer */}
          <div className="w-full md:w-auto xl:max-w-[232.5px] xl:w-[232.5px]">
            <p className="text-sm text-start sm:text-base text-white font-semibold mb-3 sm:mb-4">
              {countdownLabel}
            </p>
            <Countdown date={nextOccurrence} renderer={renderer} />
          </div>
        </div>
      </div>
    </div>
  );
}
