import React from 'react';
import {
  X,
  MapPin,
  ExternalLink,
  Shield,
  Flame,
  Radio,
  CheckCircle,
  Copy,
  Crosshair
} from 'lucide-react';
import { MapFeatureItem, IntelHotspot, ConflictZoneFeature } from '../types';

interface InspectorDrawerProps {
  feature: MapFeatureItem | IntelHotspot | ConflictZoneFeature | null;
  onClose: () => void;
  onCenterMap: (coords: [number, number]) => void;
}

export const InspectorDrawer: React.FC<InspectorDrawerProps> = ({
  feature,
  onClose,
  onCenterMap
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!feature) return null;

  // Determine coordinates
  let coords: [number, number] = [0, 0];
  if ('coordinates' in feature && feature.coordinates) {
    coords = feature.coordinates;
  } else if ('center' in feature && feature.center) {
    coords = feature.center;
  }

  const handleCopyCoords = () => {
    navigator.clipboard.writeText(`${coords[1].toFixed(4)}, ${coords[0].toFixed(4)}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHotspot = 'escalationScore' in feature;
  const isConflict = 'parties' in feature;
  const isStandardFeature = 'layer' in feature;

  return (
    <div className="absolute top-16 right-0 bottom-0 w-full sm:w-96 md:w-[420px] bg-[#0c1017]/95 border-l border-[#38bdf8]/20 z-20 flex flex-col backdrop-blur-xl shadow-2xl transition-all select-none">
      {/* Drawer Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Crosshair size={16} className="text-sky-400" />
          <h2 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            TACTICAL INTELLIGENCE DOSSIER
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Title and Badges */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            {isHotspot && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase font-bold">
                Level {(feature as IntelHotspot).escalationScore}/5 Hotspot
              </span>
            )}
            {isConflict && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase font-bold">
                Active War Frontline
              </span>
            )}
            {isStandardFeature && (
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase font-bold">
                {(feature as MapFeatureItem).layer} Layer
              </span>
            )}
            {'severity' in feature && feature.severity && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                feature.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                feature.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {feature.severity}
              </span>
            )}
          </div>

          <h1 className="text-lg font-bold text-slate-100 font-sans tracking-tight">
            {feature.name}
          </h1>

          {'category' in feature && feature.category && (
            <p className="text-xs font-mono text-cyan-400/90 mt-0.5">
              {feature.category}
            </p>
          )}
        </div>

        {/* Location & Coordinates Action Bar */}
        <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-1.5 text-slate-300">
            <MapPin size={14} className="text-sky-400" />
            <span>
              {coords[1].toFixed(4)}°N, {coords[0].toFixed(4)}°E
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyCoords}
              className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
              title="Copy Coordinates"
            >
              {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
            <button
              onClick={() => onCenterMap(coords)}
              className="px-2.5 py-1 rounded bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] transition-colors"
            >
              Center Map
            </button>
          </div>
        </div>

        {/* Primary Description */}
        <div className="space-y-1.5">
          <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
            SITUATION BRIEFING
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800/80">
            {feature.description}
          </p>
        </div>

        {/* Specific Details Table */}
        {'details' in feature && feature.details && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              OPERATIONAL PARAMETERS
            </h3>
            <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 overflow-hidden text-xs font-mono">
              {Object.entries(feature.details).map(([key, val], idx) => {
                if (typeof val === 'object') return null;
                return (
                  <div
                    key={key}
                    className={`flex items-center justify-between p-2.5 ${
                      idx !== 0 ? 'border-t border-slate-800/60' : ''
                    }`}
                  >
                    <span className="text-slate-400 capitalize">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-slate-200 font-semibold text-right max-w-[60%] truncate">
                      {String(val)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Why it matters / Strategic impact */}
        {'whyItMatters' in feature && (feature as IntelHotspot).whyItMatters && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              STRATEGIC SIGNIFICANCE
            </h3>
            <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
              {(feature as IntelHotspot).whyItMatters}
            </div>
          </div>
        )}

        {/* Conflict parties and casualties */}
        {isConflict && (
          <div className="space-y-2">
            <h3 className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
              COMBAT ACTORS
            </h3>
            <div className="space-y-1 text-xs font-mono">
              {(feature as ConflictZoneFeature).parties.map((party, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-200">
                  ⚔️ {party}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Incidents for Hotspots */}
        {isHotspot && (feature as IntelHotspot).recentIncidents && (
          <div className="space-y-1.5">
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              RECENT ESCALATION INCIDENTS
            </h3>
            <div className="space-y-1 text-xs">
              {(feature as IntelHotspot).recentIncidents?.map((inc, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800/60 text-slate-300">
                  • {inc}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Attribution / External Source */}
        {'source' in feature && feature.source && (
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>SOURCE: {feature.source}</span>
            {'link' in feature && feature.link && (
              <a
                href={feature.link}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-sky-400 hover:underline"
              >
                External Briefing <ExternalLink size={12} />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
