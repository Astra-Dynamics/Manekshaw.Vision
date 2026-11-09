# Manekshaw.Vision SEO, Performance & Web-Security Baseline
**Audit Date:** 9 November 2026  
**Audited Target:** `https://www.manvis.tech`  
**Repository:** `anantjain1109/Manekshaw.Vision` (`Astra-Dynamics/Manekshaw.Vision`)  
**Git Branch:** `seo-security-hardening`  

---

## 1. Initial SEOptimer & Field Audit Scores

| Category | Score / Grade | Key Flagged Items |
| :--- | :---: | :--- |
| **Overall** | **C+** | 21 total recommendations |
| **On-Page SEO** | **A** | Title tag 73 chars (exceeds 50-60 ideal); missing keyword consistency ("field marshal sam manekshaw", "team astra dynamics", "vision" in headings); missing Schema.org JSON-LD |
| **GEO / LLM Readability** | **C** | 1614% rendered-content ratio (content only present after client JS hydration); no `llms.txt` |
| **Links** | **F** | 0 external backlinks; only 3 internal links; 0 outbound attribution links to OSINT telemetry sources |
| **Usability** | **D** | Mobile header/top bar overflow at 360-390px (action buttons clipped); missing manifest & touch icons |
| **Performance** | **A** | Mobile PSI 86 (FCP 2.7s, LCP 2.7s); Desktop PSI 85 (LCP 2.0s); 2-hop redirect chain (1.05s delay); uncompressed images (0.77 MB); un-split JS bundle (2.3 MB uncompressed) |

---

## 2. Redirect Chain Diagnostic

Tested via `curl -ILs`:

1. `http://manvis.tech/`
   - **Hop 1:** `HTTP/1.1 308 Permanent Redirect` $\rightarrow$ `Location: https://manvis.tech/` (Cloudflare edge)
   - **Hop 2:** `HTTP/1.1 308 Permanent Redirect` $\rightarrow$ `Location: https://www.manvis.tech/` (Vercel edge)
   - **Hop 3:** `HTTP/1.1 200 OK` (Canonical production page)
   - *Issue:* 2 intermediate 308 redirects adding ~1.05s latency on mobile networks. Single-hop Cloudflare redirect rule required.

2. `https://manvis.tech/`
   - **Hop 1:** `HTTP/1.1 308 Permanent Redirect` $\rightarrow$ `Location: https://www.manvis.tech/`
   - **Hop 2:** `HTTP/1.1 200 OK`

3. `https://www.manvis.tech/`
   - **Direct:** `HTTP/1.1 200 OK` (Single hop, 0ms redirect penalty)

---

## 3. Initial Bundle Composition

Pre-optimization build stats:
- **`dist/assets/index.js`**: 2,297.40 kB (659.77 kB gzip) — monolithic chunk containing React, MapLibre GL, Supabase, Lucide, and all telemetry data.
- **`dist/assets/index.css`**: 210.98 kB (30.90 kB gzip).
- **Public Images**: 1.4 MB uncompressed (e.g., `screenshot.png` @ 610 kB, `logo.jpg` @ 49 kB, favicons @ 84 kB).
- **Render-blocking CSS**: Google Fonts stylesheet link in `<head>` (`fonts.googleapis.com` + `fonts.gstatic.com`).

---

## 4. Security & Secret Recon

1. **Client Bundle Scan**:
   - `dist/*.js` searched for API keys, bearer tokens, service role keys, and private tokens.
   - Result: **0 exposed secrets**.
   - `YOUTUBE_API_KEY` is strictly confined to server-side routes (`api/yt-live.ts` and dev middleware). No `VITE_YOUTUBE_API_KEY` is bundled to client.
   - `VITE_SUPABASE_ANON_KEY` and `VITE_SUPABASE_URL` are public anonymous identifiers used strictly for client-side auth.

2. **Environment Files**:
   - `.env` and `.env.*` verified gitignored in `.gitignore`.
   - `.env.local` untracked and never committed.

3. **Dependency Vulnerability Scan (`npm audit`)**:
   - 1 critical severity report on `maplibre-gl <=6.4.0` (GHSA-jrc7-96c5-q579 DOM sanitize bypass).
   - Upgrading from v5.1.0 to v6.x is a major breaking change that risks breaking custom WebGL tile rendering, vector layer styles, and SOI territorial boundaries. Per non-negotiable stability rules, version 5.1.0 is preserved with strict sanitization safeguards.

4. **GitHub Actions Usage & Quota Audit**:
   - Repository `Astra-Dynamics/Manekshaw.Vision` is **public** (`"private": false`).
   - GitHub Actions minutes on public repositories are **100% free and unlimited**.
   - Scheduled telemetry ingest (`ingest-intel.yml`) runs every 30 minutes (48 runs/day $\approx$ 1,440 runs/month). Each run takes ~20 seconds ($\approx$ 475 minutes/month), safely well within any free quota even if the repo were ever made private (2,000 min allowance).
