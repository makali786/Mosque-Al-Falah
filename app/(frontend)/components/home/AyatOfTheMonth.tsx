"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ViewToggleButtons from "../common/ViewToggleButtons";

type ViewMode = "default" | "video" | "audio";

export default function AyatOfTheMonth() {
  const [viewMode, setViewMode] = useState<ViewMode>("default");

  return (
    <section className="relative w-full py-8 pb-32 px-4 sm:py-18 sm:px-4 lg:px-8 xl:px-50 flex items-center justify-center min-h-112.5 sm:min-h-197.75">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/assets/ayat/background.png"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-78 sm:max-w-178.5 flex flex-col items-center gap-4.5 sm:gap-15">
        {viewMode === "default" && (
          <>
            {/* Default View - Arabic Calligraphy & Quote */}
            <div className="flex flex-col items-center gap-4.5 sm:gap-8.25 w-full">
              <p className="text-base sm:text-xl font-medium sm:font-normal text-white leading-4 sm:leading-7 text-center">
                AYAT OF THE MONTH
              </p>

              <div className="flex flex-col items-center gap-2.5 sm:gap-7 w-full max-w-69 sm:max-w-full">
                {/* Arabic Calligraphy */}
                <div className="w-45 h-13.5 sm:w-[477.66px] sm:h-[143.3px] relative">
                  <Image
                    src="/assets/ayat/arabic-text.svg"
                    alt="Arabic Calligraphy"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* English Quote */}
                <p className="text-base sm:text-4xl font-medium sm:font-bold text-white leading-6 sm:leading-13 text-center">
                  "And when I am ill, it is He who cures me"
                </p>

                {/* Citation */}
                <p className="text-xs sm:text-lg font-normal italic text-white leading-4 sm:leading-7 text-center">
                  — Surah Ash-Shu'ara (26:80)
                </p>
              </div>
            </div>

            {/* Read More Button */}
            <Link
              href="/ayat"
              className="bg-[#1877f2] h-9 sm:h-12 px-6 rounded-lg flex items-center gap-2 hover:bg-[#1565d8] transition-colors"
            >
              <span className="text-xs sm:text-base font-normal text-white leading-6">
                Read More Ayats
              </span>
            </Link>
          </>
        )}

        {viewMode === "video" && (
          <>
            {/* Video View */}
            <p className="text-base sm:text-lg font-medium text-white leading-4 sm:leading-7">
              AYAT OF THE MONTH
            </p>

            <div className="flex flex-col gap-4 sm:gap-6.25 w-full max-w-full sm:max-w-[735.5px]">
              <h3 className="text-xl sm:text-4xl font-bold text-white leading-7 sm:leading-13 text-center overflow-hidden text-ellipsis whitespace-nowrap px-4">
                Lessons from Surah Al-Fatihah
              </h3>

              {/* Video Player */}
              <div className="relative w-full aspect-780/438 bg-white rounded-xl overflow-hidden">
                <Image
                  src="/assets/ayat/video-thumbnail.png"
                  alt="Video Thumbnail"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/32" />
                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14">
                  <Image
                    src="/assets/ayat/play-circle.svg"
                    alt="Play"
                    fill
                    className="object-contain"
                  />
                </button>
              </div>
            </div>
          </>
        )}

        {viewMode === "audio" && (
          <>
            {/* Audio View */}
            <div className="flex flex-col items-center gap-4.5 sm:gap-8.25 w-full">
              <p className="text-base sm:text-xl font-medium sm:font-normal text-white leading-4 sm:leading-7 text-center">
                AYAT OF THE MONTH
              </p>

              <div className="flex flex-col items-center gap-2.5 sm:gap-7 w-full max-w-69 sm:max-w-full">
                {/* Arabic Calligraphy */}
                <div className="w-45 h-13.5 sm:w-[477.66px] sm:h-[143.3px] relative">
                  <Image
                    src="/assets/ayat/arabic-text.svg"
                    alt="Arabic Calligraphy"
                    fill
                    className="object-contain"
                  />
                </div>

                {/* English Quote */}
                <p className="text-base sm:text-4xl font-medium sm:font-bold text-white leading-6 sm:leading-13 text-center">
                  "And when I am ill, it is He who cures me"
                </p>

                {/* Citation */}
                <p className="text-xs sm:text-lg font-normal italic text-white leading-4 sm:leading-7 text-center">
                  — Surah Ash-Shu'ara (26:80)
                </p>
              </div>
            </div>

            {/* Audio Player */}
            <div className="bg-black/30 rounded-xl p-6 flex flex-col gap-2 w-full">
              {/* Controls */}
              <div className="flex items-center justify-center gap-4 w-full">
                <div className="flex-1 flex justify-end gap-2">
                  <button className="w-8 h-8 flex items-center justify-center">
                    <Image
                      src="/assets/ayat/previous.svg"
                      alt="Previous"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  </button>
                </div>

                <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                  <Image
                    src="/assets/ayat/play-small.svg"
                    alt="Play"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </button>

                <div className="flex-1 flex gap-2">
                  <button className="w-8 h-8 flex items-center justify-center">
                    <Image
                      src="/assets/ayat/next.svg"
                      alt="Next"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  </button>
                </div>
              </div>

              {/* Seekbar */}
              <div className="flex items-center gap-2 w-full">
                <span className="text-xs text-[#a7a7a7] min-w-6.5 text-right">
                  0:00
                </span>
                <div className="flex-1 h-3 bg-white/30 rounded relative">
                  <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 w-0 bg-white rounded" />
                </div>
                <span className="text-xs text-[#a7a7a7] min-w-6.5">2:33</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* View Toggle Buttons - Bottom Right (only show in default view) */}
      {viewMode === "default" && (
        <ViewToggleButtons
          onAudioClick={() => setViewMode("audio")}
          onVideoClick={() => setViewMode("video")}
          className="absolute bottom-10 right-4 sm:right-8 lg:right-40.25 sm:bottom-26.75 z-20"
        />
      )}

      {/* Back Button (show in video/audio views) */}
      {viewMode !== "default" && (
        <button
          onClick={() => setViewMode("default")}
          className="absolute sm:top-4 top-2 sm:right-4 right-2 z-20 bg-white/20 hover:bg-white/30 text-white sm:px-4 px-3 sm:py-2 py-1.5 sm:rounded-lg rounded-md sm:text-base text-sm transition-colors"
        >
          Back
        </button>
      )}
    </section>
  );
}
