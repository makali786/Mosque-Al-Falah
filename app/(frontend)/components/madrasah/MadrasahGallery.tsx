"use client";

import { useState } from "react";
import Image from "next/image";

const galleryImages = [
  "/assets/madrasah/gallery-1.jpg",
  "/assets/madrasah/gallery-2.jpg",
  "/assets/madrasah/gallery-3.jpg",
  "/assets/madrasah/gallery-4.jpg",
  "/assets/madrasah/gallery-5.jpg",
];

export default function MadrasahGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextImage = () => {
    setActiveIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const prevImage = () => {
    setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20">
      <div className="section-padding flex flex-col lg:flex-row gap-12 lg:gap-20">
        {/* Left Content */}
        <div className="flex flex-col lg:w-1/2 justify-center">
            <div className="flex flex-col gap-3">
                <h4 className="text-[#006FEE] font-medium text-lg uppercase">OUR MADRASAH MOMENTS</h4>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#27272a]">
                    Madrasah Gallery
                </h2>
            </div>
            <p className="text-base sm:text-lg mt-8">
                Explore our gallery showcasing the vibrant learning environment, engaging Islamic lessons, interactive activities, and more. See the dedication of our students and teachers in nurturing faith, knowledge, and community spirit.
            </p>
            <div className="flex flex-wrap gap-6 mt-16">
                <button className="bg-[#3F3F46] text-white px-6 py-3 rounded-lg font-medium hover:bg-black transition-colors">
                    Contact Us
                </button>
                <button className="bg-[#006FEE] text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
                    Book Your Tour
                </button>
            </div>
        </div>

        {/* Right Gallery */}
        <div className="flex flex-col gap-4 lg:w-1/2">
            {/* Main Image */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden lg:max-h-[359px]">
                 <div className="absolute inset-0 bg-gray-200" />
                 <Image
                    src={galleryImages[activeIndex]}
                    alt="Madrasah Gallery"
                    fill
                    className="object-cover"
                 />
                 
                 {/* Arrows */}
                 <button 
                    onClick={prevImage}
                    className="absolute left-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#D4D4D8] rounded-[12px] flex items-center justify-center cursor-pointer hover:bg-[#c4c4c8] transition-colors"
                 >
                    <Image
                      src="/assets/sermons/arrow-left.svg"
                      alt="Previous"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                 </button>
                 <button 
                    onClick={nextImage}
                    className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#D4D4D8] rounded-[12px] flex items-center justify-center cursor-pointer hover:bg-[#c4c4c8] transition-colors"
                 >
                    <Image
                      src="/assets/sermons/arrow-left.svg"
                      alt="Next"
                      width={20}
                      height={20}
                      className="object-contain rotate-180"
                    />
                 </button>

                 {/* Dots */}
                 <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {galleryImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                                idx === activeIndex 
                                    ? "bg-white scale-110" 
                                    : "bg-white/50 hover:bg-white/75"
                            }`}
                            aria-label={`Go to slide ${idx + 1}`}
                        />
                    ))}
                 </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-5 gap-3">
                {galleryImages.map((img, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={`relative h-[96px] w-[96px] aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeIndex === idx ? 'border-[#006FEE] opacity-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                    >
                         <div className="absolute inset-0 bg-gray-200 " />
                         <Image src={img} alt="" fill className="object-cover" />
                    </button>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
}
