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
import { CountryIntelDetails, getFlagEmoji } from '../data/countryIntel';
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

  const flag = getFlagEmoji(country.code);

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
        className="w-full max-w-4xl max-h-[92vh] rounded-[8px] p-6 flex flex-col overflow-hidden text-[#F8FAFC] font-sans shadow-2xl"
        style={{
          background: 'rgba(10, 14, 22, 0.95)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)'
        }}
      >
        {/* 1. Header Row (Clean ISO Tactical Box + Title + Right Instability Index) */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3.5">
            {/* Tactical 40x40 Square Box for Country Code */}
            <div className="w-10 h-10 rounded border border-white/10 bg-white/5 flex items-center justify-center font-mono font-bold text-sm text-sky-400 shrink-0">
              {country.code}
            </div>
            <span className="text-3xl select-none shrink-0 drop-shadow-sm">{flag}</span>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-[#F8FAFC] tracking-tight">
                {country.name}
              </h1>
              <p className="text-xs font-mono text-[#94A3B8] mt-0.5">
                {country.capital} • {country.region} • Leader: {country.leader}
              </p>
            </div>
          </div>

          {/* Clean Right Instability Index (No cramped pill outline) */}
          <div className="flex items-center gap-4 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="text-left font-mono">
              <span className="text-[10px] text-[#64748B] font-semibold tracking-wider uppercase block">
                INSTABILITY INDEX
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono text-[#F8FAFC]">
                  {country.ciiScore}
                </span>
                <span className="text-[11px] text-[#64748B]">/100</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ml-1 ${
                    country.ciiRiskLevel === 'Critical'
                      ? 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                      : country.ciiRiskLevel === 'High'
                      ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                      : country.ciiRiskLevel === 'Elevated'
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {country.ciiRiskLevel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-[#94A3B8] pl-3 border-l border-white/10">
              {country.ciiTrend === 'Escalating' ? (
                <TrendingUp size={15} className="text-rose-400" />
              ) : country.ciiTrend === 'De-escalating' ? (
                <TrendingDown size={15} className="text-emerald-400" />
              ) : (
                <Minus size={15} className="text-amber-400" />
              )}
              <span className="text-[10px] uppercase font-bold">{country.ciiTrend}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/10 text-[#94A3B8] hover:text-white transition-colors ml-1"
              title="Close modal (Esc)"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs (Clean bottom-bordered tab bar with cyan active underline) */}
        <div className="border-b border-white/10 flex items-center gap-6 mt-3 font-sans text-xs">
          <button
            onClick={() => setActiveTab('brief')}
            className={`pb-2.5 font-medium transition-colors relative ${
              activeTab === 'brief'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Strategic Brief
          </button>
          <button
            onClick={() => setActiveTab('military')}
            className={`pb-2.5 font-medium transition-colors relative ${
              activeTab === 'military'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Defense & Military
          </button>
          <button
            onClick={() => setActiveTab('economy')}
            className={`pb-2.5 font-medium transition-colors relative ${
              activeTab === 'economy'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Economy & Trade
          </button>
          <button
            onClick={() => setActiveTab('news')}
            className={`pb-2.5 font-medium transition-colors relative ${
              activeTab === 'news'
                ? 'text-sky-400 font-semibold border-b-2 border-sky-400'
                : 'text-[#94A3B8] hover:text-[#F8FAFC]'
            }`}
          >
            Intelligence Feed ({relatedNews.length})
          </button>
        </div>

        {/* 3. Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 feed-scrollbar">
          {/* Tab 1: Strategic Brief */}
          {activeTab === 'brief' && (
            <div className="space-y-4">
              {/* Executive Summary */}
              <div className="p-4 rounded-[6px] border border-white/[0.07] bg-white/[0.02] space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={13} /> EXECUTIVE INTELLIGENCE SUMMARY
                </span>
                <p className="text-[13px] text-[#94A3B8] leading-relaxed font-sans pt-0.5">
                  {country.executiveSummary}
                </p>
              </div>

              {/* Vulnerabilities Callout Box (Single left-accented callout box) */}
              <div
                className="rounded-[4px] space-y-2 font-sans"
                style={{
                  borderLeft: '2px solid #F59E0B',
                  background: 'rgba(245, 158, 11, 0.04)',
                  padding: '12px 16px'
                }}
              >
                <span className="text-[10.5px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={13} /> STRATEGIC VULNERABILITIES & FLASHPOINTS
                </span>
                <div className="space-y-1.5 pt-0.5">
                  {country.strategicRisks.map((risk, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-amber-200/90 leading-relaxed">
                      <span className="text-amber-400 font-bold shrink-0 mt-0.5">•</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div
                  className="rounded-[6px] p-[12px_14px] border border-white/[0.07]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                    Population
                  </span>
                  <span className="text-[14px] font-semibold text-[#F1F5F9] block mt-1">
                    {country.population}
                  </span>
                </div>
                <div
                  className="rounded-[6px] p-[12px_14px] border border-white/[0.07]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                    Nominal GDP
                  </span>
                  <span className="text-[14px] font-semibold text-[#F1F5F9] block mt-1">
                    {country.gdp}
                  </span>
                </div>
                <div
                  className="rounded-[6px] p-[12px_14px] border border-white/[0.07]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                    FX Reserves
                  </span>
                  <span className="text-[14px] font-semibold text-[#F1F5F9] block mt-1 truncate">
                    {country.economicStatus.foreignReserves}
                  </span>
                </div>
                <div
                  className="rounded-[6px] p-[12px_14px] border border-white/[0.07]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                    Readiness
                  </span>
                  <span className="text-[13px] font-semibold text-emerald-400 block mt-1 truncate">
                    {country.militaryPosture.readiness}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Defense & Military */}
          {activeTab === 'military' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className="rounded-[6px] p-[12px_14px] border border-white/[0.07]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                    ACTIVE ARMED FORCES
                  </span>
                  <span className="text-[15px] font-semibold text-[#F1F5F9] block mt-1">
                    {country.militaryPosture.activePersonnel}
                  </span>
                </div>
                <div
                  className="rounded-[6px] p-[12px_14px] border border-white/[0.07]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                    ANNUAL DEFENSE BUDGET
                  </span>
                  <span className="text-[15px] font-semibold text-sky-400 block mt-1">
                    {country.militaryPosture.defenseBudget}
                  </span>
                </div>
              </div>

              <div
                className="rounded-[6px] p-[14px_16px] border border-white/[0.07] space-y-1.5"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <span className="text-[10.5px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  NUCLEAR ARSENAL & STRATEGIC DETERRENT
                </span>
                <p className="text-xs text-[#94A3B8] leading-relaxed font-sans pt-0.5">
                  {country.militaryPosture.nuclearStatus}
                </p>
              </div>

              <div
                className="rounded-[6px] p-[14px_16px] border border-white/[0.07] space-y-2"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <span className="text-[10.5px] font-mono font-bold text-sky-400 uppercase tracking-wider block">
                  SECURITY ALLIANCES & TREATY COMMITMENTS
                </span>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {country.militaryPosture.alliances.map((alliance, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-[4px] bg-sky-500/10 text-sky-300 border border-sky-500/25 text-[11px] font-mono"
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
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div
                  className="rounded-[6px] p-[12px_14px] border border-white/[0.07]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                    CURRENCY
                  </span>
                  <span className="text-[14px] font-semibold text-[#F1F5F9] block mt-1">
                    {country.economicStatus.currency}
                  </span>
                </div>
                <div
                  className="rounded-[6px] p-[12px_14px] border border-white/[0.07]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                    INFLATION RATE
                  </span>
                  <span className="text-[14px] font-semibold text-[#F1F5F9] block mt-1">
                    {country.economicStatus.inflation}
                  </span>
                </div>
                <div
                  className="rounded-[6px] p-[12px_14px] border border-white/[0.07]"
                  style={{ background: 'rgba(255, 255, 255, 0.02)' }}
                >
                  <span className="text-[10px] uppercase font-mono text-[#64748B] block font-semibold">
                    SANCTIONS REGIME
                  </span>
                  <span className="text-[13px] font-semibold text-[#F1F5F9] block mt-1 truncate">
                    {country.economicStatus.sanctionsStatus}
                  </span>
                </div>
              </div>

              <div
                className="rounded-[6px] p-[14px_16px] border border-white/[0.07] space-y-2"
                style={{ background: 'rgba(255, 255, 255, 0.02)' }}
              >
                <span className="text-[10.5px] font-mono font-bold text-emerald-400 uppercase tracking-wider block">
                  KEY EXPORT DRIVERS & COMMODITIES
                </span>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  {country.economicStatus.primaryExports.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-[4px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-[11px] font-mono"
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
            <div className="space-y-3">
              {relatedNews.length === 0 ? (
                <div className="text-center py-12 text-xs text-[#64748B] font-mono">
                  No active breaking alerts directly tagged for {country.name} in the past 24 hours.
                </div>
              ) : (
                relatedNews.map((n) => (
                  <div
                    key={n.id}
                    className="p-[14px_16px] rounded-[6px] border border-white/[0.07] bg-white/[0.02] space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-sky-500/15 text-sky-400 font-bold uppercase">
                        {n.category}
                      </span>
                      <span className="text-[#64748B]">{n.timeAgo}</span>
                    </div>
                    <h4 className="text-[#F8FAFC] font-semibold text-[13.5px] leading-snug">{n.title}</h4>
                    <p className="text-[#94A3B8] text-xs leading-relaxed font-sans">{n.summary}</p>
                    <div className="text-[10px] font-mono text-[#64748B] pt-0.5">SOURCE: {n.source}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 4. Footer Actions (Sleek rectangular tactical buttons with top divider) */}
        <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFocusCountry}
              className="px-3 py-1.5 rounded-[4px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Crosshair size={13} /> Center on Map
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-[4px] bg-white/5 hover:bg-white/10 text-[#F8FAFC] font-medium flex items-center gap-1.5 border border-white/10 transition-colors"
            >
              {copied ? <CheckCircle size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy Brief'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-[4px] bg-transparent hover:bg-white/5 text-[#94A3B8] hover:text-white border border-white/10 transition-colors"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
