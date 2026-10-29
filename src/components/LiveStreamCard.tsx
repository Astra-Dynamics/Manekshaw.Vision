import React, { useState, useEffect, useRef } from 'react';
import { Play, ExternalLink, Radio, AlertCircle, Loader2 } from 'lucide-react';
import { fetchLiveStream, getYouTubeEmbedUrl, YTLiveClientResult } from '../utils/youtubeResolver';

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
  const [loading, setLoading] = useState<boolean>(true);
  const [streamData, setStreamData] = useState<YTLiveClientResult | null>(null);
  const [streamState, setStreamState] = useState<'loading' | 'live' | 'offline' | 'fallback' | 'error'>('loading');
  const timerRef = useRef<any>(null);

  const channelId = item.channelId;
  const externalWatchUrl = item.externalUrl || (channelId ? `https://www.youtube.com/channel/${channelId}/live` : 'https://www.youtube.com');

  const resolveStream = async (showLoading = true) => {
    if (showLoading) setLoading(true);

    // If channelId is present and valid
    if (channelId && channelId.startsWith('UC')) {
      try {
        const res = await fetchLiveStream(channelId);
        setStreamData(res);

        if (res.live && res.videoId) {
          setStreamState('live');
        } else if (res.status === 'offline') {
          setStreamState('offline');
        } else if (res.status === 'fallback') {
          // If fallback embed is provided, we can either embed fallback or show offline card
          setStreamState('fallback');
        } else {
          setStreamState('offline');
        }
      } catch (err) {
        setStreamState('error');
      } finally {
        setLoading(false);
      }
    } else if (item.youtubeId && item.youtubeId.length === 11) {
      // Fallback to static ID if no channelId exists
      setStreamState('live');
      setLoading(false);
    } else {
      setStreamState('offline');
      setLoading(false);
    }
  };

  useEffect(() => {
    resolveStream(true);

    // Poll strictly every 10 minutes (respects YouTube Data API quota ceiling)
    const intervalMs = 10 * 60 * 1000;
    timerRef.current = setInterval(() => {
      resolveStream(false);
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [channelId, item.youtubeId]);

  // Compute active embed URL
  let activeEmbedUrl = '';
  if (streamData?.embedUrl) {
    activeEmbedUrl = streamData.embedUrl;
  } else if (streamData?.videoId) {
    activeEmbedUrl = getYouTubeEmbedUrl({ youtubeId: streamData.videoId });
  } else if (streamState === 'fallback' && streamData?.fallbackEmbedUrl) {
    activeEmbedUrl = streamData.fallbackEmbedUrl;
  } else if (item.youtubeId) {
    activeEmbedUrl = getYouTubeEmbedUrl({
      youtubeId: item.youtubeId,
      channelId: item.channelId,
      uploadsPlaylistId: item.uploadsPlaylistId,
      isLive: item.isLive
    });
  }

  return (
    <div className={`flex-1 flex flex-col ${className}`}>
      {/* Video Container Frame */}
      <div
        className="relative w-full flex-1 overflow-hidden rounded-[3px] shadow-inner mb-2 min-h-[140px]"
        style={{
          background: '#05080F',
          border: '1px solid rgba(56, 189, 248, 0.25)'
        }}
      >
        {loading ? (
          /* Sleek Tactical Radar / Scan Line Loading State */
          <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-4 text-center bg-black/80 font-mono">
            <Loader2 size={18} className="text-sky-400 animate-spin mb-2" />
            <div className="text-[10px] text-sky-400 uppercase tracking-wider font-bold">
              [RESOLVING SATELLITE FEED]
            </div>
            <div className="text-[9px] text-slate-500 mt-1 truncate max-w-[90%]">
              {item.channel || item.title}
            </div>
          </div>
        ) : streamState === 'offline' ? (
          /* Clean "Stream Offline / Watch on YouTube" Card */
          <div
            className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-3 text-center"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.7) 0%, rgba(5, 8, 15, 0.98) 100%)'
            }}
          >
            <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-2">
              <Radio size={14} className="opacity-80" />
            </div>
            <div className="text-[11px] font-bold text-slate-200 mb-0.5">Stream Currently Offline</div>
            <p className="text-[9.5px] text-slate-400 mb-2.5 max-w-[85%] font-sans leading-tight">
              Broadcaster is not transmitting a live feed right now. Watch latest coverage on YouTube.
            </p>
            <a
              href={externalWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[3px] bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-mono text-[9.5px] font-bold transition-colors cursor-pointer shadow-[0_0_10px_rgba(56,189,248,0.2)]"
            >
              <Play size={9} className="fill-current" />
              <span>Watch on YouTube</span>
              <ExternalLink size={9} />
            </a>
          </div>
        ) : streamState === 'error' ? (
          /* Stream Error Card */
          <div className="w-full h-full min-h-[140px] flex flex-col items-center justify-center p-3 text-center bg-black/80 font-mono">
            <AlertCircle size={16} className="text-rose-400 mb-1.5" />
            <div className="text-[10px] text-rose-400 font-bold mb-1">UNABLE TO REACH FEED</div>
            <a
              href={externalWatchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[9.5px] text-sky-400 hover:underline mt-1"
            >
              <span>Open Directly on YouTube</span>
              <ExternalLink size={9} />
            </a>
          </div>
        ) : (
          /* Active Live Stream Player */
          <iframe
            src={activeEmbedUrl}
            title={item.title || item.channel || 'Live News Broadcast'}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        )}
      </div>

      {/* Dynamic Status Indicator Bar */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
        <span className="truncate">{item.channel || 'Live Broadcast'}</span>
        {loading ? (
          <span className="text-sky-400 font-bold animate-pulse">⟳ RESOLVING</span>
        ) : streamState === 'live' ? (
          <span className="text-emerald-400 font-bold">● ACTIVE STREAM</span>
        ) : streamState === 'fallback' ? (
          <span className="text-sky-400 font-bold">● LIVE FEED</span>
        ) : streamState === 'offline' ? (
          <span className="text-amber-400 font-bold">○ OFFLINE</span>
        ) : (
          <span className="text-rose-400 font-bold">✕ STREAM ERROR</span>
        )}
      </div>
    </div>
  );
};
