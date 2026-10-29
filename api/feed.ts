import type { VercelRequest, VercelResponse } from '@vercel/node';

// Type definition aligned 1:1 with frontend IntelNewsItem
export interface IntelNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  category: 'military' | 'geopolitical' | 'cyber' | 'natural' | 'economic';
  severity: 'critical' | 'high' | 'medium' | 'low';
  coordinates?: [number, number];
  relatedHotspot?: string;
  region?: string;
  countryCode?: string;
  link?: string;
}

function formatRelativeTime(isoString: string): string {
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (isNaN(diffSec) || diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS & Edge Caching Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://fahbbsdgurtwmfjhtxkh.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';

  const { timeRange = '7d', region = 'all', category } = req.query;

  // Calculate cutoff timestamp based on timeRange
  const now = new Date();
  const timeLimits: Record<string, number> = {
    '1h': 1 * 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
  };
  const durationMs = timeLimits[String(timeRange).toLowerCase()] || timeLimits['7d'];
  const cutoffIso = new Date(now.getTime() - durationMs).toISOString();

  let articles: IntelNewsItem[] = [];
  let clusters: any[] = [];
  let hotspots: any[] = [];

  if (supabaseKey) {
    try {
      // Build Supabase REST query
      let queryUrl = `${supabaseUrl}/rest/v1/articles?published_at=gte.${cutoffIso}&order=published_at.desc&limit=100`;
      if (category) {
        queryUrl += `&category=eq.${encodeURIComponent(String(category))}`;
      }

      const headers = {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: 'application/json'
      };

      const [artRes, clsRes, hsRes] = await Promise.allSettled([
        fetch(queryUrl, { headers }),
        fetch(`${supabaseUrl}/rest/v1/clusters?order=last_updated.desc&limit=25`, { headers }),
        fetch(`${supabaseUrl}/rest/v1/hotspot_scores?order=updated_at.desc`, { headers })
      ]);

      if (artRes.status === 'fulfilled' && artRes.value.ok) {
        const rawArticles = await artRes.value.json();
        articles = (rawArticles || []).map((a: any): IntelNewsItem => ({
          id: a.id,
          title: a.title,
          summary: a.summary || a.title,
          source: a.source,
          timeAgo: formatRelativeTime(a.published_at),
          category: a.category,
          severity: a.severity,
          coordinates: Array.isArray(a.coordinates) ? [a.coordinates[0], a.coordinates[1]] : [86.35, 25.06],
          relatedHotspot: a.related_hotspot,
          countryCode: a.country_code,
          link: a.link
        }));
      }

      if (clsRes.status === 'fulfilled' && clsRes.value.ok) {
        clusters = await clsRes.value.json();
      }

      if (hsRes.status === 'fulfilled' && hsRes.value.ok) {
        hotspots = await hsRes.value.json();
      }
    } catch (err) {
      console.warn('[API/feed] Supabase fetch fallback triggered:', err);
    }
  }

  // Response with deterministic ETag
  const responsePayload = {
    success: true,
    count: articles.length,
    timeRange: String(timeRange),
    timestamp: new Date().toISOString(),
    dispatches: articles,
    clusters,
    hotspots
  };

  const etag = `W/"${articles.length}-${clusters.length}-${now.getHours()}"`;
  res.setHeader('ETag', etag);

  if (req.headers['if-none-match'] === etag) {
    return res.status(304).end();
  }

  return res.status(200).json(responsePayload);
}
