"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PRAYER_TIMES = [
  { name: "Fajr", time: "5:53", active: false },
  { name: "Dhur", time: "12:19", active: true },
  { name: "Asr", time: "12:19", active: false },
  { name: "Maghrib", time: "3:6", active: false },
  { name: "Ishā", time: "6:33", active: false },
] as const;

const DATES = [{ label: "04 February 2025" }, { label: "5 Sha'baan" }] as const;

const SOCIAL_LINKS = [
  {
    name: "Facebook",
    icon: "/assets/common/facebook-icon.svg",
    url: "https://facebook.com",
  },
  {
    name: "YouTube",
    icon: "/assets/common/youtube-icon.svg",
    url: "https://youtube.com",
  },
  {
    name: "Instagram",
    icon: "/assets/common/instagram-icon.svg",
    url: "https://instagram.com",
  },
  // { name: "Qibla", icon: "/assets/common/qibla.png", url: "" },
] as const;

const NAVIGATION_LINKS = [
  {
    name: "Qibla Finder",
    icon: "/assets/topbar/compass-icon.svg",
    url: "/qibla-finder",
  },
  {
    name: "Mosque Finder",
    icon: "/assets/topbar/gps-icon.svg",
    url: "/mosque-finder",
  },
] as const;

interface DateItemProps {
  label: string;
  iconSize?: number;
  textClass?: string;
}

const DateItem = ({
  label,
  iconSize = 16,
  textClass = "text-xs xl:text-sm text-[#52525b]",
}: DateItemProps) => (
  <div className="flex gap-1 items-center shrink-0">
    <Image
      src="/assets/topbar/calendar-icon.svg"
      alt=""
      width={iconSize}
      height={iconSize}
      className="shrink-0"
    />
    <span className={`${textClass} whitespace-nowrap`}>{label}</span>
  </div>
);

interface SocialIconProps {
  name: string;
  icon: string;
  url: string;
  size?: "small" | "default";
}

const SocialIcon = ({ name, icon, url, size = "default" }: SocialIconProps) => {
  const padding = size === "small" ? "p-1.5" : "p-2";
  const imgSize = size === "small" ? 14 : 16;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`bg-[#e6f1fe] flex items-center justify-center rounded-full shrink-0 ${padding}`}
      aria-label={name}
    >
      <Image
        src={icon}
        alt={name}
        width={imgSize}
        height={imgSize}
        className="shrink-0"
      />
    </a>
  );
};

interface PrayerTimeProps {
  name: string;
  time: string;
  active: boolean;
  variant?: "mobile" | "tablet" | "desktop";
}

const PrayerTime = ({
  name,
  time,
  active,
  variant = "mobile",
}: PrayerTimeProps) => {
  const variants = {
    mobile: {
      container: active
        ? "flex flex-col items-center px-2.5 py-1 bg-[#005bc4] rounded"
        : "flex flex-col items-center",
      nameClass: `font-semibold text-[11px] ${
        active ? "text-white" : "text-black"
      }`,
      timeClass: `text-[11px] ${active ? "text-white" : "text-gray-600"}`,
    },
    tablet: {
      container: active
        ? "flex gap-1 items-center px-2 py-1 bg-[#005BC4] rounded-lg text-xs text-white"
        : "flex gap-1 items-center px-2 py-1 text-xs text-black",
      nameClass: "font-semibold whitespace-nowrap",
      timeClass: "font-normal whitespace-nowrap",
    },
    desktop: {
      container: active
        ? "bg-[#005BC4] flex gap-1 xl:gap-3 items-start px-1.5 xl:px-2 py-1 rounded-lg shrink-0 text-xs xl:text-sm text-white text-center whitespace-nowrap"
        : "flex gap-1 xl:gap-3 items-start justify-center px-1.5 xl:px-2 py-1 shrink-0 text-xs xl:text-sm text-black text-center whitespace-nowrap",
      nameClass: "font-semibold leading-5 whitespace-nowrap",
      timeClass: "font-normal leading-5 whitespace-nowrap",
    },
  } as const;

  const { container, nameClass, timeClass } = variants[variant];

  return (
    <div className={container}>
      <span className={nameClass}>{name}</span>
      <span className={timeClass}>{time}</span>
    </div>
  );
};

export default function TopBar() {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  return (
    <div className="bg-white w-full relative">
      {/* Mobile Layout - Below sm */}
      <div className="sm:hidden px-2 py-3">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-center w-full px-2">
            <div className="flex items-center justify-center gap-3">
              {DATES.map((date) => (
                <DateItem
                  key={date.label}
                  label={date.label}
                  iconSize={14}
                  textClass="text-[11px] text-gray-700"
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-6">
            {PRAYER_TIMES.map((prayer) => (
              <PrayerTime key={prayer.name} {...prayer} variant="mobile" />
            ))}
          </div>
        </div>
      </div>

      {/* Tablet Layout - sm to lg */}
      <div className="hidden sm:flex lg:hidden flex-col gap-3 px-4 py-3 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-3 items-center">
            {DATES.map((date) => (
              <DateItem
                key={date.label}
                label={date.label}
                iconSize={16}
                textClass="text-xs text-[#52525b]"
              />
            ))}
          </div>
          <div className="flex gap-2 items-center">
            {SOCIAL_LINKS.map((social) => (
              <SocialIcon key={social.name} {...social} size="small" />
            ))}
            <Link
              href="/qibla-finder"
              className="flex items-center justify-center rounded-full shrink-0"
              aria-label="Qibla Finder"
            >
              <Image
                src="/assets/common/qibla.png"
                alt="Qibla"
                width={24}
                height={24}
                className="shrink-0"
              />
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center gap-1 w-full">
          {PRAYER_TIMES.map((prayer) => (
            <PrayerTime key={prayer.name} {...prayer} variant="tablet" />
          ))}
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="bg-[#f4f4f5] flex gap-1.5 items-center px-2 py-1 rounded-full shrink-0 ml-2"
          >
            <span className="font-normal text-xs text-[#005bc4] whitespace-nowrap">
              Calendar
            </span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 14 14"
              fill="none"
              className="w-3 h-3"
            >
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="#11181c"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Desktop Layout - lg and above */}
      <div className="hidden lg:flex items-center justify-between px-4 xl:px-8 2xl:px-30 py-3 w-full">
        {/* Left Section - Date & Location Info */}
        <div className="flex gap-2 xl:gap-4 items-center shrink-0">
          {DATES.map((date) => (
            <DateItem key={date.label} label={date.label} />
          ))}
          {NAVIGATION_LINKS.map((link) => (
            <Link
              key={link.name}
              href={link.url}
              className="hidden xl:flex gap-1 items-center shrink-0"
            >
              <Image
                src={link.icon}
                alt=""
                width={16}
                height={16}
                className="shrink-0"
              />
              <p className="font-normal text-sm leading-5 text-[#52525b] whitespace-nowrap">
                {link.name}
              </p>
            </Link>
          ))}
        </div>

        {/* Middle Section - Social Media & Profile */}
        <div className="flex gap-2 xl:gap-3.5 items-center justify-end shrink-0">
          {SOCIAL_LINKS.map((social) => (
            <SocialIcon key={social.name} {...social} />
          ))}
          <Link
            href="/qibla-finder"
            className="flex items-center justify-center rounded-full shrink-0"
            aria-label="Qibla Finder"
          >
            <Image
              src="/assets/common/qibla.png"
              alt="Qibla"
              width={30}
              height={30}
              className="shrink-0"
            />
          </Link>
        </div>

        {/* Right Section - Prayer Times & Calendar */}
        <div className="flex gap-2 xl:gap-4 items-center shrink-0">
          <div className="flex gap-0.5 xl:gap-1.75 items-center shrink-0">
            {PRAYER_TIMES.map((prayer) => (
              <PrayerTime key={prayer.name} {...prayer} variant="desktop" />
            ))}
          </div>
          <button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="bg-[#f4f4f5] flex gap-2.5 items-center px-2 py-1 rounded-full shrink-0"
          >
            <p className="font-normal text-xs leading-3.5 text-[#005bc4] text-center whitespace-nowrap">
              Calendar
            </p>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="shrink-0"
            >
              <path
                d="M3.5 5.25L7 8.75L10.5 5.25"
                stroke="#11181c"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
