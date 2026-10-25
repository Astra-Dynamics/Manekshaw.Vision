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
  DollarSign,
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
      // Default center
      onCenterMap([0, 20], 3.5);
    }
    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-4xl max-h-[92vh] bg-[#090d15] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 font-sans"
      >
        {/* Modal Top Header Bar with distinct spacing */}
        <div className="p-4 sm:p-5 m-1 border border-slate-800/90 rounded-xl bg-slate-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-4xl sm:text-5xl drop-shadow-md select-none">{flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-100 tracking-tight font-sans">
                  {country.name}
                </h1>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40 font-bold">
                  {country.code}
                </span>
              </div>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                {country.capital} • {country.region} • Leader: {country.leader}
              </p>
            </div>
          </div>

          {/* CII Threat Gauge Badge */}
          <div className="flex items-center gap-3 bg-slate-950/90 p-2.5 rounded-xl border border-slate-800 self-stretch sm:self-auto justify-between sm:justify-start">
            <div className="text-left font-mono">
              <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
                INSTABILITY INDEX
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-black text-slate-100 font-mono">
                  {country.ciiScore}
                </span>
                <span className="text-[10px] text-slate-500">/100</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    country.ciiRiskLevel === 'Critical'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : country.ciiRiskLevel === 'High'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                      : country.ciiRiskLevel === 'Elevated'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  }`}
                >
                  {country.ciiRiskLevel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400 pl-2 border-l border-slate-800">
              {country.ciiTrend === 'Escalating' ? (
                <TrendingUp size={16} className="text-red-400" />
              ) : country.ciiTrend === 'De-escalating' ? (
                <TrendingDown size={16} className="text-emerald-400" />
              ) : (
                <Minus size={16} className="text-amber-400" />
              )}
              <span className="text-[10px] uppercase font-bold">{country.ciiTrend}</span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors ml-2"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Navigation Tabs with spacing */}
        <div className="mx-1 px-1 border-b border-slate-800 text-xs font-mono bg-slate-950/40">
          <div className="flex items-center gap-1 p-1">
            <button
              onClick={() => setActiveTab('brief')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all ${
                activeTab === 'brief'
                  ? 'text-sky-400 font-bold bg-slate-900 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              Strategic Brief
            </button>
            <button
              onClick={() => setActiveTab('military')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all ${
                activeTab === 'military'
                  ? 'text-cyan-400 font-bold bg-slate-900 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              Defense & Military
            </button>
            <button
              onClick={() => setActiveTab('economy')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all ${
                activeTab === 'economy'
                  ? 'text-emerald-400 font-bold bg-slate-900 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              Economy & Trade
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`flex-1 py-2.5 px-3 rounded-lg text-center transition-all ${
                activeTab === 'news'
                  ? 'text-amber-400 font-bold bg-slate-900 border border-slate-700/80 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              Intelligence Feed ({relatedNews.length})
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body with generous box spacing */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {/* 1. Strategic Brief Tab */}
          {activeTab === 'brief' && (
            <div className="space-y-4">
              <div className="m-0.5 p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-sm space-y-2">
                <h3 className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity size={14} /> EXECUTIVE INTELLIGENCE SUMMARY
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed font-sans pt-1">
                  {country.executiveSummary}
                </p>
              </div>

              <div className="m-0.5 p-4 rounded-xl bg-slate-900/70 border border-slate-800 shadow-sm space-y-2">
                <h3 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle size={14} /> STRATEGIC VULNERABILITIES & FLASHPOINTS
                </h3>
                <div className="space-y-2.5 pt-1">
                  {country.strategicRisks.map((risk, idx) => (
                    <div
                      key={idx}
                      className="m-0.5 p-3 rounded-lg bg-amber-950/20 border border-amber-500/25 text-xs text-amber-200/90 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{risk}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Demographics Bar with 1-2px separation */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                <div className="m-0.5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-center font-mono">
                  <span className="text-[10px] text-slate-500 block uppercase">Population</span>
                  <span className="text-sm font-bold text-slate-200">{country.population}</span>
                </div>
                <div className="m-0.5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-center font-mono">
                  <span className="text-[10px] text-slate-500 block uppercase">Nominal GDP</span>
                  <span className="text-sm font-bold text-slate-200">{country.gdp}</span>
                </div>
                <div className="m-0.5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-center font-mono">
                  <span className="text-[10px] text-slate-500 block uppercase">FX Reserves</span>
                  <span className="text-sm font-bold text-slate-200">{country.economicStatus.foreignReserves}</span>
                </div>
                <div className="m-0.5 p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-center font-mono">
                  <span className="text-[10px] text-slate-500 block uppercase">Readiness</span>
                  <span className="text-xs font-bold text-emerald-400 truncate block mt-0.5">{country.militaryPosture.readiness}</span>
                </div>
              </div>
            </div>
          )}

          {/* 2. Defense & Military Tab */}
          {activeTab === 'military' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 font-mono text-xs">
                <div className="m-0.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-sm">
                  <span className="text-slate-400 block text-[11px]">ACTIVE ARMED FORCES</span>
                  <span className="text-base font-bold text-slate-100">{country.militaryPosture.activePersonnel}</span>
                </div>
                <div className="m-0.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 shadow-sm">
                  <span className="text-slate-400 block text-[11px]">ANNUAL DEFENSE BUDGET</span>
                  <span className="text-base font-bold text-sky-400">{country.militaryPosture.defenseBudget}</span>
                </div>
              </div>

              <div className="m-0.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-sm">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
                  NUCLEAR ARSENAL & STRATEGIC DETERRENT
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-mono pt-1">
                  {country.militaryPosture.nuclearStatus}
                </p>
              </div>

              <div className="m-0.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-sm">
                <span className="text-xs font-mono font-bold text-sky-400 uppercase tracking-wider block">
                  SECURITY ALLIANCES & TREATY COMMITMENTS
                </span>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {country.militaryPosture.alliances.map((alliance, idx) => (
                    <span
                      key={idx}
                      className="m-0.5 px-3 py-1.5 rounded-lg bg-sky-500/15 text-sky-300 border border-sky-500/30 text-xs font-mono shadow-sm"
                    >
                      🛡️ {alliance}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 3. Economy & Trade Tab */}
          {activeTab === 'economy' && (
            <div className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div className="m-0.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
                  <span className="text-slate-400 text-[10px] block">CURRENCY</span>
                  <span className="text-sm font-bold text-slate-100">{country.economicStatus.currency}</span>
                </div>
                <div className="m-0.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
                  <span className="text-slate-400 text-[10px] block">INFLATION RATE</span>
                  <span className="text-sm font-bold text-slate-100">{country.economicStatus.inflation}</span>
                </div>
                <div className="m-0.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
                  <span className="text-slate-400 text-[10px] block">SANCTIONS REGIME</span>
                  <span className="text-sm font-bold text-slate-100">{country.economicStatus.sanctionsStatus}</span>
                </div>
              </div>

              <div className="m-0.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 shadow-sm">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  KEY EXPORT DRIVERS & COMMODITIES
                </span>
                <div className="flex flex-wrap gap-2.5 pt-1">
                  {country.economicStatus.primaryExports.map((item, idx) => (
                    <span
                      key={idx}
                      className="m-0.5 px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs shadow-sm"
                    >
                      📦 {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 4. News Tab */}
          {activeTab === 'news' && (
            <div className="space-y-3.5">
              {relatedNews.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500 font-mono">
                  No active breaking alerts directly tagged for {country.name} in the past 24 hours.
                </div>
              ) : (
                relatedNews.map((n) => (
                  <div
                    key={n.id}
                    className="m-0.5 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-400 font-bold uppercase">
                        {n.category}
                      </span>
                      <span className="text-slate-500">{n.timeAgo}</span>
                    </div>
                    <h4 className="text-slate-200 font-bold text-sm leading-snug">{n.title}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed font-sans">{n.summary}</p>
                    <div className="text-[10px] text-slate-500 pt-1">SOURCE: {n.source}</div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Modal Bottom Actions Footer */}
        <div className="p-4 m-1 rounded-xl border border-slate-800/90 bg-slate-950/80 flex items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <button
              onClick={handleFocusCountry}
              className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Crosshair size={14} /> Center on Map
            </button>
            <button
              onClick={handleCopy}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              {copied ? <CheckCircle size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied' : 'Copy Brief'}</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
          >
            Close (Esc)
          </button>
        </div>
      </div>
    </div>
  );
};
