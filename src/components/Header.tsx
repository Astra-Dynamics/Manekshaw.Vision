import React, { useState, useEffect } from 'react';
import {
  Globe,
  Radio,
  Clock,
  Layers,
  PanelRightClose,
  PanelRightOpen,
  Maximize2,
  Volume2,
  VolumeX,
  ShieldAlert,
  Flame,
  Target
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
  const [utcTime, setUtcTime] = useState<string>('');
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(now.toUTCString().replace('GMT', 'UTC'));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  const theaters: { id: TheaterView; label: string }[] = [
    { id: 'global', label: 'Global' },
    { id: 'india', label: 'India' },
    { id: 'middle-east', label: 'Middle East' },
    { id: 'indo-pacific', label: 'Indo-Pacific' },
    { id: 'europe', label: 'Europe' },
    { id: 'americas', label: 'Americas' },
  ];

  const timeRanges = ['24h', '7d', '30d'];

  return (
    <header className="w-full bg-[#0c1017]/95 border-b border-[#38bdf8]/20 px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-3 select-none z-30 relative shadow-lg backdrop-blur-md">
      {/* Brand & Status Indicator */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center">
            <Radio className="text-cyan-400 animate-pulse" size={20} />
            <span className="absolute w-2 h-2 rounded-full bg-red-500 pulse-red -top-0.5 -right-0.5"></span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wider text-slate-100 flex items-center gap-1.5 font-mono">
                MANEKSHAW<span className="text-sky-400">.VISION</span>
              </h1>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 pulse-green"></span>
                DEFCON 3
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-tight hidden sm:block">
              SOVEREIGN SITUATIONAL AWARENESS & DEFENSE INTELLIGENCE
            </p>
          </div>
        </div>

        {/* UTC Clock on Mobile */}
        <div className="md:hidden text-[11px] font-mono text-cyan-400/90 bg-slate-900/80 px-2 py-1 rounded border border-slate-700">
          {utcTime ? utcTime.slice(17, 25) + ' Z' : 'SYNCING'}
        </div>
      </div>

      {/* Center Theaters & Telemetry Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 text-xs">
        {/* Theater View Switcher */}
        <div className="flex items-center bg-slate-900/90 rounded border border-slate-700/80 p-0.5 font-mono text-[11px]">
          {theaters.map((th) => (
            <button
              key={th.id}
              onClick={() => onSelectView(th.id)}
              className={`px-2.5 py-1 rounded transition-all font-medium ${
                currentView === th.id
                  ? 'bg-sky-500 text-slate-950 font-bold shadow-sm shadow-sky-500/50'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              {th.label}
            </button>
          ))}
        </div>

        {/* Time Range Filter */}
        <div className="hidden lg:flex items-center bg-slate-900/90 rounded border border-slate-700/80 p-0.5 font-mono text-[11px]">
          <span className="px-1.5 text-slate-500 flex items-center gap-1">
            <Clock size={12} />
          </span>
          {timeRanges.map((tr) => (
            <button
              key={tr}
              onClick={() => onSelectTimeRange(tr)}
              className={`px-2 py-0.5 rounded transition-all uppercase ${
                timeRange === tr
                  ? 'bg-slate-700 text-sky-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {tr}
            </button>
          ))}
        </div>

        {/* Global Summary Metrics */}
        <div className="hidden xl:flex items-center gap-1.5 font-mono text-[10px]">
          <div className="flex items-center gap-1 bg-red-950/40 text-red-400 border border-red-500/30 px-2 py-1 rounded">
            <Flame size={12} />
            <span>HOTSPOTS: {counts.hotspots}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-950/40 text-amber-400 border border-amber-500/30 px-2 py-1 rounded">
            <Target size={12} />
            <span>STRIKES: {counts.strikes}</span>
          </div>
          <div className="flex items-center gap-1 bg-blue-950/40 text-blue-400 border border-blue-500/30 px-2 py-1 rounded">
            <ShieldAlert size={12} />
            <span>CONFLICTS: {counts.conflicts}</span>
          </div>
        </div>
      </div>

      {/* Right Controls & UTC Clock */}
      <div className="flex items-center gap-2 justify-end w-full md:w-auto">
        <div className="hidden md:flex flex-col text-right font-mono text-[10px] mr-1">
          <span className="text-slate-400">TELEMETRY SYNC</span>
          <span className="text-sky-400 font-semibold">{utcTime || 'CALIBRATING...'}</span>
        </div>

        <button
          onClick={onToggleLayerDock}
          title="Toggle Layers Control Dock"
          className={`p-1.5 rounded border transition-colors ${
            isLayerDockOpen
              ? 'bg-sky-500/20 text-sky-400 border-sky-500/50'
              : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
          }`}
        >
          <Layers size={16} />
        </button>

        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          title={audioEnabled ? 'Mute Alert Pings' : 'Enable Alert Pings'}
          className="p-1.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200 transition-colors"
        >
          {audioEnabled ? <Volume2 size={16} className="text-emerald-400" /> : <VolumeX size={16} />}
        </button>

        <button
          onClick={toggleFullscreen}
          title="Toggle Fullscreen Operations Display"
          className="p-1.5 rounded bg-slate-800/80 text-slate-400 border border-slate-700 hover:text-slate-200 transition-colors"
        >
          <Maximize2 size={16} />
        </button>

        {/* Intel Desk Panel Toggle */}
        <button
          onClick={onToggleRightPanel}
          title={isRightPanelOpen ? 'Collapse Intel Desk' : 'Open Intel Desk'}
          className={`px-2.5 py-1.5 rounded border flex items-center gap-1.5 font-mono text-[11px] transition-colors ${
            isRightPanelOpen
              ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 font-bold'
              : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:border-sky-500/50'
          }`}
        >
          {isRightPanelOpen ? <PanelRightClose size={15} /> : <PanelRightOpen size={15} />}
          <span className="hidden sm:inline">INTEL DESK</span>
        </button>
      </div>
    </header>
  );
};
