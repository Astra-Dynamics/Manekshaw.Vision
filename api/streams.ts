import { createHash } from 'crypto';
import { VIDEO_CATALOGUE, VideoCatalogueItem, VideoRegionGroup } from '../src/data/videoCatalogue';

export type { VideoCatalogueItem, VideoRegionGroup };

// Standard Vercel Serverless Function request & response interfaces
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

export interface VideoStreamItem extends VideoCatalogueItem {
  checkedAt?: string;
}

export interface StreamsApiResponse {
  status: 'ok';
  success: boolean;
  count: number;
  timestamp: string;
  streams: VideoStreamItem[];
}

function computeETag(payload: unknown): string {
  const content = JSON.stringify(payload);
  const hash = createHash('sha1').update(content).digest('hex').slice(0, 16);
  return `W/"${hash}"`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Edge Caching Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, If-None-Match');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fahbbsdgurtwmfjhtxkh.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  let dbStreams: any[] = [];

  if (supabaseKey) {
    try {
      const resp = await fetch(`${supabaseUrl}/rest/v1/youtube_streams?order=checked_at.desc`, {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Accept: 'application/json'
        }
      });
      if (resp.ok) {
        const raw = await resp.json();
        if (Array.isArray(raw)) {
          dbStreams = raw;
        }
      }
    } catch (e) {
      console.warn('[API/streams] Supabase streams fetch error:', e);
    }
  }

  // Build resolved streams list starting with baseline VIDEO_CATALOGUE
  let finalStreams: VideoStreamItem[] = [...VIDEO_CATALOGUE];

  if (dbStreams.length > 0) {
    // Map database streams by channel_id and id
    const liveMap = new Map<string, any>();
    for (const s of dbStreams) {
      if (s.channel_id) liveMap.set(s.channel_id, s);
      if (s.id) liveMap.set(s.id, s);
    }

    // Update verified channels from database
    finalStreams = VIDEO_CATALOGUE.map((item) => {
      const live = liveMap.get(item.channelId) || liveMap.get(item.id);
      if (!live) return item;
      return {
        ...item,
        isLive: Boolean(live.is_live),
        youtubeId: live.youtube_id || live.video_id || item.youtubeId,
        streamUrl: live.external_url || item.streamUrl,
        checkedAt: live.checked_at
      };
    });

    // Also include any streams present in DB but not in static catalogue
    const knownChannelIds = new Set(VIDEO_CATALOGUE.map((i) => i.channelId));
    for (const s of dbStreams) {
      if (s.channel_id && !knownChannelIds.has(s.channel_id)) {
        finalStreams.push({
          id: s.id,
          title: s.title,
          channel: s.channel || s.channel_name || s.title,
          channelId: s.channel_id,
          uploadsPlaylistId: s.uploads_playlist_id || `UU${s.channel_id.slice(2)}`,
          category: (s.category as any) || '24/7 LIVE NEWS',
          region: (s.region as any) || 'Global Wire',
          regionGroup: (s.regionGroup as any) || 'ALL',
          countryCode: s.country_code || 'GLOBAL',
          isLive: Boolean(s.is_live),
          tags: Array.isArray(s.tags) ? s.tags : ['Defense', 'News'],
          youtubeId: s.youtube_id || s.video_id || '',
          externalUrl: s.external_url || `https://www.youtube.com/channel/${s.channel_id}`,
          description: s.description || s.title,
          monogram: (s.channel || s.title).slice(0, 3).toUpperCase(),
          checkedAt: s.checked_at
          // DB camelCase mappings: channelId: s.channel_id, uploadsPlaylistId: s.uploads_playlist_id, isLive: s.is_live, youtubeId: s.youtube_id, externalUrl: s.external_url, checkedAt: s.checked_at
        });
      }
    }
  }

  // Deterministic ETag generation
  const etag = computeETag(
    finalStreams.map((s) => ({
      id: s.id,
      ch: s.channelId,
      live: s.isLive,
      yt: s.youtubeId
    }))
  );

  res.setHeader('ETag', etag);

  const ifNoneMatch = req.headers['if-none-match'];
  if (ifNoneMatch && (ifNoneMatch === etag || ifNoneMatch.includes(etag))) {
    return res.status(304).end();
  }

  const responsePayload: StreamsApiResponse = {
    status: 'ok',
    success: true,
    count: finalStreams.length,
    timestamp: new Date().toISOString(),
    streams: finalStreams
  };

  return res.status(200).json(responsePayload);
}
