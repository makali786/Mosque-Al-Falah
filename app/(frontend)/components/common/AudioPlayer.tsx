"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaPause } from "react-icons/fa6";
import { useMediaPlayer } from "./MediaPlayerContext";

interface AudioPlayerProps {
  audioUrl: string;
  className?: string;
  showPreviousNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  variant?: 'light' | 'dark'; // Add variant prop
  onPlay?: () => void;   // Called when the user starts playback
  onPause?: () => void;  // Called when the user pauses playback
}

export default function AudioPlayer({
  audioUrl,
  className = "",
  showPreviousNext = true,
  onPrevious,
  onNext,
  variant = 'light', // Default to light variant
  onPlay,
  onPause,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  // ── Sync local playback state with global MediaPlayerContext ───────────────
  const { showMiniPlayer, isPlaying: globalIsPlaying, mediaData, savedTimeRef } = useMediaPlayer();
  const isGlobalActiveTrack = mediaData?.url === audioUrl;
  const isMiniPlayerActive = showMiniPlayer && isGlobalActiveTrack;

  useEffect(() => {
    // If this AudioPlayer is the active track in the global Context,
    // match our local playing state to the global one.
    // This allows the MiniPlayer Pause/Play buttons to control this active player
    // without interrupting playback on scroll.
    if (isGlobalActiveTrack && isPlaying !== globalIsPlaying) {
      setIsPlaying(globalIsPlaying);
    }
  }, [isGlobalActiveTrack, globalIsPlaying, isPlaying]);

  // Handle audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsReady(true);
      setError(null);
    };

    const handleTimeUpdate = () => {
      if (!seeking && audio.duration) {
        setCurrentTime(audio.currentTime);
        setPlayed(audio.currentTime / audio.duration);
        if (isGlobalActiveTrack) {
          savedTimeRef.current = audio.currentTime;
        }
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
    };

    const handleError = () => {
      console.error('Audio loading error');
      setError('Unable to load audio file');
      setIsPlaying(false);
      setIsReady(false);
    };

    const handleCanPlay = () => {
      setIsReady(true);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [seeking]);

  // Handle play/pause
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error('Play error:', err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handlePlayPause = () => {
    if (!isReady || isMiniPlayerActive) return; // Don't allow play until ready or if MiniPlayer is active
    const willPlay = !isPlaying;
    setIsPlaying(willPlay);
    // Notify parent so it can sync with the MediaPlayerContext
    if (willPlay) {
      onPlay?.();
    } else {
      onPause?.();
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPlayed = parseFloat(e.target.value);
    setPlayed(newPlayed);
    if (audioRef.current) {
      audioRef.current.currentTime = newPlayed * duration;
      setCurrentTime(newPlayed * duration);
    }
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    if (audioRef.current) {
      audioRef.current.currentTime = parseFloat((e.target as HTMLInputElement).value) * duration;
    }
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  // Conditional styles based on variant
  const containerStyles = variant === 'dark'
    ? 'bg-black/30 border-0'
    : 'bg-gradient-to-br from-white to-gray-50/50 border border-[#E4E4E7] shadow-lg';

  const buttonStyles = variant === 'dark'
    ? 'w-12 h-12 sm:w-14 sm:h-14 bg-white hover:bg-gray-100 shadow-lg'
    : 'w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#006FEE] to-[#0062D1] hover:from-[#0062D1] hover:to-[#0052B1] shadow-xl hover:shadow-2xl';

  const iconColor = variant === 'dark' ? 'black' : 'white';

  const timeStyles = variant === 'dark'
    ? 'text-xs text-[#a7a7a7]'
    : 'text-sm font-semibold text-[#71717A]';

  const seekbarBgStyles = variant === 'dark'
    ? 'bg-white/30'
    : 'bg-[#E4E4E7]';

  const seekbarProgressStyles = variant === 'dark'
    ? 'bg-white'
    : 'bg-gradient-to-r from-[#006FEE] to-[#0080FF]';

  const navButtonStyles = variant === 'dark'
    ? 'w-8 h-8 hover:bg-white/10'
    : 'w-10 h-10 hover:bg-gray-100';

  return (
    <div className={`${containerStyles} rounded-[20px] p-8 sm:p-10 flex flex-col gap-8 w-full relative ${className}`}>
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />

      {/* MiniPlayer active overlay — shown when MiniPlayer is open */}
      {isMiniPlayerActive && (
        <div className="absolute inset-0 z-20 rounded-[20px] bg-black/50 backdrop-blur-sm flex items-center justify-center pointer-events-none">
          <div className="bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-center">
            <p className="text-white text-sm font-medium">
              Media is playing in the MiniPlayer
            </p>
            <p className="text-white/60 text-xs mt-1">
              Close the MiniPlayer to use this player
            </p>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={`flex items-center justify-center gap-8 w-full ${isMiniPlayerActive ? 'opacity-40 pointer-events-none' : ''}`}>
        {showPreviousNext && (
          <div className="flex-1 flex justify-end gap-4">
            <button
              onClick={onPrevious}
              disabled={!onPrevious || isMiniPlayerActive}
              className={`${navButtonStyles} flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all duration-200`}
            >
              <Image
                src="/assets/ayat/previous.svg"
                alt="Previous"
                width={20}
                height={20}
                className="object-contain"
              />
            </button>
          </div>
        )}

        <button
          onClick={handlePlayPause}
          disabled={!isReady || isMiniPlayerActive}
          className={`${buttonStyles} rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 transform hover:scale-105 active:scale-95 ${(!isReady || isMiniPlayerActive) ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPlaying ? (
            <FaPause className={variant === 'dark' ? 'text-black w-5 h-5 sm:w-6 sm:h-6' : 'text-white w-6 h-6 sm:w-7 sm:h-7'} />
          ) : (
            <svg
              width={variant === 'dark' ? '20' : '24'}
              height={variant === 'dark' ? '24' : '28'}
              viewBox="0 0 20 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ml-1"
            >
              <path
                d="M2 2.5L18 12L2 21.5V2.5Z"
                fill={iconColor}
                stroke={iconColor}
                strokeWidth="2"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        {showPreviousNext && (
          <div className="flex-1 flex gap-4">
            <button
              onClick={onNext}
              disabled={!onNext || isMiniPlayerActive}
              className={`${navButtonStyles} flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-all duration-200`}
            >
              <Image
                src="/assets/ayat/next.svg"
                alt="Next"
                width={20}
                height={20}
                className="object-contain"
              />
            </button>
          </div>
        )}
      </div>

      {/* Seekbar */}
      <div className={`flex items-center gap-4 sm:gap-5 w-full ${isMiniPlayerActive ? 'opacity-40 pointer-events-none' : ''}`}>
        <span className={`${timeStyles} min-w-[45px] text-left whitespace-nowrap tabular-nums`}>
          {formatTime(currentTime)}
        </span>
        <div className={`flex-1 h-2.5 ${seekbarBgStyles} rounded-full relative group cursor-pointer`}>
          {/* Progress bar */}
          <div
            className={`absolute top-0 left-0 h-full ${seekbarProgressStyles} rounded-full pointer-events-none transition-all duration-150 shadow-sm`}
            style={{ width: `${played * 100}%` }}
          />
          {/* Thumb/Handle */}
          <div
            className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 ${variant === 'dark' ? 'bg-white' : 'bg-[#006FEE]'} rounded-full pointer-events-none transition-all duration-150 shadow-md opacity-0 group-hover:opacity-100`}
            style={{ left: `calc(${played * 100}% - 8px)` }}
          />
          <input
            type="range"
            min={0}
            max={0.999999}
            step="any"
            value={played}
            onMouseDown={handleSeekMouseDown}
            onChange={handleSeekChange}
            onMouseUp={handleSeekMouseUp}
            disabled={isMiniPlayerActive}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 disabled:cursor-not-allowed"
          />
        </div>
        <span className={`${timeStyles} min-w-[45px] text-right whitespace-nowrap tabular-nums`}>
          {formatTime(duration)}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-500 text-center font-medium">
          {error}
        </div>
      )}
    </div>
  );
}

