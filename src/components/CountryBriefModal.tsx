import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Shield,
  Radio,
  Copy,
  CheckCircle,
  ExternalLink,
  Flame,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Crosshair,
  Activity,
  Layers,
  Globe
} from 'lucide-react';
import { CountryIntelDetails } from '../data/countryIntel';
import { IntelNewsItem, MapFeatureItem } from '../types';

interface CountryBriefModalProps {
  country: CountryIntelDetails | null;
  onClose: () => void;
  onCenterMap: (coords: [number, number], zoom?: number) => void;
  relatedNews: IntelNewsItem[];
  relatedAssets: MapFeatureItem[];
}

export const CountryBriefModal: React.FC<CountryBriefModalProps> = ({
  country,
  onClose,
  onCenterMap,
  relatedNews,
  relatedAssets
}) => {
  const [activeTab, setActiveTab] = useState<'brief' | 'military' | 'economy' | 'news'>('brief');
  const [copied, setCopied] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!country) return null;

  const handleCopy = () => {
    const text = `
=== MANEKSHAW.VISION COUNTRY INTELLIGENCE BRIEF: ${country.name} (${country.code}) ===
Region: ${country.region} | Capital: ${country.capital}
Country Instability Index (CII): ${country.ciiScore}/100 (${country.ciiRiskLevel} - ${country.ciiTrend})

EXECUTIVE SUMMARY:
${country.executiveSummary}

DEFENSE & NUCLEAR STATUS:
- Personnel: ${country.militaryPosture.activePersonnel}
- Defense Budget: ${country.militaryPosture.defenseBudget}
- Nuclear Status: ${country.militaryPosture.nuclearStatus}
- Alliances: ${country.militaryPosture.alliances.join(', ')}

ECONOMIC INDICATORS:
- GDP: ${country.gdp}
- Inflation: ${country.economicStatus.inflation}
- Reserves: ${country.economicStatus.foreignReserves}
- Primary Exports: ${country.economicStatus.primaryExports.join(', ')}

STRATEGIC RISKS:
${country.strategicRisks.map((r) => `• ${r}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFocusCountry = () => {
    if (country.bounds) {
      const centerLon = (country.bounds[0] + country.bounds[2]) / 2;
      const centerLat = (country.bounds[1] + country.bounds[3]) / 2;
      onCenterMap([centerLon, centerLat], 4.5);
    } else {
      onCenterMap([0, 20], 3.5);
    }
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-h-[90vh] overflow-hidden text-[var(--text-primary)] font-sans relative"
        style={{
          maxWidth: '760px',
          width: '100%',
          padding: '28px 32px',
          borderRadius: '4px',
          background: 'var(--bg-surface-elevated)',
          border: '1px solid var(--border-medium)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.85)',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px'
        }}
      >
        {/* Palantir Gotham Corner Bracket Accents */}
        <span className="bracket-tl" />
        <span className="bracket-tr" />
        <span className="bracket-bl" />
        <span className="bracket-br" />

        {/* 1. Header Row (Tactical 42x42 Square Box + Country Title + Instability Index) */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-[14px]">
            {/* Tactical 42x42 Square Badge (No duplicate text, clean sovereign code) */}
            <div
              className="w-[42px] h-[42px] rounded-[2px] border flex items-center justify-center font-mono font-bold text-sm text-sky-500 shrink-0"
              style={{
                borderColor: 'var(--border-medium)',
                background: 'var(--bg-surface)'
              }}
            >
              {country.code}
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
                {country.name}
              </h1>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {country.capital} • {country.region} • Leader: {country.leader}
              </p>
            </div>
          </div>

          {/* Clean Right Instability Index */}
          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="text-left font-mono">
              <span className="text-[10px] font-semibold tracking-wider uppercase block" style={{ color: 'var(--text-muted)' }}>
                INSTABILITY INDEX
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono" style={{ color: 'var(--text-primary)' }}>
                  {country.ciiScore}
                </span>
                <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>/100</span>
                <span
                  className="text-[10px] font-bold px-2 py-0.5 rounded-[2px] uppercase font-mono ml-1"
                  style={{
                    background:
                      country.ciiRiskLevel === 'Critical'
                        ? 'var(--badge-bg-critical)'
                        : country.ciiRiskLevel === 'High'
                        ? 'var(--badge-bg-high)'
                        : 'var(--badge-bg-info)',
                    color:
                      country.ciiRiskLevel === 'Critical'
                        ? 'var(--badge-text-critical)'
                        : country.ciiRiskLevel === 'High'
                        ? 'var(--badge-text-high)'
                        : 'var(--badge-text-info)',
                    border:
                      country.ciiRiskLevel === 'Critical'
                        ? '1px solid var(--badge-border-critical)'
                        : country.ciiRiskLevel === 'High'
                        ? '1px solid var(--badge-border-high)'
                        : '1px solid var(--badge-border-info)'
                  }}
                >
                  {country.ciiRiskLevel}
                </span>
              </div>
            </div>

            <div
              className="flex items-center gap-1 text-[11px] font-mono pl-3"
              style={{ borderLeft: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}
            >
              {country.ciiTrend === 'Escalating' ? (
                <TrendingUp size={15} className="text-rose-500" />
              ) : country.ciiTrend === 'De-escalating' ? (
                <TrendingDown size={15} className="text-emerald-500" />
              ) : (
                <Minus size={15} className="text-amber-500" />
              )}
              <span className="text-[10px] uppercase font-bold">{country.ciiTrend}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-[2px] hover:bg-[var(--bg-surface-hover)] transition-colors ml-1"
              style={{ color: 'var(--text-muted)' }}
              title="Close modal (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs (Clean bottom-bordered tab bar with cyan active underline) */}
        <div
          className="flex items-center gap-6 font-sans text-xs"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}
        >
          <button
            onClick={() => setActiveTab('brief')}
            className={`pb-2.5 font-medium transition-colors relative ${
              activeTab === 'brief'
                ? 'text-sky-500 font-semibold border-b-2 border-sky-500'
                : 'hover:text-[var(--text-primary)]'
            }`}
            style={{ color: activeTab === 'brief' ? '#0284c7' : 'var(--text-secondary)' }}
          >
            Strategic Brief
          </button>
          <button
            onClick={() => setActiveTab('military')}
            className={`pb-2.5 font-medium transition-colors relative ${
              activeTab === 'military'
                ? 'text-sky-500 font-semibold border-b-2 border-sky-500'
                : 'hover:text-[var(--text-primary)]'
            }`}
            style={{ color: activeTab === 'military' ? '#0284c7' : 'var(--text-secondary)' }}
          >
            Defense & Military
          </button>
          <button
            onClick={() => setActiveTab('economy')}
            className={`pb-2.5 font-medium transition-colors relative ${
              activeTab === 'economy'
                ? 'text-sky-500 font-semibold border-b-2 border-sky-500'
                : 'hover:text-[var(--text-primary)]'
            }`}
            style={{ color: activeTab === 'economy' ? '#0284c7' : 'var(--text-secondary)' }}
          >
            Economy & Trade
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`pb-2.5 font-medium transition-colors relative ${
              activeTab === 'news'
                ? 'text-sky-500 font-semibold border-b-2 border-sky-500'
                : 'hover:text-[var(--text-primary)]'
            }`}
            style={{ color: activeTab === 'news' ? '#0284c7' : 'var(--text-secondary)' }}
          >
            Intelligence Feed ({relatedNews.length})
          </button>
        </div>

        {/* 3. Modal Scrollable Body with Vertical Rhythm (flex flex-col gap-4) */}
        <div className="flex-1 overflow-y-auto flex flex-col gap-4 feed-scrollbar pr-1">
          {/* Tab 1: Strategic Brief */}
          {activeTab === 'brief' && (
            <div className="flex flex-col gap-4">
              {/* Executive Summary Box */}
              <div
                className="rounded-[2px] border"
                style={{
                  padding: '14px 18px',
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <span className="text-[10px] font-mono font-bold text-sky-500 uppercase tracking-wider flex items-center gap-1.5 mb-[6px]">
                  <Activity size={13} /> EXECUTIVE INTELLIGENCE SUMMARY
                </span>
                <p className="text-[13px] leading-relaxed font-sans" style={{ color: 'var(--text-secondary)' }}>
                  {country.executiveSummary}
                </p>
              </div>

              {/* Vulnerabilities Callout Box (Single left-accented callout box) */}
              <div
                className="rounded-[2px] font-sans"
                style={{
                  border: '1px solid rgba(245, 158, 11, 0.25)',
                  borderLeft: '3px solid #F59E0B',
                  background: 'rgba(245, 158, 11, 0.06)',
                  padding: '14px 18px'
                }}
              >
                <span className="text-[10.5px] font-mono font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5 mb-[6px]">
                  <AlertTriangle size={13} /> STRATEGIC VULNERABILITIES & FLASHPOINTS
                </span>
                <div className="flex flex-col gap-[6px]">
                  {country.strategicRisks.map((risk, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <span className="text-amber-500 font-bold shrink-0 mt-0.5">•</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4-Column Metric Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  className="rounded-[2px] border"
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <span className="text-[10px] uppercase font-mono block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                    Population
                  </span>
                  <span className="text-[13px] font-semibold block leading-snug break-words" style={{ color: 'var(--text-primary)' }}>
                    {country.population}
                  </span>
                </div>
                <div
                  className="rounded-[2px] border"
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <span className="text-[10px] uppercase font-mono block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                    Nominal GDP
                  </span>
                  <span className="text-[13px] font-semibold block leading-snug break-words" style={{ color: 'var(--text-primary)' }}>
                    {country.gdp}
                  </span>
                </div>
                <div
                  className="rounded-[2px] border"
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <span className="text-[10px] uppercase font-mono block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                    FX Reserves
                  </span>
                  <span className="text-[13px] font-semibold block leading-snug break-words" style={{ color: 'var(--text-primary)' }}>
                    {country.economicStatus.foreignReserves}
                  </span>
                </div>
                <div
                  className="rounded-[2px] border"
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <span className="text-[10px] uppercase font-mono block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                    Readiness
                  </span>
                  <span className="text-[13px] font-semibold text-emerald-500 block leading-snug break-words">
                    {country.militaryPosture.readiness}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Defense & Military */}
          {activeTab === 'military' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="rounded-[2px] border"
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <span className="text-[10px] uppercase font-mono block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                    ACTIVE ARMED FORCES
                  </span>
                  <span className="text-[14px] font-semibold block leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {country.militaryPosture.activePersonnel}
                  </span>
                </div>
                <div
                  className="rounded-[2px] border"
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <span className="text-[10px] uppercase font-mono block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                    ANNUAL DEFENSE BUDGET
                  </span>
                  <span className="text-[14px] font-semibold text-sky-500 block leading-snug">
                    {country.militaryPosture.defenseBudget}
                  </span>
                </div>
              </div>

              <div
                className="rounded-[2px] border"
                style={{
                  padding: '14px 18px',
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <span className="text-[10.5px] font-mono font-bold text-amber-500 uppercase tracking-wider block mb-[6px]">
                  NUCLEAR ARSENAL & STRATEGIC DETERRENT
                </span>
                <p className="text-xs leading-relaxed font-sans" style={{ color: 'var(--text-secondary)' }}>
                  {country.militaryPosture.nuclearStatus}
                </p>
              </div>

              <div
                className="rounded-[2px] border"
                style={{
                  padding: '14px 18px',
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <span className="text-[10.5px] font-mono font-bold text-sky-500 uppercase tracking-wider block mb-2">
                  SECURITY ALLIANCES & TREATY COMMITMENTS
                </span>
                <div className="flex flex-wrap gap-2">
                  {country.militaryPosture.alliances.map((alliance, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-[2px] bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-500/25 text-[11px] font-mono"
                    >
                      🛡️ {alliance}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Economy & Trade */}
          {activeTab === 'economy' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  className="rounded-[2px] border"
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <span className="text-[10px] uppercase font-mono block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                    CURRENCY
                  </span>
                  <span className="text-[13px] font-semibold block leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {country.economicStatus.currency}
                  </span>
                </div>
                <div
                  className="rounded-[2px] border"
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <span className="text-[10px] uppercase font-mono block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                    INFLATION RATE
                  </span>
                  <span className="text-[13px] font-semibold block leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {country.economicStatus.inflation}
                  </span>
                </div>
                <div
                  className="rounded-[2px] border"
                  style={{
                    padding: '12px 14px',
                    background: 'var(--bg-surface)',
                    borderColor: 'var(--border-subtle)'
                  }}
                >
                  <span className="text-[10px] uppercase font-mono block font-semibold mb-1" style={{ color: 'var(--text-muted)' }}>
                    SANCTIONS REGIME
                  </span>
                  <span className="text-[13px] font-semibold block leading-snug" style={{ color: 'var(--text-primary)' }}>
                    {country.economicStatus.sanctionsStatus}
                  </span>
                </div>
              </div>

              <div
                className="rounded-[2px] border"
                style={{
                  padding: '14px 18px',
                  background: 'var(--bg-surface)',
                  borderColor: 'var(--border-subtle)'
                }}
              >
                <span className="text-[10.5px] font-mono font-bold text-emerald-500 uppercase tracking-wider block mb-2">
                  KEY EXPORT DRIVERS & COMMODITIES
                </span>
                <div className="flex flex-wrap gap-2">
                  {country.economicStatus.primaryExports.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-[2px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border border-emerald-500/25 text-[11px] font-mono"
                    >
                      📦 {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: News Feed */}
          {activeTab === 'news' && (
            <div className="flex flex-col gap-3">
              {relatedNews.length === 0 ? (
                <div className="text-center py-12 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
                  No active breaking alerts directly tagged for {country.name} in the past 24 hours.
                </div>
              ) : (
                relatedNews.map((n) => (
                  <div
                    key={n.id}
                    className="rounded-[2px] border space-y-1.5"
                    style={{
                      padding: '14px 18px',
                      background: 'var(--bg-surface)',
                      borderColor: 'var(--border-subtle)'
                    }}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded-[2px] bg-sky-500/15 text-sky-500 font-bold uppercase">
                        {n.category}
                      </span>
                      <span style={{ color: 'var(--text-muted)' }}>{n.timeAgo}</span>
                    </div>
                    <h4 className="font-semibold text-[13.5px] leading-snug" style={{ color: 'var(--text-primary)' }}>
                      {n.title}
                    </h4>
                    <p className="text-xs leading-relaxed font-sans" style={{ color: 'var(--text-secondary)' }}>
                      {n.summary}
                    </p>
                    <div className="text-[10px] font-mono pt-0.5" style={{ color: 'var(--text-muted)' }}>
                      SOURCE: {n.source}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 4. Footer Action Row (Palantir Foundry Rectangular Controls) */}
        <div
          className="pt-3 flex items-center justify-between text-xs font-mono"
          style={{ borderTop: '1px solid var(--border-subtle)' }}
        >
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleFocusCountry}
              style={{
                borderRadius: '2px',
                padding: '8px 16px',
                fontFamily: 'monospace',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: 'rgba(14, 165, 233, 0.15)',
                border: '1px solid #0EA5E9',
                color: '#0284c7',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
              className="hover:bg-sky-500/25 transition-colors"
            >
              <Crosshair size={13} /> Center on Map
            </button>
            <button
              onClick={handleCopy}
              style={{
                borderRadius: '2px',
                padding: '8px 16px',
                fontFamily: 'monospace',
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-secondary)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
              className="hover:bg-[var(--bg-surface-hover)] transition-colors"
            >
              {copied ? <CheckCircle size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy Brief'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            style={{
              borderRadius: '2px',
              padding: '8px 16px',
              fontFamily: 'monospace',
              fontSize: '11px',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
            className="hover:text-[var(--text-primary)] hover:border-[var(--border-medium)] transition-colors"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
