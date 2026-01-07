"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getMediaUrl } from "../../../../lib/helper";

export interface EventInterface {
  id: string;
  title: string;
  slug: string;
  timing: {
    startDate: string;
    endDate: string;
    timezone: string;
  };
  platforms: {
    platform: string;
    link: string;
    id: string;
  }[];
  venue: {
    name: string;
    fullAddress: string;
  };
  media: {
    featuredImage: any;
    isLive: boolean;
  };
  speakers?: {
    guestSpeaker?: {
      name?: string;
    };
  }[];
  category?: string;
}

export interface EventCardProps {
  event: EventInterface;
  layout?: "grid" | "list";
}

export default function EventCard({ event, layout = "grid" }: EventCardProps) {

  const { title, slug, timing, platforms, media } = event;
  
  const imageUrl = getMediaUrl(media?.featuredImage);
  
  // Format Date: "26 Jan"
  const startDate = new Date(timing.startDate);
  const endDate = new Date(timing.endDate);
  
  const dateFormatted = startDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
  });

  // Format Time: "9:00 AM - 11:00 AM"
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };
  
  const timeRange = `${formatTime(startDate)} - ${formatTime(endDate)}`;

  const isLive = media?.isLive;

  const CardWrapper = ({ children, className }: { children: React.ReactNode, className?: string }) => {
     return (
        <Link href={`/events/${slug}`} className={`block ${className || ""}`}>
           {children}
        </Link>
     );
  }

  // Icons
  const ZoomIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.6666 4.66669L10.6666 7.33335V5.33335C10.6666 4.96669 10.3666 4.66669 9.99992 4.66669H2.66659C2.29992 4.66669 1.99992 4.96669 1.99992 5.33335V10.6667C1.99992 11.0334 2.29992 11.3334 2.66659 11.3334H9.99992C10.3666 11.3334 10.6666 11.0334 10.6666 10.6667V8.66669L14.6666 11.3334V4.66669Z" fill="#1877F2"/>
    </svg>
  );

  const PersonIcon = () => (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 8C9.47276 8 10.6667 6.80609 10.6667 5.33333C10.6667 3.86058 9.47276 2.66667 8 2.66667C6.52724 2.66667 5.33333 3.86058 5.33333 5.33333C5.33333 6.80609 6.52724 8 8 8ZM8 9.33333C6.222 9.33333 2.66667 10.222 2.66667 12V13.3333H13.3333V12C13.3333 10.222 9.778 9.33333 8 9.33333Z" fill="#18181B"/>
    </svg>
  );

  if (layout === "list") {
    // Basic List View Implementation
    return (
       <CardWrapper className="flex flex-col md:flex-row w-full bg-white overflow-hidden border border-[#E4E4E7] hover:shadow-sm transition-shadow">
          <div className="relative w-full md:w-[280px] aspect-[4/3] md:h-auto shrink-0">
             {imageUrl && (
                <Image
                   src={imageUrl}
                   alt={title}
                   fill
                   className="object-cover"
                />
             )}
          </div>
          <div className="flex flex-col p-5 gap-3 justify-center">
             <div className="flex items-center gap-2 text-sm text-[#71717A]">
                <span>{dateFormatted}</span>
                <span>•</span>
                <span>{timeRange}</span>
                {isLive && (
                    <div className="flex items-center gap-1.5 ml-auto md:ml-4">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#E11D48]"></span>
                        <span className="text-[#E11D48] font-medium text-xs">Live Now</span>
                    </div>
                )}
             </div>
             
             <h3 className="text-xl font-semibold text-[#18181B]">
                {title}
             </h3>

             <div className="flex items-center gap-2 mt-1">
                <span className="text-[#A1A1AA] text-sm">Platform:</span>
                <div className="flex items-center gap-3">
                   {platforms.some(p => p.platform === 'zoom') && (
                       <div className="flex items-center gap-1.5">
                           <ZoomIcon />
                           <span className="text-[#52525B] text-sm">Zoom</span>
                       </div>
                   )}
                   <div className="flex items-center gap-1.5">
                        <PersonIcon />
                        <span className="text-[#52525B] text-sm">In-person</span>
                   </div>
                </div>
             </div>
          </div>
       </CardWrapper>
    );
  }

  // Grid View
  return (
    <CardWrapper className="flex flex-col w-full bg-white overflow-hidden h-full">
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] lg:max-w-[357px] lg:max-h-[357px]">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col p-5 gap-3">
        {/* Title */}
        <h3 className="text-[18px] leading-[26px] font-semibold text-[#18181B] group-hover:text-[#006FEE] transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Date and Status */}
        <div className="flex items-center justify-between text-[13px] leading-[18px]">
          <div className="flex items-center gap-1.5 text-[#71717A]">
            <span>{dateFormatted}</span>
            <span className="w-0.5 h-0.5 rounded-full bg-[#71717A]"></span>
            <span>{timeRange}</span>
          </div>
          
          {isLive && (
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E11D48] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E11D48]"></span>
              </span>
              <span className="text-[#E11D48] font-medium text-[13px]">Live Now</span>
            </div>
          )}
        </div>

        {/* Platform Info */}
        <div className="flex items-center gap-2 pt-1 border-t border-[#F4F4F5] mt-auto">
          <span className="text-[#A1A1AA] text-[13px]">Platform:</span>
          <div className="flex items-center gap-3">
             {/* Dynamic Platform Icons - Assuming defaults for demo based on inputs */}
             {platforms.some(p => p.platform === 'zoom') ? (
                 <div className="flex items-center gap-1.5">
                     <ZoomIcon />
                     <span className="text-[#52525B] text-[13px]">Zoom</span>
                 </div>
             ) : null}
             
             {/* Always showing In-person as per typical mosque events or if venue is present */}
             {event.venue && (
                <div className="flex items-center gap-1.5">
                    <PersonIcon />
                    <span className="text-[#52525B] text-[13px]">In-person</span>
                </div>
             )}
          </div>
        </div>
      </div>
    </CardWrapper>
  );
}
