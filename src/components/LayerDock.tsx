import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Shield,
  Zap,
  Globe2,
  Swords,
  Check
} from 'lucide-react';
import { LayerKey, LayerMetadata } from '../types';

interface LayerDockProps {
  activeLayers: Record<LayerKey, boolean>;
  onToggleLayer: (layer: LayerKey) => void;
  onSetAllLayers: (enabled: boolean) => void;
  counts: Record<LayerKey, number>;
}

export interface LayerCategoryDef {
  id: string;
  title: string;
  icon: string;
  accentColor: string;
  layerIds: LayerKey[];
}

export const LAYER_DEFINITIONS: LayerMetadata[] = [
  // 1. Kinetic & Conflict
  {
    id: 'iranAttacks',
    label: 'MIDDLE EAST STRIKES',
    shortLabel: 'STRIKES',
    icon: '🎯',
    color: '#f43f5e',
    description: 'Ballistic missile impacts, counter-battery operations, and air-launched precision strikes across the Levant and Middle East.'
  },
  {
    id: 'conflicts',
    label: 'CONFLICT ZONES',
    shortLabel: 'FRONTLINES',
    icon: '⚔️',
    color: '#f43f5e',
    description: 'Active frontline warfare boundary polygons, belligerents, and mechanized combat operations.'
  },
  {
    id: 'hotspots',
    label: 'INTEL HOTSPOTS',
    shortLabel: 'HOTSPOTS',
    icon: '🔥',
    color: '#fb7185',
    description: 'Active geopolitical flashpoints rated 1-5 escalation level with strategic assessments.'
  },
  {
    id: 'fortifiedBorders',
    label: 'FORTIFIED FRONTLINES',
    shortLabel: 'FORTIFIED',
    icon: '🚧',
    color: '#e11d48',
    description: 'High-readiness military borders, LoC/AGPL, LAC sectors, DMZ, and fortified trench networks.'
  },

  // 2. Military & Strategic
  {
    id: 'bases',
    label: 'MILITARY BASES',
    shortLabel: 'BASES',
    icon: '🏛️',
    color: '#38bdf8',
    description: 'US, NATO, Russian, Chinese, and Indian strategic garrisons, air wings, and naval commands.'
  },
  {
    id: 'nuclear',
    label: 'NUCLEAR SITES',
    shortLabel: 'NUCLEAR',
    icon: '☢️',
    color: '#f59e0b',
    description: 'Uranium enrichment complexes, weapons-grade reactors, and strategic nuclear storage depots.'
  },
  {
    id: 'military',
    label: 'STRATEGIC ASSETS',
    shortLabel: 'DEPLOYMENTS',
    icon: '✈️',
    color: '#06b6d4',
    description: 'Carrier strike groups, bombers, tankers, and maritime patrol aircraft deployments.'
  },
  {
    id: 'adizZones',
    label: 'AIR DEFENSE (ADIZ)',
    shortLabel: 'ADIZ',
    icon: '🌐',
    color: '#0ea5e9',
    description: 'Official national sovereign and maritime air defense identification zones and intercept sectors.'
  },
  {
    id: 'gpsJamming',
    label: 'ELECTRONIC WARFARE',
    shortLabel: 'EW/JAMMING',
    icon: '📡',
    color: '#22d3ee',
    description: 'Active GNSS degradation, spoofing corridors, and military electronic warfare arrays.'
  },

  // 3. Infrastructure & Environment
  {
    id: 'waterways',
    label: 'MARITIME CHOKEPOINTS',
    shortLabel: 'CHOKEPOINTS',
    icon: '⚓',
    color: '#10b981',
    description: 'Strategic shipping choke points: Hormuz, Malacca, Bab el-Mandeb, Suez, and Panama.'
  },
  {
    id: 'outages',
    label: 'GRID & CABLE OUTAGES',
    shortLabel: 'OUTAGES',
    icon: '⚡',
    color: '#818cf8',
    description: 'Undersea fiber cable severances, electrical grid blackouts, and telecom disruption zones.'
  },
  {
    id: 'weather',
    label: 'SEVERE WEATHER',
    shortLabel: 'WEATHER',
    icon: '🌪️',
    color: '#6366f1',
    description: 'Super typhoons, atmospheric rivers, bomb cyclones, and severe NOAA weather watches.'
  },
  {
    id: 'natural',
    label: 'EARTHQUAKES & VOLCANOES',
    shortLabel: 'HAZARDS',
    icon: '🌋',
    color: '#34d399',
    description: 'Live USGS real-time seismic telemetry and NASA EONET volcanic & fire anomalies.'
  },

  // 4. Geopolitical & Economics
  {
    id: 'economic',
    label: 'FINANCIAL CENTERS',
    shortLabel: 'FINANCIAL',
    icon: '💹',
    color: '#a78bfa',
    description: 'Global equity exchanges, foreign exchange trading hubs, and central reserve banks.'
  },
  {
    id: 'sanctions',
    label: 'SANCTIONS REGIMES',
    shortLabel: 'SANCTIONS',
    icon: '🚫',
    color: '#c084fc',
    description: 'Comprehensive OFAC, European Union, and United Nations international embargo regimes.'
  },
  {
    id: 'canadaAlerts',
    label: 'EMERGENCY BULLETINS',
    shortLabel: 'EMERGENCY',
    icon: '🍁',
    color: '#f472b6',
    description: 'Public safety emergency broadcasts, wildfire alerts, and civil evacuation orders.'
  }
];

export const CATEGORIES: LayerCategoryDef[] = [
  {
    id: 'kinetic',
    title: 'KINETIC & CONFLICT',
    icon: '⚔️',
    accentColor: '#f43f5e',
    layerIds: ['iranAttacks', 'conflicts', 'hotspots', 'fortifiedBorders']
  },
  {
    id: 'military',
    title: 'MILITARY & STRATEGIC',
    icon: '🛡️',
    accentColor: '#06b6d4',
    layerIds: ['bases', 'nuclear', 'military', 'adizZones', 'gpsJamming']
  },
  {
    id: 'infra',
    title: 'INFRASTRUCTURE & ENVIRONMENT',
    icon: '⚡',
    accentColor: '#10b981',
    layerIds: ['waterways', 'outages', 'weather', 'natural']
  },
  {
    id: 'geo',
    title: 'GEOPOLITICAL & ECONOMICS',
    icon: '🌐',
    accentColor: '#8b5cf6',
    layerIds: ['economic', 'sanctions', 'canadaAlerts']
  }
];

export const LayerDock: React.FC<LayerDockProps> = ({
  activeLayers,
  onToggleLayer,
  onSetAllLayers,
  counts
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [infoExpandedId, setInfoExpandedId] = useState<LayerKey | null>(null);

  // Accordion state: categories can be expanded or collapsed
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const toggleCategoryCollapse = (catId: string) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [catId]: !prev[catId]
    }));
  };

  const activeCount = Object.values(activeLayers).filter(Boolean).length;
  const totalLayers = LAYER_DEFINITIONS.length;

  const layerMap = useMemo(() => {
    const map = new Map<LayerKey, LayerMetadata>();
    LAYER_DEFINITIONS.forEach((l) => map.set(l.id, l));
    return map;
  }, []);

  // Filtered categories based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) {
      return CATEGORIES.map((cat) => ({
        ...cat,
        layers: cat.layerIds.map((id) => layerMap.get(id)!).filter(Boolean)
      }));
    }

    const q = searchQuery.toLowerCase();
    return CATEGORIES.map((cat) => {
      const matched = cat.layerIds
        .map((id) => layerMap.get(id)!)
        .filter(
          (l) =>
            l &&
            (l.label.toLowerCase().includes(q) ||
              l.shortLabel.toLowerCase().includes(q) ||
              l.description.toLowerCase().includes(q) ||
              cat.title.toLowerCase().includes(q))
        );
      return {
        ...cat,
        layers: matched
      };
    }).filter((c) => c.layers.length > 0);
  }, [searchQuery, layerMap]);

  // When completely collapsed, show a sleek tactical pill on the map
  if (!isOpen) {
    return (
      <div
        className="select-none z-20"
        style={{
          position: 'absolute',
          top: '84px',
          left: '44px'
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-2.5 py-1.2 rounded-[6px] text-slate-200 font-mono text-xs shadow-xl transition-all group border border-white/10 hover:border-sky-500/50"
          style={{
            background: 'rgba(13, 19, 30, 0.84)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
          title="Open Tactical Layer Matrix"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          <span className="font-bold tracking-wider uppercase text-[11px]">LAYERS</span>
          <span className="text-[9.5px] px-1 py-0.2 rounded bg-white/5 text-slate-400 font-bold border border-white/10">
            {activeCount}/{totalLayers}
          </span>
          <ChevronDown size={11} className="text-slate-400 group-hover:text-sky-400 transition-colors" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="z-20 select-none font-mono text-xs overflow-hidden flex flex-col animate-fade-in transition-all shadow-2xl"
      style={{
        position: 'absolute',
        top: '84px',
        left: '44px',
        width: '240px',
        maxHeight: 'calc(100vh - 110px)',
        background: 'rgba(13, 19, 30, 0.84)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Header Bar: Title, Active Counter & Minimize */}
      <div
        onClick={() => setIsOpen(false)}
        className="flex items-center justify-between cursor-pointer hover:bg-white/[0.04] transition-colors"
        style={{
          padding: '6px 10px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
        title="Click to collapse Layer Matrix"
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[10.5px] font-bold text-slate-200 tracking-wider">
            TACTICAL LAYERS
          </span>
          <span className="text-[9.5px] px-1.5 py-0.2 rounded bg-sky-500/10 border border-sky-500/25 text-sky-400 font-bold font-mono">
            {activeCount}/{totalLayers}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          <ChevronUp size={12} className="hover:text-white" />
        </div>
      </div>

      {/* 2. Search & Bulk Actions Bar */}
      <div
        className="space-y-1.5"
        style={{
          padding: '6px 10px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}
      >
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded border border-white/10 bg-white/[0.03] transition-colors focus-within:border-sky-500/50"
        >
          <Search size={11} className="text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter matrix..."
            className="w-full bg-transparent border-none text-[10.5px] text-slate-200 placeholder:text-slate-500 focus:outline-none font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-400 hover:text-white shrink-0 ml-1"
            >
              <X size={10} />
            </button>
          )}
        </div>

        {/* Quick Bulk Action Links */}
        <div className="flex items-center justify-between text-[9px] text-slate-400 px-0.5">
          <span className="uppercase tracking-wider font-sans font-semibold">Bulk:</span>
          <div className="flex items-center gap-1.5 font-mono">
            <button
              onClick={() => onSetAllLayers(true)}
              className="hover:text-emerald-400 transition-colors uppercase font-bold"
            >
              Select All
            </button>
            <span>•</span>
            <button
              onClick={() => onSetAllLayers(false)}
              className="hover:text-rose-400 transition-colors uppercase font-bold"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Categorized Layer List with Collapsible Accordions */}
      <div className="overflow-y-auto layers-scrollbar py-0.5 flex-1 space-y-0.5">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-mono">
            No matching layers found
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const isCatCollapsed = !!collapsedCategories[cat.id];
            const catActiveCount = cat.layers.filter((l) => !!activeLayers[l.id]).length;

            return (
              <div
                key={cat.id}
                className="border-b border-white/[0.04] last:border-b-0"
              >
                {/* Category Header with single-line guarantee (nowrap) */}
                <div
                  onClick={() => toggleCategoryCollapse(cat.id)}
                  className="flex items-center justify-between cursor-pointer hover:bg-white/[0.03] transition-colors"
                  style={{
                    padding: '4px 10px',
                    boxSizing: 'border-box',
                    background: 'rgba(255, 255, 255, 0.04)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div className="flex items-center gap-1.5 min-w-0 pr-1">
                    <span className="text-[11px] shrink-0">{cat.icon}</span>
                    <span
                      className="text-[9.5px] font-bold tracking-wider text-slate-200 truncate uppercase"
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {cat.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <span
                      className="text-[8.5px] px-1 py-0.2 rounded font-mono font-bold"
                      style={{
                        backgroundColor: `${cat.accentColor}18`,
                        color: cat.accentColor,
                        border: `1px solid ${cat.accentColor}33`
                      }}
                    >
                      {catActiveCount}/{cat.layers.length}
                    </span>
                    <span className="text-[9px] text-slate-400">
                      {isCatCollapsed ? '▶' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Category Layer Rows with tight 3px 10px padding */}
                {!isCatCollapsed && (
                  <div className="divide-y divide-white/[0.03]">
                    {cat.layers.map((layer) => {
                      const isActive = !!activeLayers[layer.id];
                      const count = counts[layer.id];
                      const isInfoOpen = infoExpandedId === layer.id;

                      return (
                        <div key={layer.id} className="group">
                          <div
                            onClick={() => onToggleLayer(layer.id)}
                            className={`flex items-center justify-between hover:bg-white/[0.04] cursor-pointer transition-colors ${
                              isActive ? 'bg-transparent' : 'opacity-60'
                            }`}
                            style={{
                              padding: '3px 10px',
                              height: '22px',
                              boxSizing: 'border-box',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {/* Left: Custom Tactical Checkbox + Status Dot + Label */}
                            <div className="flex items-center gap-2 min-w-0 pr-1 overflow-hidden">
                              {/* Tactical Checkbox with Layer Accent Border/Background */}
                              <div
                                className="w-3 h-3 rounded-[2px] flex items-center justify-center shrink-0 transition-all border"
                                style={{
                                  backgroundColor: isActive ? layer.color : 'rgba(255, 255, 255, 0.05)',
                                  borderColor: isActive ? layer.color : 'rgba(255, 255, 255, 0.15)',
                                  boxShadow: isActive ? `0 0 6px ${layer.color}66` : undefined
                                }}
                              >
                                {isActive && <Check size={8} strokeWidth={3.5} className="text-slate-950" />}
                              </div>

                              {/* Semantic Status Indicator Dot */}
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{
                                  backgroundColor: layer.color,
                                  boxShadow: isActive ? `0 0 6px ${layer.color}` : 'none'
                                }}
                              />

                              {/* Layer Name */}
                              <span
                                className={`truncate text-[10.5px] font-mono tracking-wide ${
                                  isActive ? 'text-slate-100 font-semibold' : 'text-slate-300'
                                }`}
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                {layer.label}
                              </span>

                              {/* Count Badge */}
                              {typeof count === 'number' && count > 0 && (
                                <span className="text-[9px] text-slate-400 font-mono shrink-0">
                                  ({count})
                                </span>
                              )}
                            </div>

                            {/* Right: Tiny Muted Borderless (i) Glyph */}
                            <div className="flex items-center shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInfoExpandedId(isInfoOpen ? null : layer.id);
                                }}
                                className="w-3.5 h-3.5 flex items-center justify-center text-[10px] font-serif transition-colors hover:text-[#38BDF8]"
                                style={{
                                  color: isInfoOpen ? '#38BDF8' : 'rgba(148, 163, 184, 0.35)',
                                  background: 'transparent',
                                  border: 'none',
                                  padding: 0
                                }}
                                title="Inspect Layer Metadata"
                              >
                                i
                              </button>
                            </div>
                          </div>

                          {/* Collapsible Info Drawer under row */}
                          {isInfoOpen && (
                            <div
                              className="text-[10px] space-y-1 font-sans leading-relaxed animate-fade-in"
                              style={{
                                padding: '6px 10px',
                                boxSizing: 'border-box',
                                background: 'rgba(0, 0, 0, 0.3)',
                                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                color: '#94A3B8'
                              }}
                            >
                              <p>{layer.description}</p>
                              <div
                                className="flex items-center justify-between text-[8.5px] font-mono pt-1"
                                style={{
                                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                                  color: '#64748B'
                                }}
                              >
                                <span>KEY: {layer.id}</span>
                                <span style={{ color: layer.color }}>● ACCENT {layer.color}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 4. Footer Branding */}
      <div
        className="flex items-center justify-between text-[9px] font-mono"
        style={{
          padding: '4px 10px',
          background: 'rgba(255, 255, 255, 0.02)',
          borderTop: '1px solid rgba(255, 255, 255, 0.04)',
          color: '#38bdf8'
        }}
      >
        <span className="truncate">© MANEKSHAW.VISION</span>
        <span style={{ color: '#64748B' }}>GEOINT v1.5</span>
      </div>
    </div>
  );
};
