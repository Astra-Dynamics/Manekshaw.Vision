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
  Compass,
  Radar,
  Lock,
  Cpu,
  MapPin,
  Eye,
  CheckCircle2,
  Sparkles,
  Terminal,
  Flag
} from 'lucide-react';

interface LandingPageProps {
  onLaunchDashboard: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLaunchDashboard }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    window.scrollTo(0, 0);
  }, []);

  const capabilities = [
    {
      icon: <Flame className="text-rose-500" size={20} />,
      title: 'Kinetic Frontlines & Conflict Zones',
      tag: 'KINETIC',
      description:
        'Live mechanized combat zones, fortified demarcations (LoC, LAC, AGPL, DMZ), ballistic missile strikes, and verified tactical frontline polygons.',
      accent: 'border-rose-500/30 group-hover:border-rose-500/60',
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20'
    },
    {
      icon: <Shield className="text-amber-500" size={20} />,
      title: 'Strategic Garrisons & Nuclear Deterrence',
      tag: 'STRATEGIC',
      description:
        'Global military bases, carrier strike groups, strategic bomber wings, uranium enrichment complexes, and sovereign Air Defense Identification Zones (ADIZ).',
      accent: 'border-amber-500/30 group-hover:border-amber-500/60',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    },
    {
      icon: <Radio className="text-cyan-400" size={20} />,
      title: 'Electronic Warfare & GNSS Jamming',
      tag: 'ELECTRONIC',
      description:
        'High-density GPS/GLONASS spoofing corridors, signal attenuation telemetry, and active electronic combat arrays monitored across sensitive maritime and border skies.',
      accent: 'border-cyan-500/30 group-hover:border-cyan-500/60',
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
    },
    {
      icon: <Zap className="text-emerald-400" size={20} />,
      title: 'Maritime Chokepoints & Grid Resilience',
      tag: 'INFRASTRUCTURE',
      description:
        'Critical maritime choke points (Hormuz, Malacca, Bab el-Mandeb, Suez), undersea fiber-optic cable severances, and real-time telecom & energy grid blackout tracking.',
      accent: 'border-emerald-500/30 group-hover:border-emerald-500/60',
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
  ];

  const telemetryStats = [
    { label: 'Active Intel Layers', value: '16+' },
    { label: 'Global Sovereign Zones', value: '190+' },
    { label: 'Live Data Refresh', value: 'Sub-Second' },
    { label: 'Border Integrity Standard', value: 'SOI 100%' }
  ];

  return (
    <div className="min-h-screen bg-[#06090e] text-[#F8FAFC] font-sans selection:bg-sky-500 selection:text-slate-950 overflow-x-hidden relative">
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

      {/* 1. TOP TACTICAL NAVIGATION BAR */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#06090e]/85 border-b border-white/[0.08] transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand Lockup with Sir Sam Favicon */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 rounded-[4px] overflow-hidden border border-sky-500/40 shadow-[0_0_12px_rgba(56,189,248,0.3)] bg-slate-950 shrink-0">
              <img
                src="/logo.jpg"
                alt="Field Marshal Sam Manekshaw"
                className="w-full h-full object-cover object-top"
              />
              <span className="absolute bottom-0.5 right-0.5 w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10b981]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold tracking-wider text-sm sm:text-base text-white">
                  MANEKSHAW<span className="text-sky-400">.VISION</span>
                </span>
                <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[9.5px] font-mono font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                  GEOINT
                </span>
              </div>
              <p className="text-[10px] font-mono text-[#94A3B8] hidden sm:block">
                Sovereign Defense Intelligence Command Center
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-mono text-[#94A3B8]">
            <a href="#platform" className="hover:text-sky-400 transition-colors">
              PLATFORM
            </a>
            <a href="#dedication" className="hover:text-amber-400 transition-colors flex items-center gap-1">
              <Award size={13} className="text-amber-400" />
              DEDICATION
            </a>
            <a href="#capabilities" className="hover:text-sky-400 transition-colors">
              CAPABILITIES
            </a>
            <a href="#team" className="hover:text-sky-400 transition-colors">
              ASTRA DYNAMICS
            </a>
          </nav>

          {/* Direct Launch Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onLaunchDashboard}
              className="relative group px-4 py-2 rounded-[3px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Radar size={14} className="animate-spin text-slate-950" style={{ animationDuration: '6s' }} />
              <span>View Dashboard</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="platform" className="relative pt-16 sm:pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Sovereign Live Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-[2px] bg-white/[0.04] border border-white/10 text-xs font-mono text-[#94A3B8] shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-slate-200 font-semibold tracking-wider uppercase text-[10.5px]">
              OPERATIONAL SENTINEL SYSTEM
            </span>
            <span className="text-white/20">•</span>
            <span className="text-sky-400 font-bold text-[10.5px]">v1.5 LIVE</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Sovereign Situational Awareness & Global Defense Intelligence
          </h1>

          {/* Subheading */}
          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto leading-relaxed font-sans font-normal">
            A high-contrast, real-time tactical command platform synthesizing kinetic conflict zones, frontline deployments, electronic warfare telemetry, and critical global infrastructure onto an interactive geospatial map.
          </p>

          {/* Dual Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onLaunchDashboard}
              className="w-full sm:w-auto px-7 py-3.5 rounded-[3px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(56,189,248,0.45)] hover:shadow-[0_0_40px_rgba(56,189,248,0.6)] flex items-center justify-center gap-2.5 cursor-pointer group"
            >
              <Compass size={16} className="text-slate-950 group-hover:rotate-45 transition-transform" />
              <span>Launch Live Dashboard</span>
              <ChevronRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
            </button>

            <a
              href="#dedication"
              className="w-full sm:w-auto px-6 py-3.5 rounded-[3px] bg-white/[0.04] hover:bg-white/[0.08] text-white border border-white/10 hover:border-amber-400/50 font-mono font-medium text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2"
            >
              <Award size={14} className="text-amber-400" />
              <span>Dedication to Sir Sam</span>
            </a>
          </div>

          {/* Telemetry Metric Badges */}
          <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {telemetryStats.map((stat, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-[2px] bg-white/[0.02] border border-white/[0.08] text-center font-mono relative overflow-hidden"
              >
                <div className="text-lg sm:text-xl font-bold text-sky-400">{stat.value}</div>
                <div className="text-[10px] text-[#64748B] uppercase tracking-wider mt-0.5 font-semibold">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical UI Dashboard Mockup Showcase */}
        <div className="mt-14 relative rounded-[6px] border border-white/10 bg-[#090D15] p-2 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] overflow-hidden group">
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
              <span className="ml-2 font-semibold text-slate-300">manvis.tech/dashboard</span>
            </div>
            <div className="flex items-center gap-3 text-[10px]">
              <span className="text-emerald-400 flex items-center gap-1 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> TELEMETRY ACTIVE
              </span>
              <span className="hidden sm:inline-block">THEATER: GLOBAL / INDIA</span>
            </div>
          </div>

          {/* Dashboard Canvas Preview with Interactive Hover Overlay */}
          <div
            onClick={onLaunchDashboard}
            className="relative aspect-video sm:aspect-[21/9] w-full rounded-b-[4px] overflow-hidden cursor-pointer bg-slate-950"
          >
            {/* High-tech simulated geospatial backdrop */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-950/30 via-slate-950 to-slate-950" />
            
            {/* Abstract World Grid Lines */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage: 'linear-gradient(to right, rgba(56, 189, 248, 0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(56, 189, 248, 0.2) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }}
            />

            {/* Simulated Tactical Nodes on Canvas */}
            <div className="absolute top-[35%] left-[62%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-sky-400 animate-ping absolute" />
              <span className="w-3 h-3 rounded-full bg-sky-500 shadow-[0_0_12px_#38bdf8] relative" />
              <span className="px-2 py-0.5 rounded-[2px] bg-slate-900/90 border border-sky-500/40 text-[9.5px] font-mono text-sky-300 font-bold">
                NEW DELHI HQ • 28.61°N, 77.20°E
              </span>
            </div>

            <div className="absolute top-[42%] left-[48%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse relative" />
              <span className="px-2 py-0.5 rounded-[2px] bg-slate-900/90 border border-rose-500/40 text-[9.5px] font-mono text-rose-300 font-bold">
                MIDDLE EAST THEATER • ELEVATED
              </span>
            </div>

            <div className="absolute top-[28%] left-[78%] -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#f59e0b] relative" />
              <span className="px-2 py-0.5 rounded-[2px] bg-slate-900/90 border border-amber-500/40 text-[9.5px] font-mono text-amber-300 font-bold">
                TAIWAN STRAIT ADIZ
              </span>
            </div>

            {/* Click to Enter Overlay */}
            <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] group-hover:bg-slate-950/30 transition-all flex items-center justify-center">
              <div className="px-6 py-3 rounded-[3px] bg-sky-500 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_30px_rgba(56,189,248,0.5)] group-hover:scale-105 transition-transform">
                <span>Click to Enter Fullscreen Dashboard</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. NOBLE DEDICATION TO SIR SAM MANEKSHAW */}
      <section id="dedication" className="relative py-20 bg-gradient-to-b from-[#06090e] via-[#0A0E17] to-[#06090e] border-y border-white/[0.08]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center space-y-3 mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Award size={13} className="text-amber-400" />
              <span>A NOBLE DEDICATION</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              In Eternal Reverence to Field Marshal Sam Manekshaw
            </h2>
            <p className="text-xs sm:text-sm text-[#94A3B8] font-mono">
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

      {/* 4. MULTI-DOMAIN INTELLIGENCE CAPABILITIES */}
      <section id="capabilities" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-[2px] bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-mono font-bold tracking-wider uppercase">
            <Layers size={13} />
            <span>GEOINT MATRIX</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Comprehensive Multi-Domain Surveillance
          </h2>
          <p className="text-xs sm:text-sm text-[#94A3B8] font-mono max-w-xl mx-auto">
            16 interactive, real-time data overlays aggregated into a single unified high-contrast canvas.
          </p>
        </div>

        {/* 4-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {capabilities.map((cap, idx) => (
            <div
              key={idx}
              className={`p-6 rounded-[3px] bg-[#0A0E17] border ${cap.accent} transition-all duration-300 relative group overflow-hidden shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-[2px] bg-white/[0.03] border border-white/10 flex items-center justify-center">
                  {cap.icon}
                </div>
                <span className={`px-2 py-0.5 rounded-[2px] font-mono text-[10px] font-bold border uppercase ${cap.badgeBg}`}>
                  {cap.tag}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-sky-400 transition-colors">
                {cap.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
                {cap.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. ENGINEERED BY TEAM ASTRA DYNAMICS (ADYN) */}
      <section id="team" className="py-20 bg-[#070B12] border-t border-white/[0.08] relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[4px] border border-sky-500/25 bg-[#0A0F1A] p-8 sm:p-12 relative overflow-hidden shadow-2xl">
            <span className="bracket-tl" />
            <span className="bracket-tr" />
            <span className="bracket-bl" />
            <span className="bracket-br" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              {/* Left: Official Team Astra Dynamics Logo */}
              <div className="md:col-span-4 flex flex-col items-center text-center">
                <div className="relative w-36 sm:w-44 aspect-square rounded-[4px] p-4 bg-slate-950/80 border border-sky-500/30 shadow-[0_0_25px_rgba(56,189,248,0.2)] flex items-center justify-center group">
                  <img
                    src="/adyn-logo.png"
                    alt="Team Astra Dynamics (ADYN) Logo"
                    className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_12px_rgba(56,189,248,0.4)] group-hover:scale-105 transition-transform"
                  />
                </div>

                <span className="mt-4 font-mono font-bold text-sm tracking-wider text-white">
                  ASTRA DYNAMICS
                </span>
                <span className="text-[10.5px] font-mono text-sky-400 uppercase tracking-widest font-semibold">
                  (ADYN)
                </span>
              </div>

              {/* Right: Team Mission & Statement */}
              <div className="md:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-[2px] bg-sky-500/10 border border-sky-500/25 text-sky-400 text-[10.5px] font-mono font-bold tracking-wider uppercase">
                  <Cpu size={12} />
                  <span>ENGINEERING COLLECTIVE</span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  Crafted with Precision by Team Astra Dynamics
                </h3>

                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-sans">
                  <strong>Team Astra Dynamics (ADYN)</strong> is a deep-tech engineering and research initiative focused on advancing sovereign defense systems, next-generation geospatial intelligence (GEOINT), and real-time tactical visualization platforms.
                </p>

                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed font-sans">
                  Manekshaw.Vision is designed from the ground up to eliminate dependency on third-party analytical intermediaries—providing an unbroken, autonomous window into active geopolitical and kinetic theaters while strictly honoring sovereign national borders.
                </p>

                {/* Core Tags */}
                <div className="pt-2 flex flex-wrap gap-2 text-[10px] font-mono">
                  <span className="px-2.5 py-1 rounded-[2px] bg-white/[0.03] text-slate-300 border border-white/10">
                    🛡️ SOVEREIGN GEOINT
                  </span>
                  <span className="px-2.5 py-1 rounded-[2px] bg-white/[0.03] text-slate-300 border border-white/10">
                    🛰️ TACTICAL SENSORS
                  </span>
                  <span className="px-2.5 py-1 rounded-[2px] bg-white/[0.03] text-slate-300 border border-white/10">
                    ⚡ MULTI-DOMAIN C4ISR
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="p-8 sm:p-12 rounded-[4px] border border-sky-500/30 bg-gradient-to-r from-sky-950/40 via-slate-900/60 to-sky-950/40 backdrop-blur-xl relative shadow-[0_0_50px_rgba(56,189,248,0.15)] space-y-6">
          <span className="bracket-tl" />
          <span className="bracket-tr" />
          <span className="bracket-bl" />
          <span className="bracket-br" />

          <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Experience the Sovereign Tactical Sentinel
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-lg mx-auto font-sans">
            Launch the interactive command center now. Free, fully functional, and accessible directly in your browser.
          </p>

          <button
            onClick={onLaunchDashboard}
            className="px-8 py-4 rounded-[3px] bg-sky-500 hover:bg-sky-400 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase transition-all shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:shadow-[0_0_45px_rgba(56,189,248,0.7)] inline-flex items-center gap-2 cursor-pointer group"
          >
            <span>Launch Manekshaw.Vision Dashboard</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      {/* 7. FOOTER */}
      <footer className="border-t border-white/[0.08] py-8 px-4 sm:px-6 lg:px-8 bg-[#04060A] text-xs font-mono text-[#64748B]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">MANEKSHAW.VISION</span>
            <span>•</span>
            <span>Astra Dynamics (ADYN)</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-[#475569]">
            Indian boundary demarcations strictly adhere to official Survey of India (SOI) statutory standards.
          </div>
        </div>
      </footer>
    </div>
  );
};
