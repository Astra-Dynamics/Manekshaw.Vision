export type LayerKey =
  | 'iranAttacks'
  | 'hotspots'
  | 'conflicts'
  | 'bases'
  | 'nuclear'
  | 'military'
  | 'weather'
  | 'canadaAlerts'
  | 'outages'
  | 'natural'
  | 'waterways'
  | 'economic'
  | 'sanctions';

export interface LayerMetadata {
  id: LayerKey;
  label: string;
  shortLabel: string;
  icon: string;
  color: string;
  count?: number;
  description: string;
}

export interface MapFeatureItem {
  id: string;
  layer: LayerKey;
  name: string;
  coordinates: [number, number]; // [lon, lat]
  category?: string;
  status?: string;
  severity?: 'critical' | 'high' | 'medium' | 'low' | 'info';
  timestamp?: string;
  description: string;
  details?: Record<string, any>;
  source?: string;
  link?: string;
}

export interface ConflictZoneFeature {
  id: string;
  name: string;
  center: [number, number]; // [lon, lat]
  coords: [number, number][]; // Polygon coords [lon, lat]
  intensity: 'critical' | 'high' | 'medium' | 'low';
  parties: string[];
  casualties?: string;
  description: string;
  updatedAt: string;
}

export interface IntelHotspot {
  id: string;
  name: string;
  coordinates: [number, number]; // [lon, lat]
  escalationScore: 1 | 2 | 3 | 4 | 5; // 1=stable, 5=critical
  escalationTrend: 'escalating' | 'stable' | 'de-escalating';
  description: string;
  whyItMatters: string;
  agencies?: string[];
  recentIncidents?: string[];
}

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
}

export type TheaterView = 'global' | 'india' | 'middle-east' | 'indo-pacific' | 'europe' | 'americas' | 'africa';

export type ThemeMode = 'dark' | 'light';

export interface TheaterConfig {
  id: TheaterView;
  name: string;
  center: [number, number]; // [lon, lat]
  zoom: number;
}
