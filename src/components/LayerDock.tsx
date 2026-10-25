import React, { useState, useMemo } from 'react';
import {
  Layers,
  ChevronUp,
  ChevronDown,
  Search,
  Check,
  X,
  SlidersHorizontal,
  Eye,
  EyeOff,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { LayerKey, LayerMetadata } from '../types';

interface LayerDockProps {
  activeLayers: Record<LayerKey, boolean>;
  onToggleLayer: (layer: LayerKey) => void;
  onSetAllLayers: (enabled: boolean) => void;
  counts: Record<LayerKey, number>;
}

export interface LayerCategory {
  id: 'conflict' | 'defense' | 'infra' | 'hazards' | 'economics';
  title: string;
  icon: string;
  layerIds: LayerKey[];
}

export const LAYER_DEFINITIONS: LayerMetadata[] = [
  // Conflict & Strikes
  {
    id: 'iranAttacks',
    label: 'Middle East Precision Strikes',
    shortLabel: 'Strikes',
    icon: '🎯',
    color: '#ef4444',
    description: 'Ballistic missile impacts, counter-battery operations, and air-launched precision strikes.'
  },
  {
    id: 'hotspots',
    label: 'Geopolitical Flashpoints',
    shortLabel: 'Hotspots',
    icon: '🔥',
    color: '#f97316',
    description: 'Geopolitical flashpoints rated 1-5 escalation level with strategic analysis.'
  },
  {
    id: 'conflicts',
    label: 'Active Warfare Frontlines',
    shortLabel: 'Frontlines',
    icon: '⚔️',
    color: '#dc2626',
    description: 'Active theater warfare boundary polygons, belligerents, and frontline positions.'
  },
  {
    id: 'fortifiedBorders',
    label: 'Fortified Frontlines & Demarcations',
    shortLabel: 'Fortifications',
    icon: '🚧',
    color: '#f59e0b',
    description: 'High-readiness military borders, LoC/AGPL, LAC sectors, DMZ, and fortified trench networks.'
  },

  // Defense & Strategic
  {
    id: 'bases',
    label: 'Major Military Bases',
    shortLabel: 'Bases',
    icon: '🛡️',
    color: '#3b82f6',
    description: 'US, NATO, Russian, Chinese, and Indian strategic installations.'
  },
  {
    id: 'nuclear',
    label: 'Nuclear & Enrichment Sites',
    shortLabel: 'Nuclear',
    icon: '☢️',
    color: '#eab308',
    description: 'Uranium enrichment plants, weapons-grade reactors, and storage complexes.'
  },
  {
    id: 'adizZones',
    label: 'Air Defense Identification Zones (ADIZ)',
    shortLabel: 'ADIZ Airspace',
    icon: '🌐',
    color: '#38bdf8',
    description: 'Official national sovereign and maritime air defense identification zones and intercept sectors.'
  },
  {
    id: 'gpsJamming',
    label: 'Electronic Warfare & GPS Jamming',
    shortLabel: 'EW & Jamming',
    icon: '📡',
    color: '#06b6d4',
    description: 'Active GNSS degradation, spoofing corridors, and military electronic warfare arrays.'
  },
  {
    id: 'military',
    label: 'Fleet & Strategic Air Vectors',
    shortLabel: 'Deployments',
    icon: '✈️',
    color: '#06b6d4',
    description: 'Carrier strike groups, bombers, and maritime patrol aircraft.'
  },
  {
    id: 'waterways',
    label: 'Maritime Chokepoints',
    shortLabel: 'Chokepoints',
    icon: '⚓',
    color: '#14b8a6',
    description: 'Strategic shipping choke points: Hormuz, Malacca, Bab el-Mandeb, Suez, Panama.'
  },

  // Critical Infrastructure
  {
    id: 'outages',
    label: 'Grid & Undersea Cable Outages',
    shortLabel: 'Outages',
    icon: '⚡',
    color: '#a855f7',
    description: 'Undersea optical cable severances, electrical grid blackouts, and telecom cuts.'
  },

  // Hazards & Weather
  {
    id: 'weather',
    label: 'Severe Weather (NOAA/NWS)',
    shortLabel: 'Weather',
    icon: '🌪️',
    color: '#60a5fa',
    description: 'Super typhoons, atmospheric rivers, bomb cyclones, and severe storm warnings.'
  },
  {
    id: 'canadaAlerts',
    label: 'Emergency Alert Bulletins',
    shortLabel: 'Emergency',
    icon: '🍁',
    color: '#f43f5e',
    description: 'Public safety emergencies, flood advisories, and wildfire watches.'
  },
  {
    id: 'natural',
    label: 'Earthquakes & Volcanoes',
    shortLabel: 'Natural Hazards',
    icon: '🌋',
    color: '#ea580c',
    description: 'Live USGS real-time seismic telemetry and NASA EONET volcanic & fire hazards.'
  },

  // Geo-Economics
  {
    id: 'economic',
    label: 'Global Financial & Supply Centers',
    shortLabel: 'Financial',
    icon: '💹',
    color: '#10b981',
    description: 'Global equity exchanges, foreign exchange hubs, and central banks.'
  },
  {
    id: 'sanctions',
    label: 'Sanctions Regimes & Embargoes',
    shortLabel: 'Sanctions',
    icon: '🚫',
    color: '#ec4899',
    description: 'Comprehensive OFAC, EU, and UN international economic sanctions regimes.'
  }
];

const CATEGORIES: LayerCategory[] = [
  {
    id: 'conflict',
    title: 'Strikes & Conflicts',
    icon: '⚔️',
    layerIds: ['iranAttacks', 'hotspots', 'conflicts', 'fortifiedBorders']
  },
  {
    id: 'defense',
    title: 'Defense & Strategic',
    icon: '🛡️',
    layerIds: ['bases', 'nuclear', 'adizZones', 'gpsJamming', 'military', 'waterways']
  },
  {
    id: 'infra',
    title: 'Critical Infrastructure',
    icon: '⚡',
    layerIds: ['outages']
  },
  {
    id: 'hazards',
    title: 'Hazards & Weather',
    icon: '⚠️',
    layerIds: ['weather', 'canadaAlerts', 'natural']
  },
  {
    id: 'economics',
    title: 'Geo-Economics',
    icon: '🌐',
    layerIds: ['economic', 'sanctions']
  }
];

export const LayerDock: React.FC<LayerDockProps> = ({
  activeLayers,
  onToggleLayer,
  onSetAllLayers,
  counts
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCount = Object.values(activeLayers).filter(Boolean).length;
  const totalLayers = LAYER_DEFINITIONS.length;

  // Toggle category
  const toggleCategory = (cat: LayerCategory) => {
    const allActive = cat.layerIds.every((id) => activeLayers[id]);
    cat.layerIds.forEach((id) => {
      if (allActive) {
        if (activeLayers[id]) onToggleLayer(id);
      } else {
        if (!activeLayers[id]) onToggleLayer(id);
      }
    });
  };

  // Quick Preset Handlers
  const handleApplyPreset = (preset: 'all' | 'none' | 'war' | 'strategic') => {
    if (preset === 'all') {
      onSetAllLayers(true);
    } else if (preset === 'none') {
      onSetAllLayers(false);
    } else if (preset === 'war') {
      const warKeys: LayerKey[] = ['iranAttacks', 'hotspots', 'conflicts', 'military'];
      LAYER_DEFINITIONS.forEach((l) => {
        const shouldBeActive = warKeys.includes(l.id);
        if (!!activeLayers[l.id] !== shouldBeActive) onToggleLayer(l.id);
      });
    } else if (preset === 'strategic') {
      const stratKeys: LayerKey[] = ['bases', 'nuclear', 'waterways', 'economic', 'sanctions'];
      LAYER_DEFINITIONS.forEach((l) => {
        const shouldBeActive = stratKeys.includes(l.id);
        if (!!activeLayers[l.id] !== shouldBeActive) onToggleLayer(l.id);
      });
    }
  };

  // Minimized corner button
  if (isMinimized) {
    return (
      <div className="absolute bottom-5 left-5 z-20 pointer-events-auto">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-sky-500/50 text-[var(--text-primary)] text-xs font-mono shadow-2xl backdrop-blur-md transition-all group"
        >
          <Layers size={14} className="text-sky-400 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold tracking-wide">LAYERS</span>
          <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {activeCount}/{totalLayers}
          </span>
          <ChevronUp size={14} className="text-[var(--text-muted)]" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[94vw] pointer-events-none select-none">
      <div className="pointer-events-auto flex flex-col items-center">
        {/* Expanded Panel (Folds Out Upwards cleanly) */}
        {isExpanded && (
          <div className="mb-2.5 w-full max-w-4xl p-4 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] shadow-2xl backdrop-blur-2xl animate-fade-in text-[var(--text-primary)]">
            {/* Header of expanded menu */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-[var(--border-subtle)] font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <SlidersHorizontal size={15} className="text-sky-400" />
                <span className="font-bold tracking-wider uppercase text-[var(--text-primary)]">
                  Tactical Layer Control
                </span>
                <span className="text-[var(--text-muted)] text-[11px]">
                  ({activeCount} of {totalLayers} active)
                </span>
              </div>

              {/* Quick Presets & Search */}
              <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                <div className="relative">
                  <Search size={12} className="absolute left-2.5 top-2.5 text-[var(--text-muted)]" />
                  <input
                    type="text"
                    placeholder="Filter layers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-lg pl-7 pr-2 py-1 text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-sky-500 font-sans w-32 sm:w-36"
                  />
                </div>

                <div className="flex items-center gap-1 bg-[var(--bg-surface-elevated)] rounded-lg p-0.5 border border-[var(--border-subtle)] text-[10px]">
                  <button
                    onClick={() => handleApplyPreset('all')}
                    className="px-2 py-1 rounded hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleApplyPreset('war')}
                    className="px-2 py-1 rounded hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    War Focus
                  </button>
                  <button
                    onClick={() => handleApplyPreset('strategic')}
                    className="px-2 py-1 rounded hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    Defense
                  </button>
                  <button
                    onClick={() => handleApplyPreset('none')}
                    className="px-2 py-1 rounded hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-red-400 transition-colors"
                  >
                    Reset
                  </button>
                </div>

                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors ml-1"
                  title="Close Expanded Panel"
                >
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Grid of Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
              {CATEGORIES.map((cat) => {
                const catActiveCount = cat.layerIds.filter((id) => activeLayers[id]).length;
                const isAllCatActive = catActiveCount === cat.layerIds.length;

                const filteredLayerIds = cat.layerIds.filter((id) => {
                  if (!searchQuery.trim()) return true;
                  const meta = LAYER_DEFINITIONS.find((l) => l.id === id)!;
                  return (
                    meta.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    meta.shortLabel.toLowerCase().includes(searchQuery.toLowerCase())
                  );
                });

                if (filteredLayerIds.length === 0) return null;

                return (
                  <div
                    key={cat.id}
                    className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-[var(--border-subtle)] font-mono text-[11px]">
                      <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5 truncate">
                        <span>{cat.icon}</span>
                        <span className="truncate">{cat.title.split(' ')[0]}</span>
                      </span>
                      <button
                        onClick={() => toggleCategory(cat)}
                        className={`text-[9px] px-1.5 py-0.5 rounded transition-colors font-bold ${
                          isAllCatActive
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : 'bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                        }`}
                      >
                        {isAllCatActive ? 'ALL ON' : `${catActiveCount}/${cat.layerIds.length}`}
                      </button>
                    </div>

                    <div className="space-y-1">
                      {filteredLayerIds.map((layerId) => {
                        const meta = LAYER_DEFINITIONS.find((l) => l.id === layerId)!;
                        const isActive = !!activeLayers[layerId];
                        const count = counts[layerId] || 0;

                        return (
                          <button
                            key={layerId}
                            onClick={() => onToggleLayer(layerId)}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-mono transition-all text-left ${
                              isActive
                                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-medium border border-[var(--border-subtle)] shadow-xs'
                                : 'bg-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="w-2 h-2 rounded-full shrink-0 transition-transform"
                                style={{
                                  backgroundColor: isActive ? meta.color : '#64748b',
                                  boxShadow: isActive ? `0 0 6px ${meta.color}` : 'none'
                                }}
                              />
                              <span className="truncate">{meta.shortLabel}</span>
                            </div>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                                isActive
                                  ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                                  : 'text-[var(--text-muted)]'
                              }`}
                            >
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Compact HUD Bar (Modern Floating Island) */}
        <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] shadow-2xl backdrop-blur-xl transition-all">
          {/* Main Layers Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] text-xs font-mono font-semibold transition-all group shadow-xs"
          >
            <Layers size={14} className="text-sky-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">LAYERS</span>
            <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {activeCount}
            </span>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          <div className="h-4 w-px bg-[var(--border-subtle)] mx-0.5" />

          {/* Quick Category Toggles (Fast 1-click filtering) */}
          <div className="flex items-center gap-1">
            {CATEGORIES.map((cat) => {
              const catActiveCount = cat.layerIds.filter((id) => activeLayers[id]).length;
              const isSomeActive = catActiveCount > 0;
              const isAllActive = catActiveCount === cat.layerIds.length;

              return (
                <button
                  key={cat.id}
                  onClick={() => toggleCategory(cat)}
                  title={`${cat.title} (${catActiveCount}/${cat.layerIds.length} active)`}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-mono transition-all ${
                    isAllActive
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/35 font-semibold'
                      : isSomeActive
                      ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)]'
                      : 'bg-transparent text-[var(--text-muted)] border border-transparent hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span className="hidden md:inline text-[11px]">{cat.title.split(' ')[0]}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-full ${
                      isSomeActive ? 'text-sky-400 font-bold' : 'text-[var(--text-muted)]'
                    }`}
                  >
                    {catActiveCount}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-[var(--border-subtle)] mx-0.5" />

          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize to Corner"
            className="p-1.5 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            <EyeOff size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
