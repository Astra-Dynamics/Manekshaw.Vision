export interface VercelRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  query: Record<string, string | string[] | undefined>;
  body?: any;
}

export interface VercelResponse {
  status(code: number): VercelResponse;
  json(body: any): VercelResponse;
  setHeader(name: string, value: string | number | readonly string[]): VercelResponse;
  end(chunk?: any): VercelResponse;
}

export interface YTLiveResponsePayload {
  success: boolean;
  live: boolean;
  status: 'live' | 'offline' | 'fallback' | 'error';
  channelId: string;
  videoId?: string;
  title?: string;
  embedUrl?: string;
  fallbackEmbedUrl: string;
  cached?: boolean;
  message?: string;
  error?: string;
  timestamp: string;
}

interface CacheRecord {
  data: YTLiveResponsePayload;
  expiresAt: number;
}

// In-memory cache across serverless warm invocations
// Successful lookups cached 25 min; offline / errors cached 5 min
const memoryCache = new Map<string, CacheRecord>();
const inflightRequests = new Map<string, Promise<YTLiveResponsePayload>>();

const LIVE_CACHE_TTL_MS = 25 * 60 * 1000;   // 25 minutes
const OFFLINE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Security Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawChannelId = req.query?.channelId;
  const channelId = Array.isArray(rawChannelId) ? rawChannelId[0] : (rawChannelId || '').trim();

  // Validate format
  if (!channelId || !channelId.startsWith('UC') || channelId.length < 15) {
    return res.status(400).json({
      success: false,
      live: false,
      status: 'error',
      channelId: channelId || '',
      fallbackEmbedUrl: '',
      error: 'Invalid channelId parameter. Must be a valid YouTube channel ID starting with "UC" (e.g. UCZFMm1mMw0F81Z37aaEzTUA).',
      timestamp: new Date().toISOString()
    });
  }

  const fallbackEmbedUrl = `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(channelId)}`;

  // 1. Check in-memory cache
  const cached = memoryCache.get(channelId);
  const now = Date.now();
  if (cached && now < cached.expiresAt) {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      ...cached.data,
      cached: true
    });
  }

  // 2. Request deduplication (prevent concurrent spikes for the same channel ID)
  let requestPromise = inflightRequests.get(channelId);
  if (!requestPromise) {
    requestPromise = (async (): Promise<YTLiveResponsePayload> => {
      const apiKey = process.env.YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY;

      // Fallback path: No API key configured
      if (!apiKey) {
        const payload: YTLiveResponsePayload = {
          success: true,
          live: false,
          status: 'fallback',
          channelId,
          embedUrl: fallbackEmbedUrl,
          fallbackEmbedUrl,
          message: 'YOUTUBE_API_KEY is not configured in environment. Using live_stream embed fallback.',
          timestamp: new Date().toISOString()
        };
        memoryCache.set(channelId, { data: payload, expiresAt: Date.now() + OFFLINE_CACHE_TTL_MS });
        return payload;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        const ytEndpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&eventType=live&type=video&maxResults=1&key=${encodeURIComponent(apiKey)}`;
        const ytRes = await fetch(ytEndpoint, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json'
          }
        });
        clearTimeout(timeoutId);

        if (!ytRes.ok) {
          const errData = await ytRes.json().catch(() => ({}));
          const errMsg = errData?.error?.message || `YouTube API responded with status ${ytRes.status}`;
          console.warn(`[API/yt-live] YouTube API warning for ${channelId}:`, errMsg);

          const payload: YTLiveResponsePayload = {
            success: false,
            live: false,
            status: 'fallback',
            channelId,
            embedUrl: fallbackEmbedUrl,
            fallbackEmbedUrl,
            error: errMsg,
            timestamp: new Date().toISOString()
          };
          // Cache error for 5 minutes to avoid quota burning
          memoryCache.set(channelId, { data: payload, expiresAt: Date.now() + OFFLINE_CACHE_TTL_MS });
          return payload;
        }

        const data = await ytRes.json();
        const liveItem = data.items && data.items.length > 0 ? data.items[0] : null;

        if (liveItem && liveItem.id && liveItem.id.videoId) {
          const videoId = liveItem.id.videoId;
          const title = liveItem.snippet?.title || '';
          const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&enablejsapi=1`;

          const payload: YTLiveResponsePayload = {
            success: true,
            live: true,
            status: 'live',
            channelId,
            videoId,
            title,
            embedUrl,
            fallbackEmbedUrl,
            timestamp: new Date().toISOString()
          };

          // Cache verified live video ID for 25 minutes
          memoryCache.set(channelId, { data: payload, expiresAt: Date.now() + LIVE_CACHE_TTL_MS });
          return payload;
        }

        // Channel is currently offline
        const payload: YTLiveResponsePayload = {
          success: true,
          live: false,
          status: 'offline',
          channelId,
          embedUrl: fallbackEmbedUrl,
          fallbackEmbedUrl,
          message: 'No active live broadcast found for channel.',
          timestamp: new Date().toISOString()
        };

        // Cache offline status for 5 minutes
        memoryCache.set(channelId, { data: payload, expiresAt: Date.now() + OFFLINE_CACHE_TTL_MS });
        return payload;
      } catch (fetchErr: any) {
        console.error(`[API/yt-live] Exception resolving ${channelId}:`, fetchErr?.message || fetchErr);
        const payload: YTLiveResponsePayload = {
          success: false,
          live: false,
          status: 'fallback',
          channelId,
          embedUrl: fallbackEmbedUrl,
          fallbackEmbedUrl,
          error: fetchErr?.message || 'Failed to connect to YouTube Data API',
          timestamp: new Date().toISOString()
        };
        memoryCache.set(channelId, { data: payload, expiresAt: Date.now() + OFFLINE_CACHE_TTL_MS });
        return payload;
      }
    })();

    inflightRequests.set(channelId, requestPromise);
  }

  try {
    const result = await requestPromise;
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({
      ...result,
      cached: false
    });
  } finally {
    inflightRequests.delete(channelId);
  }
}
