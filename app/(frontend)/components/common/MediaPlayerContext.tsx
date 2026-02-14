'use client';

import { createContext, ReactNode, useContext, useState } from 'react';

export type MediaType = 'video' | 'audio';

export interface MediaData {
  type: MediaType;
  url: string;
  title: string;
  thumbnail?: string;
  citation?: string;
  arabicImage?: string;
}

interface MediaPlayerContextType {
  isPlaying: boolean;
  showMiniPlayer: boolean;
  mediaData: MediaData | null;
  play: (media: MediaData) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setShowMiniPlayer: (show: boolean) => void;
  togglePlayPause: () => void;
}

const MediaPlayerContext = createContext<MediaPlayerContextType | undefined>(
  undefined
);

export function MediaPlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showMiniPlayer, setShowMiniPlayer] = useState(false);
  const [mediaData, setMediaData] = useState<MediaData | null>(null);

  const play = (media: MediaData) => {
    setMediaData(media);
    setIsPlaying(true);
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const resume = () => {
    setIsPlaying(true);
  };

  const stop = () => {
    setIsPlaying(false);
    setShowMiniPlayer(false);
    setMediaData(null);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <MediaPlayerContext.Provider
      value={{
        isPlaying,
        showMiniPlayer,
        mediaData,
        play,
        pause,
        resume,
        stop,
        setShowMiniPlayer,
        togglePlayPause,
      }}
    >
      {children}
    </MediaPlayerContext.Provider>
  );
}

export function useMediaPlayer() {
  const context = useContext(MediaPlayerContext);
  if (context === undefined) {
    throw new Error('useMediaPlayer must be used within a MediaPlayerProvider');
  }
  return context;
}
