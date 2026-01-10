"use client";

import { useState } from "react";
import Image from "next/image";
import { FaQuoteLeft, FaQuoteRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface ServiceQuoteProps {
  quote?: {
    text: string;
    attribution: string;
  };
  testimonials?: {
    text: string;
    attribution: string;
  }[];
  images: string[];
}

export default function ServiceQuote({ quote, testimonials = [], images }: ServiceQuoteProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Combine single quote and testimonials array, defaulting to empty array if neither exist
  // If testimonials are provided, use them. If not, use the single quote if available.
  const allTestimonials = testimonials.length > 0
    ? testimonials
    : (quote ? [quote] : []);

  const nextSlide = () => {
    setCurrentIndex((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => prev - 1);
  };

  const getSafeIndex = (index: number, length: number) => {
    if (length === 0) return 0;
    return ((index % length) + length) % length;
  };

  const currentImageIndex = getSafeIndex(currentIndex, images.length);
  const currentTestimonialIndex = getSafeIndex(currentIndex, allTestimonials.length);

  const currentTestimonial = allTestimonials[currentTestimonialIndex] || { text: "", attribution: "" };

  return (
    <section className="w-full my-16">
      <div className="section-padding">
        <div className="flex flex-col lg:flex-row border border-[#CCE3FD] bg-white rounded-lg  shadow-sm overflow-hidden lg:min-h-[400px]">
          {/* Quote Section */}
          <div className="w-full lg:max-w-[496px] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
            <div className="space-y-4">
              <Image
                src="/assets/common/double-quote-left.svg"
                alt="Quote Icon"
                width={24}
                height={24}
              />

              <div className="space-y-2" key={currentIndex}>
                <p className="text-base md:text-base">
                  <span className="font-bold text-black">{currentTestimonial.attribution}</span>
                  {currentTestimonial.text}
                </p>
              </div>

              <div className="flex justify-end">
                <Image
                  src="/assets/common/double-quote-right.svg"
                  alt="Quote Icon"
                  width={24}
                  height={24}
                />
              </div>
            </div>
          </div>

          {/* Carousel Section */}
          <div className="w-full lg:flex-1 relative min-h-[300px] lg:min-h-full">
            {images.length > 0 && (
              <Image
                src={images[currentImageIndex]}
                alt="Service gallery image"
                fill
                className="object-cover object-center"
                priority
              />
            )}

            {/* Navigation Buttons */}
            <div className="absolute bottom-6 right-6 flex">
              <button
                onClick={prevSlide}
                className="p-3.5 flex items-center justify-center bg-[#D4D4D866] text-white rounded-l-lg backdrop-blur-sm transition-all cursor-pointer"
                aria-label="Previous slide"
              >
                <Image
                  src="/assets/sermons/arrow-left.svg"
                  alt=""
                  width={20}
                  height={20}
                  className={`object-contain transition-colors text-white`}
                />
              </button>
              <button
                onClick={nextSlide}
                className="h-12 w-12 flex items-center justify-center bg-[#006FEE] text-white rounded-r-lg cursor-pointer"
                aria-label="Next slide"
              >
                <Image
                  src="/assets/common/right-arrow-icon-white.svg"
                  alt=""
                  width={10}
                  height={10}
                  className="object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
