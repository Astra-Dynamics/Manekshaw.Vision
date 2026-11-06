import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText, CheckCircle2, Mail, ExternalLink, Globe } from 'lucide-react';

interface PrivacyPolicyProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({
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
            <Shield size={16} />
            <span>ASTRA DYNAMICS • LEGAL & COMPLIANCE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-sm text-slate-400 font-mono">
            Platform: <strong className="text-slate-200">Manekshaw.Vision</strong> (manvis.tech) • Effective Date: November 2026
          </p>
        </div>

        {/* Policy Body */}
        <div className="space-y-10 text-sm leading-relaxed text-slate-300">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">01.</span> Overview & Scope
            </h2>
            <p>
              This Privacy Policy explains how <strong>Astra Dynamics</strong> ("we", "us", or "our") collects, uses, protects, and discloses personal information when you access or interact with <strong>Manekshaw.Vision</strong> accessible at <a href="https://manvis.tech" className="text-sky-400 hover:underline">https://manvis.tech</a> (the "Platform").
            </p>
            <p>
              Manekshaw.Vision is a sovereign geopolitical situational awareness, open-source intelligence (OSINT), and defense monitoring command center. We adhere to high standards of operational security, user privacy, and data sovereignty.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">02.</span> Information We Collect
            </h2>
            <p>We only collect information strictly necessary to provide and secure operator terminal access:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-2">
              <div className="p-4 rounded-lg bg-[#0c121e] border border-slate-800">
                <div className="font-semibold text-white flex items-center gap-2 mb-1.5 text-xs font-mono">
                  <Lock size={14} className="text-sky-400" />
                  GOOGLE OAUTH IDENTIFIERS
                </div>
                <p className="text-xs text-slate-400">
                  When you sign in using <em>Continue with Google</em>, Google shares your primary email address, full name, and avatar image. We do not request or access private Google Drive files, contacts, or sensitive permissions.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#0c121e] border border-slate-800">
                <div className="font-semibold text-white flex items-center gap-2 mb-1.5 text-xs font-mono">
                  <FileText size={14} className="text-sky-400" />
                  WORKSPACE PREFERENCES
                </div>
                <p className="text-xs text-slate-400">
                  Custom map layers, active coordinate focus, bookmarked intelligence hot zones, and operator desk states saved to your individual profile for cross-device continuity.
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">03.</span> How We Use Your Information
            </h2>
            <ul className="space-y-2 list-disc list-inside text-slate-300">
              <li><strong>Authentication & Authorization:</strong> Verifying operator clearance and managing Role-Based Access Control (RBAC).</li>
              <li><strong>Terminal Personalization:</strong> Restoring your custom intelligence layers and tactical theater configurations.</li>
              <li><strong>System Reliability:</strong> Monitoring uptime, detecting unauthorized intrusion attempts, and preventing automated abuse.</li>
            </ul>
            <p className="text-xs text-slate-400 pt-1">
              We never sell, monetize, rent, or trade your personal information to third-party data brokers or marketing networks.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">04.</span> Data Security & Infrastructure
            </h2>
            <p>
              Our infrastructure implements defense-in-depth principles:
            </p>
            <div className="p-4 rounded-lg bg-sky-500/5 border border-sky-500/20 text-xs space-y-2 font-mono text-slate-300">
              <div className="flex items-center gap-2 text-sky-300 font-bold">
                <CheckCircle2 size={14} />
                SECURITY MATRIX
              </div>
              <p>• <strong>Database Architecture:</strong> Supabase PostgreSQL instances with Row Level Security (RLS) isolating user records.</p>
              <p>• <strong>Encryption:</strong> Data encrypted at rest via AES-256 and in transit via TLS 1.3 / HTTPS.</p>
              <p>• <strong>Authentication Tokens:</strong> Secure HTTP cookies and PKCE (Proof Key for Code Exchange) token exchange protocols.</p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">05.</span> Third-Party Subprocessors
            </h2>
            <p>
              To maintain real-time feeds and edge performance, we utilize vetted technical subprocessors:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li><strong>Google Cloud Identity:</strong> OAuth 2.0 user verification.</li>
              <li><strong>Supabase Inc.:</strong> Encrypted cloud database and session management.</li>
              <li><strong>Vercel Inc.:</strong> Global CDN edge routing and application delivery.</li>
              <li><strong>Public Data Providers:</strong> OpenStreetMap, USGS, NASA EONET (public geodata; no user identifiers transmitted).</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">06.</span> Your Data Rights & Deletion
            </h2>
            <p>
              In accordance with international privacy frameworks (including GDPR and the Digital Personal Data Protection Act), you have the full right to:
            </p>
            <ul className="space-y-1.5 list-disc list-inside text-slate-300">
              <li>Request an export copy of your operator profile and stored telemetry.</li>
              <li>Request the complete and irreversible purge of your account and credentials from our databases.</li>
            </ul>
            <p>
              To request an account deletion or data purge, contact us at <a href="mailto:contact@manvis.tech" className="text-sky-400 hover:underline">contact@manvis.tech</a> or <a href="mailto:anantjain.adyn@proton.me" className="text-sky-400 hover:underline">anantjain.adyn@proton.me</a>. Requests are completed within 72 business hours.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-3 pt-4 border-t border-slate-800">
            <h2 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
              <span className="text-sky-400 font-mono text-sm">07.</span> Contact & Inquiries
            </h2>
            <p>
              For legal, compliance, or privacy inquiries regarding Manekshaw.Vision, contact Astra Dynamics:
            </p>
            <div className="p-3.5 rounded bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300 space-y-1">
              <div><strong>Organization:</strong> Astra Dynamics</div>
              <div><strong>Project:</strong> Manekshaw.Vision (<a href="https://manvis.tech" className="text-sky-400 hover:underline">manvis.tech</a>)</div>
              <div><strong>Compliance Email:</strong> <a href="mailto:contact@manvis.tech" className="text-sky-400 hover:underline">contact@manvis.tech</a> / <a href="mailto:anantjain.adyn@proton.me" className="text-sky-400 hover:underline">anantjain.adyn@proton.me</a></div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full px-6 py-6 border-t border-white/[0.04] bg-[#070b14] flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-mono gap-3">
        <div>
          <span>MANEKSHAW.VISION</span> • <span>ASTRA DYNAMICS</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <button onClick={onNavigateHome} className="hover:text-white transition-colors cursor-pointer">
            Home
          </button>
          <button onClick={onNavigateDashboard} className="hover:text-white transition-colors cursor-pointer">
            Dashboard
          </button>
          <a href="/terms" className="hover:text-white transition-colors">
            Terms of Service
          </a>
        </div>
      </footer>
    </div>
  );
};
