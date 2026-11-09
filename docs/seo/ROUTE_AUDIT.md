# Per-Route Raw HTML Audit (Pass 3: Verify, Fix and Prove)
**Generated:** 2026-11-09T08:02:00.867Z  
**Method:** Raw HTTP GET via Node.js `fetch` with zero JavaScript execution against compiled `dist/` build output.  
**Server Environment:** Local Preview Server emulating Vercel cleanUrls, static route routing, and permanent redirects.

---

## Executive Summary
Every indexable route now emits an independent, route-specific static HTML document at build time with:
1. Title tag calibrated to 50–60 characters.
2. Meta description calibrated to 120–160 characters.
3. Canonical URL matching the route path (`https://www.manvis.tech/<route>`).
4. Matched Open Graph and Twitter card tags.
5. `noindex, follow` on sensitive operator auth endpoints (`/login`, `/signup`) without blocking crawler visibility.
6. Route-appropriate static fallback content inside `#root` (Landing page content appears **ONLY on `/`**).
7. Non-canonical duplicates (`/methodology`, `/Dashboard`) return permanent `301 Moved Permanently` redirects.
8. Unknown routes return a genuine `404 Not Found` with dedicated `404.html` markup.

---

## Comprehensive Audit Table

| Route | HTTP | Title Tag (Chars) | Canonical URL | Robots Meta | Route Static #root Match |
| :--- | :---: | :--- | :--- | :--- | :---: |
| `/` | **200** | Manekshaw.Vision | Sovereign Defense Intelligence Dashboard (59c) | `https://www.manvis.tech/` | `index, follow` | **YES (Landing only)** |
| `/about` | **200** | About Manekshaw.Vision | Team Astra Dynamics & OSINT (52c) | `https://www.manvis.tech/about` | `index, follow` | **YES (About only)** |
| `/methodology` | **301** | [301 Moved -> /about] (21c) | `N/A` | `N/A` | **301 Redirect -> /about** |
| `/privacy` | **200** | Privacy Policy | Manekshaw.Vision Sovereign Intelligence (56c) | `https://www.manvis.tech/privacy` | `index, follow` | **YES (Privacy only)** |
| `/terms` | **200** | Terms of Service | Manekshaw.Vision Tactical Platform (53c) | `https://www.manvis.tech/terms` | `index, follow` | **YES (Terms only)** |
| `/status` | **200** | System Status & Feeds | Manekshaw.Vision Telemetry (50c) | `https://www.manvis.tech/status` | `index, follow` | **YES (Status only)** |
| `/dashboard` | **200** | Tactical Operations Dashboard | Manekshaw.Vision Platform (57c) | `https://www.manvis.tech/dashboard` | `index, follow` | **YES (Dashboard only)** |
| `/login` | **200** | Operator Login | Manekshaw.Vision Secure Access (47c) | `https://www.manvis.tech/login` | `noindex, follow` | **YES (Login only)** |
| `/signup` | **200** | Operator Registration | Manekshaw.Vision Access (47c) | `https://www.manvis.tech/signup` | `noindex, follow` | **YES (Signup only)** |
| `/unknown-sector-404` | **404** | 404 - Sector Not Found | Manekshaw.Vision (41c) | `https://www.manvis.tech/` | `noindex, nofollow` | **YES (404 Fallback)** |

---

## Detailed Route Analysis

### Route: `/`
- **HTTP Status:** `200`
- **Title Tag:** `Manekshaw.Vision | Sovereign Defense Intelligence Dashboard` (59 characters)
- **Meta Description:** `Sovereign defense intelligence & real-time situational awareness by Team Astra Dynamics. Honoring Field Marshal Sam Manekshaw with live OSINT telemetry.` (152 characters)
- **Canonical URL:** `https://www.manvis.tech/`
- **Open Graph URL:** `https://www.manvis.tech/`
- **Open Graph Image:** `https://www.manvis.tech/og-image.png`
- **H1 Header:** `Manekshaw.Vision — Sovereign Defense Intelligence Dashboard`
- **Robots Directive:** `index, follow`
- **Static #root Match:** **YES (Landing only)**

### Route: `/about`
- **HTTP Status:** `200`
- **Title Tag:** `About Manekshaw.Vision | Team Astra Dynamics & OSINT` (52 characters)
- **Meta Description:** `Manekshaw.Vision was architected and built by Team Astra Dynamics, founded by Anant Jain. Sovereign OSINT situational awareness and cartographic intelligence.` (158 characters)
- **Canonical URL:** `https://www.manvis.tech/about`
- **Open Graph URL:** `https://www.manvis.tech/about`
- **Open Graph Image:** `https://www.manvis.tech/og-image.png`
- **H1 Header:** `About Manekshaw.Vision — Builders, Vision & Methodology`
- **Robots Directive:** `index, follow`
- **Static #root Match:** **YES (About only)**

### Route: `/methodology`
- **HTTP Status:** `301`
- **Title Tag:** `[301 Moved -> /about]` (21 characters)
- **Meta Description:** `N/A` (0 characters)
- **Canonical URL:** `N/A`
- **Open Graph URL:** `N/A`
- **Open Graph Image:** `N/A`
- **H1 Header:** `N/A`
- **Robots Directive:** `N/A`
- **Static #root Match:** **301 Redirect -> /about**

### Route: `/privacy`
- **HTTP Status:** `200`
- **Title Tag:** `Privacy Policy | Manekshaw.Vision Sovereign Intelligence` (56 characters)
- **Meta Description:** `Privacy Policy for Manekshaw.Vision, operated by Astra Dynamics. Zero-tracker policy, operational security, and strict data sovereignty protections.` (148 characters)
- **Canonical URL:** `https://www.manvis.tech/privacy`
- **Open Graph URL:** `https://www.manvis.tech/privacy`
- **Open Graph Image:** `https://www.manvis.tech/og-image.png`
- **H1 Header:** `Privacy Policy — Manekshaw.Vision Operational Security`
- **Robots Directive:** `index, follow`
- **Static #root Match:** **YES (Privacy only)**

### Route: `/terms`
- **HTTP Status:** `200`
- **Title Tag:** `Terms of Service | Manekshaw.Vision Tactical Platform` (53 characters)
- **Meta Description:** `Terms of Service for Manekshaw.Vision. Survey of India (SOI) boundary compliance, acceptable operational use, and proprietary licensing standards.` (146 characters)
- **Canonical URL:** `https://www.manvis.tech/terms`
- **Open Graph URL:** `https://www.manvis.tech/terms`
- **Open Graph Image:** `https://www.manvis.tech/og-image.png`
- **H1 Header:** `Terms of Service — Manekshaw.Vision Operating Guidelines`
- **Robots Directive:** `index, follow`
- **Static #root Match:** **YES (Terms only)**

### Route: `/status`
- **HTTP Status:** `200`
- **Title Tag:** `System Status & Feeds | Manekshaw.Vision Telemetry` (50 characters)
- **Meta Description:** `Real-time health telemetry for Manekshaw.Vision data feeds: USGS seismic, NASA EONET, GDACS, conflict zones, and sovereign ingestion pipelines.` (143 characters)
- **Canonical URL:** `https://www.manvis.tech/status`
- **Open Graph URL:** `https://www.manvis.tech/status`
- **Open Graph Image:** `https://www.manvis.tech/og-image.png`
- **H1 Header:** `System Diagnostics & Telemetry Feed Health Monitor`
- **Robots Directive:** `index, follow`
- **Static #root Match:** **YES (Status only)**

### Route: `/dashboard`
- **HTTP Status:** `200`
- **Title Tag:** `Tactical Operations Dashboard | Manekshaw.Vision Platform` (57 characters)
- **Meta Description:** `Full-bleed MapLibre tactical workstation featuring 16 switchable intelligence layers, multi-theater matrix, and live OSINT telemetry feeds.` (139 characters)
- **Canonical URL:** `https://www.manvis.tech/dashboard`
- **Open Graph URL:** `https://www.manvis.tech/dashboard`
- **Open Graph Image:** `https://www.manvis.tech/og-image.png`
- **H1 Header:** `Sovereign Tactical Operations & Situational Workstation`
- **Robots Directive:** `index, follow`
- **Static #root Match:** **YES (Dashboard only)**

### Route: `/login`
- **HTTP Status:** `200`
- **Title Tag:** `Operator Login | Manekshaw.Vision Secure Access` (47 characters)
- **Meta Description:** `Secure operator authentication portal for the Manekshaw.Vision defense situational awareness workstation.` (105 characters)
- **Canonical URL:** `https://www.manvis.tech/login`
- **Open Graph URL:** `https://www.manvis.tech/login`
- **Open Graph Image:** `https://www.manvis.tech/og-image.png`
- **H1 Header:** `Operator Authentication & Workspace Access`
- **Robots Directive:** `noindex, follow`
- **Static #root Match:** **YES (Login only)**

### Route: `/signup`
- **HTTP Status:** `200`
- **Title Tag:** `Operator Registration | Manekshaw.Vision Access` (47 characters)
- **Meta Description:** `Request operator credentials for the Manekshaw.Vision defense situational awareness workstation.` (96 characters)
- **Canonical URL:** `https://www.manvis.tech/signup`
- **Open Graph URL:** `https://www.manvis.tech/signup`
- **Open Graph Image:** `https://www.manvis.tech/og-image.png`
- **H1 Header:** `Operator Registration & Clearance Portal`
- **Robots Directive:** `noindex, follow`
- **Static #root Match:** **YES (Signup only)**

### Route: `/unknown-sector-404`
- **HTTP Status:** `404`
- **Title Tag:** `404 - Sector Not Found | Manekshaw.Vision` (41 characters)
- **Meta Description:** `The requested sector or intelligence coordinate does not exist. Return to Manekshaw.Vision.` (91 characters)
- **Canonical URL:** `https://www.manvis.tech/`
- **Open Graph URL:** `https://www.manvis.tech/`
- **Open Graph Image:** `https://www.manvis.tech/og-image.png`
- **H1 Header:** `Target Coordinate Does Not Exist`
- **Robots Directive:** `noindex, nofollow`
- **Static #root Match:** **YES (404 Fallback)**

