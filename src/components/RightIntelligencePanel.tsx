import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Flame,
  ShieldAlert,
  Radio,
  Target,
  ChevronRight,
  Filter,
  X,
  MapPin,
  ExternalLink,
  Copy,
  CheckCircle,
  Crosshair,
  FileText,
  SlidersHorizontal,
  ChevronLeft
} from 'lucide-react';
import {
  IntelHotspot,
  ConflictZoneFeature,
  MapFeatureItem,
  IntelNewsItem
} from '../types';

interface RightIntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  hotspots: IntelHotspot[];
  conflicts: ConflictZoneFeature[];
  features: MapFeatureItem[];
  news: IntelNewsItem[];
  selectedFeature: MapFeatureItem | IntelHotspot | ConflictZoneFeature | null;
  onSelectFeature: (feature: MapFeatureItem | IntelHotspot | ConflictZoneFeature) => void;
  onCenterMap: (coords: [number, number]) => void;
}

export const RightIntelligencePanel: React.FC<RightIntelligencePanelProps> = ({
  isOpen,
  onClose,
  hotspots,
  conflicts,
  features,
  news,
  selectedFeature,
  onSelectFeature,
  onCenterMap
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'hotspots' | 'conflicts' | 'infra' | 'dossier'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Switch to dossier tab automatically when an item is selected
  useEffect(() => {
    if (selectedFeature) {
      setActiveTab('dossier');
    }
  }, [selectedFeature]);

  const filteredNews = useMemo(() => {
    return news.filter((item) => {
      const matchQuery =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.source.toLowerCase().includes(searchQuery.toLowerCase());
      const matchSev = selectedSeverity === 'all' || item.severity === selectedSeverity;
      return matchQuery && matchSev;
    });
  }, [news, searchQuery, selectedSeverity]);

  const filteredHotspots = useMemo(() => {
    return hotspots.filter((hs) => {
      return (
        hs.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hs.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hs.whyItMatters.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [hotspots, searchQuery]);

  const filteredConflicts = useMemo(() => {
    return conflicts.filter((c) => {
      return (
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.parties.some((p) => p.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    });
  }, [conflicts, searchQuery]);

  const filteredInfra = useMemo(() => {
    return features.filter((f) => {
      const matchQuery =
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (f.category && f.category.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchSev = selectedSeverity === 'all' || f.severity === selectedSeverity;
      return matchQuery && matchSev;
    });
  }, [features, searchQuery, selectedSeverity]);

  if (!isOpen) return null;

  // Selected feature coordinates
  let featureCoords: [number, number] = [0, 0];
  if (selectedFeature) {
    if ('coordinates' in selectedFeature && selectedFeature.coordinates) {
      featureCoords = selectedFeature.coordinates;
    } else if ('center' in selectedFeature && selectedFeature.center) {
      featureCoords = selectedFeature.center;
    }
  }

  const handleCopyCoords = () => {
    if (featureCoords[0] !== 0 || featureCoords[1] !== 0) {
      navigator.clipboard.writeText(`${featureCoords[1].toFixed(4)}, ${featureCoords[0].toFixed(4)}`);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  const isHotspot = selectedFeature && 'escalationScore' in selectedFeature;
  const isConflict = selectedFeature && 'parties' in selectedFeature;
  const isStandardFeature = selectedFeature && 'layer' in selectedFeature;

  return (
    <aside className="w-full sm:w-[420px] lg:w-[460px] h-full flex flex-col shrink-0 border-l border-[#38bdf8]/20 bg-[#0c1017]/95 z-20 backdrop-blur-xl shadow-2xl select-none">
      {/* Top Header of Right Panel */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-sky-400 animate-pulse" />
          <h2 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            INTELLIGENCE DESK
          </h2>
        </div>
        <button
          onClick={onClose}
          title="Collapse Panel"
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-5 border-b border-slate-800 text-[11px] font-mono bg-slate-950/40">
        <button
          onClick={() => setActiveTab('feed')}
          className={`py-2 px-1 text-center transition-all ${
            activeTab === 'feed'
              ? 'text-sky-400 border-b-2 border-sky-400 font-bold bg-slate-900/70'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Feed ({filteredNews.length})
        </button>
        <button
          onClick={() => setActiveTab('hotspots')}
          className={`py-2 px-1 text-center transition-all ${
            activeTab === 'hotspots'
              ? 'text-orange-400 border-b-2 border-orange-400 font-bold bg-slate-900/70'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hotspots ({filteredHotspots.length})
        </button>
        <button
          onClick={() => setActiveTab('conflicts')}
          className={`py-2 px-1 text-center transition-all ${
            activeTab === 'conflicts'
              ? 'text-red-400 border-b-2 border-red-400 font-bold bg-slate-900/70'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Wars ({filteredConflicts.length})
        </button>
        <button
          onClick={() => setActiveTab('infra')}
          className={`py-2 px-1 text-center transition-all ${
            activeTab === 'infra'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold bg-slate-900/70'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Assets ({filteredInfra.length})
        </button>
        <button
          onClick={() => setActiveTab('dossier')}
          className={`py-2 px-1 text-center transition-all relative ${
            activeTab === 'dossier'
              ? 'text-emerald-400 border-b-2 border-emerald-400 font-bold bg-slate-900/70'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Dossier
          {selectedFeature && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1.5 right-1.5"></span>
          )}
        </button>
      </div>

      {/* Search and Severity Filter Bar (visible for listing tabs) */}
      {activeTab !== 'dossier' && (
        <div className="p-2.5 border-b border-slate-800/80 flex items-center gap-2 bg-slate-900/40">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              placeholder="Filter by keywords, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-sky-500 font-mono"
            />
          </div>

          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-slate-950/80 border border-slate-700/80 rounded px-2 py-1.5 text-[11px] text-slate-300 font-mono focus:outline-none focus:border-sky-500"
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        </div>
      )}

      {/* Tab Panels */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {/* 1. Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-2.5">
            {filteredNews.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500 font-mono">
                No intelligence reports match query.
              </div>
            ) : (
              filteredNews.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (item.coordinates) {
                      onSelectFeature({
                        id: item.id,
                        layer: 'military',
                        name: item.title,
                        coordinates: item.coordinates,
                        category: item.category,
                        severity: item.severity,
                        description: item.summary,
                        source: item.source
                      });
                    }
                  }}
                  className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 hover:border-sky-500/40 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                        item.severity === 'critical'
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : item.severity === 'high'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}
                    >
                      {item.category} • {item.severity}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{item.timeAgo}</span>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-200 group-hover:text-sky-300 leading-snug mb-1">
                    {item.title}
                  </h3>

                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {item.summary}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>SRC: {item.source}</span>
                    <span className="flex items-center gap-1 text-sky-400 group-hover:translate-x-0.5 transition-transform font-bold">
                      Inspect & Map <ChevronRight size={10} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. Hotspots Tab */}
        {activeTab === 'hotspots' && (
          <div className="space-y-2.5">
            {filteredHotspots.map((hs) => (
              <div
                key={hs.id}
                onClick={() => onSelectFeature(hs)}
                className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Flame size={14} className="text-orange-400" />
                    <span className="text-xs font-bold text-slate-100 group-hover:text-orange-300 font-mono">
                      {hs.name}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded font-extrabold ${
                      hs.escalationScore >= 5
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                        : hs.escalationScore >= 4
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40'
                    }`}
                  >
                    LEVEL {hs.escalationScore}/5 • {hs.escalationTrend}
                  </span>
                </div>

                <p className="text-[11px] text-slate-300 mb-2 leading-relaxed">
                  {hs.description}
                </p>

                <div className="bg-slate-950/60 p-2 rounded border border-slate-800/60 text-[10px] text-slate-400">
                  <span className="text-orange-400/90 font-mono font-semibold">Strategic Impact:</span>{' '}
                  {hs.whyItMatters}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Conflicts Tab */}
        {activeTab === 'conflicts' && (
          <div className="space-y-2.5">
            {filteredConflicts.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectFeature(c)}
                className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-red-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-red-400 font-mono">
                    {c.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase font-bold">
                    {c.intensity}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-slate-400 mb-1.5">
                  Belligerents: <span className="text-slate-200">{c.parties.join(' vs ')}</span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed mb-2">
                  {c.description}
                </p>

                {c.casualties && (
                  <div className="text-[10px] font-mono text-amber-400 bg-amber-950/30 px-2 py-1 rounded border border-amber-500/20">
                    Est. Casualties: {c.casualties}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 4. Assets Tab */}
        {activeTab === 'infra' && (
          <div className="space-y-2.5">
            {filteredInfra.map((f) => (
              <div
                key={f.id}
                onClick={() => onSelectFeature(f)}
                className="p-3 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-100 group-hover:text-sky-300 font-mono">
                    {f.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                    {f.layer}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-slate-400 mb-1">
                  {f.category} • <span className="text-emerald-400">{f.status || 'Active'}</span>
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 5. Dossier Tab */}
        {activeTab === 'dossier' && (
          <div>
            {!selectedFeature ? (
              <div className="text-center py-16 px-4 space-y-3">
                <Crosshair size={32} className="mx-auto text-slate-600 animate-pulse" />
                <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                  NO FEATURE SELECTED
                </h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Click on any marker, military base, nuclear plant, or conflict zone on the map to review full tactical intelligence.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Back button */}
                <button
                  onClick={() => setActiveTab('feed')}
                  className="flex items-center gap-1 text-[11px] font-mono text-sky-400 hover:underline mb-1"
                >
                  <ChevronLeft size={14} /> Back to Live Feed
                </button>

                {/* Title & Badges */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    {isHotspot && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-orange-500/20 text-orange-400 border border-orange-500/30 uppercase font-bold">
                        Level {(selectedFeature as IntelHotspot).escalationScore}/5 Hotspot
                      </span>
                    )}
                    {isConflict && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30 uppercase font-bold">
                        Active War Frontline
                      </span>
                    )}
                    {isStandardFeature && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase font-bold">
                        {(selectedFeature as MapFeatureItem).layer} Layer
                      </span>
                    )}
                    {'severity' in selectedFeature && selectedFeature.severity && (
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                        selectedFeature.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        selectedFeature.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      }`}>
                        {selectedFeature.severity}
                      </span>
                    )}
                  </div>

                  <h1 className="text-base font-bold text-slate-100 font-sans tracking-tight leading-snug">
                    {selectedFeature.name}
                  </h1>

                  {'category' in selectedFeature && selectedFeature.category && (
                    <p className="text-xs font-mono text-cyan-400/90 mt-0.5">
                      {selectedFeature.category}
                    </p>
                  )}
                </div>

                {/* Location & Coordinates Action Bar */}
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <MapPin size={14} className="text-sky-400" />
                    <span>
                      {featureCoords[1].toFixed(4)}°N, {featureCoords[0].toFixed(4)}°E
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCoords}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                      title="Copy Coordinates"
                    >
                      {copiedCoords ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => onCenterMap(featureCoords)}
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
                    {selectedFeature.description}
                  </p>
                </div>

                {/* Specific Details Table */}
                {'details' in selectedFeature && selectedFeature.details && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      OPERATIONAL PARAMETERS
                    </h3>
                    <div className="rounded-lg bg-slate-950/60 border border-slate-800/80 overflow-hidden text-xs font-mono">
                      {Object.entries(selectedFeature.details).map(([key, val], idx) => {
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
                {'whyItMatters' in selectedFeature && (selectedFeature as IntelHotspot).whyItMatters && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                      STRATEGIC SIGNIFICANCE
                    </h3>
                    <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200/90 leading-relaxed">
                      {(selectedFeature as IntelHotspot).whyItMatters}
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
                      {(selectedFeature as ConflictZoneFeature).parties.map((party, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-900/80 border border-slate-800 text-slate-200">
                          ⚔️ {party}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Incidents for Hotspots */}
                {isHotspot && (selectedFeature as IntelHotspot).recentIncidents && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      RECENT ESCALATION INCIDENTS
                    </h3>
                    <div className="space-y-1 text-xs">
                      {(selectedFeature as IntelHotspot).recentIncidents?.map((inc, idx) => (
                        <div key={idx} className="p-2 rounded bg-slate-900/60 border border-slate-800/60 text-slate-300">
                          • {inc}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Attribution / External Source */}
                {'source' in selectedFeature && selectedFeature.source && (
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] font-mono text-slate-500">
                    <span>SOURCE: {selectedFeature.source}</span>
                    {'link' in selectedFeature && selectedFeature.link && (
                      <a
                        href={selectedFeature.link}
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
            )}
          </div>
        )}
      </div>
    </aside>
  );
};
