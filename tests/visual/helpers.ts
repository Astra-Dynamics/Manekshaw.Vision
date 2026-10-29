import { Page } from '@playwright/test';

export async function freezeAnimationsAndSettle(page: Page) {
  // 1. Freeze all CSS animations, transitions, and carets
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        transition: none !important;
        -webkit-animation: none !important;
        -moz-animation: none !important;
        animation: none !important;
        caret-color: transparent !important;
      }
    `
  });

  // 2. Pause any HTML5 media elements
  await page.evaluate(() => {
    document.querySelectorAll('video, audio').forEach((el) => {
      try {
        (el as HTMLMediaElement).pause();
      } catch (e) {
        // Ignore media pause errors
      }
    });
  });

  // 3. Wait for MapLibre map idle (if map exists)
  await page.evaluate(async () => {
    const el = document.querySelector('.maplibregl-map');
    if (!el) return;
    const fiberKey = Object.keys(el).find((k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    if (!fiberKey) return;

    let fiber = (el as any)[fiberKey];
    while (fiber) {
      let hook = fiber.memoizedState;
      while (hook) {
        const inst = hook.memoizedState?.current;
        if (inst && typeof inst.loaded === 'function') {
          if (!inst.loaded() || (typeof inst.areTilesLoaded === 'function' && !inst.areTilesLoaded())) {
            await new Promise((res) => {
              inst.once('idle', res);
              setTimeout(res, 2500);
            });
          }
          return;
        }
        hook = hook.next;
      }
      fiber = fiber.return;
    }
  });

  // Settle time for rasterization
  await page.waitForTimeout(500);
}

export async function extractMapLibreStyleAndPaint(page: Page) {
  return await page.evaluate(async () => {
    const el = document.querySelector('.maplibregl-map');
    if (!el) throw new Error('Map container (.maplibregl-map) not found in DOM');
    const fiberKey = Object.keys(el).find((k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    if (!fiberKey) throw new Error('React fiber not found on map container');

    let fiber = (el as any)[fiberKey];
    let mapInstance: any = null;
    while (fiber && !mapInstance) {
      let hook = fiber.memoizedState;
      while (hook) {
        if (hook.memoizedState?.current && typeof hook.memoizedState.current.getStyle === 'function') {
          mapInstance = hook.memoizedState.current;
          break;
        }
        hook = hook.next;
      }
      fiber = fiber.return;
    }

    if (!mapInstance) throw new Error('MapLibre Map instance not found in React fiber hook chain');

    if (!mapInstance.isStyleLoaded()) {
      await new Promise((resolve) => {
        mapInstance.once('style.load', resolve);
        setTimeout(resolve, 5000);
      });
    }

    // Allow custom GeoJSON sources/layers to bind
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const style = mapInstance.getStyle();
    if (!style) throw new Error('mapInstance.getStyle() returned null/undefined');

    const paintProperties: Record<string, any> = {};
    if (style.layers && Array.isArray(style.layers)) {
      for (const layer of style.layers) {
        if (layer.paint) {
          paintProperties[layer.id] = layer.paint;
        }
      }
    }

    // Sort layers deterministically
    const layers = (style.layers || []).map((l: any) => ({
      id: l.id,
      type: l.type,
      source: l.source,
      minzoom: l.minzoom,
      maxzoom: l.maxzoom,
      filter: l.filter,
      layout: l.layout,
      paint: l.paint
    }));

    return {
      version: style.version,
      sources: Object.keys(style.sources || {}).sort(),
      layers,
      paintProperties
    };
  });
}

export async function showMapPopup(page: Page) {
  return await page.evaluate(async () => {
    const el = document.querySelector('.maplibregl-map');
    if (!el) throw new Error('Map container not found');
    const fiberKey = Object.keys(el).find((k) => k.startsWith('__reactFiber$') || k.startsWith('__reactInternalInstance$'));
    if (!fiberKey) throw new Error('React fiber not found on map container');

    let fiber = (el as any)[fiberKey];
    let mapInstance: any = null;
    let popupInstance: any = null;

    while (fiber && (!mapInstance || !popupInstance)) {
      let hook = fiber.memoizedState;
      while (hook) {
        const current = hook.memoizedState?.current;
        if (current && typeof current.getStyle === 'function') {
          mapInstance = current;
        } else if (current && typeof current.setLngLat === 'function' && typeof current.setHTML === 'function') {
          popupInstance = current;
        }
        hook = hook.next;
      }
      fiber = fiber.return;
    }

    if (!mapInstance) throw new Error('Map instance not found');
    if (!popupInstance) throw new Error('Popup instance not found in React fiber hook chain');

    const html = `
      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 2px;">
        <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 4px;">
          <span style="color: #f43f5e; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">
            HOTSPOTS
          </span>
          <span style="background: rgba(244,63,94,0.15); color: #f43f5e; border: 1px solid rgba(244,63,94,0.3); padding: 1px 5px; border-radius: 3px; font-weight: 700; font-size: 9.5px;">LEVEL 85</span>
        </div>
        <div style="font-weight: 700; color: #f8fafc; font-size: 12px; margin-bottom: 4px; line-height: 1.3;">
          TACTICAL RADAR BASELINE
        </div>
        <div style="color: #94a3b8; font-size: 10px; line-height: 1.4; font-family: 'Inter', sans-serif;">
          Active monitoring zone and sovereign perimeter verification.
        </div>
      </div>
    `;

    popupInstance.setLngLat([86.35, 25.06]).setHTML(html).addTo(mapInstance);
    return true;
  });
}
