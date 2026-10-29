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
import { LayerKey, LayerMetadata, ThemeMode } from '../types';

interface LayerDockProps {
  activeLayers: Record<LayerKey, boolean>;
  onToggleLayer: (layer: LayerKey) => void;
  onSetAllLayers: (enabled: boolean) => void;
  counts: Record<LayerKey, number>;
  theme?: ThemeMode;
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
  counts,
  theme = 'dark'
}) => {
  const isLight = theme === 'light';
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [infoExpandedId, setInfoExpandedId] = useState<LayerKey | null>(null);

  // Drag-Resize State for Tactical Layers HUD
  const [dockWidth, setDockWidth] = useState<number>(250);
  const [dockHeight, setDockHeight] = useState<number | null>(null);
  const [isResizing, setIsResizing] = useState<'none' | 'x' | 'y' | 'corner'>('none');

  const handleStartResize = (direction: 'x' | 'y' | 'corner', e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(direction);

    const startX = e.clientX;
    const startY = e.clientY;
    const initialWidth = dockWidth;
    const initialHeight = dockHeight || 520;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (direction === 'x' || direction === 'corner') {
        const deltaX = moveEvent.clientX - startX;
        setDockWidth(Math.max(220, Math.min(420, initialWidth + deltaX)));
      }
      if (direction === 'y' || direction === 'corner') {
        const deltaY = moveEvent.clientY - startY;
        const maxHeight = window.innerHeight - 96;
        setDockHeight(Math.max(240, Math.min(maxHeight, initialHeight + deltaY)));
      }
    };

    const handleMouseUp = () => {
      setIsResizing('none');
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

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
          className={`flex items-center gap-2 px-2.5 py-1.2 rounded-[6px] font-mono text-xs shadow-xl transition-all group border ${
            isLight
              ? 'bg-white/95 text-[#0F172A] border-[#CBD5E1] hover:border-sky-500'
              : 'bg-[rgba(13,19,30,0.84)] text-slate-200 border-white/10 hover:border-sky-500/50'
          }`}
          style={{
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}
          title="Open Tactical Layer Matrix"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          <span className="font-bold tracking-wider uppercase text-[11px]">LAYERS</span>
          <span className={`text-[9.5px] px-1 py-0.2 rounded font-bold border ${
            isLight
              ? 'bg-[var(--accent-soft)] text-[var(--accent-text)] border-[var(--accent)]/20'
              : 'bg-white/5 text-slate-400 border-white/10'
          }`}>
            {activeCount}/{totalLayers}
          </span>
          <ChevronDown size={11} className={`${isLight ? 'text-[var(--text-tertiary)]' : 'text-slate-400'} group-hover:text-[var(--accent-text)] transition-colors`} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`z-20 select-none overflow-hidden flex flex-col animate-fade-in shadow-2xl relative cq-panel ${
        isLight ? 'font-sans' : 'font-mono text-xs'
      }`}
      style={{
        position: 'absolute',
        top: '84px',
        left: '44px',
        width: `${dockWidth}px`,
        height: dockHeight ? `${dockHeight}px` : undefined,
        maxHeight: dockHeight ? `${dockHeight}px` : 'calc(100vh - 110px)',
        background: isLight ? 'var(--surface)' : 'rgba(13, 19, 30, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: isLight ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: isLight ? '12px' : '6px',
        boxShadow: isLight ? 'var(--shadow-md)' : '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        boxSizing: 'border-box',
        transition: isResizing !== 'none' ? 'none' : 'width 0.15s ease, height 0.15s ease'
      }}
    >
      {/* 1. Header Bar: Title, Active Counter & Minimize */}
      <div
        onClick={() => setIsOpen(false)}
        className={`flex items-center justify-between cursor-pointer transition-colors ${
          isLight ? 'hover:bg-[var(--bg-sunken)]' : 'hover:bg-white/[0.04]'
        }`}
        style={{
          padding: '8px 12px',
          background: isLight ? 'var(--bg-panel)' : 'rgba(255, 255, 255, 0.02)',
          borderBottom: isLight ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.06)'
        }}
        title="Click to collapse Layer Matrix"
      >
        <div className="flex items-center gap-2">
          <span className={isLight ? "text-[13px] font-serif font-semibold text-[var(--text-primary)]" : "text-[10.5px] font-bold tracking-wider text-slate-200"}>
            TACTICAL LAYERS
          </span>
          <span
            className={`text-[9.5px] px-1.5 py-0.2 rounded font-bold ${isLight ? 'font-sans' : 'font-mono'}`}
            style={{
              background: isLight ? 'var(--accent-soft)' : 'rgba(14, 165, 233, 0.1)',
              color: isLight ? 'var(--accent-text)' : '#38BDF8',
              border: isLight ? '1px solid rgba(198, 97, 63, 0.25)' : '1px solid rgba(56, 189, 248, 0.25)'
            }}
          >
            {activeCount}/{totalLayers}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          <ChevronUp size={12} className={isLight ? 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]' : 'hover:text-white'} />
        </div>
      </div>

      {/* 2. Search & Bulk Actions Bar */}
      <div
        className="space-y-1.5"
        style={{
          padding: '8px 12px',
          borderBottom: isLight ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.06)',
          background: isLight ? 'var(--surface)' : undefined
        }}
      >
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border transition-colors ${
            isLight
              ? 'border-[var(--border-strong)] bg-[var(--surface)] focus-within:border-[var(--accent)] focus-within:ring-2 focus-within:ring-[var(--focus-ring)]'
              : 'border-white/10 bg-white/[0.03] focus-within:border-sky-500/50'
          }`}
        >
          <Search size={11} className={isLight ? 'text-[var(--text-tertiary)] shrink-0' : 'text-slate-400 shrink-0'} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter matrix..."
            className={`w-full bg-transparent border-none text-[11px] focus:outline-none ${
              isLight ? 'font-sans text-[var(--text-primary)] placeholder:text-[var(--text-tertiary)]' : 'font-mono text-slate-200 placeholder:text-slate-500'
            }`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`${isLight ? 'text-[var(--text-tertiary)] hover:text-[var(--text-primary)]' : 'text-slate-400 hover:text-white'} shrink-0 ml-1`}
            >
              <X size={10} />
            </button>
          )}
        </div>

        {/* Quick Bulk Action Links */}
        <div className={`flex items-center justify-between text-[10px] px-0.5 ${isLight ? 'text-[var(--text-tertiary)] font-sans' : 'text-slate-400 font-mono'}`}>
          <span className="uppercase tracking-wider font-semibold">Bulk:</span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onSetAllLayers(true)}
              className={`${isLight ? 'text-[var(--accent-text)] hover:text-[var(--accent-hover)]' : 'hover:text-emerald-400'} transition-colors uppercase font-bold cursor-pointer`}
            >
              Select All
            </button>
            <span>•</span>
            <button
              onClick={() => onSetAllLayers(false)}
              className={`${isLight ? 'text-[var(--sev-critical)] hover:opacity-80' : 'hover:text-rose-400'} transition-colors uppercase font-bold cursor-pointer`}
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Categorized Layer List with Collapsible Accordions (Auto-reflows to 2x2 matrix when wide) */}
      <div className={`overflow-y-auto layers-scrollbar py-0.5 flex-1 ${
        dockWidth > 340 ? 'grid grid-cols-2 gap-1.5 p-1.5' : 'space-y-0.5'
      }`}>
        {filteredCategories.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs font-mono col-span-2">
            No matching layers found
          </div>
        ) : (
          filteredCategories.map((cat) => {
            const isCatCollapsed = !!collapsedCategories[cat.id];
            const catActiveCount = cat.layers.filter((l) => !!activeLayers[l.id]).length;

            return (
              <div
                key={cat.id}
                className={`border-b border-white/[0.04] last:border-b-0 ${
                  dockWidth > 340 ? 'rounded border border-white/[0.06] bg-white/[0.02] overflow-hidden' : ''
                }`}
              >
                {/* Category Header with single-line guarantee (nowrap) */}
                <div
                  onClick={() => toggleCategoryCollapse(cat.id)}
                  className={`flex items-center justify-between cursor-pointer transition-colors ${
                    isLight ? 'hover:bg-[var(--bg-sunken)]' : 'hover:bg-white/[0.03]'
                  }`}
                  style={{
                    padding: '5px 12px',
                    boxSizing: 'border-box',
                    background: isLight ? 'var(--bg-sunken)' : 'rgba(255, 255, 255, 0.04)',
                    borderTop: isLight ? '1px solid var(--border-subtle)' : undefined,
                    borderBottom: isLight ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.04)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div className="flex items-center gap-1.5 min-w-0 pr-1">
                    <span className="text-[11px] shrink-0">{cat.icon}</span>
                    <span
                      className={`truncate uppercase ${
                        isLight
                          ? 'text-[11px] font-sans font-semibold tracking-[0.06em] text-[var(--text-tertiary)]'
                          : 'text-[9.5px] font-mono font-bold tracking-wider text-slate-200'
                      }`}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      {cat.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span
                      className={`text-[9.5px] px-1.5 py-0.2 rounded font-semibold ${
                        isLight
                          ? 'font-sans bg-[var(--surface)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]'
                          : 'font-mono font-bold'
                      }`}
                      style={{
                        backgroundColor: isLight ? undefined : `${cat.accentColor}18`,
                        color: isLight ? undefined : cat.accentColor,
                        border: isLight ? undefined : `1px solid ${cat.accentColor}33`
                      }}
                    >
                      {catActiveCount}/{cat.layers.length}
                    </span>
                    <span className={`text-[9px] ${isLight ? 'text-[var(--text-tertiary)]' : 'text-slate-400'}`}>
                      {isCatCollapsed ? '▶' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Category Layer Rows with tight padding */}
                {!isCatCollapsed && (
                  <div className={isLight ? 'divide-y divide-[var(--border-subtle)]' : 'divide-y divide-white/[0.03]'}>
                    {cat.layers.map((layer) => {
                      const isActive = !!activeLayers[layer.id];
                      const count = counts[layer.id];
                      const isInfoOpen = infoExpandedId === layer.id;

                      return (
                        <div key={layer.id} className="group">
                          <div
                            onClick={() => onToggleLayer(layer.id)}
                            className={`flex items-center justify-between cursor-pointer transition-colors ${
                              isLight ? 'hover:bg-[var(--bg-sunken)]' : 'hover:bg-white/[0.04]'
                            } ${
                              isActive ? 'bg-transparent' : 'opacity-60'
                            }`}
                            style={{
                              padding: '4px 12px',
                              height: isLight ? '26px' : '22px',
                              boxSizing: 'border-box',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {/* Left: Custom Tactical Checkbox + Status Dot + Label */}
                            <div className="flex items-center gap-2 min-w-0 pr-1 overflow-hidden">
                              {/* Tactical Checkbox with Layer Accent Border/Background */}
                              <div
                                className="w-3.5 h-3.5 rounded-[3px] flex items-center justify-center shrink-0 transition-all border"
                                style={{
                                  backgroundColor: isActive ? layer.color : (isLight ? 'var(--surface)' : 'rgba(255, 255, 255, 0.05)'),
                                  borderColor: isActive ? layer.color : (isLight ? 'var(--border-strong)' : 'rgba(255, 255, 255, 0.15)'),
                                  boxShadow: isActive ? (isLight ? 'none' : `0 0 6px ${layer.color}66`) : undefined
                                }}
                              >
                                {isActive && <Check size={9} strokeWidth={3.5} className="text-white" />}
                              </div>

                              {/* Semantic Status Indicator Dot */}
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{
                                  backgroundColor: layer.color,
                                  boxShadow: isActive ? (isLight ? 'none' : `0 0 6px ${layer.color}`) : 'none'
                                }}
                              />

                              {/* Layer Name */}
                              <span
                                className={`truncate ${
                                  isLight
                                    ? `text-[13px] font-sans ${isActive ? 'text-[var(--text-primary)] font-medium' : 'text-[var(--text-secondary)]'}`
                                    : `text-[10.5px] font-mono tracking-wide ${isActive ? 'text-slate-100 font-semibold' : 'text-slate-300'}`
                                }`}
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                {layer.label}
                              </span>

                              {/* Count Badge */}
                              {typeof count === 'number' && count > 0 && (
                                <span className={`text-[10px] font-mono shrink-0 ${isLight ? 'text-[var(--text-tertiary)]' : 'text-slate-400'}`}>
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
                                className={`w-3.5 h-3.5 flex items-center justify-center text-[10px] font-serif transition-colors ${
                                  isLight ? 'hover:text-[var(--accent-text)]' : 'hover:text-[#38BDF8]'
                                }`}
                                style={{
                                  color: isInfoOpen
                                    ? (isLight ? 'var(--accent-text)' : '#38BDF8')
                                    : (isLight ? 'var(--text-tertiary)' : 'rgba(148, 163, 184, 0.35)'),
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
                                padding: '6px 12px',
                                boxSizing: 'border-box',
                                background: isLight ? 'var(--bg-sunken)' : 'rgba(0, 0, 0, 0.3)',
                                borderTop: isLight ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.05)',
                                color: isLight ? 'var(--text-secondary)' : '#94A3B8'
                              }}
                            >
                              <p>{layer.description}</p>
                              <div
                                className="flex items-center justify-between text-[8.5px] font-mono pt-1"
                                style={{
                                  borderTop: isLight ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.05)',
                                  color: isLight ? 'var(--text-tertiary)' : '#64748B'
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
        className={`flex items-center justify-between text-[9px] shrink-0 ${isLight ? 'font-sans' : 'font-mono'}`}
        style={{
          padding: '5px 12px',
          background: isLight ? 'var(--bg-panel)' : 'rgba(255, 255, 255, 0.02)',
          borderTop: isLight ? '1px solid var(--border-subtle)' : '1px solid rgba(255, 255, 255, 0.04)',
          color: isLight ? 'var(--text-tertiary)' : '#38bdf8'
        }}
      >
        <span className="truncate">© MANEKSHAW.VISION</span>
        <span style={{ color: isLight ? 'var(--text-tertiary)' : '#64748B' }}>GEOINT v1.5</span>
      </div>

      {/* Interactive Edge & Corner Drag-Resize Handles */}
      {/* Right Edge (↔) */}
      <div
        onMouseDown={(e) => handleStartResize('x', e)}
        className="absolute right-0 top-0 bottom-0 w-[6px] -translate-x-[1px] cursor-ew-resize select-none z-30 group"
        title="Drag horizontally to resize panel width (220px - 420px)"
      >
        <div
          className={`w-[2px] h-full ml-auto transition-all ${
            isResizing === 'x' || isResizing === 'corner'
              ? 'bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]'
              : 'bg-transparent group-hover:bg-[#38BDF8]/60'
          }`}
        />
      </div>

      {/* Bottom Edge (↕) */}
      <div
        onMouseDown={(e) => handleStartResize('y', e)}
        className="absolute left-0 right-0 bottom-0 h-[6px] -translate-y-[1px] cursor-ns-resize select-none z-30 group"
        title="Drag vertically to resize panel height"
      >
        <div
          className={`h-[2px] w-full mt-auto transition-all ${
            isResizing === 'y' || isResizing === 'corner'
              ? 'bg-[#38BDF8] shadow-[0_0_10px_#38BDF8]'
              : 'bg-transparent group-hover:bg-[#38BDF8]/60'
          }`}
        />
      </div>

      {/* Bottom-Right Corner (↘) */}
      <div
        onMouseDown={(e) => handleStartResize('corner', e)}
        className="absolute right-0 bottom-0 w-3.5 h-3.5 cursor-nwse-resize select-none z-40 flex items-center justify-center group"
        title="Drag corner to resize width and height simultaneously"
      >
        <svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          className={`transition-all ${
            isResizing === 'corner'
              ? 'text-sky-400 scale-110 drop-shadow-[0_0_6px_#38BDF8]'
              : 'text-slate-500 group-hover:text-sky-400'
          }`}
        >
          <path d="M7 1L1 7M7 4L4 7M7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
};
