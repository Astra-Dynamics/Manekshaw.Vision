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
  operatorCode?: string;
  assetCategory?: 'NAVAL CSGs' | 'AIRBASES & BOMBER WINGS' | 'NUCLEAR & MISSILE SITES' | 'SPACE & RADAR ARRAYS' | string;
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
  escalationScore: number; // 0-100 scale (or 1-5 legacy)
  escalationTrend: 'escalating' | 'stable' | 'de-escalating';
  escalationDelta?: string; // e.g. '▲ +4.2', '▼ -1.5', '— 0.0'
  region?: string;
  countryCode?: string;
  telemetry?: {
    airActivity?: string;
    navalDensity?: string;
    gnssJamming?: string;
    adizIncursions?: string;
  };
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
  region?: string;
  countryCode?: string;
  link?: string;
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

export type IntelDrawerItemType = 'video' | 'news' | 'hotspot' | 'conflict' | 'feature';

export interface WorkspaceDrawerItem {
  id: string;
  type: IntelDrawerItemType;
  title: string;
  subtitle?: string;
  tags?: string[];
  countryCode?: string;
  timestamp?: string;
  severity?: string;
  youtubeId?: string;
  channelId?: string;
  uploadsPlaylistId?: string;
  isLive?: boolean;
  channel?: string;
  externalUrl?: string;
  summary?: string;
  source?: string;
  link?: string;
  coordinates?: [number, number];
  description?: string;
  parties?: string[];
  raw?: any;
}

export interface WorkspaceColumn {
  id: string;
  item: WorkspaceDrawerItem;
  widthFlex: number; // Default 1
  customHeight?: number; // Canva-style vertical resize in px
}

export interface WorkspaceRow {
  rowId: string;
  columns: WorkspaceColumn[];
}

export interface WorkspaceDrawerTab {
  id: string;
  title: string;
  items: WorkspaceDrawerItem[];
  rows?: WorkspaceRow[];
}

export interface WorkspaceTabIntelDeskState {
  isOpen: boolean;
  isMinimized: boolean;
  width?: number; // Resizable between 280 and 680
  activeSubTab: 'feed' | 'videos' | 'hotspots' | 'conflicts' | 'infra' | 'dossier';
  searchQuery: string;
  severityFilter: 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM';
  videoCategoryFilter: string;
  videoRegionFilter: string;
  activeVideoChannelId: string;
  isPlayerMinimized: boolean;
  selectedCountryCode: string | null;
}

export interface WorkspaceTabRightDrawerState {
  isOpen: boolean;
  isMinimized: boolean;
  width: number; // Resizable between 300 and 65vw
  activeDrawerTabId: string;
  drawerTabs: WorkspaceDrawerTab[];
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
  
  // Isolated per-tab desk & drawer states
  intelDesk: WorkspaceTabIntelDeskState;
  rightDrawer: WorkspaceTabRightDrawerState;

  searchQuery?: string;
  selectedCountryCode?: string | null;
  selectedCountryName?: string | null;
}

export const createDefaultIntelDeskState = (region?: string): WorkspaceTabIntelDeskState => ({
  isOpen: true,
  isMinimized: false,
  activeSubTab: 'feed',
  searchQuery: '',
  severityFilter: 'ALL',
  videoCategoryFilter: 'ALL',
  videoRegionFilter: region || 'all',
  activeVideoChannelId: 'dw_news_live',
  isPlayerMinimized: false,
  selectedCountryCode: null
});

export const createDefaultRightDrawerState = (): WorkspaceTabRightDrawerState => ({
  isOpen: false,
  isMinimized: false,
  width: 460,
  activeDrawerTabId: 'drawer_tab_1',
  drawerTabs: [
    {
      id: 'drawer_tab_1',
      title: 'Tactical Watch',
      items: [],
      rows: []
    }
  ]
});
