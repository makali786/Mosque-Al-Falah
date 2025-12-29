"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface Service {
  id: number;
  image: string;
  title: string;
}

const SERVICES: Service[] = [
  {
    id: 1,
    image: "/assets/services/service-1.png",
    title: "Five Daily Prayers",
  },
  {
    id: 2,
    image: "/assets/services/service-2.png",
    title: "Friday Jumua'ah sermon",
  },
  {
    id: 3,
    image: "/assets/services/service-3.png",
    title: "Taraweeh and Eid Prayers",
  },
  {
    id: 4,
    image: "/assets/services/service-4.png",
    title: "Food bank",
  },
  {
    id: 5,
    image: "/assets/services/service-5.png",
    title: "Madrasah & Hifdh Class",
  },
  {
    id: 6,
    image: "/assets/services/service-6.png",
    title: "Weekly Adult Classes",
  },
  {
    id: 7,
    image: "/assets/services/service-7.png",
    title: "Nikaah Marriage Service",
  },
  {
    id: 8,
    image: "/assets/services/service-8.png",
    title: "Regular Educational Events",
  },
  {
    id: 9,
    image: "/assets/services/service-9.png",
    title: "Youth Activities",
  },
];

export default function Services() {
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
    <section className="relative w-full py-8 sm:py-22.5 overflow-hidden">
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

      {/* Header Section - Responsive */}
      <div className="relative px-4 sm:px-6 md:px-8 lg:px-12 xl:px-50 mb-6 sm:mb-8 md:mb-10 lg:mb-12">
        <div className="flex items-center justify-between h-32 sm:h-auto">
          {/* Left: Title and Subtitle */}
          <div className="flex flex-col gap-4 sm:gap-4 md:gap-4.5 lg:gap-5 text-white flex-1 sm:max-w-none md:max-w-140 lg:max-w-162.5">
            <h2 className="text-2xl leading-8 font-medium sm:text-[34px] sm:leading-9 md:text-4xl md:leading-10 lg:text-5xl lg:leading-none sm:font-medium md:font-semibold lg:font-semibold">
              Experience. <br />
              Connect. Grow
            </h2>
            <p className="text-sm leading-5 font-medium sm:text-base sm:leading-6 md:text-base md:leading-6 lg:text-lg lg:leading-7">
              Join us to deepen your faith through service and devotion.
            </p>
          </div>

          {/* Right: View All Services Button */}
          <Link
            href="/services"
            className="relative flex items-center justify-center w-31.5 h-31.5 sm:w-37.5 sm:h-37.5 md:w-43.75 md:h-43.75 lg:w-50 lg:h-50 shrink-0"
          >
            {/* Circle Background SVG */}
            <div className="absolute inset-0">
              <Image
                src="/assets/services/circle-bg.svg"
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <span className="relative text-base leading-6 font-normal sm:text-base sm:leading-6 md:text-base md:leading-6 lg:text-lg lg:leading-7 sm:font-normal md:font-medium lg:font-medium text-white text-center w-18 sm:w-20 md:w-22 lg:w-auto">
              View All Services
            </span>
          </Link>
        </div>
      </div>

      {/* Grid Layout - Mobile only */}
      <div className="sm:hidden px-4">
        <div className="grid grid-cols-2 gap-5 w-full">
          {SERVICES.slice(0, 6).map((service) => (
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
                href={`/services/${service.id}`}
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

      {/* Desktop: Carousel */}
      <div className="relative hidden sm:block">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="flex gap-6 sm:gap-6 md:gap-7 lg:gap-8 px-6 sm:px-8 md:px-10 lg:px-12 overflow-x-auto scrollbar-hide"
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
              <h3 className="relative text-lg leading-7 sm:text-xl sm:leading-7 md:text-xl md:leading-7.5 lg:text-2xl lg:leading-8 font-semibold text-white z-10">
                {service.title}
              </h3>

              {/* Learn More Button */}
              <Link
                href={`/services/${service.id}`}
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

        {/* Navigation Arrows */}
        <button
          onClick={() => scroll("left")}
          disabled={!canScrollLeft}
          className={`absolute top-1/2 -translate-y-1/2 left-4 lg:left-8 xl:left-16 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${
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

        <button
          onClick={() => scroll("right")}
          disabled={!canScrollRight}
          className={`absolute top-1/2 -translate-y-1/2 right-4 lg:right-8 xl:right-16 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${
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
    </section>
  );
}
