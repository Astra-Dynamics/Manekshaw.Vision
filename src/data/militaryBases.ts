import { MapFeatureItem } from '../types';

export const MILITARY_BASES: MapFeatureItem[] = [
  // US & NATO
  {
    id: 'base_al_udeid',
    layer: 'bases',
    name: 'Al Udeid Air Base (Qatar)',
    coordinates: [51.31, 25.12],
    category: 'US Air Force & Coalition HQ',
    status: 'Operational',
    severity: 'high',
    description: 'Forward headquarters for US Central Command (CENTCOM) and USAF Combined Air Operations Center (CAOC). Houses B-52s and KC-135 tankers.',
    details: { affiliation: 'US / NATO / Qatar', runwayLength: '3,750m', personnel: '10,000+' }
  },
  {
    id: 'base_bahrain_5th_fleet',
    layer: 'bases',
    name: 'NSA Bahrain (5th Fleet HQ)',
    coordinates: [50.60, 26.21],
    category: 'Naval Command HQ',
    status: 'Operational',
    severity: 'critical',
    description: 'US Naval Forces Central Command (NAVCENT) / US Fifth Fleet headquarters overseeing Persian Gulf, Red Sea, and Arabian Sea operations.',
    details: { affiliation: 'US Navy', shipsStationed: 'MCMs, Guided Missile Destroyers, Patrol Craft' }
  },
  {
    id: 'base_ramstein',
    layer: 'bases',
    name: 'Ramstein Air Base (Germany)',
    coordinates: [7.60, 49.44],
    category: 'NATO Central Air Command',
    status: 'Operational',
    severity: 'high',
    description: 'Headquarters of Allied Air Command (AIRCOM) and US Air Forces in Europe (USAFE). Logistics hub for Ukraine defense supplies.',
    details: { affiliation: 'NATO / US', runways: '2 (3,200m)', role: 'Logistics & Strategic Airlift' }
  },
  {
    id: 'base_diego_garcia',
    layer: 'bases',
    name: 'Diego Garcia Naval Support Facility',
    coordinates: [72.42, -7.31],
    category: 'Strategic Island Outpost',
    status: 'Operational',
    severity: 'high',
    description: 'Deep Indian Ocean bomber forward operating base capable of staging B-2 Stealth and B-52 bombers, with deep-water submarine tender lagoon.',
    details: { affiliation: 'US Navy / UK Royal Navy', runwayLength: '3,650m', role: 'Global Long-Range Strike' }
  },
  {
    id: 'base_yokosuka',
    layer: 'bases',
    name: 'Commander Fleet Activities Yokosuka',
    coordinates: [139.67, 35.28],
    category: 'Forward Aircraft Carrier Homeport',
    status: 'Operational',
    severity: 'critical',
    description: 'Homeport of the US Seventh Fleet and Carrier Strike Group 5 (USS George Washington). Primary forward naval repair and replenishment facility.',
    details: { affiliation: 'US Navy / JMSDF', dryDocks: '6', flagship: 'USS Blue Ridge (LCC 19)' }
  },
  {
    id: 'base_kadena',
    layer: 'bases',
    name: 'Kadena Air Base (Okinawa)',
    coordinates: [127.77, 26.35],
    category: 'Air Combat Hub',
    status: 'Operational',
    severity: 'high',
    description: '"Keystone of the Pacific". Operates F-15EX, F-22, F-35A rotational fighters, RC-135 Rivet Joint reconnaissance aircraft.',
    details: { affiliation: 'USAF 18th Wing', role: 'First Island Chain Air Superiority' }
  },
  {
    id: 'base_camp_humphreys',
    layer: 'bases',
    name: 'Camp Humphreys (Pyongtaek, ROK)',
    coordinates: [127.02, 36.96],
    category: 'Major Joint Forces Base',
    status: 'Operational',
    severity: 'high',
    description: 'Largest overseas US military installation in the world. Houses US Forces Korea (USFK) and Eighth Army HQ.',
    details: { affiliation: 'USFK / ROK Combined', area: '3,450 acres', troops: '35,000+' }
  },
  {
    id: 'base_incirlik',
    layer: 'bases',
    name: 'Incirlik Air Base (Turkey)',
    coordinates: [35.43, 37.00],
    category: 'Tactical Strike & Nuclear Deterrent',
    status: 'Operational',
    severity: 'high',
    description: 'Strategic NATO base hosting the 39th Air Base Wing, with hardened underground vaults storing B61 tactical nuclear gravity bombs.',
    details: { affiliation: 'NATO / Turkish Air Force / USAF', nuclearCapable: 'Yes' }
  },
  {
    id: 'base_souda_bay',
    layer: 'bases',
    name: 'Souda Bay Naval Base (Crete, Greece)',
    coordinates: [24.15, 35.53],
    category: 'Eastern Mediterranean Naval Hub',
    status: 'Operational',
    severity: 'medium',
    description: 'Deep-water port able to berth supercarriers; NATO Maritime Interdiction Operational Training Center (NMIOTC).',
    details: { affiliation: 'Hellenic Navy / US Navy 6th Fleet' }
  },
  {
    id: 'base_norfolk',
    layer: 'bases',
    name: 'Naval Station Norfolk (USA)',
    coordinates: [-76.31, 36.95],
    category: 'World\'s Largest Naval Base',
    status: 'Operational',
    severity: 'info',
    description: 'Atlantic Fleet Headquarters. Pier facilities for up to 75 ships and 134 aircraft alongside 14 piers.',
    details: { affiliation: 'US Navy', carriersHomeported: '4+' }
  },

  // China (PLA)
  {
    id: 'base_djibouti_china',
    layer: 'bases',
    name: 'PLA Support Base in Djibouti',
    coordinates: [43.05, 11.59],
    category: 'PLAN Overseas Logistics & Deep-Water Pier',
    status: 'Operational',
    severity: 'high',
    description: 'China\'s first official overseas military base. Features heavily fortified perimeter and 330m pier accommodating aircraft carriers.',
    details: { affiliation: 'People\'s Liberation Army Navy', location: 'Adjacent to Doraleh Port' }
  },
  {
    id: 'base_yulin_submarine',
    layer: 'bases',
    name: 'Yulin Naval Submarine Base (Hainan)',
    coordinates: [109.68, 18.21],
    category: 'Subterranean Nuclear Sub Base',
    status: 'Operational',
    severity: 'critical',
    description: 'PLAN South Sea Fleet stronghold. Houses Type 094 Jin-class SSBNs with underground sea caverns shielding submarines from satellite reconnaissance.',
    details: { affiliation: 'PLAN', missileBoats: 'JL-2/JL-3 SLBM platforms' }
  },
  {
    id: 'base_fiery_cross',
    layer: 'bases',
    name: 'Fiery Cross Reef Airbase (Spratlys)',
    coordinates: [112.89, 9.55],
    category: 'Artificial Island Fortress',
    status: 'Operational',
    severity: 'high',
    description: 'Militarized artificial island with 3,125m runway, deep-water port, sensor towers, and HQ-9 surface-to-air missile batteries.',
    details: { affiliation: 'PLA', runways: '1', role: 'South China Sea Power Projection' }
  },
  {
    id: 'base_subi_reef',
    layer: 'bases',
    name: 'Subi Reef Outpost (Spratlys)',
    coordinates: [114.08, 10.92],
    category: 'Militarized Coral Atoll',
    status: 'Operational',
    severity: 'high',
    description: 'Equipped with naval helipads, radar radomes, and hardened aircraft hangars for J-11 and J-16 strike aircraft.',
    details: { affiliation: 'PLA Air Force / Navy' }
  },
  {
    id: 'base_ream_cambodia',
    layer: 'bases',
    name: 'Ream Naval Base (Cambodia)',
    coordinates: [103.62, 10.53],
    category: 'PLAN Strategic Gulf of Thailand Port',
    status: 'Expanded / Active Berthing',
    severity: 'high',
    description: 'Chinese-funded naval deep-water pier and command complex permitting persistent PLAN warship deployments in Southeast Asian waters.',
    details: { affiliation: 'Royal Cambodian Navy / PLAN Access' }
  },

  // Russia
  {
    id: 'base_tartus_hmeymim',
    layer: 'bases',
    name: 'Tartus Naval Facility & Hmeymim AB (Syria)',
    coordinates: [35.88, 34.91],
    category: 'Russian Mediterranean Outpost',
    status: 'Operational',
    severity: 'high',
    description: 'Russia\'s only naval foothold on the Mediterranean Sea, paired with Hmeymim airbase deploying Su-35s and S-400 missile systems.',
    details: { affiliation: 'Russian Navy & Aerospace Forces (VKS)' }
  },
  {
    id: 'base_kaliningrad',
    layer: 'bases',
    name: 'Kaliningrad Military Enclave (Chkalovsk)',
    coordinates: [20.40, 54.77],
    category: 'Baltic Anti-Access / Area Denial (A2/AD)',
    status: 'Operational',
    severity: 'high',
    description: 'Baltic Fleet HQ garrisoned with Iskander-M ballistic missiles, Bastion coastal defense batteries, and Kinzhal-capable MiG-31Ks.',
    details: { affiliation: 'Russian Armed Forces' }
  },
  {
    id: 'base_sevastopol',
    layer: 'bases',
    name: 'Sevastopol Naval Base (Crimea)',
    coordinates: [33.53, 44.62],
    category: 'Black Sea Fleet Historic HQ',
    status: 'Damaged / Dispersed to Novorossiysk',
    severity: 'critical',
    description: 'Headquarters of the Black Sea Fleet subjected to Ukrainian Storm Shadow cruise missile and Magura V5 naval drone strikes.',
    details: { affiliation: 'Russian Navy' }
  },
  {
    id: 'base_gadzhievo_murmansk',
    layer: 'bases',
    name: 'Gadzhievo Submarine Base (Kola Peninsula)',
    coordinates: [33.32, 69.25],
    category: 'Northern Fleet Strategic Nuclear Base',
    status: 'Operational',
    severity: 'critical',
    description: 'Home base for Borei-class (Borey) nuclear ballistic missile submarines (SSBNs) forming Russia\'s primary second-strike sea deterrent.',
    details: { affiliation: 'Russian Navy Northern Fleet' }
  }
];
