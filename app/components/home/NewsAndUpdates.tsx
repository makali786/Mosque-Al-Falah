"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaCalendar, FaPlayCircle } from "react-icons/fa";
import { IoArrowForward } from "react-icons/io5";

interface Event {
  id: number;
  image: string;
  title: string;
  description: string;
}

interface Notice {
  id: number;
  title: string;
  date: string;
  tag: string;
  tagColor: "events" | "news";
}

const EVENTS: Event[] = [
  {
    id: 1,
    image: "/assets/news/event-1.png",
    title: "This Ramadan Let's Start a Journey",
    description: "ll praise is due to Allah, the Most Merciful, the Most Wise.",
  },
  {
    id: 2,
    image: "/assets/news/event-2.png",
    title: "This Ramadan Let's Start a Journey",
    description: "ll praise is due to Allah, the Most Merciful, the Most Wise.",
  },
  {
    id: 3,
    image: "/assets/news/event-3.png",
    title: "This Ramadan Let's Start a Journey",
    description: "ll praise is due to Allah, the Most Merciful, the Most Wise.",
  },
  {
    id: 4,
    image: "/assets/news/event-4.png",
    title: "This Ramadan Let's Start a Journey",
    description: "ll praise is due to Allah, the Most Merciful, the Most Wise.",
  },
];

const NOTICES: Notice[] = [
  {
    id: 1,
    title:
      "Standing Against Injustice: Reflections on Gaza, and Our Duty to Combat Oppression",
    date: "14 Feb 2025",
    tag: "Events",
    tagColor: "events",
  },
  {
    id: 2,
    title:
      "Standing Against Injustice: Reflections on Gaza, and Our Duty to Combat Oppression",
    date: "14 Feb 2025",
    tag: "News",
    tagColor: "news",
  },
  {
    id: 3,
    title:
      "Standing Against Injustice: Reflections on Gaza, and Our Duty to Combat Oppression",
    date: "14 Feb 2025",
    tag: "News",
    tagColor: "news",
  },
  {
    id: 4,
    title:
      "Standing Against Injustice: Reflections on Gaza, and Our Duty to Combat Oppression",
    date: "14 Feb 2025",
    tag: "Events",
    tagColor: "events",
  },
  {
    id: 5,
    title:
      "Standing Against Injustice: Reflections on Gaza, and Our Duty to Combat Oppression",
    date: "14 Feb 2025",
    tag: "Events",
    tagColor: "events",
  },
];

export default function NewsAndUpdates() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    let scrollSpeed = 0.5; // pixels per frame
    let animationFrameId: number;

    const scroll = () => {
      if (scrollContainer) {
        scrollContainer.scrollTop += scrollSpeed;

        // Reset scroll when reaching the end of the first set
        if (scrollContainer.scrollTop >= scrollContainer.scrollHeight / 2) {
          scrollContainer.scrollTop = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="bg-white w-full py-24 px-4 lg:px-8 xl:px-50">
      <div className="flex flex-col lg:flex-row gap-12 w-full">
        {/* Left Section - Upcoming Events */}
        <div className="flex-[1.6] flex flex-col gap-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-4xl font-semibold text-[#18181b] leading-10">
              Upcoming Events
            </h2>
            <Link
              href="/events"
              className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <span className="text-base text-[#27272a] leading-6">See all</span>
              <Image
                    src={"/assets/news/arrow-icon.svg"}
                    alt={"Arrow Right"}
                    height={6}
                    width={6}
                    className="object-cover"
                  />
            </Link>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-11 gap-y-8">
            {EVENTS.map((event) => (
              <div key={event.id} className="flex flex-col gap-4">
                {/* Event Image with Play Button */}
                <div className="relative w-full h-45.25 rounded-lg overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                  {/* Play Button Overlay */}
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
                    {event.title}
                  </h3>
                  <p className="text-sm text-[#27272a] line-clamp-2 leading-5">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Notice Board */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Header */}
          <h2 className="text-4xl font-semibold text-[#18181b] leading-10">
            Notice Board
          </h2>

          {/* Notices List - Auto Scrolling */}
          <div
            ref={scrollContainerRef}
            className="flex flex-col gap-3.5 overflow-hidden h-150"
          >
            {/* Duplicate notices for seamless infinite scroll */}
            {[...NOTICES, ...NOTICES].map((notice, index) => (
              <div key={`${notice.id}-${index}`} className="flex flex-col gap-2 shrink-0">
                {/* Notice Title */}
                <h3 className="text-lg font-normal text-[#006fee] line-clamp-2 leading-7">
                  {notice.title}
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
                    <span className="text-sm text-[#27272a] leading-5">{notice.date}</span>
                  </div>

                  {/* Tag */}
                  <div
                    className={`px-2 py-1 rounded-lg text-xs leading-4 ${
                      notice.tagColor === "events"
                        ? "bg-[rgba(120,40,200,0.2)] text-[#301050]"
                        : "bg-[rgba(120,40,200,0.2)] text-[#301050]"
                    }`}
                  >
                    {notice.tag}
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
