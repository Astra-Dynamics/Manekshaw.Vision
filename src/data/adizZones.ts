import { AdizZoneFeature } from '../types';

/**
 * Generates an organic, smooth interpolated nautical path between key waypoints
 * ensuring smooth curvature across maritime defense sectors.
 */
function interpolateWaypoints(waypoints: [number, number][], numInterp: number = 2): [number, number][] {
  const result: [number, number][] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p0 = waypoints[i];
    const p1 = waypoints[i + 1];
    for (let j = 0; j < numInterp; j++) {
      const t = j / numInterp;
      // Cosine interpolation for organic geographic turns
      const mu = (1 - Math.cos(t * Math.PI)) / 2;
      const lon = p0[0] * (1 - mu) + p1[0] * mu;
      const lat = p0[1] * (1 - mu) + p1[1] * mu;
      result.push([Number(lon.toFixed(4)), Number(lat.toFixed(4))]);
    }
  }
  result.push(waypoints[waypoints.length - 1]);
  return result;
}

// India's Official Maritime Defense & Sovereign Airspace Coordinates
const INDIA_ADIZ_KEY_WAYPOINTS: [number, number][] = [
  // 1. Sir Creek & Gujarat Coast
  [68.16, 23.68],
  [67.40, 23.20],
  [66.80, 22.40],
  [66.20, 21.00],
  [66.50, 19.50],
  [67.50, 18.00],
  [68.50, 16.50],
  [69.60, 15.00],
  [70.50, 13.50],
  [71.20, 12.00],

  // 2. Lakshadweep & Minicoy (Nine & Eight Degree Channels)
  [71.00, 10.50],
  [70.60, 9.20],
  [70.80, 8.00],
  [71.80, 7.20],
  [73.50, 6.50],
  [75.20, 6.20],

  // 3. South of Kanyakumari (Cape Comorin)
  [76.80, 6.00],
  [77.80, 5.80],
  [78.80, 6.20],

  // 4. Gulf of Mannar & Palk Strait (Accurately skirts Sri Lanka territorial boundary)
  [79.20, 7.20],
  [79.40, 8.00],
  [79.55, 8.80],
  [79.80, 9.35],
  [80.15, 9.85],
  [80.60, 10.40],
  [81.50, 11.20],

  // 5. Bay of Bengal Main Defense Corridor (Chennai & Kolkata Oceanic FIR)
  [83.00, 12.50],
  [84.80, 13.80],
  [86.50, 15.00],
  [88.20, 16.50],
  [89.80, 18.00],

  // 6. Andaman & Nicobar Command (ANC) Maritime Envelope
  [91.50, 15.20],
  [92.80, 15.00],
  [94.00, 14.50],
  [94.80, 13.50],
  [95.20, 12.00], // East of Port Blair
  [95.40, 10.50], // East of Little Andaman
  [95.60, 8.50],  // East of Car Nicobar
  [95.70, 7.20],
  [95.50, 6.40],  // Great Nicobar / Indira Point

  // 7. Six Degree Channel (Strategic Malacca Gateway)
  [94.80, 5.70],
  [93.80, 5.70],
  [92.40, 6.00],
  [91.20, 6.80],
  [90.00, 8.00],
  [89.50, 9.80],
  [90.00, 12.00],
  [90.80, 14.50],
  [91.50, 17.00],
  [91.80, 19.20],
  [91.20, 20.50],

  // 8. Sundarbans & Eastern Land Frontier
  [89.50, 21.50],
  [88.80, 21.80],
  [92.00, 21.40],
  [93.20, 22.40],
  [94.20, 24.20],
  [95.20, 25.80],
  [96.80, 27.20],

  // 9. Arunachal Pradesh (Strictly Sovereign Indian Frontier / McMahon Watershed)
  [97.40, 28.22], // Kibithu / Diphu Pass
  [97.00, 28.50],
  [95.50, 29.20],
  [94.00, 28.80],
  [92.50, 28.00],
  [91.80, 27.80], // Tawang / Bum La Pass

  // 10. Sikkim & Central Himalayan Frontier
  [88.80, 28.00], // Sikkim
  [81.20, 30.20], // Uttarakhand / Lipulekh
  [80.50, 31.00],
  [79.00, 32.00],

  // 11. Ladakh & Aksai Chin Sovereign Frontier
  [80.50, 33.20],
  [80.00, 34.50],
  [78.80, 35.20],
  [77.80, 35.50], // Karakoram Pass
  [77.00, 35.70], // Indira Col / Siachen
  [76.20, 35.90],
  [75.20, 36.40],
  [74.80, 36.80], // Northernmost Gilgit-Baltistan

  // 12. Northern Command / Western Sector Frontier
  [74.10, 34.20],
  [74.20, 33.50],
  [74.80, 32.80],
  [74.50, 31.80],
  [73.50, 30.00],
  [71.50, 28.50],
  [70.40, 27.20],
  [70.20, 25.80],
  [68.80, 24.20],
  [68.16, 23.68]  // Reconnect smoothly to Sir Creek
];

// Persian Gulf Combined Air Defense Corridor (Realistic Nautical Waypoints)
const PERSIAN_GULF_WAYPOINTS: [number, number][] = [
  [48.0, 29.8],
  [48.8, 29.2],
  [50.2, 28.2],
  [51.8, 27.2],
  [53.5, 26.5],
  [55.2, 26.2],
  [56.8, 26.5],
  [57.5, 25.8],
  [56.8, 24.8],
  [55.0, 24.2],
  [53.2, 24.0],
  [51.5, 24.5],
  [50.5, 25.8],
  [49.5, 27.5],
  [48.0, 29.8]
];

export const ADIZ_ZONES: AdizZoneFeature[] = [
  {
    id: 'adiz_india',
    name: 'India Sovereign Air Defense Identification Zone (IAF ADIZ)',
    country: 'India',
    authority: 'Indian Air Force (IAF) & Integrated Air Command and Control System (IACCS)',
    alertLevel: 'active',
    center: [78.5, 23.5],
    color: '#0284c7', // Indian sovereign sky/cyan
    rules: 'Mandatory 24-hr advance military/civil flight plan (Air Defense Clearance - ADC), continuous Mode 3/A/C/S secondary radar transponder, emergency guard 121.5 / 243.0 MHz monitoring. Immediate intercept protocol for non-responsive targets.',
    description: 'Encompasses the entire sovereign territory of the Republic of India as officially delineated by the Survey of India — including the Union Territories of Jammu & Kashmir and Ladakh (comprising PoK, Gilgit-Baltistan, Siachen Glacier, and Aksai Chin) and the state of Arunachal Pradesh in their entirety. Extended into vital maritime defense sectors across the Arabian Sea, Bay of Bengal, and the Andaman & Nicobar Command (ANC) strategic maritime chokepoints.',
    coords: interpolateWaypoints(INDIA_ADIZ_KEY_WAYPOINTS, 3)
  },
  {
    id: 'adiz_taiwan',
    name: 'Taiwan Air Defense Identification Zone (ROCAF ADIZ)',
    country: 'Taiwan (ROC)',
    authority: 'Republic of China Air Force (ROCAF)',
    alertLevel: 'heightened',
    center: [121.5, 23.5],
    color: '#eab308',
    rules: 'Continuous military radar surveillance. Chinese PLA incursions crossing the median line or entering southwest sector trigger immediate Combat Air Patrol (CAP) scramble and ground-based missile tracking.',
    description: 'Encompasses Taiwan proper, Penghu, Kinmen, Matsu, and extends into the sensitive southwest airspace abutting the Bashi Channel and South China Sea.',
    coords: [
      [117.5, 21.0],
      [122.5, 21.0],
      [124.0, 25.0],
      [123.0, 27.0],
      [121.5, 27.0],
      [119.0, 25.5],
      [117.5, 23.0],
      [117.5, 21.0]
    ]
  },
  {
    id: 'adiz_japan',
    name: 'Japan Air Defense Identification Zone (JADIZ)',
    country: 'Japan',
    authority: 'Japan Air Self-Defense Force (JASDF)',
    alertLevel: 'active',
    center: [136.0, 35.0],
    color: '#3b82f6',
    rules: 'Subdivided into Northern, Central, Western, and Southwestern Air Defense Sectors. Monitored by E-767 AWACS and FPS-5 OTH/AESA radars. Scrambles against Russian bombers and Chinese PLA patrols.',
    description: 'Comprehensive maritime airspace boundary surrounding the Japanese archipelago, extending across the Sea of Japan, Pacific Ocean, and southwest Nansei Islands including the Senkaku Islands.',
    coords: interpolateWaypoints([
      [128.0, 34.0],
      [125.0, 28.5],
      [123.0, 26.5],
      [125.0, 24.0],
      [130.0, 24.5],
      [138.0, 26.5],
      [144.0, 32.0],
      [148.0, 38.0],
      [149.0, 45.0],
      [144.0, 46.2],
      [141.0, 46.5],
      [136.0, 42.0],
      [130.0, 38.0],
      [128.0, 34.0]
    ], 2)
  },
  {
    id: 'adiz_korea',
    name: 'South Korea Air Defense Identification Zone (KADIZ)',
    country: 'South Korea (ROK)',
    authority: 'Republic of Korea Air Force (ROKAF) Master Control and Reporting Center (MCRC)',
    alertLevel: 'active',
    center: [127.8, 36.2],
    color: '#10b981',
    rules: 'Mandatory flight plan submission 2 hours prior to entry. Fast-response F-35A and F-15K alert interceptors stationed at Osan and Daegu.',
    description: 'Covers South Korean peninsular airspace and maritime approaches in the Yellow Sea and East Sea, explicitly expanded in 2013 to include Ieodo (Socotra Rock) submerged reef.',
    coords: interpolateWaypoints([
      [124.0, 34.2],
      [124.5, 32.0],
      [128.5, 32.0],
      [131.0, 35.5],
      [132.5, 37.5],
      [129.5, 38.5],
      [126.0, 38.0],
      [124.0, 34.2]
    ], 2)
  },
  {
    id: 'adiz_china_ecs',
    name: 'China East China Sea ADIZ (CADIZ)',
    country: 'China (PRC)',
    authority: 'People’s Liberation Army Air Force (PLAAF)',
    alertLevel: 'active',
    center: [125.0, 28.5],
    color: '#ef4444',
    rules: 'Declared unilaterally in November 2013. Demands foreign military and civil aircraft identify themselves, report transponder modes, and maintain radio communication. Overlaps Japanese JADIZ and South Korean KADIZ.',
    description: 'Encompasses contested East China Sea waters including the Diaoyu/Senkaku Islands and the Chunxiao gas field region, creating friction with Tokyo and Washington.',
    coords: interpolateWaypoints([
      [121.8, 33.2],
      [125.0, 33.2],
      [128.0, 30.5],
      [125.5, 25.6],
      [123.0, 25.6],
      [120.5, 27.0],
      [121.8, 33.2]
    ], 2)
  },
  {
    id: 'adiz_norad_alaska',
    name: 'NORAD Alaska Air Defense Identification Zone',
    country: 'United States & Canada',
    authority: 'North American Aerospace Defense Command (NORAD) / Alaska Command',
    alertLevel: 'routine',
    center: [-156.0, 63.5],
    color: '#8b5cf6',
    rules: 'All aircraft entering US airspace from international corridors must file DVFR or IFR flight plans. Monitored 24/7 by E-3 Sentry AWACS and F-22 Raptors stationed at Joint Base Elmendorf-Richardson (JBER).',
    description: 'Frontline aerospace defense buffer shielding North America from Russian Aerospace Forces (VKS) Tu-95MS strategic bombers and maritime patrol sorties across the Bering Strait.',
    coords: interpolateWaypoints([
      [-172.0, 52.0],
      [-178.0, 58.0],
      [-170.0, 66.0],
      [-155.0, 72.0],
      [-135.0, 72.0],
      [-138.0, 60.0],
      [-145.0, 55.0],
      [-160.0, 50.0],
      [-172.0, 52.0]
    ], 2)
  },
  {
    id: 'adiz_baltic_nato',
    name: 'NATO Baltic Air Policing QRA Corridor',
    country: 'NATO Alliance',
    authority: 'NATO Allied Air Command (AIRCOM) & Combined Air Operations Centre (CAOC) Uedem',
    alertLevel: 'heightened',
    center: [23.5, 57.0],
    color: '#06b6d4',
    rules: 'Quick Reaction Alert (QRA) intercept protocol for non-compliant Russian military aircraft flying without active transponders or flight plans through Baltic international airspace between St. Petersburg and Kaliningrad.',
    description: 'Multinational air policing perimeter operating out of Šiauliai Air Base (Lithuania), Ämari Air Base (Estonia), and Malbork (Poland) safeguarding the airspace of Estonia, Latvia, and Lithuania.',
    coords: interpolateWaypoints([
      [20.0, 59.5],
      [27.5, 59.8],
      [28.2, 57.5],
      [26.5, 55.5],
      [23.5, 54.0],
      [21.0, 55.0],
      [20.0, 57.5],
      [20.0, 59.5]
    ], 2)
  },
  {
    id: 'adiz_persian_gulf',
    name: 'Persian Gulf Combined Air Defense Corridor',
    country: 'Coalition / GCC',
    authority: 'US Air Forces Central (AFCENT) & Combined Air Operations Center (CAOC) Al Udeid',
    alertLevel: 'heightened',
    center: [51.5, 26.5],
    color: '#f97316',
    rules: 'Intense radar integration combining Patriot PAC-3, THAAD, and Aegis BMD cruisers with Royal Saudi and UAE air defense batteries. Special flight notice required for all civil transit over the Arabian Gulf.',
    description: 'High-density air defense shield monitoring cruise missile and drone swarms traversing Iranian, Iraqi, and Yemeni launch corridors.',
    coords: interpolateWaypoints(PERSIAN_GULF_WAYPOINTS, 2)
  }
];
