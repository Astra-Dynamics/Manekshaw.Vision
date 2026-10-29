import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { freezeAnimationsAndSettle } from './helpers';

test.describe('Step 4: Light Mode Before/After Capture', () => {
  const mode = process.env.CAPTURE_MODE || 'before'; // 'before' or 'after'
  const outDir = path.resolve(`tests/visual/${mode}/screenshots/light`);

  test.beforeAll(() => {
    fs.mkdirSync(outDir, { recursive: true });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto('/Dashboard');
    await page.evaluate(() => {
      localStorage.setItem('manvis_theme', 'light');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-theme');
    });
    await page.reload();
    await freezeAnimationsAndSettle(page);
  });

  test('Capture light mode panels and South Asia zoom levels', async ({ page }) => {
    // 1. Dashboard
    await page.screenshot({ path: path.join(outDir, '01-light-dashboard.png') });

    // 2. Feed
    await page.screenshot({ path: path.join(outDir, '02-light-feed.png') });

    // 3. Videos
    await page.getByRole('button', { name: 'Videos' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '03-light-videos.png') });

    // 4. Hotspots
    await page.getByRole('button', { name: 'Hotspots' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '04-light-hotspots.png') });

    // 5. Wars
    await page.getByRole('button', { name: 'Wars' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '05-light-wars.png') });

    // 6. Assets
    await page.getByRole('button', { name: 'Assets' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '06-light-assets.png') });

    // 7. Dossier
    await page.getByRole('button', { name: 'Hotspots' }).click();
    await page.waitForTimeout(400);
    const card = page.locator('.palantir-feed-card').first();
    if (await card.count() > 0) {
      await card.click();
    }
    await page.getByRole('button', { name: 'Dossier' }).click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(outDir, '07-light-dossier.png') });

    // 8. Map Zoom 2 over South Asia
    await page.goto('/Dashboard?c=25.06,86.35,2');
    await page.evaluate(() => {
      localStorage.setItem('manvis_theme', 'light');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-theme');
    });
    await freezeAnimationsAndSettle(page);
    await page.screenshot({ path: path.join(outDir, '08-light-map-zoom-2.png') });

    // 9. Map Zoom 4 over South Asia
    await page.goto('/Dashboard?c=25.06,86.35,4');
    await page.evaluate(() => {
      localStorage.setItem('manvis_theme', 'light');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-theme');
    });
    await freezeAnimationsAndSettle(page);
    await page.screenshot({ path: path.join(outDir, '09-light-map-zoom-4.png') });

    // 10. Map Zoom 6 over South Asia
    await page.goto('/Dashboard?c=25.06,86.35,6');
    await page.evaluate(() => {
      localStorage.setItem('manvis_theme', 'light');
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark-theme');
    });
    await freezeAnimationsAndSettle(page);
    await page.screenshot({ path: path.join(outDir, '10-light-map-zoom-6.png') });

    // Verify all 10 files exist
    const expectedFiles = [
      '01-light-dashboard.png',
      '02-light-feed.png',
      '03-light-videos.png',
      '04-light-hotspots.png',
      '05-light-wars.png',
      '06-light-assets.png',
      '07-light-dossier.png',
      '08-light-map-zoom-2.png',
      '09-light-map-zoom-4.png',
      '10-light-map-zoom-6.png'
    ];
    for (const f of expectedFiles) {
      expect(fs.existsSync(path.join(outDir, f))).toBeTruthy();
    }
    console.log(`[PASS] Captured all 10 light mode (${mode}) screenshots in ${outDir}`);
  });
});
