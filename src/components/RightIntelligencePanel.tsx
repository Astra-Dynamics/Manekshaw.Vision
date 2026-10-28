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
  PlaySquare,
  Minimize2,
  Maximize2,
  GripVertical,
  PlusSquare,
  ArrowUpRight
} from 'lucide-react';
import {
  IntelHotspot,
  ConflictZoneFeature,
  MapFeatureItem,
  IntelNewsItem,
  StrategicFeature,
  GpsJammingZone,
  AdizZoneFeature,
  FortifiedBorderFeature,
  WorkspaceDrawerItem
} from '../types';
import { VIDEO_CATALOGUE, VideoCatalogueItem } from '../data/videoCatalogue';

// Canva-style compact tactical drag ghost token
export const createCanvaDragGhost = (e: React.DragEvent, tokenType: string, label: string) => {
  const ghost = document.createElement('div');
  ghost.style.position = 'absolute';
  ghost.style.top = '-1000px';
  ghost.style.left = '-1000px';
  ghost.style.width = '140px';
  ghost.style.height = '36px';
  ghost.style.background = '#0EA5E9';
  ghost.style.color = '#080C14';
  ghost.style.border = '1px solid #F8FAFC';
  ghost.style.borderRadius = '4px';
  ghost.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.7)';
  ghost.style.fontFamily = 'monospace';
  ghost.style.fontSize = '11px';
  ghost.style.fontWeight = '700';
  ghost.style.display = 'flex';
  ghost.style.alignItems = 'center';
  ghost.style.gap = '6px';
  ghost.style.padding = '0 10px';
  ghost.style.zIndex = '99999';
  ghost.style.pointerEvents = 'none';
  ghost.innerHTML = `<span style="background:rgba(0,0,0,0.25);padding:2px 4px;border-radius:2px;font-size:10px;">${tokenType}</span><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:80px;">${label}</span>`;
  document.body.appendChild(ghost);
  e.dataTransfer.setDragImage(ghost, 70, 18);
  setTimeout(() => {
    if (document.body.contains(ghost)) {
      document.body.removeChild(ghost);
    }
  }, 0);
};

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
  onOpenInWorkspace?: (item: WorkspaceDrawerItem) => void;
  onDragStartItem?: (e: React.DragEvent, item: WorkspaceDrawerItem) => void;
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
  onCenterMap,
  onOpenInWorkspace,
  onDragStartItem
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'videos' | 'hotspots' | 'conflicts' | 'infra' | 'dossier'>('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');
  const [copiedCoords, setCopiedCoords] = useState(false);

  // Videos Tab Specific State
  const [selectedVideoId, setSelectedVideoId] = useState<string>('dw_news_live');
  const [isPlayerMinimized, setIsPlayerMinimized] = useState<boolean>(false);
  const [selectedVideoRegion, setSelectedVideoRegion] = useState<string>('all');
  const [selectedVideoCategory, setSelectedVideoCategory] = useState<string>('ALL');
  const [videoPlayerMode, setVideoPlayerMode] = useState<'embed' | 'briefing'>('embed');

  const handleDragStartItem = (e: React.DragEvent, drawerItem: WorkspaceDrawerItem) => {
    const tokenType = drawerItem.type === 'video' ? '▶ VID' : drawerItem.type === 'hotspot' ? '🔥 HOT' : '📄 INTEL';
    createCanvaDragGhost(e, tokenType, drawerItem.title);
    e.dataTransfer.setData('application/json', JSON.stringify({ item: drawerItem }));
    if (onDragStartItem) {
      onDragStartItem(e, drawerItem);
    }
  };

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
    return VIDEO_CATALOGUE.filter((item) => {
      // Search filter across title, channel, description, region, country, and tags
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchChannel = item.channel.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchRegion = item.region.toLowerCase().includes(q);
        const matchCountry = item.countryCode.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchChannel && !matchDesc && !matchRegion && !matchCountry && !matchTags) {
          return false;
        }
      }

      // Region filter
      if (selectedVideoRegion !== 'all' && item.region !== selectedVideoRegion) {
        return false;
      }

      // Category filter
      if (selectedVideoCategory !== 'ALL' && item.category !== selectedVideoCategory) {
        return false;
      }

      return true;
    });
  }, [searchQuery, selectedVideoRegion, selectedVideoCategory]);

  const activeVideo = useMemo(() => {
    return (
      filteredVideos.find((v) => v.id === selectedVideoId) ||
      VIDEO_CATALOGUE.find((v) => v.id === selectedVideoId) ||
      filteredVideos[0] ||
      VIDEO_CATALOGUE[0]
    );
  }, [filteredVideos, selectedVideoId]);

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

        {activeTab !== 'videos' ? (
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
        ) : (
          <select
            value={selectedVideoRegion}
            onChange={(e) => setSelectedVideoRegion(e.target.value)}
            className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-[2px] px-2 py-1.5 text-[11px] font-mono focus:outline-none focus:border-sky-500 shrink-0 cursor-pointer"
            style={{ width: '115px', color: 'var(--text-secondary)' }}
          >
            <option value="all">All Regions</option>
            <option value="India / S. Asia">India / S. Asia</option>
            <option value="Global Wire">Global Wire</option>
            <option value="Europe / UK">Europe / UK</option>
            <option value="Americas / US">Americas / US</option>
            <option value="Middle East">Middle East</option>
            <option value="East Asia / Indo-Pacific">East Asia / Indo-Pacific</option>
          </select>
        )}
      </div>

      {/* Row 2: Category Filter Pills for Videos Tab */}
      {activeTab === 'videos' && (
        <div
          className="flex items-center gap-1 px-3 py-1.5 overflow-x-auto select-none shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)]"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {(
            [
              'ALL',
              '★ SPECIAL ANALYSTS',
              '24/7 LIVE NEWS',
              'DEFENSE & THINK TANKS',
              'THEATER CAMS & FEEDS'
            ] as const
          ).map((cat) => {
            const isActive = selectedVideoCategory === cat;
            const isSpecial = cat === '★ SPECIAL ANALYSTS';
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedVideoCategory(cat)}
                className={`px-2 py-0.5 rounded-[3px] text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer font-semibold ${
                  isActive
                    ? isSpecial
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.25)]'
                    : 'bg-white/[0.03] text-[var(--text-muted)] border border-transparent hover:text-[var(--text-secondary)] hover:bg-white/[0.06]'
                }`}
                style={{ height: '22px' }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      )}

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
                  draggable="true"
                  onDragStart={(e) =>
                    handleDragStartItem(e, {
                      id: item.id,
                      type: 'news',
                      title: item.title,
                      summary: item.summary,
                      source: item.source,
                      timestamp: item.timeAgo,
                      severity: item.severity,
                      coordinates: item.coordinates
                    })
                  }
                  onDoubleClick={() => {
                    if (onOpenInWorkspace) {
                      onOpenInWorkspace({
                        id: item.id,
                        type: 'news',
                        title: item.title,
                        summary: item.summary,
                        source: item.source,
                        timestamp: item.timeAgo,
                        severity: item.severity,
                        coordinates: item.coordinates
                      });
                    }
                  }}
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
                  className="palantir-feed-card cursor-pointer group relative"
                  style={{
                    padding: '16px 22px',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)'
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-[6px]">
                    <div className="flex items-center gap-1.5">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 cursor-grab shrink-0" title="Drag into Intel Workspace Drawer">
                        <GripVertical size={13} />
                      </span>
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
                    </div>
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

                      {onOpenInWorkspace && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenInWorkspace({
                              id: item.id,
                              type: 'news',
                              title: item.title,
                              summary: item.summary,
                              source: item.source,
                              timestamp: item.timeAgo,
                              severity: item.severity,
                              coordinates: item.coordinates
                            });
                          }}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 transition-colors shrink-0 text-[10px] cursor-pointer"
                          title="Mount into Rightmost Workspace Canvas"
                        >
                          <PlusSquare size={10} />
                          <span>+ Workspace</span>
                        </button>
                      )}
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

        {/* 2. Tactical Video & Analyst Broadcast Terminal */}
        {activeTab === 'videos' && (
          <div className="flex flex-col min-h-full">
            {/* 1. Pinned Active Player Deck */}
            <div
              className="sticky top-0 z-20 shrink-0 border-b border-[var(--border-subtle)] shadow-md"
              style={{
                background: 'var(--bg-surface-elevated)',
                padding: '10px 14px'
              }}
            >
              {/* Player Top Navigation Strip */}
              <div className="flex items-center justify-between mb-2 gap-2 text-xs font-mono">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span
                    className={`px-1.5 py-0.5 rounded-[2px] text-[9.5px] font-bold shrink-0 ${
                      activeVideo.isSpecialAnalyst
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/35'
                        : activeVideo.isLive
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/35 animate-pulse'
                        : 'bg-sky-500/20 text-sky-400 border border-sky-500/35'
                    }`}
                  >
                    {activeVideo.category}
                  </span>
                  <span className="font-semibold text-[11.5px] truncate text-[var(--text-primary)]">
                    {activeVideo.channel}
                  </span>
                  <span className="text-[10px] text-sky-400/80 font-bold shrink-0">
                    [{activeVideo.countryCode}]
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Mode Switcher */}
                  <div className="flex items-center bg-black/30 border border-white/10 rounded-[2px] p-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPlayerMode('embed');
                        setIsPlayerMinimized(false);
                      }}
                      className={`px-1.5 py-0.5 text-[9.5px] font-mono rounded-[2px] transition-colors cursor-pointer ${
                        videoPlayerMode === 'embed' && !isPlayerMinimized
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'text-[var(--text-muted)] hover:text-white'
                      }`}
                      title="Embedded Player View"
                    >
                      Stream
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPlayerMode('briefing');
                        setIsPlayerMinimized(false);
                      }}
                      className={`px-1.5 py-0.5 text-[9.5px] font-mono rounded-[2px] transition-colors cursor-pointer ${
                        videoPlayerMode === 'briefing' && !isPlayerMinimized
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'text-[var(--text-muted)] hover:text-white'
                      }`}
                      title="Tactical Briefing Card View"
                    >
                      Card
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsPlayerMinimized(!isPlayerMinimized)}
                    className="text-[10px] font-mono text-[var(--text-muted)] hover:text-sky-400 transition-colors flex items-center gap-1 cursor-pointer select-none"
                    title={isPlayerMinimized ? 'Expand Video Frame' : 'Collapse Video Frame to 32px bar'}
                  >
                    {isPlayerMinimized ? (
                      <>
                        <Maximize2 size={11} />
                        <span className="hidden sm:inline">[ Expand + ]</span>
                      </>
                    ) : (
                      <>
                        <Minimize2 size={11} />
                        <span className="hidden sm:inline">[ Minimize – ]</span>
                      </>
                    )}
                  </button>

                  <a
                    href={activeVideo.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] font-mono text-sky-400 hover:text-sky-300 font-bold flex items-center gap-0.5 group"
                    title="Open on Source Platform"
                  >
                    <span>YouTube</span>
                    <ExternalLink size={10} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Player 16:9 Frame OR Tactical Briefing Card OR Minimized 32px Status Strip */}
              {!isPlayerMinimized ? (
                videoPlayerMode === 'embed' ? (
                  <div>
                    <div
                      className="relative aspect-video w-full overflow-hidden rounded-[4px] shadow-lg"
                      style={{
                        background: '#05080F',
                        border: '1px solid rgba(56, 189, 248, 0.3)'
                      }}
                    >
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                        title={activeVideo.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Helpful Fallback Strip */}
                    <div className="mt-2 flex items-center justify-between text-[10.5px] font-mono text-[var(--text-muted)] bg-black/40 border border-white/[0.08] rounded px-2.5 py-1.5">
                      <span className="truncate">Embedding blocked? Some channels restrict iframe playback:</span>
                      <a
                        href={activeVideo.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sky-400 hover:text-sky-300 font-bold underline shrink-0 ml-2 flex items-center gap-1"
                      >
                        <span>Watch on YouTube</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                ) : (
                  /* Tactical Briefing Card Mode */
                  <div
                    className="relative aspect-video w-full p-4 rounded-[4px] flex flex-col justify-between overflow-hidden shadow-lg font-sans"
                    style={{
                      background: 'radial-gradient(circle at 70% 30%, rgba(14, 165, 233, 0.15) 0%, rgba(5, 8, 15, 0.98) 100%)',
                      border: '1px solid rgba(56, 189, 248, 0.35)'
                    }}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 border border-sky-500/30 font-bold">
                          TACTICAL DISPATCH
                        </span>
                        <span className="text-[10.5px] font-mono text-slate-400">
                          [{activeVideo.region}]
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white leading-tight mb-1">
                        {activeVideo.title}
                      </h3>
                      <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                        {activeVideo.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-white/10 mt-2">
                      <div className="flex items-center gap-1 text-[10px] font-mono text-slate-400 truncate max-w-[55%]">
                        {activeVideo.tags.slice(0, 3).join(' • ')}
                      </div>
                      <a
                        href={activeVideo.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[3px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-[11px] tracking-wider transition-all shadow-[0_0_12px_rgba(56,189,248,0.4)] shrink-0"
                      >
                        <Play size={10} className="fill-current" />
                        <span>OPEN ON YOUTUBE</span>
                        <ExternalLink size={10} />
                      </a>
                    </div>
                  </div>
                )
              ) : (
                <div
                  onClick={() => setIsPlayerMinimized(false)}
                  className="w-full h-8 px-2.5 rounded-[3px] bg-[#05080F] border border-sky-500/30 flex items-center justify-between text-xs font-mono cursor-pointer hover:border-sky-400 transition-colors"
                  title="Click to expand player"
                >
                  <div className="flex items-center gap-2 truncate">
                    <Play size={10} className="text-sky-400 fill-sky-400 shrink-0" />
                    <span className="text-white text-[11px] truncate font-medium">{activeVideo.title}</span>
                  </div>
                  <span className="text-[9.5px] text-sky-400 font-mono font-bold shrink-0 ml-2">
                    MONITOR ACTIVE ↗
                  </span>
                </div>
              )}
            </div>

            {/* 2. Compact Scrollable Channel & Briefing Directory */}
            <div className="divide-y divide-white/[0.06] flex-1">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-10 px-4 text-xs font-mono text-[var(--text-muted)]">
                  No video dispatches or channels found matching criteria.
                </div>
              ) : (
                filteredVideos.map((item) => {
                  const isSelected = activeVideo.id === item.id;
                  return (
                    <div
                      key={item.id}
                      draggable="true"
                      onDragStart={(e) =>
                        handleDragStartItem(e, {
                          id: item.id,
                          type: 'video',
                          title: item.title,
                          youtubeId: item.youtubeId,
                          channel: item.channel,
                          externalUrl: item.externalUrl,
                          tags: item.tags,
                          countryCode: item.countryCode,
                          description: item.description
                        })
                      }
                      onDoubleClick={() => {
                        if (onOpenInWorkspace) {
                          onOpenInWorkspace({
                            id: item.id,
                            type: 'video',
                            title: item.title,
                            youtubeId: item.youtubeId,
                            channel: item.channel,
                            externalUrl: item.externalUrl,
                            tags: item.tags,
                            countryCode: item.countryCode,
                            description: item.description
                          });
                        }
                      }}
                      onClick={() => setSelectedVideoId(item.id)}
                      className="group cursor-pointer transition-colors relative"
                      style={{
                        padding: '10px 14px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
                        borderLeft: isSelected ? '3px solid #38BDF8' : '3px solid transparent',
                        background: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'transparent'
                      }}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 cursor-grab shrink-0 -ml-1" title="Drag to Workspace Drawer">
                          <GripVertical size={12} />
                        </span>

                        {/* Compact 36x24px Monogram / Beacon Badge */}
                        <div
                          className="relative shrink-0 flex items-center justify-center font-mono font-bold text-[10px] rounded-[3px] border transition-all"
                          style={{
                            width: '36px',
                            height: '24px',
                            background: item.isSpecialAnalyst
                              ? 'rgba(245, 158, 11, 0.12)'
                              : item.isLive
                              ? 'rgba(244, 63, 94, 0.12)'
                              : 'rgba(56, 189, 248, 0.1)',
                            borderColor: item.isSpecialAnalyst
                              ? 'rgba(245, 158, 11, 0.35)'
                              : item.isLive
                              ? 'rgba(244, 63, 94, 0.35)'
                              : 'rgba(56, 189, 248, 0.25)',
                            color: item.isSpecialAnalyst
                              ? '#F59E0B'
                              : item.isLive
                              ? '#F43F5E'
                              : '#38BDF8'
                          }}
                        >
                          {item.isSpecialAnalyst ? (
                            <span className="text-[11px] leading-none">★</span>
                          ) : item.isLive ? (
                            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_6px_#f43f5e]" />
                          ) : (
                            <span className="text-[9px] tracking-tight">{item.monogram}</span>
                          )}
                        </div>

                        {/* Center Title, Focus Tags, and Region */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <h4 className="text-[12.5px] font-semibold truncate leading-tight text-[var(--text-primary)] group-hover:text-sky-400 transition-colors">
                              {item.title}
                            </h4>
                            <span className="text-[10px] font-mono text-sky-400/80 font-bold shrink-0">
                              [{item.countryCode}]
                            </span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8] truncate leading-tight mt-0.5">
                            {item.tags.join(' • ')}
                          </p>
                        </div>

                        {/* Right Action / State Indicator */}
                        <div className="shrink-0 flex items-center gap-1.5">
                          {onOpenInWorkspace && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenInWorkspace({
                                  id: item.id,
                                  type: 'video',
                                  title: item.title,
                                  youtubeId: item.youtubeId,
                                  channel: item.channel,
                                  externalUrl: item.externalUrl,
                                  tags: item.tags,
                                  countryCode: item.countryCode,
                                  description: item.description
                                });
                              }}
                              className="p-1 rounded text-slate-500 hover:text-sky-400 hover:bg-sky-500/10 transition-colors cursor-pointer"
                              title="Mount in Workspace Drawer Canvas"
                            >
                              <PlusSquare size={13} />
                            </button>
                          )}

                          {isSelected ? (
                            <span className="text-[9.5px] font-mono font-bold text-sky-400 bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.5 rounded-[2px] animate-pulse">
                              PLAYING
                            </span>
                          ) : (
                            <button
                              type="button"
                              className="text-[10px] font-mono font-semibold text-[var(--text-muted)] group-hover:text-sky-400 flex items-center gap-1 transition-colors"
                            >
                              <span>PLAY</span>
                              <Play size={8} className="fill-current" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 3. Hotspots Tab */}
        {activeTab === 'hotspots' && (
          <div className="space-y-0">
            {filteredHotspots.map((hs) => (
              <div
                key={hs.id}
                draggable="true"
                onDragStart={(e) =>
                  handleDragStartItem(e, {
                    id: hs.id,
                    type: 'hotspot',
                    title: hs.name,
                    description: hs.description,
                    summary: hs.whyItMatters,
                    coordinates: hs.coordinates,
                    severity: hs.escalationScore >= 4 ? 'critical' : 'high'
                  })
                }
                onDoubleClick={() => {
                  if (onOpenInWorkspace) {
                    onOpenInWorkspace({
                      id: hs.id,
                      type: 'hotspot',
                      title: hs.name,
                      description: hs.description,
                      summary: hs.whyItMatters,
                      coordinates: hs.coordinates,
                      severity: hs.escalationScore >= 4 ? 'critical' : 'high'
                    });
                  }
                }}
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
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 cursor-grab shrink-0 -ml-1" title="Drag to Workspace Drawer">
                      <GripVertical size={13} />
                    </span>
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
                draggable="true"
                onDragStart={(e) =>
                  handleDragStartItem(e, {
                    id: c.id,
                    type: 'conflict',
                    title: c.name,
                    description: c.description,
                    parties: c.parties,
                    coordinates: c.center,
                    severity: c.intensity
                  })
                }
                onDoubleClick={() => {
                  if (onOpenInWorkspace) {
                    onOpenInWorkspace({
                      id: c.id,
                      type: 'conflict',
                      title: c.name,
                      description: c.description,
                      parties: c.parties,
                      coordinates: c.center,
                      severity: c.intensity
                    });
                  }
                }}
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
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 cursor-grab shrink-0 -ml-1" title="Drag to Workspace Drawer">
                      <GripVertical size={13} />
                    </span>
                    <span
                      className="text-[13px] font-semibold group-hover:text-rose-500 font-sans"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {c.name}
                    </span>
                  </div>
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
                draggable="true"
                onDragStart={(e) =>
                  handleDragStartItem(e, {
                    id: f.id,
                    type: 'feature',
                    title: f.name,
                    description: f.description,
                    coordinates: f.coordinates,
                    severity: f.severity
                  })
                }
                onDoubleClick={() => {
                  if (onOpenInWorkspace) {
                    onOpenInWorkspace({
                      id: f.id,
                      type: 'feature',
                      title: f.name,
                      description: f.description,
                      coordinates: f.coordinates,
                      severity: f.severity
                    });
                  }
                }}
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
                  <div className="flex items-center gap-1.5">
                    <span className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 cursor-grab shrink-0 -ml-1" title="Drag to Workspace Drawer">
                      <GripVertical size={13} />
                    </span>
                    <span
                      className="text-[13px] font-semibold group-hover:text-sky-500 font-sans"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {f.name}
                    </span>
                  </div>
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
