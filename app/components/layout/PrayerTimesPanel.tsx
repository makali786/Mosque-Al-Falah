"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";

interface PrayerTimesPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PrayerTimesPanel({
  isOpen,
  onClose,
}: PrayerTimesPanelProps) {
  const [countdown, setCountdown] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();

      // Target time: Isha at 7:13 PM (19:13)
      const target = new Date();
      target.setHours(19, 13, 0, 0);

      // If target time has passed today, set it for tomorrow
      if (now > target) {
        target.setDate(target.getDate() + 1);
      }

      const diff = target.getTime() - now.getTime();

      if (diff <= 0) {
        setCountdown({ hours: "00", minutes: "00", seconds: "00" });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setCountdown({
        hours: hours.toString().padStart(2, "0"),
        minutes: minutes.toString().padStart(2, "0"),
        seconds: seconds.toString().padStart(2, "0"),
      });
    };

    // Calculate immediately
    calculateCountdown();

    // Update every second
    const interval = setInterval(calculateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel - Centered Modal */}
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 z-50 transform transition-transform duration-500 ease-in-out ${
          isOpen ? "-translate-y-1/2" : "translate-y-[150%]"
        }`}
        style={{ maxWidth: "1200px", width: "calc(100% - 48px)" }}
      >
        <div className="bg-white flex gap-6 items-start overflow-hidden relative rounded-3xl shadow-[0px_20px_25px_-5px_rgba(0,0,0,0.1),0px_8px_10px_-6px_rgba(0,0,0,0.1)]">
          {/* Left side - Image with countdown */}
          <div className="flex-1 min-w-0 relative self-stretch min-h-150 bg-[#1a2332] overflow-hidden">
            {/* Background Image */}
            <Image
              src="/assets/prayer-times/mosque-bg.png"
              alt=""
              fill
              className="object-cover"
              priority
              sizes="50vw"
            />

            {/* Overlay gradient for better text readability */}
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

            {/* Date Navigation */}
            <div className="absolute top-31.75 left-1/2 -translate-x-1/2 flex items-center justify-between w-81.5 z-10">
              <button className="w-8 h-8 shrink-0 flex items-center justify-center text-white hover:text-[#006fee] transition-colors">
                <IoChevronBack className="w-6 h-6" />
              </button>

              <div className="flex flex-col gap-1 items-center text-center w-42.5">
                <p className="text-sm font-semibold text-[#fafafa] leading-5 w-full">
                  Monday, 3rd March 2025
                </p>
                <p className="text-xs font-medium text-[#006fee] leading-4 w-full">
                  Ramadan 3, 1446 AH
                </p>
              </div>

              <button className="w-8 h-8 shrink-0 flex items-center justify-center text-white hover:text-[#006fee] transition-colors">
                <IoChevronForward className="w-6 h-6" />
              </button>
            </div>

            {/* Countdown Timer */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-93.5 backdrop-blur-[6.65px] bg-[#18181b]/80 flex flex-col gap-0 items-center p-6 rounded-[14px] z-10"
              style={{ backdropFilter: "blur(6.65px)" }}
            >
              <div className="flex flex-col gap-2 items-center">
                {/* Timer Title */}
                <div className="flex gap-2 items-center text-lg text-[#fafafa] text-center leading-7">
                  <p className="font-normal">The Athan of</p>
                  <p className="font-semibold">ISHA</p>
                  <p className="font-normal">is in</p>
                </div>

                {/* Countdown Display */}
                <div className="flex flex-col gap-1 items-start">
                  <div className="flex items-center text-5xl font-semibold text-[#fafafa] w-full leading-12">
                    <div className="flex justify-center text-center w-17">
                      <p>{countdown.hours}</p>
                    </div>
                    <div className="flex justify-center text-center">
                      <p>:</p>
                    </div>
                    <div className="flex justify-center text-center w-17">
                      <p>{countdown.minutes}</p>
                    </div>
                    <div className="flex justify-center text-center">
                      <p>:</p>
                    </div>
                    <div className="flex justify-center text-center w-17">
                      <p>{countdown.seconds}</p>
                    </div>
                  </div>

                  {/* Labels */}
                  <div className="flex gap-3.5 items-center w-full">
                    <div className="bg-[#27272a] h-6.25 rounded-lg overflow-hidden shrink-0 w-17 flex items-center justify-center">
                      <p className="text-sm font-normal text-[#a1a1aa] leading-5">
                        Hours
                      </p>
                    </div>
                    <div className="bg-[#27272a] h-6.25 rounded-lg overflow-hidden shrink-0 w-17 flex items-center justify-center">
                      <p className="text-sm font-normal text-[#a1a1aa] leading-5">
                        Minutes
                      </p>
                    </div>
                    <div className="bg-[#27272a] h-6.25 rounded-lg overflow-hidden shrink-0 w-17 flex items-center justify-center">
                      <p className="text-sm font-normal text-[#a1a1aa] leading-5">
                        Seconds
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Prayer Times List */}
          <div className="flex-1 min-w-0 bg-white border border-[#f4f4f5] flex flex-col gap-0 items-center overflow-hidden pl-6 pr-28 py-8 rounded-xl shrink-0 self-stretch">
            <div className="flex flex-col gap-5 items-start w-full">
              {/* Fajr */}
              <div className="bg-[#fafafa] flex items-center justify-between overflow-hidden px-4 py-3.5 rounded-lg w-full">
                <p className="text-base font-bold text-black leading-6 w-24">
                  Fajr
                </p>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Begins
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    5:01
                  </p>
                </div>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Jama'ah
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    5:01
                  </p>
                </div>
              </div>

              {/* Sunrise */}
              <div className="bg-[#fafafa] flex items-center justify-between overflow-hidden px-4 py-3.5 rounded-lg w-full">
                <p className="text-base font-bold text-black leading-6 w-24">
                  Sunrise
                </p>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Begins
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    6:38
                  </p>
                </div>
                <div className="flex gap-1 items-center opacity-0 text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Jama'ah
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    5:01
                  </p>
                </div>
              </div>

              {/* Zuhr */}
              <div className="bg-[#fafafa] flex items-center justify-between overflow-hidden px-4 py-3.5 rounded-lg w-full">
                <p className="text-base font-bold text-black leading-6 w-24">
                  Zuhr
                </p>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Begins
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    12:18
                  </p>
                </div>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Jama'ah
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    12:45
                  </p>
                </div>
              </div>

              {/* Asr */}
              <div className="bg-[#fafafa] flex items-center justify-between overflow-hidden px-4 py-3.5 rounded-lg w-full">
                <p className="text-base font-bold text-black leading-6 w-24">
                  'Asr
                </p>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Begins
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    3:52
                  </p>
                </div>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Jama'ah
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    4:15
                  </p>
                </div>
              </div>

              {/* Maghrib */}
              <div className="bg-[#fafafa] flex items-center justify-between overflow-hidden px-4 py-3.5 rounded-lg w-full">
                <p className="text-base font-bold text-black leading-6 w-24">
                  Maghrib
                </p>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Begins
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    5:48
                  </p>
                </div>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Jama'ah
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    6:03
                  </p>
                </div>
              </div>

              {/* Isha - Active */}
              <div className="bg-[#27272a] border border-[#27272a] flex items-center justify-between overflow-hidden px-4 py-3.5 rounded-lg w-full">
                <p className="text-base font-bold text-white leading-6 w-24">
                  'Isha
                </p>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#a1a1aa] leading-4">
                    Begins
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    7:13
                  </p>
                </div>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#a1a1aa] leading-4">
                    Jama'ah
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    8:00
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="bg-[rgba(17,17,17,0.15)] h-px w-full" />

              {/* Jumua'ah 1 */}
              <div className="bg-[#fafafa] flex items-center justify-between overflow-hidden px-4 py-3.5 rounded-lg w-full">
                <p className="text-base font-bold text-black leading-6 w-24">
                  Jumua'ah 1
                </p>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Khutbah
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    12:25
                  </p>
                </div>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Jama'ah
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    1:00
                  </p>
                </div>
              </div>

              {/* Jumua'ah 2 */}
              <div className="bg-[#fafafa] flex items-center justify-between overflow-hidden px-4 py-3.5 rounded-lg w-full">
                <p className="text-base font-bold text-black leading-6 w-24">
                  Jumua'ah 2
                </p>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Khutbah
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    12:45
                  </p>
                </div>
                <div className="flex gap-1 items-center text-nowrap w-24">
                  <p className="text-xs font-normal text-[#71717a] leading-4">
                    Jama'ah
                  </p>
                  <p className="text-base font-bold text-[#006fee] leading-6">
                    1:15
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 bg-[#f4f4f5] flex items-center justify-center p-0 rounded-full shrink-0 w-12 h-12 cursor-pointer hover:bg-[#e4e4e7] transition-colors"
          >
            <div className="w-5 h-5 relative">
              <Image
                src="/assets/prayer-times/close-icon.svg"
                alt="Close"
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
