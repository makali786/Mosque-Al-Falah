"use client";

import { FaPlay } from "react-icons/fa";
import Image from "next/image";
import { useState } from "react";

interface LiveStreamingProps {
  /**
   * Title of the section
   */
  title?: string;
  /**
   * Description text
   */
  description?: string;
  /**
   * URL of the video stream (e.g., YouTube link)
   */
  videoUrl?: string;
  /**
   * Thumbnail image URL
   */
  thumbnailUrl: string;
  /**
   * Thumbnail alt text
   */
  thumbnailAlt?: string;
}

export default function LiveStreaming({
  title = "Live Taraweeh Streaming",
  description = "For those unable to attend in person, join us via live stream and immerse yourself in the spiritual atmosphere from anywhere.",
  videoUrl,
  thumbnailUrl,
  thumbnailAlt = "Live Taraweeh Streaming",
}: LiveStreamingProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <section className="w-full py-16 md:py-20 bg-white max-w-[741px] mx-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black mb-8">
            {title}
          </h2>
          <p className="text-lg sm:text-base">
            {description}
          </p>
        </div>

        {/* Video Container */}
        <div className="relative w-full max-w-[741px] mx-auto aspect-video rounded-[14px] overflow-hidden ">
          {/* Thumbnail */}
          <div className="relative w-full h-full lg:w-[741px] lg:h-[416px]">
             <Image
              src={thumbnailUrl}
              alt={thumbnailAlt}
              fill
              className="object-cover opacity-90"
            />
            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60"></div>
          </div>

          {/* Live Badge */}
          <div className="absolute top-4 right-4 sm:top-4 sm:right-4 bg-white backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-2 z-20">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F31260]"></span>
            </span>
            <span className="text-sm font-semibold">Live</span>
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
             <button 
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-50 active:scale-95"
                aria-label="Play Video"
                onClick={() => setIsPlaying(true)}
             >
              <FaPlay className="ml-1 text-xl sm:text-2xl" />
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}
