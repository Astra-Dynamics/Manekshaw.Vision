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
const memoryCache = new Map<string, CacheRecord>();
const inflightRequests = new Map<string, Promise<YTLiveResponsePayload>>();
// Track last known active video ID per channel for 1-unit videos.list verification
const lastKnownVideoIds = new Map<string, string>();

const LIVE_CACHE_TTL_MS = 25 * 60 * 1000;   // 25 minutes
const OFFLINE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Decodes HTML entities in titles (e.g. &#39; -> ', &amp; -> &)
 */
function decodeHtmlEntities(str: string): string {
  if (!str) return '';
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&apos;/g, "'")
    .replace(/&#([0-9]{1,5});/gi, (_, num) => {
      const code = parseInt(num, 10);
      return !isNaN(code) ? String.fromCharCode(code) : _;
    });
}

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

  // Validate channelId format
  if (!channelId || !channelId.startsWith('UC') || channelId.length !== 24) {
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=120');
    return res.status(400).json({
      success: false,
      live: false,
      status: 'error',
      channelId: channelId || '',
      fallbackEmbedUrl: '',
      error: 'Invalid channelId parameter. Must be a valid 24-character YouTube channel ID starting with "UC".',
      timestamp: new Date().toISOString()
    });
  }

  const fallbackEmbedUrl = `https://www.youtube.com/embed/live_stream?channel=${encodeURIComponent(channelId)}`;

  // 1. In-memory warm instance cache check
  const cached = memoryCache.get(channelId);
  const now = Date.now();
  if (cached && now < cached.expiresAt) {
    if (cached.data.live) {
      res.setHeader('Cache-Control', 'public, s-maxage=1500, stale-while-revalidate=300');
    } else {
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=120');
    }
    return res.status(200).json({
      ...cached.data,
      cached: true
    });
  }

  // 2. Request deduplication
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
          message: 'YOUTUBE_API_KEY not configured. Using live_stream embed fallback.',
          timestamp: new Date().toISOString()
        };
        memoryCache.set(channelId, { data: payload, expiresAt: Date.now() + OFFLINE_CACHE_TTL_MS });
        return payload;
      }

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 7000);

        // QUOTA OPTIMIZATION: Check last known active video ID first (1 unit)
        const lastKnownId = lastKnownVideoIds.get(channelId);
        if (lastKnownId) {
          try {
            const verifyUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,liveStreamingDetails&id=${encodeURIComponent(lastKnownId)}&key=${encodeURIComponent(apiKey)}`;
            const verifyRes = await fetch(verifyUrl, { signal: controller.signal });
            if (verifyRes.ok) {
              const verifyData = await verifyRes.json();
              const vItem = verifyData.items?.[0];
              const isStillLive = vItem && (
                vItem.snippet?.liveBroadcastContent === 'live' ||
                (vItem.liveStreamingDetails?.actualStartTime && !vItem.liveStreamingDetails?.actualEndTime)
              );

              if (isStillLive) {
                clearTimeout(timeoutId);
                const title = decodeHtmlEntities(vItem.snippet?.title || '');
                // Full volume by default: NO mute=1
                const embedUrl = `https://www.youtube.com/embed/${lastKnownId}?autoplay=1&playsinline=1&enablejsapi=1`;

                const payload: YTLiveResponsePayload = {
                  success: true,
                  live: true,
                  status: 'live',
                  channelId,
                  videoId: lastKnownId,
                  title,
                  embedUrl,
                  fallbackEmbedUrl,
                  timestamp: new Date().toISOString()
                };
                memoryCache.set(channelId, { data: payload, expiresAt: Date.now() + LIVE_CACHE_TTL_MS });
                return payload;
              }
            }
          } catch (vErr) {
            // Proceed to search.list
          }
        }

        // Search.list (100 units) - executed only when no active stream ID is cached or old stream ended
        const searchEndpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${encodeURIComponent(channelId)}&eventType=live&type=video&maxResults=1&key=${encodeURIComponent(apiKey)}`;
        const ytRes = await fetch(searchEndpoint, {
          signal: controller.signal,
          headers: { 'Accept': 'application/json' }
        });
        clearTimeout(timeoutId);

        // Handle 403 quotaExceeded by falling back to live_stream embed instead of erroring
        if (!ytRes.ok) {
          const errData = await ytRes.json().catch(() => ({}));
          const isQuota = ytRes.status === 403 ||
            errData?.error?.errors?.[0]?.reason === 'quotaExceeded' ||
            String(errData?.error?.message).includes('quota');

          const errMsg = isQuota
            ? 'YouTube API daily quota exceeded. Falling back to live_stream channel embed.'
            : (errData?.error?.message || `YouTube API responded with status ${ytRes.status}`);

          console.warn(`[API/yt-live] YouTube API warning for ${channelId}:`, errMsg);

          const payload: YTLiveResponsePayload = {
            success: isQuota,
            live: false,
            status: 'fallback',
            channelId,
            embedUrl: fallbackEmbedUrl,
            fallbackEmbedUrl,
            error: errMsg,
            timestamp: new Date().toISOString()
          };
          memoryCache.set(channelId, { data: payload, expiresAt: Date.now() + OFFLINE_CACHE_TTL_MS });
          return payload;
        }

        const data = await ytRes.json();
        const liveItem = data.items && data.items.length > 0 ? data.items[0] : null;

        if (liveItem && liveItem.id && liveItem.id.videoId) {
          const videoId = liveItem.id.videoId;
          const title = decodeHtmlEntities(liveItem.snippet?.title || '');
          // Full volume by default: NO mute=1
          const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&enablejsapi=1`;

          // Track for future 1-unit verifications
          lastKnownVideoIds.set(channelId, videoId);

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

          memoryCache.set(channelId, { data: payload, expiresAt: Date.now() + LIVE_CACHE_TTL_MS });
          return payload;
        }

        // Channel offline
        lastKnownVideoIds.delete(channelId);
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
    // Edge CDN caching: 1500s on live, 300s on offline
    if (result.live) {
      res.setHeader('Cache-Control', 'public, s-maxage=1500, stale-while-revalidate=300');
    } else {
      res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=120');
    }

    return res.status(200).json({
      ...result,
      cached: false
    });
  } finally {
    inflightRequests.delete(channelId);
  }
}
