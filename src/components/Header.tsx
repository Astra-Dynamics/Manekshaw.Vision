import React, { useState, useEffect } from 'react';
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
  ChevronDown,
  Layers,
  Sparkles
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

  const selectedCity = STRATEGIC_CITIES.find((c) => c.id === selectedCityId) || STRATEGIC_CITIES[0];

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

  const theaters: { id: TheaterView; label: string; icon: string }[] = [
    { id: 'global', label: 'Global', icon: '🌐' },
    { id: 'india', label: 'India', icon: '🇮🇳' },
    { id: 'middle-east', label: 'Mid-East', icon: '⚡' },
    { id: 'indo-pacific', label: 'Indo-Pac', icon: '🌊' },
    { id: 'europe', label: 'Europe', icon: '🛡️' },
    { id: 'americas', label: 'Americas', icon: '🦅' }
  ];

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

      {/* 2. Center: Sleek Segmented Theater Switcher & Time Range */}
      <div className="hidden md:flex items-center gap-2">
        {/* Theater Switcher Segment */}
        <div className="flex items-center bg-[var(--bg-surface-elevated)] rounded-xl border border-[var(--border-subtle)] p-1 gap-0.5 font-mono text-xs shadow-inner">
          {theaters.map((th) => {
            const isActive = currentView === th.id;
            return (
              <button
                key={th.id}
                onClick={() => onSelectView(th.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium text-[11px] lg:text-xs ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/30'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <span className="text-xs">{th.icon}</span>
                <span>{th.label}</span>
              </button>
            );
          })}
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
