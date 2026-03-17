'use client';

import Image from '@/components/common/CustomImage';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Media } from '../../../../payload-types';

export interface BannerSlide {
  id: number | string;
  image: string | Media;
  bannerImage?: string | Media | null;
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
  animationSpeed?: number | null;
}

interface PayloadBanner extends Omit<BannerSlide, 'bannerImage'> {
  mobileImage?: string | Media | null;
  bannerImage?: string | Media | null;
}

interface HeroBannerProps {
  banners: PayloadBanner[];
  animationStyle?: string | null;
  animationSpeed?: number | null;
}

export default function HeroBanner({ banners = [], animationStyle, animationSpeed }: HeroBannerProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Touch swipe support (mobile only)
  const touchStartX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50; // minimum px to count as a swipe

  const slides: BannerSlide[] = banners.map(banner => ({
    id: banner.id,
    title: banner.title,
    description: banner.description,
    image: banner.image,
    bannerImage: banner.mobileImage,
    primaryButton: banner.primaryButton,
    secondaryButton: banner.secondaryButton,
  }));
  // If no slides are provided, don't render anything or render a placeholder
  const hasSlides = slides && slides.length > 0;

  const nextSlide = useCallback(() => {
    if (!hasSlides) return;
    setCurrentSlide(prev => (prev + 1) % slides.length);
  }, [slides.length, hasSlides]);

  const prevSlide = useCallback(() => {
    if (!hasSlides) return;
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length);
  }, [slides.length, hasSlides]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return; // too short, ignore
    if (delta > 0) {
      // Swiped left → next slide
      nextSlide();
    } else {
      // Swiped right → previous slide
      prevSlide();
    }
    // Brief auto-rotate pause after a manual swipe
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 8000);
    touchStartX.current = null;
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsPaused(true);
    setTimeout(() => setIsPaused(false), 10000);
  };

  useEffect(() => {
    if (isPaused || !hasSlides) return;

    const intervalTime = animationSpeed || 5000;
    const interval = setInterval(nextSlide, intervalTime);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, hasSlides, animationSpeed]);

  if (!hasSlides) {
    return null;
  }

  const currentSlideData = slides[currentSlide];

  // Helper to get image URL
  const getImageUrl = (img: string | Media | null | undefined) => {
    if (!img) return '';
    if (typeof img === 'string') return img;
    return img.url || '';
  };

  const desktopImage = getImageUrl(currentSlideData?.image);
  const mobileImage =
    getImageUrl(currentSlideData?.bannerImage) || desktopImage;

  // --- Animation Styles Processing ---
  const styleType = animationStyle || 'fade';

  const getAnimationClasses = (type: string) => {
    switch (type) {
      case 'fade':
        return 'animate-fadeIn';
      case 'slideUp':
        return 'animate-slideUp';
      case 'slideRight':
        return 'animate-slideRight';
      case 'zoom':
        return 'animate-zoomIn';
      case 'none':
      default:
        return '';
    }
  };

  // Create a stable key so React unmounts and remounts, triggering animations on slide change
  const animKey = `slide-${currentSlide}`;
  const animBaseClass = getAnimationClasses(styleType);

  // We remove inline animationDuration so it uses the defaults defined in globals.css (1s)

  return (
    <>
      {/* Desktop Hero Section */}
      <section className="relative w-full hidden sm:block sm:h-125 md:h-137.5 overflow-hidden lg:h-[calc(100vh-155px)] bg-[#001731]">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const desktopImg = getImageUrl(slide.image);
          const animClass = getAnimationClasses(styleType);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              style={{
                backgroundImage: desktopImg ? `url('${desktopImg}')` : 'none',
              }}
            >
              {/* Gradient overlay for desktop */}
              <div className="absolute inset-0 bg-linear-to-r from-[#001731] to-transparent" />

              {/* Desktop Content */}
              <div className={`relative h-full flex items-center ${isActive ? animClass : ''}`}>
                <div className="w-full section-padding py-8 md:py-10 lg:py-12">
                  <div className="max-w-full flex flex-col gap-8 md:gap-10 lg:gap-12">
                    {/* Text Content */}
                    <div className="flex flex-col gap-5 md:gap-6 lg:gap-8 xl:gap-10 text-white lg:max-w-160.25">
                      <h1 className="font-bold text-3xl leading-9 md:text-4xl md:leading-tight lg:text-5xl lg:leading-tight xl:font-extrabold xl:text-[60px] xl:leading-15">
                        {slide.title}
                      </h1>
                      <p className="font-medium text-base leading-6 md:text-lg md:leading-7 lg:text-xl lg:leading-relaxed xl:text-2xl xl:leading-8">
                        {slide.description}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-start gap-4 md:gap-5 lg:gap-6 xl:gap-7">
                      <Link
                        href={slide.secondaryButton?.href || '#'}
                        className="bg-[#fafafa] hover:bg-white text-black font-normal text-sm leading-5 px-5 h-11 md:text-base md:leading-6 md:px-5.5 md:h-11.5 lg:px-6 lg:h-12 xl:text-base xl:leading-6 xl:px-6 xl:h-12 flex items-center justify-center rounded-lg md:rounded-xl transition-colors"
                      >
                        {slide.secondaryButton?.text}
                      </Link>

                      <Link
                        href={slide.primaryButton?.href || '#'}
                        className="bg-[#006fee] hover:bg-[#0056cc] text-white font-normal text-sm leading-5 px-5 h-11 md:text-base md:leading-6 md:px-5.5 md:h-11.5 lg:px-6 lg:h-12 xl:text-base xl:leading-6 xl:px-6 xl:h-12 flex items-center justify-center rounded-lg md:rounded-xl transition-colors"
                      >
                        {slide.primaryButton?.text}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Carousel Navigation Dots - Bottom right on desktop */}
        <div className="absolute bottom-5 right-5 md:bottom-6 md:right-6 flex items-center gap-2 md:gap-3 lg:gap-4 z-20">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full border-2 md:border-3 w-5.5 h-5.5 md:w-6 md:h-6 lg:w-7 lg:h-7 cursor-pointer ${index === currentSlide
                ? 'bg-[#006fee] border-white'
                : 'bg-transparent border-white/50 hover:border-white'
                }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Mobile Hero Section — touch swipe enabled */}
      <section
        className="relative w-full h-[600px] overflow-hidden sm:hidden bg-[#001731]"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          const desktopImg = getImageUrl(slide.image);
          const mobileImg = getImageUrl(slide.bannerImage) || desktopImg;
          const animClass = getAnimationClasses(styleType);

          return (
            <div
              key={slide.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${isActive ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
            >
              {/* Full gradient background on mobile */}
              <div className="absolute inset-0 bg-linear-to-r from-[#001731] from-[2.344%] to-[#004797]" />

              {/* Mobile Banner Image */}
              <div className="relative w-full">
                <div className="relative w-full aspect-392/260">
                  {mobileImg && (
                    <Image
                      src={mobileImg}
                      alt={slide.title}
                      fill
                      className="object-cover object-center"
                      priority={index === 0}
                      quality={100}
                    />
                  )}
                </div>
              </div>

              {/* Mobile Content */}
              <div className={`relative flex items-center ${isActive ? animClass : ''}`}>
                <div className="w-full section-padding py-4">
                  <div className="max-w-full flex flex-col gap-3">
                    {/* Carousel Navigation Dots - Centered above content on mobile */}
                    <div className="flex items-center justify-center gap-1.5 h-2 mb-1">
                      {slides.map((_, dotIndex) => (
                        <button
                          key={dotIndex}
                          onClick={() => goToSlide(dotIndex)}
                          className={`transition-all duration-300 rounded-full cursor-pointer ${dotIndex === currentSlide
                            ? 'bg-white w-4 h-1.5'
                            : 'bg-white/40 hover:bg-white/60 w-1.5 h-1.5'
                            }`}
                          aria-label={`Go to slide ${dotIndex + 1}`}
                        />
                      ))}
                    </div>

                    {/* Text Content */}
                    <div className="flex flex-col gap-4 text-white">
                      <h1 className="font-bold text-2xl leading-8">
                        {slide.title}
                      </h1>
                      <p className="font-medium text-sm leading-5">
                        {slide.description}
                      </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex items-start gap-4">
                      <Link
                        href={slide.secondaryButton?.href || '#'}
                        className="bg-[#fafafa] hover:bg-white text-black font-normal text-sm leading-5 px-4 h-10.5 flex items-center justify-center rounded-lg transition-colors"
                      >
                        {slide.secondaryButton?.text}
                      </Link>

                      <Link
                        href={slide.primaryButton?.href || '#'}
                        className="bg-[#006fee] hover:bg-[#0056cc] text-white font-normal text-sm leading-5 px-4 h-10.5 flex items-center justify-center rounded-lg transition-colors"
                      >
                        {slide.primaryButton?.text}
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </>
  );
}
