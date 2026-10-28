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
  Check
} from 'lucide-react';
import { TheaterView, ThemeMode, IntelNewsItem } from '../types';

interface HeaderProps {
  currentView: TheaterView;
  onSelectView: (view: TheaterView) => void;
  timeRange: string;
  onSelectTimeRange: (range: string) => void;
  isRightPanelOpen: boolean;
  onToggleRightPanel: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenCommandPalette: () => void;
  onNavigateHome?: () => void;
  coordinates?: [number, number]; // [lon, lat]
  zoom?: number;
  alerts?: IntelNewsItem[];
  onSelectAlert?: (alert: IntelNewsItem) => void;
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

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onSelectView,
  timeRange,
  onSelectTimeRange,
  isRightPanelOpen,
  onToggleRightPanel,
  theme,
  onToggleTheme,
  onOpenCommandPalette,
  onNavigateHome,
  coordinates = [82.75, 22.46],
  zoom = 3.25,
  alerts = [],
  onSelectAlert
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('delhi');
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isTheaterOpen, setIsTheaterOpen] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
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
    { id: 'india', label: 'India' },
    { id: 'americas', label: 'Americas' },
    { id: 'middle-east', label: 'Middle East' },
    { id: 'europe', label: 'Europe' },
    { id: 'indo-pacific', label: 'Asia' },
    { id: 'latin-america', label: 'Latin America' },
    { id: 'africa', label: 'Africa' },
    { id: 'oceania', label: 'Oceania' }
  ];

  const currentTheater = theaters.find((th) => th.id === currentView) || theaters[0];
  const timeRanges = ['1h', '6h', '24h', '7d', '30d'];

  const lon = coordinates[0];
  const lat = coordinates[1];
  const latDisplay = `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}`;
  const lonDisplay = `${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`;

  return (
    <header className="w-full h-11 bg-[var(--hud-bg)] border-b border-[var(--hud-border)] px-3 flex items-center justify-between select-none z-30 relative backdrop-blur-xl shrink-0 transition-colors shadow-xs">
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
            className="flex items-center gap-1.5 px-2.5 py-1 bg-[var(--bg-surface-elevated)]/90 hover:bg-[var(--bg-surface-hover)] border border-[var(--hud-border)] hover:border-sky-500/40 rounded-md font-mono text-[11px] text-[var(--text-primary)] transition-all"
            title="Operational Theater View"
          >
            <span className="font-semibold tracking-wide truncate max-w-[90px] sm:max-w-none">
              {currentTheater.label}
            </span>
            <span className="text-[9px] text-sky-400">{isTheaterOpen ? '▲' : '▼'}</span>
          </button>

          {isTheaterOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-52 hud-panel-elevated p-1.5 font-mono text-[11px] rounded-lg animate-fade-in z-50 space-y-0.5">
              <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-[var(--text-muted)] border-b border-[var(--hud-border)] mb-1">
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
                    className={`px-2.5 py-1.5 rounded cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'bg-sky-500/20 text-sky-400 font-bold border border-sky-500/30'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
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
        
        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[9px] font-mono font-bold tracking-wider shrink-0 mr-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          DISPATCH
        </div>

        <div
          className="flex-1 min-w-0 overflow-hidden relative"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 20px), transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 16px, black calc(100% - 20px), transparent)'
          }}
        >
          <div className="animate-marquee flex items-center gap-8 whitespace-nowrap font-mono text-[11px]">
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
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Monospace Live Telemetry Coordinates Readout with Visual Left Border */}
        <div className="hidden lg:flex items-center gap-1.5 pl-4 border-l border-white/10 pr-1 text-[10.5px] font-mono text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--bg-surface-elevated)]/60 border border-[var(--hud-border)]">
            <span className="text-sky-400 font-semibold">{latDisplay}</span>
            <span>,</span>
            <span className="text-sky-400 font-semibold">{lonDisplay}</span>
            <span className="text-zinc-600">•</span>
            <span className="text-amber-400 font-semibold">Z{zoom.toFixed(1)}</span>
          </div>
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

        {/* Share Dashboard Intel Link */}
        <button
          onClick={handleShareLink}
          className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-[var(--bg-surface-elevated)]/80 hover:bg-[var(--bg-surface-hover)] border border-[var(--hud-border)] hover:border-sky-500/40 text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all shadow-xs group"
          title="Copy Sharable Dashboard Link"
        >
          {copiedLink ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-emerald-400 font-bold text-[10px]">COPIED</span>
            </>
          ) : (
            <>
              <Share2 size={12} className="text-sky-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline-block text-[10px] font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">SHARE</span>
            </>
          )}
        </button>

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

        {/* Intel Desk Toggle */}
        <button
          onClick={onToggleRightPanel}
          title={isRightPanelOpen ? 'Collapse Intelligence Desk' : 'Open Intelligence Desk'}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-mono text-[10.5px] transition-all ${
            isRightPanelOpen
              ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-sky-500/25'
              : 'bg-[var(--bg-surface-elevated)]/80 text-[var(--text-primary)] border-[var(--hud-border)] hover:border-sky-500/40'
          }`}
        >
          {isRightPanelOpen ? <PanelRightClose size={13} /> : <PanelRightOpen size={13} />}
          <span className="hidden sm:inline">INTEL DESK</span>
        </button>
      </div>
    </header>
  );
};
