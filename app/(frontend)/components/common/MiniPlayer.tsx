'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaExpand, FaPause, FaPlay, FaTimes } from 'react-icons/fa';
import { useMediaPlayer } from './MediaPlayerContext';

export default function MiniPlayer() {
  const { mediaData, isPlaying, showMiniPlayer, stop, togglePlayPause } =
    useMediaPlayer();
  const router = useRouter();

  if (!showMiniPlayer || !mediaData) return null;

  const handleExpand = () => {
    router.push('/#ayat-of-the-month');
  };

  const handleClose = () => {
    stop();
  };

  // Helper function to convert YouTube and Vimeo URLs to embed format
  const getEmbedUrl = (url: string) => {
    if (!url) return '';

    // If already an embed URL, return as is
    if (url.includes('/embed/')) return url;

    // Convert youtube.com/watch?v= or youtu.be/ to embed format
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubeRegex);

    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }

    // Convert vimeo.com/video/ID to player.vimeo.com/video/ID format
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)(?:\?h=([a-zA-Z0-9]+))?/;
    const vimeoMatch = url.match(vimeoRegex);

    if (vimeoMatch && vimeoMatch[1]) {
      const videoId = vimeoMatch[1];
      const hash = vimeoMatch[2];
      return hash
        ? `https://player.vimeo.com/video/${videoId}?h=${hash}&autoplay=1`
        : `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }

    // Return original URL for other platforms
    return url;
  };

  const embedUrl = mediaData.type === 'video' ? getEmbedUrl(mediaData.url) : '';

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[280px] sm:w-[320px] bg-[#18181b] rounded-xl shadow-2xl overflow-hidden border border-gray-700">
      {/* Header */}
      <div className="bg-[#27272a] px-3 py-2 flex items-center justify-between border-b border-gray-700">
        <h4 className="text-white text-sm font-medium truncate flex-1 mr-2">
          {mediaData.title || 'AYAT OF THE MONTH'}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={handleExpand}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Expand"
          >
            <FaExpand size={12} />
          </button>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        {mediaData.type === 'video' ? (
          <div className="relative w-full aspect-video bg-black">
            {embedUrl && (
              <iframe
                src={embedUrl}
                title={mediaData.title || 'Video player'}
                className="w-full h-full"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            )}
          </div>
        ) : (
          <div className="p-4">
            {/* Audio Mini Player */}
            <div className="flex flex-col gap-3">
              {/* Arabic Calligraphy or Thumbnail */}
              {mediaData.arabicImage && (
                <div className="w-full h-20 relative">
                  <Image
                    src={mediaData.arabicImage}
                    alt="Arabic Calligraphy"
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
              )}

              {/* Audio Element */}
              <audio
                src={mediaData.url}
                autoPlay={isPlaying}
                loop={false}
                className="w-full"
                controls
              />

              {/* Citation */}
              {mediaData.citation && (
                <p className="text-xs text-gray-400 text-center italic">
                  {mediaData.citation}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Play/Pause Control for Video */}
      {mediaData.type === 'video' && (
        <div className="bg-[#27272a] px-3 py-2 flex items-center justify-center border-t border-gray-700">
          <button
            onClick={togglePlayPause}
            className="text-white hover:text-[#006fee] transition-colors flex items-center gap-2 text-sm"
          >
            {isPlaying ? (
              <>
                <FaPause size={12} />
                <span>Pause</span>
              </>
            ) : (
              <>
                <FaPlay size={12} />
                <span>Play</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
