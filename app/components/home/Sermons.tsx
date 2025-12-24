"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ViewToggleButtons from "../common/ViewToggleButtons";
import { IoCalendarOutline } from "react-icons/io5";

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
    <section className="bg-white w-full px-4 lg:px-8 xl:px-50 py-18 ">
      <div className="container mx-auto">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-15 ">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex flex-col gap-3">
            <p className="text-lg font-medium text-[#006fee] leading-7">
              POWERFUL & LIFE-CHANGING
            </p>
            <h2 className="text-5xl font-semibold text-[#27272a] leading-12 max-w-126.75">
              Featured Sermons and Lectures
            </h2>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center gap-4">
            {/* Discover More Button */}
            <Link
              href="/sermons"
              className="h-12 px-6 rounded-xl flex items-center gap-2 hover:bg-gray-50 transition-colors"
            >
              <span className="text-base font-normal text-black leading-6">
                Discover More
              </span>
            </Link>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-8">
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
        className="flex gap-9 overflow-x-auto scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {sermons.map((sermon) => (
          <div
            key={sermon.id}
            className="flex flex-col gap-6.25 shrink-0 w-88.75"
          >
            {/* Image with overlay buttons */}
            <div className="relative w-full h-[199.5px] rounded-[14px] overflow-hidden">
              <Image
                src={sermon.image}
                alt={sermon.title}
                fill
                className="object-cover"
              />

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
                className="absolute bottom-6 right-3.75"
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
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-semibold text-black leading-8">
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
