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
    <section className="w-full py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-6 tracking-tight">
            {title}
          </h2>
          <p className="text-gray-600 text-lg sm:text-lg leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Video Container */}
        <div className="relative w-full max-w-5xl mx-auto aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-black group cursor-pointer border border-gray-100">
          {/* Thumbnail */}
          <div className="relative w-full h-full">
             <Image
              src={thumbnailUrl}
              alt={thumbnailAlt}
              fill
              className="object-cover opacity-90 transition-all duration-500 group-hover:scale-105"
            />
            {/* Gradient Overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60"></div>
          </div>

          {/* Live Badge */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 shadow-lg z-20 border border-gray-100">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E31B23]"></span>
            </span>
            <span className="text-sm font-semibold text-gray-900 tracking-wide">Live</span>
          </div>

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
             <button 
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 group-hover:scale-110 group-hover:bg-gray-50 active:scale-95"
                aria-label="Play Video"
                onClick={() => setIsPlaying(true)}
             >
                <FaPlay className="text-gray-900 ml-1 text-xl sm:text-2xl" />
             </button>
          </div>
        </div>
      </div>
    </section>
  );
}
