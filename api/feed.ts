import { createHash } from 'crypto';
import { INTEL_HOTSPOTS } from '../src/data/hotspots';
import { CONFLICT_ZONES } from '../src/data/conflicts';
import { BREAKING_INTEL_DISPATCHES } from '../src/services/newsService';

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

// 1:1 typed interface aligned with frontend IntelNewsItem
export interface IntelNewsItem {
  id: string;
  title: string;
  summary: string;
  source: string;
  timeAgo: string;
  publishedAt?: string;
  category: 'military' | 'geopolitical' | 'cyber' | 'natural' | 'economic';
  severity: 'critical' | 'high' | 'medium' | 'low';
  coordinates?: [number, number];
  relatedHotspot?: string;
  region?: string;
  countryCode?: string;
  link?: string;
}

// 1:1 typed interface aligned with frontend IntelHotspot
export interface IntelHotspot {
  id: string;
  name: string;
  coordinates: [number, number];
  escalationScore: number;
  escalationTrend: 'escalating' | 'stable' | 'de-escalating';
  escalationDelta?: string;
  region?: string;
  countryCode?: string;
  telemetry?: {
    airActivity?: string;
    navalDensity?: string;
    gnssJamming?: string;
    adizIncursions?: string;
    activeReports?: number;
    criticalAlerts?: number;
    sensorIntegrity?: string;
  };
  description: string;
  whyItMatters: string;
  agencies?: string[];
  recentIncidents?: string[];
}

// 1:1 typed interface aligned with frontend ConflictZoneFeature
export interface ConflictZoneFeature {
  id: string;
  name: string;
  center: [number, number];
  coords: [number, number][];
  intensity: 'critical' | 'high' | 'medium' | 'low';
  parties: string[];
  casualties?: string;
  description: string;
  updatedAt: string;
}

// 1:1 typed interface aligned with corroborated clusters
export interface CorroboratedIntelCluster {
  id: string;
  headline: string;
  summary: string;
  confidence: 'CONFIRMED' | 'REPORTED';
  category: 'military' | 'geopolitical' | 'cyber' | 'natural' | 'economic';
  severity: 'critical' | 'high' | 'medium' | 'low';
  coordinates: [number, number];
  relatedHotspot?: string;
  related_hotspot?: string;
  countryCode?: string;
  country_code?: string;
  sources: string[];
  first_seen: string;
  last_updated: string;
  article_count: number;
}

export interface FeedApiResponse {
  status: 'ok';
  success: boolean;
  count: number;
  timeRange: string;
  timestamp: string;
  articles: IntelNewsItem[];
  dispatches: IntelNewsItem[];
  clusters: CorroboratedIntelCluster[];
  hotspots: IntelHotspot[];
  hotspotScores: Record<string, { score: number; delta: number; count: number }>;
  conflictZones: ConflictZoneFeature[];
  conflicts: ConflictZoneFeature[];
}

function formatRelativeTime(isoString?: string): string {
  if (!isoString) return 'Recent';
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (isNaN(diffSec) || diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

function computeETag(payload: unknown): string {
  const content = JSON.stringify(payload);
  const hash = createHash('sha1').update(content).digest('hex').slice(0, 16);
  return `W/"${hash}"`;
}

const TIME_LIMITS: Record<string, number> = {
  '1h': 1 * 60 * 60 * 1000,
  '6h': 6 * 60 * 60 * 1000,
  '24h': 24 * 60 * 60 * 1000,
  '7d': 7 * 24 * 60 * 60 * 1000,
  '30d': 30 * 24 * 60 * 60 * 1000,
};

function filterInMemoryArticles(
  items: IntelNewsItem[],
  durationMs: number,
  cutoffDate: Date,
  category?: string,
  hotspot?: string,
  region?: string
): IntelNewsItem[] {
  return items.filter((item) => {
    // 1. Time range filter
    if (item.publishedAt) {
      const pubTime = new Date(item.publishedAt).getTime();
      if (!isNaN(pubTime) && pubTime < cutoffDate.getTime()) {
        return false;
      }
    } else if (item.timeAgo) {
      const match = item.timeAgo.match(/(\d+)\s*([mhd])/i);
      if (match) {
        const val = parseInt(match[1], 10);
        const unit = match[2].toLowerCase();
        let ageMs = 0;
        if (unit === 'm') ageMs = val * 60 * 1000;
        else if (unit === 'h') ageMs = val * 60 * 60 * 1000;
        else if (unit === 'd') ageMs = val * 24 * 60 * 60 * 1000;
        if (ageMs > durationMs) return false;
      }
    }

    // 2. Category filter
    if (category && item.category.toLowerCase() !== category) {
      return false;
    }

    // 3. Hotspot filter
    if (hotspot && item.relatedHotspot !== hotspot) {
      return false;
    }

    // 4. Region filter
    if (region && item.region && item.region.toLowerCase() !== region) {
      return false;
    }

    return true;
  });
}

function synthesizeClusters(items: IntelNewsItem[]): CorroboratedIntelCluster[] {
  const byHotspot = new Map<string, IntelNewsItem[]>();
  for (const item of items) {
    const key = item.relatedHotspot || 'global';
    if (!byHotspot.has(key)) byHotspot.set(key, []);
    byHotspot.get(key)!.push(item);
  }

  const clusters: CorroboratedIntelCluster[] = [];
  let clusterIdx = 1;
  for (const [hsKey, group] of byHotspot.entries()) {
    if (group.length === 0) continue;
    const lead = group[0];
    const uniqueSources = Array.from(new Set(group.map((g) => g.source).filter(Boolean)));
    const isCritical = group.some((g) => g.severity === 'critical');
    const isHigh = group.some((g) => g.severity === 'high');
    const severity = isCritical ? 'critical' : isHigh ? 'high' : 'medium';

    clusters.push({
      id: `cls_${hsKey}_${clusterIdx++}`,
      headline: lead.title,
      summary: lead.summary || lead.title,
      confidence: uniqueSources.length >= 2 ? 'CONFIRMED' : 'REPORTED',
      category: lead.category,
      severity,
      coordinates: lead.coordinates || [86.35, 25.06],
      relatedHotspot: hsKey !== 'global' ? hsKey : undefined,
      related_hotspot: hsKey !== 'global' ? hsKey : undefined,
      countryCode: lead.countryCode,
      country_code: lead.countryCode,
      sources: uniqueSources.slice(0, 5),
      first_seen: lead.publishedAt || new Date().toISOString(),
      last_updated: lead.publishedAt || new Date().toISOString(),
      article_count: group.length
    });
  }
  return clusters;
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

  // Query parameter parsing
  const timeRange = req.query.range || req.query.timeRange || '7d';
  const timeLimits = TIME_LIMITS;
  const durationMs = timeLimits[String(timeRange).toLowerCase()] || timeLimits['7d'];
  const queryRange = String(timeRange).toLowerCase();
  const cutoffDate = new Date(Date.now() - durationMs);
  const cutoffIso = cutoffDate.toISOString();

  const category = req.query.category ? String(req.query.category).toLowerCase() : undefined;
  const hotspot = req.query.hotspot ? String(req.query.hotspot) : undefined;
  const region = req.query.region && req.query.region !== 'all' ? String(req.query.region).toLowerCase() : undefined;

  let articles: IntelNewsItem[] = [];
  let clusters: CorroboratedIntelCluster[] = [];
  let hotspotRows: any[] = [];

  let fetchedFromSupabase = false;

  if (supabaseKey) {
    try {
      let articlesUrl = `${supabaseUrl}/rest/v1/articles?published_at=gte.${cutoffIso}&order=published_at.desc&limit=250`;
      if (category) {
        articlesUrl += `&category=eq.${encodeURIComponent(String(category))}`;
      }
      if (hotspot) {
        articlesUrl += `&related_hotspot=eq.${encodeURIComponent(hotspot)}`;
      }
      if (region) {
        articlesUrl += `&region=eq.${encodeURIComponent(region)}`;
      }

      let clustersUrl = `${supabaseUrl}/rest/v1/clusters?order=last_updated.desc&limit=50`;
      if (category) {
        clustersUrl += `&category=eq.${encodeURIComponent(category)}`;
      }
      if (hotspot) {
        clustersUrl += `&related_hotspot=eq.${encodeURIComponent(hotspot)}`;
      }

      let hotspotUrl = `${supabaseUrl}/rest/v1/hotspot_scores?order=updated_at.desc`;
      if (hotspot) {
        hotspotUrl += `&id=eq.${encodeURIComponent(hotspot)}`;
      }

      const headers = {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Accept: 'application/json'
      };

      const [artRes, clsRes, hsRes] = await Promise.allSettled([
        fetch(articlesUrl, { headers }),
        fetch(clustersUrl, { headers }),
        fetch(hotspotUrl, { headers })
      ]);

      if (artRes.status === 'fulfilled' && artRes.value.ok) {
        const rawArticles = await artRes.value.json();
        if (Array.isArray(rawArticles) && rawArticles.length > 0) {
          articles = rawArticles.map((a: any): IntelNewsItem => ({
            id: String(a.id || a.url || Math.random().toString(36).slice(2)),
            title: a.title,
            summary: a.summary || a.title,
            source: a.source || a.source_name || a.source_domain || 'OSINT Feed',
            timeAgo: formatRelativeTime(a.published_at),
            publishedAt: a.published_at,
            category: a.category || 'geopolitical',
            severity: a.severity || 'medium',
            coordinates: Array.isArray(a.coordinates) && a.coordinates.length === 2
              ? [Number(a.coordinates[0]), Number(a.coordinates[1])]
              : [86.35, 25.06],
            relatedHotspot: a.related_hotspot || undefined,
            region: a.region || undefined,
            countryCode: a.country_code || undefined,
            link: a.link || a.url || undefined
          }));
          fetchedFromSupabase = true;
        }
      }

      if (clsRes.status === 'fulfilled' && clsRes.value.ok) {
        const rawClusters = await clsRes.value.json();
        if (Array.isArray(rawClusters) && rawClusters.length > 0) {
          clusters = rawClusters.map((c: any): CorroboratedIntelCluster => ({
            id: String(c.id || c.cluster_id),
            headline: c.headline || c.title,
            summary: c.summary || '',
            confidence: c.confidence || 'REPORTED',
            category: c.category || 'geopolitical',
            severity: c.severity || 'medium',
            coordinates: Array.isArray(c.coordinates) && c.coordinates.length === 2
              ? [Number(c.coordinates[0]), Number(c.coordinates[1])]
              : [86.35, 25.06],
            relatedHotspot: c.related_hotspot || (Array.isArray(c.related_hotspots) ? c.related_hotspots[0] : undefined),
            related_hotspot: c.related_hotspot || (Array.isArray(c.related_hotspots) ? c.related_hotspots[0] : undefined),
            countryCode: c.country_code || 'GLOBAL',
            country_code: c.country_code || 'GLOBAL',
            sources: Array.isArray(c.sources) ? c.sources : (typeof c.sources === 'string' ? JSON.parse(c.sources) : []),
            first_seen: c.first_seen || c.first_seen_at || new Date().toISOString(),
            last_updated: c.last_updated || c.last_updated_at || new Date().toISOString(),
            article_count: c.article_count || (Array.isArray(c.article_ids) ? c.article_ids.length : 1)
          }));
        }
      }

      if (hsRes.status === 'fulfilled' && hsRes.value.ok) {
        const rawHotspots = await hsRes.value.json();
        if (Array.isArray(rawHotspots)) {
          hotspotRows = rawHotspots;
        }
      }
    } catch (err) {
      console.warn('[API/feed] Supabase fetch fallback triggered:', err);
    }
  }

  // Graceful verified fallback if Supabase articles are not available
  if (!fetchedFromSupabase || articles.length === 0) {
    articles = filterInMemoryArticles(BREAKING_INTEL_DISPATCHES, durationMs, cutoffDate, category, hotspot, region);
    if (clusters.length === 0) {
      clusters = synthesizeClusters(articles);
    }
  }

  // Merge dynamic hotspot scores with verified INTEL_HOTSPOTS baseline
  let finalHotspots: IntelHotspot[] = INTEL_HOTSPOTS;
  if (hotspotRows.length > 0) {
    const rowMap = new Map<string, any>();
    for (const row of hotspotRows) {
      if (row.id) rowMap.set(row.id, row);
      if (row.hotspot_id) rowMap.set(row.hotspot_id, row);
    }
    finalHotspots = INTEL_HOTSPOTS.map((base) => {
      const dynamic = rowMap.get(base.id);
      if (!dynamic) return base;
      return {
        ...base,
        escalationScore: dynamic.escalation_score ?? dynamic.score ?? base.escalationScore,
        escalationTrend: dynamic.escalation_trend || base.escalationTrend,
        escalationDelta: dynamic.escalation_delta || (dynamic.delta != null ? `${dynamic.delta >= 0 ? '▲ +' : '▼ '}${dynamic.delta}` : base.escalationDelta),
        telemetry: {
          ...base.telemetry,
          ...(dynamic.telemetry || {})
        }
      };
    });
  }

  if (hotspot) {
    finalHotspots = finalHotspots.filter((h) => h.id === hotspot);
  }
  if (region) {
    finalHotspots = finalHotspots.filter((h) => h.region && h.region.toLowerCase() === region);
  }

  // Calculate dynamic hotspotScores map
  const hotspotScores: Record<string, { score: number; delta: number; count: number }> = {};
  for (const h of finalHotspots) {
    const deltaNum = typeof h.escalationDelta === 'string'
      ? parseFloat(h.escalationDelta.replace(/[^0-9.-]/g, '')) || 0
      : 0;
    hotspotScores[h.id] = {
      score: h.escalationScore,
      delta: deltaNum,
      count: (h.telemetry as any)?.activeReports || 0
    };
  }

  // Conflict zone features
  let finalConflicts: ConflictZoneFeature[] = CONFLICT_ZONES;
  if (hotspot) {
    finalConflicts = finalConflicts.filter((c) => c.id.includes(hotspot) || hotspot.includes(c.id));
    if (finalConflicts.length === 0) finalConflicts = CONFLICT_ZONES;
  }

  const responsePayload: FeedApiResponse = {
    status: 'ok',
    success: true,
    count: articles.length,
    timeRange: queryRange,
    timestamp: new Date().toISOString(),
    articles,
    dispatches: articles,
    clusters,
    hotspots: finalHotspots,
    hotspotScores,
    conflictZones: finalConflicts,
    conflicts: finalConflicts
  };

  // Deterministic ETag calculation
  const etag = computeETag({
    count: articles.length,
    clustersCount: clusters.length,
    hotspotsCount: finalHotspots.length,
    topArticleId: articles[0]?.id || '',
    topClusterId: clusters[0]?.id || '',
    range: queryRange
  });

  res.setHeader('ETag', etag);

  const ifNoneMatch = req.headers['if-none-match'];
  if (ifNoneMatch && (ifNoneMatch === etag || ifNoneMatch.includes(etag))) {
    return res.status(304).end();
  }

  return res.status(200).json(responsePayload);
}
