import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import { spawn, ChildProcess } from 'child_process';
import { extractMapLibreStyleAndPaint, freezeAnimationsAndSettle } from '../tests/visual/helpers';

async function isServerRunning(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function waitForServer(url: string, timeoutMs: number = 30000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerRunning(url)) return;
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server did not respond at ${url} within ${timeoutMs}ms`);
}

async function verifyDarkMapInvariance() {
  console.log('================================================================');
  console.log('  MANEKSHAW.VISION // DARK MAP STYLE INVARIANCE VERIFIER');
  console.log('================================================================\n');

  const baselinePath = path.resolve('tests/visual/baseline/dark-map-style.json');
  if (!fs.existsSync(baselinePath)) {
    console.error('[FAIL] Baseline dark map style JSON does not exist at:', baselinePath);
    process.exit(1);
  }

  let devProcess: ChildProcess | null = null;
  const serverRunning = await isServerRunning('http://localhost:3000');

  if (!serverRunning) {
    console.log('[INFO] Spawning local Vite dev server (port 3000)...');
    devProcess = spawn('npm', ['run', 'dev', '--', '--no-open'], {
      shell: true,
      stdio: 'ignore'
    });
    await waitForServer('http://localhost:3000', 30000);
    console.log('[INFO] Vite dev server ready.');
  }

  try {
    console.log('[INFO] Launching headless browser to capture live dark map style...');
    const browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

    await page.goto('http://localhost:3000/Dashboard', { timeout: 30000 });
    await page.evaluate(() => {
      localStorage.setItem('manvis_theme', 'dark');
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
    });
    await page.reload();
    await freezeAnimationsAndSettle(page);

    const currentData = await extractMapLibreStyleAndPaint(page);
    await browser.close();

    const baselineRaw = fs.readFileSync(baselinePath, 'utf-8');
    const currentRaw = JSON.stringify(currentData, null, 2);

    if (baselineRaw === currentRaw) {
      console.log('[PASS] Dark map style object and paint properties are 100% BYTE-FOR-BYTE IDENTICAL.');
      console.log(`       Verified sources: ${currentData.sources.length}, layers: ${currentData.layers.length}`);
      if (devProcess) {
        devProcess.kill();
      }
      process.exit(0);
    } else {
      console.error('[FAIL] Dark map style or paint properties have mutated!');
      const actualPath = path.resolve('tests/visual/actual-dark-map-style.json');
      fs.writeFileSync(actualPath, currentRaw, 'utf-8');
      console.error(`       Actual mutated style written to: ${actualPath}`);
      if (devProcess) {
        devProcess.kill();
      }
      process.exit(1);
    }
  } catch (err) {
    console.error('[ERROR] Verification failed:', err);
    if (devProcess) {
      devProcess.kill();
    }
    process.exit(1);
  }
}

verifyDarkMapInvariance().catch((err) => {
  console.error('[ERROR] Unexpected failure:', err);
  process.exit(1);
});
