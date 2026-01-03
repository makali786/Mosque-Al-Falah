"use client";

import { useState } from "react";
import Image from "next/image";

interface CarouselContent {
  id: number;
  text: string;
  image: string;
}

interface ServiceContentCarouselProps {
  items: CarouselContent[];
}

export default function ServiceContentCarousel({ items }: ServiceContentCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + items.length) % items.length);
  };

  return (
    <section className="w-full my-16 lg:max-h-[400px] relative">
      <div className="section-padding">
        <div className="flex flex-col lg:flex-row border border-[#CCE3FD] bg-[#EBF5FF] shadow-sm overflow-hidden lg:min-h-[400px]">
          {/* Text Section */}
          <div className="w-full lg:max-w-[496px] p-8 md:p-12 lg:px-6 lg:py-[116px] flex flex-col  relative">
            <div className="space-y-6">
              {/* Number Badge */}
              <div className="absolute top-0 left-0 h-[70px] w-[70px] bg-[#D1E9FF] flex items-center justify-center">
                 <span className="text-[#006FEE] text-2xl sm:text-4xl font-bold">{items[currentSlide].id}</span>
              </div>

              <div className="space-y-2">
                <p className="text-base md:text-lg leading-relaxed text-[#1F2937]">
                  {items[currentSlide].text}
                </p>
              </div>
                <div className="absolute bottom-0 right-0 flex">
              <button
                onClick={prevSlide}
                className="w-14 h-14 flex items-center justify-center bg-[#D4D4D8] text-white backdrop-blur-sm transition-all hover:bg-[#D4D4D888]"
                aria-label="Previous slide"
              >
                <Image
                  src="/assets/sermons/arrow-left.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </button>
              <button
                onClick={nextSlide}
                className="w-14 h-14 flex items-center justify-center bg-[#006FEE] text-white transition-all hover:bg-[#005BC4]"
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

          {/* Carousel Section */}
          <div className="w-full lg:flex-1 relative min-h-[300px] lg:min-h-full">
            <div className="absolute inset-0">
               {/* Use a key to force re-render/animation if needed, or just src change */}
              <Image
                src={items[currentSlide].image}
                alt={`Slide ${items[currentSlide].id}`}
                fill
                className="object-cover"
                priority
              />
            </div>

          
          </div>
        </div>
      </div>
    </section>
  );
}
