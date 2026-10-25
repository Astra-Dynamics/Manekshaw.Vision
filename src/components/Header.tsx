import React, { useState, useEffect } from 'react';
import {
  Radio,
  Clock,
  Layers,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  ChevronDown,
  Globe2
} from 'lucide-react';
import { TheaterView } from '../types';

interface HeaderProps {
  currentView: TheaterView;
  onSelectView: (view: TheaterView) => void;
  timeRange: string;
  onSelectTimeRange: (range: string) => void;
  isRightPanelOpen: boolean;
  onToggleRightPanel: () => void;
  isLayerDockOpen: boolean;
  onToggleLayerDock: () => void;
  counts: {
    hotspots: number;
    strikes: number;
    bases: number;
    nuclear: number;
    conflicts: number;
    natural: number;
    outages: number;
  };
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
  isLayerDockOpen,
  onToggleLayerDock,
  counts
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
    { id: 'middle-east', label: 'Middle East', icon: '⚡' },
    { id: 'indo-pacific', label: 'Indo-Pacific', icon: '🌊' },
    { id: 'europe', label: 'Europe', icon: '🛡️' },
    { id: 'americas', label: 'Americas', icon: '🦅' }
  ];

  const timeRanges = ['24h', '7d', '30d'];

  return (
    <header className="w-full bg-[#070a10]/95 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between select-none z-30 relative backdrop-blur-xl">
      {/* 1. Left: Brand & Telemetry Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-sky-950/40 border border-sky-500/30">
            <Radio className="text-sky-400" size={17} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold tracking-wider text-slate-100 font-mono">
                MANEKSHAW<span className="text-sky-400">.VISION</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden lg:block">
              SOVEREIGN SITUATIONAL AWARENESS
            </p>
          </div>
        </div>
      </div>

      {/* 2. Center: Sleek Segmented Theater Controller with 2-3px spacing */}
      <div className="flex items-center gap-2">
        {/* Theater Switcher Segment */}
        <div className="flex items-center bg-slate-900/90 rounded-xl border border-slate-800/90 p-1.5 gap-1 font-mono text-xs shadow-inner">
          {theaters.map((th) => {
            const isActive = currentView === th.id;
            return (
              <button
                key={th.id}
                onClick={() => onSelectView(th.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-medium text-[11px] sm:text-xs mx-0.5 ${
                  isActive
                    ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span className="text-xs p-0.5">{th.icon}</span>
                <span>{th.label}</span>
              </button>
            );
          })}
        </div>

        {/* Time Range Filter (Compact Pill) */}
        <div className="hidden xl:flex items-center bg-slate-900/90 rounded-xl border border-slate-800/90 p-1.5 gap-0.5 font-mono text-[11px]">
          <span className="px-1.5 text-slate-500">
            <Clock size={12} />
          </span>
          {timeRanges.map((tr) => (
            <button
              key={tr}
              onClick={() => onSelectTimeRange(tr)}
              className={`px-2 py-0.5 rounded-lg transition-all uppercase ${
                timeRange === tr
                  ? 'bg-slate-800 text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Right: Multi-City Defense Clock with GMT Dropdown & Controls */}
      <div className="flex items-center gap-2.5">
        {/* Defense Clock with Dropdown Menu for GMT & Strategic Cities */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-900/80 border border-slate-800/90 font-mono text-xs text-slate-300">
          <Clock size={13} className="text-sky-400 shrink-0" />
          <span className="font-semibold text-sky-300 min-w-[70px] text-center">
            {formattedTime || 'CALIBRATING'}
          </span>
          <div className="h-3 w-px bg-slate-700 mx-0.5" />
          <select
            value={selectedCityId}
            onChange={(e) => setSelectedCityId(e.target.value)}
            className="bg-transparent text-slate-300 hover:text-sky-300 font-mono text-[11px] font-semibold focus:outline-none cursor-pointer pr-1"
          >
            {STRATEGIC_CITIES.map((c) => (
              <option key={c.id} value={c.id} className="bg-slate-950 text-slate-200">
                {c.city} ({c.offsetLabel})
              </option>
            ))}
          </select>
        </div>

        {/* Controls Cluster */}
        <div className="flex items-center gap-1 bg-slate-900/60 rounded-xl border border-slate-800/80 p-0.5">
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            title={audioEnabled ? 'Audio Pings: On' : 'Audio Pings: Muted'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            {audioEnabled ? <Volume2 size={15} className="text-emerald-400" /> : <VolumeX size={15} />}
          </button>

          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
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
              ? 'bg-sky-500/15 text-sky-300 border-sky-500/40 font-bold'
              : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700'
          }`}
        >
          {isRightPanelOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          <span className="hidden sm:inline">INTEL DESK</span>
        </button>
      </div>
    </header>
  );
};
