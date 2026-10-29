import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { freezeAnimationsAndSettle, showMapPopup } from './helpers';

test.describe('Step 2: Dark Mode Visual Regression Test (0 pixel diff)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/Dashboard');
    await page.evaluate(() => {
      localStorage.setItem('manvis_theme', 'dark');
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark-theme');
    });
    await page.reload();
    await freezeAnimationsAndSettle(page);
  });

  const views = [
    { name: '01-dashboard.png', action: async (_p: any) => {} },
    { name: '02-feed.png', action: async (_p: any) => {} },
    { name: '03-videos.png', action: async (p: any) => p.getByRole('button', { name: 'Videos' }).click() },
    { name: '04-hotspots.png', action: async (p: any) => p.getByRole('button', { name: 'Hotspots' }).click() },
    { name: '05-wars.png', action: async (p: any) => p.getByRole('button', { name: 'Wars' }).click() },
    { name: '06-assets.png', action: async (p: any) => p.getByRole('button', { name: 'Assets' }).click() },
    {
      name: '07-dossier.png',
      action: async (p: any) => {
        await p.getByRole('button', { name: 'Hotspots' }).click();
        await p.waitForTimeout(400);
        const card = p.locator('.palantir-feed-card').first();
        if (await card.count() > 0) await card.click();
        await p.getByRole('button', { name: 'Dossier' }).click();
      }
    },
    {
      name: '08-popup.png',
      action: async (p: any) => {
        await showMapPopup(p);
      }
    },
    { name: '09-tactical-layers.png', action: async (_p: any) => {} }
  ];

  for (const v of views) {
    test(`Dark Regression Check: ${v.name}`, async ({ page }) => {
      await v.action(page);
      await page.waitForTimeout(500);
      await freezeAnimationsAndSettle(page);

      const baselineFile = path.resolve('tests/visual/baseline/screenshots/dark', v.name);
      if (!fs.existsSync(baselineFile)) {
        throw new Error(`Baseline screenshot does not exist: ${baselineFile}`);
      }

      // Save to comparison directory
      const regDir = path.resolve('tests/visual/regression/screenshots/dark');
      fs.mkdirSync(regDir, { recursive: true });
      const currentScreenshot = await page.screenshot({ path: path.join(regDir, v.name) });

      // Invariance check
      expect(currentScreenshot).toMatchSnapshot(`dark/${v.name}`, { maxDiffPixels: 0 });
    });
  }
});
