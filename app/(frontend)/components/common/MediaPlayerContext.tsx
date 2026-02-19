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
  userClosed: boolean;
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
  // Tracks whether the user explicitly closed the MiniPlayer via the ✕ button.
  // Reset to false whenever play() is called so the MiniPlayer can re-appear.
  const [userClosed, setUserClosed] = useState(false);

  const play = (media: MediaData) => {
    setMediaData(media);
    setIsPlaying(true);
    setUserClosed(false); // allow MiniPlayer to show again after a close
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
    setUserClosed(true); // user explicitly closed — suppress auto-show until next play()
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <MediaPlayerContext.Provider
      value={{
        isPlaying,
        showMiniPlayer,
        userClosed,
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
