"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface BannerSlide {
  id: number;
  image: string;
  bannerImage: string;
  title: string;
  description: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton: {
    text: string;
    href: string;
  };
}

const SLIDES: BannerSlide[] = [
  {
    id: 1,
    image: "/assets/hero/banner-1.jpg",
    bannerImage: "/assets/hero/banner-1.jpg",
    title: "Welcome to Masjid Al-Falah",
    description:
      "Masjids, the Arabic word for mosque, serve as places of worship and social centers of Islam, but they also provide in-depth history lessons on architecture and art.",
    primaryButton: {
      text: "Donate",
      href: "/donate",
    },
    secondaryButton: {
      text: "Learn More",
      href: "/about",
    },
  },
  {
    id: 2,
    image: "/assets/hero/banner-1.jpg",
    bannerImage: "/assets/hero/banner-1.jpg",
    title: "Join Our Community",
    description:
      "Be part of a vibrant community dedicated to faith, knowledge, and service. Experience the warmth of brotherhood and sisterhood.",
    primaryButton: {
      text: "Donate",
      href: "/donate",
    },
    secondaryButton: {
      text: "Learn More",
      href: "/about",
    },
  },
  {
    id: 3,
    image: "/assets/hero/banner-1.jpg",
    bannerImage: "/assets/hero/banner-1.jpg",
    title: "Support Our Mission",
    description:
      "Your generous donations help us serve the community through education, outreach, and maintaining our facilities for all to benefit.",
    primaryButton: {
      text: "Donate",
      href: "/donate",
    },
    secondaryButton: {
      text: "Learn More",
      href: "/about",
    },
  },
  {
    id: 4,
    image: "/assets/hero/banner-1.jpg",
    bannerImage: "/assets/hero/banner-1.jpg",
    title: "Monthly Real Talk Programme",
    description:
      "Masjids, the Arabic word for mosque, serve as places of worship and social centers of Islam, but they also provide in-depth history lessons on architecture and art.",
    primaryButton: {
      text: "Donate",
      href: "/donate",
    },
    secondaryButton: {
      text: "Learn More",
      href: "/about",
    },
  },
];

const AUTO_ROTATE_INTERVAL = 5000;

export default function HeroBanner() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(nextSlide, AUTO_ROTATE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  const currentSlideData = SLIDES[currentSlide];

  return (
    <section className="relative w-full h-auto sm:h-125 md:h-137.5 lg:h-150 xl:h-175 overflow-hidden">
      {/* Background Image - Hidden on mobile */}
      <div className="absolute inset-0 hidden sm:block">
        <Image
          src={currentSlideData.image}
          alt={currentSlideData.title}
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
      </div>

      {/* Gradient Background - Full gradient on mobile, overlay on desktop */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#001731] from-[2.344%] to-[#004797] sm:from-[#001731] sm:to-transparent" />

      {/* Mobile Banner Image - Above carousel dots */}
      <div className="relative w-full sm:hidden">
        <div className="relative w-full aspect-[392/260]">
          <Image
            src={currentSlideData.bannerImage}
            alt={currentSlideData.title}
            fill
            className="object-cover object-center"
            priority
            quality={100}
          />
        </div>
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="w-full hn-container px-4 sm:!px-18 py-4 sm:py-8 md:py-10 lg:py-12">
          <div className="max-w-full flex flex-col gap-3 sm:gap-8 md:gap-10 lg:gap-12">
            {/* Carousel Navigation Dots - Top on mobile */}
            <div className="flex sm:hidden items-center justify-center gap-1 h-2">
              {SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`transition-all duration-300 rounded-full w-2 h-2 ${
                    index === currentSlide
                      ? "bg-white"
                      : "bg-white/30 hover:bg-white/50"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Text Content */}
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 text-white lg:max-w-[641px]">
              <h1 className="font-bold text-2xl leading-8 sm:text-3xl sm:leading-9 md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight xl:font-extrabold xl:text-[60px] xl:leading-15">
                {currentSlideData.title}
              </h1>
              <p className="font-medium text-sm leading-5 sm:text-base sm:leading-6 md:text-lg md:leading-7 lg:text-xl lg:leading-relaxed xl:text-2xl xl:leading-8">
                {currentSlideData.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex items-start gap-4 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7">
              {/* Secondary Button - Learn More */}
              <Link
                href={currentSlideData.secondaryButton.href}
                className="bg-[#fafafa] hover:bg-white text-black font-normal text-sm leading-5 px-4 py-0 h-10.5 sm:text-sm sm:leading-5 sm:px-5 sm:h-11 md:text-base md:leading-6 md:px-5.5 md:h-11.5 lg:px-6 lg:h-12 xl:text-base xl:leading-6 xl:px-6 xl:h-12 flex items-center justify-center rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl xl:rounded-xl transition-colors"
              >
                {currentSlideData.secondaryButton.text}
              </Link>

              {/* Primary Button - Donate */}
              <Link
                href={currentSlideData.primaryButton.href}
                className="bg-[#006fee] hover:bg-[#0056cc] text-white font-normal text-sm leading-5 px-4 py-0 h-10.5 sm:text-sm sm:leading-5 sm:px-5 sm:h-11 md:text-base md:leading-6 md:px-5.5 md:h-11.5 lg:px-6 lg:h-12 xl:text-base xl:leading-6 xl:px-6 xl:h-12 flex items-center justify-center rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl xl:rounded-xl transition-colors"
              >
                {currentSlideData.primaryButton.text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Dots - Bottom right on desktop */}
      <div className="absolute bottom-4 right-4 sm:bottom-5 sm:right-5 md:bottom-6 md:right-6 hidden sm:flex items-center gap-2 md:gap-3 lg:gap-4">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full border-2 sm:border-2 md:border-3 w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 lg:w-7 lg:h-7 ${
              index === currentSlide
                ? "bg-[#006fee] border-white"
                : "bg-transparent border-white/50 hover:border-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
