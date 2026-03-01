'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaCircle } from 'react-icons/fa';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import AudioPlayer from '../common/AudioPlayer';
import { useMediaPlayer } from '../common/MediaPlayerContext';

interface Ayat {
  arabicCalligraphyImage?: { url?: string; alt?: string };
  englishTranslation?: string;
  surahName?: string;
  videoTitle?: string;
  videoThumbnail?: { url?: string };
  videoUrl?: string;
  audioUrl?: string;
  audioFile?: { url?: string };
  defaultTab?: 'audio' | 'video' | 'default';
  arabicText?: string;
  surahNumber?: number;
  ayahNumber?: number;
}

type ViewMode = 'default' | 'video' | 'audio' | 'taraweeh';

const TARAWEEH_URL = 'https://emasjidlive.co.uk/miniplayer/masjidalfalahilford?theme=dark';

/** Returns true if current local time is within the Taraweeh window (after Isha until midnight). */
function isInTaraweehWindow(ishaTime: string): boolean {
  const [h, m] = ishaTime.split(':').map(Number);
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const ishaMinutes = h * 60 + m;
  const midnightMinutes = 24 * 60; // 00:00 next day
  return currentMinutes >= ishaMinutes && currentMinutes < midnightMinutes;
}

export default function AyatOfTheMonth({
  ayatOfTheMonth = [],
}: {
  ayatOfTheMonth: Ayat[];
}) {
  const initialMode = (ayatOfTheMonth[0]?.defaultTab as ViewMode) || 'audio';
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [taraweehActive, setTaraweehActive] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const {
    play,
    pause: contextPause,
    setShowMiniPlayer,
    showMiniPlayer,
    mediaData,
    stop,
    userClosed,
    setIsMainElementAlive,
  } = useMediaPlayer();
  const isInView = useIntersectionObserver(
    sectionRef as React.RefObject<Element>,
    { threshold: 0.3 }
  );

  // ── Refs to capture latest state for unmount cleanup ───────────────────────
  const viewModeRef = useRef(viewMode);
  viewModeRef.current = viewMode;
  const userClosedRef = useRef(userClosed);
  userClosedRef.current = userClosed;
  const mediaDataRef = useRef(mediaData);
  mediaDataRef.current = mediaData;

  // ── Show MiniPlayer when this component unmounts (e.g. page navigation) ────
  useEffect(() => {
    return () => {
      // On unmount: if media is loaded in the context and the user hasn't
      // explicitly closed the MiniPlayer, show it so playback continues.
      if (
        mediaDataRef.current &&
        !userClosedRef.current &&
        viewModeRef.current !== 'default' &&
        viewModeRef.current !== 'taraweeh'
      ) {
        setShowMiniPlayer(true);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps — runs only on unmount

  // ── Notify context that the main element is mounted ─────────────────────────
  useEffect(() => {
    setIsMainElementAlive(true);
    return () => {
      setIsMainElementAlive(false);
    };
  }, [setIsMainElementAlive]);

  // ── Auto-detect Taraweeh window from today's prayer times ──────────────────
  useEffect(() => {
    const checkTaraweeh = async () => {
      try {
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const res = await fetch(
          `/api/prayer-times?where[date][equals]=${yyyy}-${mm}-${dd}&limit=1`
        );
        const data = await res.json();
        const ishaTime: string | undefined = data?.docs?.[0]?.isha;
        if (ishaTime && isInTaraweehWindow(ishaTime)) {
          setTaraweehActive(true);
          setViewMode('taraweeh');
          // Scroll the section into view after the DOM updates
          // Scroll the player into view after the DOM updates
          // setTimeout(() => {
          //   playerRef.current?.scrollIntoView({
          //     behavior: 'smooth',
          //     block: 'center',
          //   });
          // }, 500);
        }
      } catch {
        // Fail silently — Taraweeh tab still shows, just not auto-selected
      }
    };
    checkTaraweeh();
  }, []);

  // ── MiniPlayer on scroll-out (video / audio views only) ───────────────────
  // NOTE: we ONLY call setShowMiniPlayer(true) — never false.
  // The MiniPlayer stays visible regardless of scroll-back; only the ✕ button
  // (which calls stop()) can hide it.
  useEffect(() => {
    if (
      viewMode !== 'default' &&
      viewMode !== 'taraweeh' &&
      !isInView &&
      !userClosed
    ) {
      setShowMiniPlayer(true);
    }
  }, [isInView, viewMode, userClosed, setShowMiniPlayer]);

  // ── Auto-scroll when Taraweeh mode becomes active ──────────────────────────
  // useEffect(() => {
  //   if (viewMode === 'taraweeh' && playerRef.current) {
  //     // Small timeout to ensure layout stability before scrolling
  //     setTimeout(() => {
  //       playerRef.current?.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'center',
  //       });
  //     }, 100);
  //   }
  // }, [viewMode]); // Runs whenever viewMode changes

  // ── Helpers ────────────────────────────────────────────────────────────────
  const getEmbedUrl = (url: string) => {
    if (!url) return '';
    if (url.includes('/embed/')) return url;
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch?.[1])
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    const vimeoRegex = /vimeo\.com\/(?:video\/)?(\d+)(?:\?h=([a-zA-Z0-9]+))?/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch?.[1]) {
      return vimeoMatch[2]
        ? `https://player.vimeo.com/video/${vimeoMatch[1]}?h=${vimeoMatch[2]}`
        : `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
    return url;
  };

  if (!ayatOfTheMonth || ayatOfTheMonth.length === 0) return null;
  const data = ayatOfTheMonth[0];
  const arabicImage = data?.arabicCalligraphyImage?.url ?? null;
  const englishText = data?.englishTranslation || '';
  const citation = data?.surahName || '';
  const arabicText = data?.arabicText || '';
  const ayahNumber = data?.ayahNumber || 0;
  const surahNumber = data?.surahNumber || 0;

  // Dynamic label logic
  const isSeries = surahNumber === 0;
  const sectionLabel = isSeries ? citation.toUpperCase() : 'AYAT OF THE MONTH';

  const videoTitle = data?.videoTitle || '';
  const videoUrl = data?.videoUrl || '';
  const audioUrl = data.audioFile?.url || data.audioUrl || '';
  const fullAudioUrl =
    audioUrl && audioUrl.startsWith('/')
      ? `${typeof window !== 'undefined' ? window.location.origin : ''}${audioUrl}`
      : audioUrl;
  const embedUrl = getEmbedUrl(videoUrl);

  // ── Tab bar at bottom of default/taraweeh view ────────────────────────────
  const tabs: { id: ViewMode; label: string; isLive?: boolean }[] = [
    { id: 'video', label: 'Video' },
    { id: 'audio', label: 'Audio' },
    { id: 'taraweeh', label: 'Live Taraweeh', isLive: true },
  ];

  const handleTabClick = (tab: ViewMode) => {
    if (tab === 'video') {
      setViewMode('video');
      play({
        type: 'video',
        url: videoUrl,
        title: videoTitle || 'AYAT OF THE MONTH',
        citation,
      });
    } else if (tab === 'audio') {
      setViewMode('audio');
      play({
        type: 'audio',
        url: fullAudioUrl,
        title: videoTitle || 'AYAT OF THE MONTH',
        citation,
        arabicImage: arabicImage || undefined,
      });
    } else if (tab === 'taraweeh') {
      setViewMode('taraweeh');
      stop(); // stop any playing media when switching to live
    }
  };

  const handleBack = () => {
    setViewMode('default');
    stop();
  };

  return (
    <section
      ref={sectionRef}
      id="ayat-of-the-month"
      className="relative w-full py-8 pb-32 px-4 sm:py-18 sm:px-4 lg:px-8 xl:px-50 flex items-center justify-center min-h-112.5 sm:min-h-197.75"
    >
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/assets/ayat/background.png"
          alt="Background"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-78 sm:max-w-178.5 flex flex-col items-center gap-4.5 sm:gap-12">
        {/* ── DEFAULT VIEW ───────────────────────────────────────────────── */}
        {viewMode === 'default' && (
          <>
            <div className="flex flex-col items-center gap-4.5 sm:gap-8.25 w-full">
              <p className="text-base sm:text-xl font-medium sm:font-normal text-white leading-4 sm:leading-7 text-center">
                {sectionLabel}
              </p>

              <div className="flex flex-col items-center gap-2.5 sm:gap-7 w-full max-w-178.5 sm:max-w-full">
                {arabicImage ? (
                  <div className="w-45 h-13.5 sm:w-[477.66px] sm:h-[143.3px] relative">
                    <Image
                      src={arabicImage}
                      alt={data?.arabicCalligraphyImage?.alt || ''}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : arabicText ? (
                  <div className="text-3xl sm:text-6xl font-normal text-white text-center" style={{ fontFamily: "'Amiri', serif" }}>
                    {arabicText}
                  </div>
                ) : null}
                <p className="text-base sm:text-[35px] font-medium sm:font-bold text-white leading-6 sm:leading-13 tracking-normal text-center">
                  &quot;{englishText}&quot;
                </p>
                {!isSeries && (
                  <p className="text-xs sm:text-lg font-normal italic text-white leading-4 sm:leading-7 text-center">
                    {citation}
                  </p>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── VIDEO VIEW ─────────────────────────────────────────────────── */}
        {viewMode === 'video' && (
          <>
            <p className="text-base sm:text-lg font-medium text-white leading-4 sm:leading-7 text-center">
              AYAT OF THE MONTH
            </p>
            <div className="flex flex-col items-center gap-4 sm:gap-6.25 w-full max-w-full sm:max-w-[735.5px]">
              <h3 className="text-xl sm:text-4xl font-bold text-white leading-7 sm:leading-13 text-center overflow-hidden text-ellipsis whitespace-nowrap px-4">
                {videoTitle}
              </h3>
              <div className="relative w-full aspect-735/413 bg-white rounded-xl overflow-hidden text-black/50">
                {embedUrl && (
                  <div
                    className={
                      showMiniPlayer
                        ? 'fixed z-[60] w-[278px] sm:w-[318px] aspect-video bottom-[55px] sm:bottom-[63px] right-[17px] sm:right-[25px] transition-all duration-300'
                        : 'w-full h-full'
                    }
                  >
                    <iframe
                      src={embedUrl}
                      title={videoTitle || 'Video player'}
                      className="w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {/* ── AUDIO VIEW ─────────────────────────────────────────────────── */}
        {viewMode === 'audio' && (
          <>
            <div className="flex flex-col items-center gap-4.5 sm:gap-8.25 w-full">
              <p className="text-base sm:text-xl font-medium sm:font-normal text-white leading-4 sm:leading-7 text-center">
                {sectionLabel}
              </p>
              <div className="flex flex-col items-center gap-2.5 sm:gap-7 w-full max-w-69 sm:max-w-full">
                {arabicImage ? (
                  <div className="w-45 h-13.5 sm:w-[477.66px] sm:h-[143.3px] relative">
                    <Image
                      src={arabicImage}
                      alt="Arabic Calligraphy"
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>
                ) : arabicText ? (
                  <div className="text-3xl sm:text-6xl font-normal text-white text-center" style={{ fontFamily: "'Amiri', serif" }}>
                    {arabicText}
                  </div>
                ) : null}
                <p className="text-base sm:text-4xl font-medium sm:font-bold text-white leading-6 sm:leading-13 text-center">
                  &quot;{englishText}&quot;
                </p>
                {!isSeries && (
                  <p className="text-xs sm:text-lg font-normal italic text-white leading-4 sm:leading-7 text-center">
                    {citation}
                  </p>
                )}
              </div>
            </div>
            <AudioPlayer
              audioUrl={fullAudioUrl}
              variant="dark"
              onPlay={() => {
                // When the user (re-)plays from the AudioPlayer, sync with the
                // context so MiniPlayer can reappear on scroll / page nav.
                play({
                  type: 'audio',
                  url: fullAudioUrl,
                  title: videoTitle || 'AYAT OF THE MONTH',
                  citation,
                  arabicImage: arabicImage || undefined,
                });
              }}
              onPause={() => contextPause()}
            />
          </>
        )}

        {/* ── LIVE TARAWEEH VIEW ─────────────────────────────────────────── */}
        {viewMode === 'taraweeh' && (
          <div className="flex flex-col items-center gap-4 sm:gap-6 w-full max-w-full sm:max-w-[735.5px]">
            {/* Header */}
            <div className="flex flex-col items-center gap-1.5">
              <div className="flex items-center gap-2">
                <FaCircle className="text-red-500 animate-pulse" size={10} />
                <p className="text-sm sm:text-base font-semibold text-white uppercase tracking-widest">
                  Live Taraweeh
                </p>
              </div>
              <p className="text-xs sm:text-sm font-normal text-white/70 text-center">
                Masjid Al-Falah Ilford — Live Stream
              </p>
            </div>

            {/* Embed Player */}
            <div
              ref={playerRef}
              className="relative w-full rounded-xl overflow-hidden shadow-2xl bg-[#111]"
            >
              <iframe
                src={TARAWEEH_URL}
                title="Live Taraweeh — Masjid Al-Falah Ilford"
                style={{ border: 'none', width: '100%', height: '172px', overflow: 'hidden' }}
                allow="autoplay"
                allowFullScreen
              />
            </div>

            {/* Fallback link */}
            <a
              href="https://emasjidlive.co.uk/listen/masjidalfalahilford"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs sm:text-sm text-white/60 hover:text-white underline transition-colors"
            >
              Open in eMasjid Live ↗
            </a>
          </div>
        )}
      </div>

      {/* ── Toggle Buttons — original circular style + Live Taraweeh ─────── */}
      <div className="absolute bottom-10 right-4 sm:right-8 lg:right-40.25 sm:bottom-26.75 z-20 flex flex-wrap justify-end sm:gap-5 gap-2 w-full max-w-[calc(100%-2rem)] sm:max-w-none sm:w-auto">
        {/* Back button — shown when not in default view */}
        {viewMode !== 'default' && (
          <button
            onClick={handleBack}
            className="h-10 sm:h-12 px-4 sm:px-5 bg-[#0e793c] rounded-full flex items-center justify-center gap-2 shadow-lg hover:bg-[#0c6632] transition-colors cursor-pointer shrink-0"
            title="Back to Ayat"
          >
            <FaArrowLeft size={14} className="text-white" />
            <span className="text-white text-sm sm:text-base font-medium whitespace-nowrap">Back</span>
          </button>
        )}

        {/* Audio */}
        <button
          onClick={() => handleTabClick('audio')}
          className="sm:w-12 sm:h-12 w-10 h-10 bg-[#0e793c] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0c6632] transition-colors cursor-pointer shrink-0"
          title="Listen Audio"
        >
          <Image
            src="/assets/ayat/video.svg"
            alt="audio"
            width={16}
            height={16}
            className="object-contain"
            unoptimized
          />
        </button>

        {/* Video */}
        <button
          onClick={() => handleTabClick('video')}
          className="sm:w-12 sm:h-12 w-10 h-10 bg-[#0e793c] rounded-full flex items-center justify-center shadow-lg hover:bg-[#0c6632] transition-colors cursor-pointer shrink-0"
          title="Watch Video"
        >
          <Image
            src="/assets/ayat/music.svg"
            alt="video"
            width={16}
            height={16}
            className="object-contain"
            unoptimized
          />
        </button>

        {/* Live Taraweeh */}
        <button
          onClick={() => handleTabClick('taraweeh')}
          className="h-10 sm:h-12 px-4 sm:px-5 bg-[#0e793c] rounded-full flex items-center justify-center gap-2 shadow-lg hover:bg-[#0c6632] transition-colors cursor-pointer shrink-0 relative"
          title="Live Taraweeh"
        >
          {taraweehActive && (
            <span className="absolute top-0 right-0 -mr-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          )}
          <FaCircle size={10} className="text-white" />
          <span className="text-white text-sm sm:text-base font-medium whitespace-nowrap">Live Taraweeh</span>
        </button>
      </div>
    </section>
  );
}
