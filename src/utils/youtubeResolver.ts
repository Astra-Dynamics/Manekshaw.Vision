/**
 * YouTube Embed & RSS Resolver Architecture (Zero API Key)
 * 
 * Provides:
 * 1. UU Uploads Playlist generation: Converts UC... channel ID to UU... playlist ID
 * 2. Guaranteed fallback embed URLs using official YouTube nocookie player
 * 3. Client-side RSS feed auto-resolver for latest video dispatches
 */

const RSS_CACHE_KEY_PREFIX = 'manvis_yt_rss_cache_';
const RSS_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

interface CachedVideo {
  videoId: string;
  timestamp: number;
}

const memoryCache = new Map<string, CachedVideo>();

/**
 * Derives the uploads playlist ID from a channel ID.
 * Every YouTube channel ID starting with "UC" has an uploads playlist starting with "UU".
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
  mode?: 'video' | 'playlist' | 'live';
}): string {
  const { youtubeId, channelId, isLive, mode = 'video' } = params;
  const playlistId = params.uploadsPlaylistId || getUploadsPlaylistId(channelId);

  // 1. Explicit playlist mode OR fallback if no youtubeId
  if (mode === 'playlist' && playlistId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`;
  }

  // 2. Explicit live stream mode
  if (mode === 'live' && channelId) {
    return `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=0`;
  }

  // 3. Direct video ID
  if (youtubeId && youtubeId.trim() !== '') {
    return `https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`;
  }

  // 4. Fallback to uploads playlist if available
  if (playlistId) {
    return `https://www.youtube-nocookie.com/embed/videoseries?list=${playlistId}&rel=0&modestbranding=1`;
  }

  // 5. Fallback to live stream if live flag set
  if (isLive && channelId) {
    return `https://www.youtube-nocookie.com/embed/live_stream?channel=${channelId}&autoplay=0`;
  }

  return '';
}

/**
 * Fetches latest video ID from YouTube Channel RSS feed without an API key.
 * Uses public CORS proxies and caches results in sessionStorage and memory.
 */
export async function resolveLatestVideoFromRSS(channelId: string): Promise<string | null> {
  if (!channelId) return null;

  // Check memory cache
  const cached = memoryCache.get(channelId);
  const now = Date.now();
  if (cached && now - cached.timestamp < RSS_CACHE_TTL_MS) {
    return cached.videoId;
  }

  // Check sessionStorage
  try {
    const raw = sessionStorage.getItem(RSS_CACHE_KEY_PREFIX + channelId);
    if (raw) {
      const parsed: CachedVideo = JSON.parse(raw);
      if (parsed && parsed.videoId && now - parsed.timestamp < RSS_CACHE_TTL_MS) {
        memoryCache.set(channelId, parsed);
        return parsed.videoId;
      }
    }
  } catch (e) {
    // ignore sessionStorage errors
  }

  const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
  const proxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(rssUrl)}`,
    `https://corsproxy.io/?url=${encodeURIComponent(rssUrl)}`,
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rssUrl)}`
  ];

  for (const proxy of proxies) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4000);

      const res = await fetch(proxy, { signal: controller.signal });
      clearTimeout(timer);

      if (!res.ok) continue;
      const text = await res.text();
      const match = text.match(/<yt:videoId>([a-zA-Z0-9_-]{11})<\/yt:videoId>/);

      if (match && match[1]) {
        const videoId = match[1];
        const cacheEntry: CachedVideo = { videoId, timestamp: now };
        memoryCache.set(channelId, cacheEntry);
        try {
          sessionStorage.setItem(RSS_CACHE_KEY_PREFIX + channelId, JSON.stringify(cacheEntry));
        } catch (e) {}
        return videoId;
      }
    } catch (e) {
      // try next proxy
    }
  }

  return null;
}
