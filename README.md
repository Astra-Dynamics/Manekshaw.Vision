# Manekshaw.Vision — Sovereign Situational Awareness & Global Defense Intelligence Platform

[![Production URL](https://img.shields.io/badge/Live-manvis.tech-0284c7?style=flat&logo=google-chrome&logoColor=white)](https://www.manvis.tech)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Astra--Dynamics%2FManekshaw.Vision-181717?style=flat&logo=github&logoColor=white)](https://github.com/Astra-Dynamics/Manekshaw.Vision)
[![Last Updated](https://img.shields.io/github/last-commit/Astra-Dynamics/Manekshaw.Vision?style=flat&color=2ea44f&label=last%20updated)](https://github.com/Astra-Dynamics/Manekshaw.Vision/commits/main)
[![Ask DeepWiki](https://img.shields.io/badge/Ask%20DeepWiki-Manekshaw.Vision-007ec6?style=flat)](https://deepwiki.com/Astra-Dynamics/Manekshaw.Vision)

**Manekshaw.Vision** is a sovereign, high-performance real-time global intelligence and defense monitoring platform built with **React 18**, **TypeScript**, **MapLibre GL**, **Tailwind CSS**, **Vite**, and **Supabase**.

Honoring the strategic clarity and visionary leadership of Field Marshal Sam Manekshaw, the platform delivers unified real-time situational awareness across geopolitical flashpoints, war frontlines, military deployments, strategic chokepoints, critical infrastructure, electronic warfare domains, and national security vectors.

---

## 🌟 Strategic Capabilities & Features

### 1. Unified Cockpit Architecture
- **Header Operations Bar (HUD):**
  - Live UTC defense clock & active DEFCON readiness indicator.
  - Rapid Theater Switcher: **Global**, **India**, **Middle East**, **Indo-Pacific**, **Europe**, and **Americas**.
  - Dynamic Time Range filtration (`24h`, `7d`, `30d`).
  - Active counters for Hotspots, Missile Strikes, Nuclear Facilities, and Frontline Conflicts.
  - Sound alert toggle, theme switcher, and fullscreen operation mode.
- **Breaking Intelligence Marquee (Ticker):**
  - Real-time animated news marquee displaying urgent geopolitical and defense dispatches. Clicking any headline immediately tracks target coordinates on the map and pulls its dossier.
- **Tactical Map Canvas:**
  - Ultra-smooth Carto vector canvas powered by MapLibre GL.
  - **Sovereign Cartography Compliance**: Strict adherence to official **Survey of India (SOI)** statutory cartographic standards, correctly representing Jammu & Kashmir, Ladakh, and Aksai Chin.
  - Pulsing radar rings for critical strike coordinates and tactical escalations.
  - Translucent tactical polygon overlays representing active war frontlines.
  - Interactive country polygons with 4-tab Comprehensive Intelligence Briefs.
- **Right Intelligence Desk (Intel Desk):**
  - Tabbed intelligence workspace: **Live Feed**, **Flashpoints / Hotspots**, **Frontlines & Wars**, **Strategic Infrastructure**, **Video Intel**, and **Entity Dossier**.
  - Instant coordinate copy, satellite target acquisition, threat assessment, and combat actor breakdown.
  - Canonical publisher citations with direct external links to source articles.
- **Multi-Tab Tactical Workspace & Drawer:**
  - Draggable, reorderable workspace tabs with persistent layout state memory.
  - Intel Workspace Drawer featuring a modular block canvas for multi-row intelligence workflows.
- **Dual-Theme Design System:**
  - **Tactical Dark Mode (Default):** High-contrast cyber-defense dark aesthetic (`#06090e`, `#0c121e`, sky-500 glow).
  - **Claude Warm Light Mode:** Warm editorial aesthetic featuring Source Serif 4 typography, stone/sand tonal surfaces, refined category hues, and decluttered vector cartography.

---

## 🗺️ 16 Integrated Intelligence & Strategic Layers

The tactical layer dock provides 16 togglable intelligence feeds with real-time counters and batch controls:

1. **Middle East Strikes (`iranAttacks`)**: Ballistic missile impact zones (Nevatim, Tel Nof, Glilot, Hodeidah, Parchin).
2. **Flashpoints & Hotspots (`hotspots`)**: Key strategic flashpoints (Taiwan Strait, Strait of Hormuz, Bab el-Mandeb, South China Sea, Korean DMZ, Zaporizhzhia, Suwałki Gap).
3. **Conflict Zones & War Frontlines (`conflicts`)**: Shaded frontline polygons with combat actor details.
4. **Military Bases (`bases`)**: Major US/NATO, Russian, Chinese, and Indian strategic installations.
5. **Nuclear Facilities (`nuclear`)**: Enrichment facilities, nuclear reactors, and strategic storage complexes.
6. **Air & Naval Deployments (`military`)**: Carrier strike groups, patrol vectors, and surveillance aircraft.
7. **Severe Weather & Cyclones (`weather`)**: Live NOAA/NWS alerts, typhoons, and cyclones.
8. **Emergency Alerts (`canadaAlerts`)**: Civil emergency and infrastructure alerts.
9. **Grid & Cable Outages (`outages`)**: Undersea fiber disruptions and power grid anomalies.
10. **Natural Hazards (`natural`)**: Real-time USGS Earthquakes (M4.5+) and NASA EONET volcanic/wildfire events.
11. **Strategic Waterways (`waterways`)**: Maritime chokepoints (Malacca, Hormuz, Bab el-Mandeb, Suez, Panama, Bosphorus).
12. **Economic Centers (`economic`)**: Key financial centers, rare earth processing hubs, and semiconductor clusters.
13. **Sanctions Regimes (`sanctions`)**: Sanctioned jurisdictions, OFSI/OFAC monitored states, and trade embargoes.
14. **Electronic Warfare & GPS Jamming (`gpsJamming`)**: GPS jamming incident points, spoofing zones, and contested electromagnetic zones.
15. **Air Defense Identification Zones (`adizZones`)**: Sovereign ADIZ boundaries and contested airspace sectors.
16. **Fortified Borders (`fortifiedBorders`)**: Major sovereign border security fences, demilitarized zones, and defense lines.

---

## 🔐 Authentication & Identity Management

- **Google OAuth 2.0 Integration:**
  - Officially published and brand-verified in Google Cloud Console under **Manekshaw Vision**.
  - Custom dark Google Sign-in button with native Google SVG icon.
- **Supabase Authentication:**
  - Secure email/password login, account recovery, and operator registration.
  - **Reactive Password Validation**: 5 real-time password condition checks with shake animation feedback, displayed exclusively during Sign-Up.
- **Optimized Horizontal Desktop Layout:**
  - Clean 2-column split on desktop (`/signup`) with zero vertical scrolling required.
  - Consumer-friendly, transparent data privacy and encryption reassurances.

---

## ⚖️ Legal & Statutory Compliance

Manekshaw.Vision is fully compliant with open-source intelligence guidelines and Indian statutory regulations:
- **Privacy Policy ([/privacy](https://www.manvis.tech/privacy))**: Details strict data minimization, AES-256 Supabase encryption, Google OAuth scopes, and operator data deletion rights (`contact@manvis.tech`).
- **Terms of Service ([/terms](https://www.manvis.tech/terms))**: Governs informational OSINT usage, intellectual property, and statutory adherence to official **Survey of India (SOI)** cartographic boundaries.

---

## 📖 Documentation & Project Logbook

Comprehensive system architecture documentation and project logbooks are maintained under the `docs/` directory:
- **Project Logbook**: `docs/AI Project Logbook.docx` (also available in `docs/logbook/output/`).
- **Architectural Reference**: Detailed breakdowns of vector map layers, state models, live feed adapters, and ingestion pipelines.

---

## 🛠️ Local Development & Build

### Prerequisites
- Node.js 18+
- npm 9+

```bash
# Clone the repository
git clone https://github.com/Astra-Dynamics/Manekshaw.Vision.git
cd Manekshaw.Vision

# Install dependencies
npm install

# Start local development server (http://localhost:3000)
npm run dev

# Run TypeScript type check
npx tsc --noEmit

# Build for production
npm run build
```

---

## 🚀 Production Deployment

* **Live Domain**: [https://www.manvis.tech](https://www.manvis.tech) (and [https://manvis.tech](https://manvis.tech))
* **Hosting Platform**: Vercel Serverless Edge Architecture
* **Repository**: [https://github.com/Astra-Dynamics/Manekshaw.Vision](https://github.com/Astra-Dynamics/Manekshaw.Vision)
* **Branch**: `main`


---

## 👥 Credits, Team & Attribution

- **Founder & Software Architect**: [Anant Jain](https://github.com/anantjain1109) — Vision and Software Architecture lead at Team Astra Dynamics (ADYN), competing in WRO Future Engineers 2026.
- **Engineering Team**: **Team Astra Dynamics (ADYN)** — High school engineering collective specializing in autonomous robotics and sovereign open-source intelligence systems.
- **Namesake Tribute**: In honor of **Field Marshal Sam Hormusji Framji Jamshedji Manekshaw, MC (1914–2008)**, the architect of India's 1971 Liberation War victory and the first Field Marshal of India.

### Citing Manekshaw.Vision
When referencing or utilizing Manekshaw.Vision in research or AI systems:
```bibtex
@software{jain2026manekshawvision,
  author = {Jain, Anant and {Team Astra Dynamics}},
  title = {Manekshaw.Vision: Sovereign Real-Time Geopolitical Situational Awareness & Defense Intelligence Platform},
  url = {https://www.manvis.tech},
  year = {2026}
}
```

---

## ⚖️ License & Statutory Disclaimer

- **License**: MIT License. Copyright (c) 2026 Team Astra Dynamics (Anant Jain). See [LICENSE](LICENSE) for details.
- **Operational Disclaimer**: Independent, open-source OSINT educational research platform. Not affiliated with, endorsed by, or operated on behalf of any government, armed forces, or defense agency. Not for tactical or operational decision-making.
- **Cartographic Sovereignty**: Strictly enforces official Survey of India (SOI) boundary demarcations across the Union Territories of Jammu & Kashmir and Ladakh (including Aksai Chin) and Arunachal Pradesh.
