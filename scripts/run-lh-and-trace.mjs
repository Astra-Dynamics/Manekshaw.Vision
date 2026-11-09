import { spawn, execSync } from 'child_process';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

process.env.CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

async function main() {
  console.log('=== Step 1: Starting Vite Preview Server on port 4173 ===');
  const preview = spawn('npx', ['vite', 'preview', '--port', '4173'], {
    shell: true,
    cwd: process.cwd(),
    stdio: 'inherit'
  });

  // Wait for port 4173 to be ready
  let ready = false;
  for (let i = 0; i < 30; i++) {
    try {
      await new Promise((resolve, reject) => {
        const req = http.get('http://localhost:4173/', (res) => {
          if (res.statusCode === 200) resolve();
          else reject(new Error('Status: ' + res.statusCode));
        });
        req.on('error', reject);
        req.end();
      });
      ready = true;
      break;
    } catch {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  if (!ready) {
    console.error('Preview server failed to start!');
    preview.kill();
    process.exit(1);
  }
  console.log('Preview server ready at http://localhost:4173/');

  console.log('\n=== Step 2: Running Network Trace with Playwright ===');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const requests = [];
  page.on('response', async (response) => {
    try {
      const url = response.url();
      const status = response.status();
      const headers = response.headers();
      const contentType = headers['content-type'] || '';
      let bodySize = 0;
      try {
        const buf = await response.body();
        bodySize = buf.length;
      } catch {}
      requests.push({ url, status, contentType, size: bodySize });
    } catch {}
  });

  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

  console.log('\n--- Landing Page First Paint Network Breakdown ---');
  let totalTransfer = 0;
  let jsTransfer = 0;
  let cssTransfer = 0;
  let fontTransfer = 0;
  let imgTransfer = 0;
  const jsChunks = [];

  for (const r of requests) {
    totalTransfer += r.size;
    const basename = r.url.split('/').pop().split('?')[0];
    if (r.url.endsWith('.js') || r.contentType.includes('javascript')) {
      jsTransfer += r.size;
      jsChunks.push({ name: basename, size: (r.size / 1024).toFixed(2) + ' KB' });
    } else if (r.url.endsWith('.css') || r.contentType.includes('css')) {
      cssTransfer += r.size;
    } else if (r.url.endsWith('.woff2') || r.url.endsWith('.woff')) {
      fontTransfer += r.size;
    } else if (/\.(png|webp|jpg|svg|ico)$/i.test(r.url)) {
      imgTransfer += r.size;
    }
  }

  console.log(`Total Transferred: ${(totalTransfer / 1024).toFixed(2)} KB`);
  console.log(`JS Transferred: ${(jsTransfer / 1024).toFixed(2)} KB`);
  console.log(`CSS Transferred: ${(cssTransfer / 1024).toFixed(2)} KB`);
  console.log(`Font Transferred: ${(fontTransfer / 1024).toFixed(2)} KB`);
  console.log(`Images/Icons Transferred: ${(imgTransfer / 1024).toFixed(2)} KB`);
  console.log('\nLoaded JS Chunks on Landing Page:');
  jsChunks.forEach(c => console.log(`  - ${c.name} (${c.size})`));

  // Verify heavy chunks are NOT loaded
  const forbiddenChunks = ['vendor-maplibre', 'data-geoint', 'IntelWorkspaceDrawer', 'MapComponent'];
  const leakedChunks = jsChunks.filter(c => forbiddenChunks.some(f => c.name.includes(f)));
  if (leakedChunks.length > 0) {
    console.error('WARNING: Heavy chunks leaked on landing page:', leakedChunks);
  } else {
    console.log('\n✓ VERIFIED: Zero heavy GIS/dashboard chunks loaded on landing page!');
  }

  await browser.close();

  console.log('\n=== Step 3: Running Lighthouse CLI (Mobile) ===');
  const mobileJsonPath = path.resolve('scripts/lh-mobile.json');
  try {
    execSync(`npx lighthouse http://localhost:4173/ --chrome-flags="--headless" --output=json --output-path="${mobileJsonPath}" --quiet`, {
      stdio: 'inherit',
      env: { ...process.env, CHROME_PATH: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" }
    });
    console.log('Mobile Lighthouse audit completed!');
  } catch (err) {
    console.error('Error running mobile lighthouse:', err.message);
  }

  console.log('\n=== Step 4: Running Lighthouse CLI (Desktop) ===');
  const desktopJsonPath = path.resolve('scripts/lh-desktop.json');
  try {
    execSync(`npx lighthouse http://localhost:4173/ --preset=desktop --chrome-flags="--headless" --output=json --output-path="${desktopJsonPath}" --quiet`, {
      stdio: 'inherit',
      env: { ...process.env, CHROME_PATH: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" }
    });
    console.log('Desktop Lighthouse audit completed!');
  } catch (err) {
    console.error('Error running desktop lighthouse:', err.message);
  }

  // Parse results
  const parseLh = (filePath) => {
    if (!fs.existsSync(filePath)) return null;
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return {
      performance: Math.round((data.categories.performance?.score || 0) * 100),
      accessibility: Math.round((data.categories.accessibility?.score || 0) * 100),
      bestPractices: Math.round((data.categories['best-practices']?.score || 0) * 100),
      seo: Math.round((data.categories.seo?.score || 0) * 100),
      fcp: data.audits['first-contentful-paint']?.displayValue,
      lcp: data.audits['largest-contentful-paint']?.displayValue,
      cls: data.audits['cumulative-layout-shift']?.displayValue,
      tbt: data.audits['total-blocking-time']?.displayValue,
      tti: data.audits['interactive']?.displayValue,
      speedIndex: data.audits['speed-index']?.displayValue,
      totalByteWeight: data.audits['total-byte-weight']?.displayValue
    };
  };

  const mobileRes = parseLh(mobileJsonPath);
  const desktopRes = parseLh(desktopJsonPath);

  console.log('\n=== LIGHTHOUSE AUDIT RESULTS ===');
  console.log('Mobile:', mobileRes);
  console.log('Desktop:', desktopRes);

  // Kill preview server
  preview.kill();

  // Save report
  const summary = {
    timestamp: new Date().toISOString(),
    networkTrace: {
      totalTransferKB: (totalTransfer / 1024).toFixed(2),
      jsTransferKB: (jsTransfer / 1024).toFixed(2),
      cssTransferKB: (cssTransfer / 1024).toFixed(2),
      fontTransferKB: (fontTransfer / 1024).toFixed(2),
      imgTransferKB: (imgTransfer / 1024).toFixed(2),
      jsChunks
    },
    mobile: mobileRes,
    desktop: desktopRes
  };

  fs.writeFileSync('scripts/lh-summary.json', JSON.stringify(summary, null, 2), 'utf8');
  console.log('\nSummary saved to scripts/lh-summary.json');
  process.exit(0);
}

main().catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});
