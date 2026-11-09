import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

if (!fs.existsSync(distDir)) {
  console.error('Error: dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const baseHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

// Find exact template split points
const rootOpen = '<div id="root">';
const bodyClose = '</body>';
const rootIndex = baseHtml.indexOf(rootOpen);
const bodyIndex = baseHtml.indexOf(bodyClose, rootIndex);
const rootCloseIndex = baseHtml.lastIndexOf('</div>', bodyIndex);

if (rootIndex === -1 || bodyIndex === -1 || rootCloseIndex === -1) {
  console.error('Error finding root split boundaries in baseHtml');
  process.exit(1);
}

const htmlBeforeRoot = baseHtml.slice(0, rootIndex);
const landingRootContent = baseHtml.slice(rootIndex, rootCloseIndex + 6);
const htmlAfterRoot = baseHtml.slice(rootCloseIndex + 6);

// Route metadata configurations (50-60 char titles, 120-160 char descriptions, route-specific static summaries)
const routes = [
  {
    path: '',
    dir: '',
    title: 'Manekshaw.Vision | Sovereign Defense Intelligence Dashboard',
    description: 'Sovereign defense intelligence & real-time situational awareness by Team Astra Dynamics. Honoring Field Marshal Sam Manekshaw with live OSINT telemetry.',
    h1: 'Manekshaw.Vision — Sovereign Defense Intelligence Dashboard',
    robots: 'index, follow',
    isLanding: true,
  },
  {
    path: 'dashboard',
    dir: 'dashboard',
    title: 'Tactical Operations Dashboard | Manekshaw.Vision Platform',
    description: 'Full-bleed MapLibre tactical workstation featuring 16 switchable intelligence layers, multi-theater matrix, and live OSINT telemetry feeds.',
    h1: 'Sovereign Tactical Operations & Situational Workstation',
    robots: 'index, follow',
    summary: `
      <main style="max-width:960px;margin:0 auto;padding:48px 24px;font-family:monospace;color:#e2e8f0;background:#06090e;min-height:100vh;">
        <header style="margin-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:24px;">
          <a href="/" style="color:#38bdf8;text-decoration:none;font-weight:700;font-size:14px;">← RETURN TO HOMEPAGE</a>
          <h1 style="font-size:28px;color:#fff;margin:16px 0 8px 0;letter-spacing:-0.01em;">Sovereign Tactical Operations & Situational Workstation</h1>
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0;">
            Interactive MapLibre GL defense intelligence workstation. Aggregates physical conflict frontlines, naval chokepoints, GNSS jamming zones, and critical infrastructure telemetry.
          </p>
        </header>
        <section style="margin-bottom:32px;">
          <h2 style="font-size:18px;color:#38bdf8;margin-bottom:12px;">Active Tactical Intelligence Capabilities</h2>
          <ul style="color:#cbd5e1;line-height:1.8;font-size:13px;">
            <li><strong>16 Geoint Layers:</strong> Kinetic conflicts, fortified frontiers (LoC, LAC, AGPL, DMZ), military bases, nuclear installations, ADIZ airspace corridors, and subsea cable outages.</li>
            <li><strong>Authoritative Cartography:</strong> 100% compliant with statutory Survey of India (SOI) demarcations for unbroken national borders.</li>
            <li><strong>Live Telemetry Feeds:</strong> Automated ingestion pipeline updating every 30 minutes with USGS seismic data, NASA EONET hazard events, and verified defense reporting.</li>
          </ul>
        </section>
        <footer style="margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);color:#64748b;font-size:11px;text-align:center;">
          Built by Team Astra Dynamics · Founded by Anant Jain · Dedicated to Field Marshal Sam Manekshaw
        </footer>
      </main>
    `,
  },
  {
    path: 'about',
    dir: 'about',
    title: 'About Manekshaw.Vision | Team Astra Dynamics & OSINT',
    description: 'Manekshaw.Vision was architected and built by Team Astra Dynamics, founded by Anant Jain. Sovereign OSINT situational awareness and cartographic intelligence.',
    h1: 'About Manekshaw.Vision — Builders, Vision & Methodology',
    robots: 'index, follow',
    summary: `
      <main style="max-width:960px;margin:0 auto;padding:48px 24px;font-family:sans-serif;color:#e2e8f0;background:#06090e;min-height:100vh;">
        <header style="margin-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:24px;">
          <a href="/" style="color:#38bdf8;text-decoration:none;font-weight:700;font-size:14px;font-family:monospace;">← MANEKSHAW.VISION HOME</a>
          <h1 style="font-size:32px;font-weight:800;color:#fff;margin:16px 0 8px 0;">About Manekshaw.Vision — Builders, Vision & Methodology</h1>
          <p style="color:#94a3b8;font-size:15px;line-height:1.6;margin:0;">
            Independent sovereign defense intelligence and situational awareness initiative architected and built by <strong>Team Astra Dynamics</strong>, founded by <strong>Anant Jain</strong>.
          </p>
        </header>

        <section id="team" style="margin-bottom:40px;">
          <h2 style="font-size:22px;color:#fff;margin-bottom:12px;">Team Astra Dynamics (ADYN)</h2>
          <p style="color:#cbd5e1;line-height:1.7;font-size:14px;">
            Team Astra Dynamics is a high school engineering collective competing in the international World Robot Olympiad (WRO) Future Engineers 2026. The team specializes in autonomous robotics, software architecture, and sovereign open-source situational awareness tools.
          </p>
        </section>

        <section id="founder" style="margin-bottom:40px;">
          <h2 style="font-size:22px;color:#fff;margin-bottom:12px;">Founder & Software Architect: Anant Jain</h2>
          <p style="color:#cbd5e1;line-height:1.7;font-size:14px;">
            Anant Jain is the Vision and Software Architecture lead at Team Astra Dynamics and founder of Manekshaw.Vision. He designed the platform's multi-tab tactical canvas, Survey of India cartographic pipeline, and automated GitHub Actions ingestion workflows.
          </p>
          <p style="margin-top:8px;">
            <a href="https://github.com/anantjain1109" style="color:#38bdf8;text-decoration:none;font-family:monospace;font-size:13px;">GitHub Profile: @anantjain1109 →</a>
          </p>
        </section>

        <section id="dedication" style="margin-bottom:40px;">
          <h2 style="font-size:22px;color:#f59e0b;margin-bottom:12px;">Dedication to Field Marshal Sir Sam Manekshaw, MC (1914–2008)</h2>
          <p style="color:#cbd5e1;line-height:1.7;font-size:14px;">
            The platform is named in proud dedication to Field Marshal Sam Manekshaw, India's first Field Marshal and Chief of the Army Staff during the 1971 Liberation War. His legendary standard of professional competence, moral courage, and decisive leadership embodies the platform's sovereign mission.
          </p>
        </section>

        <section id="cartography" style="margin-bottom:40px;">
          <h2 style="font-size:22px;color:#fff;margin-bottom:12px;">Official Survey of India (SOI) Cartographic Standard</h2>
          <p style="color:#cbd5e1;line-height:1.7;font-size:14px;">
            Commercial map providers frequently alter Indian territorial borders into dashed or contested lines based on visitor IP geolocations. Manekshaw.Vision strictly enforces unbroken sovereign frontiers compliant with the statutory cartographic standards of the Survey of India across Jammu & Kashmir, Ladakh, and Arunachal Pradesh.
          </p>
        </section>

        <footer style="margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);color:#64748b;font-size:12px;font-family:monospace;text-align:center;">
          <p style="margin-bottom:8px;">Built by Team Astra Dynamics · Founded by Anant Jain</p>
          <p><a href="/dashboard" style="color:#38bdf8;text-decoration:none;">Launch Dashboard</a> • <a href="/privacy" style="color:#38bdf8;text-decoration:none;">Privacy</a> • <a href="/terms" style="color:#38bdf8;text-decoration:none;">Terms</a> • <a href="/status" style="color:#38bdf8;text-decoration:none;">Status</a></p>
        </footer>
      </main>
    `,
  },
  {
    path: 'privacy',
    dir: 'privacy',
    title: 'Privacy Policy | Manekshaw.Vision Sovereign Intelligence',
    description: 'Privacy Policy for Manekshaw.Vision, operated by Astra Dynamics. Zero-tracker policy, operational security, and strict data sovereignty protections.',
    h1: 'Privacy Policy — Manekshaw.Vision Operational Security',
    robots: 'index, follow',
    summary: `
      <main style="max-width:960px;margin:0 auto;padding:48px 24px;font-family:sans-serif;color:#e2e8f0;background:#06090e;min-height:100vh;">
        <header style="margin-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:24px;">
          <a href="/" style="color:#38bdf8;text-decoration:none;font-weight:700;font-size:14px;font-family:monospace;">← MANEKSHAW.VISION HOME</a>
          <h1 style="font-size:32px;font-weight:800;color:#fff;margin:16px 0 8px 0;">Privacy Policy — Manekshaw.Vision Operational Security</h1>
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0;">Effective Date: November 2026 • Platform: Manekshaw.Vision (manvis.tech) • Operated by Astra Dynamics</p>
        </header>

        <section style="margin-bottom:32px;">
          <h2 style="font-size:20px;color:#fff;margin-bottom:12px;">Zero Behavioral Tracking Standard</h2>
          <p style="color:#cbd5e1;line-height:1.7;font-size:14px;">
            Manekshaw.Vision does not use third-party behavioral advertising pixels (including Facebook Pixel, Google Ads, or commercial data brokers). We do not sell, monetize, or harvest user browsing data.
          </p>
        </section>

        <section style="margin-bottom:32px;">
          <h2 style="font-size:20px;color:#fff;margin-bottom:12px;">Data Sovereignty & Row Level Security (RLS)</h2>
          <p style="color:#cbd5e1;line-height:1.7;font-size:14px;">
            User profiles and authentication credentials are encrypted using industry-standard cryptography. PostgreSQL databases enforce strict Row Level Security (RLS), ensuring operators can access only their own saved workspaces.
          </p>
        </section>

        <footer style="margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);color:#64748b;font-size:12px;font-family:monospace;text-align:center;">
          Built by Team Astra Dynamics · Founded by Anant Jain · <a href="/terms" style="color:#38bdf8;text-decoration:none;">Terms of Service</a>
        </footer>
      </main>
    `,
  },
  {
    path: 'terms',
    dir: 'terms',
    title: 'Terms of Service | Manekshaw.Vision Tactical Platform',
    description: 'Terms of Service for Manekshaw.Vision. Survey of India (SOI) boundary compliance, acceptable operational use, and proprietary licensing standards.',
    h1: 'Terms of Service — Manekshaw.Vision Operating Guidelines',
    robots: 'index, follow',
    summary: `
      <main style="max-width:960px;margin:0 auto;padding:48px 24px;font-family:sans-serif;color:#e2e8f0;background:#06090e;min-height:100vh;">
        <header style="margin-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:24px;">
          <a href="/" style="color:#38bdf8;text-decoration:none;font-weight:700;font-size:14px;font-family:monospace;">← MANEKSHAW.VISION HOME</a>
          <h1 style="font-size:32px;font-weight:800;color:#fff;margin:16px 0 8px 0;">Terms of Service — Manekshaw.Vision Operating Guidelines</h1>
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0;">Effective Date: November 2026 • Platform: Manekshaw.Vision (manvis.tech) • Operated by Astra Dynamics</p>
        </header>

        <section style="margin-bottom:32px;">
          <h2 style="font-size:20px;color:#fff;margin-bottom:12px;">Sovereign Cartographic Integrity</h2>
          <p style="color:#cbd5e1;line-height:1.7;font-size:14px;">
            All territorial representations and boundary demarcations representing the Republic of India on Manekshaw.Vision strictly adhere to the cartographic boundaries mandated by the Survey of India (SOI).
          </p>
        </section>

        <section style="margin-bottom:32px;">
          <h2 style="font-size:20px;color:#fff;margin-bottom:12px;">Educational & Research Scope</h2>
          <p style="color:#cbd5e1;line-height:1.7;font-size:14px;">
            Manekshaw.Vision is an independent, non-commercial open-source research initiative. The platform aggregates public open-source intelligence (OSINT) and is not intended for operational or tactical military deployments.
          </p>
        </section>

        <footer style="margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);color:#64748b;font-size:12px;font-family:monospace;text-align:center;">
          Built by Team Astra Dynamics · Founded by Anant Jain · <a href="/privacy" style="color:#38bdf8;text-decoration:none;">Privacy Policy</a>
        </footer>
      </main>
    `,
  },
  {
    path: 'status',
    dir: 'status',
    title: 'System Status & Feeds | Manekshaw.Vision Telemetry',
    description: 'Real-time health telemetry for Manekshaw.Vision data feeds: USGS seismic, NASA EONET, GDACS, conflict zones, and sovereign ingestion pipelines.',
    h1: 'System Diagnostics & Telemetry Feed Health Monitor',
    robots: 'index, follow',
    summary: `
      <main style="max-width:960px;margin:0 auto;padding:48px 24px;font-family:monospace;color:#e2e8f0;background:#06090e;min-height:100vh;">
        <header style="margin-bottom:32px;border-bottom:1px solid rgba(255,255,255,0.08);padding-bottom:24px;">
          <a href="/" style="color:#38bdf8;text-decoration:none;font-weight:700;font-size:14px;">← MANEKSHAW.VISION HOME</a>
          <h1 style="font-size:28px;color:#fff;margin:16px 0 8px 0;">System Diagnostics & Telemetry Feed Health Monitor</h1>
          <p style="color:#94a3b8;font-size:14px;line-height:1.6;margin:0;">Real-time API telemetry, latency diagnostics, and feed status monitoring.</p>
        </header>

        <section style="margin-bottom:32px;">
          <h2 style="font-size:18px;color:#38bdf8;margin-bottom:12px;">Active Pipeline Sensors</h2>
          <ul style="color:#cbd5e1;line-height:1.8;font-size:13px;">
            <li><strong>USGS Real-Time Seismic Telemetry:</strong> Operational (M4.5+ earthquake alerts, focal depth tracking).</li>
            <li><strong>NASA EONET Natural Hazards:</strong> Operational (Wildfires, severe storms, volcanic ash advisories).</li>
            <li><strong>Ingest Ingestion Pipeline:</strong> Operational (30-minute automated GitHub Actions workflow).</li>
            <li><strong>Survey of India Basemaps:</strong> Operational (Carto / OpenStreetMap unbroken sovereign vector tiles).</li>
          </ul>
        </section>

        <footer style="margin-top:48px;padding-top:24px;border-top:1px solid rgba(255,255,255,0.08);color:#64748b;font-size:11px;text-align:center;">
          Built by Team Astra Dynamics · Founded by Anant Jain · <a href="/dashboard" style="color:#38bdf8;text-decoration:none;">Dashboard</a>
        </footer>
      </main>
    `,
  },
  {
    path: 'login',
    dir: 'login',
    title: 'Operator Login | Manekshaw.Vision Secure Access',
    description: 'Secure operator authentication portal for the Manekshaw.Vision defense situational awareness workstation.',
    h1: 'Operator Authentication & Workspace Access Portal',
    robots: 'noindex, follow',
    summary: `
      <main style="max-width:480px;margin:80px auto;padding:32px 24px;font-family:monospace;color:#e2e8f0;background:#0a0e17;border:1px solid rgba(56,189,248,0.25);border-radius:4px;text-align:center;">
        <h1 style="font-size:20px;color:#fff;margin-bottom:8px;">Operator Authentication & Workspace Access</h1>
        <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin-bottom:24px;">Sign in with your operator credentials or authenticated OAuth provider.</p>
        <p><a href="/" style="color:#38bdf8;text-decoration:none;font-size:13px;">← Return to Homepage</a> • <a href="/signup" style="color:#38bdf8;text-decoration:none;font-size:13px;">Register Operator</a></p>
      </main>
    `,
  },
  {
    path: 'signup',
    dir: 'signup',
    title: 'Operator Registration | Manekshaw.Vision Access',
    description: 'Request operator credentials for the Manekshaw.Vision defense situational awareness workstation.',
    h1: 'Operator Registration & Clearance Portal',
    robots: 'noindex, follow',
    summary: `
      <main style="max-width:480px;margin:80px auto;padding:32px 24px;font-family:monospace;color:#e2e8f0;background:#0a0e17;border:1px solid rgba(56,189,248,0.25);border-radius:4px;text-align:center;">
        <h1 style="font-size:20px;color:#fff;margin-bottom:8px;">Operator Registration & Clearance Portal</h1>
        <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin-bottom:24px;">Create an operator account to save multi-tab workstation configurations.</p>
        <p><a href="/" style="color:#38bdf8;text-decoration:none;font-size:13px;">← Return to Homepage</a> • <a href="/login" style="color:#38bdf8;text-decoration:none;font-size:13px;">Sign In</a></p>
      </main>
    `,
  },
];

console.log('Generating route-specific HTML files in dist/...');

for (const route of routes) {
  const rootContent = route.isLanding
    ? landingRootContent
    : `<div id="root">\n${route.summary.trim()}\n    </div>`;

  let html = htmlBeforeRoot + rootContent + htmlAfterRoot;

  // 1. Replace Title
  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${route.title}</title>`);

  // 2. Replace Description
  html = html.replace(
    /<meta name="description" content="[\s\S]*?" \/>/i,
    `<meta name="description" content="${route.description}" />`
  );

  // 3. Replace Canonical
  const canonicalUrl = route.path ? `https://www.manvis.tech/${route.path}` : 'https://www.manvis.tech/';
  html = html.replace(
    /<link rel="canonical" href="[\s\S]*?" \/>/i,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  // 4. Replace Robots
  html = html.replace(
    /<meta name="robots" content="[\s\S]*?" \/>/i,
    `<meta name="robots" content="${route.robots}" />`
  );

  // 5. Replace Open Graph tags
  html = html.replace(
    /<meta property="og:title" content="[\s\S]*?" \/>/i,
    `<meta property="og:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta property="og:description" content="[\s\S]*?" \/>/i,
    `<meta property="og:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta property="og:url" content="[\s\S]*?" \/>/i,
    `<meta property="og:url" content="${canonicalUrl}" />`
  );

  // 6. Replace Twitter tags
  html = html.replace(
    /<meta name="twitter:title" content="[\s\S]*?" \/>/i,
    `<meta name="twitter:title" content="${route.title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[\s\S]*?" \/>/i,
    `<meta name="twitter:description" content="${route.description}" />`
  );
  html = html.replace(
    /<meta name="twitter:url" content="[\s\S]*?" \/>/i,
    `<meta name="twitter:url" content="${canonicalUrl}" />`
  );

  // Determine output path
  let targetPath;
  if (!route.dir) {
    targetPath = path.join(distDir, 'index.html');
  } else {
    const targetDir = path.join(distDir, route.dir);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }
    targetPath = path.join(targetDir, 'index.html');
  }

  fs.writeFileSync(targetPath, html, 'utf8');
  console.log(` Emitted ${targetPath.replace(distDir, 'dist')} (Title: "${route.title}" [${route.title.length} chars])`);
}

// 8. Generate real 404.html in dist
const notFoundRoot = `<div id="root">
      <main style="max-width:540px;margin:100px auto;padding:40px 24px;font-family:monospace;color:#e2e8f0;background:#090e17;border:1px solid rgba(244,63,94,0.3);border-radius:4px;text-align:center;">
        <span style="display:inline-block;padding:3px 8px;border-radius:2px;background:rgba(244,63,94,0.15);border:1px solid rgba(244,63,94,0.3);color:#fb7185;font-size:11px;font-weight:700;margin-bottom:16px;">
          ERROR 404 // SECTOR NOT FOUND
        </span>
        <h1 style="font-size:24px;color:#fff;margin-bottom:8px;">Target Coordinate Does Not Exist</h1>
        <p style="color:#94a3b8;font-size:13px;line-height:1.6;margin-bottom:24px;">The tactical sector, stream, or dossier URL you requested is not mapped in the global intelligence database.</p>
        <p>
          <a href="/" style="display:inline-block;padding:10px 20px;background:#0ea5e9;color:#020617;font-weight:700;text-decoration:none;border-radius:3px;font-size:12px;letter-spacing:0.05em;margin-right:8px;">RETURN TO HOMEPAGE</a>
          <a href="/dashboard" style="display:inline-block;padding:10px 20px;border:1px solid rgba(255,255,255,0.2);color:#38bdf8;font-weight:700;text-decoration:none;border-radius:3px;font-size:12px;letter-spacing:0.05em;">LAUNCH DASHBOARD</a>
        </p>
      </main>
    </div>`;

let notFoundHtml = htmlBeforeRoot + notFoundRoot + htmlAfterRoot;
notFoundHtml = notFoundHtml
  .replace(/<title>[\s\S]*?<\/title>/i, '<title>404 - Sector Not Found | Manekshaw.Vision</title>')
  .replace(/<meta name="description" content="[\s\S]*?" \/>/i, '<meta name="description" content="The requested sector or intelligence coordinate does not exist. Return to Manekshaw.Vision." />')
  .replace(/<meta name="robots" content="[\s\S]*?" \/>/i, '<meta name="robots" content="noindex, nofollow" />');

fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');
console.log(' Emitted dist/404.html (Dedicated 404 handler with noindex, nofollow)');

console.log('All per-route HTML files successfully generated!');
