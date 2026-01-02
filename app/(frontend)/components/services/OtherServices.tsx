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

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative">
        {/* Header */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-10 sm:mb-14">
          Other Services
        </h2>

        {/* Carousel Container */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            onScroll={checkScrollPosition}
            className="flex gap-6 sm:gap-6 md:gap-8 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {SERVICES.map((service) => (
              <div
                key={service.id}
                className="relative shrink-0 w-[280px] h-[400px] sm:w-[320px] sm:h-[460px] md:w-[360px] md:h-[500px] rounded-2xl overflow-hidden group border border-white/10"
              >
                {/* Background Image */}
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  // Using placeholder image if specific ones don't exist
                  onError={(e) => {
                    e.currentTarget.src = "/assets/about-us/about-us.jpg";
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Content */}
                <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
                  <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight z-10 transition-transform duration-300 group-hover:-translate-y-1">
                    {service.title}
                  </h3>

                  <Link
                    href={service.link}
                    className="self-end mt-auto flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2.5 rounded-lg text-white text-sm sm:text-base font-medium transition-all group-hover:bg-white/40"
                  >
                    <span>Learn More</span>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6"/>
                    </svg>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`absolute top-1/2 -translate-y-1/2 -left-4 sm:-left-12 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${
              canScrollLeft
                ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md cursor-pointer border border-white/10"
                : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
            }`}
            aria-label="Scroll left"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="rotate-180">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>

          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`absolute top-1/2 -translate-y-1/2 -right-4 sm:-right-12 w-12 h-12 rounded-full flex items-center justify-center transition-all z-10 ${
              canScrollRight
                ? "bg-white/20 hover:bg-white/30 text-white backdrop-blur-md cursor-pointer border border-white/10"
                : "bg-white/5 text-white/30 cursor-not-allowed border border-white/5"
            }`}
             aria-label="Scroll right"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
