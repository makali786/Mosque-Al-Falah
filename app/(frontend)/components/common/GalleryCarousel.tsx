"use client";

import CustomImage from "./CustomImage";
import NextImage from "next/image";
import { useState } from "react";

interface GalleryCarouselProps {
    images: string[];
    aspectRatio?: string;
    className?: string;
}

export default function GalleryCarousel({
    images = [],
    aspectRatio = "aspect-video",
    className = "",
}: GalleryCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);


    if (!images || images.length === 0) {
        return (
            <div className={`w-full ${aspectRatio} bg-gray-100 rounded-xl flex items-center justify-center`}>
                <p className="text-gray-400">No images available</p>
            </div>
        );
    }

    const nextImage = () => {
        setActiveIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div className={`flex flex-col gap-4 w-full ${className}`}>
            {/* Main Image */}
            <div className={`relative w-full ${aspectRatio} rounded-2xl overflow-hidden bg-gray-100`}>
                {/* Blurred background fill */}
                <NextImage
                    src={images[activeIndex]}
                    alt=""
                    fill
                    className="object-cover scale-110 blur-2xl brightness-75 transition-opacity duration-300"
                    aria-hidden="true"
                />
                {/* Main image — fully visible, no cropping */}
                <NextImage
                    src={images[activeIndex]}
                    alt={`Gallery image ${activeIndex + 1}`}
                    fill
                    className="object-contain z-10 transition-opacity duration-300"
                />

                {/* Arrows - Only show if more than 1 image */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center cursor-pointer transition-colors backdrop-blur-sm z-20"
                            aria-label="Previous image"
                        >
                            <CustomImage
                                src="/assets/sermons/arrow-left.svg"
                                alt="Previous"
                                width={20}
                                height={20}
                                className="object-contain"
                            />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 bg-white/80 hover:bg-white rounded-xl flex items-center justify-center cursor-pointer transition-colors backdrop-blur-sm z-20"
                            aria-label="Next image"
                        >
                            <CustomImage
                                src="/assets/sermons/arrow-left.svg"
                                alt="Next"
                                width={20}
                                height={20}
                                className="object-contain rotate-180"
                            />
                        </button>

                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20 p-2 rounded-full backdrop-blur-[2px]">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveIndex(idx)}
                                    className={`w-2 h-2 rounded-full transition-all cursor-pointer ${idx === activeIndex
                                        ? "bg-white scale-125"
                                        : "bg-white/50 hover:bg-white/80"
                                        }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnails - Only show if more than 1 image */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2 sm:gap-3">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setActiveIndex(idx)}
                            className={`relative w-full aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer ${activeIndex === idx
                                ? 'border-[#006FEE] opacity-100 ring-2 ring-[#006FEE]/20'
                                : 'border-transparent opacity-60 hover:opacity-100'
                                }`}
                        >
                            <div className="absolute inset-0 bg-gray-200" />
                            <CustomImage src={img} alt={`Thumbnail ${idx + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
