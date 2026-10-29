import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { freezeAnimationsAndSettle, extractMapLibreStyleAndPaint, showMapPopup } from './helpers';

test.describe('Step 1: Dark Mode Baseline Capture', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Dashboard');
    // Ensure dark mode is active
    await page.evaluate(() => {
      localStorage.setItem('manvis_theme', 'dark');
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
    });
    await page.reload();
    await freezeAnimationsAndSettle(page);
  });

  test('1.1 Dump dark map style & paint JSON', async ({ page }) => {
    const data = await extractMapLibreStyleAndPaint(page);
    const dumpPath = path.resolve('tests/visual/baseline/dark-map-style.json');
    fs.mkdirSync(path.dirname(dumpPath), { recursive: true });
    fs.writeFileSync(dumpPath, JSON.stringify(data, null, 2), 'utf-8');

    expect(fs.existsSync(dumpPath)).toBeTruthy();
    expect(data.sources.length).toBeGreaterThan(0);
    expect(data.layers.length).toBeGreaterThan(0);
    expect(Object.keys(data.paintProperties).length).toBeGreaterThan(0);
    console.log(`[PASS] Dumped dark map style JSON with ${data.sources.length} sources and ${data.layers.length} layers to ${dumpPath}`);
  });

  test('1.2 Capture 9 baseline dark screenshots', async ({ page }) => {
    const baseDir = path.resolve('tests/visual/baseline/screenshots/dark');
    fs.mkdirSync(baseDir, { recursive: true });

    // 1. Dashboard
    await page.screenshot({ path: path.join(baseDir, '01-dashboard.png') });

    // 2. Feed Tab (default active tab)
    await page.screenshot({ path: path.join(baseDir, '02-feed.png') });

    // 3. Videos Tab
    await page.getByRole('button', { name: 'Videos' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(baseDir, '03-videos.png') });

    // 4. Hotspots Tab
    await page.getByRole('button', { name: 'Hotspots' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(baseDir, '04-hotspots.png') });

    // 5. Wars Tab
    await page.getByRole('button', { name: 'Wars' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(baseDir, '05-wars.png') });

    // 6. Assets Tab
    await page.getByRole('button', { name: 'Assets' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(baseDir, '06-assets.png') });

    // 7. Dossier Tab (select a feature first to populate dossier)
    await page.getByRole('button', { name: 'Hotspots' }).click();
    await page.waitForTimeout(400);
    const hotspotCard = page.locator('.palantir-feed-card').first();
    if (await hotspotCard.count() > 0) {
      await hotspotCard.click();
    }
    await page.getByRole('button', { name: 'Dossier' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(baseDir, '07-dossier.png') });

    // 8. Map Popup
    await showMapPopup(page);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(baseDir, '08-popup.png') });

    // 9. Tactical Layers (focus on the dock)
    await page.screenshot({ path: path.join(baseDir, '09-tactical-layers.png') });

    // Verify all 9 files exist
    const expectedFiles = [
      '01-dashboard.png',
      '02-feed.png',
      '03-videos.png',
      '04-hotspots.png',
      '05-wars.png',
      '06-assets.png',
      '07-dossier.png',
      '08-popup.png',
      '09-tactical-layers.png'
    ];
    for (const f of expectedFiles) {
      expect(fs.existsSync(path.join(baseDir, f))).toBeTruthy();
    }
    console.log(`[PASS] Captured all 9 dark mode baseline screenshots in ${baseDir}`);
  });
});
