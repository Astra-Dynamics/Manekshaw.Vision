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
  Search
} from 'lucide-react';
import { TheaterView, ThemeMode } from '../types';

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
}

interface CityTimeZone {
  id: string;
  city: string;
  offsetLabel: string;
  timeZone: string;
}

const STRATEGIC_CITIES: CityTimeZone[] = [
  { id: 'delhi', city: 'Delhi', offsetLabel: 'GMT+5:30', timeZone: 'Asia/Kolkata' },
  { id: 'gmt', city: 'UTC / GMT', offsetLabel: 'GMT+0', timeZone: 'UTC' },
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
  onOpenCommandPalette
}) => {
  const [selectedCityId, setSelectedCityId] = useState<string>('delhi');
  const [formattedTime, setFormattedTime] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [isTheaterOpen, setIsTheaterOpen] = useState<boolean>(false);

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
      } catch (err) {
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

  // Theaters matching the reference image dropdown exactly
  const theaters: { id: TheaterView; label: string }[] = [
    { id: 'global', label: 'Global' },
    { id: 'india', label: 'India' },
    { id: 'americas', label: 'Americas' },
    { id: 'middle-east', label: 'Middle East and North Africa' },
    { id: 'europe', label: 'Europe' },
    { id: 'indo-pacific', label: 'Asia' },
    { id: 'latin-america', label: 'Latin America' },
    { id: 'africa', label: 'Africa' },
    { id: 'oceania', label: 'Oceania' }
  ];

  const currentTheater = theaters.find((th) => th.id === currentView) || theaters[0];
  const timeRanges = ['1h', '6h', '24h', '7d', '30d'];

  return (
    <header className="w-full h-14 bg-[var(--bg-surface)] border-b border-[var(--border-subtle)] px-4 flex items-center justify-between select-none z-30 relative backdrop-blur-xl shrink-0 transition-colors">
      {/* 1. Left: Brand & Sovereign Telemetry Emblem */}
      <div className="flex items-center gap-3.5">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 shadow-xs">
            <Radio size={16} className="animate-pulse" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-wider text-[var(--text-primary)] font-mono">
                MANEKSHAW<span className="text-sky-400">.VISION</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE OPS
              </span>
            </div>
            <p className="text-[10px] text-[var(--text-muted)] font-mono tracking-tight hidden lg:block">
              SOVEREIGN SITUATIONAL AWARENESS
            </p>
          </div>
        </div>
      </div>

      {/* 2. Center: Dropdown Selector Matching Reference Image */}
      <div className="flex items-center gap-2.5">
        <div ref={theaterDropdownRef} className="relative select-none">
          <button
            onClick={() => setIsTheaterOpen(!isTheaterOpen)}
            className="flex items-center justify-between gap-3 px-3.5 py-1.5 min-w-[140px] sm:min-w-[180px] bg-[#000000] border-2 border-emerald-500/90 hover:border-emerald-400 font-mono text-xs text-white shadow-md transition-all focus:outline-none rounded-xl"
            title="Select Operational Theater View"
          >
            <span className="font-bold tracking-wide truncate">{currentTheater.label}</span>
            <span className="text-[9px] text-slate-400 font-sans ml-1">▼</span>
          </button>

          {isTheaterOpen && (
            <div className="absolute left-0 top-full mt-1.5 w-full min-w-[230px] bg-[#000000] border-2 border-emerald-500/90 shadow-2xl z-50 p-1.5 font-mono text-xs overflow-hidden rounded-xl animate-fade-in backdrop-blur-md space-y-0.5">
              {theaters.map((th) => {
                const isSelected = currentView === th.id;
                return (
                  <div
                    key={th.id}
                    onClick={() => {
                      onSelectView(th.id);
                      setIsTheaterOpen(false);
                    }}
                    className={`px-3 py-2 rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold'
                        : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    {th.label}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Time Range Filter (Compact Pill) */}
        <div className="hidden xl:flex items-center bg-[var(--bg-surface-elevated)] rounded-xl border border-[var(--border-subtle)] p-1 gap-0.5 font-mono text-[11px]">
          <span className="px-1.5 text-[var(--text-muted)]">
            <Clock size={12} />
          </span>
          {timeRanges.map((tr) => (
            <button
              key={tr}
              onClick={() => onSelectTimeRange(tr)}
              className={`px-2 py-0.5 rounded-lg transition-all uppercase ${
                timeRange === tr
                  ? 'bg-[var(--bg-surface-hover)] text-sky-400 font-bold border border-[var(--border-subtle)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Right: Command Search, Clock, Theme & Desk Toggle */}
      <div className="flex items-center gap-2">
        {/* Quick Search / Cmd+K Button */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] hover:border-[var(--border-accent)] text-xs font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-all shadow-xs group"
          title="Open Tactical Command Palette (Cmd+K / Ctrl+K)"
        >
          <Search size={13} className="text-sky-400 group-hover:scale-110 transition-transform" />
          <span className="hidden xl:inline font-sans">Search...</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-faint)]">
            ⌘K
          </kbd>
        </button>

        {/* Defense Clock with Dropdown Menu for GMT & Strategic Cities */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)]">
          <Clock size={13} className="text-sky-400 shrink-0" />
          <span className="font-semibold text-sky-400 min-w-[65px] text-center">
            {formattedTime || '00:00:00'}
          </span>
          <div className="h-3 w-px bg-[var(--border-subtle)] mx-0.5" />
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="bg-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] font-mono text-[11px] font-semibold focus:outline-none cursor-pointer pr-1"
          >
            {STRATEGIC_CITIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
                {c.city} ({c.offsetLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Theme Toggle Button (Dark / Light) */}
        <button
          onClick={onToggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          className="p-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors shadow-xs"
        >
          {theme === 'dark' ? (
            <Sun size={15} className="text-amber-400" />
          ) : (
            <Moon size={15} className="text-sky-600" />
          )}
        </button>

        {/* Audio Mute & Fullscreen Cluster */}
        <div className="hidden sm:flex items-center gap-0.5 bg-[var(--bg-surface-elevated)] rounded-xl border border-[var(--border-subtle)] p-0.5">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? 'Audio Pings: On' : 'Audio Pings: Muted'}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            {audioEnabled ? <Volume2 size={15} className="text-emerald-400" /> : <VolumeX size={15} />}
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          >
            {isFullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
          </button>
        </div>

        {/* Intel Desk Toggle Button */}
        <button
          onClick={onToggleRightPanel}
          title={isRightPanelOpen ? 'Collapse Intelligence Desk' : 'Open Intelligence Desk'}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border font-mono text-xs transition-all shadow-sm ${
            isRightPanelOpen
              ? 'bg-sky-500 text-slate-950 border-sky-400 font-bold shadow-sky-500/20'
              : 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border-[var(--border-subtle)] hover:border-[var(--border-accent)]'
          }`}
        >
          {isRightPanelOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          <span className="hidden sm:inline">INTEL DESK</span>
        </button>
      </div>
    </header>
  );
};
