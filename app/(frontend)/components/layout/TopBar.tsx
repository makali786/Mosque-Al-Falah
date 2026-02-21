'use client';

import {
  addMinutesToTime,
  findNextPrayer,
  getPrayerTimesByDate,
} from '@lib/prayer-times-helpers';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import CalendarModal from './CalendarModal';

// Extend dayjs with timezone support
dayjs.extend(utc);
dayjs.extend(timezone);

interface TopBarProps {
  prayerTimes?: any[];
  settings?: any;
}

// Helper function to format Hijri date
const formatHijriDate = (date: Date): string => {
  try {
    const formatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      timeZone: 'Europe/London',
    });

    const parts = formatter.formatToParts(date);
    const month = parts.find(p => p.type === 'month')?.value || '';
    const day = parts.find(p => p.type === 'day')?.value || '';

    return `${day} ${month}`;
  } catch (error) {
    console.error('Hijri calendar not supported:', error);
    return 'Hijri date unavailable';
  }
};

const SOCIAL_LINKS = [
  {
    name: 'Facebook',
    icon: '/assets/common/facebook-icon.svg',
    url: 'https://www.facebook.com/profile.php?id=100068190076068#',
  },
  {
    name: 'YouTube',
    icon: '/assets/common/youtube-icon.svg',
    url: 'https://www.youtube.com/channel/UCB-Ux707yantEZ3FDUqQiyw',
  },
  // Instagram - not available yet
  // {
  //   name: "Instagram",
  //   icon: "/assets/common/instagram-icon.svg",
  //   url: "https://instagram.com",
  // },
  // { name: "Qibla", icon: "/assets/common/qibla.png", url: "" },
] as const;

const NAVIGATION_LINKS = [
  {
    name: 'Qibla Finder',
    icon: '/assets/topbar/compass-icon.svg',
    url: 'https://qiblafinder.withgoogle.com/intl/en/desktop',
  },
  {
    name: 'Mosque Finder',
    icon: '/assets/topbar/gps-icon.svg',
    url: 'https://mosques.muslimsinbritain.org/maps-mobile',
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
  textClass = 'text-xs xl:text-sm text-[#52525b]',
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
  size?: 'small' | 'default';
}

const SocialIcon = ({ name, icon, url, size = 'default' }: SocialIconProps) => {
  const padding = size === 'small' ? 'p-1.5' : 'p-2';
  const imgSize = size === 'small' ? 14 : 16;

  return (
    <Link
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
    </Link>
  );
};

interface PrayerTimeProps {
  name: string;
  time: string;
  jamaah: string;
  active: boolean;
  variant?: 'mobile' | 'tablet' | 'desktop';
}

const RowLabels = ({ variant = 'mobile' }: { variant?: 'mobile' | 'tablet' | 'desktop' }) => {
  const sizes = {
    mobile: 'text-[11px] leading-4',
    tablet: 'text-[12px] leading-tight',
    desktop: 'text-[12px] xl:text-[14px] leading-tight',
  };
  const sizeClass = sizes[variant];
  const mtClass = variant === 'desktop' ? 'mt-0.5 xl:mt-1' : 'mt-0.5';
  const mbClass = variant === 'desktop' ? 'mb-0.5 xl:mb-1' : 'mb-0.5';

  return (
    <div className="flex flex-col items-end justify-end shrink-0 pr-2 xl:pr-3 pb-[2px] xl:pb-1">
      <span className={`${sizeClass} invisible ${mbClass}`}>Prayer</span>
      <span className={`${sizeClass} text-[#52525B]`}>Begins</span>
      <span className={`${sizeClass} font-semibold text-black ${mtClass}`}>Jamā'ah</span>
    </div>
  );
};

const PrayerTime = ({
  name,
  time,
  jamaah,
  active,
  variant = 'mobile',
}: PrayerTimeProps) => {
  const baseContainer = "flex flex-col items-center justify-center shrink-0 transition-colors px-1";

  const variants = {
    mobile: {
      container: `${baseContainer} min-w-[46px] ${active ? 'bg-[#005bc4] rounded-[10px] py-0.5 shadow-sm' : ''}`,
      nameClass: `font-semibold text-[11px] leading-4 mb-0.5 ${active ? 'text-white' : 'text-black'}`,
      timeClass: `text-[11px] leading-4 ${active ? 'text-white/90' : 'text-[#52525B]'}`,
      jamaahClass: `text-[11px] leading-4 mt-0.5 font-semibold ${active ? 'text-white' : 'text-black'}`,
    },
    tablet: {
      container: `${baseContainer} min-w-[50px] ${active ? 'bg-[#005BC4] rounded-[10px] py-0.5 shadow-sm' : ''}`,
      nameClass: `font-semibold text-[12px] leading-tight mb-0.5 ${active ? 'text-white' : 'text-black'}`,
      timeClass: `font-normal text-[12px] leading-tight ${active ? 'text-white/90' : 'text-[#52525B]'}`,
      jamaahClass: `font-semibold text-[12px] leading-tight mt-0.5 ${active ? 'text-white' : 'text-black'}`,
    },
    desktop: {
      container: `${baseContainer} min-w-[54px] xl:min-w-[58px] ${active ? 'bg-[#005BC4] rounded-[10px] py-1 shadow-sm' : ''}`,
      nameClass: `font-semibold text-[12px] xl:text-[14px] mb-0.5 xl:mb-1 leading-tight ${active ? 'text-white' : 'text-black'}`,
      timeClass: `font-normal text-[12px] xl:text-[14px] leading-tight ${active ? 'text-white/90' : 'text-[#52525B]'}`,
      jamaahClass: `font-semibold text-[12px] xl:text-[14px] mt-0.5 xl:mt-1 leading-tight ${active ? 'text-white' : 'text-black'}`,
    },
  } as const;

  const { container, nameClass, timeClass, jamaahClass } = variants[variant];

  return (
    <div className={container}>
      <span className={nameClass}>{name}</span>
      <span className={timeClass}>{time}</span>
      <span className={jamaahClass}>{jamaah}</span>
    </div>
  );
};

export default function TopBar({
  prayerTimes = [],
  settings,
}: TopBarProps = {}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every minute to keep dates current
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Calculate dynamic dates
  const dates = useMemo(() => {
    const now = dayjs(currentTime).tz('Europe/London');
    const gregorianDate = now.format('DD MMMM YYYY');
    const hijriDate = formatHijriDate(currentTime);

    return [{ label: gregorianDate }, { label: hijriDate }];
  }, [currentTime]);

  // Get today's prayer times and transform them for display
  const displayPrayerTimes = useMemo(() => {
    if (!prayerTimes || prayerTimes.length === 0) {
      // Fallback to mock data if no prayer times available
      return [
        { name: 'Fajr', time: '5:53', jamaah: '6:15', active: false },
        { name: 'Dhur', time: '12:19', jamaah: '1:00', active: true },
        { name: 'Asr', time: '12:19', jamaah: '4:30', active: false },
        { name: 'Maghrib', time: '3:06', jamaah: '3:10', active: false },
        { name: 'Ishā', time: '6:33', jamaah: '7:30', active: false },
      ];
    }

    const today = new Date();
    const todayData = getPrayerTimesByDate(prayerTimes, today);

    if (!todayData) {
      return [
        { name: 'Fajr', time: '5:53', jamaah: '6:15', active: false },
        { name: 'Dhur', time: '12:19', jamaah: '1:00', active: true },
        { name: 'Asr', time: '12:19', jamaah: '4:30', active: false },
        { name: 'Maghrib', time: '3:06', jamaah: '3:10', active: false },
        { name: 'Ishā', time: '6:33', jamaah: '7:30', active: false },
      ];
    }

    const nextPrayer = findNextPrayer(todayData, today);
    const nextPrayerName = nextPrayer?.name;

    // Check if today is Friday
    const isFriday = today.getDay() === 5;

    return [
      {
        name: 'Fajr',
        time: todayData.fajr,
        jamaah: addMinutesToTime(todayData.fajr, todayData.fajrIqamahDelay),
        active: nextPrayerName === 'FAJR',
      },
      {
        name: isFriday ? "Jum'ah" : 'Dhur',
        time: todayData.dhuhr,
        jamaah: addMinutesToTime(todayData.dhuhr, todayData.dhuhrIqamahDelay),
        active: nextPrayerName === 'DHUHR',
      },
      {
        name: 'Asr',
        time: todayData.asr,
        jamaah: addMinutesToTime(todayData.asr, todayData.asrIqamahDelay),
        active: nextPrayerName === 'ASR',
      },
      {
        name: 'Maghrib',
        time: todayData.maghrib,
        jamaah: addMinutesToTime(todayData.maghrib, todayData.maghribIqamahDelay),
        active: nextPrayerName === 'MAGHRIB',
      },
      {
        name: 'Ishā',
        time: todayData.isha,
        jamaah: addMinutesToTime(todayData.isha, todayData.ishaIqamahDelay),
        active: nextPrayerName === 'ISHA',
      },
    ];
  }, [prayerTimes, settings, currentTime]);

  return (
    <div className="bg-white w-full relative">
      {/* Mobile Layout - Below sm */}
      <div className="sm:hidden py-1.5 px-2">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-center w-full px-2">
            <div className="flex items-center justify-center gap-8">
              {dates.map(date => (
                <DateItem
                  key={date.label}
                  label={date.label}
                  iconSize={16}
                  textClass="text-[14px] text-gray-700"
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-evenly w-full px-2">
            <RowLabels variant="mobile" />
            {displayPrayerTimes.map(prayer => (
              <PrayerTime key={prayer.name} {...prayer} variant="mobile" />
            ))}
          </div>
        </div>
      </div>

      {/* Tablet Layout - sm to lg */}
      <div className="hidden sm:flex lg:hidden flex-col gap-3 hn-container py-3 w-full">
        <div className="flex items-center justify-between w-full">
          <div className="flex gap-3 items-center">
            {dates.map(date => (
              <DateItem
                key={date.label}
                label={date.label}
                iconSize={16}
                textClass="text-xs text-[#52525b]"
              />
            ))}
          </div>
          <div className="flex gap-2 items-center">
            {SOCIAL_LINKS.map(social => (
              <SocialIcon key={social.name} {...social} size="small" />
            ))}
            <Link
              href="https://portal.emasjidlive.co.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center rounded-full shrink-0"
              aria-label="Qibla Finder"
            >
              <Image
                src="/assets/common/qibla.svg"
                alt="Qibla"
                width={24}
                height={24}
                className="shrink-0"
              />
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center w-full">
          <RowLabels variant="tablet" />
          {displayPrayerTimes.map(prayer => (
            <PrayerTime key={prayer.name} {...prayer} variant="tablet" />
          ))}
          <div className="relative ml-2">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="bg-[#f4f4f5] flex gap-1.5 items-center px-2 py-1 rounded-full shrink-0 cursor-pointer"
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
            <CalendarModal
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
              prayerTimes={prayerTimes}
              settings={settings}
            />
          </div>
        </div>
      </div>

      {/* Desktop Layout - lg and above */}
      <div className="hidden lg:flex items-center justify-between hn-container py-3 w-full">
        {/* Left Section - Date & Location Info */}
        <div className="flex gap-2 xl:gap-4 items-center shrink-0">
          {dates.map(date => (
            <DateItem key={date.label} label={date.label} />
          ))}
          {NAVIGATION_LINKS.map(link => (
            <Link
              key={link.name}
              href={link.url}
              target="_blank"
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
          {SOCIAL_LINKS.map(social => (
            <SocialIcon key={social.name} {...social} />
          ))}
          <Link
            href="https://emasjidlive.co.uk/listen/masjidalfalahilford"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-full shrink-0"
            aria-label="Qibla Finder"
          >
            <Image
              src="/assets/common/qibla.svg"
              alt="Qibla"
              width={30}
              height={30}
              className="shrink-0"
            />
          </Link>
        </div>

        {/* Right Section - Prayer Times & Calendar */}
        <div className="flex gap-2 xl:gap-3 items-center shrink-0">
          <div className="flex items-center shrink-0">
            <RowLabels variant="desktop" />
            {displayPrayerTimes.map(prayer => (
              <PrayerTime key={prayer.name} {...prayer} variant="desktop" />
            ))}
          </div>
          <div className="relative ml-2">
            <button
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className="bg-[#f4f4f5] flex gap-2.5 items-center px-2 py-1 rounded-full shrink-0 hover:bg-gray-200 transition-colors cursor-pointer"
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
            <CalendarModal
              isOpen={isCalendarOpen}
              onClose={() => setIsCalendarOpen(false)}
              prayerTimes={prayerTimes}
              settings={settings}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
