'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

export type MediaType = 'video' | 'audio';
export type PlayerMode = 'HIDDEN' | 'MINI' | 'ANCHORED';

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
  playerMode: PlayerMode;
  mediaData: MediaData | null;
  sourceUrl: string | null;
  play: (media: MediaData) => void;
  pause: () => void;
  resume: () => void;
  stop: () => void;
  setPlayerMode: (mode: PlayerMode) => void;
  togglePlayPause: () => void;

  savedTimeRef: React.MutableRefObject<number>;
  setSourceUrl: (url: string) => void;
}

const MediaPlayerContext = createContext<MediaPlayerContextType | undefined>(
  undefined
);

export function MediaPlayerProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playerMode, setPlayerMode] = useState<PlayerMode>('HIDDEN');
  const [mediaData, setMediaData] = useState<MediaData | null>(null);

  // Stores the page URL where the media was played from.
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const savedTimeRef = useRef(0);

  // ── Global YouTube Time Tracking ───────────────────────────────────────────
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data =
          typeof event.data === 'string' ? JSON.parse(event.data) : event.data;

        // When a YouTube player is ready, tell it we are listening
        if (data.event === 'initialDelivery' || data.event === 'onReady') {
          if (
            event.source &&
            typeof (event.source as Window).postMessage === 'function'
          ) {
            (event.source as Window).postMessage(
              JSON.stringify({ event: 'listening' }),
              '*'
            );
          }
        }

        // Continuously track the playback time
        if (
          data.event === 'infoDelivery' &&
          data.info?.currentTime !== undefined
        ) {
          savedTimeRef.current = Math.floor(data.info.currentTime);
        }
      } catch {
        // ignore non-JSON messages
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const play = (media: MediaData) => {
    // If playing a completely new URL, reset savedTime. Else, keep it.
    if (mediaData?.url !== media.url) {
      savedTimeRef.current = 0;
    }
    setMediaData(media);
    setIsPlaying(true);
    setPlayerMode(prev => (prev === 'HIDDEN' ? 'MINI' : prev));
  };

  const pause = () => {
    setIsPlaying(false);
  };

  const resume = () => {
    setIsPlaying(true);
  };

  const stop = () => {
    setIsPlaying(false);
    setPlayerMode('HIDDEN');
    setMediaData(null);
    setSourceUrl(null);
    savedTimeRef.current = 0;
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  return (
    <MediaPlayerContext.Provider
      value={{
        isPlaying,
        playerMode,
        mediaData,
        sourceUrl,
        play,
        pause,
        resume,
        stop,
        setPlayerMode,
        togglePlayPause,
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
