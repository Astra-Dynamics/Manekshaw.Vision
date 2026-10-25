import React, { useState } from 'react';
import {
  Layers,
  ChevronUp,
  ChevronDown,
  Shield,
  Flame,
  AlertTriangle,
  Globe2,
  Check,
  X,
  SlidersHorizontal,
  Eye,
  EyeOff
} from 'lucide-react';
import { LayerKey, LayerMetadata } from '../types';

interface LayerDockProps {
  activeLayers: Record<LayerKey, boolean>;
  onToggleLayer: (layer: LayerKey) => void;
  onSetAllLayers: (enabled: boolean) => void;
  counts: Record<LayerKey, number>;
}

export interface LayerCategory {
  id: 'conflict' | 'defense' | 'hazards' | 'economics';
  title: string;
  icon: string;
  layerIds: LayerKey[];
}

export const LAYER_DEFINITIONS: LayerMetadata[] = [
  // Conflict & Strikes
  {
    id: 'iranAttacks',
    label: 'Middle East Strikes',
    shortLabel: 'Strikes',
    icon: '🎯',
    color: '#ef4444',
    description: 'Ballistic missile impacts, counter-battery operations, and air-launched precision strikes.'
  },
  {
    id: 'hotspots',
    label: 'Intel Hotspots',
    shortLabel: 'Hotspots',
    icon: '🔥',
    color: '#f97316',
    description: 'Geopolitical flashpoints rated 1-5 escalation level with strategic analysis.'
  },
  {
    id: 'conflicts',
    label: 'Frontline Conflicts',
    shortLabel: 'Frontlines',
    icon: '⚔️',
    color: '#dc2626',
    description: 'Active theater warfare boundary polygons, belligerents, and frontline positions.'
  },

  // Defense & Strategic
  {
    id: 'bases',
    label: 'Military Bases',
    shortLabel: 'Bases',
    icon: '🛡️',
    color: '#3b82f6',
    description: 'US, NATO, Russian, Chinese, and Indian strategic installations.'
  },
  {
    id: 'nuclear',
    label: 'Nuclear Sites',
    shortLabel: 'Nuclear',
    icon: '☢️',
    color: '#eab308',
    description: 'Uranium enrichment plants, weapons-grade reactors, and storage complexes.'
  },
  {
    id: 'military',
    label: 'Fleet & Air Vectors',
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

  // Hazards & Grid
  {
    id: 'weather',
    label: 'Severe Weather',
    shortLabel: 'Weather',
    icon: '🌪️',
    color: '#60a5fa',
    description: 'Super typhoons, atmospheric rivers, bomb cyclones, and severe storm warnings.'
  },
  {
    id: 'canadaAlerts',
    label: 'Canada Alerts',
    shortLabel: 'Canada',
    icon: '🍁',
    color: '#f43f5e',
    description: 'Canadian public safety emergencies, flood advisories, and wildfire watches.'
  },
  {
    id: 'outages',
    label: 'Grid & Cable Outages',
    shortLabel: 'Outages',
    icon: '⚡',
    color: '#a855f7',
    description: 'Undersea optical cable severances, electrical grid blackouts, and telecom cuts.'
  },
  {
    id: 'natural',
    label: 'Earthquakes & Volcanoes',
    shortLabel: 'Natural',
    icon: '🌋',
    color: '#ea580c',
    description: 'Live USGS real-time seismic telemetry and NASA EONET volcanic & fire hazards.'
  },

  // Geo-Economics
  {
    id: 'economic',
    label: 'Financial Centers',
    shortLabel: 'Financial',
    icon: '💹',
    color: '#10b981',
    description: 'Global equity exchanges, foreign exchange hubs, and central banks.'
  },
  {
    id: 'sanctions',
    label: 'Sanctions Regimes',
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
    layerIds: ['iranAttacks', 'hotspots', 'conflicts']
  },
  {
    id: 'defense',
    title: 'Defense & Strategic',
    icon: '🛡️',
    layerIds: ['bases', 'nuclear', 'military', 'waterways']
  },
  {
    id: 'hazards',
    title: 'Hazards & Infrastructure',
    icon: '⚠️',
    layerIds: ['weather', 'canadaAlerts', 'outages', 'natural']
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

  const activeCount = Object.values(activeLayers).filter(Boolean).length;
  const totalLayers = LAYER_DEFINITIONS.length;

  // Toggle all layers within a specific category
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

  // Minimized Floating Pill in bottom-left corner
  if (isMinimized) {
    return (
      <div className="absolute bottom-5 left-5 z-20 pointer-events-auto">
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#090d14]/90 hover:bg-slate-900 border border-slate-800 hover:border-sky-500/50 text-slate-200 text-xs font-mono shadow-2xl backdrop-blur-md transition-all group"
        >
          <Layers size={14} className="text-sky-400 group-hover:rotate-12 transition-transform" />
          <span className="font-semibold tracking-wide">LAYERS</span>
          <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
            {activeCount}/{totalLayers}
          </span>
          <ChevronUp size={14} className="text-slate-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 w-auto max-w-[94vw] pointer-events-none select-none">
      <div className="pointer-events-auto flex flex-col items-center">
        {/* Expanded Panel (Folds Out Upwards cleanly) */}
        {isExpanded && (
          <div className="mb-2 w-full max-w-4xl p-4 rounded-2xl bg-[#080c14]/95 border border-slate-800/90 shadow-2xl backdrop-blur-2xl animate-fade-in text-slate-100">
            {/* Header of expanded menu */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80 font-mono text-xs">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-sky-400" />
                <span className="font-bold tracking-wider uppercase text-slate-200">
                  Tactical Layer Filters
                </span>
                <span className="text-slate-500 text-[11px]">
                  ({activeCount} of {totalLayers} active)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSetAllLayers(true)}
                  className="px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-[11px] transition-colors"
                >
                  Enable All
                </button>
                <button
                  onClick={() => onSetAllLayers(false)}
                  className="px-2.5 py-1 rounded-md bg-slate-800/90 hover:bg-slate-700 text-slate-400 text-[11px] transition-colors"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-slate-200 ml-1 transition-colors"
                  title="Close Expanded View"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {/* Grid of Categories */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {CATEGORIES.map((cat) => {
                const catActiveCount = cat.layerIds.filter((id) => activeLayers[id]).length;
                const isAllCatActive = catActiveCount === cat.layerIds.length;

                return (
                  <div
                    key={cat.id}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-slate-800/60 font-mono text-[11px]">
                      <span className="font-bold text-slate-300 flex items-center gap-1.5">
                        <span>{cat.icon}</span>
                        <span>{cat.title}</span>
                      </span>
                      <button
                        onClick={() => toggleCategory(cat)}
                        className={`text-[9px] px-1.5 py-0.5 rounded transition-colors ${
                          isAllCatActive
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {isAllCatActive ? 'ALL ON' : `${catActiveCount}/${cat.layerIds.length}`}
                      </button>
                    </div>

                    <div className="space-y-1">
                      {cat.layerIds.map((layerId) => {
                        const meta = LAYER_DEFINITIONS.find((l) => l.id === layerId)!;
                        const isActive = !!activeLayers[layerId];
                        const count = counts[layerId] || 0;

                        return (
                          <button
                            key={layerId}
                            onClick={() => onToggleLayer(layerId)}
                            className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-mono transition-all text-left ${
                              isActive
                                ? 'bg-slate-800/90 text-slate-100 font-medium border border-slate-700/80'
                                : 'bg-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/40'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{
                                  backgroundColor: isActive ? meta.color : '#475569',
                                  boxShadow: isActive ? `0 0 6px ${meta.color}` : 'none'
                                }}
                              />
                              <span className="truncate">{meta.shortLabel}</span>
                            </div>
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-semibold ${
                                isActive
                                  ? 'bg-slate-700 text-slate-200'
                                  : 'text-slate-600'
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

        {/* Compact HUD Bar (Modern Floating Capsule) */}
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-[#090d14]/90 border border-slate-800 hover:border-slate-700/80 shadow-2xl backdrop-blur-xl transition-all">
          {/* Main Layers Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 text-xs font-mono font-semibold transition-all group"
          >
            <Layers size={14} className="text-sky-400 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">LAYERS</span>
            <span className="bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {activeCount}
            </span>
            {isExpanded ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </button>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

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
                      ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30 font-semibold'
                      : isSomeActive
                      ? 'bg-slate-800/70 text-slate-200 border border-slate-700'
                      : 'bg-slate-900/40 text-slate-500 border border-transparent hover:text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <span className="text-xs">{cat.icon}</span>
                  <span className="hidden md:inline text-[11px]">{cat.title.split(' ')[0]}</span>
                  <span
                    className={`text-[9px] px-1 py-0.2 rounded-full ${
                      isSomeActive ? 'text-sky-400' : 'text-slate-600'
                    }`}
                  >
                    {catActiveCount}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="h-4 w-px bg-slate-800 mx-0.5" />

          {/* Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            title="Minimize to Corner"
            className="p-1.5 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-colors"
          >
            <EyeOff size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};
