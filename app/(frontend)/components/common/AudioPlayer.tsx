"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { FaPause } from "react-icons/fa6";

interface AudioPlayerProps {
  audioUrl: string;
  className?: string;
  showPreviousNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
  variant?: 'light' | 'dark'; // Add variant prop
}

export default function AudioPlayer({
  audioUrl,
  className = "",
  showPreviousNext = true,
  onPrevious,
  onNext,
  variant = 'light', // Default to light variant
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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
    if (!isReady) return; // Don't allow play until ready
    setIsPlaying(!isPlaying);
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
    : 'bg-white border border-[#E4E4E7] shadow-sm';

  const buttonStyles = variant === 'dark'
    ? 'w-10 h-10 bg-white hover:bg-gray-100'
    : 'w-14 h-14 bg-[#006FEE] hover:bg-[#0062D1] shadow-md';

  const iconColor = variant === 'dark' ? 'black' : 'white';

  const timeStyles = variant === 'dark'
    ? 'text-xs text-[#a7a7a7]'
    : 'text-sm font-medium text-[#52525B]';

  const seekbarBgStyles = variant === 'dark'
    ? 'bg-white/30'
    : 'bg-[#E4E4E7]';

  const seekbarProgressStyles = variant === 'dark'
    ? 'bg-white'
    : 'bg-[#006FEE]';

  const navButtonStyles = variant === 'dark'
    ? 'w-8 h-8 hover:bg-white/10'
    : 'w-10 h-10 hover:bg-gray-100';

  return (
    <div className={`${containerStyles} rounded-[14px] p-6 sm:p-8 flex flex-col gap-6 w-full relative ${className}`}>
      {/* Hidden native audio element */}
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
      />

      {/* Controls */}
      <div className="flex items-center justify-center gap-6 w-full">
        {showPreviousNext && (
          <div className="flex-1 flex justify-end gap-3">
            <button
              onClick={onPrevious}
              disabled={!onPrevious}
              className={`${navButtonStyles} flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors`}
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
          disabled={!isReady}
          className={`${buttonStyles} rounded-full flex items-center justify-center cursor-pointer transition-colors ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isPlaying ? (
            <FaPause className={variant === 'dark' ? 'text-black w-5 h-5' : 'text-white w-5 h-5'} />
          ) : (
            <svg
              width="20"
              height="24"
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
          <div className="flex-1 flex gap-3">
            <button
              onClick={onNext}
              disabled={!onNext}
              className={`${navButtonStyles} flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors`}
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
      <div className="flex items-center gap-3 sm:gap-4 w-full">
        <span className={`${timeStyles} min-w-[40px] text-left whitespace-nowrap`}>
          {formatTime(currentTime)}
        </span>
        <div className={`flex-1 h-2 ${seekbarBgStyles} rounded-full relative`}>
          <div
            className={`absolute top-0 left-0 h-full ${seekbarProgressStyles} rounded-full pointer-events-none transition-all`}
            style={{ width: `${played * 100}%` }}
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
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        </div>
        <span className={`${timeStyles} min-w-[40px] text-right whitespace-nowrap`}>
          {formatTime(duration)}
        </span>
      </div>

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-500 text-center">
          {error}
        </div>
      )}
    </div>
  );
}
