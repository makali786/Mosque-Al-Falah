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
  hasPlayed: boolean;
  mediaData: MediaData | null;
  sourceUrl: string | null;
  play: (media: MediaData) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setShowMiniPlayer: (show: boolean) => void;
  togglePlayPause: () => void;
  isMainElementAlive: string | null;
  setIsMainElementAlive: (aliveUrl: string | null) => void;
  savedTimeRef: React.MutableRefObject<number>;
  setSourceUrl: (url: string) => void;
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
  // Tracks whether play() has been called at least once (reset on stop()).
  const [hasPlayed, setHasPlayed] = useState(false);
  // Tracks the media URL that the main component is currently handling (null when no main component is mounted).
  const [isMainElementAlive, setIsMainElementAlive] = useState<string | null>(null);
  // Stores the page URL where the media was played from.
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const savedTimeRef = useRef(0);

  const play = (media: MediaData) => {
    // If playing a completely new URL, reset savedTime. Else, keep it.
    if (mediaData?.url !== media.url) {
      savedTimeRef.current = 0;
    }
    setMediaData(media);
    setIsPlaying(true);
    setHasPlayed(true);
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
    setHasPlayed(false);
    setSourceUrl(null);
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
        hasPlayed,
        mediaData,
        sourceUrl,
        play,
        pause,
        resume,
        stop,
        setShowMiniPlayer,
        togglePlayPause,
        isMainElementAlive,
        setIsMainElementAlive,
        savedTimeRef,
        setSourceUrl,
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
