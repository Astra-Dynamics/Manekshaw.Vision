import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/visual',
  snapshotDir: './tests/visual/baseline/screenshots',
  timeout: 120000,
  expect: {
    timeout: 15000,
    toHaveScreenshot: {
      maxDiffPixels: 0,
      animations: 'disabled',
    },
  },
  use: {
    baseURL: 'http://localhost:3000',
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
    actionTimeout: 15000,
  },
  webServer: {
    command: 'npm run dev -- --no-open',
    url: 'http://localhost:3000',
    reuseExistingServer: true,
    timeout: 60000,
  },
  projects: [
    {
      name: 'desktop-chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
