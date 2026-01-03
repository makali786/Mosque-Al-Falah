"use client";

import { useState } from "react";
import Image from "next/image";
import { FaQuoteLeft, FaQuoteRight, FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface ServiceQuoteProps {
  quote: {
    text: string;
    attribution: string;
  };
  images: string[];
}

export default function ServiceQuote({ quote, images }: ServiceQuoteProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <section className="w-full py-16 lg:max-h-[400px]">
      <div className="section-padding">
        <div className="flex flex-col lg:flex-row border border-[#CCE3FD] bg-white rounded-lg  shadow-sm overflow-hidden">
          {/* Quote Section */}
          <div className="w-full lg:max-w-[496px] p-8 md:p-12 lg:p-16 flex flex-col justify-center relative">
            <div className="space-y-4">
              <Image
                src="/assets/common/double-quote-left.svg"
                alt="Quote Icon"
                width={24}
                height={24}
              />

              <div className="space-y-2">
                <p className="text-base md:text-base">
                  <span className="font-bold text-black">{quote.attribution}</span>
                  {quote.text}
                </p>
                <p>
                  - Sahih al-Bukhari
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
          <div className="w-full lg:max-w-[640px] w-[640px] relative min-h-[300px] lg:min-h-full">
            <div className="absolute inset-0">
              <Image
                src={images[currentSlide]}
                alt="Slide"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* Navigation Buttons */}
            <div className="absolute bottom-6 right-6 flex">
              <button
                onClick={prevSlide}
                className="p-3.5 flex items-center justify-center bg-[#D4D4D866] text-white rounded-l-lg backdrop-blur-sm transition-all"
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
                className="h-12 w-12 flex items-center justify-center bg-[#006FEE] text-white rounded-r-lg"
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
