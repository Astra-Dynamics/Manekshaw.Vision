import React, { useState, useEffect, useRef } from 'react';
import {
  Radio,
  Clock,
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
  { id: 'delhi', city: 'Delhi', offsetLabel: 'GMT+5:30', timeZone: 'Asia/Kolkata' },
  { id: 'gmt', city: 'UTC', offsetLabel: 'GMT+0', timeZone: 'UTC' },
  { id: 'moscow', city: 'Moscow', offsetLabel: 'GMT+3', timeZone: 'Europe/Moscow' },
  { id: 'beijing', city: 'Beijing', offsetLabel: 'GMT+8', timeZone: 'Asia/Shanghai' },
  { id: 'london', city: 'London', offsetLabel: 'GMT+0', timeZone: 'Europe/London' },
  { id: 'washington', city: 'Washington', offsetLabel: 'GMT-4', timeZone: 'America/New_York' },
  { id: 'tokyo', city: 'Tokyo', offsetLabel: 'GMT+9', timeZone: 'Asia/Tokyo' }
];

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
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // Editable coordinates state
  const [isEditingCoords, setIsEditingCoords] = useState<boolean>(false);
  const [coordsInput, setCoordsInput] = useState<string>('');
  const coordsInputRef = useRef<HTMLInputElement>(null);

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

  const theaterDropdownRef = useRef<HTMLDivElement>(null);
  const selectedCity = STRATEGIC_CITIES.find((c) => c.id === selectedCityId) || STRATEGIC_CITIES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (theaterDropdownRef.current && !theaterDropdownRef.current.contains(e.target as Node)) {
        setIsTheaterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
        {/* Brand Emblem (Click to return to Home) */}
        <div
          onClick={onNavigateHome}
          className="flex items-center gap-2 cursor-pointer group"
          title="Return to Manekshaw.Vision Home"
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
        </div>

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

        {/* Time Range Filter (Segmented Control Container) */}
        <div
          className="hidden sm:flex items-center p-0.5 rounded-[2px] border gap-[2px] font-mono text-[10px]"
          style={{
            background: 'var(--bg-surface-elevated)',
            borderColor: 'var(--border-subtle)'
          }}
        >
          {timeRanges.map((tr) => {
            const isActive = timeRange.toLowerCase() === tr.toLowerCase();
            return (
              <button
                key={tr}
                onClick={() => onSelectTimeRange(tr)}
                className={`px-2 py-[2px] rounded-[2px] transition-all uppercase font-semibold ${
                  isActive
                    ? 'font-bold shadow-xs'
                    : 'hover:bg-[var(--bg-surface-hover)]'
                }`}
                style={{
                  background: isActive ? 'rgba(14, 165, 233, 0.15)' : 'transparent',
                  color: isActive ? '#0284c7' : 'var(--text-secondary)',
                  border: isActive ? '1px solid rgba(14, 165, 233, 0.35)' : '1px solid transparent'
                }}
              >
                {tr}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Center: Seamless Integrated Alert Dispatch Marquee with Mask Fade */}
      <div className="flex-1 min-w-0 mx-3 mr-4 hidden md:flex items-center overflow-hidden h-full">
        <div className="hud-divider" />

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

      {/* 3. Right Cluster: Coordinates, Clock, Search, Theme, Desk Toggle */}
      <div className="flex items-center gap-1.5 shrink-0 relative z-50">
        {/* Monospace Live Telemetry Coordinates Readout with Visual Left Border (Directly Editable, No Icons) */}
        <div className={`hidden lg:flex items-center gap-1.5 pl-4 border-l ${theme === 'light' ? 'border-[#CBD5E1]' : 'border-white/10'} pr-1 text-[10.5px] font-mono text-[var(--text-muted)]`}>
          {isEditingCoords ? (
            <div
              className={`flex items-center px-1.5 py-0.5 rounded-md border transition-colors ${
                theme === 'light'
                  ? 'bg-white border-sky-500 shadow-2xs'
                  : 'bg-[var(--bg-surface-elevated)] border-sky-500/80 shadow-[0_0_8px_rgba(56,189,248,0.25)]'
              }`}
            >
              <input
                ref={coordsInputRef}
                type="text"
                value={coordsInput}
                onChange={(e) => setCoordsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveCoords();
                  } else if (e.key === 'Escape') {
                    setIsEditingCoords(false);
                  }
                }}
                onBlur={handleSaveCoords}
                className={`w-[185px] bg-transparent outline-none font-mono text-[10.5px] font-semibold text-center ${
                  theme === 'light' ? 'text-[#0284C7]' : 'text-sky-400'
                }`}
                placeholder="lat, lon • Z3.5"
                autoComplete="off"
                spellCheck={false}
              />
            </div>
          ) : (
            <div
              onClick={() => {
                setCoordsInput(`${latDisplay}, ${lonDisplay} • Z${zoom.toFixed(1)}`);
                setIsEditingCoords(true);
              }}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md border cursor-pointer transition-colors ${
                theme === 'light'
                  ? 'bg-white border-[#CBD5E1] shadow-2xs hover:border-sky-500'
                  : 'bg-[var(--bg-surface-elevated)]/60 border-[var(--hud-border)] hover:border-sky-500/60'
              }`}
              title="Click to enter custom coordinates or zoom (Enter to navigate)"
            >
              <span className={`${theme === 'light' ? 'text-[#0284C7]' : 'text-sky-400'} font-semibold`}>{latDisplay}</span>
              <span>,</span>
              <span className={`${theme === 'light' ? 'text-[#0284C7]' : 'text-sky-400'} font-semibold`}>{lonDisplay}</span>
              <span className={theme === 'light' ? 'text-zinc-400' : 'text-zinc-600'}>•</span>
              <span className={`${theme === 'light' ? 'text-[#D97706]' : 'text-amber-400'} font-semibold`}>Z{zoom.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="hud-divider hidden lg:block" />

        {/* Defense Clock with Strategic City Dropdown */}
        <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--bg-surface-elevated)]/70 border border-[var(--hud-border)] font-mono text-[11px] text-[var(--text-primary)]">
          <Clock size={11} className="text-sky-400 shrink-0" />
          <span className="font-semibold text-sky-400 min-w-[58px] text-center">
            {formattedTime || '00:00:00'}
          </span>
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono text-[10px] font-medium focus:outline-none cursor-pointer pr-0.5"
          >
            {STRATEGIC_CITIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                {c.city} ({c.offsetLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Divider */}
        <div className="hud-divider hidden sm:block" />

        {/* Search / Command Palette (Cmd+K) */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--bg-surface-elevated)]/80 hover:bg-[var(--bg-surface-hover)] border border-[var(--hud-border)] hover:border-sky-500/40 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all shadow-xs group"
          title="Tactical Command Palette (Cmd+K / Ctrl+K)"
        >
          <Search size={12} className="text-sky-400 group-hover:scale-110 transition-transform" />
          <kbd className="hidden sm:inline-block px-1 py-0.1 rounded text-[9px] bg-[var(--bg-surface)] border border-[var(--hud-border)] text-[var(--text-faint)]">
            ⌘K
          </kbd>
        </button>

        {/* Share Dashboard Intel Link (Icon Only) */}
        <button
          onClick={handleShareLink}
          className="flex items-center justify-center p-1.5 rounded-md bg-[var(--bg-surface-elevated)]/80 hover:bg-[var(--bg-surface-hover)] border border-[var(--hud-border)] hover:border-sky-500/40 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all shadow-xs group cursor-pointer"
          title={copiedLink ? "Link Copied to Clipboard!" : "Copy Sharable Dashboard Link"}
        >
          {copiedLink ? (
            <Check size={13} className="text-emerald-400" />
          ) : (
            <Share2 size={13} className="text-sky-400 group-hover:scale-110 transition-transform" />
          )}
        </button>

        {/* Bookmark / Save Workspace Layout (YouTube Style - Icon Only) */}
        <button
          onClick={onToggleSaveWorkspace}
          className={`flex items-center justify-center p-1.5 rounded-md border text-[11px] font-mono transition-all shadow-xs group cursor-pointer ${
            isWorkspaceSaved
              ? 'bg-sky-500/15 border-sky-500/40 text-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.25)]'
              : 'bg-[var(--bg-surface-elevated)]/80 hover:bg-[var(--bg-surface-hover)] border-[var(--hud-border)] hover:border-sky-500/40 text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
          title={
            isWorkspaceSaved
              ? 'Workspace Saved: Layout will restore on your next login (Click to unsave)'
              : 'Save Workspace: Click to save tabs, Intel Desk & Workspace layout for your next login'
          }
        >
          <Bookmark
            size={13}
            className={`transition-all group-hover:scale-110 ${
              isWorkspaceSaved ? 'fill-sky-400 text-sky-400' : 'text-sky-400'
            }`}
          />
        </button>

        {/* Operator Profile / Auth */}
        <UserNav
          onOpenAuthModal={onOpenAuthModal || (() => {})}
          onNavigateLogin={onNavigateLogin}
        />

        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-1.5 rounded-md bg-[var(--bg-surface-elevated)]/80 hover:bg-[var(--bg-surface-hover)] border border-[var(--hud-border)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          {theme === 'dark' ? (
            <Sun size={13} className="text-amber-400" />
          ) : (
            <Moon size={13} className="text-sky-500" />
          )}
        </button>

        {/* Audio / Fullscreen */}
        <div className="hidden xl:flex items-center gap-0.5 bg-[var(--bg-surface-elevated)]/80 rounded-md border border-[var(--hud-border)] p-0.5">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? 'Audio Pings: On' : 'Audio Pings: Muted'}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {audioEnabled ? <Volume2 size={12} className="text-emerald-400" /> : <VolumeX size={12} />}
          </button>
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            {isFullscreen ? <Minimize2 size={12} /> : <Maximize2 size={12} />}
          </button>
        </div>

        {/* Unified Intel Workstation & Intel Desk Toggle Control */}
        <div
          className="flex items-center rounded-md border border-[var(--hud-border)] bg-[var(--bg-surface-elevated)]/80 hover:border-sky-500/40 p-0.5 shadow-xs font-mono text-[10.5px] transition-all"
        >
          {/* Intel Workstation Option Icon (Left side) */}
          <button
            type="button"
            onClick={onToggleWorkspaceDrawer}
            title={
              isWorkspaceDrawerOpen
                ? 'Collapse Intel Workstation (Workspace Canvas)'
                : 'Open Intel Workstation (Workspace Canvas)'
            }
            aria-label="Toggle Intel Workstation"
            className={`flex items-center justify-center p-1 px-1.5 rounded-sm transition-all cursor-pointer ${
              isWorkspaceDrawerOpen
                ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(56,189,248,0.35)]'
                : 'text-[var(--text-muted)] hover:text-sky-400 hover:bg-white/5'
            }`}
          >
            <LayoutGrid size={13} />
          </button>

          {/* Separation Bar In Between */}
          <div className="w-[1px] h-3.5 bg-[var(--hud-border)] mx-0.5 opacity-80" />

          {/* Intel Desk Option (Right side) */}
          <button
            type="button"
            onClick={onToggleRightPanel}
            title={isRightPanelOpen ? 'Collapse Intelligence Desk' : 'Open Intelligence Desk'}
            aria-label="Toggle Intelligence Desk"
            className={`flex items-center gap-1.5 px-2 py-1 rounded-sm transition-all cursor-pointer ${
              isRightPanelOpen
                ? 'bg-sky-500 text-slate-950 font-bold shadow-[0_0_8px_rgba(56,189,248,0.35)]'
                : 'text-[var(--text-primary)] hover:text-sky-400 hover:bg-white/5'
            }`}
          >
            {isRightPanelOpen ? <PanelRightClose size={13} /> : <PanelRightOpen size={13} />}
            <span className="hidden sm:inline font-semibold">INTEL DESK</span>
          </button>
        </div>
      </div>
    </header>
  );
};
