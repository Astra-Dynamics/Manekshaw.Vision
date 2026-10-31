import React from 'react';
import { Play, Volume2, VolumeX, Square, ExternalLink, Radio, AlertCircle, Loader2 } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

export interface LiveStreamItem {
  id?: string;
  title: string;
  channel?: string;
  channelId?: string;
  youtubeId?: string;
  uploadsPlaylistId?: string;
  externalUrl?: string;
  isLive?: boolean;
}

interface LiveStreamCardProps {
  item: LiveStreamItem;
  className?: string;
  isLight?: boolean;
}

export const LiveStreamCard: React.FC<LiveStreamCardProps> = ({ item, className = '', isLight: propIsLight }) => {
  const isLight = propIsLight ?? (typeof document !== 'undefined' && document.body.classList.contains('light-theme'));
  const {
    activeStream,
    isPlaying,
    isMuted,
    playerState,
    isAutoplayBlocked,
    playStream,
    stopStream,
    toggleMute,
    unmuteAndPlay
  } = usePlayer();

  const isCurrentActive = activeStream && (
    (item.channelId && activeStream.channelId === item.channelId) ||
    activeStream.id === item.id
  );

  const channelId = item.channelId;
  const externalWatchUrl = item.externalUrl || (channelId ? `https://www.youtube.com/channel/${channelId}/live` : 'https://www.youtube.com');

  const handleTuneIn = (e: React.MouseEvent) => {
    e.stopPropagation();
    playStream({
      id: item.id || item.channelId || 'stream',
      title: item.title,
      channel: item.channel || item.title,
      channelId: item.channelId,
      videoId: item.youtubeId,
      externalUrl: item.externalUrl,
      isLive: item.isLive
    });
  };

  return (
    <div className={`flex-1 flex flex-col ${className}`}>
      {/* Video Container Frame */}
      <div
        className={`relative w-full flex-1 overflow-hidden mb-2 min-h-[140px] flex flex-col justify-between ${
          isLight
            ? 'rounded-[12px] shadow-sm border border-[var(--border-subtle)] bg-[var(--surface)] text-[var(--text-primary)]'
            : 'rounded-[3px] shadow-inner'
        }`}
        style={isLight ? undefined : {
          background: isCurrentActive ? 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, rgba(5, 8, 15, 0.98) 100%)' : '#05080F',
          border: isCurrentActive ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(56, 189, 248, 0.25)'
        }}
      >
        {isCurrentActive && playerState === 'loading' ? (
          <div className={`w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 text-center font-mono ${isLight ? 'bg-white/80' : 'bg-black/80'}`}>
            <Loader2 size={18} className={`animate-spin mb-2 ${isLight ? 'text-[var(--accent)]' : 'text-sky-400'}`} />
            <div className={`text-[10px] uppercase tracking-wider font-bold ${isLight ? 'text-[var(--accent-text)]' : 'text-sky-400'}`}>
              [RESOLVING SATELLITE FEED]
            </div>
            <div className={`text-[9px] mt-1 truncate max-w-[90%] ${isLight ? 'text-[var(--text-tertiary)] font-sans' : 'text-slate-500'}`}>
              {item.channel || item.title}
            </div>
          </div>
        ) : isCurrentActive ? (
          <div className="w-full h-full min-h-[140px] flex flex-col justify-between p-3 font-mono">
            <div className="flex items-center justify-between">
              <span className={`text-[9.5px] px-1.5 py-0.5 rounded font-bold animate-pulse flex items-center gap-1 ${
                isLight ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] border border-[var(--accent)]/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLight ? 'bg-[var(--accent)]' : 'bg-rose-500'}`} />
                TUNED IN (GLOBAL DESK)
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleMute}
                  className={`p-1 rounded transition-colors ${isLight ? 'hover:bg-[var(--bg-sunken)] text-[var(--text-secondary)]' : 'hover:bg-white/10 text-slate-300'}`}
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={12} className="text-amber-500" /> : <Volume2 size={12} className={isLight ? 'text-[var(--sev-ok)]' : 'text-emerald-400'} />}
                </button>
                <button
                  type="button"
                  onClick={stopStream}
                  className={`p-1 rounded transition-colors ${isLight ? 'hover:bg-rose-50 text-[var(--text-muted)] hover:text-rose-600' : 'hover:bg-rose-500/20 text-slate-400 hover:text-rose-400'}`}
                  title="Stop Stream"
                >
                  <Square size={10} className="fill-current" />
                </button>
              </div>
            </div>

            <div className="text-center my-2">
              <div className={`text-xs font-bold truncate ${isLight ? 'text-[var(--text-primary)] font-serif' : 'text-white'}`}>{item.channel || item.title}</div>
              <div className={`text-[9.5px] font-sans mt-0.5 ${isLight ? 'text-[var(--text-secondary)]' : 'text-sky-400/80'}`}>Playing at full volume through global player host</div>
              {isAutoplayBlocked && (
                <button
                  type="button"
                  onClick={unmuteAndPlay}
                  className={`mt-2 px-2.5 py-1 text-[10px] inline-flex items-center gap-1 animate-pulse ${
                    isLight
                      ? 'rounded-[6px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-sans font-semibold shadow-none'
                      : 'rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold'
                  }`}
                >
                  <VolumeX size={11} />
                  <span>TAP TO UNMUTE AUDIO</span>
                </button>
              )}
            </div>

            <div className={`flex items-center justify-between text-[9px] border-t pt-1.5 ${isLight ? 'border-[var(--border-subtle)] text-[var(--text-tertiary)]' : 'border-white/10 text-slate-400'}`}>
              <span>Single Global Player</span>
              <a href={externalWatchUrl} target="_blank" rel="noopener noreferrer" className={`${isLight ? 'text-[var(--accent-text)]' : 'text-sky-400'} hover:underline flex items-center gap-1`}>
                <span>YouTube</span>
                <ExternalLink size={9} />
              </a>
            </div>
          </div>
        ) : (
          /* Standby Card with 1-click Tune In */
          <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-3 text-center font-mono">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
              isLight ? 'bg-[var(--accent-soft)] border border-[var(--accent)]/30 text-[var(--accent-text)]' : 'bg-sky-500/10 border border-sky-500/30 text-sky-400'
            }`}>
              <Radio size={14} className="opacity-80" />
            </div>
            <div className={`text-[11px] font-bold mb-1 truncate max-w-[95%] ${isLight ? 'text-[var(--text-primary)] font-serif' : 'text-slate-200'}`}>
              {item.channel || item.title}
            </div>
            <button
              type="button"
              onClick={handleTuneIn}
              className={`mt-1 px-3 py-1.5 text-[10px] flex items-center gap-1.5 cursor-pointer transition-all hover:scale-105 ${
                isLight
                  ? 'rounded-[8px] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-sans font-medium shadow-none'
                  : 'rounded-[3px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold shadow-[0_0_12px_rgba(56,189,248,0.35)]'
              }`}
            >
              <Play size={10} className="fill-current" />
              <span>TUNE IN LIVE (FULL VOLUME)</span>
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Status Indicator Bar */}
      <div className={`flex items-center justify-between text-[10px] font-mono ${isLight ? 'text-[var(--text-tertiary)]' : 'text-slate-400'}`}>
        <span className="truncate">{item.channel || 'Live Broadcast'}</span>
        {isCurrentActive ? (
          playerState === 'loading' ? (
            <span className={`font-bold animate-pulse ${isLight ? 'text-[var(--accent-text)]' : 'text-sky-400'}`}>⟳ LOADING</span>
          ) : playerState === 'blocked-autoplay' ? (
            <button onClick={unmuteAndPlay} className={`font-bold animate-pulse cursor-pointer ${isLight ? 'text-[var(--sev-high)]' : 'text-amber-400'}`}>🔊 TAP TO UNMUTE</button>
          ) : playerState === 'live' ? (
            <span className={`font-bold ${isLight ? 'text-[var(--sev-ok)]' : 'text-emerald-400'}`}>● ACTIVE STREAM</span>
          ) : playerState === 'offline' ? (
            <span className={`font-bold ${isLight ? 'text-[var(--text-tertiary)]' : 'text-amber-400'}`}>○ OFFLINE</span>
          ) : (
            <span className={`font-bold ${isLight ? 'text-[var(--sev-critical)]' : 'text-rose-400'}`}>✕ STREAM ERROR</span>
          )
        ) : (
          <span className={`font-medium ${isLight ? 'text-[var(--text-tertiary)]' : 'text-slate-500'}`}>○ STANDBY</span>
        )}
      </div>
    </div>
  );
};
