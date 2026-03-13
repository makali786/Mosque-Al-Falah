'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';

interface NotificationBarProps {
  notification: any;
}

export default function NotificationBar({
  notification,
}: NotificationBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!notification) return;

    // Check if dismissed (using ID + updatedAt to allow re-showing on updates)
    const dismissedKey = `dismissed_${notification.id}`;
    const dismissedVersion = localStorage.getItem(dismissedKey);

    if (
      dismissedVersion === notification.updatedAt &&
      notification.displayRule === 'until_dismissed'
    ) {
      return;
    }

    // Check session rule
    // We also append updatedAt to session key to reset if updated mid-session
    const sessionKey = `seenSession_${notification.id}_${notification.updatedAt}`;
    if (
      notification.displayRule === 'once_per_session' &&
      sessionStorage.getItem(sessionKey)
    ) {
      return;
    }

    // Show after slight delay for effect
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [notification]);

  if (!notification || !isVisible) return null;

  const handleDismiss = () => {
    setIsVisible(false);
    if (notification.displayRule === 'until_dismissed') {
      localStorage.setItem(
        `dismissed_${notification.id}`,
        notification.updatedAt
      );
    }
    if (notification.displayRule === 'once_per_session') {
      sessionStorage.setItem(
        `seenSession_${notification.id}_${notification.updatedAt}`,
        'true'
      );
    }
  };

  // Map custom colors to Tailwind equivalents
  // bg-colors-common-yellow-500 -> bg-yellow-500
  // bg-colors-common-yellow-400 -> bg-yellow-400
  // bg-colors-common-yellow-900 -> text-yellow-900
  // bg-colors-base-warning-500 -> bg-orange-500 (approx)
  // bg-colors-base-primary-700 -> bg-blue-700

  // Helper to resolve link URL
  const resolveLinkUrl = (link: any) => {
    if (link.linkType === 'appeal' && link.relatedAppeal) {
      return `/appeals/${link.relatedAppeal.slug}`;
    }
    if (link.linkType === 'event' && link.relatedEvent) {
      return `/events/${link.relatedEvent.slug}`;
    }
    return link.url || '#';
  };

  // Helper to get fundraising stats
  const getFundraisingStats = () => {
    const { fundraising } = notification;
    if (fundraising?.source === 'appeal' && fundraising.relatedAppeal) {
      return {
        // Design shows "Friday Giving" or "Zakat", likely want to keep the manual title if provided, or use appeal title.
        // Let's stick to the notification's title override if possible, or fallback to appeal title.
        // In the schema, 'title' field is conditional on 'manual'.
        // If 'appeal' selected, we might want to use the appeal's title OR allow an override.
        // For now, let's use the appeal's title if source is appeal.
        // Wait, the schema strictly hides 'title' if source is 'appeal'.
        // So we strictly use relevantAppeal.title.
        title: fundraising.relatedAppeal.title,
        donorCount: fundraising.relatedAppeal.funding?.totalDonors || 0,
        amountRaised: fundraising.relatedAppeal.funding?.currentAmount || 0,
        link: `/appeals/${fundraising.relatedAppeal.slug}`,
      };
    }
    return {
      title: fundraising?.title || 'Friday Giving',
      donorCount: fundraising?.donorCount || 0,
      amountRaised: fundraising?.amountRaised || 0,
      link: '/donate',
    };
  };

  const fundraisingStats = getFundraisingStats();

  // --- Render Variants ---

  // 1. Simple Announcement
  if (notification.type === 'simple') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-yellow-500 shadow-lg transform transition-transform duration-500 ease-in-out translate-y-0">
        <div className="w-full max-w-[1536px] mx-auto px-4 pt-8 pb-6 md:px-28 md:py-5 relative flex flex-col md:flex-row justify-start md:justify-between items-start md:items-center gap-4 md:gap-9">
          {/* Close Button - Mobile: Top Right (Absolute), Desktop: Right (Relative/Flex) */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 md:top-5 md:right-5 text-white/80 hover:text-white"
          >
            <IoClose size={24} />
          </button>

          {/* Message */}
          <div className="w-full md:flex-1 text-left md:text-left text-black md:text-white text-base md:text-lg font-normal md:font-medium font-['Inter'] leading-6 md:leading-7 pr-8 md:pr-0">
            {notification.message}
          </div>

          {/* Buttons */}
          <div className="w-full md:w-auto flex justify-start md:justify-center items-start md:items-center gap-4">
            {notification.links?.map((link: any, idx: number) => (
              <Link
                key={idx}
                href={resolveLinkUrl(link)}
                className={`h-10 md:h-12 px-4 md:px-6 rounded-lg flex justify-center items-center gap-2 text-sm md:text-base font-normal font-['Inter'] leading-5 md:leading-6 transition-colors
                  ${
                    link.style === 'secondary'
                      ? 'bg-orange-50 text-black hover:bg-white/90 md:bg-[#1919195c] md:text-white md:hover:bg-white/30' // Mobile specific styling for secondary? User snippet shows lighter bg
                      : 'bg-white/40 text-black hover:bg-white/50 md:bg-white md:text-yellow-900 md:hover:bg-gray-100' // Matches user snippet structure somewhat
                  }
                  ${
                    // Override styles based on user snippet for mobile 'Donate' vs 'View Event'
                    // User snippet: Donate (bg-colors-flat-default-flat/40), View Event (bg-colors-base-default-50)
                    idx === 0
                      ? 'bg-black/10 text-black'
                      : 'bg-white/50 text-black'
                  }
                  md:!bg-white md:!text-yellow-900 md:first:!bg-[#1919195c] md:first:!text-white
                  `}
                // Note: The user snippet styles are quite specific custom colors.
                // I'm approximating:
                // Link 1: bg-black/10 (flat-default-flat/40 approx)
                // Link 2: bg-white/50 (base-default-50 approx)
                // Desktop overrides allow preserving the previous accepted desktop design.
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 2. Jumu'ah Schedule
  if (notification.type === 'jummah') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-yellow-500 md:bg-orange-500 shadow-lg transform transition-transform duration-500 ease-in-out translate-y-0 border-t-0 md:border-t-4 md:border-yellow-400">
        <div className="w-full max-w-[1536px] mx-auto relative flex flex-col xl:flex-row md:px-4 lg:px-24 md:py-4 xl:gap-16">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 md:top-[18px] md:right-5 text-black/50 md:text-white/80 hover:text-black md:hover:text-white z-10"
          >
            <IoClose size={24} />
          </button>

          {/* Greeting / Message */}
          <div className="pl-4 pr-11 pt-4 pb-6 md:p-0 md:block flex-1 text-black md:text-white text-base md:text-xl font-normal md:font-bold font-['Inter'] leading-6 md:leading-7">
            {notification.jummahDate ||
              "A blessed Jumu'ah to you. May today’s prayers be answered!"}
          </div>

          {/* Content Wrapper - Mobile: Horizontal Stack, Desktop: Flex Row */}
          <div className="flex flex-row md:flex-row justify-start md:justify-center items-stretch md:items-center w-full xl:w-auto overflow-x-auto md:overflow-visible">
            {/* Jumu'ah 1 */}
            <div className="flex-1 min-w-[33%] md:min-w-0 md:w-56 p-3 md:px-5 md:py-3 bg-yellow-400 flex flex-col justify-start items-center gap-2.5">
              {/* Mobile Header */}
              <div className="flex md:hidden flex-col items-center">
                <div className="text-center text-black text-xs font-medium font-['Inter'] leading-4">
                  JUMU’AH 1
                </div>
                <div className="text-center text-black text-xs font-medium font-['Inter'] leading-4">
                  {notification.jummah1?.time || '12:30 PM'}
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:flex p-2 bg-blue-900 rounded-2xl justify-center items-center">
                <span className="text-2xl">🕌</span>
              </div>
              <div className="hidden md:flex justify-center items-center gap-1">
                <div className="text-center text-black text-sm font-medium">
                  JUMU’AH 1
                </div>
                <div className="text-center text-black text-sm font-medium">
                  {notification.jummah1?.time || '12:30 PM'}
                </div>
              </div>

              {/* Details - Mobile Compact */}
              <div className="flex flex-col gap-1 w-full md:w-auto">
                {/* Athan - Mobile Only in snippet */}
                <div className="flex justify-center items-center gap-1">
                  <span className="text-[10px] md:text-xs text-yellow-900 uppercase">
                    ATHAN:
                  </span>
                  <span className="text-[10px] md:text-xs text-yellow-900 uppercase">
                    {notification.jummah1?.athan || '12:15 PM'}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <span className="text-[10px] md:text-xs text-yellow-900 uppercase">
                    IMAM:
                  </span>
                  <span className="text-[10px] md:text-xs text-yellow-900 uppercase truncate max-w-[80px] md:max-w-none">
                    {notification.jummah1?.imam}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <span className="text-[10px] md:text-xs text-yellow-900 uppercase">
                    KHUTBAH:
                  </span>
                  <span className="text-[10px] md:text-xs text-yellow-900 uppercase">
                    {notification.jummah1?.khutbahLang}
                  </span>
                </div>
              </div>
            </div>

            {/* Jumu'ah 2 */}
            <div className="flex-1 min-w-[33%] md:min-w-0 md:w-56 p-3 md:px-5 md:py-3 bg-orange-100 flex flex-col justify-start items-center gap-2.5">
              {/* Mobile Header */}
              <div className="flex md:hidden flex-col items-center">
                <div className="text-center text-black text-xs font-medium font-['Inter'] leading-4">
                  JUMU’AH 2
                </div>
                <div className="text-center text-black text-xs font-medium font-['Inter'] leading-4">
                  {notification.jummah2?.time || '1:30 PM'}
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:flex p-2 bg-blue-900 rounded-2xl justify-center items-center">
                <span className="text-2xl">🕌</span>
              </div>
              <div className="hidden md:flex justify-center items-center gap-1">
                <div className="text-center text-blue-700 text-sm font-medium">
                  JUMU’AH 2
                </div>
                <div className="text-center text-blue-700 text-sm font-medium">
                  {notification.jummah2?.time || '1:30 PM'}
                </div>
              </div>

              {/* Details */}
              <div className="flex flex-col gap-1 w-full md:w-auto">
                <div className="flex justify-center items-center gap-1">
                  <span className="text-[10px] md:text-xs text-black uppercase">
                    ATHAN:
                  </span>
                  <span className="text-[10px] md:text-xs text-black uppercase">
                    {notification.jummah2?.athan || '1:15 PM'}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <span className="text-[10px] md:text-xs text-black uppercase">
                    IMAM:
                  </span>
                  <span className="text-[10px] md:text-xs text-black uppercase truncate max-w-[80px] md:max-w-none">
                    {notification.jummah2?.imam}
                  </span>
                </div>
                <div className="flex justify-center items-center gap-1">
                  <span className="text-[10px] md:text-xs text-black uppercase">
                    KHUTBAH:
                  </span>
                  <span className="text-[10px] md:text-xs text-black uppercase">
                    {notification.jummah2?.khutbahLang}
                  </span>
                </div>
              </div>
            </div>

            {/* Fundraising Stats - Mobile: 3rd column, Desktop: Box */}
            <div className="flex-1 min-w-[33%] md:min-w-0 md:w-52 p-3 md:px-6 md:py-4 bg-orange-100 md:bg-yellow-900 flex flex-col justify-center items-center md:items-start gap-2 border-l md:border-none border-dashed border-gray-300 md:border-transparent">
              {/* Mobile uses different layout for fundraising to fit in the row? 
                  User snippet had a row of 3 identical Jummah blocks, but usually fundraising is distinct.
                  Wait, the user's Eid snippet has a specific MOBILE fundraising block. 
                  Let's assume Jummah Mobile also wants the fundraising info but maybe compact. 
                  Or maybe strictly follow the user's 'Eid' structure for 'Jummah' too if it fits better?
                  Actually, user's Jumu'ah snippet purely showed 3 Jummah blocks (1 duplicated). 
                  I will render the Fundraising Stats here, adapted to match the style of the sibling blocks for Mobile 
                  so it looks cohesive, but pull the correct data.
              */}

              {/* Mobile Header: "Friday Giving" */}
              <div className="flex md:hidden flex-col items-center">
                <div className="text-center text-black text-xs font-medium font-['Inter'] leading-4">
                  GIVING
                </div>
                <div className="text-center text-black text-xs font-medium font-['Inter'] leading-4">
                  STATS
                </div>
              </div>

              {/* Desktop Header */}
              <div className="hidden md:block w-full text-center md:text-left text-white text-base font-bold truncate">
                {fundraisingStats.title}
              </div>

              {/* Stats Row */}
              <div className="w-full flex flex-col md:flex-row justify-between items-center gap-1 md:gap-0">
                <div className="flex flex-row md:flex-col items-center gap-1 md:gap-0">
                  <div className="text-black md:text-white text-[10px] md:text-xl font-bold">
                    <span className="md:hidden">Donors: </span>
                    {fundraisingStats.donorCount}
                  </div>
                  <div className="hidden md:block text-white text-xs">
                    Donors
                  </div>
                </div>
                <div className="flex flex-row md:flex-col items-center gap-1 md:gap-0">
                  <div className="text-black md:text-white text-[10px] md:text-xl font-bold">
                    <span className="md:hidden">£</span>
                    {fundraisingStats.amountRaised.toLocaleString()}
                  </div>
                  <div className="hidden md:block text-white text-xs">
                    Raised
                  </div>
                </div>
              </div>

              {/* Button */}
              <Link
                href={fundraisingStats.link}
                className="w-full h-8 md:h-10 px-2 md:px-4 bg-blue-600 md:bg-white/10 hover:bg-blue-700 md:hover:bg-white/20 rounded md:rounded-lg flex justify-center items-center gap-1 md:gap-2 text-white text-[10px] md:text-sm transition-colors mt-1 md:mt-0"
              >
                Donate<span className="hidden md:inline"> Now</span>{' '}
                <span className="md:text-lg">›</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 3. Eid Schedule
  if (notification.type === 'eid') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-[9999] bg-[#F5A524] shadow-lg transform transition-transform duration-500 ease-in-out translate-y-0">
        {/* Figma Container: w-[1536px] max, px-24, gap-6 */}
        <div className="w-full max-w-[1536px] min-h-[140px] mx-auto px-4 md:px-24 relative flex flex-col xl:flex-row justify-start items-center gap-6 overflow-hidden">
          {/* Message Area: flex-1, Inter Bold, text-xl */}
          <div className="flex-1 py-8 xl:py-0 text-white text-xl font-bold font-['Inter'] leading-7">
            {notification.eidMessage}
          </div>

          <div className="w-full xl:w-auto flex flex-col md:flex-row justify-end items-stretch md:items-center">
            {/* Jamaats Container */}
            {notification.eidJamaats
              ?.slice(0, 3)
              .map((jamaat: any, idx: number) => (
                <div
                  key={jamaat.id || idx}
                  className={`w-full md:w-56 min-h-[204px] px-5 py-6 flex flex-col justify-start items-center gap-2.5 overflow-hidden
                  ${idx === 0 ? 'bg-[#F7B750]' : 'bg-[#FFEDD5]'} 
                `}
                >
                  {/* Mosque Icon: size-12. The SVG already has the blue background and white mosque. */}
                  <img
                    src="/assets/common/eid-mosque.svg"
                    alt="Mosque"
                    className="size-12 rounded-2xl"
                  />

                  {/* SALAH NAME and TIME: md:text-sm, Inter Medium */}
                  <div className="self-stretch inline-flex justify-center items-center gap-1">
                    <div
                      className={`text-center text-sm font-medium font-['Inter'] leading-5 ${idx === 0 ? 'text-black' : 'text-[#1D4ED8]'}`}
                    >
                      EID PRAYER {idx + 1}
                    </div>
                    <div
                      className={`text-center text-sm font-medium font-['Inter'] leading-5 ${idx === 0 ? 'text-black' : 'text-[#1D4ED8]'}`}
                    >
                      {jamaat.time}
                    </div>
                  </div>

                  {/* Details Area */}
                  <div className="flex flex-col gap-0.5">
                    {jamaat.athan && (
                      <div className="inline-flex justify-start items-center gap-1 text-[11px]">
                        <div
                          className={`text-center font-normal font-['Inter'] leading-4 ${idx === 0 ? 'text-[#713F12]' : 'text-black opacity-80'}`}
                        >
                          ATHAN:
                        </div>
                        <div
                          className={`text-center font-normal font-['Inter'] leading-4 ${idx === 0 ? 'text-[#713F12]' : 'text-black opacity-80'}`}
                        >
                          {jamaat.athan}
                        </div>
                      </div>
                    )}
                    <div className="inline-flex justify-center items-start gap-1 text-[11px]">
                      <div
                        className={`text-center font-normal font-['Inter'] leading-4 ${idx === 0 ? 'text-[#713F12]' : 'text-black opacity-80'}`}
                      >
                        IMAM:
                      </div>
                      <div
                        className={`font-normal font-['Inter'] leading-4 uppercase text-left ${idx === 0 ? 'text-[#713F12]' : 'text-black opacity-80'}`}
                      >
                        {jamaat.imam || 'TBC'}
                      </div>
                    </div>
                    {jamaat.notes && (
                      <div className="inline-flex justify-center items-start gap-1 text-[11px]">
                        <div
                          className={`text-center font-normal font-['Inter'] leading-4 ${idx === 0 ? 'text-[#713F12]' : 'text-black opacity-80'}`}
                        >
                          KHUTBAH:
                        </div>
                        <div
                          className={` font-normal font-['Inter'] leading-4 uppercase text-left ${idx === 0 ? 'text-[#713F12]' : 'text-black opacity-80'}`}
                        >
                          {jamaat.notes}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

            {/* Zakat Donation Box: w-52, bg-warning-800 */}
            <div className="w-full md:w-52 self-stretch px-6 py-6 bg-[#62420E] inline-flex flex-col justify-center items-start gap-2">
              <div className="self-stretch text-white text-base font-bold font-['Inter'] leading-6">
                {fundraisingStats.title || 'Help Build a Lasting Legacy'}
              </div>
              <div className="self-stretch inline-flex justify-between items-center">
                <div className="inline-flex flex-col justify-start items-center gap-1">
                  <div className="text-white text-xl font-bold font-['Inter'] leading-7">
                    {fundraisingStats.donorCount}
                  </div>
                  <div className="text-white text-sm font-normal font-['Inter'] leading-5 opacity-80">
                    Donors
                  </div>
                </div>
                <div className="inline-flex flex-col justify-start items-center gap-1">
                  <div className="text-white text-xl font-bold font-['Inter'] leading-7">
                    £{fundraisingStats.amountRaised.toLocaleString()}
                  </div>
                  <div className="text-white text-sm font-normal font-['Inter'] leading-5 opacity-80">
                    Raised
                  </div>
                </div>
              </div>
              {/* Donate Button: white, bg-default-50 */}
              <Link
                href={fundraisingStats.link}
                className="self-stretch h-10 px-4 bg-[#F8FAFC] rounded-lg inline-flex justify-center items-center gap-2 group hover:bg-white transition-all shadow-sm"
              >
                <div className="flex-1 flex justify-between items-center">
                  <span className="text-[#171717] text-sm font-normal font-['Inter'] leading-5">
                    Donate Now
                  </span>
                  <div className="w-5 h-5 flex items-center justify-center transition-transform group-hover:translate-x-1">
                    <svg width="6" height="10" viewBox="0 0 6 10" fill="none">
                      <path
                        d="M1 9L5 5L1 1"
                        stroke="#171717"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Close Button: absolute, right-0, size-6 etc */}
          <div className="absolute right-4 top-4 xl:right-6 xl:top-2">
            <button
              onClick={handleDismiss}
              className="text-white/80 hover:text-white transition-colors"
              aria-label="Close"
            >
              <IoClose size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
