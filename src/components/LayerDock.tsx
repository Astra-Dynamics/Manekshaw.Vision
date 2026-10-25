import React from 'react';
import {
  Target,
  Flame,
  Shield,
  Zap,
  Radio,
  Anchor,
  CloudLightning,
  AlertOctagon,
  PowerOff,
  Mountain,
  DollarSign,
  Ban,
  CheckSquare,
  Square,
  Crosshair
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
    label: 'Middle East Strikes',
    shortLabel: 'Strikes',
    icon: '🎯',
    color: '#ef4444',
    description: 'Iranian ballistic missile impacts, counter-battery operations, and air-launched precision strikes.'
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
    label: 'Conflict Zones',
    shortLabel: 'Conflicts',
    icon: '⚔️',
    color: '#dc2626',
    description: 'Active theater warfare boundary polygons, belligerents, and frontline positions.'
  },
  {
    id: 'bases',
    label: 'Military Bases',
    shortLabel: 'Bases',
    icon: '🛡️',
    color: '#3b82f6',
    description: 'US, NATO, Russian, and Chinese strategic air, naval, and nuclear-capable installations.'
  },
  {
    id: 'nuclear',
    label: 'Nuclear Sites',
    shortLabel: 'Nuclear',
    icon: '☢️',
    color: '#eab308',
    description: 'Uranium enrichment plants, weapons-grade reactors, and warhead assembly complexes.'
  },
  {
    id: 'military',
    label: 'Air & Naval Deployments',
    shortLabel: 'Military',
    icon: '✈️',
    color: '#06b6d4',
    description: 'Aircraft carrier strike groups, stealth bombers, and maritime patrol aircraft.'
  },
  {
    id: 'weather',
    label: 'Severe Weather (NWS/WMO)',
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
    description: 'Canadian public safety emergencies, highway flood advisories, and wildfire watches.'
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
  {
    id: 'waterways',
    label: 'Maritime Chokepoints',
    shortLabel: 'Waterways',
    icon: '⚓',
    color: '#14b8a6',
    description: 'Strategic shipping choke points: Hormuz, Bab el-Mandeb, Malacca, Suez, Panama.'
  },
  {
    id: 'economic',
    label: 'Financial Centers',
    shortLabel: 'Economic',
    icon: '💹',
    color: '#10b981',
    description: 'Global equity exchanges, foreign exchange hubs, sovereign wealth funds, and central banks.'
  },
  {
    id: 'sanctions',
    label: 'Sanctions Regimes',
    shortLabel: 'Sanctions',
    icon: '🚫',
    color: '#ec4899',
    description: 'Comprehensive OFAC, EU, and UN international economic and secondary sanctions regimes.'
  }
];

export const LayerDock: React.FC<LayerDockProps> = ({
  activeLayers,
  onToggleLayer,
  onSetAllLayers,
  counts
}) => {
  const activeCount = Object.values(activeLayers).filter(Boolean).length;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-[96vw] xl:max-w-6xl w-full px-2 pointer-events-none">
      <div className="glass-panel rounded-xl p-2.5 shadow-2xl pointer-events-auto border border-[#38bdf8]/20 bg-[#0c1017]/90 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 pb-2 mb-2 border-b border-slate-800 text-[11px] font-mono">
          <div className="flex items-center gap-2">
            <Crosshair size={14} className="text-sky-400" />
            <span className="text-slate-300 font-bold uppercase tracking-wider">
              TELEMETRY LAYERS ({activeCount}/{LAYER_DEFINITIONS.length} ACTIVE)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetAllLayers(true)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] transition-colors"
            >
              Enable All
            </button>
            <button
              onClick={() => onSetAllLayers(false)}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 text-[10px] transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>

        {/* Scrollable layer pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {LAYER_DEFINITIONS.map((layer) => {
            const isActive = !!activeLayers[layer.id];
            const count = counts[layer.id] || 0;

            return (
              <button
                key={layer.id}
                onClick={() => onToggleLayer(layer.id)}
                title={layer.description}
                style={{
                  borderColor: isActive ? layer.color : 'rgba(51, 65, 85, 0.6)',
                  backgroundColor: isActive ? `${layer.color}15` : 'rgba(15, 23, 42, 0.6)'
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-mono whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'text-slate-100 shadow-sm font-semibold'
                    : 'text-slate-400 opacity-60 hover:opacity-90'
                }`}
              >
                <span>{layer.icon}</span>
                <span>{layer.shortLabel}</span>
                <span
                  style={{
                    backgroundColor: isActive ? layer.color : '#334155',
                    color: '#ffffff'
                  }}
                  className="text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono min-w-4 text-center leading-tight"
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
