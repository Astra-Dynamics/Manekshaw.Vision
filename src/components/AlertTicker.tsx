import React from 'react';
import { AlertTriangle, ChevronRight } from 'lucide-react';
import { IntelNewsItem } from '../types';

interface AlertTickerProps {
  alerts: IntelNewsItem[];
  onSelectAlert: (alert: IntelNewsItem) => void;
}

export const AlertTicker: React.FC<AlertTickerProps> = ({ alerts, onSelectAlert }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="w-full bg-[#080b11] border-b border-[#38bdf8]/15 px-3 py-1 flex items-center gap-3 overflow-hidden select-none z-20 text-xs font-mono">
      {/* Ticker Badge */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-500/40 text-[10px] font-bold tracking-wider shrink-0 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-red-500 pulse-red"></span>
        FLASH INTEL
      </div>

      {/* Marquee Content */}
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-marquee hover:pause flex items-center gap-8 whitespace-nowrap">
          {alerts.concat(alerts).map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onSelectAlert(item)}
              className="inline-flex items-center gap-2 cursor-pointer group text-slate-300 hover:text-sky-300 transition-colors"
            >
              <span className={`px-1 rounded text-[9px] font-bold uppercase ${
                item.severity === 'critical' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                item.severity === 'high' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {item.category}
              </span>

              <span className="font-semibold text-slate-200 group-hover:underline">
                {item.title}
              </span>

              <span className="text-[10px] text-slate-500">
                [{item.source} • {item.timeAgo}]
              </span>

              <ChevronRight size={12} className="text-slate-600 group-hover:text-sky-400" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
