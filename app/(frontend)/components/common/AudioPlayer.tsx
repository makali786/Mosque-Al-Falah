"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { FaPause } from "react-icons/fa6";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false }) as unknown as React.ComponentType<any>;

interface AudioPlayerProps {
  audioUrl: string;
  className?: string;
  showPreviousNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

export default function AudioPlayer({
  audioUrl,
  className = "",
  showPreviousNext = true,
  onPrevious,
  onNext,
}: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);


  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleProgress = (state: { played: number }) => {
    if (!seeking) {
      setPlayed(state.played);
    }
  };

  const handleDuration = (duration: number) => {
    setDuration(duration);
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayed(parseFloat(e.target.value));
  };

  const handleSeekMouseUp = (e: React.MouseEvent<HTMLInputElement>) => {
    setSeeking(false);
    playerRef.current?.seekTo(parseFloat((e.target as HTMLInputElement).value));
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? "0" + sec : sec}`;
  };

  const currentTime = duration * played;

  return (
    <div className={`bg-black/30 rounded-xl p-6 flex flex-col gap-2 w-full relative ${className}`}>
      <div className="hidden">
        <ReactPlayer
          ref={playerRef}
          url={audioUrl}
          playing={isPlaying}
          controls={false}
          width="0"
          height="0"
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 w-full">
        {showPreviousNext && (
          <div className="flex-1 flex justify-end gap-2">
            <button
              onClick={onPrevious}
              disabled={!onPrevious}
              className="w-8 h-8 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image
                src="/assets/ayat/previous.svg"
                alt="Previous"
                width={16}
                height={16}
                className="object-contain"
              />
            </button>
          </div>
        )}

        <button
          onClick={handlePlayPause}
          className="w-8 h-8 bg-white rounded-full flex items-center justify-center cursor-pointer"
        >
          {isPlaying ? (
            <FaPause className="text-black w-3 h-3" />
          ) : (
            <Image
              src="/assets/ayat/play-small.svg"
              alt="Play"
              width={16}
              height={16}
              className="object-contain"
            />
          )}
        </button>

        {showPreviousNext && (
          <div className="flex-1 flex gap-2">
            <button
              onClick={onNext}
              disabled={!onNext}
              className="w-8 h-8 flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Image
                src="/assets/ayat/next.svg"
                alt="Next"
                width={16}
                height={16}
                className="object-contain"
              />
            </button>
          </div>
        )}
      </div>

      {/* Seekbar */}
      <div className="flex items-center gap-2 w-full">
        <span className="text-xs text-[#a7a7a7] min-w-6.5 text-right whitespace-nowrap">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 h-3 bg-white/30 rounded relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-white rounded pointer-events-none"
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
        <span className="text-xs text-[#a7a7a7] min-w-6.5 whitespace-nowrap">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
