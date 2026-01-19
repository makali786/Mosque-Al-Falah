"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ViewToggleButtons from "../common/ViewToggleButtons";
import AudioPlayer from "../common/AudioPlayer";

interface Ayat {
  arabicCalligraphyImage?: { url?: string; alt?: string };
  englishTranslation?: string;
  surahName?: string;
  videoTitle?: string;
  videoThumbnail?: { url?: string };
  videoUrl?: string;
  audioUrl?: string;
}

type ViewMode = "default" | "video" | "audio";

export default function AyatOfTheMonth({ ayatOfTheMonth = [] }: { ayatOfTheMonth: Ayat[] }) {

  const [viewMode, setViewMode] = useState<ViewMode>("default");

  // Helper function to convert YouTube and Vimeo URLs to embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return "";

    // If already an embed URL, return as is
    if (url.includes("/embed/")) return url;

    // Convert youtube.com/watch?v= or youtu.be/ to embed format
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Convert vimeo.com/video/ID to player.vimeo.com/video/ID format
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)(?:\?h=([a-zA-Z0-9]+))?/;
    const vimeoMatch = url.match(vimeoRegex);

    if (vimeoMatch && vimeoMatch[1]) {
      const videoId = vimeoMatch[1];
      const hash = vimeoMatch[2];
      return hash
        ? `https://player.vimeo.com/video/${videoId}?h=${hash}`
        : `https://player.vimeo.com/video/${videoId}`;
    }

    // Return original URL for other platforms
    return url;
  };

  if (!ayatOfTheMonth || ayatOfTheMonth.length === 0) return null;
  const data = ayatOfTheMonth[0];
  // Mapping logic
  const arabicImage = data?.arabicCalligraphyImage?.url ? data?.arabicCalligraphyImage?.url : null;
  const englishText = data?.englishTranslation || "";
  const citation = data?.surahName || "";
  const videoTitle = data?.videoTitle || "";
  const videoUrl = data?.videoUrl || "";
  const audioUrl = data.audioUrl || "";
  const embedUrl = getEmbedUrl(videoUrl);



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
                {arabicImage && (
                  <div className="w-45 h-13.5 sm:w-[477.66px] sm:h-[143.3px] relative">
                    <Image
                      src={arabicImage}
                      alt={data?.arabicCalligraphyImage?.alt || ""}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}

                {/* English Quote */}
                <p className="text-base sm:text-4xl font-medium sm:font-bold text-white leading-6 sm:leading-13 text-center">
                  &quot;{englishText}&quot;
                </p>

                {/* Citation */}
                <p className="text-xs sm:text-lg font-normal italic text-white leading-4 sm:leading-7 text-center">
                  {citation}
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
                {videoTitle}
              </h3>

              {/* Video Player */}
              <div className="relative w-full aspect-780/438 bg-white rounded-xl overflow-hidden text-black/50">
                {embedUrl && (
                  <iframe
                    src={embedUrl}
                    title={videoTitle || "Video player"}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                )}
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
                {arabicImage && (
                  <div className="w-45 h-13.5 sm:w-[477.66px] sm:h-[143.3px] relative">
                    <Image
                      src={arabicImage}
                      alt="Arabic Calligraphy"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}

                {/* English Quote */}
                <p className="text-base sm:text-4xl font-medium sm:font-bold text-white leading-6 sm:leading-13 text-center">
                  &quot;{englishText}&quot;
                </p>

                {/* Citation */}
                <p className="text-xs sm:text-lg font-normal italic text-white leading-4 sm:leading-7 text-center">
                  — {citation}
                </p>
              </div>
            </div>

            {/* Audio Player */}
            <AudioPlayer audioUrl={audioUrl} />
          </>
        )}
      </div>

      {/* View Toggle Buttons - Bottom Right (only show in default view) */}
      {viewMode === "default" && (
        <ViewToggleButtons
          onAudioClick={() => {
            setViewMode("audio");
          }}
          onVideoClick={() => {
            setViewMode("video");
          }}
          className="absolute bottom-10 right-4 sm:right-8 lg:right-40.25 sm:bottom-26.75 z-20"
        />
      )}

      {/* Back Button (show in video/audio views) */}
      {viewMode !== "default" && (
        <button
          onClick={() => {
            setViewMode("default");
          }}
          className="absolute sm:top-4 top-2 sm:right-4 right-2 z-20 bg-white/20 hover:bg-white/30 text-white sm:px-4 px-3 sm:py-2 py-1.5 sm:rounded-lg rounded-md sm:text-base text-sm transition-colors cursor-pointer"
        >
          Back
        </button>
      )}
    </section>
  );
}
