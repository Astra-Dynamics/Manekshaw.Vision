import React, { useState, useMemo } from 'react';
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  Info,
  Check,
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

export const LAYER_DEFINITIONS: LayerMetadata[] = [
  {
    id: 'iranAttacks',
    label: 'MIDDLE EAST STRIKES',
    shortLabel: 'STRIKES',
    icon: '🎯',
    color: '#ef4444',
    description: 'Ballistic missile impacts, counter-battery operations, and air-launched precision strikes across the Levant and Middle East.'
  },
  {
    id: 'hotspots',
    label: 'INTEL HOTSPOTS',
    shortLabel: 'HOTSPOTS',
    icon: '🔥',
    color: '#f97316',
    description: 'Active geopolitical flashpoints rated 1-5 escalation level with strategic assessments.'
  },
  {
    id: 'conflicts',
    label: 'CONFLICT ZONES',
    shortLabel: 'FRONTLINES',
    icon: '⚔️',
    color: '#dc2626',
    description: 'Active frontline warfare boundary polygons, belligerents, and mechanized combat operations.'
  },
  {
    id: 'fortifiedBorders',
    label: 'FORTIFIED FRONTLINES',
    shortLabel: 'FORTIFIED',
    icon: '🚧',
    color: '#f59e0b',
    description: 'High-readiness military borders, LoC/AGPL, LAC sectors, DMZ, and fortified trench networks.'
  },
  {
    id: 'bases',
    label: 'MILITARY BASES',
    shortLabel: 'BASES',
    icon: '🏛️',
    color: '#3b82f6',
    description: 'US, NATO, Russian, Chinese, and Indian strategic garrisons, air wings, and naval commands.'
  },
  {
    id: 'nuclear',
    label: 'NUCLEAR SITES',
    shortLabel: 'NUCLEAR',
    icon: '☢️',
    color: '#eab308',
    description: 'Uranium enrichment complexes, weapons-grade reactors, and strategic nuclear storage depots.'
  },
  {
    id: 'adizZones',
    label: 'AIR DEFENSE (ADIZ)',
    shortLabel: 'ADIZ',
    icon: '🌐',
    color: '#38bdf8',
    description: 'Official national sovereign and maritime air defense identification zones and intercept sectors.'
  },
  {
    id: 'gpsJamming',
    label: 'ELECTRONIC WARFARE',
    shortLabel: 'EW/JAMMING',
    icon: '📡',
    color: '#06b6d4',
    description: 'Active GNSS degradation, spoofing corridors, and military electronic warfare arrays.'
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
    id: 'waterways',
    label: 'MARITIME CHOKEPOINTS',
    shortLabel: 'CHOKEPOINTS',
    icon: '⚓',
    color: '#14b8a6',
    description: 'Strategic shipping choke points: Hormuz, Malacca, Bab el-Mandeb, Suez, and Panama.'
  },
  {
    id: 'outages',
    label: 'GRID & CABLE OUTAGES',
    shortLabel: 'OUTAGES',
    icon: '⚡',
    color: '#a855f7',
    description: 'Undersea fiber cable severances, electrical grid blackouts, and telecom disruption zones.'
  },
  {
    id: 'weather',
    label: 'SEVERE WEATHER',
    shortLabel: 'WEATHER',
    icon: '🌪️',
    color: '#60a5fa',
    description: 'Super typhoons, atmospheric rivers, bomb cyclones, and severe NOAA weather watches.'
  },
  {
    id: 'natural',
    label: 'EARTHQUAKES & VOLCANOES',
    shortLabel: 'HAZARDS',
    icon: '🌋',
    color: '#ea580c',
    description: 'Live USGS real-time seismic telemetry and NASA EONET volcanic & fire anomalies.'
  },
  {
    id: 'canadaAlerts',
    label: 'EMERGENCY BULLETINS',
    shortLabel: 'EMERGENCY',
    icon: '🍁',
    color: '#f43f5e',
    description: 'Public safety emergency broadcasts, wildfire alerts, and civil evacuation orders.'
  },
  {
    id: 'economic',
    label: 'FINANCIAL CENTERS',
    shortLabel: 'FINANCIAL',
    icon: '💹',
    color: '#10b981',
    description: 'Global equity exchanges, foreign exchange trading hubs, and central reserve banks.'
  },
  {
    id: 'sanctions',
    label: 'SANCTIONS REGIMES',
    shortLabel: 'SANCTIONS',
    icon: '🚫',
    color: '#ec4899',
    description: 'Comprehensive OFAC, European Union, and United Nations international embargo regimes.'
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

  const activeCount = Object.values(activeLayers).filter(Boolean).length;
  const totalLayers = LAYER_DEFINITIONS.length;

  const filteredLayers = useMemo(() => {
    if (!searchQuery.trim()) return LAYER_DEFINITIONS;
    const q = searchQuery.toLowerCase();
    return LAYER_DEFINITIONS.filter(
      (l) =>
        l.label.toLowerCase().includes(q) ||
        l.shortLabel.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // When completely collapsed, show a sleek tactical pill on the map
  if (!isOpen) {
    return (
      <div className="absolute top-4 left-14 z-20 select-none">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2.5 px-3.5 py-2 bg-[#090c12]/95 hover:bg-[#121622] border border-zinc-800 hover:border-emerald-500/60 rounded-lg text-white font-mono text-xs shadow-2xl backdrop-blur-md transition-all group"
          title="Open Layers Menu"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          <span className="font-bold tracking-wider uppercase text-zinc-100">LAYERS</span>
          <span className="text-[10px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded font-bold">
            {activeCount}/{totalLayers}
          </span>
          <ChevronDown size={13} className="text-zinc-400 group-hover:text-emerald-400 transition-colors" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 left-14 z-20 w-[285px] sm:w-[310px] bg-[#090c12]/95 border border-zinc-800 shadow-2xl rounded-lg backdrop-blur-xl select-none font-mono text-xs overflow-hidden animate-fade-in flex flex-col max-h-[calc(100vh-140px)]">
      {/* 1. Header Bar matching reference image */}
      <div
        onClick={() => setIsOpen(false)}
        className="flex items-center justify-between px-3.5 py-2.5 bg-[#0d111a] border-b border-zinc-800 cursor-pointer hover:bg-[#121622] transition-colors"
        title="Click to collapse layers menu"
      >
        <div className="flex items-center gap-2">
          <span className="font-bold tracking-wider uppercase text-zinc-100 text-[12px]">LAYERS</span>
          <span className="text-[10px] text-zinc-400 bg-zinc-800/80 px-1.5 py-0.2 rounded font-bold">
            {activeCount}/{totalLayers}
          </span>
        </div>

        <div className="flex items-center gap-2 text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          <span className="text-[10px]">▼</span>
        </div>
      </div>

      {/* 2. Search Layers Input matching reference image */}
      <div className="p-2.5 pb-2 bg-[#090c12] border-b border-zinc-800/80 space-y-2">
        <div className="flex items-center gap-2.5 px-3 py-1.5 bg-[#141822] border border-zinc-700/80 focus-within:border-cyan-500/80 rounded-md transition-colors">
          <Search size={13} className="text-zinc-500 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search layers..."
            className="w-full bg-transparent border-none text-xs text-white placeholder-zinc-500 focus:outline-none font-mono"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-zinc-400 hover:text-white shrink-0 ml-1"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Quick bulk action controls */}
        <div className="flex items-center justify-between text-[10px] text-zinc-400 px-0.5 pt-0.5">
          <span className="text-zinc-500 uppercase tracking-wider text-[9px]">Filter & Toggle:</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetAllLayers(true)}
              className="hover:text-emerald-400 transition-colors uppercase font-bold"
            >
              Select All
            </button>
            <span className="text-zinc-700">•</span>
            <button
              onClick={() => onSetAllLayers(false)}
              className="hover:text-red-400 transition-colors uppercase font-bold"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>

      {/* 3. Scrollable Layer List matching reference image */}
      <div className="overflow-y-auto layers-scrollbar py-1 flex-1 max-h-[380px]">
        {filteredLayers.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-xs font-mono">
            No matching layers found
          </div>
        ) : (
          filteredLayers.map((layer) => {
            const isActive = !!activeLayers[layer.id];
            const count = counts[layer.id];
            const isInfoOpen = infoExpandedId === layer.id;

            return (
              <div key={layer.id} className="border-b border-zinc-900/60 last:border-b-0">
                <div
                  className={`flex items-center justify-between px-3 py-2 hover:bg-[#131722] cursor-pointer transition-colors group ${
                    isActive ? 'bg-[#090c12]' : 'bg-[#06080e]/60 opacity-75'
                  }`}
                  onClick={() => onToggleLayer(layer.id)}
                >
                  {/* Left: Custom Checkbox + Icon + Label */}
                  <div className="flex items-center gap-2.5 min-w-0 pr-2">
                    {/* Custom Green Square Checkbox matching screenshot */}
                    <div
                      className={`w-4 h-4 rounded-[3px] flex items-center justify-center shrink-0 transition-all ${
                        isActive
                          ? 'bg-[#22c55e] text-black font-extrabold shadow-[0_0_8px_rgba(34,197,94,0.35)]'
                          : 'border border-zinc-700 bg-[#12151c] group-hover:border-zinc-500'
                      }`}
                    >
                      {isActive && <Check size={12} strokeWidth={3.5} />}
                    </div>

                    {/* Layer Emoji / Icon */}
                    <span className="text-sm shrink-0">{layer.icon}</span>

                    {/* Layer Title in Monospace */}
                    <span
                      className={`truncate text-xs font-mono tracking-wide ${
                        isActive ? 'text-white font-bold' : 'text-zinc-400 group-hover:text-zinc-300'
                      }`}
                    >
                      {layer.label}
                    </span>

                    {/* Layer Count */}
                    {typeof count === 'number' && count > 0 && (
                      <span className="text-[10px] text-zinc-500 font-mono shrink-0">
                        ({count})
                      </span>
                    )}
                  </div>

                  {/* Right: Info (i) Circle Icon matching screenshot */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInfoExpandedId(isInfoOpen ? null : layer.id);
                      }}
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-serif transition-all ${
                        isInfoOpen
                          ? 'border border-cyan-400 text-cyan-400 bg-cyan-500/10 shadow-[0_0_8px_rgba(6,182,212,0.4)]'
                          : 'border border-zinc-700/80 text-zinc-400 hover:border-cyan-400 hover:text-cyan-400'
                      }`}
                      title="Inspect Layer Intel"
                    >
                      i
                    </button>
                  </div>
                </div>

                {/* Collapsible Info Drawer under row */}
                {isInfoOpen && (
                  <div className="px-3.5 py-2.5 bg-[#0d121c] border-t border-zinc-800 text-[11px] text-zinc-300 space-y-1.5 animate-fade-in font-sans leading-relaxed">
                    <p>{layer.description}</p>
                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-zinc-800/80">
                      <span>KEY: {layer.id}</span>
                      <span style={{ color: layer.color }}>● COLOR IDENT</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* 4. Footer Branding Line matching reference image */}
      <div className="px-3 py-2 bg-[#06080e] border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-cyan-400">
        <span className="truncate">© MANEKSHAW.VISION</span>
        <span className="text-zinc-500">v1.4 • LIVE OPS</span>
      </div>
    </div>
  );
};
