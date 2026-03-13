"use client";

import CustomImage from "@/components/common/CustomImage";
import NextImage from "next/image";

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
  /**
   * Whether the stream is currently live
   */
  isLive?: boolean;
}

export default function LiveStreaming({
  title = "",
  description = "",
  videoUrl,
  thumbnailUrl,
  thumbnailAlt = "",
  isLive = true,
}: LiveStreamingProps) {

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

  const embedUrl = getEmbedUrl(videoUrl || "");

  return (
    <section className="w-full py-16 md:py-20 bg-white max-w-[741px] mx-auto">
      <div className="section-padding">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-black mb-8">
            {title}
          </h2>
          <p className="text-lg sm:text-base">
            {description}
          </p>
        </div>

        {/* Video Container */}
        <div className="relative w-full max-w-[741px] mx-auto aspect-video rounded-[14px] overflow-hidden ">
          {embedUrl ? (
            <>
              <iframe
                src={embedUrl}
                title={title || "Live Stream"}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
              {/* Live Badge */}
              {isLive && (
                <div className="absolute top-4 right-4 sm:top-4 sm:right-4 bg-white backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-2 z-20">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F31260]"></span>
                  </span>
                  <span className="text-sm font-semibold text-black">Live</span>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Thumbnail */}
              <div className="relative w-full h-full lg:w-[741px] lg:h-[416px]">
                {/* Blurred background fill */}
                <NextImage
                  src={thumbnailUrl}
                  alt=""
                  fill
                  className="object-cover scale-110 blur-2xl brightness-75 opacity-90"
                  aria-hidden="true"
                />
                {/* Main image — fully visible, no cropping */}
                <NextImage
                  src={thumbnailUrl}
                  alt={thumbnailAlt}
                  fill
                  className="object-contain z-10"
                />
                {/* Gradient Overlay for depth */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent opacity-60 z-20"></div>
              </div>

              {/* Live Badge */}
              {isLive && (
                <div className="absolute top-4 right-4 sm:top-4 sm:right-4 bg-white backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-2 z-20">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#F31260]"></span>
                  </span>
                  <span className="text-sm font-semibold text-black">Live</span>
                </div>
              )}

              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full flex items-center justify-center"
                  aria-label="Play Video"
                >
                  <CustomImage
                    src="/assets/common/play-icon.svg"
                    alt="Play Button"
                    width={56}
                    height={56}
                  />
                </a>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
