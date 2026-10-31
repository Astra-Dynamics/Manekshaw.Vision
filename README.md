# Manekshaw.Vision — Sovereign Situational Awareness & Global Defense Intelligence Platform

[![Ask DeepWiki](https://img.shields.io/badge/Ask%20DeepWiki-Manekshaw.Vision-007ec6?style=flat)](https://deepwiki.com/anantjain1109/Manekshaw.Vision)
[![Last Updated](https://img.shields.io/github/last-commit/Astra-Dynamics/Manekshaw.Vision?style=flat&color=2ea44f&label=last%20updated)](https://github.com/Astra-Dynamics/Manekshaw.Vision/commits/main)

A sovereign, high-performance real-time global intelligence and defense dashboard built with **React 18**, **MapLibre GL**, **Tailwind CSS**, and **Vite**.

Honoring the strategic clarity and visionary leadership of Field Marshal Sam Manekshaw, **Manekshaw.Vision** delivers comprehensive real-time situational awareness across geopolitical flashpoints, military deployments, strategic chokepoints, critical infrastructure, and national security domains.

---

## 🌟 Strategic Capabilities & Features

### 1. Unified Cockpit Architecture
- **Header Operations Bar:**
  - Live UTC defense clock & active DEFCON readiness indicator.
  - Rapid Theater Switcher: **Global**, **India**, **Middle East**, **Indo-Pacific**, **Europe**, **Americas**.
  - Time Range controls (`24h`, `7d`, `30d`).
  - Active counters for Hotspots, Strikes, Nuclear sites, and Conflicts.
  - Sound alert toggle and Fullscreen toggle.
- **Breaking Intelligence Marquee (Ticker):**
  - Real-time animated news marquee displaying urgent geopolitical and military dispatches. Clicking any headline immediately tracks to target coordinates and pulls the dossier.
- **Tactical Map (Left Side):**
  - Ultra-smooth Carto Dark Matter vector canvas with MapLibre GL.
  - Official Survey of India (SOI) boundaries incorporating Jammu & Kashmir, Ladakh, and Aksai Chin.
  - Pulsing radar rings for critical strike points and escalations.
  - Translucent tactical polygon overlays for active war frontlines.
  - Interactive country polygons — clicking any sovereign nation opens a 4-tab Intelligence Brief.
- **Right Intelligence Desk (Dedicated Right Side):**
  - Tabbed intelligence workspace: **Live Feed**, **Flashpoints/Hotspots**, **Frontlines & Wars**, **Strategic Infrastructure**, and **Entity Dossier**.
  - Instant coordinate copy, satellite target acquisition, threat assessment, and combat actor breakdown.
- **Tactical Layer Dock (Floating Dock):**
  - 13 togglable intelligence layers with live counters and Rapid "Enable All" / "Clear All" controls.

---

## 🗺️ 13 Integrated Intelligence Layers
1. **Middle East Strikes (`iranAttacks`)**: Ballistic missile impact zones (Nevatim, Tel Nof, Glilot, Hodeidah, Parchin).
2. **Intel Hotspots (`hotspots`)**: Key flashpoints (Taiwan Strait, Strait of Hormuz, Bab el-Mandeb, South China Sea, Korean DMZ, Zaporizhzhia, Suwałki Gap).
3. **Conflict Zones (`conflicts`)**: Shaded frontline polygons with combat actor details.
4. **Military Bases (`bases`)**: Major US/NATO, Russian, Chinese, and Indian strategic bases.
5. **Nuclear Sites (`nuclear`)**: Enrichment facilities, reactors, and storage complexes.
6. **Air & Naval Deployments (`military`)**: Carrier strike groups, patrol vectors, and surveillance aircraft.
7. **Severe Weather (`weather`)**: Live NOAA/NWS alerts, typhoons, and cyclones.
8. **Emergency Alerts (`canadaAlerts`)**: Civil emergency and infrastructure alerts.
9. **Grid & Cable Outages (`outages`)**: Undersea fiber disruptions and power grid anomalies.
10. **Natural Hazards (`natural`)**: Real-time USGS Earthquakes (M4.5+) and NASA EONET volcanic/wildfire events.
11. **Strategic Waterways (`waterways`)**: Maritime chokepoints (Malacca, Hormuz, Bab el-Mandeb, Suez, Panama, Bosphorus).
12. **Economic Centers (`economic`)**: Key financial centers, rare earth processing hubs, and semiconductor clusters.
13. **Sanctions Regimes (`sanctions`)**: Sanctioned jurisdictions, OFSI/OFAC monitored states, and trade embargoes.

---

## 🛠️ Local Development & Build

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build for production
npm run build
```

---

## 🚀 Deployment
Deployed to Vercel via GitHub continuous integration:
- Repository: [https://github.com/anantjain1109/Manekshaw.Vision](https://github.com/anantjain1109/Manekshaw.Vision)
