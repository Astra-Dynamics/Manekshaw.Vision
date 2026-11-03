import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Radio,
  Cpu,
  Radar,
  ArrowRight,
  Compass,
  Activity,
  Shield,
  Layers,
  Globe2,
  Zap,
  Flame,
  Award,
  Search,
  Download,
  Crosshair,
  ArrowUpRight,
  Menu,
  X,
  ChevronDown,
  CheckCircle2,
  Flag,
  HelpCircle
} from 'lucide-react';
import { UserNav } from './UserNav';

interface HighPerfLandingPageProps {
  onLaunchDashboard: () => void;
  onOpenAuthModal?: () => void;
  onNavigateLogin?: () => void;
  onToggleLandingMode: () => void;
}

interface StrategicHotspot {
  id: string;
  name: string;
  theater: string;
  lat: number;
  lng: number;
  status: 'HIGH ALERT' | 'ELEVATED' | 'WATCH' | 'STRATEGIC';
  statusColor: string;
  coords: string;
  detail: string;
  layers: string[];
}

const THEATERS: StrategicHotspot[] = [
  {
    id: 'indo-pacific',
    name: 'INDO-PACIFIC',
    theater: 'Indo-Pacific & Northern Frontiers',
    lat: 34.08,
    lng: 74.79,
    status: 'HIGH ALERT',
    statusColor: 'var(--red)',
    coords: '34.08°N / 74.79°E',
    detail: 'LoC · LAC · AGPL · Siachen Corridor · Siachen Glacier',
    layers: ['Fortified Frontlines', 'Military Bases', 'Nuclear Sites', 'Strategic Deployments']
  },
  {
    id: 'levant',
    name: 'LEVANT BASIN',
    theater: 'Middle East & Persian Gulf',
    lat: 29.31,
    lng: 47.48,
    status: 'WATCH',
    statusColor: 'var(--amber)',
    coords: '29.31°N / 47.48°E',
    detail: 'Strait of Hormuz · Bab-el-Mandeb · Red Sea Maritime Convoy',
    layers: ['Middle East Strikes', 'Maritime Chokepoints', 'Intel Hotspots', 'Frontlines']
  },
  {
    id: 'black-sea',
    name: 'BLACK SEA',
    theater: 'Eastern Europe Conflict Zone',
    lat: 48.37,
    lng: 31.16,
    status: 'ELEVATED',
    statusColor: 'var(--red)',
    coords: '48.37°N / 31.16°E',
    detail: 'Donbas Frontlines · Electronic Warfare Corridors · NATO Air Patrols',
    layers: ['Frontlines & Wars', 'Electronic Warfare', 'Grid Disruption', 'Sanctions Regimes']
  },
  {
    id: 'east-asia',
    name: 'EAST ASIA',
    theater: 'Taiwan Strait & First Island Chain',
    lat: 23.69,
    lng: 120.96,
    status: 'STRATEGIC',
    statusColor: 'var(--cyan)',
    coords: '23.69°N / 120.96°E',
    detail: 'Taiwan Strait Median Line · ADIZ Sovereign Airspace · Subsea Cables',
    layers: ['ADIZ Air Defense', 'Naval Task Forces', 'Economic Centers', 'Subsea Cables']
  }
];

interface SignalDispatch {
  id: string;
  title: string;
  detail: string;
  time: string;
  category: 'KINETIC' | 'CYBER' | 'RADAR' | 'MARITIME' | 'SEISMIC' | 'DEFENSE';
}

const SIGNAL_LOG: SignalDispatch[] = [
  {
    id: '01',
    title: 'GNSS INTERFERENCE',
    detail: 'Elevated spoofing activity detected across Eastern Mediterranean and Baltic air corridors.',
    time: '02:14:08',
    category: 'RADAR'
  },
  {
    id: '02',
    title: 'MARITIME MOVEMENT',
    detail: 'Unusual commercial vessel clustering observed near Bab-el-Mandeb and Hormuz chokepoints.',
    time: '01:48:32',
    category: 'MARITIME'
  },
  {
    id: '03',
    title: 'BORDER POSTURE',
    detail: 'Northern sector deployment along Siachen AGPL and LAC remains at continuous sovereign vigilance.',
    time: '00:52:11',
    category: 'DEFENSE'
  },
  {
    id: '04',
    title: 'TACTICAL RECON',
    detail: 'Carrier strike group exercises confirmed in international waters outside First Island Chain.',
    time: '00:31:45',
    category: 'KINETIC'
  },
  {
    id: '05',
    title: 'SUBSEA TELEMETRY',
    detail: 'Red Sea optical subsea telecommunications cable consortium telemetry registers normal operations.',
    time: '23:19:04',
    category: 'CYBER'
  },
  {
    id: '06',
    title: 'SEISMIC ANOMALY',
    detail: 'USGS automated sensors detect M5.4 seismic displacement along Pacific Rim fault line.',
    time: '22:45:19',
    category: 'SEISMIC'
  }
];

const FAQS = [
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

export const HighPerfLandingPage: React.FC<HighPerfLandingPageProps> = ({
  onLaunchDashboard,
  onOpenAuthModal,
  onNavigateLogin,
  onToggleLandingMode
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeTheater, setActiveTheater] = useState<StrategicHotspot>(THEATERS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Trigger Toast Notification
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Export Tactical SITREP Briefing
  const handleExportBriefing = () => {
    const sitrep = [
      '========================================',
      'MANEKSHAW.VISION // TACTICAL SITREP DISPATCH',
      `TIMESTAMP: ${new Date().toISOString()}`,
      'CLASSIFICATION: SOVEREIGN OPEN-SOURCE INTEL',
      'CARTOGRAPHIC BASE: 100% SURVEY OF INDIA (SOI)',
      '========================================\n',
      'ACTIVE OPERATIONAL SECTOR:',
      `Sector: ${activeTheater.name} (${activeTheater.theater})`,
      `Coordinates: ${activeTheater.coords}`,
      `Status: ${activeTheater.status}`,
      `Key Landmarks: ${activeTheater.detail}`,
      `Active Overlays: ${activeTheater.layers.join(' · ')}\n`,
      'LIVE SIGNAL TELEMETRY LOG:',
      ...SIGNAL_LOG.map((s) => `[${s.time}] ${s.title} (${s.category}): ${s.detail}`),
      '\n========================================',
      'END OF DISPATCH // ASTRA DYNAMICS (ADYN)'
    ].join('\n');

    try {
      navigator.clipboard.writeText(sitrep);
      showToast('Tactical SITREP copied to clipboard');
    } catch {
      showToast('SITREP exported successfully');
    }
  };

  // Filtered Signal Log
  const filteredSignals = useMemo(() => {
    if (!searchQuery.trim()) return SIGNAL_LOG;
    const q = searchQuery.toLowerCase();
    return SIGNAL_LOG.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.detail.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Three.js Interactive 3D Hologram Globe Engine
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth || 730;
    const height = container.clientHeight || 580;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 20, 160);

    // 2. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 3. Main Globe Group
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 52;

    // A. Inner Cyan Wireframe Core
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 36, 36);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.14
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // B. Outer Glowing Atmosphere Shell
    const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.04, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.05
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // C. Golden Spiral Point Cloud Continents
    const pointCount = 3200;
    const positions = new Float32Array(pointCount * 3);
    const colors = new Float32Array(pointCount * 3);
    const colCyan = new THREE.Color(0x00f0ff);
    const colMuted = new THREE.Color(0x1c2b3a);
    const colRed = new THREE.Color(0xff3b30);

    for (let i = 0; i < pointCount; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / pointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const r = GLOBE_RADIUS + (Math.random() - 0.5) * 1.2;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      const c = i % 15 === 0 ? colRed : (i % 3 === 0 ? colCyan : colMuted);
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 1.4,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending
    });
    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    globeGroup.add(pointsMesh);

    // D. Orbiting Ring Ellipses
    const createRing = (radius: number, rx: number, rz: number, colorHex: number) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const pts = curve.getPoints(96);
      const geo = new THREE.BufferGeometry().setFromPoints(pts.map((p) => new THREE.Vector3(p.x, 0, p.y)));
      const mat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.28
      });
      const line = new THREE.Line(geo, mat);
      line.rotation.x = rx;
      line.rotation.z = rz;
      return line;
    };

    const ring1 = createRing(GLOBE_RADIUS * 1.35, Math.PI / 4, Math.PI / 6, 0x00f0ff);
    const ring2 = createRing(GLOBE_RADIUS * 1.55, -Math.PI / 3, Math.PI / 5, 0xff3b30);
    globeGroup.add(ring1);
    globeGroup.add(ring2);

    // E. 3D Hotspot Coordinates Beacons
    const latLngToVector3 = (lat: number, lng: number, radius: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const z = radius * Math.sin(phi) * Math.sin(theta);
      const y = radius * Math.cos(phi);
      return new THREE.Vector3(x, y, z);
    };

    const beaconsGroup = new THREE.Group();
    THEATERS.forEach((th) => {
      const pos = latLngToVector3(th.lat, th.lng, GLOBE_RADIUS + 0.5);
      const markerGeo = new THREE.SphereGeometry(1.6, 8, 8);
      const markerMat = new THREE.MeshBasicMaterial({
        color: th.status === 'HIGH ALERT' ? 0xff3b30 : 0x00f0ff
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);
      beaconsGroup.add(markerMesh);
    });
    globeGroup.add(beaconsGroup);

    // Initial orientation focusing on South Asia / Indo-Pacific
    globeGroup.rotation.y = -1.2;
    globeGroup.rotation.x = 0.25;

    // F. Drag & Rotate Interaction
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velX = 0;
    let velY = 0;

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      isDragging = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      prevMouseX = clientX;
      prevMouseY = clientY;
      velX = 0;
      velY = 0;
    };

    const onPointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const deltaX = clientX - prevMouseX;
      const deltaY = clientY - prevMouseY;
      prevMouseX = clientX;
      prevMouseY = clientY;

      velX = deltaX * 0.005;
      velY = deltaY * 0.005;

      globeGroup.rotation.y += velX;
      globeGroup.rotation.x += velY;
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    domEl.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Resize Handler
    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      if (!isDragging) {
        // Continuous slow sovereign rotation
        globeGroup.rotation.y += 0.0028;
        velX *= 0.95;
        velY *= 0.95;
        globeGroup.rotation.y += velX;
        globeGroup.rotation.x += velY;
      }

      // Atmospheric subtle pulse
      const time = clock.getElapsedTime();
      atmoMesh.scale.setScalar(1 + Math.sin(time * 2) * 0.015);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domEl.removeEventListener('mousedown', onPointerDown);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', onPointerUp);
      domEl.removeEventListener('touchstart', onPointerDown);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', onPointerUp);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <main className="site-shell" style={{ overflowX: 'hidden' }}>
      {/* 1. Holographic Grain Film Noise */}
      <div className="grain" aria-hidden="true" />

      {/* 2. Sleek Site Navigation */}
      <header className="site-nav" data-testid="site-navigation">
        <a href="#top" aria-label="Manekshaw Vision home" data-testid="brand-home-link">
          <div className="brand-mark compact" data-testid="brand-logo">
            <span className="mark-icon">M</span>
            <span>
              MANVIS<span className="brand-dot">.</span>VISION
            </span>
          </div>
        </a>

        {/* Desktop Links */}
        <nav className={`nav-links ${isMobileMenuOpen ? 'open' : ''}`} data-testid="primary-navigation">
          <a href="#system" onClick={() => setIsMobileMenuOpen(false)}>System</a>
          <a href="#theaters" onClick={() => setIsMobileMenuOpen(false)}>Theaters</a>
          <a href="#signal" onClick={() => setIsMobileMenuOpen(false)}>Signal log</a>
          <a href="#dedication" onClick={() => setIsMobileMenuOpen(false)}>Dedication</a>
          <a href="#team" onClick={() => setIsMobileMenuOpen(false)}>Astra Dynamics</a>
          <a href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>

          {isMobileMenuOpen && (
            <button
              className="nav-close"
              aria-label="Close menu"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X size={18} />
            </button>
          )}
        </nav>

        {/* Right Nav Actions */}
        <div className="nav-actions">
          {/* Mode Switch Toggle Button */}
          <button
            onClick={onToggleLandingMode}
            type="button"
            className="mode-toggle-btn"
            title="Switch back to Standard Mode"
            aria-label="Switch back to Standard Mode"
          >
            <Cpu size={12} className="animate-pulse" />
            <span>STANDARD MODE</span>
          </button>

          <span className="live-chip" data-testid="live-status">
            <i /> LIVE / v1.5
          </span>

          <button
            className="menu-button"
            aria-label="Open menu"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu size={18} />
          </button>

          <button
            className="nav-cta"
            onClick={onLaunchDashboard}
            data-testid="nav-dashboard-link"
          >
            Launch dashboard <ArrowUpRight size={15} />
          </button>
        </div>
      </header>

      {/* 3. HERO SECTION WITH INTERACTIVE 3D HOLOGRAM GLOBE */}
      <section className="hero" id="top" data-testid="hero-section">
        <div className="hero-grid" />

        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-line" /> Sovereign situational awareness / 01
          </p>

          <h1 data-testid="hero-headline">
            <span>See the</span>
            <span className="outline-line">world before</span>
            <span>it shifts.</span>
          </h1>

          <p className="hero-description">
            MANVIS is a sovereign geospatial intelligence layer for the signals between headlines —
            live frontlines, strategic infrastructure, and the pressure points moving beneath the map.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              onClick={onLaunchDashboard}
              data-testid="hero-launch-button"
            >
              Enter command center <ArrowUpRight size={18} />
            </button>
            <a href="#theaters" className="text-button" data-testid="hero-explore-button">
              Explore the system <ChevronDown size={16} />
            </a>
          </div>
        </div>

        {/* 3D Interactive Hologram Globe Viewport */}
        <div className="globe-wrap" data-testid="interactive-globe">
          <div className="globe-label label-top">
            LAT {activeTheater.coords.split(' / ')[0]} / LONG {activeTheater.coords.split(' / ')[1]}
          </div>

          <div
            ref={mountRef}
            style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              overflow: 'hidden',
              pointerEvents: 'auto',
              cursor: 'grab'
            }}
          />

          <div className="globe-crosshair">
            <span />
            <span />
          </div>

          <div className="globe-label label-bottom">
            <Radio size={12} className="animate-pulse" />
            <span>SIGNAL ARRAY / 16 LAYERS ACTIVE</span>
          </div>
        </div>

        <div className="hero-footer">
          <span>ADYN / NEW DELHI / 2026—27</span>
          <span>
            SCROLL TO DECODE <span className="scroll-arrow">↓</span>
          </span>
        </div>
      </section>

      {/* 4. MARQUEE TICKER BAR */}
      <section className="marquee" aria-label="Manvis capabilities" data-testid="capability-marquee">
        <div className="marquee-track">
          SOVEREIGN DATA <b>✳</b> LIVE GEOPOLITICS <b>✳</b> BORDER INTEGRITY <b>✳</b> OPEN-SOURCE INTELLIGENCE <b>✳</b> 100% SURVEY OF INDIA ADHERENCE <b>✳</b> SATELLITE TELEMETRY <b>✳</b> KINETIC FRONTLINES <b>✳</b> SOVEREIGN DATA <b>✳</b> LIVE GEOPOLITICS <b>✳</b>
        </div>
      </section>

      {/* 5. SECTION 01: THE SIGNAL LAYER (CAPABILITIES BENTO GRID) */}
      <section className="system-section page-section" id="system" data-testid="system-section">
        <div className="section-heading">
          <p className="section-index">01 / THE SIGNAL LAYER</p>
          <h2>
            Clarity is a<br />
            <em>strategic advantage.</em>
          </h2>
          <p className="heading-note">
            Six dimensions of global telemetry, collapsed into one precise operational picture.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Kinetic */}
          <div className="bento-card card-1">
            <span className="card-number">01</span>
            <p className="card-type">KINETIC</p>
            <h3>Active frontlines</h3>
            <p>Live conflict zones, fortified borders, and reported strike coordinates.</p>
            <span className="card-scan">● TRACKING NOW</span>
          </div>

          {/* Card 2: Strategic */}
          <div className="bento-card card-2">
            <span className="card-number">02</span>
            <p className="card-type">STRATEGIC</p>
            <h3>Deterrence posture</h3>
            <p>Airbases, naval ports, nuclear facilities, and sovereign ADIZ perimeters.</p>
            <span className="card-scan">○ MONITORING</span>
          </div>

          {/* Card 3: Electronic */}
          <div className="bento-card card-3">
            <span className="card-number">03</span>
            <p className="card-type">ELECTRONIC</p>
            <h3>The invisible battle</h3>
            <p>GNSS interference, spoofing corridors, and airspace advisories.</p>
            <span className="card-scan">○ MONITORING</span>
          </div>

          {/* Card 4: Infrastructure */}
          <div className="bento-card card-4">
            <span className="card-number">04</span>
            <p className="card-type">INFRASTRUCTURE</p>
            <h3>The pressure points</h3>
            <p>Maritime chokepoints, subsea cables, and connectivity disruptions.</p>
            <span className="card-scan">○ MONITORING</span>
          </div>

          {/* Bento Image Card (Launches Dashboard) */}
          <div
            className="bento-card bento-image"
            onClick={onLaunchDashboard}
            style={{ cursor: 'pointer' }}
          >
            <img alt="Manvis live tactical dashboard" src="/screenshot-3.png" />
            <div className="image-overlay">
              <span>LIVE VIEW / MANVIS DASHBOARD</span>
              <ArrowUpRight size={18} />
            </div>
          </div>

          {/* Card 5: Country Dossiers & Instability Scoring (CII) */}
          <div className="bento-card card-5">
            <span className="card-number">05</span>
            <p className="card-type">INTELLIGENCE</p>
            <h3>Country Dossiers & CII Scoring</h3>
            <p>
              Comprehensive security profiles featuring the Country Instability Index (CII), active armed forces posture, nuclear status, defense spending, and bilateral treaty alliances across 195 nations.
            </p>
            <span className="card-scan">○ MONITORING</span>
          </div>

          {/* Card 6: Real-Time Hazard & Seismic Feeds */}
          <div className="bento-card card-6">
            <span className="card-number">06</span>
            <p className="card-type">ENVIRONMENT</p>
            <h3>Real-Time Hazard & Seismic Feeds</h3>
            <p>
              Direct telemetry ingestion of USGS live earthquakes, NASA EONET volcanic and wildfire satellite sensors, and NOAA severe atmospheric watches.
            </p>
            <span className="card-scan">○ MONITORING</span>
          </div>
        </div>

        {/* Survey of India Sovereign Standards Banner */}
        <div className="soi-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Flag size={22} style={{ color: 'var(--cyan)', flexShrink: 0 }} />
            <div>
              <h4 style={{ margin: '0 0 6px', font: "600 15px 'Space Grotesk', sans-serif", color: '#f1f5f9' }}>
                Survey of India (SOI) Statutory Cartographic Adherence
              </h4>
              <p style={{ margin: 0, font: "400 11.5px/1.6 'IBM Plex Mono', monospace", color: 'var(--muted)' }}>
                Unlike international commercial mapping engines that render Jammu & Kashmir or Arunachal Pradesh as dashed lines depending on user IP geolocation, Manekshaw.Vision enforces unbroken sovereign national borders strictly compliant with the statutory cartographic standards of the Republic of India.
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--cyan)', font: "600 10.5px 'IBM Plex Mono', monospace", whiteSpace: 'nowrap' }}>
            <CheckCircle2 size={16} />
            <span>100% SOI VERIFIED</span>
          </div>
        </div>
      </section>

      {/* 6. SECTION 02: OPERATIONAL THEATERS */}
      <section className="theater-section page-section" id="theaters" data-testid="theaters-section">
        <div className="section-heading split-heading">
          <div>
            <p className="section-index">02 / OPERATIONAL THEATERS</p>
            <h2>
              Read the <em>terrain.</em>
            </h2>
          </div>
          <p className="heading-note">
            Pre-configured regional viewports. Select a theater to tune the signal.
          </p>
        </div>

        <div className="theater-layout">
          {/* Theater Tabs */}
          <div className="theater-list" role="tablist" aria-label="Operational theaters">
            {THEATERS.map((th) => {
              const isActive = activeTheater.id === th.id;
              return (
                <button
                  key={th.id}
                  onClick={() => setActiveTheater(th)}
                  className={`theater-tab ${isActive ? 'active' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                  data-testid={`theater-tab-${th.id}`}
                >
                  <span>{th.name}</span>
                  <small style={{ color: isActive ? th.statusColor : undefined }}>
                    {th.status}
                  </small>
                  <ArrowUpRight size={15} />
                </button>
              );
            })}
          </div>

          {/* Active Theater Radar Card */}
          <div className={`theater-card ${activeTheater.status === 'HIGH ALERT' ? 'red' : activeTheater.status === 'WATCH' ? 'amber' : 'cyan'}`}>
            <div className="radar">
              <div className="radar-sweep" />
              <div className="radar-dot dot-a" />
              <div className="radar-dot dot-b" />
              <div className="radar-dot dot-c" />
            </div>

            <div className="theater-card-copy">
              <p className="card-type" style={{ color: activeTheater.statusColor }}>
                ACTIVE VIEWPORT / {activeTheater.status}
              </p>
              <h3 data-testid="active-theater-name">{activeTheater.name}</h3>
              <p className="coords" data-testid="active-theater-coordinates">
                {activeTheater.coords}
              </p>
              <p className="theater-detail">{activeTheater.detail}</p>

              <div className="signal-bar">
                <span /> <span /> <span /> <span /> <span />
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '24px' }}>
                {activeTheater.layers.map((l, idx) => (
                  <span
                    key={idx}
                    style={{
                      border: '1px solid var(--line)',
                      background: 'rgba(0,240,255,0.03)',
                      color: '#a2b0be',
                      fontSize: '9.5px',
                      fontFamily: "'IBM Plex Mono', monospace",
                      padding: '3px 8px'
                    }}
                  >
                    ⚡ {l}
                  </span>
                ))}
              </div>

              <small className="card-scan">DATA INTEGRITY / 100% SOI VERIFIED</small>
            </div>
          </div>
        </div>
      </section>

      {/* 7. SECTION 03: SIGNAL LOG */}
      <section className="signal-section page-section" id="signal" data-testid="signal-section">
        <div className="section-heading split-heading">
          <div>
            <p className="section-index">03 / SIGNAL LOG</p>
            <h2>
              What’s moving<br />
              <em>beneath the noise.</em>
            </h2>
          </div>

          <div className="intel-tools">
            <label className="search-box">
              <Search size={15} />
              <input
                placeholder="Search signal log"
                aria-label="Search signal log"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="signal-search-input"
              />
            </label>
            <button
              className="export-button"
              onClick={handleExportBriefing}
              data-testid="export-briefing-button"
            >
              <Download size={15} /> Export briefing
            </button>
          </div>
        </div>

        {/* Live Signal Telemetry Table */}
        <div className="intel-table" data-testid="signal-log-table">
          {filteredSignals.length > 0 ? (
            filteredSignals.map((item) => (
              <div key={item.id} className="intel-row">
                <span className="row-id">{item.id}</span>
                <span className="row-title">{item.title}</span>
                <span className="row-detail">{item.detail}</span>
                <span className="row-time">{item.time}</span>
                <Crosshair size={15} className="row-crosshair" />
              </div>
            ))
          ) : (
            <div className="empty-state">No telemetry matching query "{searchQuery}".</div>
          )}
        </div>
      </section>

      {/* 8. SECTION 04: NOBLE DEDICATION TO SIR SAM MANEKSHAW */}
      <section className="dedication page-section" id="dedication" data-testid="dedication-section">
        <div className="dedication-mark">
          <Shield size={20} />
          <span>THE MANVIS PRINCIPLE</span>
        </div>

        <div>
          <blockquote>
            “Professional knowledge and professional competence are the main attributes of leadership.”
          </blockquote>
          <p>— Field Marshal Sam Manekshaw, MC (1914–2008)</p>
        </div>

        {/* Dedicated Tribute Card */}
        <div className="dedication-card">
          <div className="dedication-portrait">
            <img src="/logo.jpg" alt="Field Marshal Sir Sam Manekshaw" />
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'rgba(6,8,12,0.85)',
                padding: '6px 10px',
                textAlign: 'center',
                font: "600 9px 'IBM Plex Mono', monospace",
                color: 'var(--amber)',
                letterSpacing: '.1em'
              }}
            >
              FIRST FIELD MARSHAL OF INDIA
            </div>
          </div>

          <div>
            <div className="honors-wrap">
              <span className="honor-pill">Military Cross (MC)</span>
              <span className="honor-pill">Padma Vibhushan</span>
              <span className="honor-pill">1971 Liberation War Hero</span>
            </div>

            <h3 style={{ font: "500 24px 'Space Grotesk', sans-serif", color: '#f1f5f9', margin: '16px 0 12px' }}>
              In Eternal Reverence to “Sam Bahadur”
            </h3>

            <div style={{ color: 'var(--muted)', font: "400 12px/1.8 'IBM Plex Mono', monospace", display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <p style={{ margin: 0 }}>
                Known affectionately as <strong style={{ color: '#f1f5f9' }}>“Sam Bahadur”</strong> (Sam the Brave), Field Marshal Sam Manekshaw stands as one of the greatest military strategists in modern history. As Chief of the Army Staff during the 1971 Indo-Pakistani War, his masterclass in operational planning and combined-arms doctrine culminated in the historic unconditional surrender of Pakistani forces in just 13 days—leading to the creation of Bangladesh.
              </p>
              <p style={{ margin: 0 }}>
                His career spanned four decades and five wars, marked not only by tactical brilliance but by an uncompromising moral spine. When pressurized to launch premature offensives, he stood resolute in his strategic counsel, ensuring total preparation before decisive action.
              </p>
              <p style={{ margin: 0, color: '#f1f5f9', borderTop: '1px solid var(--line)', paddingTop: '12px' }}>
                <strong style={{ color: 'var(--cyan)' }}>Manekshaw.Vision (ManVis)</strong> was conceived and developed in proud dedication to his enduring ethos—celebrating uncompromised sovereign preparedness, decisive intelligence, and steadfast vigilance over our borders and global strategic horizons.
              </p>
            </div>
          </div>
        </div>

        <div className="dedication-bottom">
          <span>Built by Team Astra Dynamics</span>
          <span>Dedicated to decisive intelligence.</span>
        </div>
      </section>

      {/* 9. SECTION 05: ENGINEERING ORIGINS (TEAM ASTRA DYNAMICS / ADYN) */}
      <section className="page-section" id="team" style={{ background: '#070b10' }}>
        <div className="section-heading">
          <p className="section-index">04 / ENGINEERING ORIGINS</p>
          <h2>
            Team Astra Dynamics<br />
            <em>(ADYN)</em>
          </h2>
          <p className="heading-note">
            The high school engineering team and sovereign intelligence project behind Manekshaw.Vision.
          </p>
        </div>

        <div className="origin-card">
          <div>
            <div className="adyn-logo-wrap">
              <img src="/adyn-logo.png" alt="Team Astra Dynamics Monogram" />
            </div>
            <div style={{ font: "600 14px 'Space Grotesk', sans-serif", color: '#f1f5f9' }}>
              ASTRA DYNAMICS
            </div>
            <div style={{ font: "500 9.5px 'IBM Plex Mono', monospace", color: 'var(--cyan)', margin: '4px 0 20px', letterSpacing: '.1em' }}>
              STUDENT AI & GEOINT COLLECTIVE
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', font: "400 11px 'IBM Plex Mono', monospace" }}>
              <div>
                <span style={{ color: '#506174', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>TEAM:</span>
                <span style={{ color: '#f1f5f9' }}>4 High School Developers</span>
              </div>
              <div>
                <span style={{ color: '#506174', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>ORIGIN:</span>
                <span style={{ color: '#f1f5f9' }}>Student AI & Systems Initiative</span>
              </div>
              <div>
                <span style={{ color: '#506174', display: 'block', fontSize: '9px', textTransform: 'uppercase' }}>ARCHITECTURE:</span>
                <span style={{ color: '#f1f5f9' }}>Multi-Layer OSINT Engine</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ font: "600 10px 'IBM Plex Mono', monospace", color: 'var(--cyan)', letterSpacing: '.15em', textTransform: 'uppercase' }}>
              LAB BRIEFING // MISSION
            </span>
            <h3 style={{ font: "500 24px 'Space Grotesk', sans-serif", color: '#f1f5f9', margin: '8px 0 18px' }}>
              Engineered by Team Astra Dynamics
            </h3>

            <div style={{ color: 'var(--muted)', font: "400 12.5px/1.8 'IBM Plex Mono', monospace", display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <p style={{ margin: 0 }}>
                Manekshaw.Vision (ManVis) was architected and built by <strong style={{ color: '#f1f5f9' }}>Team Astra Dynamics (ADYN)</strong>—a four-member high school engineering team exploring what happens when modern AI workflows, live open-source intelligence (OSINT) feeds, and WebGL cartography are combined into a single browser-native interface.
              </p>
              <p style={{ margin: 0 }}>
                What began as an experimental school AI project evolved into a full-scale geospatial monitor. We built ManVis to prove that clean, sovereign situational awareness doesn't require enterprise bloat—and dedicated the platform to the enduring legacy of India's First Field Marshal, Sam Manekshaw.
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', marginTop: '24px', paddingTop: '16px', display: 'flex', gap: '16px', font: "500 10px 'IBM Plex Mono', monospace", color: '#506174' }}>
              <span>STATUS: ACTIVE RESEARCH</span>
              <span>•</span>
              <span>LOCATION: NEW DELHI, INDIA</span>
              <span>•</span>
              <span>WEBGL // REACT // OSINT STACK</span>
            </div>
          </div>
        </div>
      </section>

      {/* 10. SECTION 06: FREQUENTLY ASKED QUESTIONS */}
      <section className="page-section" id="faq">
        <div className="section-heading">
          <p className="section-index">05 / INTELLIGENCE FAQ</p>
          <h2>
            Understanding the<br />
            <em>system.</em>
          </h2>
          <p className="heading-note">
            Key operational details on cartographic compliance, OSINT feed latency, and platform architecture.
          </p>
        </div>

        <div className="faq-list">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div key={idx} className={`faq-item ${isOpen ? 'active' : ''}`}>
                <button
                  className="faq-button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'none',
                      transition: 'transform .2s',
                      color: isOpen ? 'var(--cyan)' : 'var(--muted)'
                    }}
                  />
                </button>
                {isOpen && <div className="faq-answer">{faq.a}</div>}
              </div>
            );
          })}
        </div>

        {/* Command Center Launch Banner */}
        <div className="cta-banner-wrap">
          <h2>Enter the Sovereign Command Center</h2>
          <p>
            Free, real-time, and fully operational in your browser—no sign-up wall, zero tracking.
          </p>
          <button
            onClick={onLaunchDashboard}
            className="primary-button"
            style={{ margin: '0 auto', padding: '18px 28px', fontSize: '12px' }}
          >
            LAUNCH MANEKSHAW.VISION DASHBOARD <ArrowUpRight size={18} />
          </button>
        </div>
      </section>

      {/* 11. SITE FOOTER */}
      <footer className="site-footer">
        <div>
          <div className="brand-mark" data-testid="brand-logo" style={{ marginBottom: '14px' }}>
            <span className="mark-icon">M</span>
            <span>
              MANVIS<span className="brand-dot">.</span>VISION
            </span>
          </div>
          <p>
            Browser-native situational awareness<br />
            for a world in motion.
          </p>
        </div>

        <div>
          <p style={{ color: '#506174', font: "400 11px/1.8 'IBM Plex Mono', monospace" }}>
            Indian boundary demarcations strictly adhere to official Survey of India (SOI) statutory standards.
          </p>
        </div>

        <div className="footer-meta">
          <span>© MANVIS / ADYN 2026—27</span>
          <a href="mailto:team@manvis.tech" data-testid="footer-contact-link">
            Contact intelligence <ArrowUpRight size={14} />
          </a>
        </div>
      </footer>

      {/* 12. Toast Feedback Alert */}
      {toastMessage && <div className="toast">{toastMessage}</div>}
    </main>
  );
};
