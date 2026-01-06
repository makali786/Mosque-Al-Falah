"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";

const reviews = [
  {
    rating: 5,
    title: "A Truly Transformative Experience",
    text: "My children have grown immensely in both faith and character since joining the Madrasah. The teachers are kind, knowledgeable, and truly dedicated to nurturing Islamic values.",
    author: "Imran Aslam",
    initials: "IA"
  },
  {
    rating: 5,
    title: "A Safe and Supportive Learning Environment",
    text: "The Madrasah provides a warm and welcoming atmosphere where my son feels comfortable asking questions and learning about Islam. He looks forward to attending every day!",
    author: "Sameerah K.",
    initials: "SK"
  },
  {
    rating: 5,
    title: "Excellent Quranic Education",
    text: "I am amazed at how quickly my daughter learned to read the Quran with proper Tajweed. The structured lessons and personalized attention have made a huge difference.",
    author: "Fahad A.",
    initials: "FA"
  },
   {
    rating: 5,
    title: "Great Community",
    text: "More than just a school, it's a community. We feel so connected to the mosque and other families.",
    author: "Zainab M.",
    initials: "ZM"
  }
];

export default function WhatParentsSay() {
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
                <h4 className="text-[#006FEE] font-bold text-sm tracking-wide uppercase">What Parents Say</h4>
                <h2 className="text-3xl lg:text-4xl font-bold text-[#27272a] leading-tight">
                    Inspiring journeys of faith, learning, and growth.
                </h2>
            </div>
            
             {/* Navigation Arrows */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  canScrollLeft
                    ? "bg-[#F4F4F5] hover:bg-[#E4E4E7] text-black cursor-pointer"
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
                    ? "bg-[#E6F1FE] hover:bg-[#D4E8FE] text-[#006FEE] cursor-pointer"
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
                    className="min-w-[320px] md:min-w-[400px] bg-[#F8FAFC] p-8 rounded-xl flex flex-col gap-4 border border-transparent hover:border-gray-200 transition-colors"
                >
                    <div className="flex gap-1">
                        {[...Array(5)].map((_, i) => (
                             <svg key={i} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10 1L12.939 6.955L19.511 7.91L14.756 12.545L15.878 19.09L10 16L4.122 19.09L5.244 12.545L0.489001 7.91L7.061 6.955L10 1Z" fill="#F59E0B" stroke="#F59E0B" strokeLinejoin="round"/>
                             </svg>
                        ))}
                    </div>
                    {/* Quote Icon */}
                    <div className="text-4xl text-black font-serif leading-4 h-6">”</div>
                    
                    <h3 className="font-bold text-lg text-[#27272a]">{review.title}</h3>
                    <p className="text-[#52525b] text-base leading-relaxed flex-1">
                        {review.text}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-2">
                        <div className="w-10 h-10 rounded-full bg-[#E4E4E7] flex items-center justify-center font-bold text-[#52525b]">
                            {review.initials}
                        </div>
                        <span className="font-medium text-[#27272a]">{review.author}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
