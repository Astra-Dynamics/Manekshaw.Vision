import { chromium } from '@playwright/test';
import http from 'http';
import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');

const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost:4173');
  let pathname = url.pathname;

  let filePath = path.join(distDir, pathname);
  if (pathname === '/' || pathname === '') {
    filePath = path.join(distDir, 'index.html');
  } else if (!path.extname(pathname)) {
    const routeIndex = path.join(distDir, pathname, 'index.html');
    if (fs.existsSync(routeIndex)) filePath = routeIndex;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const contentType = ext === '.html' ? 'text/html; charset=utf-8' :
                        ext === '.js' ? 'application/javascript' :
                        ext === '.css' ? 'text/css' :
                        ext === '.json' ? 'application/json' :
                        ext === '.webp' ? 'image/webp' :
                        ext === '.png' ? 'image/png' :
                        ext === '.jpg' ? 'image/jpeg' :
                        ext === '.woff2' ? 'font/woff2' :
                        'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    return res.end(fs.readFileSync(filePath));
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(4174, async () => {
  console.log('Mobile test server running on http://localhost:4174');

  const browser = await chromium.launch({ headless: true });
  const viewports = [
    { name: '360px Mobile (Small Android)', width: 360, height: 800 },
    { name: '390px Mobile (iPhone Standard)', width: 390, height: 844 },
    { name: '1280px Desktop', width: 1280, height: 800 }
  ];

  for (const vp of viewports) {
    const page = await browser.newPage({ viewport: { width: vp.width, height: vp.height } });
    await page.goto('http://localhost:4174/dashboard', { waitUntil: 'networkidle' });

    // Check horizontal scroll
    const overflowInfo = await page.evaluate(() => {
      const doc = document.documentElement;
      const body = document.body;
      const scrollWidth = Math.max(doc.scrollWidth, body.scrollWidth);
      const clientWidth = doc.clientWidth;
      return {
        scrollWidth,
        clientWidth,
        hasHorizontalScroll: scrollWidth > clientWidth,
        overflowPixels: scrollWidth - clientWidth
      };
    });

    console.log(`\n--- Viewport: ${vp.name} (${vp.width}x${vp.height}) ---`);
    console.log(`Horizontal Scroll: ${overflowInfo.hasHorizontalScroll ? 'FAILED (Overflow: ' + overflowInfo.overflowPixels + 'px)' : 'PASSED (0px overflow)'}`);

    if (vp.width < 640) {
      // Find mobile more options button
      const moreBtn = page.locator('button[aria-label="More tactical controls"]');
      const isMoreBtnVisible = await moreBtn.isVisible();
      console.log(`Mobile More Options ('...') Button Visible: ${isMoreBtnVisible}`);

      if (isMoreBtnVisible) {
        const box = await moreBtn.boundingBox();
        console.log(`More Button Tap Target: ${box ? Math.round(box.width) + 'x' + Math.round(box.height) + 'px' : 'N/A'}`);

        await moreBtn.click();
        await page.waitForTimeout(200);

        // Verify dropdown controls are reachable
        const controls = [
          { name: 'Share Dashboard Link', query: 'Share Dashboard Link' },
          { name: 'Save Workspace', query: 'Save Workspace' },
          { name: 'Search Command Palette', query: 'Search Command Palette' },
          { name: 'Audio Pings', query: 'Audio Pings' },
          { name: 'Fullscreen Toggle', query: 'Fullscreen' },
          { name: 'Telemetry Window', query: 'Telemetry Window' }
        ];

        for (const ctrl of controls) {
          const btnLoc = page.locator('button', { hasText: new RegExp(ctrl.query, 'i') }).first();
          const hasBtn = (await btnLoc.count()) > 0;
          const vis = hasBtn ? await btnLoc.isVisible() : await page.getByText(ctrl.query, { exact: false }).first().isVisible();
          const targetBox = hasBtn ? await btnLoc.boundingBox() : await page.getByText(ctrl.query, { exact: false }).first().boundingBox();
          console.log(`  ✓ Control "${ctrl.name}": Visible = ${vis} (Tap Box = ${targetBox ? Math.round(targetBox.width) + 'x' + Math.round(targetBox.height) + 'px' : 'N/A'})`);
        }
      }
    } else {
      // Desktop: ensure '...' button is hidden and desktop controls are visible
      const moreBtn = page.locator('button[aria-label="More tactical controls"]');
      const isMoreBtnVisible = await moreBtn.isVisible();
      console.log(`Mobile More Button Hidden on Desktop: ${!isMoreBtnVisible}`);

      const searchBtn = page.locator('button[title*="Tactical Command Palette"]');
      console.log(`Desktop Search Button Visible: ${await searchBtn.isVisible()}`);
    }

    await page.close();
  }

  await browser.close();
  server.close();
  console.log('\nAll mobile and responsive checks complete!');
});
