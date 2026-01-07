"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

interface TestimonialItem {
  id: string;
  title: string;
  quote: string;
  rating: number;
  authorName: string;
  authorInitials: string;
  authorRole: string;
}

interface ParentReviewsProps {
  testimonials: TestimonialItem[];
  sectionLabel?: string;
  sectionTitle?: string;
}

export default function WhatParentsSay({
  testimonials,
  sectionLabel = "What Parents Say",
  sectionTitle = "Inspiring journeys of faith, learning, and growth."
}: ParentReviewsProps) {
  // Fallback if no testimonials
  const reviews = testimonials && testimonials.length > 0 ? testimonials : [
// Optional: Keep one or two placeholders if really needed, or just render empty.
// For now, I'll rely on the dynamic data.
  ];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
        scrollContainer.addEventListener("scroll", checkScroll);
        // Initial check
        checkScroll();
        return () => scrollContainer.removeEventListener("scroll", checkScroll);
    }
  }, []);

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
    }
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="section-padding flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-3 max-w-2xl">
            <h4 className="text-[#006FEE] font-bold text-sm tracking-wide uppercase">{sectionLabel}</h4>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#27272a] leading-tight">
              {sectionTitle}
                </h2>
            </div>
            
             {/* Navigation Arrows */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  canScrollLeft
                  ? "bg-[#F4F4F5] text-black cursor-pointer"
                    : "bg-[#F4F4F5] text-gray-300 cursor-not-allowed"
                }`}
              >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg>
              </button>

              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  canScrollRight
                  ? "bg-[#E6F1FE] text-[#006FEE] cursor-pointer"
                    : "bg-[#E6F1FE] text-[#006FEE]/30 cursor-not-allowed"
                }`}
              >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg>
              </button>
            </div>
        </div>

        {/* Carousel */}
        <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
            {reviews.map((review, index) => (
                <div 
                    key={index} 
                className="flex-shrink-0 w-[85vw] sm:w-[400px] lg:w-[357px] p-10 rounded-2xl flex flex-col gap-4 bg-[#FAFAFA] border border-[#E4E4E7]"
                >
                {/* Top Row: Stars and Quote Icon */}
                <div className="flex justify-between items-center">
                  {/* Stars */}
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 1L12.939 6.955L19.511 7.91L14.756 12.545L15.878 19.09L10 16L4.122 19.09L5.244 12.545L0.489001 7.91L7.061 6.955L10 1Z" fill="#F59E0B" stroke="#F59E0B" strokeLinejoin="round" />
                      </svg>
                    ))}
                  </div>

                  {/* Quote Icon */}
                  <div className="relative w-6 h-4">
                    <Image
                      src="/assets/common/double-quote-right.svg"
                      alt="Quote"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                    
                {/* Content */}
                <div className="flex flex-col gap-3">
                  <h3 className="font-medium text-base">
                    {review.title}
                  </h3>
                  <p className="text-sm">
                    {review.quote}
                  </p>
                </div>
                    
                {/* Author */}
                <div className="flex items-center gap-3 mt-auto pt-4">
                  <div className="w-10 h-10 rounded-full bg-[#D4D4D8] flex items-center justify-center text-[#11181C] text-base">
                    {review.authorInitials}
                        </div>
                  <span className="text-[#11181C] text-sm">
                    {review.authorName}
                  </span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
