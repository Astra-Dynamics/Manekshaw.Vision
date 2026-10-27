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
          top: '56px',
          left: '48px'
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-[2px] text-[var(--text-primary)] font-mono text-xs shadow-xl transition-all group border hover:border-sky-500/60"
          style={{
            background: 'var(--bg-surface)',
            borderColor: 'var(--border-medium)'
          }}
          title="Open Tactical Layer Matrix"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
          <span className="font-bold tracking-wider uppercase text-xs">LAYERS</span>
          <span
            className="text-[10px] px-1.5 py-0.2 rounded-[2px] font-bold border"
            style={{
              background: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-subtle)',
              color: 'var(--text-muted)'
            }}
          >
            {activeCount}/{totalLayers}
          </span>
          <ChevronDown size={12} className="text-[var(--text-muted)] group-hover:text-sky-500 transition-colors" />
        </button>
      </div>
    );
  }

  return (
    <div
      className="z-20 select-none font-mono text-xs overflow-hidden flex flex-col max-h-[calc(100vh-72px)] animate-fade-in transition-all shadow-2xl relative"
      style={{
        position: 'absolute',
        top: '56px',
        left: '48px',
        width: '310px',
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-medium)',
        borderRadius: '3px',
        boxSizing: 'border-box'
      }}
    >
      {/* Corner Bracket Accents */}
      <span className="bracket-tl" />
      <span className="bracket-tr" />
      <span className="bracket-bl" />
      <span className="bracket-br" />

      {/* 1. Header Bar: Title, Active Counter & Minimize */}
      <div
        onClick={() => setIsOpen(false)}
        className="flex items-center justify-between cursor-pointer transition-colors"
        style={{
          padding: '10px 14px',
          background: 'var(--bg-surface-subtle)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
        title="Click to collapse Layer Matrix"
      >
        <div className="flex items-center gap-2">
          <span className="hud-micro-header font-bold" style={{ color: 'var(--text-primary)' }}>
            TACTICAL LAYERS
          </span>
          <span
            className="text-[10px] px-1.5 py-0.2 rounded-[2px] font-bold font-mono border"
            style={{
              background: 'rgba(14, 165, 233, 0.12)',
              borderColor: 'rgba(14, 165, 233, 0.3)',
              color: '#0284c7'
            }}
          >
            {activeCount}/{totalLayers}
          </span>
        </div>

        <div className="flex items-center gap-1.5" style={{ color: 'var(--text-muted)' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_#10b981]" />
          <ChevronUp size={13} className="hover:text-[var(--text-primary)]" />
        </div>
      </div>

      {/* 2. Search & Bulk Actions Bar */}
      <div
        className="space-y-2"
        style={{
          padding: '10px 14px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-[2px] border transition-colors focus-within:border-sky-500"
          style={{
            background: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          <Search size={12} className="shrink-0" style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter matrix layers..."
            className="w-full bg-transparent border-none text-[11px] placeholder:text-[var(--text-muted)] focus:outline-none font-mono"
            style={{ color: 'var(--text-primary)' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="hover:text-[var(--text-primary)] shrink-0 ml-1"
              style={{ color: 'var(--text-muted)' }}
            >
              <X size={11} />
            </button>
          )}
        </div>

        {/* Quick Bulk Action Links */}
        <div className="flex items-center justify-between text-[10px] px-0.5" style={{ color: 'var(--text-muted)' }}>
          <span className="uppercase tracking-wider text-[9px] font-sans font-semibold">Bulk Actions:</span>
          <div className="flex items-center gap-2 font-mono">
            <button
              onClick={() => onSetAllLayers(true)}
              className="hover:text-emerald-500 transition-colors uppercase font-bold"
            >
              Select All
            </button>
            <span>•</span>
            <button
              onClick={() => onSetAllLayers(false)}
              className="hover:text-rose-500 transition-colors uppercase font-bold"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Categorized Layer List with Collapsible Accordions */}
      <div className="overflow-y-auto layers-scrollbar py-1 flex-1 space-y-1">
        {filteredCategories.length === 0 ? (
          <div className="text-center py-8 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
            No matching layers found
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const isCatCollapsed = !!collapsedCategories[cat.id];
            const catActiveCount = cat.layers.filter((l) => !!activeLayers[l.id]).length;

            return (
              <div
                key={cat.id}
                className="last:border-b-0"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}
              >
                {/* Category Header with 14px padding */}
                <div
                  onClick={() => toggleCategoryCollapse(cat.id)}
                  className="flex items-center justify-between cursor-pointer transition-colors"
                  style={{
                    padding: '6px 14px',
                    boxSizing: 'border-box',
                    background: 'var(--category-header-bg)',
                    color: 'var(--category-header-text)'
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs">{cat.icon}</span>
                    <span className="hud-micro-header text-[10px] font-bold" style={{ color: 'var(--category-header-text)' }}>
                      {cat.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-[9px] px-1.5 py-0.2 rounded-[2px] font-mono font-bold"
                      style={{
                        backgroundColor: `${cat.accentColor}18`,
                        color: cat.accentColor,
                        border: `1px solid ${cat.accentColor}33`
                      }}
                    >
                      {catActiveCount}/{cat.layers.length}
                    </span>
                    <span className="text-[10px]" style={{ color: 'var(--text-muted)' }}>
                      {isCatCollapsed ? '▶' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Category Layer Rows with 14px padding */}
                {!isCatCollapsed && (
                  <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
                    {cat.layers.map((layer) => {
                      const isActive = !!activeLayers[layer.id];
                      const count = counts[layer.id];
                      const isInfoOpen = infoExpandedId === layer.id;

                      return (
                        <div key={layer.id} className="group">
                          <div
                            onClick={() => onToggleLayer(layer.id)}
                            className={`flex items-center justify-between hover:bg-[var(--bg-surface-hover)] cursor-pointer transition-colors ${
                              isActive ? 'bg-transparent' : 'opacity-60'
                            }`}
                            style={{
                              padding: '6px 14px',
                              boxSizing: 'border-box'
                            }}
                          >
                            {/* Left: Custom Tactical Checkbox + Status Dot + Label */}
                            <div className="flex items-center gap-2.5 min-w-0 pr-2">
                              {/* Tactical Checkbox with Layer Accent Border/Background */}
                              <div
                                className="w-3.5 h-3.5 rounded-[2px] flex items-center justify-center shrink-0 transition-all border"
                                style={{
                                  backgroundColor: isActive ? layer.color : 'var(--bg-surface-elevated)',
                                  borderColor: isActive ? layer.color : 'var(--border-medium)',
                                  boxShadow: isActive ? `0 0 6px ${layer.color}66` : undefined
                                }}
                              >
                                {isActive && <Check size={10} strokeWidth={3.5} className="text-slate-950" />}
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
                                className={`truncate text-[11px] font-mono tracking-wide ${
                                  isActive ? 'font-semibold' : ''
                                }`}
                                style={{
                                  color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)'
                                }}
                              >
                                {layer.label}
                              </span>

                              {/* Count Badge */}
                              {typeof count === 'number' && count > 0 && (
                                <span className="text-[9.5px] font-mono shrink-0" style={{ color: 'var(--text-muted)' }}>
                                  ({count})
                                </span>
                              )}
                            </div>

                            {/* Right: Info Circle */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setInfoExpandedId(isInfoOpen ? null : layer.id);
                                }}
                                className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-serif transition-all"
                                style={{
                                  background: isInfoOpen ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                                  borderColor: isInfoOpen ? '#0284c7' : 'var(--border-subtle)',
                                  color: isInfoOpen ? '#0284c7' : 'var(--text-muted)',
                                  border: '1px solid'
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
                              className="text-[10.5px] space-y-1 font-sans leading-relaxed animate-fade-in"
                              style={{
                                padding: '8px 14px',
                                boxSizing: 'border-box',
                                background: 'var(--bg-surface-elevated)',
                                borderTop: '1px solid var(--border-subtle)',
                                color: 'var(--text-secondary)'
                              }}
                            >
                              <p>{layer.description}</p>
                              <div
                                className="flex items-center justify-between text-[9px] font-mono pt-1"
                                style={{
                                  borderTop: '1px solid var(--border-subtle)',
                                  color: 'var(--text-muted)'
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
        className="flex items-center justify-between text-[9.5px] font-mono"
        style={{
          padding: '8px 14px',
          background: 'var(--bg-surface-subtle)',
          borderTop: '1px solid var(--border-subtle)',
          color: '#0284c7'
        }}
      >
        <span className="truncate">© MANEKSHAW.VISION</span>
        <span style={{ color: 'var(--text-muted)' }}>GEOINT v1.5</span>
      </div>
    </div>
  );
};
