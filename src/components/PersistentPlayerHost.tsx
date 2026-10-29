import React, { useEffect, useRef } from 'react';
import { VolumeX, Volume2, Play, ExternalLink, AlertCircle, Loader2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface PersistentPlayerHostProps {
  isVisible: boolean; // True when on 'videos' tab in RightIntelligencePanel
  isLight?: boolean;
}

export const PersistentPlayerHost: React.FC<PersistentPlayerHostProps> = ({ isVisible, isLight = false }) => {
  const {
    activeStream,
    isPlaying,
    isMuted,
    playerState,
    isAutoplayBlocked,
    embedUrl,
    unmuteAndPlay,
    setIframeRef
  } = usePlayer();

  const iframeElementRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setIframeRef(iframeElementRef.current);
  }, [setIframeRef]);

  // If no stream has ever been played and none is active, show the standby briefing screen when visible
  if (!isPlaying && !activeStream && isVisible) {
    return (
      <div
        className={`relative aspect-video w-full flex flex-col items-center justify-center p-4 text-center font-mono shadow-md ${
          isLight
            ? 'rounded-[12px] bg-[var(--bg-panel)] border border-[var(--border-subtle)]'
            : 'rounded-[4px] bg-[#05080F] border border-sky-500/25'
        }`}
      >
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            isLight
              ? 'bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent-text)]'
              : 'bg-sky-500/10 border border-sky-500/30 text-sky-400'
          }`}
        >
          <Play size={16} className="fill-current ml-0.5" />
        </div>
        <div className={`text-xs font-bold uppercase tracking-wider ${isLight ? 'text-[var(--text-primary)] font-serif' : 'text-slate-200'}`}>
          LIVE DEFENSE STREAM DESK
        </div>
        <div className={`text-[10px] mt-1 max-w-[85%] font-sans ${isLight ? 'text-[var(--text-secondary)]' : 'text-slate-400'}`}>
          Select any 24/7 geopolitical channel below to initiate instant live video feed.
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isVisible
          ? `relative aspect-video w-full overflow-hidden shadow-lg ${
              isLight ? 'rounded-[12px] border border-[var(--border-subtle)]' : 'rounded-[4px] border border-sky-500/35'
            }`
          : 'fixed -top-[9999px] -left-[9999px] w-[1px] h-[1px] opacity-0 pointer-events-none'
      }
      style={{
        background: '#05080F'
      }}
    >
      {/* 1. Loading Overlay */}
      {playerState === 'loading' && isVisible && (
        <div
          className={`absolute inset-0 z-10 flex flex-col items-center justify-center font-mono text-center p-4 ${
            isLight ? 'bg-[#FAF9F5]/90 backdrop-blur-[2px]' : 'bg-black/85'
          }`}
        >
          <Loader2 size={24} className={`animate-spin mb-2 ${isLight ? 'text-[var(--accent)]' : 'text-sky-400'}`} />
          <div className={`text-[11px] font-bold uppercase tracking-wider ${isLight ? 'text-[var(--accent-text)]' : 'text-sky-400'}`}>
            [ACQUIRING SATELLITE BROADCAST]
          </div>
          <div className={`text-[10px] mt-1 truncate max-w-[85%] ${isLight ? 'text-[var(--text-secondary)] font-sans' : 'text-slate-400'}`}>
            {activeStream?.channel || activeStream?.title}
          </div>
        </div>
      )}

      {/* 2. Autoplay Blocked Overlay (Browser blocked unmuted playback) */}
      {isAutoplayBlocked && isVisible && (
        <div
          onClick={unmuteAndPlay}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center cursor-pointer group p-4 text-center transition-all"
          style={{
            background: isLight ? 'rgba(31, 30, 29, 0.72)' : 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(2px)'
          }}
        >
          <div
            className={`px-3.5 py-2 flex items-center gap-2 shadow-lg transition-transform group-hover:scale-105 ${
              isLight
                ? 'rounded-[8px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-sans text-xs font-semibold'
                : 'rounded-[4px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs shadow-[0_0_20px_rgba(245,158,11,0.5)]'
            }`}
          >
            <VolumeX size={16} />
            <span>CLICK TO UNMUTE AUDIO</span>
          </div>
          <div className={`text-[10px] font-mono mt-2 ${isLight ? 'text-stone-300' : 'text-amber-200/90'}`}>
            Browser policy required user interaction for sound
          </div>
        </div>
      )}

      {/* 3. The Persistent IFrame (Never Unmounted, Never Re-keyed) */}
      <iframe
        ref={iframeElementRef}
        id="manvis-global-player"
        src={embedUrl}
        title={activeStream?.title || 'Manekshaw.Vision Tactical Live Stream'}
        className="w-full h-full border-0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
};
