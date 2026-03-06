'use client';

import { useMediaPlayer } from '@/components/common/MediaPlayerContext';
import Image from 'next/image';
import React, { useEffect } from 'react';
import { FaPlay } from 'react-icons/fa';

interface MediaDetailPlayerProps {
  title: string;
  videoUrl: string;
  thumbnail?: string;
  isLive?: boolean;
  type?: 'video' | 'audio' | 'podcast';
  description?: string;
  className?: string;
  autoPlay?: boolean;
}

export default function MediaDetailPlayer({
  title,
  videoUrl,
  thumbnail,
  isLive,
  type = 'video',
  description,
  className,
  autoPlay,
}: MediaDetailPlayerProps) {
  const { play, playerMode, mediaData, setSourceUrl } = useMediaPlayer();

  const isThisMediaPlaying = mediaData?.url === videoUrl && playerMode !== 'HIDDEN';

  // Handle autoPlay on mount
  useEffect(() => {
    if (autoPlay && !isThisMediaPlaying) {
      handlePlay();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  const handlePlay = () => {
    play({
      type: type === 'video' ? 'video' : 'audio',
      url: videoUrl,
      title: title,
      thumbnail: thumbnail,
      citation: description,
    });
    if (typeof window !== 'undefined') {
      setSourceUrl(window.location.pathname);
    }
  };

  return (
    <div
      className={`relative w-full aspect-video bg-black overflow-hidden group ${className || 'rounded-[14px] mb-8 lg:max-w-[735px] lg:max-h-[412px]'}`}
    >
      {/* ── The Global Player Anchor ── */}
      {/* If this media is playing, provide the anchor div for the Global Player to attach to */}
      {isThisMediaPlaying && (
        <div id="video-anchor" className="w-full h-full absolute inset-0 z-20 pointer-events-none" />
      )}

      {/* ── Thumbnail / Overlay when NOT playing ── */}
      {!isThisMediaPlaying && (
        <div
          className="absolute inset-0 w-full h-full cursor-pointer z-10"
          onClick={handlePlay}
        >
          {thumbnail ? (
            <Image
              src={thumbnail}
              alt={title || 'Video thumbnail'}
              fill
              className="object-cover opacity-80 group-hover:opacity-60 transition-opacity"
            />
          ) : (
            <div className="absolute inset-0 bg-gray-900" />
          )}

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center">
                <FaPlay className="text-black ml-1 text-xl sm:text-2xl" />
              </div>
            </div>
          </div>

          {isLive && (
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 z-10">
              <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
              <span className="text-xs font-bold text-red-600 uppercase tracking-wide">
                Live
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
