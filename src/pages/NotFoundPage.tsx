import React, { useEffect } from 'react';
import { ShieldAlert, ArrowLeft, Radio } from 'lucide-react';

interface NotFoundPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({
  onNavigateHome,
  onNavigateDashboard
}) => {
  useEffect(() => {
    document.title = '404 - Sector Not Found | Manekshaw.Vision';
    // Ensure search engines do not index 404 pages
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, follow');

    return () => {
      metaRobots?.setAttribute('content', 'index, follow');
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 flex flex-col justify-between font-mono selection:bg-rose-500/30 selection:text-rose-200">
      <header className="border-b border-white/[0.08] px-4 sm:px-8 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-slate-300">
          <span className="text-rose-400">●</span>
          <span>MANEKSHAW.VISION</span>
        </div>
        <button
          onClick={onNavigateHome}
          className="text-xs text-slate-400 hover:text-sky-400 transition-colors flex items-center gap-1.5 cursor-pointer py-1.5 px-2.5 rounded hover:bg-white/[0.04]"
        >
          <ArrowLeft size={13} />
          <span>RETURN HOME</span>
        </button>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded border border-rose-500/30 bg-rose-950/10 backdrop-blur-xl text-center space-y-6 shadow-[0_0_40px_rgba(244,63,94,0.1)]">
          <div className="w-14 h-14 rounded-full bg-rose-500/10 border border-rose-500/30 mx-auto flex items-center justify-center text-rose-400">
            <ShieldAlert size={28} />
          </div>

          <div className="space-y-2">
            <div className="text-[11px] font-bold text-rose-400 tracking-widest uppercase">
              SECTOR 404 // RECON TARGET UNRESOLVED
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Coordinates Not Found
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              The tactical intelligence route or sector requested is not cataloged in the active registry. Return to sovereign airspace or open the primary dashboard.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={onNavigateHome}
              className="px-4 py-2.5 rounded-[3px] bg-white/[0.06] hover:bg-white/[0.1] text-xs font-bold text-slate-200 border border-white/[0.1] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ArrowLeft size={13} />
              <span>RETURN TO BASE</span>
            </button>
            <button
              onClick={onNavigateDashboard}
              className="px-4 py-2.5 rounded-[3px] bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(56,189,248,0.4)] cursor-pointer flex items-center justify-center gap-2"
            >
              <Radio size={13} />
              <span>OPEN DASHBOARD</span>
            </button>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/[0.08] py-6 px-4 text-center text-xs text-[#64748B]">
        Built by Team Astra Dynamics
      </footer>
    </div>
  );
};
