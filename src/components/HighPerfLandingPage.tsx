import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import {
  Radio,
  Cpu,
  Radar,
  ArrowRight,
  Compass,
  Terminal,
  Activity,
  Shield,
  Layers,
  Globe2,
  Zap,
  Flame,
  Award,
  Maximize2,
  RefreshCw,
  Eye,
  AlertTriangle,
  Lock,
  ChevronRight
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
  status: 'CRITICAL' | 'ELEVATED' | 'STRATEGIC';
  statusColor: string;
  intel: string;
}

const STRATEGIC_HOTSPOTS: StrategicHotspot[] = [
  {
    id: 'india-north',
    name: 'Jammu & Kashmir / Ladakh (LAC & LoC)',
    theater: 'South Asia & Northern Frontiers',
    lat: 34.08,
    lng: 74.79,
    status: 'CRITICAL',
    statusColor: '#F43F5E',
    intel: 'Continuous forward surveillance along Siachen AGPL and Eastern Ladakh. 100% Survey of India sovereign border compliance enforced.'
  },
  {
    id: 'hormuz',
    name: 'Strait of Hormuz & Gulf of Oman',
    theater: 'Middle East Maritime Corridor',
    lat: 26.56,
    lng: 56.25,
    status: 'ELEVATED',
    statusColor: '#F59E0B',
    intel: 'Strategic hydrocarbon transit chokepoint. Carrier strike groups and commercial merchant tanker escort operations active.'
  },
  {
    id: 'taiwan',
    name: 'Taiwan Strait & First Island Chain',
    theater: 'Indo-Pacific & East Asia',
    lat: 24.14,
    lng: 120.67,
    status: 'STRATEGIC',
    statusColor: '#00F0FF',
    intel: 'Air Defense Identification Zone (ADIZ) incursions and naval median-line maneuvers under continuous synthetic aperture radar monitoring.'
  },
  {
    id: 'red-sea',
    name: 'Bab el-Mandeb & Red Sea Basin',
    theater: 'Red Sea & Horn of Africa',
    lat: 12.58,
    lng: 43.33,
    status: 'CRITICAL',
    statusColor: '#F43F5E',
    intel: 'Anti-ship ballistic missile alerts and uncrewed surface vessel (USV) drone intercepts safeguarding international maritime shipping.'
  },
  {
    id: 'black-sea',
    name: 'Donbas & Black Sea Maritime Sector',
    theater: 'Eastern Europe Conflict Zone',
    lat: 46.48,
    lng: 30.73,
    status: 'CRITICAL',
    statusColor: '#EF4444',
    intel: 'High-density electronic warfare GPS jamming corridor, frontline mechanized engagements, and Black Sea grain corridor monitoring.'
  },
  {
    id: 'malacca',
    name: 'Strait of Malacca & Andaman Sea',
    theater: 'Bay of Bengal & Southeast Asia',
    lat: 4.21,
    lng: 100.55,
    status: 'STRATEGIC',
    statusColor: '#10B981',
    intel: 'Primary energy route linking Indian Ocean to the Pacific. Naval presence monitors dual-use commercial port infrastructure.'
  }
];

export const HighPerfLandingPage: React.FC<HighPerfLandingPageProps> = ({
  onLaunchDashboard,
  onOpenAuthModal,
  onNavigateLogin,
  onToggleLandingMode
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedHotspot, setSelectedHotspot] = useState<StrategicHotspot>(STRATEGIC_HOTSPOTS[0]);
  const [fps, setFps] = useState<number>(60);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'INIT_SYSTEM: HARDWARE-ACCELERATED GEOINT 3D PIPELINE INITIALIZED',
    'GPU_STATUS: WEBGL 2.0 HARDWARE PIPELINE ACTIVE • 60+ FPS LOCKED',
    'DATA_LINK: 47 OSINT CHANNELS SYNCHRONIZED ACROSS 6 GLOBAL THEATERS',
    'SOI_BOUNDARY: 100% STATUTORY SURVEY OF INDIA CARTOGRAPHIC INTEGRITY',
    'DEFCON_STATUS: DEFCON 3 • INCREASED FORCE READINESS ABOVE NORMAL',
    'STREAM_READY: 16 SATELLITE & LIVE BROADCAST FEEDS ARMED FOR INGEST'
  ]);

  // Three.js Interactive 3D Globe Engine
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationFrameId: number;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.0018);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 2000);
    camera.position.set(0, 35, 175);

    // 2. Renderer with High-Performance Settings
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // 3. Globe Container Group (for mouse rotation)
    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    const GLOBE_RADIUS = 55;

    // A. Inner Core Wireframe Sphere
    const coreGeo = new THREE.SphereGeometry(GLOBE_RADIUS, 48, 48);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0x061226,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    globeGroup.add(coreMesh);

    // B. Glowing Atmospheric Shell
    const atmoGeo = new THREE.SphereGeometry(GLOBE_RADIUS * 1.03, 32, 32);
    const atmoMat = new THREE.MeshBasicMaterial({
      color: 0x00f0ff,
      wireframe: true,
      transparent: true,
      opacity: 0.06
    });
    const atmoMesh = new THREE.Mesh(atmoGeo, atmoMat);
    globeGroup.add(atmoMesh);

    // C. Point Cloud Continents & Latitude/Longitude Grid
    const pointCount = 3800;
    const pointPositions = new Float32Array(pointCount * 3);
    const pointColors = new Float32Array(pointCount * 3);
    const colorCyan = new THREE.Color(0x38bdf8);
    const colorGold = new THREE.Color(0xfbbf24);
    const colorNavy = new THREE.Color(0x1e3a8a);

    for (let i = 0; i < pointCount; i++) {
      // Golden spiral distribution across sphere
      const phi = Math.acos(1 - (2 * (i + 0.5)) / pointCount);
      const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

      const r = GLOBE_RADIUS + (Math.random() - 0.5) * 1.5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);

      pointPositions[i * 3] = x;
      pointPositions[i * 3 + 1] = y;
      pointPositions[i * 3 + 2] = z;

      // Color variation
      const col = i % 8 === 0 ? colorGold : (i % 2 === 0 ? colorCyan : colorNavy);
      pointColors[i * 3] = col.r;
      pointColors[i * 3 + 1] = col.g;
      pointColors[i * 3 + 2] = col.b;
    }

    const pointsGeo = new THREE.BufferGeometry();
    pointsGeo.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    pointsGeo.setAttribute('color', new THREE.BufferAttribute(pointColors, 3));

    const pointsMat = new THREE.PointsMaterial({
      size: 1.6,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
    globeGroup.add(pointsMesh);

    // D. Orbiting Satellite Rings
    const createOrbitRing = (radius: number, tiltX: number, tiltY: number, colorHex: number) => {
      const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
      const points = curve.getPoints(128);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(
        points.map(p => new THREE.Vector3(p.x, 0, p.y))
      );
      const ringMat = new THREE.LineBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.35
      });
      const ringMesh = new THREE.Line(ringGeo, ringMat);
      ringMesh.rotation.x = tiltX;
      ringMesh.rotation.z = tiltY;
      return ringMesh;
    };

    const orbit1 = createOrbitRing(GLOBE_RADIUS * 1.35, Math.PI / 4, Math.PI / 6, 0x00f0ff);
    const orbit2 = createOrbitRing(GLOBE_RADIUS * 1.55, -Math.PI / 3, Math.PI / 4, 0xfbbf24);
    globeGroup.add(orbit1);
    globeGroup.add(orbit2);

    // Orbiting Satellite Beacon Meshes
    const satGeo = new THREE.SphereGeometry(1.4, 8, 8);
    const satMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const sat1 = new THREE.Mesh(satGeo, satMat1);
    globeGroup.add(sat1);

    const satMat2 = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
    const sat2 = new THREE.Mesh(satGeo, satMat2);
    globeGroup.add(sat2);

    // E. 3D Hotspot Coordinate Pins & Beacons
    const latLngToVector3 = (lat: number, lng: number, r: number) => {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      return new THREE.Vector3(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    const hotspotMeshes: { id: string; mesh: THREE.Mesh; ring: THREE.Mesh }[] = [];

    STRATEGIC_HOTSPOTS.forEach(spot => {
      const pos = latLngToVector3(spot.lat, spot.lng, GLOBE_RADIUS + 1.0);

      // Hotspot Core Marker
      const markerGeo = new THREE.SphereGeometry(1.6, 12, 12);
      const markerMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(spot.statusColor)
      });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);
      globeGroup.add(markerMesh);

      // Radar Ring Emitting from Hotspot
      const ringGeo = new THREE.RingGeometry(1.8, 3.2, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(spot.statusColor),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.75
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos);
      ringMesh.lookAt(new THREE.Vector3(0, 0, 0));
      globeGroup.add(ringMesh);

      hotspotMeshes.push({ id: spot.id, mesh: markerMesh, ring: ringMesh });
    });

    // F. Interactive Mouse Drag & Auto Rotation Controls
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let targetRotationX = 0.25;
    let targetRotationY = 0.8;
    let currentRotationX = 0.25;
    let currentRotationY = 0.8;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        targetRotationY += deltaX * 0.005;
        targetRotationX += deltaY * 0.005;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // G. Main Render & Animation Loop
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = 0;
    let orbitAngle = 0;

    const animate = (time: number) => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = (time - lastTime) / 1000;
      lastTime = time;

      // FPS Counter calculation
      frameCount++;
      fpsTimer += delta;
      if (fpsTimer >= 0.5) {
        setFps(Math.round((frameCount / fpsTimer)));
        frameCount = 0;
        fpsTimer = 0;
      }

      // Smooth idle rotation if not dragging
      if (!isDragging) {
        targetRotationY += 0.0018;
      }

      // Inertial damping
      currentRotationX += (targetRotationX - currentRotationX) * 0.08;
      currentRotationY += (targetRotationY - currentRotationY) * 0.08;

      globeGroup.rotation.x = currentRotationX;
      globeGroup.rotation.y = currentRotationY;

      // Orbit satellites
      orbitAngle += 0.015;
      const r1 = GLOBE_RADIUS * 1.35;
      sat1.position.set(
        Math.cos(orbitAngle) * r1 * Math.cos(Math.PI / 6),
        Math.sin(orbitAngle) * r1 * Math.sin(Math.PI / 4),
        Math.sin(orbitAngle) * r1 * Math.cos(Math.PI / 4)
      );

      const r2 = GLOBE_RADIUS * 1.55;
      sat2.position.set(
        Math.sin(orbitAngle * 0.8) * r2 * Math.cos(Math.PI / 4),
        Math.cos(orbitAngle * 0.8) * r2 * Math.sin(-Math.PI / 3),
        Math.cos(orbitAngle * 0.8) * r2
      );

      // Pulsate hotspot radar rings
      const pulseScale = 1.0 + Math.sin(time * 0.006) * 0.35;
      hotspotMeshes.forEach(item => {
        item.ring.scale.set(pulseScale, pulseScale, pulseScale);
      });

      renderer.render(scene, camera);
    };

    animationFrameId = requestAnimationFrame(animate);

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Periodic Terminal Telemetry Streamer
  useEffect(() => {
    const interval = setInterval(() => {
      const incomingFeeds = [
        `GEOINT_UPDATE: SAR Satellite radar sweep active over ${selectedHotspot.theater}`,
        `TELEMETRY_INGEST: ${Math.floor(Math.random() * 8) + 4} new dispatches geocoded in 14ms`,
        `HOTSPOT_METRIC: Escalation Index for ${selectedHotspot.name} recalculated to 8.4/10`,
        `SPECTRUM_SCAN: GNSS interference detected across ${Math.floor(Math.random() * 40) + 120}km corridor`,
        `SOVEREIGNTY_CHECK: Jammu & Kashmir, Ladakh & Arunachal SOI vectors verified unbroken`
      ];
      const randomLine = incomingFeeds[Math.floor(Math.random() * incomingFeeds.length)];
      setTerminalLines(prev => [randomLine, ...prev.slice(0, 5)]);
    }, 4500);
    return () => clearInterval(interval);
  }, [selectedHotspot]);

  return (
    <div className="w-full min-h-screen bg-[#030712] text-[#F8FAFC] font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-x-hidden relative">
      {/* Background Cyber Grid & Vignette */}
      <div
        className="fixed inset-0 pointer-events-none opacity-25"
        style={{
          backgroundImage: `
            radial-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px),
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '36px 36px, 72px 72px, 72px 72px'
        }}
      />
      <div className="fixed inset-0 bg-radial-gradient from-transparent via-slate-950/60 to-[#02050D] pointer-events-none" />

      {/* RAZOR-THIN TACTICAL 48px WORKSTATION HEADER */}
      <header className="fixed top-0 left-0 right-0 w-full z-[1000] border-b border-cyan-500/20 bg-[#040814]/90 backdrop-blur-xl shadow-[0_10px_35px_-10px_rgba(0,0,0,0.85)]">
        <div className="max-w-[1500px] mx-auto h-[48px] px-4 sm:px-6 flex items-center justify-between">
          {/* Brand Lockup */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-7 h-7 rounded bg-cyan-500/15 border border-cyan-400/40 text-cyan-400 shadow-[0_0_12px_rgba(0,240,255,0.4)]">
              <Cpu size={15} className="animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold tracking-wider text-[14px] text-white">
                MANEKSHAW<span className="text-cyan-400">.VISION</span>
              </span>
              <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                GPU 3D WORKSTATION
              </span>
            </div>
          </div>

          {/* Right Controls: Mode Toggle & Dashboard Button */}
          <div className="flex items-center gap-3">
            {/* Real-time Hardware Performance Telemetry Pill */}
            <div className="hidden lg:flex items-center gap-2 px-2.5 py-1 rounded bg-black/40 border border-cyan-500/30 font-mono text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_#10b981]" />
              <span className="text-cyan-400 font-bold">{fps} FPS</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">WEBGL 2.0 GPU ACCELERATED</span>
            </div>

            {/* EXPERIENCE TOGGLE SWITCH (Back to Standard Mode) */}
            <button
              onClick={onToggleLandingMode}
              type="button"
              title="Click to toggle back to Standard Lightweight Mode"
              className="flex items-center gap-2 px-3 py-1 rounded bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 font-mono text-[11px] font-bold tracking-wider transition-all shadow-[0_0_14px_rgba(0,240,255,0.2)] cursor-pointer"
              style={{ height: '30px' }}
            >
              <Activity size={13} className="text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline">3D WORKSTATION: ON</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-cyan-400 text-slate-950 font-extrabold">
                ACTIVE
              </span>
            </button>

            <UserNav
              onOpenAuthModal={onOpenAuthModal || (() => {})}
              onNavigateLogin={onNavigateLogin}
              compact
            />

            <button
              onClick={onLaunchDashboard}
              className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold tracking-wider uppercase text-[11px] px-3.5 py-1.5 rounded transition-all shadow-[0_0_20px_rgba(0,240,255,0.5)] flex items-center gap-1.5 cursor-pointer active:scale-95"
              style={{ height: '30px' }}
            >
              <Radar size={13} className="animate-spin text-slate-950" style={{ animationDuration: '5s' }} />
              <span>LAUNCH COCKPIT</span>
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION: INTERACTIVE 3D GLOBE STAGE */}
      <section className="relative pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-[1500px] mx-auto min-h-[90vh] flex flex-col justify-center">
        {/* Floating Top Telemetry Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 font-mono text-[11px] border-b border-cyan-500/15 pb-3">
          <div className="flex items-center gap-3">
            <span className="text-cyan-400 font-bold uppercase tracking-widest flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              GEOSPATIAL WAR-ROOM ENGINE
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300">INTERACTIVE 3D ORBITAL MATRIX</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>ROTATION: MOUSE DRAG / INERTIAL AUTO-SPIN</span>
            <span className="text-slate-600">•</span>
            <span className="text-amber-400 font-bold">SOI INTEGRITY: 100% UNBROKEN</span>
          </div>
        </div>

        {/* Main 2-Column High-Performance Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Column (5 Cols): Editorial & Hotspot Telemetry Dossier */}
          <div className="lg:col-span-5 space-y-6 z-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-xs font-bold tracking-wider uppercase shadow-inner">
              <Zap size={13} />
              <span>HIGH-PERFORMANCE WORKSTATION ENGINE</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Sovereign Spatial Defense <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-amber-300">
                3D Tactical Command
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Designed specifically for multi-monitor workstations and modern GPU rendering. Explore real-time strategic 
              frontlines, sovereign airspace perimeters, and active geopolitical flashpoints in full hardware-accelerated 3D space.
            </p>

            {/* Active Hotspot Telemetry Dossier Card */}
            <div className="p-5 rounded-[4px] bg-[#070E1E]/95 border border-cyan-500/30 shadow-[0_15px_35px_rgba(0,0,0,0.8)] relative overflow-hidden backdrop-blur-md">
              <div className="flex items-center justify-between mb-3 border-b border-cyan-500/20 pb-2">
                <div className="flex items-center gap-2 font-mono text-xs font-bold text-white">
                  <Flame size={14} className="text-rose-400" />
                  <span>TARGET DOSSIER: {selectedHotspot.name}</span>
                </div>
                <span
                  className="px-2 py-0.5 rounded font-mono text-[9px] font-bold border uppercase"
                  style={{
                    backgroundColor: `${selectedHotspot.statusColor}22`,
                    color: selectedHotspot.statusColor,
                    borderColor: `${selectedHotspot.statusColor}55`
                  }}
                >
                  {selectedHotspot.status}
                </span>
              </div>

              <div className="font-mono text-[11px] text-cyan-300 mb-2 flex items-center justify-between">
                <span>THEATER: {selectedHotspot.theater}</span>
                <span className="text-slate-400">{selectedHotspot.lat}°N, {selectedHotspot.lng}°E</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed font-sans mb-4">
                {selectedHotspot.intel}
              </p>

              {/* Hotspot Selector Pills */}
              <div className="space-y-1.5">
                <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                  FOCUS STRATEGIC SECTOR:
                </span>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px]">
                  {STRATEGIC_HOTSPOTS.map(spot => (
                    <button
                      key={spot.id}
                      onClick={() => setSelectedHotspot(spot)}
                      className={`px-2.5 py-1.5 rounded text-left truncate transition-all cursor-pointer border ${
                        selectedHotspot.id === spot.id
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(0,240,255,0.3)] font-bold'
                          : 'bg-black/30 border-white/10 text-slate-400 hover:border-cyan-500/30 hover:text-slate-200'
                      }`}
                    >
                      • {spot.name.split('/')[0]}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Launch Call To Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={onLaunchDashboard}
                className="w-full sm:w-auto px-6 py-3.5 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-extrabold text-xs tracking-wider uppercase transition-all shadow-[0_0_28px_rgba(0,240,255,0.45)] hover:shadow-[0_0_35px_rgba(0,240,255,0.65)] flex items-center justify-center gap-2 cursor-pointer group"
              >
                <Compass size={15} className="group-hover:rotate-45 transition-transform" />
                <span>ENTER TACTICAL COCKPIT</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onToggleLandingMode}
                className="w-full sm:w-auto px-5 py-3.5 rounded bg-black/40 hover:bg-black/60 text-slate-300 hover:text-white border border-white/15 font-mono text-xs tracking-wider uppercase transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <RefreshCw size={13} className="text-slate-400" />
                <span>Switch to Standard Mode</span>
              </button>
            </div>
          </div>

          {/* Right Column (7 Cols): The Live Interactive 3D Globe Canvas */}
          <div className="lg:col-span-7 relative h-[520px] sm:h-[620px] flex items-center justify-center">
            {/* The WebGL Canvas Container */}
            <div
              ref={mountRef}
              className="w-full h-full cursor-grab active:cursor-grabbing relative select-none rounded-[8px] overflow-hidden"
            />

            {/* Drag to Rotate HUD Instruction Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none text-slate-400 font-mono text-[10px] bg-slate-950/80 px-4 py-2 rounded border border-cyan-500/20 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Compass size={12} className="text-cyan-400 animate-spin" style={{ animationDuration: '10s' }} />
                <span>DRAG WITH MOUSE TO ROTATE 3D GLOBE IN ANY DIRECTION</span>
              </div>
              <span className="text-cyan-400 font-bold">HARDWARE 3D ACCELERATED</span>
            </div>
          </div>
        </div>

        {/* Live Terminal Telemetry Marquee & Spectrogram Bottom Bar */}
        <div className="mt-8 p-4 rounded-[4px] bg-[#040814]/90 border border-cyan-500/20 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2 mb-2">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-[11px]">
              <Terminal size={14} />
              <span>LIVE GEOINT TELEMETRY STREAM & INGESTION LOGS</span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-slate-400">
              <span className="text-emerald-400 font-bold">CONNECTED // ENCRYPTED</span>
              <span>47 SOURCES ARMED</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-[10px]">
            {terminalLines.map((line, idx) => (
              <div key={idx} className="flex items-center gap-2 text-slate-300 truncate">
                <span className="text-cyan-400">›</span>
                <span className="truncate">{line}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-cyan-500/20 py-6 px-4 sm:px-6 lg:px-8 bg-[#02050D] text-xs font-mono text-slate-500">
        <div className="max-w-[1500px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">MANEKSHAW.VISION</span>
            <span>•</span>
            <span className="text-cyan-400">High-Performance 3D Workstation Edition</span>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-500">
            Survey of India official boundary adherence guaranteed. Dedicated to Field Marshal Sir Sam Manekshaw.
          </div>
        </div>
      </footer>
    </div>
  );
};
