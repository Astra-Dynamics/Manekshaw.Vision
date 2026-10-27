import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Flame,
  Radio,
  ChevronRight,
  X,
  MapPin,
  ExternalLink,
  Copy,
  CheckCircle,
  Crosshair,
  SlidersHorizontal,
  ChevronLeft,
  Tv,
  Play,
  PlaySquare
} from 'lucide-react';
import {
  IntelHotspot,
  ConflictZoneFeature,
  MapFeatureItem,
  IntelNewsItem,
  StrategicFeature,
  GpsJammingZone,
  AdizZoneFeature,
  FortifiedBorderFeature
} from '../types';
import { STRATEGIC_VIDEO_DISPATCHES, VideoNewsItem } from '../data/videoNews';

interface RightIntelligencePanelProps {
  isOpen: boolean;
  onClose: () => void;
  hotspots: IntelHotspot[];
  conflicts: ConflictZoneFeature[];
  features: MapFeatureItem[];
  news: IntelNewsItem[];
  selectedFeature: StrategicFeature | null;
  onSelectFeature: (feature: StrategicFeature) => void;
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
  const [activeTab, setActiveTab] = useState<'feed' | 'videos' | 'hotspots' | 'conflicts' | 'infra' | 'dossier'>('feed');
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

  const filteredVideos = useMemo(() => {
    return STRATEGIC_VIDEO_DISPATCHES.filter((v) => {
      return (
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery]);

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
  const isConflict = selectedFeature && 'parties' in selectedFeature && 'casualties' in selectedFeature;
  const isAdiz = selectedFeature && 'authority' in selectedFeature;
  const isGpsJamming = selectedFeature && 'attenuationPercent' in selectedFeature;
  const isFortified = selectedFeature && 'theater' in selectedFeature && 'forces' in selectedFeature;
  const isStandardFeature = selectedFeature && 'layer' in selectedFeature;

  const tabs: { id: 'feed' | 'videos' | 'hotspots' | 'conflicts' | 'infra' | 'dossier'; label: string; count?: number }[] = [
    { id: 'feed', label: 'Feed', count: filteredNews.length },
    { id: 'videos', label: 'Videos', count: filteredVideos.length },
    { id: 'hotspots', label: 'Hotspots', count: filteredHotspots.length },
    { id: 'conflicts', label: 'Wars', count: filteredConflicts.length },
    { id: 'infra', label: 'Assets', count: filteredInfra.length },
    { id: 'dossier', label: 'Dossier' }
  ];

  return (
    <aside className="w-full h-full flex flex-col bg-transparent select-none transition-colors">
      {/* 1. Header Desk Bar */}
      <div className="px-3.5 py-2.5 border-b border-[var(--hud-border)] flex items-center justify-between bg-[var(--bg-surface-subtle)]/80">
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-sky-400" />
          <h2 className="hud-micro-header text-zinc-200">
            INTELLIGENCE DESK
          </h2>
        </div>
        <button
          onClick={onClose}
          title="Collapse Panel"
          className="p-1 rounded-lg hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* 2. Modern Segmented Tab Bar */}
      <div className="p-2 border-b border-[var(--hud-border)] bg-[var(--bg-surface-subtle)]/60">
        <div className="flex items-center gap-0.5 bg-[var(--bg-surface-elevated)]/80 rounded-lg p-0.5 border border-[var(--hud-border)] font-sans text-[12px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-1 px-1 rounded text-center transition-all relative font-medium truncate ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-400 font-semibold border border-sky-500/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.id === 'dossier' && selectedFeature && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 absolute top-1 right-1 shadow-[0_0_6px_#10b981]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sleek Search and Filter Bar */}
      {activeTab !== 'dossier' && (
        <div className="p-2.5 border-b border-[var(--hud-border)] flex items-center gap-2 bg-[var(--bg-surface-subtle)]/40">
          <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[var(--bg-surface-elevated)]/80 border border-[var(--hud-border)] focus-within:border-sky-500/70 transition-colors shadow-2xs">
            <Search size={13} className="text-[var(--text-muted)] shrink-0" />
            <input
              type="text"
              placeholder={activeTab === 'videos' ? "Search defense video dispatches..." : "Search intel reports, assets..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none font-sans"
            />
          </div>

          {activeTab !== 'videos' && (
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-[var(--bg-surface-elevated)] border border-[var(--hud-border)] rounded-md px-2 py-1.5 text-[11px] text-[var(--text-secondary)] font-mono focus:outline-none focus:border-sky-500/70"
            >
              <option value="all">All Levels</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
            </select>
          )}
        </div>
      )}

      {/* 4. Tab Panels */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3 feed-scrollbar">
        {/* 1. Feed Tab */}
        {activeTab === 'feed' && (
          <div className="space-y-3">
            {filteredNews.length === 0 ? (
              <div className="text-center py-16 text-xs text-[var(--text-muted)] font-mono">
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
                  className="p-[14px_16px] rounded-lg bg-[var(--bg-surface-elevated)]/90 hover:bg-[var(--bg-surface-hover)] border border-[var(--hud-border)] border-b border-b-white/[0.06] hover:border-sky-500/40 shadow-xs transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span
                      className={`text-[11px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                        item.severity === 'critical'
                          ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          : item.severity === 'high'
                          ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                          : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                      }`}
                    >
                      {item.category} • {item.severity}
                    </span>
                    <span className="text-[11px] font-mono text-[var(--text-muted)]">{item.timeAgo}</span>
                  </div>

                  <h3 className="text-[13.5px] font-semibold text-[#F8FAFC] group-hover:text-sky-400 leading-[1.35] mb-1.5 font-sans">
                    {item.title}
                  </h3>

                  <p className="text-[12px] text-[#94A3B8] line-clamp-2 leading-[1.5] font-sans">
                    {item.summary}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[var(--hud-border)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                    <div className="flex items-center gap-2">
                      <span>{item.source}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = (item as any).link || `https://news.google.com/search?q=${encodeURIComponent(item.title + ' ' + item.source)}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[var(--bg-surface)] hover:bg-sky-500/20 text-sky-400 border border-[var(--hud-border)] hover:border-sky-500/40 transition-colors shadow-xs"
                        title="Open source report in new tab"
                      >
                        <span>To Source</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>

                    <span className="flex items-center gap-1 text-sky-400 group-hover:translate-x-0.5 transition-transform font-bold">
                      Inspect & Map <ChevronRight size={11} />
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 2. Video Feed Tab */}
        {activeTab === 'videos' && (
          <div className="space-y-3.5">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/25 flex items-center gap-2 text-xs font-mono text-sky-500 font-bold">
              <Tv size={15} className="shrink-0" />
              <span>LIVE STRATEGIC BROADCASTS & VIDEO BRIEFS</span>
            </div>

            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => window.open(video.youtubeUrl, '_blank', 'noopener,noreferrer')}
                className="rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-red-500/50 shadow-xs transition-all cursor-pointer group overflow-hidden"
              >
                {/* Thumbnail Preview with Play Icon Overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-11 h-11 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 flex items-center justify-center text-white shadow-xl transition-all">
                      <Play size={18} className="fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Live or Duration Badge */}
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    {video.isLive ? (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-600 text-white text-[10px] font-mono font-bold uppercase tracking-wider animate-pulse shadow-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-white" />
                        LIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-mono">
                        {video.duration}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded-md bg-slate-900/80 text-sky-300 border border-sky-500/30 text-[9px] font-mono font-semibold">
                      {video.category}
                    </span>
                  </div>

                  <span className="absolute bottom-2.5 right-2.5 px-1.5 py-0.5 rounded-md bg-black/80 text-slate-300 text-[10px] font-mono">
                    {video.channel}
                  </span>
                </div>

                {/* Video Info Content */}
                <div className="p-3.5 space-y-1.5">
                  <h3 className="text-xs font-bold text-[var(--text-primary)] group-hover:text-red-500 transition-colors leading-snug">
                    {video.title}
                  </h3>
                  <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-sans">
                    {video.description}
                  </p>
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[10px] font-mono text-[var(--text-muted)]">
                    <span>{video.timeAgo}</span>
                    <span className="inline-flex items-center gap-1 text-red-500 group-hover:underline font-bold">
                      Watch on YouTube <ExternalLink size={10} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. Hotspots Tab */}
        {activeTab === 'hotspots' && (
          <div className="space-y-3">
            {filteredHotspots.map((hs) => (
              <div
                key={hs.id}
                onClick={() => onSelectFeature(hs)}
                className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-orange-500/50 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Flame size={14} className="text-orange-400" />
                    <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-orange-400 font-mono">
                      {hs.name}
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-mono px-2 py-0.5 rounded-md font-extrabold ${
                      hs.escalationScore >= 5
                        ? 'bg-red-500/20 text-red-500 border border-red-500/40'
                        : hs.escalationScore >= 4
                        ? 'bg-orange-500/20 text-orange-500 border border-orange-500/40'
                        : 'bg-yellow-500/20 text-yellow-500 border border-yellow-500/40'
                    }`}
                  >
                    LEVEL {hs.escalationScore}/5 • {hs.escalationTrend}
                  </span>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] mb-2 leading-relaxed font-sans">
                  {hs.description}
                </p>

                <div className="bg-[var(--bg-surface)] p-2.5 rounded-lg border border-[var(--border-subtle)] text-[10px] text-[var(--text-muted)]">
                  <span className="text-orange-400 font-mono font-semibold">Strategic Impact:</span>{' '}
                  {hs.whyItMatters}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Conflicts Tab */}
        {activeTab === 'conflicts' && (
          <div className="space-y-3">
            {filteredConflicts.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectFeature(c)}
                className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-red-500/50 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-red-500 font-mono">
                    {c.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-red-500/20 text-red-500 border border-red-500/30 uppercase font-bold">
                    {c.intensity}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-[var(--text-muted)] mb-1.5">
                  Belligerents: <span className="text-[var(--text-primary)] font-semibold">{c.parties.join(' vs ')}</span>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed mb-2 font-sans">
                  {c.description}
                </p>

                {c.casualties && (
                  <div className="text-[10px] font-mono text-amber-500 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    Est. Casualties: {c.casualties}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 5. Assets Tab */}
        {activeTab === 'infra' && (
          <div className="space-y-3">
            {filteredInfra.map((f) => (
              <div
                key={f.id}
                onClick={() => onSelectFeature(f)}
                className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-sky-500/50 transition-all cursor-pointer group shadow-xs"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-[var(--text-primary)] group-hover:text-sky-400 font-mono">
                    {f.name}
                  </span>
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-[var(--bg-surface)] text-[var(--text-secondary)] border border-[var(--border-subtle)] uppercase">
                    {f.layer}
                  </span>
                </div>

                <div className="text-[10px] font-mono text-[var(--text-muted)] mb-1">
                  {f.category} • <span className="text-emerald-500 font-semibold">{f.status || 'Active'}</span>
                </div>

                <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed font-sans">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 6. Dossier Tab */}
        {activeTab === 'dossier' && (
          <div>
            {!selectedFeature ? (
              <div className="text-center py-20 px-4 space-y-3">
                <Crosshair size={32} className="mx-auto text-[var(--text-muted)] animate-pulse" />
                <h4 className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                  NO ENTITY SELECTED
                </h4>
                <p className="text-xs text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed">
                  Click any hotspot, military deployment, conflict zone, or infrastructure node on the map to inspect its full dossier.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Back button */}
                <button
                  onClick={() => setActiveTab('feed')}
                  className="flex items-center gap-1 text-[11px] font-mono text-sky-500 hover:underline mb-1"
                >
                  <ChevronLeft size={13} /> Back to Live Feed
                </button>

                {/* Title & Badges */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] shadow-xs space-y-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isHotspot && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-orange-500/20 text-orange-500 border border-orange-500/30 uppercase font-bold">
                        Level {(selectedFeature as IntelHotspot).escalationScore}/5 Hotspot
                      </span>
                    )}
                    {isConflict && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-red-500/20 text-red-500 border border-red-500/30 uppercase font-bold">
                        Frontline Conflict
                      </span>
                    )}
                    {isAdiz && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/30 uppercase font-bold">
                        Air Defense Zone (ADIZ)
                      </span>
                    )}
                    {isGpsJamming && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 uppercase font-bold">
                        Electronic Warfare / Jamming
                      </span>
                    )}
                    {isFortified && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase font-bold">
                        Fortified Demarcation
                      </span>
                    )}
                    {isStandardFeature && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/20 text-sky-500 border border-sky-500/30 uppercase font-bold">
                        {(selectedFeature as MapFeatureItem).layer} Layer
                      </span>
                    )}
                    {'severity' in selectedFeature && selectedFeature.severity && (
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-md uppercase font-bold ${
                          selectedFeature.severity === 'critical'
                            ? 'bg-red-500/20 text-red-500 border border-red-500/30'
                            : selectedFeature.severity === 'high'
                            ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                            : 'bg-blue-500/20 text-sky-500 border border-blue-500/30'
                        }`}
                      >
                        {selectedFeature.severity}
                      </span>
                    )}
                  </div>

                  <h1 className="text-base font-bold text-[var(--text-primary)] font-sans tracking-tight leading-snug">
                    {selectedFeature.name}
                  </h1>

                  {'category' in selectedFeature && selectedFeature.category && (
                    <p className="text-xs font-mono text-sky-500">
                      {selectedFeature.category}
                    </p>
                  )}
                </div>

                {/* Location & Coordinates Action Bar */}
                <div className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-between text-xs font-mono shadow-xs">
                  <div className="flex items-center gap-1.5 text-[var(--text-primary)]">
                    <MapPin size={13} className="text-sky-500" />
                    <span>
                      {featureCoords[1].toFixed(4)}°N, {featureCoords[0].toFixed(4)}°E
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyCoords}
                      className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      title="Copy Coordinates"
                    >
                      {copiedCoords ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => onCenterMap(featureCoords)}
                      className="px-2.5 py-1 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] transition-colors"
                    >
                      Center
                    </button>
                  </div>
                </div>

                {/* Primary Description */}
                <div className="space-y-1">
                  <h3 className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                    SITUATION BRIEFING
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)] leading-relaxed bg-[var(--bg-surface-elevated)] p-3 rounded-xl border border-[var(--border-subtle)] shadow-xs font-sans">
                    {selectedFeature.description}
                  </p>
                </div>

                {/* Specific Details Table */}
                {'details' in selectedFeature && selectedFeature.details && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                      OPERATIONAL PARAMETERS
                    </h3>
                    <div className="rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] overflow-hidden text-xs font-mono shadow-xs">
                      {Object.entries(selectedFeature.details).map(([key, val], idx) => {
                        if (typeof val === 'object') return null;
                        return (
                          <div
                            key={key}
                            className={`flex items-center justify-between p-2.5 ${
                              idx !== 0 ? 'border-t border-[var(--border-subtle)]' : ''
                            }`}
                          >
                            <span className="text-[var(--text-muted)] capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span className="text-[var(--text-primary)] font-semibold text-right max-w-[60%] truncate">
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
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold text-amber-500 uppercase tracking-wider">
                      STRATEGIC SIGNIFICANCE
                    </h3>
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-xs text-amber-600 dark:text-amber-300 leading-relaxed font-sans shadow-xs">
                      {(selectedFeature as IntelHotspot).whyItMatters}
                    </div>
                  </div>
                )}

                {/* Conflict parties and casualties */}
                {isConflict && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-mono font-bold text-red-500 uppercase tracking-wider">
                      COMBAT ACTORS
                    </h3>
                    <div className="space-y-1 text-xs font-mono">
                      {(selectedFeature as ConflictZoneFeature).parties.map((party, idx) => (
                        <div key={idx} className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)] shadow-xs">
                          ⚔️ {party}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* ADIZ Details */}
                {isAdiz && (
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider">
                        COMMANDING AIR AUTHORITY
                      </h3>
                      <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/25 text-xs text-[var(--text-primary)] font-mono font-bold">
                        {(selectedFeature as AdizZoneFeature).authority}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        RULES OF ENGAGEMENT & PROTOCOLS
                      </h3>
                      <p className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] font-sans leading-relaxed">
                        {(selectedFeature as AdizZoneFeature).rules}
                      </p>
                    </div>
                  </div>
                )}

                {/* GPS Jamming Details */}
                {isGpsJamming && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-400">GNSS SIGNAL ATTENUATION</span>
                      <span className="text-sm font-mono font-extrabold text-cyan-300">
                        {(selectedFeature as GpsJammingZone).attenuationPercent}% LOSS
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        DETECTED EW SYSTEMS
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedFeature as GpsJammingZone).systemsDetected?.map((sys: string, idx: number) => (
                          <span key={idx} className="px-2 py-1 rounded-md text-[11px] font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                            📡 {sys}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        AFFECTED FREQUENCIES
                      </h3>
                      <div className="p-2.5 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-secondary)]">
                        {(selectedFeature as GpsJammingZone).frequencies?.join(' • ')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fortified Border Details */}
                {isFortified && (
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-amber-500">LINE LENGTH</span>
                      <span className="text-sm font-mono font-extrabold text-amber-400">
                        {(selectedFeature as FortifiedBorderFeature).lengthKm} KM
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        MILITARY STATUS
                      </h3>
                      <p className="p-3 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] font-mono font-semibold">
                        {(selectedFeature as FortifiedBorderFeature).status}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        DEPLOYED FORCES & CORPS
                      </h3>
                      <div className="space-y-1 text-xs font-mono">
                        {(selectedFeature as FortifiedBorderFeature).forces?.map((f: string, idx: number) => (
                          <div key={idx} className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-primary)]">
                            🛡️ {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Attribution / External Source */}
                {'source' in selectedFeature && selectedFeature.source && (
                  <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)]">
                    <span>SOURCE: {selectedFeature.source}</span>
                    {'link' in selectedFeature && selectedFeature.link && (
                      <a
                        href={selectedFeature.link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-sky-500 hover:underline"
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
