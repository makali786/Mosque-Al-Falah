"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ViewToggleButtons from "../common/ViewToggleButtons";

interface Sermon {
  id: number;
  image: string;
  date: string;
  title: string;
  author: {
    name: string;
    role?: string;
    avatar?: string;
    initials?: string;
  };
}

const sermons: Sermon[] = [
  {
    id: 1,
    image: "/assets/sermons/sermon-1.png",
    date: "14 February 2024",
    title: "The Quran is the Words of Allah",
    author: {
      name: "Adil Yousuf",
      initials: "AY",
      avatar: "/assets/sermons/user-avatar.svg",
    },
  },
  {
    id: 2,
    image: "/assets/sermons/sermon-2.png",
    date: "14 February 2024",
    title: "The Quran is the Words of Allah",
    author: {
      name: "Adil Yousuf",
      role: "admin",
      avatar: "/assets/sermons/user-avatar.svg",
    },
  },
  {
    id: 3,
    image: "/assets/sermons/sermon-3.png",
    date: "14 February 2024",
    title: "Respecting the Sacred Month of Rajab (English)",
    author: {
      name: "Mawlana Farooq Suleman",
      role: "Imam",
      avatar: "/assets/sermons/user-avatar.svg",
    },
  },
];

export default function Sermons() {
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
    <section className="bg-white w-full px-4 lg:px-8 xl:px-50 py-6 md:py-12 lg:py-18">
      <div className="container mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-4 md:gap-2 lg:gap-1 mb-8 md:mb-12 lg:mb-15">
        {/* Mobile: Stacked layout, Desktop: Side by side */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-0 md:mb-2 lg:mb-3">
          <div className="flex flex-col gap-2 md:gap-2.5 lg:gap-3">
            <p className="text-sm md:text-base lg:text-lg font-normal lg:font-medium text-[#006fee] leading-5 md:leading-6 lg:leading-7 sm:pt-0 pt-5">
              POWERFUL & LIFE-CHANGING
            </p>
            <h2 className="text-xl md:text-3xl lg:text-5xl font-bold lg:font-semibold text-[#27272a] leading-7 md:leading-9 lg:leading-12 max-w-full lg:max-w-126.75">
              Featured Sermons and Lectures
            </h2>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center justify-end gap-4 sm:justify-start md:justify-end lg:justify-start">
            {/* Discover More Button */}
            <Link
              href="/sermons"
              className="h-10 lg:h-12 px-0 lg:px-4 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-sm lg:text-base font-normal text-[#006fee] underline leading-5 lg:leading-6">
                Discover More
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="#006fee" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            {/* Navigation Arrows - Hidden on mobile */}
            <div className="hidden lg:flex items-center gap-8">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  canScrollLeft
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
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  canScrollRight
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
        {sermons.map((sermon) => (
          <div
            key={sermon.id}
            className="flex flex-col gap-6.25 shrink-0 w-full sm:w-88.75"
          >
            {/* Image with overlay buttons */}
            <div className="relative w-full h-[199.5px] rounded-[14px] overflow-visible">
              <div className="relative w-full h-full rounded-[14px] overflow-hidden">
                <Image
                  src={sermon.image}
                  alt={sermon.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Audio and Video buttons - bottom right */}
              <ViewToggleButtons
                onAudioClick={() => {
                  // Handle audio click
                  console.log("Audio clicked for sermon:", sermon.id);
                }}
                onVideoClick={() => {
                  // Handle video click
                  console.log("Video clicked for sermon:", sermon.id);
                }}
                className="absolute -bottom-6 right-4 lg:bottom-6 lg:right-3.75"
              />
            </div>

            {/* Content */}
            <div className="flex flex-col gap-4">
              {/* Date */}
              <div className="flex items-center gap-2">
                <Image
                src={"/assets/topbar/calendar-icon.svg"}
                alt={"calendar"}
                width={16}
                height={16}
                className="object-cover"
              />
                <p className="text-sm font-normal text-[#27272a] leading-5">
                  {sermon.date}
                </p>
              </div>

              {/* Title and Author */}
              <div className="flex flex-col gap-3 lg:gap-4">
                <h3 className="text-xl lg:text-2xl font-medium lg:font-semibold text-black leading-7 lg:leading-8">
                  {sermon.title}
                </h3>

                {/* Author */}
                <div className="flex items-center gap-2">
                  {sermon.author.avatar ? (
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-[#a1a1aa]">
                      <Image
                        src={sermon.author.avatar}
                        alt={sermon.author.name}
                        width={100}
                        height={100}
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#d4d4d8] flex items-center justify-center">
                      <span className="text-xs font-normal text-[#11181c]">
                        {sermon.author.initials}
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col">
                    <p className="text-sm font-normal text-[#11181c] leading-5">
                      {sermon.author.name}
                    </p>
                    {sermon.author.role && (
                      <p className="text-xs font-normal text-[#a1a1aa] leading-4">
                        {sermon.author.role}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}
