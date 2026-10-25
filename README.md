# World Monitor — Global Situational Awareness & Intelligence Dashboard

A modern, high-performance real-time global intelligence dashboard inspired by [worldmonitor.app](https://www.worldmonitor.app/) and [koala73/worldmonitor](https://github.com/koala73/worldmonitor). Built with **React 18**, **MapLibre GL**, **Tailwind CSS**, and **Vite**.

---

## 🚀 Live Local Access
The development server is running and accessible at:
- **Local Dashboard:** [http://localhost:3000/](http://localhost:3000/)
- **Exact Presets URL:** [http://localhost:3000/?lat=22.4589&lon=82.7533&zoom=3.25&view=global&timeRange=7d&layers=iranAttacks,hotspots,conflicts,bases,nuclear,military,weather,canadaAlerts,outages,natural,waterways,economic,sanctions](http://localhost:3000/?lat=22.4589&lon=82.7533&zoom=3.25&view=global&timeRange=7d&layers=iranAttacks,hotspots,conflicts,bases,nuclear,military,weather,canadaAlerts,outages,natural,waterways,economic,sanctions)

---

## 🌟 Key Features & Layout Enhancements

### 1. Refined Cockpit Layout
- **Header Operations Bar:**
  - Live UTC defense clock & blinking DEFCON 3 readiness indicator.
  - Quick Theater Presets: **Global**, **Middle East**, **Indo-Pacific**, **Europe**, **Americas**.
  - Time Range controls (`24h`, `7d`, `30d`).
  - Active counts summary for Hotspots, Strikes, and Conflicts.
  - Sound alert toggle and Fullscreen toggle.
- **Breaking Alert Ticker Strip:**
  - Real-time animated news marquee displaying urgent geopolitical dispatches. Clicking any headline immediately flies the camera to the target coordinates and opens the dossier.
- **Interactive Map Canvas (MapLibre GL):**
  - Ultra-smooth Carto Dark Matter vector tiles.
  - Pulsing radar rings for critical strike points and hotspots.
  - Translucent red hazard polygon overlays for active war frontlines (Eastern Ukraine, Levant, Sudan, Myanmar, DRC).
  - Hover tooltip cards and marker clustering.
- **Floating Layer Dock (Bottom):**
  - Glassmorphism bottom control bar displaying all 13 layers with toggle switches, icons, and real-time counter badges.
  - "Enable All" and "Clear All" rapid controls.
- **Left Intelligence Drawer:**
  - 4 tabs: **Feed** (real-time news), **Hotspots** (escalation ratings 1-5), **Wars** (conflict zones), and **Assets** (bases, nuclear, waterways).
  - Real-time keyword search & severity filter dropdown (`Critical`, `High`, `Medium`).
- **Right Inspector Drawer:**
  - Detailed technical dossier for any selected entity: Coordinates (with copy button), Situation Briefing, Operational Parameters table, Strategic Significance assessment, Combat Actors list, and external briefing links.

---

## 🗺️ Supported Layers (Exact 13 Layers from URL)
1. **Middle East Strikes (`iranAttacks`)**: Ballistic missile impact zones (Nevatim, Tel Nof, Glilot, Hodeidah, Parchin).
2. **Intel Hotspots (`hotspots`)**: Key flashpoints (Taiwan Strait, Strait of Hormuz, Bab el-Mandeb, South China Sea, Korean DMZ, Zaporizhzhia, Suwałki Gap).
3. **Conflict Zones (`conflicts`)**: Shaded frontline polygons with combat actor details.
4. **Military Bases (`bases`)**: Major US/NATO, Russian, and Chinese naval, air, and submarine bases.
5. **Nuclear Sites (`nuclear`)**: Uranium enrichment cascades (Natanz, Fordow), Dimona, Zaporizhzhia, Yongbyon.
6. **Air & Naval Deployments (`military`)**: Carrier strike groups (USS Truman, USS Lincoln, PLAN Shandong), P-8A Poseidon, and RC-135W Rivet Joint patrol vectors.
7. **Severe Weather (`weather`)**: Live NOAA/NWS alerts + tropical typhoons and bomb cyclones.
8. **Canada Alerts (`canadaAlerts`)**: Emergency alerts across Alberta, BC, Saskatchewan, and Ontario.
9. **Grid & Cable Outages (`outages`)**: Undersea fiber disruptions (Red Sea, Baltic Sea) and national electrical grid collapses.
10. **Earthquakes & Natural Events (`natural`)**: **Live real-time feed from USGS Earthquake API (M4.5+)** + **NASA EONET** volcanic/fire hazards.
11. **Maritime Chokepoints (`waterways`)**: Strategic transit bottlenecks (Hormuz, Malacca, Suez, Bab el-Mandeb, Panama, Bosphorus).
12. **Financial Centers (`economic`)**: Global stock exchanges (NYSE, LSE, TSE, HKEX, NSE) and central banks.
13. **Sanctions Regimes (`sanctions`)**: International OFAC, EU, and UN trade and financial embargo programs.

---

## 🛠️ Tech Stack
- **React 18** + **TypeScript**
- **MapLibre GL 5.1**
- **Vite 6** + **Tailwind CSS 4**
- **Lucide Icons**
- **Public APIs**: USGS Real-Time Earthquakes, NASA EONET, NOAA/NWS Alerts
