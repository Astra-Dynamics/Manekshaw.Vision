import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from 'react';
import { fetchLiveStream, getYouTubeEmbedUrl } from '../utils/youtubeResolver';

export type PlayerState = 'idle' | 'loading' | 'live' | 'offline' | 'error' | 'blocked-autoplay';

export interface StreamItem {
  id: string;
  title: string;
  channel: string;
  channelId?: string;
  videoId?: string;
  embedUrl?: string;
  externalUrl?: string;
  isLive?: boolean;
}

interface PlayerContextType {
  activeStream: StreamItem | null;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  playerState: PlayerState;
  isAutoplayBlocked: boolean;
  embedUrl: string;
  playStream: (stream: StreamItem) => Promise<void>;
  stopStream: () => void;
  toggleMute: () => void;
  unmuteAndPlay: () => void;
  setIframeRef: (iframe: HTMLIFrameElement | null) => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeStream, setActiveStream] = useState<StreamItem | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [playerState, setPlayerState] = useState<PlayerState>('idle');
  const [isAutoplayBlocked, setIsAutoplayBlocked] = useState<boolean>(false);
  const [embedUrl, setEmbedUrl] = useState<string>('');

  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const autoplayCheckTimerRef = useRef<any>(null);

  // Send command to YouTube iframe via postMessage (enablejsapi=1)
  const sendCommand = useCallback((func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      try {
        iframeRef.current.contentWindow.postMessage(
          JSON.stringify({ event: 'command', func, args }),
          '*'
        );
      } catch (e) {
        console.warn('[PlayerContext] postMessage warning:', e);
      }
    }
  }, []);

  const setIframeRef = useCallback((iframe: HTMLIFrameElement | null) => {
    iframeRef.current = iframe;
  }, []);

  // Listen for YouTube IFrame API postMessage events
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (typeof e.data !== 'string') return;
      try {
        const data = JSON.parse(e.data);
        if (data.event === 'onReady') {
          // 1. Autoplay at full volume by default
          sendCommand('playVideo');
          sendCommand('unMute');
          sendCommand('setVolume', [100]);
        } else if (data.event === 'onAutoplayBlocked') {
          // Browser blocked unmuted autoplay
          setIsAutoplayBlocked(true);
          setIsMuted(true);
          setPlayerState('blocked-autoplay');
          sendCommand('mute');
          sendCommand('playVideo');
        } else if (data.event === 'onStateChange') {
          // YT.PlayerState: 1 = PLAYING, 2 = PAUSED, 0 = ENDED, -1 = UNSTARTED
          if (data.info === 1) {
            setPlayerState('live');
            if (autoplayCheckTimerRef.current) {
              clearTimeout(autoplayCheckTimerRef.current);
            }
          }
        }
      } catch (err) {
        // Not a JSON message from YouTube
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendCommand]);

  // Play a selected stream (single global player instance)
  const playStream = useCallback(async (stream: StreamItem) => {
    setActiveStream(stream);
    setIsPlaying(true);
    setPlayerState('loading');
    setIsAutoplayBlocked(false);

    let resolvedVideoId = stream.videoId;
    let computedEmbedUrl = '';

    // If channelId is present, resolve live stream ID via /api/yt-live
    if (stream.channelId && stream.channelId.startsWith('UC')) {
      try {
        const liveRes = await fetchLiveStream(stream.channelId);
        if (liveRes.live && liveRes.videoId) {
          resolvedVideoId = liveRes.videoId;
          computedEmbedUrl = liveRes.embedUrl || getYouTubeEmbedUrl({ youtubeId: liveRes.videoId });
          setPlayerState('live');
        } else if (liveRes.status === 'offline') {
          setPlayerState('offline');
          computedEmbedUrl = liveRes.fallbackEmbedUrl || getYouTubeEmbedUrl({ channelId: stream.channelId, mode: 'live_stream' });
        } else {
          computedEmbedUrl = liveRes.fallbackEmbedUrl || getYouTubeEmbedUrl({ channelId: stream.channelId, mode: 'live_stream' });
          setPlayerState('fallback' as any);
        }
      } catch (e) {
        computedEmbedUrl = getYouTubeEmbedUrl({ channelId: stream.channelId, mode: 'live_stream' });
        setPlayerState('error');
      }
    } else if (resolvedVideoId) {
      computedEmbedUrl = getYouTubeEmbedUrl({ youtubeId: resolvedVideoId });
      setPlayerState('live');
    }

    // Ensure embedUrl contains enablejsapi=1 and origin
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.manvis.tech';
    if (computedEmbedUrl && !computedEmbedUrl.includes('enablejsapi=1')) {
      computedEmbedUrl += (computedEmbedUrl.includes('?') ? '&' : '?') + `enablejsapi=1&origin=${encodeURIComponent(origin)}&autoplay=1`;
    }

    // Remove any accidental mute=1
    computedEmbedUrl = computedEmbedUrl.replace(/[?&]mute=1/g, '');

    setEmbedUrl(computedEmbedUrl);

    // Watchdog: detect if browser blocked unmuted autoplay after 2.5 seconds
    if (autoplayCheckTimerRef.current) clearTimeout(autoplayCheckTimerRef.current);
    autoplayCheckTimerRef.current = setTimeout(() => {
      // If still stuck in loading or unstarted without playing
      if (playerState === 'loading' || playerState === 'live') {
        sendCommand('playVideo');
      }
    }, 2500);
  }, [playerState, sendCommand]);

  // Stop current playback
  const stopStream = useCallback(() => {
    sendCommand('stopVideo');
    setIsPlaying(false);
    setActiveStream(null);
    setEmbedUrl('');
    setPlayerState('idle');
    setIsAutoplayBlocked(false);
    if (autoplayCheckTimerRef.current) clearTimeout(autoplayCheckTimerRef.current);
  }, [sendCommand]);

  // Toggle Mute / Unmute
  const toggleMute = useCallback(() => {
    if (isMuted) {
      sendCommand('unMute');
      sendCommand('setVolume', [100]);
      setIsMuted(false);
      setIsAutoplayBlocked(false);
    } else {
      sendCommand('mute');
      setIsMuted(true);
    }
  }, [isMuted, sendCommand]);

  // Unmute and Play (User interaction handler for blocked autoplay)
  const unmuteAndPlay = useCallback(() => {
    sendCommand('unMute');
    sendCommand('setVolume', [100]);
    sendCommand('playVideo');
    setIsMuted(false);
    setIsAutoplayBlocked(false);
    setPlayerState('live');
  }, [sendCommand]);

  return (
    <PlayerContext.Provider
      value={{
        activeStream,
        isPlaying,
        isMuted,
        volume,
        playerState,
        isAutoplayBlocked,
        embedUrl,
        playStream,
        stopStream,
        toggleMute,
        unmuteAndPlay,
        setIframeRef
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}
