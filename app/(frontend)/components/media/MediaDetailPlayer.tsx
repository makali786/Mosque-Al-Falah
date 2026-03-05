'use client';

import { useMediaPlayer } from '@/components/common/MediaPlayerContext';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { FaPlay } from 'react-icons/fa';

interface MediaDetailPlayerProps {
  title: string;
  videoUrl: string;
  thumbnail?: string;
  isLive?: boolean;
  type: 'video' | 'audio' | 'podcast';
  description?: string;
  className?: string;
  autoPlay?: boolean;
}

export default function MediaDetailPlayer({
  title,
  videoUrl,
  thumbnail,
  isLive,
  type,
  description,
  className,
  autoPlay,
}: MediaDetailPlayerProps) {
  const {
    play,
    stop,
    isPlaying,
    mediaData,
    setShowMiniPlayer,
    showMiniPlayer,
    userClosed,
    hasPlayed,
    setSourceUrl,
    savedTimeRef,
  } = useMediaPlayer();
  const [localIsPlaying, setLocalIsPlaying] = useState(false);
  const [isReadyForScrollLogic, setIsReadyForScrollLogic] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Whether the mini-player is currently active for THIS video
  const isMiniActive = showMiniPlayer && mediaData?.url === videoUrl;

  // Intersection Observer to detect when player is out of view
  const isInView = useIntersectionObserver(
    containerRef as React.RefObject<Element>,
    { threshold: 0.3 }
  );

  // Refs to capture latest state for unmount cleanup
  const userClosedRef = useRef(userClosed);
  userClosedRef.current = userClosed;
  const mediaDataRef = useRef(mediaData);
  mediaDataRef.current = mediaData;
  const videoUrlRef = useRef(videoUrl);
  videoUrlRef.current = videoUrl;
  const isPlayingRef = useRef(isPlaying);
  isPlayingRef.current = isPlaying;
  const hasPlayedRef = useRef(hasPlayed);
  hasPlayedRef.current = hasPlayed;

  // Show MiniPlayer when this component unmounts (e.g., page navigation)
  useEffect(() => {
    return () => {
      if (
        mediaDataRef.current?.url === videoUrlRef.current &&
        !userClosedRef.current &&
        hasPlayedRef.current
      ) {
        setShowMiniPlayer(true);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle Autoplay from URL search params
  useEffect(() => {
    if (autoPlay) {
      handlePlay();
      setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
        setTimeout(() => setIsReadyForScrollLogic(true), 100);
      }, 300);
    } else {
      setIsReadyForScrollLogic(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay]);

  // Sync local playing state with global context
  useEffect(() => {
    if (mediaData?.url === videoUrl) {
      setLocalIsPlaying(isPlaying);
    } else {
      setLocalIsPlaying(false);
    }
  }, [isPlaying, mediaData, videoUrl]);

  // Handle MiniPlayer visibility — show when scrolled away, hide when scrolled back.
  useEffect(() => {
    if (mediaData?.url === videoUrl && isReadyForScrollLogic) {
      if (!isInView && isPlaying && !userClosed) {
        setShowMiniPlayer(true);
      } else if (isInView && showMiniPlayer) {
        setShowMiniPlayer(false);
      }
    }
  }, [
    isInView,
    isPlaying,
    userClosed,
    showMiniPlayer,
    setShowMiniPlayer,
    mediaData,
    videoUrl,
    isReadyForScrollLogic,
  ]);

  // ── Pause/Resume page iframe when mini-player activates/deactivates ──────
  const prevMiniActiveRef = useRef(false);
  useEffect(() => {
    const iframe = iframeRef.current;
    const wasActive = prevMiniActiveRef.current;
    prevMiniActiveRef.current = isMiniActive;

    if (!iframe?.contentWindow) return;

    const isYouTube =
      videoUrl.includes('youtube') || videoUrl.includes('youtu.be');

    if (isMiniActive && !wasActive) {
      // Mini-player just activated → pause page iframe
      if (isYouTube) {
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'pauseVideo', args: [] }),
          '*'
        );
      }
    } else if (!isMiniActive && wasActive) {
      // Mini-player just deactivated (user scrolled back) → seek and resume
      if (isYouTube && savedTimeRef.current > 0) {
        iframe.contentWindow.postMessage(
          JSON.stringify({
            event: 'command',
            func: 'seekTo',
            args: [savedTimeRef.current, true],
          }),
          '*'
        );
        iframe.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func: 'playVideo', args: [] }),
          '*'
        );
      }
    }
  }, [isMiniActive, videoUrl, savedTimeRef]);

  // Helper to get embed URL
  const getEmbedUrl = (url: string) => {
    if (!url) return '';

    if (url.includes('/embed/')) {
      if (url.includes('youtube') && !url.includes('enablejsapi')) {
        return url + (url.includes('?') ? '&' : '?') + 'enablejsapi=1';
      }
      return url;
    }

    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch && youtubeMatch[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&enablejsapi=1`;
    }

    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)(?:\?h=([a-zA-Z0-9]+))?/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      const videoId = vimeoMatch[1];
      const hash = vimeoMatch[2];
      return hash
        ? `https://player.vimeo.com/video/${videoId}?h=${hash}&autoplay=1`
        : `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }

    return url;
  };

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
    setLocalIsPlaying(true);
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-video bg-black overflow-hidden group ${className || 'rounded-[14px] mb-8 lg:max-w-[735px] lg:max-h-[412px]'}`}
    >
      {/* ── Iframe: always mounted once playing, paused via postMessage ── */}
      {localIsPlaying && embedUrl && (
        <div
          className="w-full h-full"
          style={{
            opacity: isMiniActive ? 0 : 1,
            pointerEvents: isMiniActive ? 'none' : 'auto',
            position: isMiniActive ? 'absolute' : 'relative',
          }}
        >
          <iframe
            ref={iframeRef}
            src={embedUrl}
            title={title}
            className="w-full h-full"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
      )}

      {/* ── Thumbnail / Overlay when not playing or mini-player active ── */}
      {(!localIsPlaying || !embedUrl || isMiniActive) && (
        <div
          className={`absolute inset-0 w-full h-full ${isMiniActive ? 'cursor-not-allowed' : 'cursor-pointer'}`}
          onClick={() => {
            if (!isMiniActive) handlePlay();
          }}
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

          {isMiniActive ? (
            <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-10">
              <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 text-center">
                <p className="text-white text-sm font-medium">
                  Media is playing in the MiniPlayer
                </p>
                <p className="text-white/60 text-xs mt-1">
                  Close the MiniPlayer to use this player
                </p>
              </div>
            </div>
          ) : (
            !localIsPlaying && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center">
                    <FaPlay className="text-black ml-1 text-xl sm:text-2xl" />
                  </div>
                </div>
              </div>
            )
          )}

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
