import React, { useState, useEffect } from 'react';
import {
  Shield,
  Radio,
  ArrowRight,
  ExternalLink,
  Flame,
  Globe2,
  Zap,
  Activity,
  Layers,
  Award,
  ChevronRight,
  ChevronDown,
  Compass,
  Radar,
  Lock,
  Cpu,
  MapPin,
  Eye,
  CheckCircle2,
  Sparkles,
  Terminal,
  Flag,
  Crosshair,
  Server,
  Share2,
  AlertTriangle,
  HelpCircle,
  TrendingUp,
  Clock,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [activeTheaterTab, setActiveTheaterTab] = useState<'indo' | 'mideast' | 'europe' | 'asia'>('indo');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [scrolledPastTop, setScrolledPastTop] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      setScrolledPastTop(window.scrollY >= 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const liveTickers = [
    'MILITARY • PLA Eastern Theater exercises detected near Taiwan Strait median line',
    'CYBER • Red Sea subsea telecommunication cable consortium reports stable telemetry',
    'SEISMIC • USGS detects M5.4 seismic anomaly along Pacific Ring of Fire',
    'DEFENSE • Indian Army surveillance deployed along LAC northern sectors',
    'MARITIME • Strait of Hormuz commercial maritime convoy operating under heightened naval watch',
    'RADAR • Active GNSS spoofing detected over Eastern Mediterranean airspace'
  ];

  const theaters = [
    {
      id: 'indo',
      name: 'Indo-Pacific & Northern Borders',
      coordinates: '34.08°N, 74.79°E',
      status: 'HIGH ALERT',
      statusColor: 'text-rose-400 bg-rose-500/15 border-rose-500/30',
      description:
        'Continuous surveillance across Jammu & Kashmir (LoC, AGPL), Ladakh (LAC Western Sector), Arunachal Pradesh, and the vital Siliguri Corridor with 100% Survey of India unbroken border adherence.',
      keyLayers: ['Fortified Frontlines', 'Military Bases', 'Nuclear Sites', 'Strategic Deployments']
    },
    {
      id: 'mideast',
      name: 'Middle East & Levant Basin',
      coordinates: '29.31°N, 47.48°E',
      status: 'ELEVATED RISK',
      statusColor: 'text-amber-400 bg-amber-500/15 border-amber-500/30',
      description:
        'Ballistic missile trajectory reporting, counter-battery operations, naval carrier task groups in the Arabian Sea, and strategic chokepoint transit monitoring through the Strait of Hormuz and Bab el-Mandeb.',
      keyLayers: ['Middle East Strikes', 'Maritime Chokepoints', 'Intel Hotspots', 'Frontlines']
    },
    {
      id: 'europe',
      name: 'Eastern Europe & Black Sea',
      coordinates: '48.37°N, 31.16°E',
      status: 'ACTIVE WARZONE',
      statusColor: 'text-red-400 bg-red-500/15 border-red-500/30',
      description:
        'Dynamic frontline warfare polygons, mechanized combat operations across the Donbas, electronic warfare jamming corridors over the Baltic Sea, and NATO air policing alerts.',
      keyLayers: ['Frontlines & Wars', 'Electronic Warfare', 'Grid Disruption', 'Sanctions Regimes']
    },
    {
      id: 'asia',
      name: 'East Asia & Taiwan Strait',
      coordinates: '23.69°N, 120.96°E',
      status: 'STRATEGIC WATCH',
      statusColor: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30',
      description:
        'Air Defense Identification Zone (ADIZ) sovereign airspace monitoring, First Island Chain naval deployments, and semiconductor manufacturing center vulnerability index tracking.',
      keyLayers: ['ADIZ Air Defense', 'Naval Task Forces', 'Economic Centers', 'Subsea Cables']
    }
  ];

  const capabilities = [
    {
      icon: <Flame className="text-rose-500" size={20} />,
      title: 'Kinetic Frontlines & Active Conflicts',
      tag: 'KINETIC',
      description:
        'Maps active combat zones, fortified border demarcations (LOC, LAC, AGPL, DMZ), and reported strike coordinates across global flashpoints.',
      accent: 'border-rose-500/30 hover:border-rose-500/60'
    },
    {
      icon: <Shield className="text-amber-500" size={20} />,
      title: 'Strategic Garrisons & Nuclear Deterrence',
      tag: 'STRATEGIC',
      description:
        'Tracks major airbases, naval ports, known nuclear facilities, and sovereign Air Defense Identification Zones (ADIZ).',
      accent: 'border-amber-500/30 hover:border-amber-500/60'
    },
    {
      icon: <Radio className="text-cyan-400" size={20} />,
      title: 'Electronic Warfare & GNSS Jamming',
      tag: 'ELECTRONIC',
      description:
        'Visualizes reported GPS/GLONASS interference zones, spoofing corridors, and airspace advisories across contested regions.',
      accent: 'border-cyan-500/30 hover:border-cyan-500/60'
    },
    {
      icon: <Zap className="text-emerald-400" size={20} />,
      title: 'Maritime Chokepoints & Grid Outages',
      tag: 'INFRASTRUCTURE',
      description:
        'Monitors strategic shipping lanes (Hormuz, Malacca, Bab el-Mandeb, Suez), subsea cable routes, and major connectivity disruptions.',
      accent: 'border-emerald-500/30 hover:border-emerald-500/60'
    },
    {
      icon: <Activity className="text-purple-400" size={20} />,
      title: 'Country Dossiers & Instability Scoring (CII)',
      tag: 'INTELLIGENCE',
      description:
        'Comprehensive national security profiles featuring the Country Instability Index (CII), active armed forces posture, nuclear status, defense spending, and bilateral treaty alliances.',
      accent: 'border-purple-500/30 hover:border-purple-500/60'
    },
    {
      icon: <Globe2 className="text-sky-400" size={20} />,
      title: 'Real-Time Hazard & Seismic Feeds',
      tag: 'ENVIRONMENT',
      description:
        'Direct telemetry integration with real-time USGS seismic feeds, NASA EONET volcanic and wildfire satellite sensors, and NOAA severe atmospheric watches.',
      accent: 'border-sky-500/30 hover:border-sky-500/60'
    }
  ];

  const faqs = [
    {
      q: 'What is Manekshaw.Vision (ManVis)?',
      a: 'Manekshaw.Vision is an independent, sovereign geospatial intelligence (GEOINT) and situational awareness platform. It aggregates physical conflict data, strategic military garrisons, electronic warfare signals, and critical infrastructure telemetry onto an interactive, high-contrast tactical map.'
    },
    {
      q: 'How does it differ from consumer mapping platforms like Google Maps?',
      a: 'Commercial map services are built for consumer navigation and frequently show broken, dashed, or contested territorial lines depending on the visitor’s country of access. Manekshaw.Vision is built from the ground up to strictly honor the official unbroken territorial integrity of India as mandated by the Survey of India (SOI), while providing tactical defense overlays (ADIZ, EW jamming, carrier groups) not found in consumer maps.'
    },
    {
      q: 'How frequently is tactical intelligence updated?',
      a: 'Telemetry feeds—including USGS real-time seismic sensors, NASA EONET events, NOAA weather warnings, and defense dispatch bulletins—refresh automatically every few minutes directly in your browser.'
    },
    {
      q: 'Is an account or installation required to use the Dashboard?',
      a: 'No. The entire platform runs directly inside your web browser using WebGL client-side rendering. There is no sign-up wall, no tracking, and zero installation required.'
    },
    {
      q: 'Who developed Manekshaw.Vision?',
      a: 'Manekshaw.Vision (ManVis) was architected and built by Team Astra Dynamics (ADYN)—a four-member high school engineering team exploring what happens when modern AI workflows, live open-source intelligence (OSINT) feeds, and WebGL cartography are combined into a single browser-native interface, dedicated to Field Marshal Sir Sam Manekshaw.'
    }
  ];

  return (
    <div className="w-full min-h-screen bg-[#06090e] text-[#F8FAFC] font-sans selection:bg-sky-500 selection:text-slate-950 overflow-x-hidden relative">
      {/* Background Decorative Tactical Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `radial-gradient(rgba(56, 189, 248, 0.15) 1px, transparent 1px), linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 80px 80px, 80px 80px'
        }}
      />

      {/* Ambient Gradient Glows */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="fixed top-[600px] right-0 w-[500px] h-[400px] bg-rose-600/8 blur-[160px] pointer-events-none rounded-full" />

      {/* RAZOR-THIN 48px FROSTED-GLASS HEADER & AUTO-HIDING LIVE DISPATCHES */}
      <header
        className="fixed top-0 left-0 right-0 w-full z-[1000] transition-all duration-300"
        style={{
          boxShadow: scrolledPastTop ? '0 10px 30px -10px rgba(0, 0, 0, 0.8)' : 'none'
        }}
      >
        {/* 1. Primary Nav Row (Strict 48px Height) */}
        <div
          className="w-full transition-all duration-200"
          style={{
            background: scrolledPastTop ? 'rgba(6, 9, 16, 0.85)' : 'rgba(6, 9, 16, 0.65)',
            backdropFilter: 'saturate(180%) blur(20px)',
            WebkitBackdropFilter: 'saturate(180%) blur(20px)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.07)'
          }}
        >
          <div
            style={{
              height: '48px',
              padding: '0 24px',
              maxWidth: '1400px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            {/* Single Crisp Horizontal Brand Lockup */}
            <div className="flex items-center gap-2.5">
              <div className="relative flex items-center justify-center w-6 h-6 rounded bg-sky-500/10 border border-sky-500/30 text-sky-400 shrink-0 shadow-[0_0_10px_rgba(56,189,248,0.25)]">
                <Radio size={13} className="animate-pulse" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#10b981]" />
              </div>

              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-wider text-[14px] text-white leading-none">
                  MANEKSHAW<span className="text-sky-400">.VISION</span>
                </span>
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30 leading-none">
                  GEOINT
                </span>
              </div>
            </div>

            {/* Slim Navigation Links */}
            <nav
              className="hidden md:flex items-center font-mono text-[#94A3B8]"
              style={{ fontSize: '11px', letterSpacing: '0.08em', gap: '24px' }}
            >
              <a href="#platform" className="hover:text-[#F8FAFC] transition-colors">
                PLATFORM
              </a>
              <a href="#theaters" className="hover:text-[#F8FAFC] transition-colors">
                THEATERS
              </a>
              <a href="#capabilities" className="hover:text-[#F8FAFC] transition-colors">
                CAPABILITIES
              </a>
              <a href="#dedication" className="hover:text-amber-400 transition-colors flex items-center gap-1">
                <Award size={12} className="text-amber-400" />
                DEDICATION
              </a>
              <a href="#team" className="hover:text-[#F8FAFC] transition-colors">
                ASTRA DYNAMICS
              </a>
              <a href="#faq" className="hover:text-[#F8FAFC] transition-colors">
                FAQ
              </a>
            </nav>

            {/* Compact CTA Button */}
            <div className="flex items-center">
              <button
                onClick={onLaunchDashboard}
                className="relative group bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold tracking-wider uppercase transition-all shadow-[0_0_16px_rgba(56,189,248,0.35)] flex items-center gap-1.5 cursor-pointer active:scale-95"
                style={{
                  height: '30px',
                  padding: '0 12px',
                  fontSize: '11px',
                  borderRadius: '4px'
                }}
              >
                <Radar size={12} className="animate-spin text-slate-950" style={{ animationDuration: '6s' }} />
                <span>OPEN DASHBOARD</span>
                <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* 2. Live Dispatches Ticker Sub-Bar (Auto-Hides on Scroll >= 50px) */}
        <div
          className="w-full"
          style={{
            height: scrolledPastTop ? '0px' : '28px',
            maxHeight: scrolledPastTop ? '0px' : '28px',
            opacity: scrolledPastTop ? 0 : 1,
            overflow: 'hidden',
            pointerEvents: scrolledPastTop ? 'none' : 'auto',
            background: 'rgba(4, 7, 13, 0.85)',
            backdropFilter: 'saturate(180%) blur(16px)',
            WebkitBackdropFilter: 'saturate(180%) blur(16px)',
            borderBottom: scrolledPastTop ? 'none' : '1px solid rgba(56, 189, 248, 0.16)',
            boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
            transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <div
            style={{
              height: '28px',
              padding: '0 24px',
              maxWidth: '1400px',
              margin: '0 auto',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              fontSize: '10.5px'
            }}
            className="font-mono"
          >
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/25 text-[9.5px] font-bold tracking-wider shrink-0 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              LIVE DISPATCHES
            </div>

            <div className="flex-1 overflow-hidden relative">
              <div className="flex items-center gap-8 animate-marquee whitespace-nowrap text-[10.5px] text-[#94A3B8]">
                {liveTickers.map((t, idx) => (
                  <span key={idx} className="flex items-center gap-2">
                    <span className="text-sky-400">●</span> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION */}
      <section id="platform" className="relative pt-28 sm:pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          {/* Sovereign Live Status Pill */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/[0.04] border border-white/10 text-xs font-mono text-[#94A3B8] shadow-inner"
            style={{ marginBottom: '16px' }}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-200 font-semibold tracking-wider uppercase text-[10.5px]">
              SOVEREIGN GEOSPATIAL INTELLIGENCE PLATFORM
            </span>
            <span className="text-white/20">•</span>
            <span className="text-sky-400 font-bold text-[10.5px]">v1.5 LIVE</span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white"
            style={{ marginBottom: '22px', lineHeight: 1.15, letterSpacing: '-0.02em' }}
          >
            Real-Time Defense Intelligence <br className="hidden md:inline" />
            & Global Situational Awareness
          </h1>

          {/* Subheading - Refactored to 2 balanced, elegant lines on desktop */}
          <p
            className="text-base sm:text-lg font-sans font-normal text-center mx-auto"
            style={{
              marginTop: 0,
              marginBottom: '36px',
              lineHeight: 1.65,
              color: '#94A3B8',
              maxWidth: '880px',
              textWrap: 'balance'
            }}
          >
            An open-source geospatial intelligence monitor mapping active frontlines, military installations,
            <br className="hidden md:inline" />{' '}
            ADIZ perimeters, GNSS interference zones, and critical maritime chokepoints in real time.
          </p>

          {/* Dual Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="w-full sm:w-auto px-8 py-4 rounded-[3px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(56,189,248,0.45)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Compass size={17} className="text-slate-950 group-hover:rotate-45 transition-transform" />
              <span>Launch Live Dashboard</span>
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>

            <a
              href="#dedication"
              className="w-full sm:w-auto px-6 py-4 rounded-[3px] bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-amber-400/50 font-mono font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <Award size={15} className="text-amber-400" />
              <span>Dedication to Sir Sam</span>
            </a>
          </div>

          {/* Telemetry Metric Badges */}
          <div className="pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto w-full">
            <div className="p-3.5 rounded-[2px] bg-white/[0.02] border border-white/[0.08] text-center font-mono">
              <div className="text-lg sm:text-xl font-bold text-sky-400">16</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5 font-semibold">
                ACTIVE DATA LAYERS
              </div>
            </div>
            <div className="p-3.5 rounded-[2px] bg-white/[0.02] border border-white/[0.08] text-center font-mono">
              <div className="text-lg sm:text-xl font-bold text-emerald-400">LIVE</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5 font-semibold">
                OSINT & SENSOR FEEDS
              </div>
            </div>
            <div className="p-3.5 rounded-[2px] bg-white/[0.02] border border-white/[0.08] text-center font-mono">
              <div className="text-lg sm:text-xl font-bold text-amber-400">195</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5 font-semibold">
                COUNTRY DOSSIERS
              </div>
            </div>
            <div className="p-3.5 rounded-[2px] bg-white/[0.02] border border-white/[0.08] text-center font-mono">
              <div className="text-lg sm:text-xl font-bold text-purple-400">100% SOI</div>
              <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5 font-semibold">
                BORDER COMPLIANT
              </div>
            </div>
          </div>
        </div>

        {/* Tactical UI Dashboard Mockup Showcase (Using Screenshot from MV Logo) */}
        <div 
          onClick={onLaunchDashboard}
          className="mt-14 relative rounded-[6px] border border-white/10 bg-[#090D15] p-2 sm:p-2.5 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden group cursor-pointer"
        >
          <span className="bracket-tl" />
          <span className="bracket-tr" />
          <span className="bracket-bl" />
          <span className="bracket-br" />

          {/* Top Mock Window Bar */}
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-white/[0.06] rounded-t-[4px] text-[11px] font-mono text-[#94A3B8]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 inline-block" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
              <span className="ml-2 font-semibold text-slate-300">manvis.tech/Dashboard</span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> TELEMETRY ACTIVE
              </span>
              <span className="hidden sm:inline-block">THEATER: GLOBAL / INDIA</span>
            </div>
          </div>

          {/* Actual Dashboard Screenshot */}
          <div className="relative w-full rounded-b-[4px] overflow-hidden bg-slate-950">
            <img
              src="/screenshot.png"
              alt="Manekshaw.Vision Live Tactical Dashboard"
              className="w-full h-auto object-cover rounded-b-[4px] transition-transform duration-500 group-hover:scale-[1.01]"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-slate-950/10 group-hover:bg-slate-950/40 backdrop-blur-[0px] group-hover:backdrop-blur-[1px] transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="px-6 py-3 rounded-[3px] bg-sky-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_30px_rgba(56,189,248,0.6)] transform translate-y-2 group-hover:translate-y-0 transition-all">
                <Radar size={15} />
                <span>Launch Live Interactive Dashboard</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. THEATER INTELLIGENCE EXPLORER (WorldMonitor Style) */}
      <section id="theaters" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold tracking-wider uppercase"
            style={{ marginBottom: '16px' }}
          >
            <Compass size={13} />
            <span>OPERATIONAL THEATERS</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-center"
            style={{ marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}
          >
            Multi-Theater Surveillance Matrix
          </h2>
          {/* Operational Theaters Subtitle - 1 Single Clean Line */}
          <p
            className="text-sm sm:text-base font-sans leading-relaxed text-center mx-auto whitespace-normal lg:whitespace-nowrap"
            style={{
              marginTop: 0,
              marginBottom: '36px',
              lineHeight: 1.6,
              color: '#94A3B8',
              maxWidth: '1000px'
            }}
          >
            Pre-configured regional viewports tracking border demarcations, naval corridors, and kinetic flashpoints.
          </p>
        </div>

        {/* Interactive Theater Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8 font-mono text-xs">
          {theaters.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTheaterTab(t.id as any)}
              className={`px-4 py-2 rounded-[2px] border transition-all cursor-pointer font-bold ${
                activeTheaterTab === t.id
                  ? 'bg-sky-500 text-slate-950 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.35)]'
                  : 'bg-white/[0.03] text-slate-300 border-white/10 hover:border-white/20'
              }`}
            >
              {t.name}
            </button>
          ))}
        </div>

        {/* Selected Theater Showcase Card */}
        {theaters
          .filter((t) => t.id === activeTheaterTab)
          .map((t) => (
            <div
              key={t.id}
              className="rounded-[4px] border border-white/10 bg-[#090E17] p-6 sm:p-8 relative overflow-hidden shadow-2xl"
            >
              <span className="bracket-tl" />
              <span className="bracket-tr" />
              <span className="bracket-bl" />
              <span className="bracket-br" />

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-6 border-b border-white/[0.08]">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{t.name}</h3>
                    <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold border uppercase ${t.statusColor}`}>
                      {t.status}
                    </span>
                  </div>
                </div>

                {/* Read-Only Technical Coordinates Badge (Replaced Bulky Button) */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-[2px] bg-slate-950/80 border border-white/10 font-mono text-xs text-sky-400 shadow-inner">
                  <span className="text-[#64748B] text-[10px] uppercase font-bold tracking-wider">SECTOR COORDS:</span>
                  <span>{t.coordinates}</span>
                </div>
              </div>

              <div className="pt-6">
                <p
                  className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-sans"
                  style={{ marginBottom: '24px' }}
                >
                  {t.description}
                </p>

                <div>
                  <span
                    className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] block font-semibold"
                    style={{ marginBottom: '12px' }}
                  >
                    ACTIVE SENSOR OVERLAYS FOR THIS SECTOR:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {t.keyLayers.map((layer, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-[2px] bg-white/[0.03] text-slate-200 border border-white/10 font-mono text-[11px]"
                      >
                        ⚡ {layer}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
      </section>

      {/* 5. CAPABILITIES GRID (WorldMonitor Feature Set) */}
      <section id="capabilities" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold tracking-wider uppercase"
            style={{ marginBottom: '16px' }}
          >
            <Layers size={13} />
            <span>CORE CAPABILITIES</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-center"
            style={{ marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}
          >
            Six Dimensions of Global Telemetry
          </h2>
          <p
            className="text-sm sm:text-base font-sans leading-relaxed text-center mx-auto whitespace-normal lg:whitespace-nowrap"
            style={{
              marginTop: 0,
              marginBottom: '36px',
              lineHeight: 1.6,
              color: '#94A3B8',
              maxWidth: '1000px'
            }}
          >
            Six integrated data pipelines combining static defense infrastructure with live hazard and conflict feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-[3px] bg-[#0A0E17] border ${cap.accent} transition-all duration-300 relative group overflow-hidden shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-[2px] bg-white/[0.03] border border-white/10 flex items-center justify-center">
                  {cap.icon}
                </div>
                <span className="px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold border border-white/10 bg-white/5 text-[#94A3B8] uppercase">
                  {cap.tag}
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                {cap.title}
              </h3>

              <p className="text-xs text-[#94A3B8] leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. SOVEREIGN CARTOGRAPHIC STANDARDS BANNER */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-[4px] border border-sky-500/30 bg-sky-950/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <span className="bracket-tl" />
          <span className="bracket-tr" />
          <span className="bracket-bl" />
          <span className="bracket-br" />

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-[2px] bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0">
              <Flag size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                Official Survey of India (SOI) Border Integrity
              </h3>
              <p className="text-xs sm:text-sm text-[#94A3B8] max-w-2xl leading-relaxed mt-2">
                Unlike international commercial mapping engines that alter Jammu & Kashmir or Arunachal Pradesh into dashed lines depending on user IP geolocation, Manekshaw.Vision enforces unbroken sovereign national borders strictly compliant with the statutory cartographic standards of the Republic of India.
              </p>
            </div>
          </div>

          {/* Read-Only Cartographic Standard Badge (Replaced Bulky Button) */}
          <div className="px-3.5 py-2.5 rounded-[2px] bg-sky-500/10 border border-sky-500/30 text-sky-300 font-mono text-[10.5px] sm:text-[11px] font-bold tracking-wider shrink-0 flex items-center gap-2 shadow-inner">
            <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
            <span>CARTOGRAPHIC STANDARD: SOI-VERIFIED // UNBROKEN BOUNDARIES</span>
          </div>
        </div>
      </section>

      {/* 7. NOBLE DEDICATION TO SIR SAM MANEKSHAW */}
      <section id="dedication" className="relative py-20 bg-gradient-to-b from-[#06090e] via-[#0A0E17] to-[#06090e] border-y border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with refined spacing and alignment */}
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase"
              style={{ marginBottom: '16px' }}
            >
              <Award size={13} className="text-amber-400" />
              <span>A NOBLE DEDICATION</span>
            </div>
            <h2
              className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-center"
              style={{ marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}
            >
              In Eternal Reverence to Field Marshal Sam Manekshaw
            </h2>
            <p
              className="text-sm sm:text-base font-sans leading-relaxed text-center mx-auto"
              style={{
                marginTop: 0,
                marginBottom: '36px',
                lineHeight: 1.6,
                color: '#FDE68A',
                maxWidth: '780px',
                textWrap: 'balance'
              }}
            >
              Field Marshal Sam Hormusji Framji Jamshedji Manekshaw, MC (1914–2008)
            </p>
          </div>

          {/* Hero Tribute Card with Sir Sam Portrait */}
          <div className="relative rounded-[4px] border border-amber-500/25 bg-[#0D131F]/90 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden">
            <span className="bracket-tl" style={{ borderColor: '#f59e0b' }} />
            <span className="bracket-tr" style={{ borderColor: '#f59e0b' }} />
            <span className="bracket-bl" style={{ borderColor: '#f59e0b' }} />
            <span className="bracket-br" style={{ borderColor: '#f59e0b' }} />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left: Framed Portrait of Sir Sam Manekshaw */}
              <div className="lg:col-span-5 flex flex-col items-center">
                <div className="relative w-56 sm:w-64 aspect-square rounded-[4px] overflow-hidden border-2 border-amber-500/40 shadow-[0_0_35px_rgba(245,158,11,0.25)] bg-slate-950 group">
                  <img
                    src="/logo.jpg"
                    alt="Field Marshal Sir Sam Manekshaw"
                    className="w-full h-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 text-center font-mono">
                    <span className="px-2 py-0.5 rounded-[2px] bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold tracking-wider uppercase">
                      FIRST FIELD MARSHAL OF INDIA
                    </span>
                  </div>
                </div>

                {/* Military Honors Badges */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 font-mono text-[10px]">
                  <span className="px-2 py-0.5 rounded-[2px] bg-white/[0.04] text-slate-300 border border-white/10">
                    Military Cross (MC)
                  </span>
                  <span className="px-2 py-0.5 rounded-[2px] bg-white/[0.04] text-slate-300 border border-white/10">
                    Padma Vibhushan
                  </span>
                  <span className="px-2 py-0.5 rounded-[2px] bg-white/[0.04] text-slate-300 border border-white/10">
                    1971 Liberation War
                  </span>
                </div>
              </div>

              {/* Right: Dedication Narrative & Inspiring Words */}
              <div className="lg:col-span-7 space-y-6">
                {/* Quote Box */}
                <div className="p-5 rounded-[2px] bg-amber-500/[0.06] border-l-4 border-amber-500 border border-amber-500/20 font-sans">
                  <p className="text-sm sm:text-base italic text-amber-100 font-medium leading-relaxed">
                    “Professional knowledge and professional competence are the main attributes of leadership. Unless you know, and the men you command know that you know your job, you will never be a leader.”
                  </p>
                  <p className="text-right text-xs font-mono text-amber-400 font-bold mt-2">
                    — Field Marshal Sam Manekshaw
                  </p>
                </div>

                {/* Tribute Text */}
                <div className="space-y-4 text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-sans">
                  <p>
                    Known affectionately as <strong className="text-white">“Sam Bahadur”</strong> (Sam the Brave), Field Marshal Sam Manekshaw stands as one of the greatest military strategists in modern history. As Chief of the Army Staff during the 1971 Indo-Pakistani War, his masterclass in operational planning and combined-arms doctrine culminated in the historic unconditional surrender of Pakistani forces in just 13 days—leading to the creation of Bangladesh.
                  </p>
                  <p>
                    His career spanned four decades and five wars, marked not only by tactical brilliance but by an uncompromising moral spine. When pressurized to launch premature offensives, he stood resolute in his strategic counsel, ensuring total preparation before decisive action.
                  </p>
                  <p className="pt-2 border-t border-white/[0.08] text-slate-200 font-medium">
                    <strong className="text-sky-400">Manekshaw.Vision (ManVis)</strong> was conceived and developed in proud dedication to his enduring ethos—celebrating uncompromised sovereign preparedness, decisive intelligence, and steadfast vigilance over our borders and global strategic horizons.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. TEAM ASTRA DYNAMICS (ADYN) - ORIGIN DOSSIER CARD */}
      <section id="team" className="py-20 bg-[#070B12] border-t border-white/[0.08] relative">
        <div className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
            <div
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold tracking-wider uppercase"
              style={{ marginBottom: '16px' }}
            >
              <Cpu size={13} />
              <span>ENGINEERING ORIGINS</span>
            </div>
            <h2
              className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-center"
              style={{ marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}
            >
              Team Astra Dynamics (ADYN)
            </h2>
            <p
              className="text-sm sm:text-base font-sans leading-relaxed text-center mx-auto"
              style={{
                marginTop: 0,
                marginBottom: '36px',
                lineHeight: 1.6,
                color: '#94A3B8',
                maxWidth: '780px',
                textWrap: 'balance'
              }}
            >
              The high school engineering team and sovereign intelligence project behind Manekshaw.Vision.
            </p>
          </div>

          {/* 2-Column Engineering Lab / Origin Dossier Card */}
          <div
            className="rounded-[4px] border border-sky-500/20 bg-[#090E17] shadow-2xl relative overflow-hidden"
            style={{
              backgroundImage: 'radial-gradient(rgba(56, 189, 248, 0.08) 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }}
          >
            <span className="bracket-tl" />
            <span className="bracket-tr" />
            <span className="bracket-bl" />
            <span className="bracket-br" />

            <div className="flex flex-col md:flex-row items-stretch">
              {/* Left Column (30% width) - Left-Aligned Identity & Spec Block */}
              <div className="md:w-[32%] shrink-0 border-b md:border-b-0 md:border-r border-white/[0.08] p-6 sm:p-8 flex flex-col items-start text-left bg-slate-950/40">
                {/* Tactical Blue Framed Wrapper Around ADYN Logo */}
                <div
                  className="group transition-all duration-300"
                  style={{
                    padding: '14px',
                    background: 'radial-gradient(circle at center, rgba(14, 165, 233, 0.12) 0%, rgba(10, 15, 26, 0.95) 100%)',
                    border: '1px solid rgba(56, 189, 248, 0.25)',
                    borderRadius: '6px',
                    boxShadow: '0 0 28px rgba(14, 165, 233, 0.22), inset 0 0 16px rgba(56, 189, 248, 0.08)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '20px'
                  }}
                >
                  <img
                    src="/adyn-logo.png"
                    alt="Team Astra Dynamics (ADYN) Monogram"
                    style={{
                      width: '145px',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '2px',
                      objectFit: 'contain'
                    }}
                    className="transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                </div>

                <span className="font-mono font-bold text-base tracking-wider text-white text-left">
                  ASTRA DYNAMICS
                </span>
                <span className="text-[10px] font-mono text-sky-400 uppercase tracking-widest font-semibold mt-1 mb-5 text-left">
                  STUDENT AI & GEOINT COLLECTIVE
                </span>

                <div className="w-full h-px bg-white/[0.08] mb-5" />

                {/* Clean Vertical Spec Stack (Left-Aligned) */}
                <div className="w-full space-y-3.5 text-left font-mono text-[11px]">
                  <div className="flex flex-col">
                    <span className="text-[9.5px] text-[#64748B] uppercase font-bold tracking-wider">TEAM:</span>
                    <span className="text-slate-200 font-medium">4 High School Developers</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9.5px] text-[#64748B] uppercase font-bold tracking-wider">ORIGIN:</span>
                    <span className="text-slate-200 font-medium">Student AI & Systems Initiative</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9.5px] text-[#64748B] uppercase font-bold tracking-wider">ARCHITECTURE:</span>
                    <span className="text-slate-200 font-medium">Multi-Layer OSINT Engine</span>
                  </div>
                </div>
              </div>

              {/* Right Column (70% width) - Editorial Typography & Authentic Engineering Copy */}
              <div className="flex-1 p-6 sm:p-10 flex flex-col justify-center">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-sky-400 font-bold">
                    LAB BRIEFING // MISSION
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                    Engineered by Team Astra Dynamics
                  </h3>
                </div>

                {/* Clear divider spacing */}
                <div className="w-full h-px bg-white/[0.08]" style={{ marginTop: '16px', marginBottom: '20px' }} />

                {/* Distinct Paragraphs with guaranteed 18px vertical gap */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                  <p style={{ margin: 0, lineHeight: 1.6, fontSize: '13.5px', color: '#94A3B8' }} className="font-sans">
                    Manekshaw.Vision (ManVis) was architected and built by <strong className="text-white">Team Astra Dynamics (ADYN)</strong>—a four-member high school engineering team exploring what happens when modern AI workflows, live open-source intelligence (OSINT) feeds, and WebGL cartography are combined into a single browser-native interface.
                  </p>
                  <p style={{ margin: 0, lineHeight: 1.6, fontSize: '13.5px', color: '#94A3B8' }} className="font-sans">
                    What began as an experimental school AI project evolved into a full-scale geospatial monitor. We built ManVis to prove that clean, sovereign situational awareness doesn't require enterprise bloat—and dedicated the platform to the enduring legacy of India's First Field Marshal, Sam Manekshaw.
                  </p>
                </div>

                <div className="w-full h-px bg-white/[0.04]" style={{ marginTop: '20px', marginBottom: '14px' }} />

                <div className="flex flex-wrap items-center gap-3 font-mono text-[10px] text-[#64748B]">
                  <span>STATUS: ACTIVE RESEARCH</span>
                  <span>•</span>
                  <span>LOCATION: NEW DELHI, INDIA</span>
                  <span>•</span>
                  <span>WEBGL // REACT // OSINT STACK</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INTERACTIVE FAQ ACCORDION (WorldMonitor Style) */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-white/[0.08]">
        <div className="flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold tracking-wider uppercase"
            style={{ marginBottom: '16px' }}
          >
            <HelpCircle size={13} />
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2
            className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-center"
            style={{ marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}
          >
            Understanding the Platform
          </h2>
          <p
            className="text-sm sm:text-base font-sans leading-relaxed text-center mx-auto whitespace-normal lg:whitespace-nowrap"
            style={{
              marginTop: 0,
              marginBottom: '36px',
              lineHeight: 1.6,
              color: '#94A3B8',
              maxWidth: '1000px'
            }}
          >
            Key operational details on cartographic compliance, OSINT feed latency, and platform architecture.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-[3px] border border-white/[0.08] bg-[#0A0E17] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-sm font-semibold text-white hover:text-sky-400 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-sky-400' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 text-xs sm:text-sm text-[#94A3B8] leading-relaxed border-t border-white/[0.04] pt-3 font-sans">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 10. CALL TO ACTION BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-14 rounded-[4px] border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-sky-950/40 backdrop-blur-xl relative shadow-[0_0_50px_rgba(56,189,248,0.15)] flex flex-col items-center justify-center text-center">
          <span className="bracket-tl" />
          <span className="bracket-tr" />
          <span className="bracket-bl" />
          <span className="bracket-br" />

          <h3
            className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-center"
            style={{ marginBottom: '16px', lineHeight: 1.15, letterSpacing: '-0.02em' }}
          >
            Enter the Sovereign Command Center
          </h3>
          <p
            className="text-sm sm:text-base font-sans leading-relaxed text-center mx-auto whitespace-normal lg:whitespace-nowrap"
            style={{
              marginTop: 0,
              marginBottom: '28px',
              lineHeight: 1.6,
              color: '#94A3B8',
              maxWidth: '1000px'
            }}
          >
            Free, real-time, and fully operational in your browser—no sign-up wall, zero tracking.
          </p>

          <button
            onClick={onLaunchDashboard}
            className="px-8 py-4 rounded-[3px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:shadow-[0_0_45px_rgba(56,189,248,0.7)] inline-flex items-center gap-2 cursor-pointer group"
          >
            <span>LAUNCH MANEKSHAW.VISION DASHBOARD</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer className="border-t border-white/[0.08] py-8 px-4 sm:px-6 lg:px-8 bg-[#04060A] text-xs font-mono text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">MANEKSHAW.VISION</span>
            <span>•</span>
            <span>Team Astra Dynamics (ADYN)</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-[#475569]">
            Indian boundary demarcations strictly adhere to official Survey of India (SOI) statutory standards.
          </div>
        </div>
      </footer>
    </div>
  );
};
