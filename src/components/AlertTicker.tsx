import React, { useState } from 'react';
import { Radio, ChevronRight, X, ChevronUp, ChevronDown } from 'lucide-react';
import { IntelNewsItem } from '../types';

interface AlertTickerProps {
  alerts: IntelNewsItem[];
  onSelectAlert: (alert: IntelNewsItem) => void;
}

export const AlertTicker: React.FC<AlertTickerProps> = ({ alerts, onSelectAlert }) => {
  const [isDismissed, setIsDismissed] = useState<boolean>(false);

  if (!alerts || alerts.length === 0 || isDismissed) return null;

  return (
    <div className="w-full bg-[var(--bg-sunken)] dark:bg-[var(--bg-surface-subtle)] border-b border-[var(--border-subtle)] px-3 py-1 flex items-center gap-3 overflow-hidden select-none z-20 text-xs font-sans dark:font-mono backdrop-blur-md transition-colors">
      {/* Sleek Ticker Badge */}
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--sev-critical-bg)] text-[var(--sev-critical)] border border-[var(--sev-critical)]/20 dark:bg-red-500/10 dark:text-red-500 dark:border-red-500/25 text-[10px] font-bold tracking-wider shrink-0 shadow-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--sev-critical)] dark:bg-red-500 animate-pulse" />
        DISPATCH
      </div>

      {/* Marquee Content */}
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-marquee-dashboard hover:pause flex items-center gap-8 whitespace-nowrap">
          {alerts.concat(alerts).map((item, idx) => (
            <div
              key={`${item.id}-${idx}`}
              onClick={() => onSelectAlert(item)}
              className="inline-flex items-center gap-2 cursor-pointer group text-[var(--text-secondary)] hover:text-[var(--accent-text)] dark:hover:text-sky-400 transition-colors"
            >
              <span
                className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                  item.severity === 'critical'
                    ? 'bg-[var(--sev-critical-bg)] text-[var(--sev-critical)] border border-[var(--sev-critical)]/20 dark:bg-red-500/15 dark:text-red-500 dark:border-red-500/30'
                    : item.severity === 'high'
                    ? 'bg-[var(--sev-high-bg)] text-[var(--sev-high)] border border-[var(--sev-high)]/20 dark:bg-amber-500/15 dark:text-amber-500 dark:border-amber-500/30'
                    : 'bg-[var(--sev-info-bg)] text-[var(--sev-info)] border border-[var(--sev-info)]/20 dark:bg-blue-500/15 dark:text-sky-500 dark:border-blue-500/30'
                }`}
              >
                {item.category}
              </span>

              <span className="font-semibold text-[var(--text-primary)] group-hover:underline">
                {item.title}
              </span>

              <span className="text-[10px] text-[var(--text-muted)]">
                {item.source} • {item.timeAgo}
              </span>

              <ChevronRight size={11} className="text-[var(--text-muted)] group-hover:text-[var(--accent-text)] dark:group-hover:text-sky-400" />
            </div>
          ))}
        </div>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => setIsDismissed(true)}
        title="Hide Flash Ticker"
        className="p-1 rounded text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors shrink-0"
      >
        <X size={13} />
      </button>
    </div>
  );
};
