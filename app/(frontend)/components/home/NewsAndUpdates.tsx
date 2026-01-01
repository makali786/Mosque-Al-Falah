"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { Media } from "../../../../payload-types";

interface Event {
  id: string;
  title: string;
  shortDescription?: string;
  media?: {
    featuredImage?: Media | string | null;
  };
}

interface Notice {
  id: number;
  title: string;
  date: string;
  tag: string;
  tagColor: "events" | "news";
  isCancelled?: boolean;
}


export default function NewsAndUpdates({ events = [], notices = [] }: { events?: unknown[], notices?: any[] }) {

  const typedEvents = events as unknown as Event[];

  const typedNotices: Notice[] = notices.map((notice: any) => ({
    id: notice?.id,
    title: notice?.title,
    date: notice?.noticeDate ? new Date(notice.noticeDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : "",
    tag: notice?.category ? notice?.category.charAt(0).toUpperCase() + notice?.category.slice(1) : "News",
    tagColor: notice?.category === 'events' ? 'events' : 'news',
    isCancelled: notice?.isCancelled
  }));

  const displayNotices = typedNotices.length > 0 ? typedNotices : [];

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 0.5; // pixels per frame
    let animationFrameId: number;

    const scroll = () => {
      if (scrollContainer && !isPaused) {
        scrollContainer.scrollTop += scrollSpeed;

        // Calculate the height of one set of notices (1/3 of total since we have 3 copies)
        const singleSetHeight = scrollContainer.scrollHeight / 3;

        // Reset scroll seamlessly when reaching end of first set
        if (scrollContainer.scrollTop >= singleSetHeight) {
          scrollContainer.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPaused]);

  return (
    <section className="bg-white w-full py-12 sm:py-24">
      <div className="hn-container px-4 sm:!px-18 flex flex-col lg:flex-row gap-9 sm:gap-12 w-full">
        {/* Left Section - Upcoming Events */}
        <div className="flex-1 lg:flex-[1.6] flex flex-col gap-6 sm:gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-4xl font-bold sm:font-semibold text-[#18181b] leading-7 sm:leading-10">
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="flex items-center gap-2 px-4 py-2 rounded-xl group"
            >
              <span className="text-base text-[#27272a] group-hover:text-[#006fee] leading-6 transition-colors">
                See all
              </span>
              <Image
                src={"/assets/news/arrow-icon.svg"}
                alt={"Arrow Right"}
                height={6}
                width={6}
                className="object-cover group-hover:filter-[brightness(0)_saturate(100%)_invert(32%)_sepia(99%)_saturate(2618%)_hue-rotate(199deg)_brightness(100%)_contrast(107%)] transition-all"
              />
            </Link>
          </div>

          {/* Events Grid - Show only 1 on mobile, 2 on md, 4 on lg+ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-x-11 sm:gap-y-8">
            {typedEvents.slice(0, 1).map((event) => {
              const imageUrl = typeof event.media?.featuredImage === 'object' && event.media?.featuredImage?.url
                ? event.media.featuredImage.url
                : null;

              return (
              <div key={event.id} className="flex flex-col gap-4 sm:hidden">
                {/* Event Image with Gradient Overlay (Mobile only) */}
                <div className="relative w-full h-50.5 overflow-hidden">
                    {imageUrl && (
                      <Image
                      src={imageUrl}
                        alt={event?.title}
                        fill
                        className="object-cover"
                      />
                    )}
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-[rgba(0,0,0,0.68)] to-transparent" />
                </div>

                {/* Event Info */}
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl font-semibold text-[#27272a] leading-7">
                      {event?.title}
                  </h3>
                  <p className="text-base text-[#3f3f46] leading-6 line-clamp-2">
                      {event?.shortDescription || event?.title}
                  </p>
                </div>
              </div>
              )
            })}

            {/* Desktop Events Grid */}
            {typedEvents.map((event) => {
              const imageUrl = typeof event.media?.featuredImage === 'object' && event.media?.featuredImage?.url
                ? event.media.featuredImage.url
                : null;

              return (
              <div key={event.id} className="hidden sm:flex flex-col gap-4">
                {/* Event Image with Play Button */}
                <div className="relative w-full h-45.25 overflow-hidden">
                    {imageUrl && (
                      <Image
                      src={imageUrl}
                        alt={event?.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    {/* Play Button Overlay - Optional, keeping as per original design */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 relative">
                      <Image
                        src="/assets/news/play-icon.svg"
                        alt="Play"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* Event Info */}
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg font-semibold text-black line-clamp-1">
                      {event?.title}
                  </h3>
                  <p className="text-sm text-[#27272a] line-clamp-2 leading-5">
                      {event?.shortDescription || event?.title}
                  </p>
                </div>
              </div>
              )
            })}
          </div>
        </div>

        {/* Right Section - Notice Board */}
        <div className="flex-1 flex flex-col gap-6 sm:gap-8">
          {/* Header */}
          <h2 className="text-xl sm:text-4xl font-bold sm:font-semibold text-[#18181b] leading-7 sm:leading-10">
            Notice Board
          </h2>

          {/* Notices List - Mobile: Static (4 items), Desktop: Auto Scrolling */}
          <div className="sm:hidden flex flex-col gap-6 max-h-140.25 overflow-y-auto">
            {displayNotices.slice(0, 4).map((notice) => (
              <div key={notice.id} className="flex flex-col gap-2">
                {/* Notice Title */}
                <h3 className="text-lg font-normal text-[#006fee] line-clamp-2 leading-7">
                  {notice?.title}
                </h3>

                {/* Date and Tags */}
                <div className="flex items-center justify-between">
                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/topbar/calendar-icon.svg"
                      alt="Calendar Icon"
                      height={16}
                      width={16}
                      className="object-contain"
                    />
                    <span className="text-sm text-[#27272a] leading-5">
                      {notice?.date}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-3.5">
                    {notice.isCancelled && (
                      <div className="bg-[#f31260] px-2 py-1 rounded-lg">
                        <span className="text-xs text-white leading-4">
                          Cancelled
                        </span>
                      </div>
                    )}
                    <div className="bg-[rgba(120,40,200,0.2)] px-2 py-1 rounded-lg">
                      <span className="text-xs text-[#301050] leading-4">
                        {notice.tag}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop: Auto Scrolling */}
          <div
            ref={scrollContainerRef}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="hidden sm:flex flex-col gap-3.5 overflow-y-auto overflow-x-hidden h-150 cursor-pointer scrollbar-hide"
            style={{ scrollBehavior: "auto" }}
          >
            {/* Duplicate notices for seamless infinite scroll */}
            {[...displayNotices, ...displayNotices, ...displayNotices].map((notice, index) => (
              <div
                key={`${notice.id}-${index}`}
                className="flex flex-col gap-2 shrink-0"
              >
                {/* Notice Title */}
                <h3 className="text-lg font-normal text-[#006fee] line-clamp-2 leading-7">
                  {notice?.title}
                </h3>

                {/* Date and Tags */}
                <div className="flex items-center justify-between">
                  {/* Date */}
                  <div className="flex items-center gap-2">
                    <Image
                      src="/assets/topbar/calendar-icon.svg"
                      alt="Calendar Icon"
                      height={16}
                      width={16}
                      className="object-contain"
                    />
                    <span className="text-sm text-[#27272a] leading-5">
                      {notice?.date}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-3.5">
                    {notice.isCancelled && (
                      <div className="bg-[#f31260] px-2 py-1 rounded-lg">
                        <span className="text-xs text-white leading-4">
                          Cancelled
                        </span>
                      </div>
                    )}
                    <div className="bg-[rgba(120,40,200,0.2)] px-2 py-1 rounded-lg">
                      <span className="text-xs text-[#301050] leading-4">
                        {notice?.tag}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
