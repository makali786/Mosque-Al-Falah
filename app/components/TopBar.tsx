"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { TbCompass } from "react-icons/tb";

export default function TopBar() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="bg-white w-full relative">
      {/* Mobile Layout - Single Row */}
      <div className="lg:hidden hidden items-center justify-between gap-3 px-4 py-2 overflow-x-auto scrollbar-hide">
        {/* Left: Dates - Fixed */}
        <div className="flex flex-col gap-1 shrink-0">
          <div className="flex items-center gap-1 text-[10px] text-gray-600 whitespace-nowrap">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
              <rect width="12" height="12" rx="2" fill="#F4F4F5"/>
            </svg>
            <span>04 February 2025</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-600 whitespace-nowrap">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="shrink-0">
              <rect width="12" height="12" rx="2" fill="#F4F4F5"/>
            </svg>
            <span>5 Sha'baan</span>
          </div>
        </div>

        {/* Right: Prayer Times - Scrollable */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
          <div className="flex flex-col items-center px-2.5 py-1 bg-gray-50 rounded shrink-0 min-w-[50px]">
            <span className="font-semibold text-[10px] text-black">Fajr</span>
            <span className="text-[10px] text-gray-600">5:53</span>
          </div>
          <div className="flex flex-col items-center px-2.5 py-1 bg-[#005bc4] rounded shrink-0 min-w-[50px]">
            <span className="font-semibold text-[10px] text-white">Dhur</span>
            <span className="text-[10px] text-white">12:19</span>
          </div>
          <div className="flex flex-col items-center px-2.5 py-1 bg-gray-50 rounded shrink-0 min-w-[50px]">
            <span className="font-semibold text-[10px] text-black">Asr</span>
            <span className="text-[10px] text-gray-600">12:19</span>
          </div>
          <div className="flex flex-col items-center px-2.5 py-1 bg-gray-50 rounded shrink-0 min-w-[50px]">
            <span className="font-semibold text-[10px] text-black">Maghrib</span>
            <span className="text-[10px] text-gray-600">3:6</span>
          </div>
          <div className="flex flex-col items-center px-2.5 py-1 bg-gray-50 rounded shrink-0 min-w-[50px]">
            <span className="font-semibold text-[10px] text-black">Ishā</span>
            <span className="text-[10px] text-gray-600">6:33</span>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex items-center justify-between px-30 py-3 w-full">
      {/* Left Section - Date & Location Info */}
      <div className="flex gap-4 items-center relative shrink-0">
        {/* Date 1 */}
        <div className="flex gap-1 items-center relative shrink-0">
          <div className="relative shrink-0 w-4 h-4">
            <Image src="/assets/topbar/calendar-icon.svg" alt="" width={16} height={16} />
          </div>
          <div className="flex flex-col justify-center leading-0 relative shrink-0">
            <p className="font-normal text-sm leading-5 text-[#52525b] whitespace-nowrap">04 February 2025</p>
          </div>
        </div>

        {/* Date 2 */}
        <div className="flex gap-1 items-center relative shrink-0">
          <div className="relative shrink-0 w-4 h-4">
            <Image src="/assets/topbar/calendar-icon.svg" alt="" width={16} height={16} />
          </div>
          <div className="flex flex-col justify-center leading-0 relative shrink-0">
            <p className="font-normal text-sm leading-5 text-[#52525b] whitespace-nowrap">5 Sha'baan</p>
          </div>
        </div>

        {/* Qibla Finder */}
        <Link href="/qibla-finder" className="flex gap-1 items-center relative shrink-0">
          <div className="relative shrink-0 w-4 h-4">
            <Image src="/assets/topbar/compass-icon.svg" alt="" width={16} height={16} />
          </div>
          <div className="flex flex-col justify-center leading-0 relative shrink-0">
            <p className="font-normal text-sm leading-5 text-[#52525b] whitespace-nowrap">Qibla Finder</p>
          </div>
        </Link>

        {/* Mosque Finder */}
        <Link href="/mosque-finder" className="flex gap-1 items-center relative shrink-0">
          <div className="relative shrink-0 w-4 h-4">
            <Image src="/assets/topbar/gps-icon.svg" alt="" width={16} height={16} />
          </div>
          <div className="flex flex-col justify-center leading-0 relative shrink-0">
            <p className="font-normal text-sm leading-5 text-[#52525b] whitespace-nowrap">Mosque Finder</p>
          </div>
        </Link>
      </div>

      {/* Middle Section - Social Media & Profile */}
      <div className="flex gap-3.5 items-center justify-end relative shrink-0">
        {/* Facebook */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#e6f1fe] flex items-center p-2 relative rounded-full shrink-0"
          aria-label="Facebook"
        >
          <div className="relative shrink-0 w-4 h-4">
            <Image src="/assets/common/facebook-icon.svg" alt="Facebook" width={16} height={16} />
          </div>
        </a>

        {/* YouTube */}
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#e6f1fe] flex items-center p-2 relative rounded-full shrink-0"
          aria-label="YouTube"
        >
          <div className="relative shrink-0 w-4 h-4">
            <Image src="/assets/common/youtube-icon.svg" alt="YouTube" width={16} height={16} />
          </div>
        </a>

        {/* Instagram */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#e6f1fe] flex items-center p-2 relative rounded-full shrink-0"
          aria-label="Instagram"
        >
          <div className="relative shrink-0 w-4 h-4">
            <Image src="/assets/common/instagram-icon.svg" alt="Instagram" width={16} height={16} />
          </div>
        </a>

        {/* Profile Logo */}
        <div className="bg-[#7c3aed] flex items-center justify-center relative rounded-md shrink-0 w-7 h-7">
          <TbCompass className="text-white text-xl" />
        </div>
      </div>

      {/* Right Section - Prayer Times & Calendar */}
      <div className="flex gap-4 items-center relative shrink-0">
        <div className="flex gap-1.75 items-center relative shrink-0">
          {/* Fajr */}
          <div className="flex gap-3 items-start justify-center leading-0 px-2 py-1 relative shrink-0 text-sm text-black text-center whitespace-nowrap">
            <div className="flex flex-col justify-center relative shrink-0">
              <p className="font-semibold leading-5 whitespace-nowrap">Fajr</p>
            </div>
            <div className="flex flex-col justify-center relative shrink-0">
              <p className="font-normal leading-5 whitespace-nowrap">5:53</p>
            </div>
          </div>

          {/* Dhur - Active */}
          <div className="bg-[#005BC4] flex gap-3 items-start leading-0 px-2 py-1 relative rounded-lg shrink-0 text-sm text-white text-center whitespace-nowrap">
            <div className="flex flex-col justify-center relative shrink-0">
              <p className="font-semibold leading-5 whitespace-nowrap">Dhur</p>
            </div>
            <div className="flex flex-col justify-center relative shrink-0">
              <p className="font-normal leading-5 whitespace-nowrap">12:19</p>
            </div>
          </div>

          {/* Asr */}
          <div className="flex gap-3 items-start justify-center leading-0 px-2 py-1 relative shrink-0 text-sm text-black text-center whitespace-nowrap">
            <div className="flex flex-col justify-center relative shrink-0">
              <p className="font-semibold leading-5 whitespace-nowrap">Asr</p>
            </div>
            <div className="flex flex-col justify-center relative shrink-0">
              <p className="font-normal leading-5 whitespace-nowrap">12:19</p>
            </div>
          </div>

          {/* Maghrib */}
          <div className="flex gap-3 items-start justify-center leading-0 px-2 py-1 relative shrink-0 text-sm text-black text-center whitespace-nowrap">
            <div className="flex flex-col justify-center relative shrink-0">
              <p className="font-semibold leading-5 whitespace-nowrap">Maghrib</p>
            </div>
            <div className="flex flex-col justify-center relative shrink-0">
              <p className="font-normal leading-5 whitespace-nowrap">3:6</p>
            </div>
          </div>

          {/* Ishā */}
          <div className="flex gap-3 items-start justify-center leading-0 px-2 py-1 relative shrink-0 text-sm text-black text-center whitespace-nowrap">
            <div className="flex flex-col justify-center relative shrink-0">
              <p className="font-semibold leading-5 whitespace-nowrap">Ishā</p>
            </div>
            <div className="flex flex-col justify-center relative shrink-0">
              <p className="font-normal leading-5 whitespace-nowrap">6:33</p>
            </div>
          </div>
        </div>

        {/* Calendar Button */}
        <button
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          className="bg-[#f4f4f5] flex gap-2.5 items-center px-2 py-1 relative rounded-full shrink-0"
        >
          <div className="flex flex-col justify-center leading-0 relative shrink-0">
            <p className="font-normal text-xs leading-3.5 text-[#005bc4] text-center whitespace-nowrap">Calendar</p>
          </div>
          <div className="relative shrink-0 w-3.5 h-3.5">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="#11181c"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
    </div>
  );
}
