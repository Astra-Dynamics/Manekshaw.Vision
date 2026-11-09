import React, { useEffect } from 'react';
import {
  Shield,
  ArrowLeft,
  ExternalLink,
  Award,
  Cpu,
  Globe2,
  Database,
  Radio,
  FileCode,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';
import { SITE_CONFIG, getActiveSocialLinks } from '../config/site';

interface AboutPageProps {
  onNavigateHome: () => void;
  onNavigateDashboard: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onNavigateHome,
  onNavigateDashboard
}) => {
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'About & Methodology | Manekshaw.Vision';
  }, []);

  const sources = [
    {
      name: 'USGS Earthquake Hazards Program',
      category: 'Seismic Telemetry',
      url: 'https://earthquake.usgs.gov',
      desc: 'Real-time global seismic feeds detailing magnitude, focal depth, coordinates, and tsunami risk thresholds.'
    },
    {
      name: 'NASA EONET (Earth Observatory Natural Event Tracker)',
      category: 'Natural Hazards',
      url: 'https://eonet.gsfc.nasa.gov',
      desc: 'Severe storms, volcanic eruptions, wildfire complexes, and extreme environmental events.'
    },
    {
      name: 'NASA FIRMS (Fire Information for Resource Management System)',
      category: 'Thermal Sensors',
      url: 'https://firms.modaps.eosdis.nasa.gov',
      desc: 'Near real-time MODIS and VIIRS satellite active fire thermal anomaly detections.'
    },
    {
      name: 'ACLED (Armed Conflict Location & Event Data)',
      category: 'Conflict Analysis',
      url: 'https://acleddata.com',
      desc: 'Standardized conflict event reporting, political violence documentation, and demonstration tracking.'
    },
    {
      name: 'OpenStreetMap & Carto Basemaps',
      category: 'Cartography',
      url: 'https://www.openstreetmap.org',
      desc: 'Open spatial vector tile infrastructure styled to strictly respect official Survey of India (SOI) boundaries.'
    },
    {
      name: 'National Weather Service (NOAA)',
      category: 'Atmospheric Hazards',
      url: 'https://api.weather.gov',
      desc: 'Official coastal gale, cyclone, and atmospheric hazard telemetry.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#06090e] text-slate-100 font-sans selection:bg-sky-500/30 selection:text-sky-200">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-sky-500/20 bg-[#06090e]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-xs font-mono font-medium text-slate-400 hover:text-sky-400 transition-colors cursor-pointer py-2 px-2.5 rounded hover:bg-white/[0.04]"
              aria-label="Return to homepage"
            >
              <ArrowLeft size={14} />
              <span>HOME</span>
            </button>
            <span className="text-slate-700">/</span>
            <span className="text-xs font-mono text-sky-400 font-bold uppercase tracking-wider">
              ABOUT & METHODOLOGY
            </span>
          </div>

          <button
            onClick={onNavigateDashboard}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-[3px] bg-sky-500/20 border border-sky-500/40 text-sky-300 hover:bg-sky-500/30 font-mono text-xs font-bold transition-all cursor-pointer"
          >
            <Radio size={12} className="text-sky-400" />
            <span>LAUNCH DASHBOARD</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">
        {/* Hero Section */}
        <div className="space-y-4 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Shield size={13} />
            <span>OPEN-SOURCE SITUATIONAL AWARENESS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            About <span className="text-sky-400">Manekshaw.Vision</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
            Manekshaw.Vision is an independent, non-commercial open-source intelligence (OSINT) and geopolitical situational awareness platform engineered by <strong>Team Astra Dynamics</strong>, founded by <strong>Anant Jain</strong>.
          </p>
        </div>

        {/* Section: Founder & Builder */}
        <section id="founder" className="p-6 sm:p-8 rounded-lg border border-sky-500/20 bg-slate-900/40 space-y-6">
          <div className="flex items-center gap-2.5 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Award size={16} />
            <span>FOUNDER & VISION LEAD</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Anant Jain
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {SITE_CONFIG.founder.bio}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <a
                href={SITE_CONFIG.founder.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/[0.06] hover:bg-white/[0.1] text-sky-300 hover:text-sky-200 border border-white/[0.1] text-xs font-mono transition-colors"
              >
                <FileCode size={13} />
                <span>GitHub: @anantjain1109</span>
                <ExternalLink size={12} className="opacity-70" />
              </a>
            </div>
          </div>
        </section>

        {/* Section: Team Astra Dynamics */}
        <section id="team" className="p-6 sm:p-8 rounded-lg border border-white/[0.08] bg-slate-900/30 space-y-6">
          <div className="flex items-center gap-2.5 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Cpu size={16} />
            <span>ENGINEERING TEAM</span>
          </div>
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Team Astra Dynamics (ADYN)
            </h2>
            <p className="text-slate-300 leading-relaxed">
              {SITE_CONFIG.team.description} Competing in the <strong>{SITE_CONFIG.team.competition}</strong> category, the team designs autonomous platforms, computer vision algorithms, and high-performance tactical monitoring dashboards built on modern web standards.
            </p>
          </div>
        </section>

        {/* Section: Namesake & Ethos */}
        <section className="p-6 sm:p-8 rounded-lg border border-amber-500/20 bg-amber-950/10 space-y-4">
          <div className="flex items-center gap-2.5 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Award size={16} />
            <span>NAMESAKE & ETHOS</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Field Marshal Sam Hormusji Framji Jamshedji Manekshaw, MC (1914–2008)
          </h2>
          <p className="text-slate-300 leading-relaxed">
            The platform is named in honor of Field Marshal Sam Manekshaw, Chief of the Army Staff during the 1971 Liberation War and India's first Field Marshal. His uncompromising leadership, professional competence, and moral courage embody the ideals of sovereign preparedness and unwavering vigilance.
          </p>
          <blockquote className="border-l-2 border-amber-500/50 pl-4 py-1 text-sm italic text-amber-200/90 font-serif">
            "Professional knowledge and professional competence are the main attributes of leadership. Unless you know, and the men you command know that you know your job, you will never be a leader."
            <span className="block text-xs font-mono font-normal text-amber-300/70 not-italic mt-1">— Field Marshal Sam Manekshaw</span>
          </blockquote>
        </section>

        {/* Section: Cartographic Sovereignty */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Globe2 size={15} />
            <span>CARTOGRAPHIC INTEGRITY</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Survey of India (SOI) Compliance
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Unlike commercial map APIs that fragment or misrepresent Indian sovereign frontiers, Manekshaw.Vision enforces 100% adherence to official statutory Survey of India (SOI) demarcations. All territories of the Union of India—including Jammu & Kashmir, Ladakh, Aksai Chin, and Arunachal Pradesh—are accurately integrated and rendered as unbroken sovereign territory.
          </p>
        </section>

        {/* Section: Telemetry Sources & Methodology */}
        <section id="methodology" className="space-y-6">
          <div className="flex items-center gap-2 text-sky-400 font-mono text-xs font-bold uppercase tracking-wider">
            <Database size={15} />
            <span>TELEMETRY ARCHITECTURE & SOURCES</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Authoritative Data Ingestion Pipeline
          </h2>
          <p className="text-slate-300 leading-relaxed">
            Live telemetry is continuously collected via an automated 30-minute GitHub Actions ingestion workflow (<code>ingest-intel.yml</code>) combined with client-side upstream REST APIs:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {sources.map((src, i) => (
              <div key={i} className="p-4 rounded border border-white/[0.08] bg-slate-900/40 hover:border-sky-500/30 transition-colors space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-sky-400 font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/20">
                    {src.category}
                  </span>
                  <a
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-sky-400 transition-colors"
                    aria-label={`Visit ${src.name}`}
                  >
                    <ExternalLink size={13} />
                  </a>
                </div>
                <h3 className="text-sm font-bold text-white">
                  <a href={src.url} target="_blank" rel="noopener noreferrer" className="hover:text-sky-300 transition-colors">
                    {src.name}
                  </a>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {src.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Disclaimers & Non-Affiliation */}
        <section className="p-6 rounded-lg border border-rose-500/30 bg-rose-950/20 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold uppercase tracking-wider">
            <CheckCircle2 size={15} />
            <span>STATUTORY & OPERATIONAL DISCLAIMER</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {SITE_CONFIG.disclaimer} All intelligence reports, conflict polygons, flight trajectories, and maritime chokepoints displayed on this dashboard are derived entirely from publicly accessible, unclassified open-source channels.
          </p>
        </section>
      </main>

      {/* Semantic Footer */}
      <footer className="border-t border-white/[0.08] py-8 px-4 sm:px-6 lg:px-8 bg-[#04060A] text-xs font-mono text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-slate-300">MANEKSHAW.VISION</span>
            <span>•</span>
            <span className="text-sky-400">Built by Team Astra Dynamics</span>
            <span>•</span>
            <span>Founded by Anant Jain</span>
            <span>•</span>
            <a href="/privacy" className="text-slate-400 hover:text-sky-400 transition-colors">Privacy</a>
            <span>•</span>
            <a href="/terms" className="text-slate-400 hover:text-sky-400 transition-colors">Terms</a>
            <span>•</span>
            <a href="/status" className="text-slate-400 hover:text-sky-400 transition-colors">Status</a>
          </div>

          <div className="text-center sm:text-right text-[11px] text-[#475569]">
            Indian boundary demarcations strictly adhere to official Survey of India (SOI) statutory standards.
          </div>
        </div>
      </footer>
    </div>
  );
};
