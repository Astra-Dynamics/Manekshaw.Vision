import { ConflictZoneFeature } from '../types';

/**
 * Interpolates waypoints to create high-resolution, organically contoured conflict zones
 * and frontline belts instead of coarse polygonal boxes.
 */
function interpolateConflictBelt(waypoints: [number, number][], numInterp: number = 2): [number, number][] {
  const result: [number, number][] = [];
  for (let i = 0; i < waypoints.length - 1; i++) {
    const p0 = waypoints[i];
    const p1 = waypoints[i + 1];
    for (let j = 0; j < numInterp; j++) {
      const t = j / numInterp;
      const mu = (1 - Math.cos(t * Math.PI)) / 2;
      const lon = p0[0] * (1 - mu) + p1[0] * mu;
      const lat = p0[1] * (1 - mu) + p1[1] * mu;
      result.push([Number(lon.toFixed(4)), Number(lat.toFixed(4))]);
    }
  }
  result.push(waypoints[waypoints.length - 1]);
  return result;
}

export const CONFLICT_ZONES: ConflictZoneFeature[] = [
  {
    id: 'ukraine_front',
    name: 'Eastern & Southern Ukraine Frontline Ribbon',
    center: [37.5, 48.0],
    intensity: 'critical',
    parties: ['Armed Forces of Ukraine', 'Russian Armed Forces'],
    casualties: '600,000+ estimated total casualties',
    description: 'Active multi-axis high-intensity conflict along the 1,200 km active contact line: Pokrovsk, Chasiv Yar, Kupiansk, Kurakhove, Vuhledar, and Dnipro river delta with drone warfare, glide bombs, and mechanized assaults.',
    updatedAt: 'Active Today',
    coords: interpolateConflictBelt([
      [36.8, 50.1],
      [37.5, 49.6],
      [38.2, 49.0],
      [38.6, 48.6],
      [38.1, 48.2],
      [37.4, 47.9],
      [36.8, 47.5],
      [35.8, 47.4],
      [34.5, 47.1],
      [33.2, 46.8],
      [32.4, 46.5],
      [32.8, 46.2],
      [34.0, 46.6],
      [35.4, 47.0],
      [36.5, 47.1],
      [37.2, 47.5],
      [37.8, 48.0],
      [38.3, 48.7],
      [37.8, 49.4],
      [37.2, 49.9],
      [36.8, 50.1]
    ], 2)
  },
  {
    id: 'levant_theater',
    name: 'Levant Regional Escalation Zone (Blue Line & Gaza Strip)',
    center: [35.3, 33.1],
    intensity: 'critical',
    parties: ['Israel Defense Forces', 'Hezbollah', 'Hamas', 'Axis of Resistance / Iran'],
    casualties: '45,000+ fatalities in Gaza, 3,500+ in Lebanon',
    description: 'Concurrent military ground combat operations along the South Lebanon Blue Line border ridge and security perimeter clearing operations in the Gaza Strip.',
    updatedAt: 'Continuous Operations',
    coords: interpolateConflictBelt([
      [35.10, 33.10],
      [35.25, 33.12],
      [35.45, 33.10],
      [35.60, 33.25],
      [35.75, 33.32],
      [35.85, 33.22],
      [35.65, 33.15],
      [35.40, 33.02],
      [35.18, 33.05],
      [35.10, 33.10]
    ], 3)
  },
  {
    id: 'durand_line_clashes',
    name: 'Durand Line Mountain Frontier Conflict Corridor',
    center: [70.2, 33.0],
    intensity: 'critical',
    parties: ['Pakistan Armed Forces (11 & 12 Corps)', 'Afghan Taliban Border Troops', 'Tehrik-i-Taliban Pakistan (TTP)', 'BLA'],
    casualties: 'Hundreds of casualties in cross-border artillery, drone strikes, and border post attacks',
    description: 'High-altitude frontier skirmishes across the rugged mountain ridge: Spin Boldak/Chaman, North/South Waziristan, Kurram Agency, and Torkham border terminal.',
    updatedAt: 'Active Skirmishes',
    coords: interpolateConflictBelt([
      [66.40, 31.30], // Spin Boldak / Chaman
      [68.20, 31.80], // Qila Saifullah
      [69.40, 32.20], // Zhob valley
      [69.80, 32.40], // South Waziristan (Wana)
      [70.10, 32.90], // North Waziristan (Miranshah)
      [70.00, 33.60], // Kurram Agency (Parachinar)
      [71.10, 34.10], // Khyber Pass / Torkham
      [71.50, 34.60], // Mohmand Agency
      [71.60, 35.10], // Bajaur
      [71.80, 35.50], // Dir frontier
      [71.30, 35.60],
      [70.80, 34.80],
      [70.20, 34.20],
      [69.20, 33.40],
      [68.80, 32.60],
      [67.50, 32.00],
      [66.40, 31.30]
    ], 2)
  },
  {
    id: 'myanmar_junta_conflict',
    name: 'Northern Shan State & Resistance Front (Operation 1027)',
    center: [97.8, 23.0],
    intensity: 'high',
    parties: ['State Administration Council (Junta)', 'Three Brotherhood Alliance (MNDAA, TNLA, AA)', 'People’s Defence Force (PDF)'],
    casualties: '50,000+ dead; 3M internally displaced',
    description: 'High-intensity liberated territory offensive across Northern Shan State and along the Salween River gorges: Lashio, Laukkai (Kokang), Muse border hub, Kutkai, and Hsipaw.',
    updatedAt: 'Active Clash Points',
    coords: interpolateConflictBelt([
      [96.80, 22.80], // Nawnghkio / Kyaukme
      [97.30, 22.95], // Hsipaw
      [97.75, 22.95], // Lashio
      [98.20, 23.30], // Kutkai
      [98.70, 23.70], // Laukkai / Kokang
      [98.60, 24.10], // China-Myanmar border ridge
      [97.90, 24.00], // Muse border crossing
      [97.40, 23.85], // Namkham
      [96.60, 23.50], // Momeik
      [96.30, 23.00], // Mogok ruby valley
      [96.80, 22.80]
    ], 2)
  },
  {
    id: 'iran_hormuz_standoff',
    name: 'Strait of Hormuz & Musandam Maritime Conflict Corridor',
    center: [56.3, 26.5],
    intensity: 'critical',
    parties: ['Islamic Revolutionary Guard Corps Navy (IRGCN)', 'United States 5th Fleet', 'Combined Maritime Forces', 'UK Royal Navy'],
    casualties: 'Multiple commercial vessels seized or struck; drone intercepts ongoing',
    description: 'High-tension maritime choke point operations along the Traffic Separation Scheme (TSS) shipping channels, drone and anti-ship missile interdiction arcs, and naval patrols.',
    updatedAt: 'Escalating Alert',
    coords: interpolateConflictBelt([
      [54.80, 26.10],
      [55.80, 26.30],
      [56.50, 26.70],
      [57.10, 26.40],
      [57.40, 25.80],
      [57.00, 25.20],
      [56.30, 25.60],
      [55.60, 25.80],
      [54.80, 26.10]
    ], 2)
  },
  {
    id: 'sudan_civil_war',
    name: 'Sudan War: Khartoum Tri-City & El Fasher Pockets',
    center: [32.5, 15.6],
    intensity: 'critical',
    parties: ['Sudanese Armed Forces (SAF)', 'Rapid Support Forces (RSF)'],
    casualties: '150,000+ estimated deaths; 11M+ displaced',
    description: 'Urban warfare in Khartoum-Omdurman-Bahri confluence and heavy siege battles across El Fasher (North Darfur) with drone strikes and artillery duels.',
    updatedAt: 'Active Offensives',
    coords: interpolateConflictBelt([
      [32.30, 15.40],
      [32.65, 15.45],
      [32.75, 15.75],
      [32.45, 15.80],
      [32.30, 15.40]
    ], 3)
  },
  {
    id: 'somalia_shabaab',
    name: 'Lower Shabelle & Horn of Africa Insurgent Basin',
    center: [44.8, 2.2],
    intensity: 'high',
    parties: ['Somali National Army (SNA)', 'ATMIS Peacekeepers', 'US AFRICOM', 'Al-Shabaab (Al-Qaeda affiliate)'],
    casualties: 'Thousands killed annually; ongoing VBIED and ambush strikes',
    description: 'Asymmetric insurgency across Middle and Lower Shabelle agricultural river valleys, compounded by coastal maritime smuggling routes toward Yemen.',
    updatedAt: 'Active Operations',
    coords: interpolateConflictBelt([
      [43.80, 1.20],
      [44.80, 1.80],
      [45.50, 2.80],
      [44.60, 3.20],
      [43.60, 2.00],
      [43.80, 1.20]
    ], 2)
  }
];
