"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";

interface BannerSlide {
  id: number;
  image: string;
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
    <section className="relative w-full h-125 lg:h-150 xl:h-175 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentSlideData.image}
          alt={currentSlideData.title}
          fill
          className="object-cover object-center"
          priority
          quality={100}
        />
      </div>

      {/* Dark Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-r from-[#001731] from-[2.344%] to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="px-4 lg:px-8 xl:px-50">
          <div className="max-w-162.5 flex flex-col gap-16">
            {/* Text Content */}
            <div className="flex flex-col gap-10 text-white">
              <h1 className="font-extrabold text-4xl lg:text-5xl xl:text-[60px] leading-tight xl:leading-15">
                {currentSlideData.title}
              </h1>
              <p className="font-medium text-lg lg:text-xl xl:text-2xl leading-relaxed xl:leading-8">
                {currentSlideData.description}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-7">
              {/* Secondary Button - Learn More */}
              <Link
                href={currentSlideData.secondaryButton.href}
                className="bg-[#fafafa] hover:bg-white text-black font-normal text-base leading-6 px-6 py-3 h-12 flex items-center justify-center rounded-xl transition-colors"
              >
                {currentSlideData.secondaryButton.text}
              </Link>

              {/* Primary Button - Donate */}
              <Link
                href={currentSlideData.primaryButton.href}
                className="bg-[#006fee] hover:bg-[#0056cc] text-white font-normal text-base leading-6 px-6 py-3 h-12 flex items-center justify-center rounded-xl transition-colors"
              >
                {currentSlideData.primaryButton.text}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Navigation Dots */}
      <div className="absolute bottom-6 right-6 flex items-center gap-4">
        {SLIDES.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full border-3 w-7 h-7 ${
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
