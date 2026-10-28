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
  ArrowUpRight,
  Shield,
  Target,
  Activity,
  Anchor,
  Plane,
  Layers,
  Compass
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
import { getYouTubeEmbedUrl, resolveLatestVideoFromRSS } from '../utils/youtubeResolver';
import { classifySourceTier } from '../services/osintFeedService';

export const VIDEO_REGION_GROUPS = [
  { id: 'ALL', label: `ALL (${VIDEO_CATALOGUE.length})`, title: 'ALL GLOBAL BROADCASTERS & OSINT', color: '#38BDF8' },
  { id: 'ANALYSTS', label: '★ ANALYSTS', title: '★ SPECIAL ANALYSTS & DEFENSE THINK TANKS', color: '#F59E0B' },
  { id: 'INDIA', label: '🇮🇳 INDIA', title: '🇮🇳 INDIA & SOUTH ASIA', color: '#F97316' },
  { id: 'US', label: '🇺🇸 US', title: '🌐 GLOBAL WIRES & US NETWORKS', color: '#38BDF8' },
  { id: 'EUROPE', label: '🇬🇧/🇪🇺 EUROPE', title: '🇪🇺 UK & EUROPE', color: '#60A5FA' },
  { id: 'MIDDLE_EAST', label: '🇲🇪 MIDDLE EAST', title: '🇲🇪 MIDDLE EAST & EURASIA', color: '#34D399' },
  { id: 'EAST_ASIA', label: '🌏 EAST ASIA / PAC', title: '🌏 EAST ASIA, ASEAN & OCEANIA', color: '#A78BFA' },
  { id: 'AMERICAS', label: '🌎 AMERICAS / LATAM', title: '🌎 AMERICAS / LATAM', color: '#F472B6' },
  { id: 'AFRICA', label: '🌍 AFRICA', title: '🌍 AFRICA', color: '#FBBF24' }
];

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

  // Isolated Per-Tab Desk State Props:
  activeSubTab?: 'feed' | 'videos' | 'hotspots' | 'conflicts' | 'infra' | 'dossier';
  onChangeSubTab?: (subTab: 'feed' | 'videos' | 'hotspots' | 'conflicts' | 'infra' | 'dossier') => void;
  searchQuery?: string;
  onChangeSearchQuery?: (q: string) => void;
  severityFilter?: 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM';
  onChangeSeverityFilter?: (sev: 'ALL' | 'CRITICAL' | 'HIGH' | 'MEDIUM') => void;
  videoCategoryFilter?: string;
  onChangeVideoCategoryFilter?: (cat: string) => void;
  videoRegionFilter?: string;
  onChangeVideoRegionFilter?: (reg: string) => void;
  activeVideoChannelId?: string;
  onChangeActiveVideoChannelId?: (id: string) => void;
  isPlayerMinimized?: boolean;
  onTogglePlayerMinimized?: () => void;
  currentTheater?: string;
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
  onDragStartItem,
  activeSubTab: propsActiveSubTab,
  onChangeSubTab,
  searchQuery: propsSearchQuery,
  onChangeSearchQuery,
  severityFilter: propsSeverityFilter,
  onChangeSeverityFilter,
  videoCategoryFilter: propsVideoCategoryFilter,
  onChangeVideoCategoryFilter,
  videoRegionFilter: propsVideoRegionFilter,
  onChangeVideoRegionFilter,
  activeVideoChannelId: propsActiveVideoChannelId,
  onChangeActiveVideoChannelId,
  isPlayerMinimized: propsIsPlayerMinimized,
  onTogglePlayerMinimized,
  currentTheater
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState<'feed' | 'videos' | 'hotspots' | 'conflicts' | 'infra' | 'dossier'>('feed');
  const activeTab = propsActiveSubTab !== undefined ? propsActiveSubTab : internalActiveTab;
  const setActiveTab = (tab: 'feed' | 'videos' | 'hotspots' | 'conflicts' | 'infra' | 'dossier') => {
    setInternalActiveTab(tab);
    if (onChangeSubTab) onChangeSubTab(tab);
  };

  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const searchQuery = propsSearchQuery !== undefined ? propsSearchQuery : internalSearchQuery;
  const setSearchQuery = (q: string) => {
    setInternalSearchQuery(q);
    if (onChangeSearchQuery) onChangeSearchQuery(q);
  };

  const [internalSelectedSeverity, setInternalSelectedSeverity] = useState<string>('ALL');
  const selectedSeverity = propsSeverityFilter !== undefined ? propsSeverityFilter : internalSelectedSeverity;
  const setSelectedSeverity = (sev: string) => {
    setInternalSelectedSeverity(sev);
    if (onChangeSeverityFilter) onChangeSeverityFilter(sev.toUpperCase() as any);
  };

  const [copiedCoords, setCopiedCoords] = useState(false);

  // Videos Tab Specific State
  const [internalSelectedVideoId, setInternalSelectedVideoId] = useState<string>('dw_news_live');
  const selectedVideoId = propsActiveVideoChannelId !== undefined ? propsActiveVideoChannelId : internalSelectedVideoId;
  const setSelectedVideoId = (id: string) => {
    setInternalSelectedVideoId(id);
    if (onChangeActiveVideoChannelId) onChangeActiveVideoChannelId(id);
  };

  const [internalIsPlayerMinimized, setInternalIsPlayerMinimized] = useState<boolean>(false);
  const isPlayerMinimized = propsIsPlayerMinimized !== undefined ? propsIsPlayerMinimized : internalIsPlayerMinimized;
  const setIsPlayerMinimized = (val: boolean | ((prev: boolean) => boolean)) => {
    const nextVal = typeof val === 'function' ? val(isPlayerMinimized) : val;
    setInternalIsPlayerMinimized(nextVal);
    if (onTogglePlayerMinimized) onTogglePlayerMinimized();
  };

  const [internalSelectedVideoRegion, setInternalSelectedVideoRegion] = useState<string>('ALL');
  const selectedVideoRegion = propsVideoRegionFilter !== undefined ? propsVideoRegionFilter : internalSelectedVideoRegion;
  const setSelectedVideoRegion = (reg: string) => {
    setInternalSelectedVideoRegion(reg);
    if (onChangeVideoRegionFilter) onChangeVideoRegionFilter(reg);
  };

  const [collapsedVideoSections, setCollapsedVideoSections] = useState<Record<string, boolean>>({});
  const toggleVideoSection = (sectionKey: string) => {
    setCollapsedVideoSections((prev) => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
  };

  const [internalSelectedVideoCategory, setInternalSelectedVideoCategory] = useState<string>('ALL');
  const selectedVideoCategory = propsVideoCategoryFilter !== undefined ? propsVideoCategoryFilter : internalSelectedVideoCategory;
  const setSelectedVideoCategory = (cat: string) => {
    setInternalSelectedVideoCategory(cat);
    if (onChangeVideoCategoryFilter) onChangeVideoCategoryFilter(cat);
  };

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
      
      const matchSev =
        selectedSeverity === 'ALL' ||
        selectedSeverity === 'all' ||
        item.severity.toLowerCase() === selectedSeverity.toLowerCase();

      // Viewport-Aware Theater Filtering
      const matchTheater =
        !currentTheater ||
        currentTheater === 'global' ||
        !item.region ||
        item.region === 'global' ||
        item.region.toLowerCase().includes(currentTheater.toLowerCase()) ||
        currentTheater.toLowerCase().includes(item.region.toLowerCase());

      return matchQuery && matchSev && matchTheater;
    });
  }, [news, searchQuery, selectedSeverity, currentTheater]);

  const filteredVideos = useMemo(() => {
    return VIDEO_CATALOGUE.filter((item) => {
      // Search filter across title, channel, description, region, country, and tags
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(q);
        const matchChannel = item.channel.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchRegion = item.region?.toLowerCase().includes(q);
        const matchCountry = item.countryCode?.toLowerCase().includes(q);
        const matchGroup = item.regionGroup?.toLowerCase().includes(q);
        const matchTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchTitle && !matchChannel && !matchDesc && !matchRegion && !matchCountry && !matchGroup && !matchTags) {
          return false;
        }
      }

      // Region filter
      if (selectedVideoRegion !== 'ALL' && selectedVideoRegion !== 'all') {
        const matchesGroup = item.regionGroup === selectedVideoRegion;
        const matchesRegion = item.region === selectedVideoRegion;
        if (!matchesGroup && !matchesRegion) {
          return false;
        }
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

  const [resolvedVideoId, setResolvedVideoId] = useState<string | null>(null);
  const [embedStreamType, setEmbedStreamType] = useState<'auto' | 'playlist'>('auto');

  useEffect(() => {
    setResolvedVideoId(null);
    if (activeVideo && activeVideo.channelId) {
      resolveLatestVideoFromRSS(activeVideo.channelId).then((vid) => {
        if (vid) setResolvedVideoId(vid);
      });
    }
  }, [activeVideo?.id, activeVideo?.channelId]);

  const [selectedAssetCategory, setSelectedAssetCategory] = useState<string>('ALL');

  const filteredHotspots = useMemo(() => {
    return hotspots
      .filter((hs) => {
        const q = searchQuery.toLowerCase();
        return (
          hs.name.toLowerCase().includes(q) ||
          hs.description.toLowerCase().includes(q) ||
          hs.whyItMatters.toLowerCase().includes(q) ||
          (hs.countryCode && hs.countryCode.toLowerCase().includes(q)) ||
          (hs.region && hs.region.toLowerCase().includes(q))
        );
      })
      .sort((a, b) => {
        const scoreA = a.escalationScore > 5 ? a.escalationScore : a.escalationScore * 20;
        const scoreB = b.escalationScore > 5 ? b.escalationScore : b.escalationScore * 20;
        return scoreB - scoreA;
      });
  }, [hotspots, searchQuery]);

  const filteredConflicts = useMemo(() => {
    return conflicts.filter((c) => {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.parties.some((p) => p.toLowerCase().includes(q))
      );
    });
  }, [conflicts, searchQuery]);

  const filteredInfra = useMemo(() => {
    return features.filter((f) => {
      if (selectedAssetCategory !== 'ALL') {
        const cat = (f.assetCategory || f.category || '').toLowerCase();
        if (!cat.includes(selectedAssetCategory.toLowerCase())) {
          return false;
        }
      }
      const q = searchQuery.toLowerCase();
      const matchQuery =
        f.name.toLowerCase().includes(q) ||
        f.description.toLowerCase().includes(q) ||
        (f.category && f.category.toLowerCase().includes(q)) ||
        (f.operatorCode && f.operatorCode.toLowerCase().includes(q)) ||
        (f.status && f.status.toLowerCase().includes(q));
      const matchSev =
        selectedSeverity === 'ALL' ||
        selectedSeverity === 'all' ||
        f.severity?.toLowerCase() === selectedSeverity.toLowerCase();
      return matchQuery && matchSev;
    });
  }, [features, searchQuery, selectedSeverity, selectedAssetCategory]);

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

  const renderVideoRow = (item: VideoCatalogueItem) => {
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
            channelId: item.channelId,
            uploadsPlaylistId: item.uploadsPlaylistId,
            isLive: item.isLive,
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
              channelId: item.channelId,
              uploadsPlaylistId: item.uploadsPlaylistId,
              isLive: item.isLive,
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
          padding: '9px 14px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
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
              <h4 className="text-[12px] font-semibold truncate leading-tight text-[var(--text-primary)] group-hover:text-sky-400 transition-colors">
                {item.title}
              </h4>
              <span className="text-[9.5px] font-mono text-sky-400/80 font-bold shrink-0">
                [{item.countryCode}]
              </span>
            </div>
            <p className="text-[10.5px] text-[#94A3B8] truncate leading-tight mt-0.5">
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
                    channelId: item.channelId,
                    uploadsPlaylistId: item.uploadsPlaylistId,
                    isLive: item.isLive,
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
              <span className="text-[9px] font-mono font-bold text-sky-400 bg-sky-500/15 border border-sky-500/30 px-1.5 py-0.5 rounded-[2px] animate-pulse">
                PLAYING
              </span>
            ) : (
              <button
                type="button"
                className="text-[9.5px] font-mono font-semibold text-[var(--text-muted)] group-hover:text-sky-400 flex items-center gap-1 transition-colors"
              >
                <span>PLAY</span>
                <Play size={8} className="fill-current" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

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
            placeholder={activeTab === 'videos' ? "Search 75+ channels, countries, analysts..." : "Search intel reports, assets..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs placeholder:text-[var(--text-muted)] focus:outline-none font-sans"
            style={{ color: 'var(--text-primary)' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
              title="Clear search"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {activeTab !== 'videos' ? (
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value)}
            className="bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] rounded-[2px] px-2 py-1.5 text-[11px] font-mono focus:outline-none focus:border-sky-500 cursor-pointer"
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
            style={{ width: '135px', color: 'var(--text-secondary)' }}
          >
            {VIDEO_REGION_GROUPS.map((g) => (
              <option key={g.id} value={g.id}>
                {g.label}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Row 2: Country/Region Pills for Videos Tab */}
      {activeTab === 'videos' && (
        <div
          className="flex items-center gap-1 px-3 py-1.5 overflow-x-auto select-none shrink-0 border-b border-[var(--border-subtle)] bg-[var(--bg-surface-subtle)] scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {VIDEO_REGION_GROUPS.map((reg) => {
            const isActive = selectedVideoRegion === reg.id || (reg.id === 'ALL' && (selectedVideoRegion === 'all' || selectedVideoRegion === 'ALL'));
            const isSpecial = reg.id === 'ANALYSTS';
            return (
              <button
                key={reg.id}
                type="button"
                onClick={() => setSelectedVideoRegion(reg.id)}
                className={`px-2 py-0.5 rounded-[3px] text-[10px] font-mono whitespace-nowrap transition-all cursor-pointer font-semibold ${
                  isActive
                    ? isSpecial
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-[0_0_8px_rgba(245,158,11,0.25)]'
                      : 'bg-sky-500/20 text-sky-400 border border-sky-500/40 shadow-[0_0_8px_rgba(56,189,248,0.25)]'
                    : 'bg-white/[0.03] text-[var(--text-muted)] border border-transparent hover:text-[var(--text-secondary)] hover:bg-white/[0.06]'
                }`}
                style={{ height: '22px' }}
              >
                {reg.label}
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
                    <div className="flex items-center gap-1.5 flex-wrap">
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

                      {(() => {
                        const tier = classifySourceTier(item.source);
                        const tierBg =
                          tier === 'OFFICIAL MOD'
                            ? 'rgba(245, 158, 11, 0.15)'
                            : tier === 'OSINT SENSOR'
                            ? 'rgba(16, 185, 129, 0.15)'
                            : tier === 'STATE MEDIA - FLAGGED'
                            ? 'rgba(239, 68, 68, 0.15)'
                            : 'rgba(56, 189, 248, 0.12)';
                        const tierColor =
                          tier === 'OFFICIAL MOD'
                            ? '#f59e0b'
                            : tier === 'OSINT SENSOR'
                            ? '#10b981'
                            : tier === 'STATE MEDIA - FLAGGED'
                            ? '#ef4444'
                            : '#38bdf8';
                        const tierBorder =
                          tier === 'OFFICIAL MOD'
                            ? 'rgba(245, 158, 11, 0.35)'
                            : tier === 'OSINT SENSOR'
                            ? 'rgba(16, 185, 129, 0.35)'
                            : tier === 'STATE MEDIA - FLAGGED'
                            ? 'rgba(239, 68, 68, 0.35)'
                            : 'rgba(56, 189, 248, 0.3)';

                        return (
                          <span
                            className="text-[9.5px] font-mono px-1.5 py-0.5 rounded-[2px] font-bold uppercase tracking-wider"
                            style={{
                              background: tierBg,
                              color: tierColor,
                              border: `1px solid ${tierBorder}`
                            }}
                          >
                            [{tier}]
                          </span>
                        );
                      })()}

                      {item.countryCode && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] bg-slate-800 text-slate-300 border border-slate-700/60 font-semibold">
                          {item.countryCode}
                        </span>
                      )}
                    </div>
                    <span className="text-[10.5px] font-mono text-[var(--text-muted)] shrink-0">{item.timeAgo}</span>
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

                      {item.coordinates && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCenterMap(item.coordinates!);
                            onSelectFeature({
                              id: item.id,
                              layer: 'military',
                              name: item.title,
                              coordinates: item.coordinates!,
                              category: item.category,
                              severity: item.severity,
                              description: item.summary,
                              source: item.source
                            });
                          }}
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[9.5px] font-mono transition-colors shrink-0"
                          title="Fly to Coordinates on Map"
                        >
                          <Crosshair size={9} />
                          <span>{item.coordinates[1].toFixed(1)}°, {item.coordinates[0].toFixed(1)}°</span>
                        </button>
                      )}
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
              <div
                className="mb-2 text-xs font-mono bg-black/40 border border-white/[0.08] rounded-[4px]"
                style={{
                  padding: '8px 12px',
                  minHeight: '34px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  boxSizing: 'border-box'
                }}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
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
                        setEmbedStreamType('auto');
                        setIsPlayerMinimized(false);
                      }}
                      className={`px-1.5 py-0.5 text-[9.5px] font-mono rounded-[2px] transition-colors cursor-pointer ${
                        videoPlayerMode === 'embed' && embedStreamType === 'auto' && !isPlayerMinimized
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'text-[var(--text-muted)] hover:text-white'
                      }`}
                      title="Direct Latest Video Stream"
                    >
                      Stream
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setVideoPlayerMode('embed');
                        setEmbedStreamType('playlist');
                        setIsPlayerMinimized(false);
                      }}
                      className={`px-1.5 py-0.5 text-[9.5px] font-mono rounded-[2px] transition-colors cursor-pointer ${
                        videoPlayerMode === 'embed' && embedStreamType === 'playlist' && !isPlayerMinimized
                          ? 'bg-sky-500 text-slate-950 font-bold'
                          : 'text-[var(--text-muted)] hover:text-white'
                      }`}
                      title="Channel Uploads Queue (UU Playlist)"
                    >
                      Playlist
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
                    <span>Open Source</span>
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
                        key={`${activeVideo.id}_${embedStreamType}_${resolvedVideoId || activeVideo.youtubeId}`}
                        src={getYouTubeEmbedUrl({
                          youtubeId: resolvedVideoId || activeVideo.youtubeId,
                          channelId: activeVideo.channelId,
                          uploadsPlaylistId: activeVideo.uploadsPlaylistId,
                          isLive: activeVideo.isLive,
                          mode: embedStreamType === 'playlist' ? 'playlist' : 'video'
                        })}
                        title={activeVideo.title}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Helpful Fallback Strip */}
                    <div className="mt-2 flex items-center justify-between text-[10.5px] font-mono text-[var(--text-muted)] bg-black/40 border border-white/[0.08] rounded px-2.5 py-1.5">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-slate-400">Mode:</span>
                        <button
                          type="button"
                          onClick={() => setEmbedStreamType((prev) => (prev === 'playlist' ? 'auto' : 'playlist'))}
                          className="text-sky-400 hover:text-sky-300 font-bold underline cursor-pointer"
                          title="Toggle between direct video and channel uploads playlist"
                        >
                          {embedStreamType === 'playlist' ? 'Switch to Direct Video' : 'Switch to Uploads Playlist (UU)'}
                        </button>
                      </div>
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
                <div className="text-center py-12 px-4 text-xs font-mono text-[var(--text-muted)]">
                  No video dispatches or channels found matching criteria.
                </div>
              ) : selectedVideoRegion !== 'ALL' && selectedVideoRegion !== 'all' ? (
                // Direct list when filtered by specific region
                filteredVideos.map((item) => renderVideoRow(item))
              ) : (
                // Grouped by Clean Collapsible Region Headers when viewing ALL
                VIDEO_REGION_GROUPS.filter((g) => g.id !== 'ALL').map((group) => {
                  const groupItems = filteredVideos.filter((v) => v.regionGroup === group.id);
                  if (groupItems.length === 0) return null;
                  const isCollapsed = !!collapsedVideoSections[group.id];

                  return (
                    <div key={group.id} className="border-b border-white/[0.06]">
                      <div
                        onClick={() => toggleVideoSection(group.id)}
                        className="sticky top-0 z-10 px-3 py-1.5 flex items-center justify-between cursor-pointer select-none text-[10.5px] font-mono font-bold tracking-wider hover:bg-slate-900/60 transition-colors"
                        style={{
                          background: 'rgba(8, 12, 20, 0.95)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                          color: group.color
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <ChevronRight
                            size={12}
                            className={`transition-transform duration-200 text-slate-400 ${
                              !isCollapsed ? 'rotate-90' : ''
                            }`}
                          />
                          <span>{group.title}</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            ({groupItems.length})
                          </span>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono">
                          {isCollapsed ? '[ Expand + ]' : '[ Collapse – ]'}
                        </span>
                      </div>

                      {!isCollapsed && (
                        <div className="divide-y divide-white/[0.04]">
                          {groupItems.map((item) => renderVideoRow(item))}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* 3. Hotspots Tab (Actionable Flashpoint Matrix) */}
        {activeTab === 'hotspots' && (
          <div className="space-y-0">
            {filteredHotspots.length === 0 ? (
              <div className="text-center py-16 text-xs text-[var(--text-muted)] font-mono">
                No active hotspots match query.
              </div>
            ) : (
              filteredHotspots.map((hs) => {
                const score = hs.escalationScore > 5 ? hs.escalationScore : hs.escalationScore * 20;
                const scoreColor =
                  score >= 85 ? '#ef4444' : score >= 70 ? '#f97316' : score >= 50 ? '#eab308' : '#10b981';
                const scoreBg =
                  score >= 85
                    ? 'rgba(239, 68, 68, 0.15)'
                    : score >= 70
                    ? 'rgba(249, 115, 22, 0.15)'
                    : score >= 50
                    ? 'rgba(234, 179, 8, 0.15)'
                    : 'rgba(16, 185, 129, 0.15)';
                const deltaColor = hs.escalationDelta?.startsWith('▲')
                  ? '#f43f5e'
                  : hs.escalationDelta?.startsWith('▼')
                  ? '#10b981'
                  : 'var(--text-muted)';

                return (
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
                        severity: score >= 75 ? 'critical' : 'high'
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
                          severity: score >= 75 ? 'critical' : 'high'
                        });
                      }
                    }}
                    onClick={() => onSelectFeature(hs)}
                    className="palantir-feed-card cursor-pointer group"
                    style={{
                      padding: '16px 20px',
                      boxSizing: 'border-box',
                      borderBottom: '1px solid var(--border-subtle)',
                      background: 'var(--bg-surface-elevated)'
                    }}
                  >
                    {/* Header Row */}
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-1.5 min-w-0 flex-1">
                        <span
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 cursor-grab shrink-0 -ml-1"
                          title="Drag to Workspace Drawer"
                        >
                          <GripVertical size={13} />
                        </span>
                        <Flame size={14} className="text-orange-500 shrink-0 animate-pulse" />
                        <span
                          className="text-[13.5px] font-semibold group-hover:text-orange-400 font-sans truncate"
                          style={{ color: 'var(--text-primary)' }}
                          title={hs.name}
                        >
                          {hs.name}
                        </span>
                        {hs.countryCode && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] bg-slate-800 text-slate-300 border border-slate-700/60 font-bold shrink-0">
                            {hs.countryCode}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {hs.escalationDelta && (
                          <span
                            className="text-[10px] font-mono font-bold"
                            style={{ color: deltaColor }}
                            title="24h Escalation Delta"
                          >
                            {hs.escalationDelta}
                          </span>
                        )}
                        <span
                          className="text-[9.5px] font-mono px-2 py-0.5 rounded-[2px] font-bold uppercase tracking-[0.05em]"
                          style={{
                            background: scoreBg,
                            color: scoreColor,
                            border: `1px solid ${scoreColor}40`,
                            textShadow: score >= 75 ? `0 0 6px ${scoreColor}40` : 'none'
                          }}
                        >
                          {score >= 85 ? 'CRITICAL' : score >= 70 ? 'ACUTE' : 'WATCH'} {score}/100
                        </span>
                      </div>
                    </div>

                    {/* Segmented Escalation Index Bar */}
                    <div className="mb-2.5">
                      <div className="w-full h-1.5 bg-slate-800/80 rounded-full overflow-hidden border border-slate-700/40 relative">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${Math.min(100, Math.max(5, score))}%`,
                            background: `linear-gradient(90deg, #10b981 0%, #eab308 45%, ${scoreColor} 100%)`,
                            boxShadow: `0 0 8px ${scoreColor}60`
                          }}
                        />
                      </div>
                      <div className="flex items-center justify-between mt-1 text-[9px] font-mono text-[var(--text-muted)]">
                        <span>ESCALATION INDEX: {score}/100</span>
                        <span className="uppercase tracking-wider font-semibold" style={{ color: scoreColor }}>
                          TREND: {hs.escalationTrend}
                        </span>
                      </div>
                    </div>

                    {/* Structured Telemetry Grid */}
                    {hs.telemetry && (
                      <div className="grid grid-cols-2 gap-1.5 mb-2.5">
                        {hs.telemetry.airActivity && (
                          <div className="text-[9.5px] font-mono px-2 py-1 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] truncate text-[var(--text-secondary)]">
                            <span className="text-sky-500 font-bold">AIR:</span> {hs.telemetry.airActivity}
                          </div>
                        )}
                        {hs.telemetry.navalDensity && (
                          <div className="text-[9.5px] font-mono px-2 py-1 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] truncate text-[var(--text-secondary)]">
                            <span className="text-indigo-400 font-bold">NAVAL:</span> {hs.telemetry.navalDensity}
                          </div>
                        )}
                        {hs.telemetry.gnssJamming && (
                          <div className="text-[9.5px] font-mono px-2 py-1 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] truncate text-[var(--text-secondary)]">
                            <span className="text-amber-500 font-bold">EW/GNSS:</span> {hs.telemetry.gnssJamming}
                          </div>
                        )}
                        {hs.telemetry.adizIncursions && (
                          <div className="text-[9.5px] font-mono px-2 py-1 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] truncate text-[var(--text-secondary)]">
                            <span className="text-rose-500 font-bold">ADIZ:</span> {hs.telemetry.adizIncursions}
                          </div>
                        )}
                      </div>
                    )}

                    <p
                      className="text-[12px] leading-[1.5] font-sans mb-2"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {hs.description}
                    </p>

                    <div
                      className="p-2.5 rounded-[2px] border text-[11px] mb-2.5"
                      style={{
                        background: 'var(--bg-surface)',
                        borderColor: 'var(--border-subtle)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <span className="text-orange-500 font-mono font-semibold">Strategic Impact:</span>{' '}
                      <span style={{ color: 'var(--text-secondary)' }}>{hs.whyItMatters}</span>
                    </div>

                    {/* Bottom Quick Action Strip */}
                    <div
                      className="pt-2 text-[11px] font-mono flex items-center justify-between"
                      style={{
                        borderTop: '1px solid var(--border-subtle)',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCenterMap(hs.coordinates);
                            onSelectFeature(hs);
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-[10px] font-mono font-semibold transition-colors"
                          title="Fly to Sector on Map"
                        >
                          <Target size={10} />
                          <span>Fly to Sector</span>
                        </button>

                        {onOpenInWorkspace && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenInWorkspace({
                                id: hs.id,
                                type: 'hotspot',
                                title: hs.name,
                                description: hs.description,
                                summary: hs.whyItMatters,
                                coordinates: hs.coordinates,
                                severity: score >= 75 ? 'critical' : 'high'
                              });
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-semibold transition-colors"
                            title="Open Brief in Rightmost Workspace Drawer"
                          >
                            <PlusSquare size={10} />
                            <span>+ Workspace</span>
                          </button>
                        )}
                      </div>

                      <span className="text-[10px] font-mono text-[var(--text-muted)]">
                        {hs.coordinates[1].toFixed(2)}°N, {hs.coordinates[0].toFixed(2)}°E
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* 4. Conflicts / Wars Tab */}
        {activeTab === 'conflicts' && (
          <div className="space-y-0">
            {filteredConflicts.length === 0 ? (
              <div className="text-center py-16 text-xs text-[var(--text-muted)] font-mono">
                No active theaters match query.
              </div>
            ) : (
              filteredConflicts.map((c) => (
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
                    padding: '16px 20px',
                    boxSizing: 'border-box',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: 'var(--bg-surface-elevated)'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-1.5 min-w-0 flex-1">
                      <span
                        className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 cursor-grab shrink-0 -ml-1"
                        title="Drag to Workspace Drawer"
                      >
                        <GripVertical size={13} />
                      </span>
                      <span
                        className="text-[13px] font-semibold group-hover:text-rose-400 font-sans truncate"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {c.name}
                      </span>
                    </div>
                    <span
                      className="text-[9.5px] font-mono px-2 py-0.5 rounded-[2px] uppercase font-bold tracking-[0.05em] shrink-0"
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
                    className="text-[12px] leading-[1.5] mb-2.5 font-sans"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {c.description}
                  </p>

                  {c.casualties && (
                    <div
                      className="text-[10px] font-mono px-2.5 py-1.5 rounded-[2px] border mb-2.5"
                      style={{
                        background: 'rgba(245, 158, 11, 0.08)',
                        borderColor: 'rgba(245, 158, 11, 0.3)',
                        color: '#d97706'
                      }}
                    >
                      <span className="font-bold">Casualty Est:</span> {c.casualties}
                    </div>
                  )}

                  {/* Quick Action Strip */}
                  <div
                    className="pt-2 text-[11px] font-mono flex items-center justify-between"
                    style={{
                      borderTop: '1px solid var(--border-subtle)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCenterMap(c.center);
                          onSelectFeature(c);
                        }}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-mono font-semibold transition-colors"
                        title="Fly to Theater Center"
                      >
                        <Target size={10} />
                        <span>Fly to Front</span>
                      </button>

                      {onOpenInWorkspace && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenInWorkspace({
                              id: c.id,
                              type: 'conflict',
                              title: c.name,
                              description: c.description,
                              parties: c.parties,
                              coordinates: c.center,
                              severity: c.intensity
                            });
                          }}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-semibold transition-colors"
                          title="Mount into Workspace Drawer Canvas"
                        >
                          <PlusSquare size={10} />
                          <span>+ Workspace</span>
                        </button>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-[var(--text-muted)]">
                      {c.center[1].toFixed(2)}°N, {c.center[0].toFixed(2)}°E
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* 5. Assets Tab (Global Order of Battle & Strategic Asset Tracker) */}
        {activeTab === 'infra' && (
          <div className="flex flex-col min-h-full">
            {/* Category Filter Pills Strip */}
            <div
              className="sticky top-0 z-10 p-2 border-b flex items-center gap-1 overflow-x-auto scrollbar-none"
              style={{
                background: 'var(--bg-surface-subtle)',
                borderColor: 'var(--border-subtle)'
              }}
            >
              {[
                { id: 'ALL', label: 'ALL' },
                { id: 'NAVAL CSGs', label: '⚓ NAVAL CSGs' },
                { id: 'AIRBASES & BOMBER WINGS', label: '✈ AIRBASES' },
                { id: 'NUCLEAR & MISSILE SITES', label: '☢ NUCLEAR' },
                { id: 'SPACE & RADAR ARRAYS', label: '🛰 SPACE RADAR' }
              ].map((cat) => {
                const isActive = selectedAssetCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedAssetCategory(cat.id)}
                    className="px-2 py-1 rounded-[3px] text-[10px] font-mono font-semibold transition-all shrink-0 cursor-pointer"
                    style={{
                      background: isActive ? 'rgba(14, 165, 233, 0.2)' : 'var(--bg-surface)',
                      color: isActive ? '#38bdf8' : 'var(--text-secondary)',
                      border: isActive ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid var(--border-subtle)'
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-0 flex-1">
              {filteredInfra.length === 0 ? (
                <div className="text-center py-16 text-xs text-[var(--text-muted)] font-mono">
                  No strategic military assets match query.
                </div>
              ) : (
                filteredInfra.map((f) => {
                  const isNaval = (f.assetCategory || f.category || '').toLowerCase().includes('naval') || (f.assetCategory || f.category || '').toLowerCase().includes('carrier');
                  const isAir = (f.assetCategory || f.category || '').toLowerCase().includes('airbase') || (f.assetCategory || f.category || '').toLowerCase().includes('bomber');
                  const isNuclear = (f.assetCategory || f.category || '').toLowerCase().includes('nuclear') || (f.assetCategory || f.category || '').toLowerCase().includes('missile');
                  const isSpace = (f.assetCategory || f.category || '').toLowerCase().includes('space') || (f.assetCategory || f.category || '').toLowerCase().includes('radar');

                  return (
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
                        padding: '16px 20px',
                        boxSizing: 'border-box',
                        borderBottom: '1px solid var(--border-subtle)',
                        background: 'var(--bg-surface-elevated)'
                      }}
                    >
                      {/* Top Header Row */}
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 min-w-0 flex-1">
                          <span
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 cursor-grab shrink-0 -ml-1"
                            title="Drag to Workspace Drawer"
                          >
                            <GripVertical size={13} />
                          </span>
                          {isNaval ? (
                            <Anchor size={13} className="text-sky-400 shrink-0" />
                          ) : isAir ? (
                            <Plane size={13} className="text-cyan-400 shrink-0" />
                          ) : isNuclear ? (
                            <Activity size={13} className="text-rose-400 shrink-0" />
                          ) : isSpace ? (
                            <Target size={13} className="text-amber-400 shrink-0" />
                          ) : (
                            <Shield size={13} className="text-sky-400 shrink-0" />
                          )}
                          <span
                            className="text-[13px] font-semibold group-hover:text-sky-400 font-sans truncate"
                            style={{ color: 'var(--text-primary)' }}
                            title={f.name}
                          >
                            {f.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {f.operatorCode && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] bg-slate-800 text-sky-400 border border-slate-700 font-bold">
                              {f.operatorCode}
                            </span>
                          )}
                          <span
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] font-semibold uppercase tracking-wider"
                            style={{
                              background: 'rgba(16, 185, 129, 0.12)',
                              color: '#10b981',
                              border: '1px solid rgba(16, 185, 129, 0.3)'
                            }}
                          >
                            ● {f.status || 'Active'}
                          </span>
                        </div>
                      </div>

                      {/* Classification Subtitle */}
                      <div className="text-[10px] font-mono mb-1.5 text-sky-500 font-semibold truncate">
                        {f.assetCategory || f.category}
                      </div>

                      {/* Description */}
                      <p
                        className="text-[12px] leading-[1.5] font-sans mb-2"
                        style={{ color: 'var(--text-secondary)' }}
                      >
                        {f.description}
                      </p>

                      {/* Hardware Specifications Pills (if details present) */}
                      {f.details && (
                        <div className="flex flex-wrap gap-1 mb-2">
                          {Object.entries(f.details).slice(0, 3).map(([key, val]) => (
                            <span
                              key={key}
                              className="text-[9px] font-mono px-1.5 py-0.5 rounded-[2px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-muted)] truncate max-w-[280px]"
                            >
                              <strong className="text-[var(--text-secondary)]">{key}:</strong> {String(val)}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Bottom Quick Action Strip */}
                      <div
                        className="pt-2 text-[11px] font-mono flex items-center justify-between"
                        style={{
                          borderTop: '1px solid var(--border-subtle)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCenterMap(f.coordinates);
                              onSelectFeature(f);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-semibold transition-colors"
                            title="Locate Asset on Map"
                          >
                            <Target size={10} />
                            <span>Locate on Map</span>
                          </button>

                          {onOpenInWorkspace && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onOpenInWorkspace({
                                  id: f.id,
                                  type: 'feature',
                                  title: f.name,
                                  description: f.description,
                                  coordinates: f.coordinates,
                                  severity: f.severity
                                });
                              }}
                              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-[2px] bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 text-[10px] font-mono font-semibold transition-colors"
                              title="Mount into Workspace Drawer Canvas"
                            >
                              <PlusSquare size={10} />
                              <span>+ Workspace</span>
                            </button>
                          )}
                        </div>

                        <span className="text-[10px] font-mono text-[var(--text-muted)]">
                          {f.coordinates[1].toFixed(2)}°N, {f.coordinates[0].toFixed(2)}°E
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
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
