import { ConflictZoneFeature } from '../types';

export const CONFLICT_ZONES: ConflictZoneFeature[] = [
  {
    id: 'ukraine_front',
    name: 'Eastern & Southern Ukraine Frontline',
    center: [37.5, 48.0],
    intensity: 'critical',
    parties: ['Armed Forces of Ukraine', 'Russian Armed Forces'],
    casualties: '600,000+ estimated total casualties',
    description: 'Active active multi-axis high-intensity conflict along Pokrovsk, Kupiansk, Chasiv Yar, and Kurakhove sectors with heavy drone warfare, glide bombs, and mechanized assaults.',
    updatedAt: 'Active Today',
    coords: [
      [36.5, 50.2],
      [38.2, 49.5],
      [38.8, 48.6],
      [38.0, 47.9],
      [37.2, 47.1],
      [35.3, 46.7],
      [33.5, 46.8],
      [32.8, 46.6],
      [35.0, 47.6],
      [36.5, 48.8],
      [36.5, 50.2]
    ]
  },
  {
    id: 'levant_theater',
    name: 'Levant Regional Escalation Zone',
    center: [35.5, 32.5],
    intensity: 'critical',
    parties: ['Israel Defense Forces', 'Hezbollah', 'Hamas', 'Axis of Resistance / Iran'],
    casualties: '45,000+ fatalities in Gaza, 3,000+ in Lebanon',
    description: 'Concurrent combat operations in Southern Lebanon, ongoing clearing actions in the Gaza Strip, and periodic ballistic exchanges with regional proxy networks.',
    updatedAt: 'Continuous Operations',
    coords: [
      [34.2, 31.2],
      [35.9, 31.4],
      [36.3, 33.5],
      [35.6, 34.5],
      [35.1, 33.1],
      [34.4, 31.8],
      [34.2, 31.2]
    ]
  },
  {
    id: 'sudan_civil_war',
    name: 'Sudan (Khartoum & Darfur)',
    center: [30.0, 14.5],
    intensity: 'critical',
    parties: ['Sudanese Armed Forces (SAF)', 'Rapid Support Forces (RSF)'],
    casualties: '150,000+ estimated deaths; 11M+ displaced',
    description: 'Brutal civil war involving siege operations across El Fasher, aerial bombardment of Khartoum, and catastrophic famine conditions.',
    updatedAt: 'Active Offensives',
    coords: [
      [22.5, 13.5],
      [26.5, 12.0],
      [32.5, 11.5],
      [34.0, 15.6],
      [31.5, 18.0],
      [25.0, 16.5],
      [22.5, 13.5]
    ]
  },
  {
    id: 'myanmar_junta_conflict',
    name: 'Myanmar Civil War & Resistance offensives',
    center: [96.0, 20.0],
    intensity: 'high',
    parties: ['State Administration Council (Junta)', 'Three Brotherhood Alliance', 'PDF'],
    casualties: '50,000+ dead; 3M internally displaced',
    description: 'Operation 1027 Phase 2; resistance forces have liberated Northern Shan State, Rakhine border outposts, and multiple provincial capitals.',
    updatedAt: 'Active Clash Points',
    coords: [
      [93.0, 17.0],
      [98.5, 16.5],
      [99.5, 22.0],
      [96.0, 25.5],
      [93.5, 23.0],
      [93.0, 17.0]
    ]
  },
  {
    id: 'drc_kivu',
    name: 'Eastern DRC (North & South Kivu)',
    center: [29.0, -1.5],
    intensity: 'high',
    parties: ['M23 Rebel Alliance', 'FARDC (DRC Military)', 'SAMIDRC Peacekeepers', 'FDLR'],
    casualties: 'Millions historically displaced; high civilian casualty rates',
    description: 'M23 advance encircling provincial capital Goma; intense battles for mineral-rich strategic nodes around Sake and Rubaya coltan mines.',
    updatedAt: 'Escalating Clashes',
    coords: [
      [28.0, -2.5],
      [29.8, -2.0],
      [29.6, 0.5],
      [28.2, 0.0],
      [28.0, -2.5]
    ]
  }
];
