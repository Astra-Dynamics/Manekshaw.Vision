import React from 'react';
import { Volume2, VolumeX, Square, Radio, ExternalLink } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface NowPlayingMiniBarProps {
  onOpenVideosTab?: () => void;
  isLight?: boolean;
}

export const NowPlayingMiniBar: React.FC<NowPlayingMiniBarProps> = ({ onOpenVideosTab, isLight = false }) => {
  const {
    activeStream,
    isPlaying,
    isMuted,
    playerState,
    isAutoplayBlocked,
    toggleMute,
    unmuteAndPlay,
    stopStream
  } = usePlayer();

  if (!isPlaying || !activeStream) return null;

  return (
    <div
      className={`shrink-0 border-b flex items-center justify-between px-3 py-1.5 text-xs font-mono transition-colors ${
        isLight
          ? 'bg-[var(--surface)] border-[var(--border-subtle)] text-[var(--text-primary)] shadow-sm'
          : 'bg-[#05080F]/95 border-sky-500/30 text-slate-200'
      }`}
      style={{ minHeight: '34px' }}
    >
      {/* Stream Info & Tab Switch Link */}
      <div
        onClick={onOpenVideosTab}
        className="flex items-center gap-2 truncate cursor-pointer hover:opacity-85 transition-opacity min-w-0 flex-1 mr-2"
        title="Click to view stream in full 16:9 view"
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse shrink-0"
          style={{ background: isLight ? 'var(--sev-ok)' : '#f43f5e' }}
        />
        <span className={`text-[10px] font-bold shrink-0 ${isLight ? 'text-[var(--text-tertiary)] tracking-wider' : 'text-sky-400'}`}>
          NOW PLAYING:
        </span>
        <span className="truncate font-semibold text-[11px]">
          {activeStream.channel || activeStream.title}
        </span>
      </div>

      {/* Control Actions */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Unmute Alert Pill */}
        {isAutoplayBlocked && (
          <button
            type="button"
            onClick={unmuteAndPlay}
            className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[9.5px] flex items-center gap-1 animate-pulse cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.4)]"
            title="Browser blocked unmuted sound. Click to enable audio."
          >
            <VolumeX size={10} />
            <span>UNMUTE</span>
          </button>
        )}

        {/* Mute / Unmute Toggle */}
        <button
          type="button"
          onClick={toggleMute}
          className={`p-1 rounded transition-colors cursor-pointer ${
            isLight ? 'hover:bg-[var(--bg-sunken)] text-[var(--text-secondary)]' : 'hover:bg-white/10 text-slate-300'
          }`}
          title={isMuted ? 'Unmute Audio (Full Volume)' : 'Mute Audio'}
        >
          {isMuted ? (
            <VolumeX size={13} className="text-amber-500" />
          ) : (
            <Volume2 size={13} className={isLight ? 'text-[var(--sev-ok)]' : 'text-emerald-400'} />
          )}
        </button>

        {/* Stop Stream */}
        <button
          type="button"
          onClick={stopStream}
          className={`p-1 rounded transition-colors cursor-pointer ${
            isLight
              ? 'text-[var(--text-muted)] hover:text-rose-600 hover:bg-rose-50'
              : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10'
          }`}
          title="Stop Playback"
        >
          <Square size={11} className="fill-current" />
        </button>
      </div>
    </div>
  );
};
