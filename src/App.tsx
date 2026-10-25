import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { AlertTicker } from './components/AlertTicker';
import { MapComponent } from './components/MapComponent';
import { LayerDock } from './components/LayerDock';
import { RightIntelligencePanel } from './components/RightIntelligencePanel';
import { CountryBriefModal } from './components/CountryBriefModal';
import { CommandPalette } from './components/CommandPalette';
import { getCountryIntel, CountryIntelDetails } from './data/countryIntel';
import {
  LayerKey,
  TheaterView,
  MapFeatureItem,
  IntelHotspot,
  ConflictZoneFeature,
  IntelNewsItem,
  ThemeMode
} from './types';

// Curated Datasets
import { INTEL_HOTSPOTS } from './data/hotspots';
import { CONFLICT_ZONES } from './data/conflicts';
import { MILITARY_BASES } from './data/militaryBases';
import { NUCLEAR_SITES } from './data/nuclearSites';
import { STRATEGIC_WATERWAYS } from './data/waterways';
import { SANCTIONS_REGIMES } from './data/sanctions';
import { ECONOMIC_CENTERS } from './data/economic';
import { INFRASTRUCTURE_OUTAGES } from './data/outages';
import { CANADA_ALERTS } from './data/canadaAlerts';
import { IRAN_ATTACKS } from './data/iranAttacks';
import { MILITARY_ASSETS } from './data/militaryAssets';

// Real-Time Live Data Feeds
import { fetchLiveEarthquakes } from './services/earthquakes';
import { fetchNasaEonetEvents } from './services/nasaEonet';
import { fetchWeatherAlerts } from './services/weatherAlerts';
import { BREAKING_INTEL_DISPATCHES } from './services/newsService';

const ALL_LAYER_KEYS: LayerKey[] = [
  'iranAttacks',
  'hotspots',
  'conflicts',
  'bases',
  'nuclear',
  'military',
  'weather',
  'canadaAlerts',
  'outages',
  'natural',
  'waterways',
  'economic',
  'sanctions'
];

export const App: React.FC = () => {
  // Parse URL Parameters
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

  const initialLat = parseFloat(urlParams.get('lat') || '22.4589');
  const initialLon = parseFloat(urlParams.get('lon') || '82.7533');
  const initialZoom = parseFloat(urlParams.get('zoom') || '3.25');
  const initialView = (urlParams.get('view') as TheaterView) || 'global';
  const initialTimeRange = urlParams.get('timeRange') || '7d';
  const initialLayersParam = urlParams.get('layers');

  const initialActiveLayers = useMemo((): Record<LayerKey, boolean> => {
    const obj: Record<LayerKey, boolean> = {
      iranAttacks: true,
      hotspots: true,
      conflicts: true,
      bases: true,
      nuclear: true,
      military: true,
      weather: true,
      canadaAlerts: true,
      outages: true,
      natural: true,
      waterways: true,
      economic: true,
      sanctions: true
    };
    if (initialLayersParam) {
      const activeList = initialLayersParam.split(',');
      ALL_LAYER_KEYS.forEach((k) => {
        obj[k] = activeList.includes(k);
      });
    }
    return obj;
  }, [initialLayersParam]);

  // State
  const [mapCenter, setMapCenter] = useState<[number, number]>([initialLon, initialLat]);
  const [mapZoom, setMapZoom] = useState<number>(initialZoom);
  const [currentView, setCurrentView] = useState<TheaterView>(initialView);
  const [timeRange, setTimeRange] = useState<string>(initialTimeRange);
  const [activeLayers, setActiveLayers] = useState<Record<LayerKey, boolean>>(initialActiveLayers);

  // Theme Management (Dark default, persists in localStorage)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('manvis_theme') as ThemeMode) || 'dark';
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('manvis_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // UI Panels
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [isLayerDockOpen, setIsLayerDockOpen] = useState<boolean>(true);
  const [selectedFeature, setSelectedFeature] = useState<
    MapFeatureItem | IntelHotspot | ConflictZoneFeature | null
  >(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryIntelDetails | null>(null);

  // Live dynamic feeds
  const [liveEarthquakes, setLiveEarthquakes] = useState<MapFeatureItem[]>([]);
  const [liveEonet, setLiveEonet] = useState<MapFeatureItem[]>([]);
  const [liveWeather, setLiveWeather] = useState<MapFeatureItem[]>([]);
  const [newsFeed, setNewsFeed] = useState<IntelNewsItem[]>(BREAKING_INTEL_DISPATCHES);

  // Load Real-Time Public APIs
  useEffect(() => {
    let mounted = true;

    fetchLiveEarthquakes().then((eq) => {
      if (mounted) setLiveEarthquakes(eq);
    });

    fetchNasaEonetEvents().then((ev) => {
      if (mounted) setLiveEonet(ev);
    });

    fetchWeatherAlerts().then((w) => {
      if (mounted) setLiveWeather(w);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Update URL Query Parameters on State Change
  useEffect(() => {
    const activeKeys = Object.entries(activeLayers)
      .filter(([_, v]) => v)
      .map(([k]) => k)
      .join(',');

    const params = new URLSearchParams();
    params.set('lat', mapCenter[1].toFixed(4));
    params.set('lon', mapCenter[0].toFixed(4));
    params.set('zoom', mapZoom.toFixed(2));
    params.set('view', currentView);
    params.set('timeRange', timeRange);
    params.set('layers', activeKeys);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [mapCenter, mapZoom, currentView, timeRange, activeLayers]);

  // Combined feature items
  const allFeatures = useMemo(() => {
    return [
      ...IRAN_ATTACKS,
      ...MILITARY_BASES,
      ...NUCLEAR_SITES,
      ...MILITARY_ASSETS,
      ...STRATEGIC_WATERWAYS,
      ...SANCTIONS_REGIMES,
      ...ECONOMIC_CENTERS,
      ...INFRASTRUCTURE_OUTAGES,
      ...CANADA_ALERTS,
      ...liveEarthquakes,
      ...liveEonet,
      ...liveWeather
    ];
  }, [liveEarthquakes, liveEonet, liveWeather]);

  // Counts per layer
  const layerCounts = useMemo((): Record<LayerKey, number> => {
    const res: Record<LayerKey, number> = {
      iranAttacks: IRAN_ATTACKS.length,
      hotspots: INTEL_HOTSPOTS.length,
      conflicts: CONFLICT_ZONES.length,
      bases: MILITARY_BASES.length,
      nuclear: NUCLEAR_SITES.length,
      military: MILITARY_ASSETS.length,
      weather: liveWeather.length,
      canadaAlerts: CANADA_ALERTS.length,
      outages: INFRASTRUCTURE_OUTAGES.length,
      natural: liveEarthquakes.length + liveEonet.length,
      waterways: STRATEGIC_WATERWAYS.length,
      economic: ECONOMIC_CENTERS.length,
      sanctions: SANCTIONS_REGIMES.length
    };
    return res;
  }, [liveWeather, liveEarthquakes, liveEonet]);

  // Theater Views Presets
  const handleSelectView = (view: TheaterView) => {
    setCurrentView(view);
    if (view === 'global') {
      setMapCenter([30.0, 25.0]);
      setMapZoom(2.8);
    } else if (view === 'india') {
      setMapCenter([80.0, 23.5]);
      setMapZoom(4.4);
    } else if (view === 'middle-east') {
      setMapCenter([48.0, 29.5]);
      setMapZoom(4.8);
    } else if (view === 'indo-pacific') {
      setMapCenter([118.0, 20.0]);
      setMapZoom(4.2);
    } else if (view === 'europe') {
      setMapCenter([24.0, 52.0]);
      setMapZoom(4.2);
    } else if (view === 'americas') {
      setMapCenter([-95.0, 38.0]);
      setMapZoom(3.8);
    }
  };

  const handleToggleLayer = useCallback((layer: LayerKey) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  }, []);

  const handleSetAllLayers = useCallback((enabled: boolean) => {
    const next: Record<LayerKey, boolean> = {} as any;
    ALL_LAYER_KEYS.forEach((k) => {
      next[k] = enabled;
    });
    setActiveLayers(next);
  }, []);

  const handleSelectFeature = useCallback(
    (feature: MapFeatureItem | IntelHotspot | ConflictZoneFeature) => {
      setSelectedFeature(feature);

      // Center map smoothly
      let c: [number, number] = [0, 0];
      if ('coordinates' in feature && feature.coordinates) {
        c = feature.coordinates;
      } else if ('center' in feature && feature.center) {
        c = feature.center;
      }

      if (c[0] !== 0 || c[1] !== 0) {
        setMapCenter(c);
        setMapZoom((prev) => Math.max(prev, 5.5));
      }
    },
    []
  );

  const handleSelectAlert = (alert: IntelNewsItem) => {
    if (alert.coordinates) {
      setMapCenter(alert.coordinates);
      setMapZoom(6.0);
    }
    // Also create a feature dossier
    setSelectedFeature({
      id: alert.id,
      layer: 'military',
      name: alert.title,
      coordinates: alert.coordinates || [0, 0],
      category: alert.category,
      severity: alert.severity,
      description: alert.summary,
      source: alert.source
    });
  };

  const handleSelectCountry = useCallback(
    ({ code, name }: { code: string; name: string }) => {
      const intel = getCountryIntel(code, name);
      setSelectedCountry(intel);
    },
    []
  );

  const countryNews = useMemo(() => {
    if (!selectedCountry) return [];
    return newsFeed.filter(
      (n) =>
        n.title.toLowerCase().includes(selectedCountry.name.toLowerCase()) ||
        n.summary.toLowerCase().includes(selectedCountry.name.toLowerCase())
    );
  }, [selectedCountry, newsFeed]);

  const countryAssets = useMemo(() => {
    if (!selectedCountry || !selectedCountry.bounds) return [];
    const [minX, minY, maxX, maxY] = selectedCountry.bounds;
    return allFeatures.filter((f) => {
      const [lon, lat] = f.coordinates;
      return lon >= minX && lon <= maxX && lat >= minY && lat <= maxY;
    });
  }, [selectedCountry, allFeatures]);

  return (
    <div className="flex flex-col w-screen h-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)] font-sans select-none transition-colors">
      {/* 1. Header Navigation Bar */}
      <Header
        currentView={currentView}
        onSelectView={handleSelectView}
        timeRange={timeRange}
        onSelectTimeRange={setTimeRange}
        isRightPanelOpen={isRightPanelOpen}
        onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* 2. Urgent Breaking News / Telemetry Ticker */}
      <AlertTicker alerts={newsFeed} onSelectAlert={handleSelectAlert} />

      {/* 3. Main Central Operations Area (Side-by-Side: Map on LEFT, Panel on RIGHT) */}
      <div className="relative flex-1 w-full h-full overflow-hidden flex flex-row">
        {/* LEFT SIDE: Interactive Map Area */}
        <div className="relative flex-1 h-full overflow-hidden flex flex-col">
          <MapComponent
            center={mapCenter}
            zoom={mapZoom}
            activeLayers={activeLayers}
            hotspots={INTEL_HOTSPOTS}
            conflicts={CONFLICT_ZONES}
            features={allFeatures}
            theme={theme}
            onSelectFeature={handleSelectFeature}
            onSelectCountry={handleSelectCountry}
            onViewChange={(c, z) => {
              setMapCenter(c);
              setMapZoom(z);
            }}
          />

          {/* Bottom Floating Layer Control Dock over the Map */}
          {isLayerDockOpen && (
            <LayerDock
              activeLayers={activeLayers}
              onToggleLayer={handleToggleLayer}
              onSetAllLayers={handleSetAllLayers}
              counts={layerCounts}
            />
          )}
        </div>

        {/* RIGHT SIDE: Dedicated Intelligence & Dossier Panel */}
        <RightIntelligencePanel
          isOpen={isRightPanelOpen}
          onClose={() => setIsRightPanelOpen(false)}
          hotspots={INTEL_HOTSPOTS}
          conflicts={CONFLICT_ZONES}
          features={allFeatures}
          news={newsFeed}
          selectedFeature={selectedFeature}
          onSelectFeature={handleSelectFeature}
          onCenterMap={(c) => {
            setMapCenter(c);
            setMapZoom(6.5);
          }}
        />
      </div>

      {/* 4. Country Intelligence Dossier Modal (Opens when clicking any country on the map) */}
      <CountryBriefModal
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
        onCenterMap={(c, z) => {
          setMapCenter(c);
          if (z) setMapZoom(z);
        }}
        relatedNews={countryNews}
        relatedAssets={countryAssets}
      />

      {/* 5. Tactical Command Palette (Cmd+K / Search) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCountry={(code, name) => handleSelectCountry({ code, name })}
        onSelectView={handleSelectView}
        onCenterMap={(c, z) => {
          setMapCenter(c);
          if (z) setMapZoom(z);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onToggleLayer={handleToggleLayer}
      />
    </div>
  );
};

export default App;
