"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface OtherService {
  id: string;
  title: string;
  image: string;
  link: string;
}

const SERVICES: OtherService[] = [
  {
    id: "five-daily-prayers",
    title: "Five Daily Prayers",
    image: "/assets/services/service-1.png",
    link: "/services/five-daily-prayers",
  },
  {
    id: "friday-jummuah",
    title: "Friday Jumua'ah sermon",
    image: "/assets/services/service-2.png",
    link: "/services/jummah-prayer",
  },
  {
    id: "taraweeh-eid",
    title: "Taraweeh and Eid Prayers",
    image: "/assets/services/service-3.png",
    link: "/services/taraweeh-prayer",
  },
];

export default function OtherServices() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollPosition = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

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

      setTimeout(checkScrollPosition, 300);
    }
  };

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden">
      {/* Background with gradient and pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(169.508deg, #0C478A 46.629%, #004797 71.1%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-30 bg-repeat"
          style={{
            backgroundImage: "url('/assets/services/bg-pattern.png')",
            backgroundSize: "154px 154px",
          }}
        />
      </div>

      <div className="relative">
        <div className="section-padding mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
            Other Services
          </h2>
        </div>

        {/* Carousel */}
        {/* Grid Layout - Mobile only */}
        <div className="sm:hidden px-4 mb-8 hn-container">
          <div className="grid grid-cols-2 gap-5 w-full grid-style">
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="relative w-full h-51.5 rounded-lg overflow-hidden px-2 py-3 flex flex-col justify-between"
              >
                {/* Background Image */}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/70 to-transparent rounded-lg" />

                {/* Title */}
                <h3 className="relative text-base font-semibold text-white leading-6 z-10">
                  {service.title}
                </h3>

                {/* Learn More Button */}
                <Link
                  href={service.link}
                  className="relative z-10 bg-[rgba(63,63,70,0.4)] h-8 px-3 rounded-lg flex items-center justify-center gap-2 hover:bg-[rgba(63,63,70,0.6)] transition-colors"
                >
                  <span className="text-xs font-normal text-white leading-4">
                    Learn More
                  </span>
                  <div className="w-3.5 h-3.5 relative shrink-0">
                    <Image
                      src="/assets/news/arrow-icon.svg"
                      alt=""
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel - Desktop */}
        <div className="hidden sm:flex items-center gap-4 relative px-4 sm:px-6 lg:px-8 hn-container">
          {/* Navigation Arrows - Left */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${
              canScrollLeft
                ? "bg-[#d4d4d8] hover:bg-[#c4c4c8] cursor-pointer"
                : "bg-[#d4d4d8] opacity-50 cursor-not-allowed"
            }`}
          >
            <Image
              src="/assets/news/arrow-icon.svg"
              alt=""
              height={7}
              width={7}
              className="object-contain rotate-180"
            />
          </button>

          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex-1 flex gap-6 sm:gap-6 md:gap-7 lg:gap-8 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: "none" }}
          >
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="relative shrink-0 w-65 h-95 sm:w-70 sm:h-100 md:w-75 md:h-106.25 lg:w-80 lg:h-112.5 rounded-xl overflow-hidden p-4 sm:p-4 md:p-4.5 lg:p-5 flex flex-col justify-between"
              >
                {/* Background Image */}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/70 to-transparent rounded-xl" />

                {/* Title */}
                <h3 className="relative text-lg sm:text-xl md:text-xl lg:text-2xl font-semibold text-white z-10">
                  {service.title}
                </h3>

                {/* Learn More Button */}
                <Link
                  href={service.link}
                  className="relative ml-auto z-10 bg-[rgba(63,63,70,0.4)] h-10 sm:h-10.5 md:h-11 lg:h-12 px-3 sm:px-3.5 md:px-3.5 lg:px-4 rounded-lg w-35 sm:w-37.5 md:w-39 lg:w-40.5 flex items-center justify-center gap-2 hover:bg-[rgba(63,63,70,0.6)] transition-colors"
                >
                  <span className="text-sm leading-5 sm:text-sm sm:leading-5 md:text-base md:leading-6 lg:text-base lg:leading-6 font-normal text-white">
                    Learn More
                  </span>
                  <div className="w-3 h-3 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 lg:w-3.5 lg:h-3.5 relative shrink-0">
                    <Image
                      src="/assets/news/arrow-icon.svg"
                      alt=""
                      fill
                      className="object-contain brightness-0 invert"
                    />
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Navigation Arrows - Right */}
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${
              canScrollRight
                ? "bg-[#d4d4d8] hover:bg-[#c4c4c8] cursor-pointer"
                : "bg-[#d4d4d8] opacity-50 cursor-not-allowed"
            }`}
          >
            <Image
              src="/assets/news/arrow-icon.svg"
              alt=""
              height={7}
              width={7}
              className="object-contain"
            />
          </button>
        </div>
      </div>
    </section>
  );
}
