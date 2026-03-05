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
  setUserClosed: (closed: boolean) => void;
  togglePlayPause: () => void;

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

  // Stores the page URL where the media was played from.
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const savedTimeRef = useRef(0);

  // ── Global YouTube Time Tracking ───────────────────────────────────────────
  // Listen for messages from ANY YouTube iframe on the page.
  // We must send {"event": "listening"} to the iframe when it's ready,
  // otherwise it won't broadcast "infoDelivery" events with the current time.
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
        setUserClosed,
        hasPlayed,
        mediaData,
        sourceUrl,
        play,
        pause,
        resume,
        stop,
        setShowMiniPlayer,
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
