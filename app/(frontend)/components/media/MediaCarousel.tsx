"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import MediaCard, { MediaItem } from "./MediaCard";

interface MediaCarouselProps {
  items: MediaItem[];
  title?: string;
}

export default function MediaCarousel({
  items = [],
  title = "Related Media",
}: MediaCarouselProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      // Tolerance of 5px
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      window.addEventListener("resize", checkScroll);
      return () => {
        scrollContainer.removeEventListener("scroll", checkScroll);
        window.removeEventListener("resize", checkScroll);
      };
    }
  }, [items]);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      // Scroll by roughly one item width + gap
      // 350px width + 24/32px gap ~ 400px
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

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
        {/* Header */}
      <div className="flex items-center justify-between gap-2 sm:gap-0 flex-wrap mb-6 sm:mb-8">
        <h2 className="text-2xl md:text-3xl font-semibold">{title}</h2>

            {/* Navigation Arrows */}
        <div className="flex items-center gap-4 self-end">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? "bg-[#d4d4d8] hover:bg-[#c4c4c8] cursor-pointer"
                    : "bg-[#d4d4d8] opacity-50 cursor-not-allowed"
                }`}
                aria-label="Scroll left"
              >
                {/* Using common arrow if available, or fallback SVG */}
                <Image
                  src="/assets/sermons/arrow-left.svg" // Assuming existence based on Sermons.tsx
                  alt="Previous"
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
                 aria-label="Scroll right"
              >
                <Image
                  src="/assets/sermons/arrow-right.svg" // Assuming existence based on Sermons.tsx
                  alt="Next"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </button>
            </div>
        </div>

      {/* Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex flex-row gap-4 sm:gap-6 lg:gap-8 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
          {items.map((item) => (
            <div
              key={item.id}
              className="shrink-0 w-full md:w-[350px] lg:w-[calc((100%-64px)/3)]"
            >
              <MediaCard media={item} layout="grid" />
            </div>
          ))}
      </div>
    </div>
  );
}
