import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Clock,
  Compass,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Search,
  ChevronRight,
  ChevronDown,
  Share2,
  Check,
  Bookmark,
  LayoutGrid
} from 'lucide-react';
import { TheaterView, ThemeMode, IntelNewsItem } from '../types';
import { UserNav } from './UserNav';

interface HeaderProps {
  currentView: TheaterView;
  onSelectView: (view: TheaterView) => void;
  timeRange: string;
  onSelectTimeRange: (range: string) => void;
  isRightPanelOpen: boolean;
  onToggleRightPanel: () => void;
  isWorkspaceDrawerOpen?: boolean;
  onToggleWorkspaceDrawer?: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onNavigateHome?: () => void;
  getShareUrl?: () => string;
  coordinates?: [number, number]; // [lon, lat]
  zoom?: number;
  alerts?: IntelNewsItem[];
  onSelectAlert?: (alert: IntelNewsItem) => void;
  onOpenAuthModal?: () => void;
  onNavigateLogin?: () => void;
  isWorkspaceSaved?: boolean;
  onToggleSaveWorkspace?: () => void;
  onChangeCoordinates?: (coords: [number, number], zoom?: number) => void;
}

interface CityTimeZone {
  id: string;
  city: string;
  offsetLabel: string;
  timeZone: string;
}

const STRATEGIC_CITIES: CityTimeZone[] = [
  { id: 'delhi', city: 'Delhi', offsetLabel: 'IST (GMT+5:30)', timeZone: 'Asia/Kolkata' },
  { id: 'gmt', city: 'UTC / Zulu', offsetLabel: 'GMT+0', timeZone: 'UTC' },
  { id: 'washington', city: 'Washington', offsetLabel: 'EST (GMT-4)', timeZone: 'America/New_York' },
  { id: 'london', city: 'London', offsetLabel: 'GMT (GMT+0)', timeZone: 'Europe/London' },
  { id: 'moscow', city: 'Moscow', offsetLabel: 'MSK (GMT+3)', timeZone: 'Europe/Moscow' },
  { id: 'beijing', city: 'Beijing', offsetLabel: 'CST (GMT+8)', timeZone: 'Asia/Shanghai' },
  { id: 'tokyo', city: 'Tokyo', offsetLabel: 'JST (GMT+9)', timeZone: 'Asia/Tokyo' }
];

export interface HoverExpandButtonProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  active?: boolean;
  activeClassName?: string;
  onClick?: (e: React.MouseEvent) => void;
  title?: string;
  className?: string;
}

export const HoverExpandButton: React.FC<HoverExpandButtonProps> = ({
  icon,
  label,
  active = false,
  activeClassName = 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(56,189,248,0.35)]',
  onClick,
  title,
  className = ''
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`group relative inline-flex items-center h-[30px] px-2 rounded-md transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap select-none font-mono text-[11px] shrink-0 border border-transparent ${
        active
          ? activeClassName
          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
      } ${className}`}
    >
      <span className="shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
        {icon}
      </span>
      <span className="max-w-0 opacity-0 ml-0 overflow-hidden transition-[max-width,opacity,margin] duration-250 ease-out delay-0 group-hover:delay-200 group-hover:max-w-[180px] group-hover:opacity-100 group-hover:ml-1.5 flex items-center gap-1 font-medium">
        {label}
      </span>
    </button>
  );
};

/**
 * Flexible coordinate and angle parser supporting:
 * - Decimal: "25.06, 86.35" or "-33.86, 151.2"
 * - Cardinal angles: "25.06°N, 86.35°E" or "86.35 E 25.06 N" or "25.06N 86.35E"
 * - Degrees & minutes: "28°36'N, 77°12'E" or "28°36'20"N 77°12'15"E"
 * - Zoom notation: "• Z5.5", "Z6", "zoom 4" (either standalone or attached to coordinates)
 */
export function parseCoordinatesInput(
  rawInput: string,
  currentCenter: [number, number] = [86.35, 25.06],
  currentZoom: number = 3.5
): { coords: [number, number]; zoom?: number } | null {
  if (!rawInput || !rawInput.trim()) return null;
  let text = rawInput.trim().replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"');

  // 1. Extract zoom level if provided (e.g. "• Z3.5", "Z5", "zoom: 4")
  let parsedZoom: number | undefined = undefined;
  const zoomMatch = text.match(/(?:[•,;/|]|\s|^)\s*(?:z|zoom)\s*[:=]?\s*([0-9]+(?:\.[0-9]+)?)/i);
  if (zoomMatch) {
    const z = parseFloat(zoomMatch[1]);
    if (!isNaN(z)) {
      parsedZoom = Math.min(Math.max(z, 1.5), 18);
    }
    text = text.replace(zoomMatch[0], ' ').trim();
  }

  // If input was only a zoom directive (e.g. "Z6"), keep current coords and apply new zoom
  if (!text || text === '•' || text === ',' || text === ';') {
    if (parsedZoom !== undefined) {
      return { coords: currentCenter, zoom: parsedZoom };
    }
    return null;
  }

  // 2. Check for DMS (Degrees Minutes Seconds) or DM (Degrees Minutes) with N/S/E/W
  const dmsRegex = /(\d+(?:\.\d+)?)[°\s]+(?:(\d+(?:\.\d+)?)['′\s]+)?(?:(\d+(?:\.\d+)?)["″\s]*)?([NSEWnsew])/g;
  const dmsMatches = [...text.matchAll(dmsRegex)];
  if (dmsMatches.length === 2) {
    let lat: number | null = null;
    let lon: number | null = null;

    for (const m of dmsMatches) {
      const deg = parseFloat(m[1]) || 0;
      const min = parseFloat(m[2]) || 0;
      const sec = parseFloat(m[3]) || 0;
      const dir = m[4].toUpperCase();
      const val = deg + min / 60 + sec / 3600;
      if (dir === 'N') lat = val;
      else if (dir === 'S') lat = -val;
      else if (dir === 'E') lon = val;
      else if (dir === 'W') lon = -val;
    }

    if (lat !== null && lon !== null) {
      lat = Math.max(-85, Math.min(85, lat));
      lon = Math.max(-180, Math.min(180, lon));
      return { coords: [lon, lat], zoom: parsedZoom };
    }
  }

  // 3. Check for Cardinal Decimal Angles (e.g. "25.06°N, 86.35°E" or "25.06N, 86.35E")
  const cardinalRegex = /([+-]?\d+(?:\.\d+)?)\s*°?\s*([NSEWnsew])\b/gi;
  const cardMatches = [...text.matchAll(cardinalRegex)];
  if (cardMatches.length === 2) {
    let lat: number | null = null;
    let lon: number | null = null;

    for (const m of cardMatches) {
      const val = parseFloat(m[1]);
      const dir = m[2].toUpperCase();
      if (isNaN(val)) continue;
      if (dir === 'N') lat = Math.abs(val);
      else if (dir === 'S') lat = -Math.abs(val);
      else if (dir === 'E') lon = Math.abs(val);
      else if (dir === 'W') lon = -Math.abs(val);
    }

    if (lat !== null && lon !== null) {
      lat = Math.max(-85, Math.min(85, lat));
      lon = Math.max(-180, Math.min(180, lon));
      return { coords: [lon, lat], zoom: parsedZoom };
    }
  }

  // 4. Standard Decimal Pair: "lat, lon" or "lat lon" (e.g. "25.06, 86.35" or "-33.86, 151.20")
  const cleanNumbers = text.replace(/[^0-9.\-+\s,]/g, ' ').trim();
  const numMatches = cleanNumbers.match(/[+-]?\d+(?:\.\d+)?/g);
  if (numMatches && numMatches.length >= 2) {
    let lat = parseFloat(numMatches[0]);
    let lon = parseFloat(numMatches[1]);
    if (!isNaN(lat) && !isNaN(lon)) {
      lat = Math.max(-85, Math.min(85, lat));
      lon = Math.max(-180, Math.min(180, lon));
      return { coords: [lon, lat], zoom: parsedZoom };
    }
  }

  // If coordinates couldn't be parsed but zoom was parsed
  if (parsedZoom !== undefined) {
    return { coords: currentCenter, zoom: parsedZoom };
  }

  return null;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  timeRange,
  onSelectTimeRange,
  isRightPanelOpen,
  onToggleRightPanel,
  isWorkspaceDrawerOpen = false,
  onToggleWorkspaceDrawer,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onNavigateHome,
  getShareUrl,
  coordinates = [86.35, 25.06],
  zoom = 3.5,
  alerts = [],
  onSelectAlert,
  onOpenAuthModal,
  onNavigateLogin,
  isWorkspaceSaved = false,
  onToggleSaveWorkspace,
  onChangeCoordinates
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('delhi');
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isTheaterOpen, setIsTheaterOpen] = useState<boolean>(false);
  const [isClockOpen, setIsClockOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Editable coordinates state
  const [isEditingCoords, setIsEditingCoords] = useState<boolean>(false);
  const [coordsInput, setCoordsInput] = useState<string>('');
  const coordsInputRef = useRef<HTMLInputElement>(null);
  const clockDropdownRef = useRef<HTMLDivElement>(null);
  const theaterDropdownRef = useRef<HTMLDivElement>(null);

  const selectedCity = STRATEGIC_CITIES.find((c) => c.id === selectedCityId) || STRATEGIC_CITIES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (theaterDropdownRef.current && !theaterDropdownRef.current.contains(e.target as Node)) {
        setIsTheaterOpen(false);
      }
      if (clockDropdownRef.current && !clockDropdownRef.current.contains(e.target as Node)) {
        setIsClockOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShareLink = () => {
    const shareUrl = getShareUrl ? getShareUrl() : window.location.href;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  useEffect(() => {
    if (isEditingCoords && coordsInputRef.current) {
      coordsInputRef.current.focus();
      coordsInputRef.current.select();
    }
  }, [isEditingCoords]);

  const handleSaveCoords = () => {
    setIsEditingCoords(false);
    if (!coordsInput.trim()) return;
    const parsed = parseCoordinatesInput(coordsInput, coordinates, zoom);
    if (parsed && onChangeCoordinates) {
      onChangeCoordinates(parsed.coords, parsed.zoom);
    }
  };

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      try {
        const timeStr = new Intl.DateTimeFormat('en-GB', {
          timeZone: selectedCity.timeZone,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        }).format(now);
        setFormattedTime(timeStr);
      } catch {
        setFormattedTime(now.toTimeString().slice(0, 8));
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [selectedCity]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const theaters: { id: TheaterView; label: string }[] = [
    { id: 'global', label: 'Global' },
    { id: 'asia', label: 'Asia' },
    { id: 'africa', label: 'Africa' },
    { id: 'europe', label: 'Europe' },
    { id: 'north-america', label: 'North America' },
    { id: 'south-america', label: 'South America' },
    { id: 'oceania', label: 'Oceania' },
    { id: 'antarctica', label: 'Antarctica' }
  ];

  const currentTheater = theaters.find((th) => th.id === currentView) || theaters[0];
  const timeRanges = ['1h', '6h', '24h', '7d', '30d'];

  const lon = coordinates[0];
  const lat = coordinates[1];
  const latDisplay = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}`;
  const lonDisplay = `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;

  return (
    <header
      className="w-full h-11 bg-[var(--hud-bg)] border-b border-[var(--hud-border)] px-3 flex items-center justify-between select-none relative backdrop-blur-xl shrink-0 transition-colors shadow-xs"
      style={{ zIndex: 2000 }}
    >
      {/* 1. Left Cluster: Emblem, Theater Selector, Time Range */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Brand Emblem – real <a> so drag-to-tab-bar, middle-click, Ctrl+click, right-click all work natively */}
        <a
          href="https://manvis.tech/"
          aria-label="Manekshaw.Vision home"
          title="Manekshaw.Vision home"
          className="flex items-center gap-2 cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
          style={{ WebkitUserDrag: 'auto', userSelect: 'none' } as React.CSSProperties}
          onClick={(e) => {
            // Same-tab navigation via the app router; preserve browser default for Ctrl/Cmd/middle-click
            if (!e.ctrlKey && !e.metaKey && !e.shiftKey && e.button === 0) {
              e.preventDefault();
              if (onNavigateHome) onNavigateHome();
            }
          }}
          onDragStart={(e) => {
            const url = 'https://manvis.tech/';
            e.dataTransfer.setData('text/uri-list', url);
            e.dataTransfer.setData('text/plain', url);
            // Clean drag image: the emblem icon element
            const ghost = document.createElement('div');
            ghost.style.cssText = 'position:fixed;top:-999px;left:-999px;background:#0EA5E9;color:#05080F;font-family:monospace;font-size:11px;font-weight:700;padding:3px 8px;border-radius:3px;white-space:nowrap;';
            ghost.textContent = 'MANEKSHAW.VISION';
            document.body.appendChild(ghost);
            e.dataTransfer.setDragImage(ghost, 60, 10);
            setTimeout(() => document.body.removeChild(ghost), 0);
          }}
        >
          <div className="relative flex items-center justify-center w-6 h-6 rounded-md bg-sky-500/10 border border-sky-500/30 text-sky-400 group-hover:border-sky-400 transition-colors">
            <Radio size={13} className="animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-mono font-bold tracking-wider text-[var(--text-primary)] group-hover:text-sky-400 transition-colors">
              MANEKSHAW<span className="text-sky-400">.VISION</span>
            </span>
            <span className="hidden xl:inline-block px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              LIVE
            </span>
          </div>
        </a>

        {/* Divider */}
        <div className="hud-divider" />

        {/* Theater View Selector */}
        <div ref={theaterDropdownRef} className="relative">
          <button
            onClick={() => setIsTheaterOpen(!isTheaterOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-surface-elevated)]/90 hover:bg-[var(--bg-surface-hover)] border border-[var(--hud-border)] hover:border-sky-500/40 rounded-md font-mono text-[11px] text-[var(--text-primary)] transition-all cursor-pointer"
            title="Operational Theater View"
          >
            <span className="font-semibold tracking-wide truncate max-w-[90px] sm:max-w-none">
              {currentTheater.label}
            </span>
            <span className="text-[9px] text-sky-400">{isTheaterOpen ? '▲' : '▼'}</span>
          </button>

          {isTheaterOpen && (
            <div
              className="absolute left-0 top-full mt-1.5 animate-fade-in"
              style={{
                zIndex: 3000,
                backgroundColor: theme === 'dark' ? '#0B101B' : '#FFFFFF',
                border: '1px solid rgba(56, 189, 248, 0.3)',
                borderRadius: '4px',
                padding: '6px',
                minWidth: '170px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.05)'
              }}
            >
              <div
                className="px-2 py-1 text-[9px] font-mono font-bold uppercase tracking-wider mb-1"
                style={{
                  color: theme === 'dark' ? '#64748B' : '#94A3B8',
                  borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'
                }}
              >
                Select Theater
              </div>
              {theaters.map((th) => {
                const isSelected = currentView === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => {
                      onSelectView(th.id);
                      setIsTheaterOpen(false);
                    }}
                    className="transition-colors"
                    style={{
                      padding: '7px 12px',
                      borderRadius: '3px',
                      fontFamily: 'monospace',
                      fontSize: '11.5px',
                      color: isSelected
                        ? '#38BDF8'
                        : theme === 'dark'
                        ? '#CBD5E1'
                        : '#334155',
                      backgroundColor: isSelected
                        ? 'rgba(14, 165, 233, 0.2)'
                        : 'transparent',
                      border: isSelected
                        ? '1px solid rgba(56, 189, 248, 0.4)'
                        : '1px solid transparent',
                      fontWeight: isSelected ? 600 : 400,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'rgba(56, 189, 248, 0.12)';
                        e.currentTarget.style.color = '#F8FAFC';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = theme === 'dark' ? '#CBD5E1' : '#334155';
                      }
                    }}
                  >
                    <span>{th.label}</span>
                    {isSelected && <span className="text-[10px] text-sky-400">●</span>}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hud-divider hidden sm:block" />

        {/* 1.3 Left-Side Time Range Selector (Hover-Expandable Micro-Pill) */}
        <div
          className="relative group/timerange hidden sm:flex items-center h-[30px] rounded-md border border-[var(--hud-border)] hover:border-sky-500/40 bg-[var(--bg-surface-elevated)]/90 transition-all duration-250 ease-out overflow-hidden select-none font-mono text-[10px]"
          title="Telemetry Time Window (Hover to expand all ranges)"
        >
          {/* Resting State: Small Clock Icon + Active Range Badge */}
          <div className="flex items-center gap-1.5 px-2.5 text-sky-400 font-bold shrink-0 cursor-pointer">
            <Clock size={11} className="text-sky-400 shrink-0" />
            <span className="uppercase tracking-wider">{timeRange}</span>
          </div>

          {/* On Hover: Smoothly expand horizontally to reveal all 5 range buttons */}
          <div className="max-w-0 opacity-0 group-hover/timerange:delay-200 group-hover/timerange:max-w-[200px] group-hover/timerange:opacity-100 transition-all duration-250 ease-out delay-0 overflow-hidden flex items-center gap-[2px] pr-1.5">
            <div className="w-[1px] h-3.5 bg-[var(--hud-border)] mx-0.5 opacity-80" />
            {timeRanges.map((tr) => {
              const isActive = timeRange.toLowerCase() === tr.toLowerCase();
              return (
                <button
                  key={tr}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTimeRange(tr);
                  }}
                  className={`px-1.5 py-0.5 rounded-[2px] uppercase font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/40 shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-sky-300 hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {tr}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Center: Seamless Integrated Alert Dispatch Marquee with Mask Fade */}
      <div className="flex-1 min-w-0 mx-2.5 hidden md:flex items-center overflow-hidden h-full">
        <div
          className="flex-1 min-w-0 overflow-hidden relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 20px), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 20px), transparent)'
          }}
        >
          <div className="animate-marquee-dashboard flex items-center gap-8 whitespace-nowrap font-mono text-[11px]">
            {alerts && alerts.length > 0 ? (
              alerts.concat(alerts).map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  onClick={() => onSelectAlert && onSelectAlert(item)}
                  className="inline-flex items-center gap-1.5 cursor-pointer group text-[var(--text-secondary)] hover:text-sky-400 transition-colors"
                >
                  <span
                    className={`px-1 py-0.1 rounded text-[8.5px] font-bold uppercase ${
                      item.severity === 'critical'
                        ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                        : item.severity === 'high'
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        : 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                    }`}
                  >
                    {item.category}
                  </span>
                  <span className="font-medium text-[var(--text-primary)] group-hover:underline truncate max-w-[280px]">
                    {item.title}
                  </span>
                  <span className="text-[9.5px] text-[var(--text-muted)]">
                    {item.timeAgo}
                  </span>
                  <ChevronRight size={10} className="text-[var(--text-muted)] group-hover:text-sky-400" />
                </div>
              ))
            ) : (
              <span className="text-[var(--text-muted)]">ALL SENSORS NORMAL • MONITORING ACTIVE THEATERS</span>
            )}
          </div>
        </div>
      </div>

      {/* 3. Center-Right Telemetry Readouts (Coordinates & World Clock) */}
      <div className="hidden lg:flex items-center gap-1.5 shrink-0 relative mr-1">
        {/* Compass / Coordinates Readout Pill (Hover Expandable + In-Place Editable) */}
        <div
          className={`group/coords flex items-center h-[30px] rounded-md border transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap select-none font-mono text-[10.5px] ${
            theme === 'light'
              ? 'bg-white border-[#CBD5E1] shadow-2xs hover:border-sky-500'
              : 'bg-[var(--bg-surface-elevated)]/90 border-[var(--hud-border)] hover:border-sky-500/50 shadow-xs'
          } ${isEditingCoords ? 'border-sky-500 ring-1 ring-sky-500/40' : ''}`}
          onClick={() => {
            if (!isEditingCoords) {
              setCoordsInput(`${latDisplay}, ${lonDisplay} • Z${zoom.toFixed(1)}`);
              setIsEditingCoords(true);
            }
          }}
          title="Telemetry Coordinates (Hover to expand, click to edit custom coordinates/zoom)"
        >
          {/* Resting State: 30x30px Compass Icon */}
          <div className="flex items-center justify-center w-[30px] h-[30px] shrink-0 text-sky-400">
            <Compass size={13} className="text-sky-400 group-hover/coords:rotate-45 transition-transform duration-300" />
          </div>

          {/* On Hover (or while editing): Expand to show full coordinates */}
          <div
            className={`overflow-hidden transition-all duration-250 ease-out flex items-center whitespace-nowrap ${
              isEditingCoords
                ? 'max-w-[220px] opacity-100 pr-2 pl-0.5'
                : 'max-w-0 opacity-0 delay-0 group-hover/coords:delay-200 group-hover/coords:max-w-[220px] group-hover/coords:opacity-100 group-hover/coords:pr-2 group-hover/coords:pl-0.5'
            }`}
          >
            {isEditingCoords ? (
              <input
                ref={coordsInputRef}
                type="text"
                value={coordsInput}
                onChange={(e) => setCoordsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveCoords();
                  else if (e.key === 'Escape') setIsEditingCoords(false);
                }}
                onBlur={handleSaveCoords}
                className={`w-[175px] bg-transparent outline-none font-mono text-[10.5px] font-semibold text-center ${
                  theme === 'light' ? 'text-[#0284C7]' : 'text-sky-400'
                }`}
                placeholder="lat, lon • Z3.5"
                autoComplete="off"
                spellCheck={false}
              />
            ) : (
              <div className="flex items-center gap-1.5 font-semibold">
                <span className={theme === 'light' ? 'text-[#0284C7]' : 'text-sky-400'}>{latDisplay}</span>
                <span className="text-[var(--text-muted)]">,</span>
                <span className={theme === 'light' ? 'text-[#0284C7]' : 'text-sky-400'}>{lonDisplay}</span>
                <span className={theme === 'light' ? 'text-zinc-400' : 'text-zinc-600'}>•</span>
                <span className={`${theme === 'light' ? 'text-[#D97706]' : 'text-amber-400'}`}>Z{zoom.toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Clock & Timezone Selector Pill (Hover Expandable + Dropdown) */}
        <div ref={clockDropdownRef} className="relative">
          <div
            onClick={() => setIsClockOpen(!isClockOpen)}
            className={`group/clock flex items-center h-[30px] rounded-md border transition-all duration-200 cursor-pointer overflow-hidden whitespace-nowrap select-none font-mono text-[10.5px] ${
              theme === 'light'
                ? 'bg-white border-[#CBD5E1] shadow-2xs hover:border-sky-500'
                : 'bg-[var(--bg-surface-elevated)]/90 border-[var(--hud-border)] hover:border-sky-500/50 shadow-xs'
            } ${isClockOpen ? 'border-sky-500' : ''}`}
            title={`Live Tactical Clock: ${selectedCity.city} (${selectedCity.offsetLabel}) - Click to select timezone`}
          >
            {/* Resting: Clock Icon + live ticking HH:MM:SS */}
            <div className="flex items-center gap-1.5 px-2 text-sky-400 font-semibold shrink-0">
              <Clock size={12} className="text-sky-400 shrink-0 group-hover/clock:scale-105 transition-transform" />
              <span className="min-w-[56px] text-center">{formattedTime || '00:00:00'}</span>
            </div>

            {/* On Hover or when Open: Smoothly expand to show City + Offset + Chevron */}
            <div
              className={`overflow-hidden transition-all duration-250 ease-out flex items-center gap-1 text-[var(--text-secondary)] group-hover/clock:text-[var(--text-primary)] ${
                isClockOpen
                  ? 'max-w-[200px] opacity-100 pr-2 pl-0.5'
                  : 'max-w-0 opacity-0 delay-0 group-hover/clock:delay-200 group-hover/clock:max-w-[200px] group-hover/clock:opacity-100 group-hover/clock:pr-2 group-hover/clock:pl-0.5'
              }`}
            >
              <span className="text-[10px] truncate">{selectedCity.city} ({selectedCity.offsetLabel})</span>
              <ChevronDown size={11} className="text-sky-400 shrink-0" />
            </div>
          </div>

          {/* Clean Solid-Background Timezone Dropdown */}
          {isClockOpen && (
            <div
              className="absolute right-0 top-full mt-1.5 animate-fade-in font-mono text-[11px] rounded-md border shadow-2xl p-1 min-w-[210px] z-[3000]"
              style={{
                backgroundColor: theme === 'dark' ? '#0B101B' : '#FFFFFF',
                borderColor: theme === 'dark' ? 'rgba(56, 189, 248, 0.3)' : '#CBD5E1'
              }}
            >
              <div
                className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider mb-1"
                style={{
                  color: theme === 'dark' ? '#64748B' : '#94A3B8',
                  borderBottom: theme === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid #E2E8F0'
                }}
              >
                Select Strategic Timezone
              </div>
              {STRATEGIC_CITIES.map((c) => {
                const isSelected = c.id === selectedCityId;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCityId(c.id);
                      setIsClockOpen(false);
                    }}
                    className="flex items-center justify-between px-2.5 py-1.5 rounded cursor-pointer transition-colors"
                    style={{
                      backgroundColor: isSelected
                        ? 'rgba(14, 165, 233, 0.18)'
                        : 'transparent',
                      color: isSelected
                        ? '#38BDF8'
                        : theme === 'dark'
                        ? '#CBD5E1'
                        : '#334155',
                      fontWeight: isSelected ? 600 : 400
                    }}
                  >
                    <span>{c.city}</span>
                    <span className="text-[9.5px] opacity-70">{c.offsetLabel}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* 4. Right-Side Utility & Workstation Dock (Individual Hover-Reveal Labels) */}
      <div className="flex items-center gap-0.5 p-0.5 rounded-md border border-[var(--hud-border)] bg-[var(--bg-surface-elevated)]/80 shadow-xs font-mono text-[11px] shrink-0 relative z-50">
        {/* 1. Search */}
        <HoverExpandButton
          icon={<Search size={13} className="text-sky-400" />}
          label={
            <>
              <span>Search</span>
              <kbd className="px-1 py-0.2 rounded text-[9px] bg-white/10 text-slate-300">⌘K</kbd>
            </>
          }
          onClick={onOpenCommandPalette}
          title="Tactical Command Palette (Cmd+K / Ctrl+K)"
        />

        {/* 2. Share */}
        <HoverExpandButton
          icon={
            copiedLink ? (
              <Check size={13} className="text-emerald-400" />
            ) : (
              <Share2 size={13} className="text-sky-400" />
            )
          }
          label={copiedLink ? 'Link Copied!' : 'Share Dashboard'}
          onClick={handleShareLink}
          title={copiedLink ? 'Link Copied to Clipboard!' : 'Copy Sharable Dashboard Link'}
        />

        {/* 3. Save */}
        <HoverExpandButton
          icon={
            <Bookmark
              size={13}
              className={isWorkspaceSaved ? 'fill-sky-400 text-sky-400' : 'text-sky-400'}
            />
          }
          label={isWorkspaceSaved ? 'Saved (Unsave)' : 'Save Dashboard'}
          active={isWorkspaceSaved}
          activeClassName="bg-sky-500/15 border-sky-500/40 text-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.25)]"
          onClick={onToggleSaveWorkspace}
          title={
            isWorkspaceSaved
              ? 'Workspace Saved (Click to unsave)'
              : 'Save Workspace for your next login'
          }
        />

        {/* Divider */}
        <div className="w-[1px] h-3.5 bg-[var(--hud-border)] mx-0.5 opacity-60 shrink-0" />

        {/* 4. Operator Profile / Auth Shield */}
        <UserNav
          onOpenAuthModal={onOpenAuthModal || (() => {})}
          onNavigateLogin={onNavigateLogin}
        />

        {/* 5. Theme Toggle */}
        <HoverExpandButton
          icon={
            theme === 'dark' ? (
              <Sun size={13} className="text-amber-400" />
            ) : (
              <Moon size={13} className="text-sky-500" />
            )
          }
          label={theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        />

        {/* Divider */}
        <div className="w-[1px] h-3.5 bg-[var(--hud-border)] mx-0.5 opacity-60 shrink-0" />

        {/* 6. Audio Toggle */}
        <HoverExpandButton
          icon={
            audioEnabled ? (
              <Volume2 size={13} className="text-emerald-400" />
            ) : (
              <VolumeX size={13} className="text-slate-400" />
            )
          }
          label={audioEnabled ? 'Audio: ON' : 'Audio: MUTE'}
          onClick={() => setAudioEnabled(!audioEnabled)}
          title={audioEnabled ? 'Audio Pings: On' : 'Audio Pings: Muted'}
        />

        {/* 7. Fullscreen Toggle */}
        <HoverExpandButton
          icon={isFullscreen ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
          label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          onClick={toggleFullscreen}
          title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
        />

        {/* Divider */}
        <div className="w-[1px] h-3.5 bg-[var(--hud-border)] mx-0.5 opacity-60 shrink-0" />

        {/* 8. Four-Square Grid (Intel Workstation) */}
        <HoverExpandButton
          icon={
            <LayoutGrid
              size={13}
              className={isWorkspaceDrawerOpen ? 'text-slate-950' : 'text-sky-400'}
            />
          }
          label="Intel Workstation"
          active={isWorkspaceDrawerOpen}
          onClick={onToggleWorkspaceDrawer}
          title={
            isWorkspaceDrawerOpen
              ? 'Collapse Intel Workstation (Workspace Canvas)'
              : 'Open Intel Workstation (Workspace Canvas)'
          }
        />

        {/* 9. Intel Desk Toggle */}
        <HoverExpandButton
          icon={
            isRightPanelOpen ? (
              <PanelRightClose size={13} className="text-slate-950" />
            ) : (
              <PanelRightOpen size={13} className="text-sky-400" />
            )
          }
          label="Intel Desk"
          active={isRightPanelOpen}
          onClick={onToggleRightPanel}
          title={isRightPanelOpen ? 'Collapse Intelligence Desk' : 'Open Intelligence Desk'}
        />
      </div>
    </header>
  );
};
