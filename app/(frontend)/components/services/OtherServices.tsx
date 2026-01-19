"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface OtherService {
  id: string;
  title: string;
  slug: string;
  cardImage?: {
    url: string;
    alt?: string;
  };
}

interface OtherServicesProps {
  services?: OtherService[];
}

export default function OtherServices({ services = [] }: OtherServicesProps) {
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
        <div className="flex items-center gap-4 sm:gap-6 relative px-0 sm:px-6 lg:px-8 hn-container">
          {/* Navigation Arrows - Left */}
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`hidden sm:flex shrink-0 w-12 h-12 rounded-full items-center justify-center transition-all z-10 ${
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
            className="flex-1 flex gap-4 sm:gap-6 md:gap-7 lg:gap-8 overflow-x-auto scrollbar-hide px-4 sm:px-0"
            style={{ scrollbarWidth: "none" }}
          >
            {services.map((service) => (
              <div
                key={service.id}
                className="relative shrink-0 w-full sm:w-80 lg:w-[357px] h-[280px] sm:h-[400px] md:h-[450px] lg:h-[450px] rounded-xl overflow-hidden p-3 sm:p-4 md:p-4.5 lg:p-5 flex flex-col justify-between"
              >
                {/* Background Image */}
                <Image
                  src={service.cardImage?.url || '/assets/services/service-1.png'}
                  alt={service.cardImage?.alt || service.title}
                  fill
                  className="object-cover"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/70 to-transparent rounded-xl" />

                {/* Title */}
                <h3 className="relative text-base sm:text-xl md:text-xl lg:text-2xl font-semibold text-white z-10">
                  {service.title}
                </h3>

                {/* Learn More Button */}
                <Link
                  href={`/our-services/${service.slug}`}
                  className="relative ml-auto z-10 bg-[rgba(63,63,70,0.4)] h-9 sm:h-10.5 md:h-11 lg:h-12 px-2.5 sm:px-3.5 md:px-3.5 lg:px-4 rounded-lg w-auto sm:w-37.5 md:w-39 lg:w-40.5 flex items-center justify-center gap-2 hover:bg-[rgba(63,63,70,0.6)] transition-colors"
                >
                  <span className="text-xs leading-4 sm:text-sm sm:leading-5 md:text-base md:leading-6 font-normal text-white whitespace-nowrap">
                    Learn More
                  </span>
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 relative shrink-0">
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
            className={`hidden sm:flex shrink-0 w-12 h-12 rounded-full items-center justify-center transition-all z-10 ${
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
