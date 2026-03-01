'use client';

import { createContext, ReactNode, useContext, useState, useRef } from 'react';

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
  isMainElementAlive: boolean;
  setIsMainElementAlive: (alive: boolean) => void;
  savedTimeRef: React.MutableRefObject<number>;
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
  // Tracks if the main component playing the media is still explicitly mounted in the DOM.
  const [isMainElementAlive, setIsMainElementAlive] = useState(false);
  const savedTimeRef = useRef(0);

  const play = (media: MediaData) => {
    // If playing a completely new URL, reset savedTime. Else, keep it.
    if (mediaData?.url !== media.url) {
      savedTimeRef.current = 0;
    }
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
        isMainElementAlive,
        setIsMainElementAlive,
        savedTimeRef,
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
