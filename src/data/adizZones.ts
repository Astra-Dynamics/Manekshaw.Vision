export interface AdizZoneFeature {
  id: string;
  name: string;
  country: string;
  authority: string;
  alertLevel: 'active' | 'heightened' | 'routine';
  center: [number, number]; // [lon, lat]
  rules: string;
  description: string;
  color: string;
  coords: [number, number][]; // Polygon coords [lon, lat]
}

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
    coords: [
      // Northernmost Ladakh & Karakoram Pass
      [77.0, 37.1],
      [80.3, 36.5],
      // Aksai Chin & Western Tibet boundary
      [81.5, 33.5],
      [81.0, 30.5],
      // Central sector
      [84.5, 27.5],
      [88.2, 28.0],
      // Sikkim & Eastern Sector Arunachal Pradesh
      [92.0, 28.5],
      [97.5, 29.5],
      [98.5, 28.0],
      [96.8, 26.5],
      // Northeast Myanmar border
      [94.5, 24.0],
      [92.5, 21.0],
      // Bay of Bengal Maritime ADIZ Envelope (extended to 200 NM defense corridor)
      [90.0, 16.0],
      [93.5, 12.0], // Andaman & Nicobar envelope
      [94.2, 6.5],  // Great Nicobar / Indira Point / Six Degree Channel
      [92.0, 6.0],
      [85.0, 10.0],
      [82.5, 14.0],
      [80.5, 9.5],  // Palk Strait
      // Southern Tip / Indian Ocean Defense Sector
      [77.5, 6.5],
      [73.0, 7.5],  // Lakshadweep / Nine Degree Channel
      // Arabian Sea Maritime ADIZ Envelope
      [68.5, 14.0],
      [66.0, 19.5],
      [67.0, 23.8], // Sir Creek / Gujarat Maritime border
      // Western Sector Rajasthan / Punjab
      [70.0, 27.5],
      [74.0, 31.8],
      // Northern Sector LoC / Siachen / Gilgit-Baltistan
      [74.5, 34.8],
      [74.8, 36.8],
      [77.0, 37.1]
    ]
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
    coords: [
      [128.0, 34.0],
      [123.0, 26.5],
      [125.0, 24.0],
      [130.0, 24.5],
      [142.0, 28.0],
      [148.0, 38.0],
      [149.0, 45.0],
      [141.0, 46.5],
      [136.0, 42.0],
      [130.0, 38.0],
      [128.0, 34.0]
    ]
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
    coords: [
      [124.0, 34.2],
      [124.5, 32.0],
      [128.5, 32.0],
      [131.0, 35.5],
      [132.5, 37.5],
      [129.5, 38.5],
      [126.0, 38.0],
      [124.0, 34.2]
    ]
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
    coords: [
      [121.8, 33.2],
      [125.0, 33.2],
      [128.0, 30.5],
      [125.5, 25.6],
      [123.0, 25.6],
      [120.5, 27.0],
      [121.8, 33.2]
    ]
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
    coords: [
      [-172.0, 52.0],
      [-178.0, 58.0],
      [-170.0, 66.0],
      [-155.0, 72.0],
      [-135.0, 72.0],
      [-138.0, 60.0],
      [-145.0, 55.0],
      [-160.0, 50.0],
      [-172.0, 52.0]
    ]
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
    coords: [
      [20.0, 59.5],
      [27.5, 59.8],
      [28.2, 57.5],
      [26.5, 55.5],
      [23.5, 54.0],
      [21.0, 55.0],
      [20.0, 57.5],
      [20.0, 59.5]
    ]
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
    coords: [
      [48.0, 29.8],
      [51.5, 29.5],
      [56.5, 27.2],
      [56.8, 25.0],
      [53.0, 24.0],
      [50.0, 26.0],
      [48.0, 29.8]
    ]
  }
];
