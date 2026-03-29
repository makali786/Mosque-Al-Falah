'use client';

import { useMediaPlayer } from '@/components/common/MediaPlayerContext';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaArrowLeft, FaCircle, FaPlay } from 'react-icons/fa';

interface AudioFile {
  url?: string;
}

interface ArabicImage {
  url?: string;
  alt?: string;
}

interface AyatData {
  id: number;
  featured: boolean;
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  arabicText?: string;
  arabicCalligraphyImage?: ArabicImage;
  englishTranslation: string;
  videoTitle?: string;
  videoUrl?: string;
  audioUrl?: string; // Legacy text field
  audioFile?: AudioFile; // New upload field
  defaultTab?: string;
  createdAt: string;
  updatedAt: string;
}

interface AyatOfTheMonthProps {
  ayatOfTheMonth: AyatData[];
}

type ViewMode = 'default' | 'video' | 'audio' | 'taraweeh';

const TARAWEEH_URL =
  'https://emasjidlive.co.uk/miniplayer/masjidalfalahilford?theme=dark';

/** Returns true if current local time is within the Taraweeh window (after Isha until midnight). */
function isInTaraweehWindow(ishaTimeStr: string): boolean {
  try {
    const ishaSplit = ishaTimeStr.split(' ');
    let [hours, minutes] = ishaSplit[0].split(':').map(Number);
    if (ishaSplit[1]?.toLowerCase() === 'pm' && hours !== 12) {
      hours += 12;
    } else if (ishaSplit[1]?.toLowerCase() === 'am' && hours === 12) {
      hours = 0;
    }
    const today = new Date();
    const ishaDate = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      hours,
      minutes
    );
    const windowStart = new Date(ishaDate.getTime() + 15 * 60000); // 15 mins after Isha
    const windowEnd = new Date(ishaDate.getTime() + 2 * 60 * 60000); // 2 hours after Isha
    return today >= windowStart && today <= windowEnd;
  } catch (e) {
    return false;
  }
}

export default function AyatOfTheMonth({
  ayatOfTheMonth = [],
}: AyatOfTheMonthProps) {
  const initialMode = (ayatOfTheMonth[0]?.defaultTab as ViewMode) || 'audio';
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [taraweehActive, setTaraweehActive] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const { play, playerMode, mediaData, setSourceUrl } = useMediaPlayer();

  // ── Compute local media URLs early ────────────────────────────
  const _data = ayatOfTheMonth?.[0];
  const _localVideoUrl = _data?.videoUrl || '';
  const _localAudioUrl = _data?.audioFile?.url || _data?.audioUrl || '';
  const _localFullAudioUrl =
    _localAudioUrl && _localAudioUrl.startsWith('/')
      ? `${typeof window !== 'undefined' ? window.location.origin : ''}${_localAudioUrl}`
      : _localAudioUrl;

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
          // setViewMode('taraweeh');
        }
      } catch {
        // Fail silently — Taraweeh tab still shows, just not auto-selected
      }
    };
    checkTaraweeh();
  }, []);

  if (!ayatOfTheMonth || ayatOfTheMonth.length === 0) {
    return (
      <section
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
        {/* Empty state */}
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <p className="text-base sm:text-xl font-medium text-white/80 uppercase tracking-widest">
            Ayat of the Month
          </p>
          <p className="text-lg sm:text-2xl font-medium text-white/60 max-w-md">
            A new featured verse will be shared soon. Please check back.
          </p>
        </div>
      </section>
    );
  }
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

  const isVideoPlaying = mediaData?.url === videoUrl && playerMode !== 'HIDDEN';
  const isAudioPlaying = mediaData?.url === fullAudioUrl && playerMode !== 'HIDDEN';

  // ── Tab bar at bottom of default/taraweeh view ────────────────────────────
  const tabs: { id: ViewMode; label: string; isLive?: boolean }[] = [
    { id: 'video', label: 'Video' },
    { id: 'audio', label: 'Audio' },
    { id: 'taraweeh', label: 'Live Taraweeh', isLive: true },
  ];

  const handleTabClick = (tab: ViewMode) => {
    setViewMode(tab);
    if (tab === 'video' && videoUrl) {
      play({
        type: 'video',
        url: videoUrl,
        title: videoTitle || 'AYAT OF THE MONTH',
        citation,
      });
      if (typeof window !== 'undefined') {
        setSourceUrl(window.location.pathname + '#ayat-of-the-month');
      }
    } else if (tab === 'audio' && fullAudioUrl) {
      play({
        type: 'audio',
        url: fullAudioUrl,
        title: videoTitle || 'AYAT OF THE MONTH',
        citation,
        arabicImage: arabicImage || undefined,
      });
      if (typeof window !== 'undefined') {
        setSourceUrl(window.location.pathname + '#ayat-of-the-month');
      }
    }
  };

  const handleBack = () => {
    setViewMode('default');
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
                  <div
                    className="text-3xl sm:text-6xl font-normal text-white text-center"
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
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
              <div ref={playerRef} className="relative w-full aspect-735/413 bg-white rounded-xl overflow-hidden text-black/50">
                {isVideoPlaying ? (
                  <div id="video-anchor" className="w-full h-full pointer-events-none" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-900 cursor-pointer" onClick={() => handleTabClick('video')}>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300">
                      <div className="w-12 h-12 sm:w-14 sm:h-14 bg-white rounded-full flex items-center justify-center">
                        <FaPlay className="text-black ml-1 text-xl sm:text-2xl" />
                      </div>
                    </div>
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
                  <div
                    className="text-3xl sm:text-6xl font-normal text-white text-center"
                    style={{ fontFamily: "'Amiri', serif" }}
                  >
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
            {/* The audio container */}
            <div ref={playerRef} className="w-full max-w-md h-16 relative mt-4">
              {isAudioPlaying ? (
                <div id="video-anchor" className="w-full h-full pointer-events-none" />
              ) : (
                <button
                  onClick={() => handleTabClick('audio')}
                  className="w-full h-full bg-[#18181b] rounded-xl flex items-center justify-center text-white hover:bg-gray-800 transition"
                >
                  <FaPlay className="mr-3 text-[#006fee]" />
                  <span className="font-medium text-sm">Play Audio Recitation</span>
                </button>
              )}
            </div>
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
                style={{
                  border: 'none',
                  width: '100%',
                  height: '172px',
                  overflow: 'hidden',
                }}
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
            <span className="text-white text-sm sm:text-base font-medium whitespace-nowrap">
              Back
            </span>
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
          <span className="text-white text-sm sm:text-base font-medium whitespace-nowrap">
            Live Taraweeh
          </span>
        </button>
      </div>
    </section>
  );
}
