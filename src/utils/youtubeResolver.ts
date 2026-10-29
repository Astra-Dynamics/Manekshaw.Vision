/**
 * YouTube Embed & Stream Resolver (Zero Error 153 / Dynamic Live Stream Recovery)
 * 
 * Provides:
 * 1. Safe YouTube nocookie embed URLs with strict-origin validation
 * 2. Uploads playlist (UU...) generation from channel IDs (UC...)
 * 3. Client-side caching of server-resolved active live streams (/api/streams & /api/yt-live)
 * 4. Automatic fallback to channel live_stream embed and uploads playlists
 * 5. Dev-only oEmbed validation check (200=embeddable, 401=disabled by owner, 404=invalid/removed)
 */

export interface YTLiveClientResult {
  success: boolean;
  live: boolean;
  status: 'live' | 'offline' | 'fallback' | 'error';
  channelId: string;
  videoId?: string;
  title?: string;
  embedUrl: string;
  fallbackEmbedUrl: string;
  cached?: boolean;
  message?: string;
  error?: string;
}

const STREAMS_CACHE_KEY = 'manvis_streams_cache_v2';
const STREAMS_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

const CLIENT_YT_LIVE_CACHE_KEY = 'manvis_yt_live_';
const CLIENT_YT_LIVE_TTL_MS = 10 * 60 * 1000; // 10 minutes client cache

interface CachedStreamMap {
  [channelId: string]: {
    youtubeId: string;
    isLive: boolean;
    uploadsPlaylistId?: string;
  };
}

let memoryStreamMap: CachedStreamMap = {};
let lastFetchedTime = 0;

const clientMemoryCache = new Map<string, { data: YTLiveClientResult; expiresAt: number }>();
const clientInflightRequests = new Map<string, Promise<YTLiveClientResult>>();

/**
 * Dev-only debug check for YouTube embed permissions via oEmbed API.
 * 200 = embeddable
 * 401 = embedding disabled by owner
 * 404 = invalid or removed
 */
export async function checkVideoEmbeddability(videoId: string): Promise<number | null> {
  if (!import.meta.env.DEV || !videoId || videoId.length !== 11) {
    return null;
  }

  try {
    const oembedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    const res = await fetch(oembedUrl);
    if (res.status === 200) {
      console.log(`[YouTube oEmbed] Video ${videoId} is embeddable (Status 200 OK)`);
    } else if (res.status === 401) {
      console.warn(`[YouTube oEmbed] Video ${videoId} embedding disabled by owner (Status 401 Unauthorized)`);
    } else if (res.status === 404) {
      console.error(`[YouTube oEmbed] Video ${videoId} is invalid or removed (Status 404 Not Found)`);
    } else {
      console.warn(`[YouTube oEmbed] Video ${videoId} returned status ${res.status}`);
    }
    return res.status;
  } catch (err) {
    console.warn(`[YouTube oEmbed] Dev check failed for ${videoId}:`, err);
    return null;
  }
}

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
 * Builds a reliable, zero-API-key YouTube embed URL.
 */
export function getYouTubeEmbedUrl(params: {
  youtubeId?: string;
  channelId?: string;
  uploadsPlaylistId?: string;
  isLive?: boolean;
  mode?: 'video' | 'playlist' | 'live_stream' | 'auto';
}): string {
  const { youtubeId, channelId, mode = 'auto' } = params;
  const playlistId = params.uploadsPlaylistId || getUploadsPlaylistId(channelId);
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://www.manvis.tech';

  // 1. Explicit live_stream channel embed
  if (mode === 'live_stream' && channelId) {
    return `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(channelId)}`;
  }

  // 2. Explicit playlist mode
  if (mode === 'playlist' && playlistId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`;
  }

  // 3. Direct 11-character video ID (validated) - Full volume by default (no mute parameter)
  if (youtubeId && youtubeId.length === 11 && !youtubeId.includes('videoseries')) {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}&playsinline=1`;
  }

  // 4. Fallback to live_stream channel endpoint if channelId is available
  if (channelId && channelId.startsWith('UC')) {
    return `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(channelId)}`;
  }

  // 5. Fallback to uploads playlist
  if (playlistId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1&enablejsapi=1&origin=${encodeURIComponent(origin)}`;
  }

  return '';
}

/**
 * Dynamic live stream lookup via /api/yt-live with client-side deduplication and 10-minute caching.
 */
export async function fetchLiveStream(channelId: string): Promise<YTLiveClientResult> {
  if (!channelId || !channelId.startsWith('UC')) {
    return {
      success: false,
      live: false,
      status: 'error',
      channelId: channelId || '',
      embedUrl: '',
      fallbackEmbedUrl: '',
      error: 'Invalid channel ID'
    };
  }

  const now = Date.now();
  const fallbackEmbedUrl = `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(channelId)}`;

  // 1. In-memory client cache
  const mem = clientMemoryCache.get(channelId);
  if (mem && now < mem.expiresAt) {
    return { ...mem.data, cached: true };
  }

  // 2. LocalStorage client cache
  try {
    const raw = localStorage.getItem(`${CLIENT_YT_LIVE_CACHE_KEY}${channelId}`);
    if (raw) {
      const { timestamp, data } = JSON.parse(raw);
      if (now - timestamp < CLIENT_YT_LIVE_TTL_MS && data) {
        clientMemoryCache.set(channelId, { data, expiresAt: timestamp + CLIENT_YT_LIVE_TTL_MS });
        return { ...data, cached: true };
      }
    }
  } catch (e) {}

  // 3. In-flight request deduplication
  let inFlight = clientInflightRequests.get(channelId);
  if (!inFlight) {
    inFlight = (async (): Promise<YTLiveClientResult> => {
      try {
        const res = await fetch(`/api/yt-live?channelId=${encodeURIComponent(channelId)}`);
        if (res.ok) {
          const json: YTLiveClientResult = await res.json();
          clientMemoryCache.set(channelId, { data: json, expiresAt: now + CLIENT_YT_LIVE_TTL_MS });
          try {
            localStorage.setItem(`${CLIENT_YT_LIVE_CACHE_KEY}${channelId}`, JSON.stringify({
              timestamp: now,
              data: json
            }));
          } catch (e) {}

          // Run dev-only oEmbed check
          if (json.videoId) {
            checkVideoEmbeddability(json.videoId);
          }

          return json;
        } else {
          const errData = await res.json().catch(() => ({}));
          const fallback: YTLiveClientResult = {
            success: false,
            live: false,
            status: 'fallback',
            channelId,
            embedUrl: fallbackEmbedUrl,
            fallbackEmbedUrl,
            error: errData.error || `HTTP ${res.status}`
          };
          clientMemoryCache.set(channelId, { data: fallback, expiresAt: now + 5 * 60 * 1000 });
          return fallback;
        }
      } catch (err: any) {
        const fallback: YTLiveClientResult = {
          success: false,
          live: false,
          status: 'fallback',
          channelId,
          embedUrl: fallbackEmbedUrl,
          fallbackEmbedUrl,
          error: err?.message || 'Network error'
        };
        clientMemoryCache.set(channelId, { data: fallback, expiresAt: now + 5 * 60 * 1000 });
        return fallback;
      }
    })();

    clientInflightRequests.set(channelId, inFlight);
  }

  try {
    return await inFlight;
  } finally {
    clientInflightRequests.delete(channelId);
  }
}

/**
 * Fetches server-resolved live streams from /api/streams with local caching.
 */
export async function getLiveStreamsMap(): Promise<CachedStreamMap> {
  const now = Date.now();
  if (now - lastFetchedTime < STREAMS_CACHE_TTL_MS && Object.keys(memoryStreamMap).length > 0) {
    return memoryStreamMap;
  }

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
  const live = await fetchLiveStream(channelId);
  if (live.videoId && live.videoId.length === 11) {
    return live.videoId;
  }
  const streamMap = await getLiveStreamsMap();
  const entry = streamMap[channelId];
  if (entry && entry.youtubeId && entry.youtubeId.length === 11) {
    return entry.youtubeId;
  }
  return null;
}
