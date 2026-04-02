'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState, useCallback } from 'react';
import { IoClose } from 'react-icons/io5';

interface NotificationBarProps {
  notifications: any[];
}

interface DismissedInfo {
  id: string;
  updatedAt: string;
  displayRule: string;
}

export default function NotificationBar({
  notifications,
}: NotificationBarProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  // Filter notifications based on display rules
  const getValidNotifications = useCallback(() => {
    return notifications.filter((notification) => {
      const dismissedKey = `dismissed_${notification.id}`;
      const dismissedVersion = localStorage.getItem(dismissedKey);

      // Check if already dismissed (for until_dismissed rule)
      if (
        dismissedVersion === notification.updatedAt &&
        notification.displayRule === 'until_dismissed'
      ) {
        return false;
      }

      // Check session rule
      const sessionKey = `seenSession_${notification.id}_${notification.updatedAt}`;
      if (
        notification.displayRule === 'once_per_session' &&
        sessionStorage.getItem(sessionKey)
      ) {
        return false;
      }

      // Also check if this notification is in our dismissedIds state
      if (dismissedIds.has(notification.id)) {
        return false;
      }

      return true;
    });
  }, [notifications, dismissedIds]);

  const validNotifications = getValidNotifications();
  const currentNotification = validNotifications[currentIndex];

  // Reset current index when notifications change
  useEffect(() => {
    setCurrentIndex(0);
  }, [notifications]);

  // Handle visibility when current notification changes
  useEffect(() => {
    if (!currentNotification) {
      setIsVisible(false);
      return;
    }

    // Show after slight delay for effect
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [currentNotification]);

  const handleDismiss = () => {
    if (!currentNotification) return;

    setIsVisible(false);

    // Mark as dismissed based on display rule
    if (currentNotification.displayRule === 'until_dismissed') {
      localStorage.setItem(
        `dismissed_${currentNotification.id}`,
        currentNotification.updatedAt
      );
    }
    if (currentNotification.displayRule === 'once_per_session') {
      sessionStorage.setItem(
        `seenSession_${currentNotification.id}_${currentNotification.updatedAt}`,
        'true'
      );
    }

    // Add to dismissed IDs
    setDismissedIds((prev) => new Set(prev).add(currentNotification.id));

    // Wait for animation then show next notification
    setTimeout(() => {
      const nextIndex = currentIndex + 1;
      const remainingNotifications = getValidNotifications().slice(nextIndex);
      
      if (remainingNotifications.length > 0) {
        setCurrentIndex(nextIndex);
      }
    }, 500);
  };

  // If no valid notifications to show
  if (!currentNotification || validNotifications.length === 0) {
    return null;
  }

  const notification = currentNotification;

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
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[9999] bg-yellow-500 shadow-lg transform transition-all duration-500 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
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
                  ${link.style === 'secondary'
                    ? 'bg-orange-50 text-black hover:bg-white/90 md:bg-[#1919195c] md:text-white md:hover:bg-white/30'
                    : 'bg-white/40 text-black hover:bg-white/50 md:bg-white md:text-yellow-900 md:hover:bg-gray-100'
                  }
                  ${
                  idx === 0
                    ? 'bg-black/10 text-black'
                    : 'bg-white/50 text-black'
                  }
                  md:!bg-white md:!text-yellow-900 md:first:!bg-[#1919195c] md:first:!text-white
                  `}
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
      <div 
        className={`fixed bg-[#F5A524] bottom-0 left-0 right-0 z-[9999] shadow-lg transform transition-all duration-500 ease-in-out border-t-0 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
        <div className="w-full bg-[#F5A524] max-w-[1536px] mx-auto relative flex flex-col xl:flex-row md:pl-4 lg:px-24 xl:gap-16">
          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 md:top-[18px] md:right-5 text-black/50 md:text-white/80 hover:text-black md:hover:text-white z-10"
          >
            <IoClose size={24} />
          </button>

          {/* Greeting / Message */}
          <div className="pl-4 pr-11 pt-4 pb-6 m-auto md:p-0 md:block flex-1 text-black md:text-white text-base md:text-xl font-normal md:font-bold font-['Inter'] leading-6 md:leading-7">
            {notification.jummahDate ||
              "A blessed Jumu'ah to you. May today's prayers be answered!"}
          </div>

          {/* Content Wrapper - Mobile: Horizontal Stack, Desktop: Flex Row */}
          <div className="flex flex-row md:flex-row h-[100%] justify-start md:justify-center items-stretch md:items-center w-full xl:w-auto overflow-x-auto md:overflow-visible">
            {/* Jumu'ah 1 */}
            <div className="flex-1 min-w-[33%] md:min-w-0 md:w-56 p-3 md:px-5 md:py-3 bg-[#F7B750] flex flex-col justify-start items-center gap-2.5 h-[100%]">
              {/* Mobile Header */}
              <div className="flex md:hidden flex-col items-center">
                <div className="text-center text-black text-xs font-medium font-['Inter'] leading-4">
                  JUMU'AH 1
                </div>
                <div className="text-center text-black text-xs font-medium font-['Inter'] leading-4">
                  {notification.jummah1?.time || '12:30 PM'}
                </div>
              </div>

              {/* Desktop Header */}
              <Image
                alt="mosque-noti"
                width={48}
                height={48}
                src={'/assets/mosque-noti.svg'} />
              <div className="hidden md:flex justify-center items-center gap-1">
                <div className="text-center text-black text-sm font-medium">
                  JUMU'AH 1
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
            <div className="flex-1 min-w-[33%] md:min-w-0 md:w-56 p-3 md:px-5 md:py-3 bg-orange-100 flex flex-col justify-start items-center gap-2.5 h-[100%]">
              {/* Mobile Header */}
              <div className="flex md:hidden flex-col items-center">
                <div className="text-center text-black text-xs font-medium font-['Inter'] leading-4">
                  JUMU'AH 2
                </div>
                <div className="text-center text-black text-xs font-medium font-['Inter'] leading-4">
                  {notification.jummah2?.time || '1:30 PM'}
                </div>
              </div>

              {/* Desktop Header */}
               <Image
                alt="mosque-noti"
                width={48}
                height={48}
                src={'/assets/mosque-noti.svg'} />
              <div className="hidden md:flex justify-center items-center gap-1">
                <div className="text-center text-blue-700 text-sm font-medium">
                  JUMU'AH 2
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
            <div className="flex-1 min-w-[33%] md:min-w-0 md:w-52 p-3 md:px-6 md:py-4 bg-[#62420E] flex flex-col justify-center items-center md:items-start gap-2 border-l md:border-none border-dashed border-gray-300 md:border-transparent h-[100%] min-h-[168px]">
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
                className="w-full h-8 md:h-10 px-2 md:px-4 bg-white text-black hover:bg-blue-700 md:hover:bg-white/20 rounded md:rounded-lg flex justify-center items-center gap-1 md:gap-2 text-white text-[10px] md:text-sm transition-colors mt-1 md:mt-0"
              >
                <span className='text-black'>Donate</span><span className="hidden md:inline text-black"> Now</span>{' '}
                <span className="md:text-lg text-black">›</span>
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
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[9999] bg-[#F5A524] shadow-lg transform transition-all duration-500 ease-in-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
        }`}
      >
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
