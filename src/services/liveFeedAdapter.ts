import { IntelNewsItem, IntelHotspot, ConflictZoneFeature } from '../types';
import { BREAKING_INTEL_DISPATCHES } from './newsService';
import { INTEL_HOTSPOTS } from '../data/hotspots';
import { CONFLICT_ZONES } from '../data/conflicts';

const FEED_CACHE_KEY = 'manvis_live_feed_cache_v3';
const ETAG_CACHE_KEY = 'manvis_feed_etag_v3';
const CACHE_TTL_MS = 60 * 1000; // 60 seconds

interface CachedFeedPayload {
  timestamp: number;
  dispatches: IntelNewsItem[];
  clusters: any[];
  hotspots: any[];
}

let inMemoryPayload: CachedFeedPayload | null = null;
let inFlightPromise: Promise<CachedFeedPayload> | null = null;

function formatRelativeTime(isoString?: string): string {
  if (!isoString) return '12m ago';
  const diffSec = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (isNaN(diffSec) || diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay}d ago`;
}

/**
 * Filter items by the active operational time-range ('1h', '6h', '24h', '7d', '30d')
 */
export function filterByTimeRange(items: IntelNewsItem[], timeRange: string = '7d'): IntelNewsItem[] {
  if (!items || items.length === 0) return [];
  const normalized = timeRange.toLowerCase();

  const limits: Record<string, number> = {
    '1h': 1 * 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000
  };

  const maxAgeMs = limits[normalized] || limits['7d'];
  const now = Date.now();

  return items.filter((item) => {
    if (!item.publishedAt) {
      // Parse relative time string fallback (e.g. "12m ago", "2h ago", "3d ago")
      const match = (item.timeAgo || '').match(/(\d+)\s*([mhd])/);
      if (match) {
        const val = parseInt(match[1], 10);
        const unit = match[2];
        const ageMs = unit === 'm' ? val * 60 * 1000 : unit === 'h' ? val * 3600 * 1000 : val * 86400 * 1000;
        return ageMs <= maxAgeMs;
      }
      return true;
    }

    const itemTime = new Date(item.publishedAt).getTime();
    if (isNaN(itemTime)) return true;
    return now - itemTime <= maxAgeMs;
  });
}

/**
 * Core cached fetcher for /api/feed with ETag and localStorage last-known-good fallback.
 */
async function fetchFeedPayload(): Promise<CachedFeedPayload> {
  const now = Date.now();
  if (inMemoryPayload && now - inMemoryPayload.timestamp < CACHE_TTL_MS) {
    return inMemoryPayload;
  }

  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    // Check localStorage cache
    try {
      const raw = localStorage.getItem(FEED_CACHE_KEY);
      if (raw) {
        const parsed: CachedFeedPayload = JSON.parse(raw);
        if (now - parsed.timestamp < CACHE_TTL_MS && parsed.dispatches && parsed.dispatches.length > 0) {
          inMemoryPayload = parsed;
          return parsed;
        }
      }
    } catch (e) {}

    const headers: Record<string, string> = {
      'Accept': 'application/json'
    };
    try {
      const savedEtag = localStorage.getItem(ETAG_CACHE_KEY);
      if (savedEtag) headers['If-None-Match'] = savedEtag;
    } catch (e) {}

    try {
      const res = await fetch('/api/feed?timeRange=30d', { headers });

      if (res.status === 304 && inMemoryPayload) {
        inMemoryPayload.timestamp = now;
        return inMemoryPayload;
      }

      if (res.ok) {
        const etag = res.headers.get('ETag');
        if (etag) {
          try { localStorage.setItem(ETAG_CACHE_KEY, etag); } catch (e) {}
        }

        const data = await res.json();
        if (data.success && Array.isArray(data.dispatches) && data.dispatches.length > 0) {
          const payload: CachedFeedPayload = {
            timestamp: now,
            dispatches: data.dispatches,
            clusters: data.clusters || [],
            hotspots: data.hotspots || []
          };
          inMemoryPayload = payload;
          try {
            localStorage.setItem(FEED_CACHE_KEY, JSON.stringify(payload));
          } catch (e) {}
          return payload;
        }
      }
    } catch (err) {
      console.warn('[liveFeedAdapter] Remote /api/feed unreachable, using baseline:', err);
    }

    // Default Baseline Fallback
    const fallbackPayload: CachedFeedPayload = {
      timestamp: now,
      dispatches: BREAKING_INTEL_DISPATCHES,
      clusters: [],
      hotspots: []
    };
    inMemoryPayload = fallbackPayload;
    return fallbackPayload;
  })();

  try {
    const result = await inFlightPromise;
    return result;
  } finally {
    inFlightPromise = null;
  }
}

/**
 * Returns live or cached breaking dispatches, with active time-range filtering.
 */
export async function getLiveIntelDispatches(timeRange: string = '7d'): Promise<IntelNewsItem[]> {
  const payload = await fetchFeedPayload();
  return filterByTimeRange(payload.dispatches, timeRange);
}

/**
 * Returns dynamic hotspots merged with baseline geospatial coordinates.
 */
export async function getLiveHotspots(): Promise<IntelHotspot[]> {
  const payload = await fetchFeedPayload();
  if (!payload.hotspots || payload.hotspots.length === 0) {
    return INTEL_HOTSPOTS;
  }

  // Merge dynamic scores into existing geometry
  const scoreMap = new Map<string, any>();
  payload.hotspots.forEach((hs: any) => scoreMap.set(hs.id, hs));

  return INTEL_HOTSPOTS.map((base) => {
    const dynamic = scoreMap.get(base.id);
    if (!dynamic) return base;
    return {
      ...base,
      escalationScore: dynamic.escalation_score ?? base.escalationScore,
      escalationTrend: dynamic.escalation_trend ?? base.escalationTrend,
      escalationDelta: dynamic.escalation_delta ?? base.escalationDelta,
      telemetry: dynamic.telemetry ? { ...base.telemetry, ...dynamic.telemetry } : base.telemetry
    };
  });
}

/**
 * Returns live conflict zones.
 */
export async function getLiveConflictZones(): Promise<ConflictZoneFeature[]> {
  return CONFLICT_ZONES;
}
