import { IntelNewsItem } from '../types';
import { BREAKING_INTEL_DISPATCHES } from './newsService';
import { getLiveIntelDispatches } from './liveFeedAdapter';

const OSINT_CACHE_KEY = 'manvis_osint_feed_cache';
const OSINT_CACHE_TTL = 3 * 60 * 1000; // 3 minutes

export interface OsintFeedSource {
  id: string;
  name: string;
  url: string;
  region: string;
  tier: 'OFFICIAL MOD' | 'TIER-1 WIRE' | 'OSINT SENSOR' | 'STATE MEDIA - FLAGGED' | 'OSINT WIRE';
}

export const OSINT_FEED_SOURCES: OsintFeedSource[] = [
  {
    id: 'kinetic_global',
    name: 'Global Defense & Kinetic Wire',
    url: 'https://news.google.com/rss/search?q=(CENTCOM+OR+NATO+OR+Pentagon+OR+"missile+strike"+OR+"air+defense"+OR+artillery)+when:1d&hl=en-US&gl=US&ceid=US:en',
    region: 'global',
    tier: 'TIER-1 WIRE'
  },
  {
    id: 'india_south_asia',
    name: 'India & South Asia Defense (SOI/LAC/IOR)',
    url: 'https://news.google.com/rss/search?q=("Indian+Army"+OR+"Indian+Navy"+OR+DRDO+OR+LAC+OR+Ladakh+OR+"Indian+Ocean")+when:2d&hl=en-IN&gl=IN&ceid=IN:en',
    region: 'india',
    tier: 'OFFICIAL MOD'
  },
  {
    id: 'middle_east',
    name: 'Middle East & Red Sea Corridor',
    url: 'https://news.google.com/rss/search?q=(IDF+OR+IRGC+OR+Houthi+OR+"Red+Sea"+OR+"Strait+of+Hormuz"+OR+Gaza+OR+Lebanon)+when:1d&hl=en-US&gl=US&ceid=US:en',
    region: 'middle-east',
    tier: 'TIER-1 WIRE'
  },
  {
    id: 'indo_pacific',
    name: 'Indo-Pacific & Taiwan Strait',
    url: 'https://news.google.com/rss/search?q=(PLA+OR+"Taiwan+Strait"+OR+"South+China+Sea"+OR+ADIZ+OR+Philippines+OR+JMSDF)+when:1d&hl=en-US&gl=US&ceid=US:en',
    region: 'indo-pacific',
    tier: 'TIER-1 WIRE'
  },
  {
    id: 'eastern_europe',
    name: 'Eastern Europe & Black Sea Frontline',
    url: 'https://news.google.com/rss/search?q=(Ukraine+OR+Donbas+OR+Black+Sea+OR+Kharkiv+OR+Crimea+OR+Russian+MoD)+when:1d&hl=en-US&gl=US&ceid=US:en',
    region: 'europe',
    tier: 'TIER-1 WIRE'
  }
];

// Coordinate dictionary for automated entity extraction
const GEOLOCATION_MAP: Array<{ keywords: string[]; coords: [number, number]; countryCode: string; region: string }> = [
  { keywords: ['red sea', 'bab el mandeb', 'bab-el-mandeb', 'houthi', 'yemen', 'al-hudaydah'], coords: [43.1, 13.5], countryCode: 'YE', region: 'middle-east' },
  { keywords: ['strait of hormuz', 'hormuz', 'persian gulf', 'iranian navy', 'irgc'], coords: [56.35, 26.55], countryCode: 'IR', region: 'middle-east' },
  { keywords: ['fordow', 'natanz', 'tehran', 'iran', 'iranian'], coords: [51.42, 35.68], countryCode: 'IR', region: 'middle-east' },
  { keywords: ['gaza', 'tel aviv', 'israel', 'idf', 'negev'], coords: [34.45, 31.52], countryCode: 'IL', region: 'middle-east' },
  { keywords: ['beirut', 'lebanon', 'hezbollah', 'baalbek', 'bekaa'], coords: [35.51, 33.89], countryCode: 'LB', region: 'middle-east' },
  { keywords: ['taiwan strait', 'taipei', 'taiwan', 'kinmen', 'matsui'], coords: [119.5, 24.2], countryCode: 'TW', region: 'indo-pacific' },
  { keywords: ['south china sea', 'second thomas shoal', 'spratly', 'scarborough', 'philippines'], coords: [115.86, 9.74], countryCode: 'PH', region: 'indo-pacific' },
  { keywords: ['beijing', 'pla', 'china', 'eastern theater', 'shandong', 'fujian'], coords: [116.4, 39.9], countryCode: 'CN', region: 'indo-pacific' },
  { keywords: ['tokyo', 'japan', 'jmsdf', 'senkaku', 'okinawa'], coords: [139.69, 35.68], countryCode: 'JP', region: 'indo-pacific' },
  { keywords: ['seoul', 'dmz', 'korea', 'pyongyang', 'north korea'], coords: [126.97, 37.56], countryCode: 'KR', region: 'indo-pacific' },
  { keywords: ['ladakh', 'depsang', 'lac', 'galwan', 'line of actual control', 'eastern ladakh'], coords: [78.1, 35.2], countryCode: 'IN', region: 'india' },
  { keywords: ['indian navy', 'arabian sea', 'bay of bengal', 'socotra', 'ins vikrant'], coords: [68.5, 16.2], countryCode: 'IN', region: 'india' },
  { keywords: ['delhi', 'indian army', 'drdo', 'loc', 'kashmir'], coords: [77.2, 28.6], countryCode: 'IN', region: 'india' },
  { keywords: ['andaman', 'nicobar', 'malacca strait', 'port blair'], coords: [92.73, 11.66], countryCode: 'IN', region: 'india' },
  { keywords: ['black sea', 'crimea', 'novorossiysk', 'sevastopol'], coords: [37.8, 44.7], countryCode: 'UA', region: 'europe' },
  { keywords: ['zaporizhzhia', 'kyiv', 'kharkiv', 'donbas', 'ukraine'], coords: [35.1, 47.5], countryCode: 'UA', region: 'europe' },
  { keywords: ['suwalki', 'baltic', 'lithuania', 'kaliningrad', 'estonia', 'latvia'], coords: [23.3, 54.3], countryCode: 'LT', region: 'europe' },
  { keywords: ['moscow', 'kremlin', 'russian mod', 'russia'], coords: [37.61, 55.75], countryCode: 'RU', region: 'europe' },
  { keywords: ['alaska', 'norad', 'bering strait', 'arctic'], coords: [-166.0, 65.0], countryCode: 'US', region: 'americas' },
  { keywords: ['panama canal', 'gatun lake', 'panama'], coords: [-79.9, 9.1], countryCode: 'PA', region: 'americas' },
  { keywords: ['washington', 'pentagon', 'centcom', 'cisa'], coords: [-77.03, 38.89], countryCode: 'US', region: 'americas' }
];

// Automated Threat Severity Classifier
export function classifySeverity(text: string): 'critical' | 'high' | 'medium' | 'low' {
  const lower = text.toLowerCase();
  const criticalTerms = [
    'intercept', 'missile strike', 'airstrike', 'ballistic', 'nuclear', 'explosion',
    'killed', 'hypersonic', 'blockade', 'severed', 'cable cut', 'invasion', 'm6.', 'm7.', 'm8.', 'mass casualty'
  ];
  const highTerms = [
    'incursion', 'adiz', 'deployment', 'live-fire', 'water cannon', 'sanctions',
    'jamming', 'cyberattack', 'alert', 'combat', 'warhead', 'drills', 'destroyer', 'carrier'
  ];
  const mediumTerms = [
    'patrol', 'transit', 'exercise', 'summit', 'talks', 'monitoring', 'agreement', 'statement', 'briefing'
  ];

  if (criticalTerms.some((t) => lower.includes(t))) return 'critical';
  if (highTerms.some((t) => lower.includes(t))) return 'high';
  if (mediumTerms.some((t) => lower.includes(t))) return 'medium';
  return 'low';
}

// Automated Domain Classifier
export function classifyDomain(text: string): 'military' | 'geopolitical' | 'cyber' | 'natural' | 'economic' {
  const lower = text.toLowerCase();
  if (lower.includes('earthquake') || lower.includes('tsunami') || lower.includes('volcano') || lower.includes('seismic') || lower.includes('typhoon')) {
    return 'natural';
  }
  if (lower.includes('cyber') || lower.includes('cable') || lower.includes('fiber') || lower.includes('jamming') || lower.includes('telecom') || lower.includes('spoofing')) {
    return 'cyber';
  }
  if (lower.includes('crude') || lower.includes('oil') || lower.includes('sanction') || lower.includes('trade') || lower.includes('inflation') || lower.includes('tsmc') || lower.includes('tariff')) {
    return 'economic';
  }
  if (lower.includes('strike') || lower.includes('missile') || lower.includes('army') || lower.includes('navy') || lower.includes('air force') || lower.includes('carrier') || lower.includes('destroyer') || lower.includes('artillery') || lower.includes('combat') || lower.includes('adiz')) {
    return 'military';
  }
  return 'geopolitical';
}

// Match coordinates and country from title & summary text
export function matchGeolocation(text: string): { coords: [number, number]; countryCode: string; region: string } {
  const lower = text.toLowerCase();
  for (const entry of GEOLOCATION_MAP) {
    if (entry.keywords.some((k) => lower.includes(k))) {
      return {
        coords: entry.coords,
        countryCode: entry.countryCode,
        region: entry.region
      };
    }
  }
  // Default coordinates: Indian Ocean / Global neutral
  return {
    coords: [68.0, 18.0],
    countryCode: 'GLOBAL',
    region: 'global'
  };
}

// Extract source tier badge
export function classifySourceTier(sourceName: string): string {
  const lower = sourceName.toLowerCase();
  if (lower.includes('centcom') || lower.includes('nato') || lower.includes('pentagon') || lower.includes('ministry') || lower.includes('navy') || lower.includes('army') || lower.includes('mnd') || lower.includes('idf') || lower.includes('iaea') || lower.includes('cisa') || lower.includes('usgs')) {
    return 'OFFICIAL MOD';
  }
  if (lower.includes('reuters') || lower.includes('ap') || lower.includes('associated press') || lower.includes('bloomberg') || lower.includes('bbc') || lower.includes('afp')) {
    return 'TIER-1 WIRE';
  }
  if (lower.includes('telecom') || lower.includes('lloyd') || lower.includes('ukmto') || lower.includes('ais') || lower.includes('sensor')) {
    return 'OSINT SENSOR';
  }
  if (lower.includes('tass') || lower.includes('rt') || lower.includes('cgtn') || lower.includes('xinhua') || lower.includes('global times') || lower.includes('irna')) {
    return 'STATE MEDIA - FLAGGED';
  }
  return 'TIER-1 WIRE';
}

/**
 * Live USGS Earthquakes Fetcher (M4.5+ Real-Time GeoJSON API)
 * Directly CORS-enabled and zero API key required.
 */
export async function fetchLiveUsgsQuakes(): Promise<IntelNewsItem[]> {
  try {
    const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson', {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (!data || !Array.isArray(data.features)) return [];

    return data.features.slice(0, 15).map((f: any, idx: number) => {
      const mag = f.properties.mag || 4.5;
      const place = f.properties.place || 'Offshore Region';
      const depth = f.geometry.coordinates[2] || 10;
      const [lon, lat] = [f.geometry.coordinates[0], f.geometry.coordinates[1]];
      const timeAgo = formatTimeAgo(f.properties.time);

      return {
        id: `quake_${f.id || idx}_${Date.now()}`,
        title: `USGS Sensor: M${mag.toFixed(1)} Tectonic Event - ${place}`,
        summary: `Hypocenter registered at ${depth.toFixed(1)} km depth. Automatic seismic telemetry recorded by USGS National Earthquake Information Center.`,
        source: 'USGS NEIC Real-Time Sensor',
        timeAgo,
        publishedAt: new Date(f.properties.time).toISOString(),
        category: 'natural',
        severity: mag >= 6.0 ? 'critical' : mag >= 5.0 ? 'high' : 'medium',
        coordinates: [lon, lat],
        countryCode: 'SEISMIC',
        region: 'global',
        link: f.properties.url || 'https://earthquake.usgs.gov'
      } as IntelNewsItem;
    });
  } catch (err) {
    console.warn('Live USGS quake fetch failed, using fallback:', err);
    return [];
  }
}

function formatTimeAgo(timestamp: number): string {
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  return `${Math.floor(diffHour / 24)}d ago`;
}

/**
 * Master Aggregator: Pulls live USGS earthquakes, RSS feeds (if accessible),
 * and seamlessly merges them with the curated 40+ breaking OSINT corpus.
 */
export async function getAggregatedOsintFeed(): Promise<IntelNewsItem[]> {
  // Check sessionStorage cache
  try {
    const cached = sessionStorage.getItem(OSINT_CACHE_KEY);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < OSINT_CACHE_TTL && Array.isArray(data) && data.length > 0) {
        return data;
      }
    }
  } catch (e) {}

  // Fetch live earthquakes
  const quakes = await fetchLiveUsgsQuakes();

  // Combine live quakes + live feed dispatches
  let liveDispatches = await getLiveIntelDispatches();
  if (!liveDispatches || liveDispatches.length === 0) {
    liveDispatches = BREAKING_INTEL_DISPATCHES;
  }
  const merged: IntelNewsItem[] = [...quakes, ...liveDispatches];

  // Sort by severity (critical first) and then newest
  const sorted = merged.sort((a, b) => {
    const sevRank = { critical: 3, high: 2, medium: 1, low: 0 };
    const diff = (sevRank[b.severity] || 0) - (sevRank[a.severity] || 0);
    return diff;
  });

  try {
    sessionStorage.setItem(OSINT_CACHE_KEY, JSON.stringify({ data: sorted, timestamp: Date.now() }));
  } catch (e) {}

  return sorted;
}
