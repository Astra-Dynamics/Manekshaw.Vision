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
}

export const LiveStreamCard: React.FC<LiveStreamCardProps> = ({ item, className = '' }) => {
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
        className="relative w-full flex-1 overflow-hidden rounded-[3px] shadow-inner mb-2 min-h-[140px] flex flex-col justify-between"
        style={{
          background: isCurrentActive ? 'radial-gradient(circle at 50% 50%, rgba(14, 165, 233, 0.15) 0%, rgba(5, 8, 15, 0.98) 100%)' : '#05080F',
          border: isCurrentActive ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(56, 189, 248, 0.25)'
        }}
      >
        {isCurrentActive && playerState === 'loading' ? (
          <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 text-center bg-black/80 font-mono">
            <Loader2 size={18} className="text-sky-400 animate-spin mb-2" />
            <div className="text-[10px] text-sky-400 uppercase tracking-wider font-bold">
              [RESOLVING SATELLITE FEED]
            </div>
            <div className="text-[9px] text-slate-500 mt-1 truncate max-w-[90%]">
              {item.channel || item.title}
            </div>
          </div>
        ) : isCurrentActive ? (
          <div className="w-full h-full min-h-[140px] flex flex-col justify-between p-3 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-[9.5px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 font-bold animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                TUNED IN (GLOBAL DESK)
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={toggleMute}
                  className="p-1 rounded hover:bg-white/10 text-slate-300 transition-colors"
                  title={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted ? <VolumeX size={12} className="text-amber-400" /> : <Volume2 size={12} className="text-emerald-400" />}
                </button>
                <button
                  type="button"
                  onClick={stopStream}
                  className="p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Stop Stream"
                >
                  <Square size={10} className="fill-current" />
                </button>
              </div>
            </div>

            <div className="text-center my-2">
              <div className="text-xs font-bold text-white truncate">{item.channel || item.title}</div>
              <div className="text-[9.5px] text-sky-400/80 font-sans mt-0.5">Playing at full volume through global player host</div>
              {isAutoplayBlocked && (
                <button
                  type="button"
                  onClick={unmuteAndPlay}
                  className="mt-2 px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] inline-flex items-center gap-1 animate-pulse"
                >
                  <VolumeX size={11} />
                  <span>TAP TO UNMUTE AUDIO</span>
                </button>
              )}
            </div>

            <div className="flex items-center justify-between text-[9px] text-slate-400 border-t border-white/10 pt-1.5">
              <span>Single Global Player</span>
              <a href={externalWatchUrl} target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline flex items-center gap-1">
                <span>YouTube</span>
                <ExternalLink size={9} />
              </a>
            </div>
          </div>
        ) : (
          /* Standby Card with 1-click Tune In */
          <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-3 text-center font-mono">
            <div className="w-8 h-8 rounded-full bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 mb-2">
              <Radio size={14} className="opacity-80" />
            </div>
            <div className="text-[11px] font-bold text-slate-200 mb-1 truncate max-w-[95%]">
              {item.channel || item.title}
            </div>
            <button
              type="button"
              onClick={handleTuneIn}
              className="mt-1 px-3 py-1.5 rounded-[3px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[10px] flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(56,189,248,0.35)] transition-all hover:scale-105"
            >
              <Play size={10} className="fill-current" />
              <span>TUNE IN LIVE (FULL VOLUME)</span>
            </button>
          </div>
        )}
      </div>

      {/* Dynamic Status Indicator Bar */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="truncate">{item.channel || 'Live Broadcast'}</span>
        {isCurrentActive ? (
          playerState === 'loading' ? (
            <span className="text-sky-400 font-bold animate-pulse">⟳ LOADING</span>
          ) : playerState === 'blocked-autoplay' ? (
            <button onClick={unmuteAndPlay} className="text-amber-400 font-bold animate-pulse cursor-pointer">🔊 TAP TO UNMUTE</button>
          ) : playerState === 'live' ? (
            <span className="text-emerald-400 font-bold">● ACTIVE STREAM</span>
          ) : playerState === 'offline' ? (
            <span className="text-amber-400 font-bold">○ OFFLINE</span>
          ) : (
            <span className="text-rose-400 font-bold">✕ STREAM ERROR</span>
          )
        ) : (
          <span className="text-slate-500 font-medium">○ STANDBY</span>
        )}
      </div>
    </div>
  );
};
