"use client";

import { useState, useRef, useEffect } from "react";
import Image from "@/components/common/CustomImage";
import Link from "next/link";
import ViewToggleButtons from "../common/ViewToggleButtons";
import SermonCard from "../common/SermonCard";

import { getMediaUrl } from "../../../../lib/helper";

import { Media } from "../../../../payload-types";

interface Sermon {
  id: number | string;
  image: string | null;
  date: string;
  title: string;
  guestSpeaker?: {
    name?: string;
    title?: string;
    avatar?: string | { url: string } | null;
  };
  author: {
    name: string;
    role?: string;
    avatar?: string;
    initials?: string;
  };
  videoUrl?: string;
  slug?: string;
}

// Remove hardcoded sermons constant


interface RawSermon {
  id: number | string;
  image?: string | { url: string } | null;
  sermonDate?: string;
  title: string;
  guestSpeaker?: {
    name?: string;
    title?: string;
    avatar?: string | { url: string } | null;
  };
  videoUrl?: string;
  slug?: string;
  author?: {
    name: string;
    role?: string;
    avatar?: string;
    initials?: string;
  };
}

interface SermonsProps {
  sermons: RawSermon[];
  title?: string;
  subtitle?: string;
  showDiscoverMore?: boolean;
}

export default function Sermons({
  sermons = [],
  title = "Featured Sermons and Lectures",
  subtitle = "POWERFUL & LIFE-CHANGING",
  showDiscoverMore = true
}: SermonsProps) {

  const mappedSermons: Sermon[] = sermons.map((sermon) => ({
    id: sermon.id,
    slug: sermon.slug,
    image: getMediaUrl(sermon.image as unknown as Media),
    date: sermon.sermonDate ? new Date(sermon.sermonDate).toLocaleDateString() : "No Date",
    title: sermon.title,
    guestSpeaker: sermon.guestSpeaker,
    author: sermon.author || {
      name: "",
      role: "",
      avatar: undefined,
      initials: ""
    },
    videoUrl: sermon.videoUrl
  }));
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      return () => scrollContainer.removeEventListener("scroll", checkScroll);
    }
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "right" ? scrollAmount : -scrollAmount);
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="bg-white w-full py-6 md:py-12 lg:py-18">
      <div className="section-padding">
        {/* Header */}
        <div className="flex flex-col gap-4 md:gap-2 lg:gap-1 mb-8 md:mb-12 lg:mb-15">
          {/* Mobile: Stacked layout, Desktop: Side by side */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-0 md:mb-2 lg:mb-3">
            <div className="flex flex-col gap-2 md:gap-2.5 lg:gap-3">
              {subtitle && (
                <p className="text-sm md:text-base lg:text-lg font-normal lg:font-medium text-[#006fee] leading-5 md:leading-6 lg:leading-7 sm:pt-0 pt-5">
                  {subtitle}
                </p>
              )}
              <h2 className="text-xl md:text-3xl lg:text-5xl font-bold lg:font-semibold text-[#27272a] leading-7 md:leading-9 lg:leading-12 max-w-full lg:max-w-126.75">
                {title}
              </h2>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center justify-end gap-4 sm:justify-start md:justify-end lg:justify-start lg:self-end">
              {/* Discover More Button */}
              {showDiscoverMore && (
                <Link
                  href="/sermons"
                  className="h-10 lg:h-12 px-0 lg:px-4 rounded-xl flex items-center gap-2"
                >
                  <span className="text-sm lg:text-base font-normal leading-5 lg:leading-6 underline sm:no-underline text-[#006fee] sm:text-black">
                    Discover More
                  </span>
                  <Image
                    src="/assets/sermons/arrow-right.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="object-contain sm:hidden"
                  />
                </Link>
              )}

              {/* Navigation Arrows - Hidden on mobile */}
              <div className="hidden lg:flex items-center gap-8">
                <button
                  onClick={() => scroll("left")}
                  disabled={!canScrollLeft}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${canScrollLeft
                    ? "bg-[#d4d4d8] hover:bg-[#c4c4c8] cursor-pointer"
                    : "bg-[#d4d4d8] opacity-50 cursor-not-allowed"
                    }`}
                >
                  <Image
                    src="/assets/sermons/arrow-left.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </button>

                <button
                  onClick={() => scroll("right")}
                  disabled={!canScrollRight}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${canScrollRight
                    ? "bg-[rgba(0,111,238,0.2)] hover:bg-[rgba(0,111,238,0.3)] cursor-pointer"
                    : "bg-[rgba(0,111,238,0.2)] opacity-50 cursor-not-allowed"
                    }`}
                >
                  <Image
                    src="/assets/sermons/arrow-right.svg"
                    alt=""
                    width={20}
                    height={20}
                    className="object-contain"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Sermons Container */}
        <div
          ref={scrollContainerRef}
          className="flex flex-col sm:flex-row gap-9 sm:overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {mappedSermons.map((sermon) => (
            <div
              key={sermon.id}
              className="shrink-0 w-full sm:w-88.75 lg:w-[calc((100%-72px)/3)]"
            >
              <SermonCard sermon={sermon} layout="grid" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
