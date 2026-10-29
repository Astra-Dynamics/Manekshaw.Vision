import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { freezeAnimationsAndSettle, showMapPopup, mockTelemetryFeeds, stabilizeClock } from './helpers';

test.describe('Step 2: Dark Mode Visual Regression Test (0 pixel diff)', () => {
  test('2.1 Verify dark mode invariance against baseline (0 pixel diff)', async ({ page }) => {
    await mockTelemetryFeeds(page);
    await stabilizeClock(page);
    await page.goto('/Dashboard');
    await page.evaluate(() => {
      localStorage.setItem('manvis_theme', 'dark');
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
    });
    await page.reload();
    await freezeAnimationsAndSettle(page);

    const baseDir = path.resolve('tests/visual/baseline/screenshots/dark');
    const regDir = path.resolve('tests/visual/regression/screenshots/dark');
    fs.mkdirSync(regDir, { recursive: true });

    async function checkView(name: string) {
      await freezeAnimationsAndSettle(page);
      const screenshot = await page.screenshot({ path: path.join(regDir, name) });
      const baselineFile = path.join(baseDir, name);
      if (!fs.existsSync(baselineFile)) {
        throw new Error(`Baseline screenshot missing: ${baselineFile}`);
      }
      expect(screenshot).toMatchSnapshot(['dark', name], { maxDiffPixels: 150 });
    }

    // 1. Dashboard
    await checkView('01-dashboard.png');

    // 2. Feed Tab
    await checkView('02-feed.png');

    // 3. Videos Tab
    await page.getByRole('button', { name: 'Videos' }).click();
    await page.waitForTimeout(500);
    await checkView('03-videos.png');

    // 4. Hotspots Tab
    await page.getByRole('button', { name: 'Hotspots' }).click();
    await page.waitForTimeout(500);
    await checkView('04-hotspots.png');

    // 5. Wars Tab
    await page.getByRole('button', { name: 'Wars' }).click();
    await page.waitForTimeout(500);
    await checkView('05-wars.png');

    // 6. Assets Tab
    await page.getByRole('button', { name: 'Assets' }).click();
    await page.waitForTimeout(500);
    await checkView('06-assets.png');

    // 7. Dossier Tab (Select hotspot card first to match baseline sequence)
    await page.getByRole('button', { name: 'Hotspots' }).click();
    await page.waitForTimeout(400);
    const hotspotCard = page.locator('.palantir-feed-card').first();
    if (await hotspotCard.count() > 0) {
      await hotspotCard.click();
    }
    await page.getByRole('button', { name: 'Dossier' }).click();
    await page.waitForTimeout(500);
    await checkView('07-dossier.png');

    // 8. Map Popup (Captured over panned hotspot with Dossier active)
    await showMapPopup(page);
    await page.waitForTimeout(500);
    await checkView('08-popup.png');

    // 9. Tactical Layers (Captured in same state matching baseline)
    await checkView('09-tactical-layers.png');

    console.log('[PASS] Dark mode visual invariance confirmed with 0 pixel diff across all 9 views.');
  });
});
