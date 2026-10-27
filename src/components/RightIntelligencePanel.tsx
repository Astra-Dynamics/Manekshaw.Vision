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
    <aside
      className="w-full h-full flex flex-col select-none transition-colors"
      style={{
        background: 'var(--bg-surface)',
        color: 'var(--text-primary)'
      }}
    >
      {/* 1. Header Desk Bar */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: '12px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-subtle)'
        }}
      >
        <div className="flex items-center gap-2">
          <Radio size={14} className="text-sky-500" />
          <h2 className="hud-micro-header" style={{ color: 'var(--text-primary)' }}>
            INTELLIGENCE DESK
          </h2>
        </div>
        <button
          onClick={onClose}
          title="Collapse Panel"
          className="p-1 rounded hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <X size={15} />
        </button>
      </div>

      {/* 2. Modern Segmented Tab Bar */}
      <div
        style={{
          padding: '6px 8px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-subtle)'
        }}
      >
        <div className="flex items-center gap-0.5 bg-[var(--bg-surface-elevated)] rounded p-0.5 border border-[var(--border-subtle)] font-sans text-[11.5px]">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 rounded-[2px] text-center transition-all relative font-medium ${
                  isActive
                    ? 'font-semibold shadow-xs'
                    : 'hover:bg-[var(--bg-surface-hover)]'
                }`}
                style={{
                  background: isActive ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                  color: isActive ? '#0284c7' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(14, 165, 233, 0.4)' : '1px solid transparent',
                  padding: '4px 6px',
                  fontSize: '11.5px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span>{tab.label}</span>
                {tab.id === 'dossier' && selectedFeature && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 absolute top-1 right-1 shadow-[0_0_6px_#10b981]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sleek Search and Filter Bar */}
      <div
        className="flex items-center gap-2"
        style={{
          padding: '10px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-surface-subtle)'
        }}
      >
        <div className="flex-1 flex items-center gap-2 px-2.5 py-1.5 rounded-[2px] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] focus-within:border-sky-500 transition-colors shadow-2xs">
          <Search size={13} className="text-[var(--text-muted)] shrink-0" />
          <input
            type="text"
            placeholder={activeTab === 'videos' ? "Search defense video dispatches..." : "Search intel reports, assets..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs placeholder:text-[var(--text-muted)] focus:outline-none font-sans"
            style={{ color: 'var(--text-primary)' }}
          />
        </div>

        {activeTab !== 'videos' && (
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-[2px] px-2 py-1.5 text-[11px] font-mono focus:outline-none focus:border-sky-500"
            style={{ color: 'var(--text-secondary)' }}
          >
            <option value="all">All Levels</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
          </select>
        )}
      </div>

      {/* 4. Tab Panels */}
      <div className="flex-1 overflow-y-auto feed-scrollbar">
        {/* 1. Feed Tab */}
        {activeTab === 'feed' && (
          <div>
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
                  className="palantir-feed-card cursor-pointer group"
                  style={{
                    padding: '16px 22px',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)'
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-[6px]">
                    <span
                      className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] font-bold uppercase tracking-[0.05em]"
                      style={{
                        background:
                          item.severity === 'critical'
                            ? 'var(--badge-bg-critical)'
                            : item.severity === 'high'
                            ? 'var(--badge-bg-high)'
                            : 'var(--badge-bg-info)',
                        color:
                          item.severity === 'critical'
                            ? 'var(--badge-text-critical)'
                            : item.severity === 'high'
                            ? 'var(--badge-text-high)'
                            : 'var(--badge-text-info)',
                        border:
                          item.severity === 'critical'
                            ? '1px solid var(--badge-border-critical)'
                            : item.severity === 'high'
                            ? '1px solid var(--badge-border-high)'
                            : '1px solid var(--badge-border-info)',
                        textShadow:
                          item.severity === 'critical'
                            ? '0 0 6px rgba(244, 63, 94, 0.35)'
                            : item.severity === 'high'
                            ? '0 0 6px rgba(245, 158, 11, 0.35)'
                            : 'none'
                      }}
                    >
                      {item.category} • {item.severity}
                    </span>
                    <span className="text-[10.5px] font-mono text-[var(--text-muted)]">{item.timeAgo}</span>
                  </div>

                  <h3
                    className="text-[13.5px] font-semibold group-hover:text-sky-500 leading-[1.35] mb-[6px] font-sans"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {item.title}
                  </h3>

                  <p
                    className="text-[12px] line-clamp-2 leading-[1.5] font-sans mb-[8px]"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.summary}
                  </p>

                  <div
                    className="mt-2.5 pt-2 text-[11px] font-mono"
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      whiteSpace: 'nowrap',
                      gap: '8px'
                    }}
                  >
                    <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
                      <span
                        className="truncate text-[10.5px]"
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          minWidth: 0
                        }}
                        title={item.source}
                      >
                        {item.source}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const url = (item as any).link || `https://news.google.com/search?q=${encodeURIComponent(item.title + ' ' + item.source)}`;
                          window.open(url, '_blank', 'noopener,noreferrer');
                        }}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-[var(--bg-surface)] hover:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-[var(--border-subtle)] hover:border-sky-500/40 transition-colors shadow-2xs shrink-0 text-[10px]"
                        title="Open source report in new tab"
                      >
                        <span>To Source</span>
                        <ExternalLink size={10} />
                      </button>
                    </div>

                    <span className="flex items-center gap-1 text-sky-600 dark:text-sky-400 group-hover:translate-x-0.5 transition-transform font-bold text-[10.5px] shrink-0">
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
          <div className="space-y-0">
            <div
              className="flex items-center gap-2 text-xs font-mono text-sky-500 font-bold border-b border-[var(--border-subtle)]"
              style={{ padding: '12px 22px', background: 'rgba(14, 165, 233, 0.08)' }}
            >
              <Tv size={14} className="shrink-0" />
              <span>LIVE STRATEGIC BROADCASTS & VIDEO BRIEFS</span>
            </div>

            {filteredVideos.map((video) => (
              <div
                key={video.id}
                onClick={() => window.open(video.youtubeUrl, '_blank', 'noopener,noreferrer')}
                className="palantir-feed-card cursor-pointer group"
                style={{
                  padding: '16px 22px',
                  boxSizing: 'border-box',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)'
                }}
              >
                {/* Thumbnail Preview with Play Icon Overlay */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950 rounded-[2px] mb-3">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-red-600/90 group-hover:bg-red-600 group-hover:scale-110 flex items-center justify-center text-white shadow-xl transition-all">
                      <Play size={16} className="fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Live or Duration Badge */}
                  <div className="absolute top-2 left-2 flex items-center gap-1.5">
                    {video.isLive ? (
                      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-red-600 text-white text-[9.5px] font-mono font-bold uppercase tracking-wider animate-pulse shadow-md">
                        <span className="w-1 h-1 rounded-full bg-white" />
                        LIVE
                      </span>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-black/80 text-white text-[9.5px] font-mono">
                        {video.duration}
                      </span>
                    )}
                    <span className="px-1.5 py-0.5 rounded-[2px] bg-slate-900/80 text-sky-300 border border-sky-500/30 text-[9px] font-mono font-semibold">
                      {video.category}
                    </span>
                  </div>

                  <span className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-[2px] bg-black/80 text-slate-300 text-[9.5px] font-mono">
                    {video.channel}
                  </span>
                </div>

                {/* Video Info Content */}
                <div className="space-y-1.5">
                  <h3
                    className="text-[13px] font-semibold group-hover:text-red-500 transition-colors leading-[1.35] font-sans"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {video.title}
                  </h3>
                  <p
                    className="text-[12px] line-clamp-2 leading-[1.5] font-sans"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {video.description}
                  </p>
                  <div
                    className="pt-2 flex items-center justify-between text-[10.5px] font-mono"
                    style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
                  >
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
          <div className="space-y-0">
            {filteredHotspots.map((hs) => (
              <div
                key={hs.id}
                onClick={() => onSelectFeature(hs)}
                className="palantir-feed-card cursor-pointer group"
                style={{
                  padding: '16px 22px',
                  boxSizing: 'border-box',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Flame size={13} className="text-orange-500" />
                    <span
                      className="text-[13px] font-semibold group-hover:text-orange-500 font-sans"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {hs.name}
                    </span>
                  </div>
                  <span
                    className="text-[9.5px] font-mono px-2 py-0.5 rounded-[2px] font-bold uppercase tracking-[0.05em]"
                    style={{
                      background: hs.escalationScore >= 5 ? 'var(--badge-bg-critical)' : hs.escalationScore >= 4 ? 'var(--badge-bg-high)' : 'var(--badge-bg-info)',
                      color: hs.escalationScore >= 5 ? 'var(--badge-text-critical)' : hs.escalationScore >= 4 ? 'var(--badge-text-high)' : 'var(--badge-text-info)',
                      border: hs.escalationScore >= 5 ? '1px solid var(--badge-border-critical)' : hs.escalationScore >= 4 ? '1px solid var(--badge-border-high)' : '1px solid var(--badge-border-info)',
                      textShadow: hs.escalationScore >= 5 ? '0 0 6px rgba(244, 63, 94, 0.35)' : hs.escalationScore >= 4 ? '0 0 6px rgba(245, 158, 11, 0.35)' : 'none'
                    }}
                  >
                    LEVEL {hs.escalationScore}/5 • {hs.escalationTrend}
                  </span>
                </div>

                <p
                  className="text-[12px] leading-[1.5] font-sans mb-2"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {hs.description}
                </p>

                <div
                  className="p-2.5 rounded-[2px] border text-[11px]"
                  style={{
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-muted)'
                  }}
                >
                  <span className="text-orange-500 font-mono font-semibold">Strategic Impact:</span>{' '}
                  <span style={{ color: 'var(--text-secondary)' }}>{hs.whyItMatters}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 4. Conflicts Tab */}
        {activeTab === 'conflicts' && (
          <div className="space-y-0">
            {filteredConflicts.map((c) => (
              <div
                key={c.id}
                onClick={() => onSelectFeature(c)}
                className="palantir-feed-card cursor-pointer group"
                style={{
                  padding: '16px 22px',
                  boxSizing: 'border-box',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)'
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className="text-[13px] font-semibold group-hover:text-rose-500 font-sans"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {c.name}
                  </span>
                  <span
                    className="text-[9.5px] font-mono px-2 py-0.5 rounded-[2px] uppercase font-bold tracking-[0.05em]"
                    style={{
                      background: 'var(--badge-bg-critical)',
                      color: 'var(--badge-text-critical)',
                      border: '1px solid var(--badge-border-critical)',
                      textShadow: '0 0 6px rgba(244, 63, 94, 0.35)'
                    }}
                  >
                    {c.intensity}
                  </span>
                </div>

                <div className="text-[10.5px] font-mono mb-2" style={{ color: 'var(--text-muted)' }}>
                  Belligerents: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{c.parties.join(' vs ')}</span>
                </div>

                <p
                  className="text-[12px] leading-[1.5] mb-2 font-sans"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {c.description}
                </p>

                {c.casualties && (
                  <div
                    className="text-[10.5px] font-mono px-2.5 py-1 rounded-[2px] border"
                    style={{
                      background: 'rgba(245, 158, 11, 0.08)',
                      borderColor: 'rgba(245, 158, 11, 0.3)',
                      color: '#d97706'
                    }}
                  >
                    Est. Casualties: {c.casualties}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* 5. Assets Tab */}
        {activeTab === 'infra' && (
          <div className="space-y-0">
            {filteredInfra.map((f) => (
              <div
                key={f.id}
                onClick={() => onSelectFeature(f)}
                className="palantir-feed-card cursor-pointer group"
                style={{
                  padding: '16px 22px',
                  boxSizing: 'border-box',
                  borderBottom: '1px solid var(--border-subtle)',
                  background: 'var(--bg-surface-elevated)'
                }}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[13px] font-semibold group-hover:text-sky-500 font-sans"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {f.name}
                  </span>
                  <span
                    className="text-[9.5px] font-mono px-2 py-0.5 rounded-[2px] uppercase"
                    style={{
                      background: 'var(--bg-surface)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-subtle)'
                    }}
                  >
                    {f.layer}
                  </span>
                </div>

                <div className="text-[10.5px] font-mono mb-1.5" style={{ color: 'var(--text-muted)' }}>
                  {f.category} • <span className="text-emerald-500 font-semibold">{f.status || 'Active'}</span>
                </div>

                <p
                  className="text-[12px] leading-[1.5] font-sans"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* 6. Dossier Tab */}
        {activeTab === 'dossier' && (
          <div style={{ padding: '16px 22px', boxSizing: 'border-box' }}>
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
                <div
                  className="p-3.5 rounded-[2px] border space-y-2"
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {isHotspot && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-orange-500/15 text-orange-500 border border-orange-500/30 uppercase font-bold">
                        Level {(selectedFeature as IntelHotspot).escalationScore}/5 Hotspot
                      </span>
                    )}
                    {isConflict && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-rose-500/15 text-rose-500 border border-rose-500/30 uppercase font-bold">
                        Frontline Conflict
                      </span>
                    )}
                    {isAdiz && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-sky-500/15 text-sky-500 border border-sky-500/30 uppercase font-bold">
                        Air Defense Zone (ADIZ)
                      </span>
                    )}
                    {isGpsJamming && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-cyan-500/15 text-cyan-500 border border-cyan-500/30 uppercase font-bold">
                        Electronic Warfare / Jamming
                      </span>
                    )}
                    {isFortified && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-amber-500/15 text-amber-500 border border-amber-500/30 uppercase font-bold">
                        Fortified Demarcation
                      </span>
                    )}
                    {isStandardFeature && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] bg-sky-500/15 text-sky-500 border border-sky-500/30 uppercase font-bold">
                        {(selectedFeature as MapFeatureItem).layer} Layer
                      </span>
                    )}
                    {'severity' in selectedFeature && selectedFeature.severity && (
                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-[2px] uppercase font-bold"
                        style={{
                          background: selectedFeature.severity === 'critical' ? 'var(--badge-bg-critical)' : selectedFeature.severity === 'high' ? 'var(--badge-bg-high)' : 'var(--badge-bg-info)',
                          color: selectedFeature.severity === 'critical' ? 'var(--badge-text-critical)' : selectedFeature.severity === 'high' ? 'var(--badge-text-high)' : 'var(--badge-text-info)',
                          border: selectedFeature.severity === 'critical' ? '1px solid var(--badge-border-critical)' : selectedFeature.severity === 'high' ? '1px solid var(--badge-border-high)' : '1px solid var(--badge-border-info)'
                        }}
                      >
                        {selectedFeature.severity}
                      </span>
                    )}
                  </div>

                  <h1
                    className="text-base font-bold font-sans tracking-tight leading-snug"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {selectedFeature.name}
                  </h1>

                  {'category' in selectedFeature && selectedFeature.category && (
                    <p className="text-xs font-mono text-sky-500">
                      {selectedFeature.category}
                    </p>
                  )}
                </div>

                {/* Location & Coordinates Action Bar */}
                <div
                  className="p-3 rounded-[2px] border flex items-center justify-between text-xs font-mono"
                  style={{
                    background: 'var(--bg-surface-elevated)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <div className="flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                    <MapPin size={13} className="text-sky-500" />
                    <span>
                      {featureCoords[1].toFixed(4)}°N, {featureCoords[0].toFixed(4)}°E
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopyCoords}
                      className="p-1.5 rounded-[2px] hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      title="Copy Coordinates"
                    >
                      {copiedCoords ? <CheckCircle size={14} className="text-emerald-500" /> : <Copy size={14} />}
                    </button>
                    <button
                      onClick={() => onCenterMap(featureCoords)}
                      className="px-2.5 py-1 rounded-[2px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-[11px] transition-colors"
                    >
                      Center
                    </button>
                  </div>
                </div>

                {/* Primary Description */}
                <div className="space-y-1">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                    SITUATION BRIEFING
                  </h3>
                  <p
                    className="text-xs leading-relaxed p-3 rounded-[2px] border font-sans"
                    style={{
                      background: 'var(--bg-surface-elevated)',
                      borderColor: 'var(--border-subtle)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {selectedFeature.description}
                  </p>
                </div>

                {/* Specific Details Table */}
                {'details' in selectedFeature && selectedFeature.details && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                      OPERATIONAL PARAMETERS
                    </h3>
                    <div
                      className="rounded-[2px] border overflow-hidden text-xs font-mono"
                      style={{
                        background: 'var(--bg-surface-elevated)',
                        borderColor: 'var(--border-subtle)'
                      }}
                    >
                      {Object.entries(selectedFeature.details).map(([key, val], idx) => {
                        if (typeof val === 'object') return null;
                        return (
                          <div
                            key={key}
                            className={`flex items-center justify-between p-2.5 ${
                              idx !== 0 ? 'border-t border-[var(--border-subtle)]' : ''
                            }`}
                          >
                            <span style={{ color: 'var(--text-muted)' }} className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </span>
                            <span style={{ color: 'var(--text-primary)' }} className="font-semibold text-right max-w-[60%] truncate">
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
                    <div
                      className="p-3 rounded-[2px] border text-xs leading-relaxed font-sans"
                      style={{
                        background: 'rgba(245, 158, 11, 0.08)',
                        borderColor: 'rgba(245, 158, 11, 0.25)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      {(selectedFeature as IntelHotspot).whyItMatters}
                    </div>
                  </div>
                )}

                {/* Conflict parties and casualties */}
                {isConflict && (
                  <div className="space-y-1.5">
                    <h3 className="text-xs font-mono font-bold text-rose-500 uppercase tracking-wider">
                      COMBAT ACTORS
                    </h3>
                    <div className="space-y-1 text-xs font-mono">
                      {(selectedFeature as ConflictZoneFeature).parties.map((party, idx) => (
                        <div
                          key={idx}
                          className="p-2 rounded-[2px] border"
                          style={{
                            background: 'var(--bg-surface-elevated)',
                            borderColor: 'var(--border-subtle)',
                            color: 'var(--text-primary)'
                          }}
                        >
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
                      <h3 className="text-xs font-mono font-bold text-sky-500 uppercase tracking-wider">
                        COMMANDING AIR AUTHORITY
                      </h3>
                      <div
                        className="p-3 rounded-[2px] border text-xs font-mono font-bold"
                        style={{
                          background: 'rgba(14, 165, 233, 0.08)',
                          borderColor: 'rgba(14, 165, 233, 0.25)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {(selectedFeature as AdizZoneFeature).authority}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        RULES OF ENGAGEMENT & PROTOCOLS
                      </h3>
                      <p
                        className="p-3 rounded-[2px] border text-xs font-sans leading-relaxed"
                        style={{
                          background: 'var(--bg-surface-elevated)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {(selectedFeature as AdizZoneFeature).rules}
                      </p>
                    </div>
                  </div>
                )}

                {/* GPS Jamming Details */}
                {isGpsJamming && (
                  <div className="space-y-3">
                    <div
                      className="p-3 rounded-[2px] border flex items-center justify-between"
                      style={{
                        background: 'rgba(6, 182, 212, 0.08)',
                        borderColor: 'rgba(6, 182, 212, 0.25)'
                      }}
                    >
                      <span className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400">GNSS SIGNAL ATTENUATION</span>
                      <span className="text-sm font-mono font-extrabold text-cyan-600 dark:text-cyan-300">
                        {(selectedFeature as GpsJammingZone).attenuationPercent}% LOSS
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        DETECTED EW SYSTEMS
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {(selectedFeature as GpsJammingZone).systemsDetected?.map((sys: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2 py-1 rounded-[2px] text-[11px] font-mono border"
                            style={{
                              background: 'var(--bg-surface-elevated)',
                              borderColor: 'var(--border-subtle)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            📡 {sys}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        AFFECTED FREQUENCIES
                      </h3>
                      <div
                        className="p-2.5 rounded-[2px] border text-xs font-mono"
                        style={{
                          background: 'var(--bg-surface-elevated)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-secondary)'
                        }}
                      >
                        {(selectedFeature as GpsJammingZone).frequencies?.join(' • ')}
                      </div>
                    </div>
                  </div>
                )}

                {/* Fortified Border Details */}
                {isFortified && (
                  <div className="space-y-3">
                    <div
                      className="p-3 rounded-[2px] border flex items-center justify-between"
                      style={{
                        background: 'rgba(245, 158, 11, 0.08)',
                        borderColor: 'rgba(245, 158, 11, 0.25)'
                      }}
                    >
                      <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-500">LINE LENGTH</span>
                      <span className="text-sm font-mono font-extrabold text-amber-600 dark:text-amber-400">
                        {(selectedFeature as FortifiedBorderFeature).lengthKm} KM
                      </span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        MILITARY STATUS
                      </h3>
                      <p
                        className="p-3 rounded-[2px] border text-xs font-mono font-semibold"
                        style={{
                          background: 'var(--bg-surface-elevated)',
                          borderColor: 'var(--border-subtle)',
                          color: 'var(--text-primary)'
                        }}
                      >
                        {(selectedFeature as FortifiedBorderFeature).status}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                        DEPLOYED FORCES & CORPS
                      </h3>
                      <div className="space-y-1 text-xs font-mono">
                        {(selectedFeature as FortifiedBorderFeature).forces?.map((f: string, idx: number) => (
                          <div
                            key={idx}
                            className="p-2 rounded-[2px] border"
                            style={{
                              background: 'var(--bg-surface-elevated)',
                              borderColor: 'var(--border-subtle)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            🛡️ {f}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Attribution / External Source */}
                {'source' in selectedFeature && selectedFeature.source && (
                  <div
                    className="pt-2 flex items-center justify-between text-[11px] font-mono"
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)'
                    }}
                  >
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
