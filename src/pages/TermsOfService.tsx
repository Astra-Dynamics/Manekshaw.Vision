import React from 'react';
import { ArrowLeft, Shield, Scale, AlertTriangle, CheckCircle2, Globe, FileCode } from 'lucide-react';

interface TermsOfServiceProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export const TermsOfService: React.FC<TermsOfServiceProps> = ({
  onNavigateHome,
  onNavigateDashboard,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#06090e] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-slate-950">
      {/* Top Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-white/[0.06] bg-[#070b14]/80 backdrop-blur-md sticky top-0 z-40">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-0.5 transition-transform" />
          <span>BACK TO HOME</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateDashboard}
            className="text-xs font-mono text-slate-400 hover:text-sky-400 transition-colors cursor-pointer px-3 py-1.5 rounded border border-slate-800 hover:border-slate-700 bg-slate-900/60"
          >
            VIEW DASHBOARD
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-6 py-10 sm:py-14">
        {/* Title & Metadata */}
        <div className="mb-10 pb-8 border-b border-slate-800">
          <div className="flex items-center gap-2.5 text-sky-400 mb-3 font-mono text-xs tracking-wider uppercase">
            <Scale size={16} />
            <span>ASTRA DYNAMICS • OPERATOR PROTOCOLS</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            Platform: <strong className="text-slate-200">Manekshaw.Vision</strong> (manvis.tech) • Effective Date: November 2026
          </p>
        </div>

        {/* Terms Body */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">01.</span> Agreement to Terms
            </h2>
            <p>
              By accessing, browsing, or utilizing <strong>Manekshaw.Vision</strong> (<a href="https://manvis.tech" className="text-sky-400 hover:underline">manvis.tech</a>) operated by <strong>Astra Dynamics</strong>, you agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue access to the platform immediately.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">02.</span> Nature of Service & Intelligence Feeds
            </h2>
            <p>
              Manekshaw.Vision delivers an integrated situational awareness, open-source defense telemetry, and cartographic intelligence environment.
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-300">
              <li><strong>Open-Source Synthesis:</strong> Intelligence hotspot feeds, active conflict indicators, seismic anomalies, and military facility coordinates are synthesized from public, unclassified open-source channels (OSINT), satellite passes, and institutional research.</li>
              <li><strong>Informational Use:</strong> Feeds and visual layers are provided strictly for strategic research, situational monitoring, analysis, and educational awareness.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">03.</span> Cartographic Compliance & Sovereignty
            </h2>
            <div className="p-4 rounded-lg bg-[#0c121e] border border-sky-500/20 text-xs space-y-2">
              <div className="flex items-center gap-2 text-sky-400 font-mono font-bold">
                <Globe size={15} />
                SURVEY OF INDIA (SOI) CARTOGRAPHIC STANDARD
              </div>
              <p className="text-slate-300 leading-relaxed">
                All territorial depictions, boundary delineations, and national landmasses representing the Republic of India on Manekshaw.Vision strictly adhere to the cartographic boundaries and sovereign representations mandated by the Survey of India (SOI). External baseline tiles are rendered to uphold national cartographic integrity.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">04.</span> Operator Responsibilities & Prohibitions
            </h2>
            <p>Users, registered operators, and command personnel agree not to:</p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>Deploy automated bots, denial-of-service vectors, or high-frequency scraping tools against our APIs.</li>
              <li>Attempt to bypass Row Level Security (RLS), tamper with access tokens, or gain unauthorized administrative access.</li>
              <li>Use platform telemetry for unlawful kinetic operations or malicious exploitation.</li>
              <li>Misrepresent affiliation with sovereign armed forces or state intelligence agencies.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">05.</span> Intellectual Property
            </h2>
            <p>
              The Manekshaw.Vision software architecture, visual interface, custom bento grid layouts, radar sweeps, analytical widgets, and branding are the exclusive proprietary property of <strong>Astra Dynamics</strong>. Third-party trademarks, basemap vector styles, and open-source data streams remain the property of their respective originators.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">06.</span> Disclaimer of Warranties & Liability
            </h2>
            <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20 text-xs space-y-2 text-amber-200 font-mono">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <AlertTriangle size={15} />
                INFORMATIONAL NOTICE
              </div>
              <p>
                TELEMETRY AND SATELLITE FEEDS ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. ASTRA DYNAMICS MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, REGARDING REAL-TIME UNINTERRUPTED ACCURACY OR CONTINUOUS AVAILABILITY OF THIRD-PARTY OPEN-SOURCE STREAMS.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">07.</span> Contact & Governing Law
            </h2>
            <p>
              These Terms are governed by the laws of India. For inquiries or operational authorization clearances, contact:
            </p>
            <div className="p-3.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div><strong>Entity:</strong> Astra Dynamics</div>
              <div><strong>Project:</strong> Manekshaw.Vision (<a href="https://manvis.tech" className="text-sky-400 hover:underline">manvis.tech</a>)</div>
              <div><strong>Inquiries:</strong> <a href="https://github.com/Astra-Dynamics/Manekshaw.Vision/issues" target="_blank" rel="noopener noreferrer" className="text-sky-400 hover:underline">GitHub Repository Issues</a></div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 border-t border-white/[0.04] bg-[#070b14] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
        <div>
          <span>MANEKSHAW.VISION</span> • <a href="/about#team" className="text-sky-400 hover:underline">Built by Team Astra Dynamics</a>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button onClick={onNavigateHome} className="hover:text-white transition-colors cursor-pointer">
            Home
          </button>
          <button onClick={onNavigateDashboard} className="hover:text-white transition-colors cursor-pointer">
            Dashboard
          </button>
          <a href="/about" className="hover:text-white transition-colors">About</a>
          <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
        </div>
      </footer>
    </div>
  );
};
