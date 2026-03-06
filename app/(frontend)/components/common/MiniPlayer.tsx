'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
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
  const {
    mediaData,
    isPlaying,
    playerMode,
    stop,
    togglePlayPause,
    savedTimeRef,
    sourceUrl,
    setPlayerMode,
  } = useMediaPlayer();
  const router = useRouter();
  const pathname = usePathname();

  // Document-relative position for the anchored player (avoids scroll lag)
  const [anchorState, setAnchorState] = useState<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  // Whether the player body is collapsed to just the header bar
  const [minimized, setMinimized] = useState(false);

  // Ref for the audio element — lets us call .play()/.pause() imperatively
  const audioRef = useRef<HTMLAudioElement>(null);
  // Ref for the YouTube/Vimeo iframe — lets us send postMessage commands
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // ── Track Anchor Element ───────────────────────────────────────────────────
  // If we are on the sourceUrl page, lock into ANCHORED mode using absolute
  // document coordinates, and shrink to MINI mode if scrolled out of view.
  useEffect(() => {
    if (playerMode === 'HIDDEN' || !mediaData) return;

    const checkAnchor = () => {
      const anchorEl = document.getElementById('video-anchor');
      if (anchorEl) {
        const rect = anchorEl.getBoundingClientRect();

        // Check if the anchor is completely out of the vertical viewport
        const isOutOfView =
          rect.bottom < 80 || // Scrolled past the top (with 80px header buffer)
          rect.top > window.innerHeight; // Scrolled past the bottom

        // 1. Handle mode switching based on visibility
        if (isOutOfView && playerMode === 'ANCHORED') {
          setPlayerMode('MINI');
        } else if (!isOutOfView && playerMode === 'MINI') {
          setPlayerMode('ANCHORED');
        }

        // 2. Compute absolute document coordinates (constant during scroll)
        const absTop = rect.top + window.scrollY;
        const absLeft = rect.left + window.scrollX;

        // 3. Only trigger a React re-render if the layout actually changed
        setAnchorState(prev => {
          if (
            !prev ||
            Math.abs(prev.top - absTop) > 2 ||
            Math.abs(prev.left - absLeft) > 2 ||
            Math.abs(prev.width - rect.width) > 2 ||
            Math.abs(prev.height - rect.height) > 2
          ) {
            return {
              top: absTop,
              left: absLeft,
              width: rect.width,
              height: rect.height,
            };
          }
          return prev;
        });
      } else {
        // No anchor element on this page at all
        setAnchorState(null);
        if (playerMode === 'ANCHORED') {
          // If anchor disappears (user navigated away), go to MINI
          setPlayerMode('MINI');
        }
      }
    };

    checkAnchor();
    window.addEventListener('scroll', checkAnchor, { passive: true });
    window.addEventListener('resize', checkAnchor, { passive: true });

    // Also interval check in case DOM mutates without window resize
    const interval = setInterval(checkAnchor, 1000);

    return () => {
      window.removeEventListener('scroll', checkAnchor);
      window.removeEventListener('resize', checkAnchor);
      clearInterval(interval);
    };
  }, [playerMode, mediaData, pathname, setPlayerMode]);

  // If we go back to ANCHORED mode, make sure we un-minimize automatically
  useEffect(() => {
    if (playerMode === 'ANCHORED' && minimized) {
      setMinimized(false);
    }
  }, [playerMode, minimized]);


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

  if (playerMode === 'HIDDEN' || !mediaData) return null;

  const handleExpand = () => {
    if (sourceUrl) {
      router.push(sourceUrl);
    } else {
      router.push('/#ayat-of-the-month');
    }
  };

  const handleClose = () => {
    stop();
  };

  const handleMinimize = () => {
    setMinimized(prev => !prev);
  };

  // Helper: convert watch URLs → embed URLs (with enablejsapi=1 for YouTube)
  const getEmbedUrl = (url: string) => {
    if (!url) return '';

    const startParam =
      savedTimeRef.current > 0 ? `&start=${savedTimeRef.current}` : '';

    if (url.includes('/embed/')) {
      if (url.includes('youtube') && !url.includes('enablejsapi')) {
        return (
          url + (url.includes('?') ? '&' : '?') + 'enablejsapi=1' + startParam
        );
      }
      return url + startParam;
    }

    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch?.[1]) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&enablejsapi=1${startParam}`;
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

  // Calculate dynamic styling based on mode
  const isMini = playerMode === 'MINI';
  const isAnchored = playerMode === 'ANCHORED';

  let containerStyle: React.CSSProperties = {};

  if (isAnchored && anchorState) {
    // Exact overlay of the anchor div in document coordinates
    containerStyle = {
      position: 'absolute',
      top: anchorState.top,
      left: anchorState.left,
      width: anchorState.width,
      height: anchorState.height,
      zIndex: 10, // Must be high enough to overlay but behind dropdowns
      borderRadius: '14px',
    };
  } else {
    // Default MiniPlayer position
    containerStyle = {
      position: 'fixed',
      bottom: '24px',
      right: '24px',
      width: '320px',
      zIndex: 999999999,
      borderRadius: '12px',
    };
  }

  return (
    <div
      className={`overflow-hidden ${isAnchored && mediaData.type === 'audio' ? 'bg-transparent' : 'bg-[#18181b]'} ${isAnchored ? '' : 'shadow-2xl border border-gray-700 transition-all duration-300'
        }`}
      style={containerStyle}
    >
      {/* ── Header (Only visible in Mini Mode for floating controls) ── */}
      {isMini && (
        <div className="bg-[#27272a] px-3 py-2 flex items-center justify-between border-b border-gray-700 relative z-20">
          <h4 className="text-white text-sm font-medium truncate flex-1 mr-2">
            {mediaData.title || 'Now Playing'}
          </h4>
          <div className="flex gap-1 items-center">
            {/* Minimize / Expand toggle */}
            <button
              onClick={handleMinimize}
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
              aria-label="Go to source"
            >
              <FaExpand size={12} />
            </button>

            {/* Close */}
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors p-1"
              aria-label="Close Player"
            >
              <FaTimes size={14} />
            </button>
          </div>
        </div>
      )}

      {/*
        ── IMPORTANT: Content is ALWAYS mounted (never conditionally removed).
        We use CSS visibility/height to hide it when minimized.
        This keeps the iframe/audio alive so playback continues uninterrupted.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        className="transition-all duration-300 overflow-hidden"
        style={{
          height: minimized ? 0 : (isAnchored ? '100%' : 'auto'),
          opacity: minimized ? 0 : 1,
          pointerEvents: minimized ? 'none' : 'auto',
        }}
      >
        {/* ── Player Content ── */}
        <div className={`relative ${isAnchored ? 'w-full h-full' : 'w-full aspect-video'}`}>
          {mediaData.type === 'video' ? (
            <div className="relative w-full h-full bg-black">
              {embedUrl && (
                <iframe
                  ref={iframeRef}
                  key={embedUrl}
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
            <div className={`flex flex-col justify-center h-full ${isAnchored ? 'items-center bg-transparent w-full' : 'p-4'}`}>
              <div className={`flex flex-col gap-3 w-full ${isAnchored ? 'max-w-xl text-center' : ''}`}>
                {!isAnchored && mediaData.arabicImage && (
                  <div className="w-full relative h-20">
                    <Image
                      src={mediaData.arabicImage}
                      alt="Arabic Calligraphy"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                )}

                {/* Audio element */}
                {mediaData.url && (
                  <div className="w-full flex justify-center">
                    <audio
                      ref={audioRef}
                      src={mediaData.url}
                      loop={false}
                      controls={isAnchored} // Allow default controls when full size
                      className="w-full max-w-md"
                      onCanPlay={e => {
                        if (savedTimeRef.current > 1) {
                          e.currentTarget.currentTime = savedTimeRef.current;
                          savedTimeRef.current = 0; // prevent re-seeking on pause/play
                        }
                      }}
                      onEnded={() => {
                        if (isPlaying) togglePlayPause();
                      }}
                    />
                  </div>
                )}

                {!isAnchored && mediaData.citation && (
                  <p className="text-xs text-gray-400 italic text-center">
                    {mediaData.citation}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Play/Pause Control bar (Only visible in Mini Mode Audio) ── */}
        {isMini && mediaData.type === 'audio' && (
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
        )}
      </div>

      {/* Minimized status bar — shown only when collapsed via minimize button */}
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
