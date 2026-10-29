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
        className="relative aspect-video w-full rounded-[4px] flex flex-col items-center justify-center p-4 text-center font-mono shadow-lg"
        style={{
          background: isLight ? '#F8FAFC' : '#05080F',
          border: isLight ? '1px solid #CBD5E1' : '1px solid rgba(56, 189, 248, 0.25)'
        }}
      >
        <div className="w-10 h-10 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-2">
          <Play size={16} className="fill-current ml-0.5" />
        </div>
        <div className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          LIVE DEFENSE STREAM DESK
        </div>
        <div className="text-[10px] text-slate-400 mt-1 max-w-[85%] font-sans">
          Select any 24/7 geopolitical channel below to initiate instant live video feed.
        </div>
      </div>
    );
  }

  return (
    <div
      className={
        isVisible
          ? 'relative aspect-video w-full overflow-hidden rounded-[4px] shadow-lg'
          : 'fixed -top-[9999px] -left-[9999px] w-[1px] h-[1px] opacity-0 pointer-events-none'
      }
      style={{
        background: '#05080F',
        border: isVisible ? '1px solid rgba(56, 189, 248, 0.35)' : 'none'
      }}
    >
      {/* 1. Loading Overlay */}
      {playerState === 'loading' && isVisible && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 font-mono text-center p-4">
          <Loader2 size={24} className="text-sky-400 animate-spin mb-2" />
          <div className="text-[11px] text-sky-400 font-bold uppercase tracking-wider">
            [ACQUIRING SATELLITE BROADCAST]
          </div>
          <div className="text-[10px] text-slate-400 mt-1 truncate max-w-[85%]">
            {activeStream?.channel || activeStream?.title}
          </div>
        </div>
      )}

      {/* 2. Autoplay Blocked Overlay (Browser blocked unmuted playback) */}
      {isAutoplayBlocked && isVisible && (
        <div
          onClick={unmuteAndPlay}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] cursor-pointer group p-4 text-center transition-all"
        >
          <div className="px-3.5 py-2 rounded-[4px] bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.5)] transition-transform group-hover:scale-105">
            <VolumeX size={16} />
            <span>CLICK TO UNMUTE AUDIO</span>
          </div>
          <div className="text-[10px] text-amber-200/90 font-mono mt-2">
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
