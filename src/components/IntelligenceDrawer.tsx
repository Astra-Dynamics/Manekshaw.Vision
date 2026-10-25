import React, { useState, useMemo } from 'react';
import {
  Search,
  Flame,
  ShieldAlert,
  Radio,
  Building,
  Target,
  ChevronRight,
  Filter,
  X
} from 'lucide-react';
import { IntelHotspot, ConflictZoneFeature, MapFeatureItem, IntelNewsItem } from '../types';

interface IntelligenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  hotspots: IntelHotspot[];
  conflicts: ConflictZoneFeature[];
  features: MapFeatureItem[];
  news: IntelNewsItem[];
  onSelectFeature: (feature: MapFeatureItem | IntelHotspot | ConflictZoneFeature) => void;
}

export const IntelligenceDrawer: React.FC<IntelligenceDrawerProps> = ({
  isOpen,
  onClose,
  hotspots,
  conflicts,
  features,
  news,
  onSelectFeature
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'hotspots' | 'conflicts' | 'infra'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

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

  return (
    <div className="absolute top-16 left-0 bottom-0 w-full sm:w-96 md:w-[420px] bg-[#0c1017]/95 border-r border-[#38bdf8]/20 z-20 flex flex-col backdrop-blur-xl shadow-2xl transition-all select-none">
      {/* Top Header of Drawer */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Radio size={16} className="text-sky-400 animate-pulse" />
          <h2 className="text-xs font-mono font-bold text-slate-100 uppercase tracking-wider">
            SITUATIONAL INTELLIGENCE DESK
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200"
        >
          <X size={16} />
        </button>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-800 text-[11px] font-mono">
        <button
          onClick={() => setActiveTab('feed')}
          className={`py-2 px-1 text-center transition-all ${
            activeTab === 'feed'
              ? 'text-sky-400 border-b-2 border-sky-400 font-bold bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Feed ({filteredNews.length})
        </button>
        <button
          onClick={() => setActiveTab('hotspots')}
          className={`py-2 px-1 text-center transition-all ${
            activeTab === 'hotspots'
              ? 'text-orange-400 border-b-2 border-orange-400 font-bold bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Hotspots ({filteredHotspots.length})
        </button>
        <button
          onClick={() => setActiveTab('conflicts')}
          className={`py-2 px-1 text-center transition-all ${
            activeTab === 'conflicts'
              ? 'text-red-400 border-b-2 border-red-400 font-bold bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Wars ({filteredConflicts.length})
        </button>
        <button
          onClick={() => setActiveTab('infra')}
          className={`py-2 px-1 text-center transition-all ${
            activeTab === 'infra'
              ? 'text-cyan-400 border-b-2 border-cyan-400 font-bold bg-slate-900/60'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Assets ({filteredInfra.length})
        </button>
      </div>

      {/* Search and Filter Inputs */}
      <div className="p-2.5 border-b border-slate-800/80 flex items-center gap-2 bg-slate-900/40">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search keywords, coords, tags..."
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

      {/* Tab Content Panels */}
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {/* Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-2">
            {filteredNews.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-500 font-mono">
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
                  className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/90 hover:border-sky-500/40 transition-all cursor-pointer group"
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

                  <div className="mt-2 pt-1.5 border-t border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
                    <span>SRC: {item.source}</span>
                    <span className="flex items-center gap-1 text-sky-400 group-hover:translate-x-0.5 transition-transform">
                      Inspect & Map <ChevronRight size={10} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Hotspots Tab */}
        {activeTab === 'hotspots' && (
          <div className="space-y-2">
            {filteredHotspots.map((hs) => (
              <div
                key={hs.id}
                onClick={() => onSelectFeature(hs)}
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/40 transition-all cursor-pointer group"
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

                <div className="bg-slate-950/60 p-1.5 rounded border border-slate-800/60 text-[10px] text-slate-400">
                  <span className="text-orange-400/90 font-mono font-semibold">Strategic Impact:</span>{' '}
                  {hs.whyItMatters}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Conflicts Tab */}
        {activeTab === 'conflicts' && (
          <div className="space-y-2">
            {filteredConflicts.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectFeature(c)}
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-red-500/40 transition-all cursor-pointer group"
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

        {/* Critical Infrastructure & Assets Tab */}
        {activeTab === 'infra' && (
          <div className="space-y-2">
            {filteredInfra.map((f) => (
              <div
                key={f.id}
                onClick={() => onSelectFeature(f)}
                className="p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer group"
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
      </div>
    </div>
  );
};
