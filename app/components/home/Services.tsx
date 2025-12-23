"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

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
    <section className="relative w-full py-22.5 overflow-hidden">
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

      {/* Header Section */}
      <div className="relative px-4 lg:px-8 xl:px-50 mb-12">
        <div className="flex items-center justify-between">
          {/* Left: Title and Subtitle */}
          <div className="flex flex-col gap-5 text-white max-w-162.5">
            <h2 className="text-5xl font-semibold leading-none">
              Experience. <br />
              Connect. Grow
            </h2>
            <p className="text-lg font-medium leading-7">
              Join us to deepen your faith through service and devotion.
            </p>
          </div>

          {/* Right: View All Services Button */}
          <Link
            href="/services"
            className="relative flex items-center justify-center w-50 h-50 group"
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
            <span className="relative text-lg font-medium text-white leading-7">
              View All Services
            </span>
          </Link>
        </div>
      </div>

      {/* Services Carousel */}
      <div className="relative">
        <div
          ref={scrollContainerRef}
          onScroll={checkScrollPosition}
          className="flex gap-8 px-12 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none" }}
        >
          {SERVICES.map((service) => (
            <div
              key={service.id}
              className="relative shrink-0 w-80 h-112.5 rounded-xl overflow-hidden p-5 flex flex-col justify-between"
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
              <h3 className="relative text-2xl font-semibold text-white leading-8 z-10">
                {service.title}
              </h3>

              {/* Learn More Button */}
              <Link
                href={`/services/${service.id}`}
                className="relative ml-auto z-10 bg-[rgba(63,63,70,0.4)] h-12 px-4 rounded-lg w-40.5 flex items-center justify-center gap-2 hover:bg-[rgba(63,63,70,0.6)] transition-colors"
              >
                <span className="text-base font-normal text-white leading-6">
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

        {/* Navigation Arrows - Responsive positioning */}
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
