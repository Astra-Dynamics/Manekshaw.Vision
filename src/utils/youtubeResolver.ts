/**
 * YouTube Embed & Stream Resolver (Zero Error 153 / Zero CORS Proxies)
 * 
 * Provides:
 * 1. Safe YouTube nocookie embed URLs with strict-origin validation
 * 2. Uploads playlist (UU...) generation from channel IDs (UC...)
 * 3. Client-side caching of server-resolved active live streams (/api/streams)
 * 4. Automatic fallback to channel uploads playlists for offline channels
 */

const STREAMS_CACHE_KEY = 'manvis_streams_cache_v2';
const STREAMS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CachedStreamMap {
  [channelId: string]: {
    youtubeId: string;
    isLive: boolean;
    uploadsPlaylistId?: string;
  };
}

let memoryStreamMap: CachedStreamMap = {};
let lastFetchedTime = 0;

/**
 * Derives the uploads playlist ID from a channel ID.
 * YouTube channel ID "UC..." -> uploads playlist ID "UU...".
 */
export function getUploadsPlaylistId(channelId?: string): string | null {
  if (!channelId) return null;
  if (channelId.startsWith('UC')) {
    return 'UU' + channelId.slice(2);
  }
  return channelId;
}

/**
 * Builds a reliable, zero-API-key, non-deprecated YouTube embed URL.
 * Avoids the deprecated embed/live_stream?channel=UC... endpoint.
 */
export function getYouTubeEmbedUrl(params: {
  youtubeId?: string;
  channelId?: string;
  uploadsPlaylistId?: string;
  isLive?: boolean;
  mode?: 'video' | 'playlist' | 'auto';
}): string {
  const { youtubeId, channelId, mode = 'auto' } = params;
  const playlistId = params.uploadsPlaylistId || getUploadsPlaylistId(channelId);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.manvis.tech';

  // 1. Explicit playlist mode
  if (mode === 'playlist' && playlistId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`;
  }

  // 2. Direct 11-character video ID (validated)
  if (youtubeId && youtubeId.length === 11 && !youtubeId.includes('videoseries')) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}&mute=1&playsinline=1`;
  }

  // 3. Fallback to uploads playlist
  if (playlistId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`;
  }

  return '';
}

/**
 * Fetches server-resolved live streams from /api/streams with local caching.
 * Zero browser-side CORS proxies used.
 */
export async function getLiveStreamsMap(): Promise<CachedStreamMap> {
  const now = Date.now();
  if (now - lastFetchedTime < STREAMS_CACHE_TTL_MS && Object.keys(memoryStreamMap).length > 0) {
    return memoryStreamMap;
  }

  // Check localStorage
  try {
    const raw = localStorage.getItem(STREAMS_CACHE_KEY);
    if (raw) {
      const { timestamp, data } = JSON.parse(raw);
      if (now - timestamp < STREAMS_CACHE_TTL_MS && data) {
        memoryStreamMap = data;
        lastFetchedTime = timestamp;
        return data;
      }
    }
  } catch (e) {}

  try {
    const res = await fetch('/api/streams');
    if (res.ok) {
      const json = await res.json();
      if (json.streams && Array.isArray(json.streams)) {
        const streamMap: CachedStreamMap = {};
        for (const s of json.streams) {
          if (s.channelId) {
            streamMap[s.channelId] = {
              youtubeId: s.youtubeId,
              isLive: Boolean(s.isLive),
              uploadsPlaylistId: s.uploadsPlaylistId
            };
          }
        }
        memoryStreamMap = streamMap;
        lastFetchedTime = now;
        try {
          localStorage.setItem(STREAMS_CACHE_KEY, JSON.stringify({ timestamp: now, data: streamMap }));
        } catch (e) {}
        return streamMap;
      }
    }
  } catch (err) {
    // Graceful offline fallback
  }

  return memoryStreamMap;
}

/**
 * Backward compatibility helper for legacy callers.
 */
export async function resolveLatestVideoFromRSS(channelId: string): Promise<string | null> {
  if (!channelId) return null;
  const streamMap = await getLiveStreamsMap();
  const entry = streamMap[channelId];
  if (entry && entry.youtubeId && entry.youtubeId.length === 11) {
    return entry.youtubeId;
  }
  return null;
}
