'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import {
  FaChevronDown,
  FaChevronUp,
  FaExpand,
  FaPause,
  FaPlay,
  FaTimes,
} from 'react-icons/fa';
import { useMediaPlayer } from './MediaPlayerContext';

export default function MiniPlayer() {
  const { mediaData, isPlaying, showMiniPlayer, stop, togglePlayPause } =
    useMediaPlayer();
  const router = useRouter();

  // Whether the player body is collapsed to just the header bar
  const [minimized, setMinimized] = useState(false);

  // Ref for the audio element — lets us call .play()/.pause() imperatively
  const audioRef = useRef<HTMLAudioElement>(null);
  // Ref for the YouTube/Vimeo iframe — lets us send postMessage commands
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Audio: react to isPlaying changes ──────────────────────────────────────
  useEffect(() => {
    if (mediaData?.type !== 'audio') return;
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => {
        // Autoplay may be blocked by the browser — ignore silently
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, mediaData?.type]);

  // ── Video: send postMessage to YouTube / Vimeo iframe ──────────────────────
  useEffect(() => {
    if (mediaData?.type !== 'video') return;
    const iframe = iframeRef.current;
    if (!iframe) return;

    const isYouTube =
      mediaData.url.includes('youtube') || mediaData.url.includes('youtu.be');
    const isVimeo = mediaData.url.includes('vimeo');

    if (isYouTube) {
      const command = isPlaying ? 'playVideo' : 'pauseVideo';
      iframe.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: command, args: [] }),
        '*'
      );
    } else if (isVimeo) {
      const method = isPlaying ? 'play' : 'pause';
      iframe.contentWindow?.postMessage(
        JSON.stringify({ method }),
        'https://player.vimeo.com'
      );
    }
  }, [isPlaying, mediaData?.type, mediaData?.url]);

  if (!showMiniPlayer || !mediaData) return null;

  const handleExpand = () => {
    router.push('/#ayat-of-the-month');
  };

  const handleClose = () => {
    stop();
  };

  // Helper: convert watch URLs → embed URLs (with enablejsapi=1 for YouTube)
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
    if (youtubeMatch?.[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&enablejsapi=1`;
    }

    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)(?:\?h=([a-zA-Z0-9]+))?/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch?.[1]) {
      const videoId = vimeoMatch[1];
      const hash = vimeoMatch[2];
      return hash
        ? `https://player.vimeo.com/video/${videoId}?h=${hash}&autoplay=1`
        : `https://player.vimeo.com/video/${videoId}?autoplay=1`;
    }

    return url;
  };

  const embedUrl = mediaData.type === 'video' ? getEmbedUrl(mediaData.url) : '';

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[280px] sm:w-[320px] bg-[#18181b] rounded-xl shadow-2xl overflow-hidden border border-gray-700 transition-all duration-300">
      {/* Header — always visible */}
      <div className="bg-[#27272a] px-3 py-2 flex items-center justify-between border-b border-gray-700">
        <h4 className="text-white text-sm font-medium truncate flex-1 mr-2">
          {mediaData.title || 'AYAT OF THE MONTH'}
        </h4>
        <div className="flex gap-1 items-center">
          {/* Minimize / Expand toggle */}
          <button
            onClick={() => setMinimized(prev => !prev)}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label={minimized ? 'Expand player' : 'Minimise player'}
          >
            {minimized ? (
              <FaChevronUp size={11} />
            ) : (
              <FaChevronDown size={11} />
            )}
          </button>

          {/* Scroll-to-source expand */}
          <button
            onClick={handleExpand}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Go to player"
          >
            <FaExpand size={12} />
          </button>

          {/* Close */}
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors p-1"
            aria-label="Close"
          >
            <FaTimes size={14} />
          </button>
        </div>
      </div>

      {/*
        ── IMPORTANT: Content is ALWAYS mounted (never conditionally removed).
        We use CSS visibility/height to hide it when minimized.
        This keeps the iframe/audio alive so playback continues uninterrupted.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className="transition-all duration-300 overflow-hidden"
        style={{ maxHeight: minimized ? 0 : 600 }}
        aria-hidden={minimized}
      >
        {/* Content */}
        <div className="relative">
          {mediaData.type === 'video' ? (
            <div className="relative w-full aspect-video bg-black">
              {embedUrl && (
                <iframe
                  ref={iframeRef}
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
              <div className="flex flex-col gap-3">
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

                {/* Audio element — always mounted, controlled via ref */}
                <audio
                  ref={audioRef}
                  src={mediaData.url}
                  loop={false}
                  className="w-full"
                  onEnded={() => {
                    if (isPlaying) togglePlayPause();
                  }}
                />

                {mediaData.citation && (
                  <p className="text-xs text-gray-400 text-center italic">
                    {mediaData.citation}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Play/Pause Control bar */}
        <div className="bg-[#27272a] px-3 py-2 flex items-center justify-center border-t border-gray-700">
          <button
            onClick={togglePlayPause}
            className="text-white hover:text-[#006fee] transition-colors flex items-center gap-2 text-sm"
            aria-label={isPlaying ? 'Pause' : 'Play'}
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
      </div>

      {/* Minimized status bar — shown only when collapsed */}
      {minimized && (
        <div className="bg-[#27272a] px-3 py-1.5 flex items-center justify-between border-t border-gray-700">
          <span className="text-[10px] text-gray-400 truncate flex-1 mr-2">
            {isPlaying ? '▶ Playing' : '⏸ Paused'}
          </span>
          <button
            onClick={togglePlayPause}
            className="text-white hover:text-[#006fee] transition-colors p-1"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <FaPause size={10} /> : <FaPlay size={10} />}
          </button>
        </div>
      )}
    </div>
  );
}
