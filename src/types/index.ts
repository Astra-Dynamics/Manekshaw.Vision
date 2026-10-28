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
  | 'sanctions'
  | 'gpsJamming'
  | 'adizZones'
  | 'fortifiedBorders';

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

export interface GpsJammingZone {
  id: string;
  name: string;
  region: string;
  center: [number, number]; // [lon, lat]
  intensity: 'critical' | 'high' | 'medium';
  attenuationPercent: number;
  frequencies: string[];
  systemsDetected: string[];
  advisory: string;
  description: string;
  updatedAt: string;
  coords: [number, number][]; // Polygon coords [lon, lat]
}

export interface AdizZoneFeature {
  id: string;
  name: string;
  country: string;
  authority: string;
  alertLevel: 'active' | 'heightened' | 'routine';
  center: [number, number]; // [lon, lat]
  rules: string;
  description: string;
  color: string;
  coords: [number, number][]; // Polygon coords [lon, lat]
}

export interface FortifiedBorderFeature {
  id: string;
  name: string;
  theater: string;
  lengthKm: number;
  status: string;
  forces: string[];
  description: string;
  color: string;
  coords: [number, number][]; // LineString coords [lon, lat]
}

export type StrategicFeature =
  | MapFeatureItem
  | IntelHotspot
  | ConflictZoneFeature
  | GpsJammingZone
  | AdizZoneFeature
  | FortifiedBorderFeature;

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

export type TheaterView =
  | 'global'
  | 'india'
  | 'americas'
  | 'middle-east'
  | 'europe'
  | 'indo-pacific'
  | 'latin-america'
  | 'africa'
  | 'oceania';

export type ThemeMode = 'dark' | 'light';

export interface TheaterConfig {
  id: TheaterView;
  name: string;
  center: [number, number]; // [lon, lat]
  zoom: number;
}

export interface WorkspaceTab {
  id: string;
  title: string;
  lat: number;
  lon: number;
  zoom: number;
  view: TheaterView;
  timeRange: string;
  activeLayers: Record<LayerKey, boolean>;
  searchQuery?: string;
  selectedCountryCode?: string | null;
  selectedCountryName?: string | null;
}
