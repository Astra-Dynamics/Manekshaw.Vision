import { MapFeatureItem } from '../types';

export const NUCLEAR_SITES: MapFeatureItem[] = [
  {
    id: 'nuke_natanz',
    layer: 'nuclear',
    name: 'Natanz Fuel Enrichment Plant (FEP)',
    coordinates: [51.72, 33.72],
    category: 'Centrifuge Uranium Enrichment',
    status: 'IAEA Monitored / Hardened Under Mountain',
    severity: 'critical',
    description: 'Iran\'s primary uranium enrichment facility. Operates cascades of advanced IR-4 and IR-6 centrifuges producing uranium enriched up to 60% purity.',
    details: { country: 'Iran', enrichmentLevel: 'Up to 60% U-235', undergroundDepth: 'Under construction deep subterranean hall' }
  },
  {
    id: 'nuke_fordow',
    layer: 'nuclear',
    name: 'Fordow Fuel Enrichment Plant (FFEP)',
    coordinates: [50.99, 34.88],
    category: 'Deep Mountain Bunker Facility',
    status: 'High Enrichment Production',
    severity: 'critical',
    description: 'Heavily fortified uranium enrichment facility built inside a mountain near Qom, shielded against standard bunker-buster penetrators.',
    details: { country: 'Iran', protection: 'Reinforced granite mountain ridge', airDefense: 'S-300 PMU2 & Bavar-373' }
  },
  {
    id: 'nuke_dimona',
    layer: 'nuclear',
    name: 'Shimon Peres Negev Nuclear Research Center (Dimona)',
    coordinates: [35.14, 31.00],
    category: 'Strategic Plutonium Production',
    status: 'Operational / Uninspected',
    severity: 'critical',
    description: 'Heavy-water nuclear reactor and plutonium reprocessing facility associated with Israel\'s undeclared nuclear deterrent arsenal.',
    details: { country: 'Israel', estimatedWarheads: '90-200 nuclear warheads', safeguardStatus: 'Non-NPT signatory' }
  },
  {
    id: 'nuke_bushehr',
    layer: 'nuclear',
    name: 'Bushehr Nuclear Power Plant Unit 1',
    coordinates: [50.88, 28.83],
    category: 'Commercial VVER-1000 Reactor',
    status: 'Operational',
    severity: 'high',
    description: 'Russian-built commercial light-water reactor on the Persian Gulf coast generating 1,000 MWe under IAEA full-scope safeguards.',
    details: { country: 'Iran', fuelSuppliedBy: 'Rosatom (Russia)', spentFuelReturn: 'Repatriated to Russia' }
  },
  {
    id: 'nuke_zaporizhzhia',
    layer: 'nuclear',
    name: 'Zaporizhzhia Nuclear Power Station (ZNPP)',
    coordinates: [35.11, 47.51],
    category: '6x VVER-1000 Reactors (Europe\'s Largest)',
    status: 'Cold Shutdown / Military Zone',
    severity: 'critical',
    description: 'Occupied by Russian forces since March 2022. Frequent external electrical grid disconnects and armed drone intrusions threaten cooling systems.',
    details: { country: 'Ukraine (Occupied)', iaeaPresence: 'Permanent IAEA Support and Assistance Mission (ISAMZ)' }
  },
  {
    id: 'nuke_yongbyon',
    layer: 'nuclear',
    name: 'Yongbyon Nuclear Complex',
    coordinates: [125.75, 39.80],
    category: 'Plutonium Production & Centrifuge Facility',
    status: 'Active Expansion',
    severity: 'critical',
    description: 'DPRK\'s core nuclear weapon materials production hub. Features a 5MWe gas-cooled graphite reactor and Experimental Light Water Reactor (ELWR).',
    details: { country: 'North Korea', materialsProduced: 'Weapons-grade Plutonium & Enriched Uranium' }
  },
  {
    id: 'nuke_punggyeri',
    layer: 'nuclear',
    name: 'Punggye-ri Nuclear Test Facility',
    coordinates: [129.08, 41.28],
    category: 'Underground Tunnel Test Site',
    status: 'Standby for 7th Nuclear Test',
    severity: 'critical',
    description: 'Site of all six North Korean underground nuclear detonations (including 2017 thermonuclear test). Tunnel 3 remains cleared for immediate test capability.',
    details: { country: 'North Korea', testHistory: '2006, 2009, 2013, 2016x2, 2017' }
  },
  {
    id: 'nuke_pantex',
    layer: 'nuclear',
    name: 'Pantex Plant (Amarillo, Texas)',
    coordinates: [-101.55, 35.31],
    category: 'Nuclear Warhead Assembly & Dismantlement',
    status: 'Active Production',
    severity: 'info',
    description: 'Primary United States facility responsible for life extension programs, surveillance, and dismantlement of the nuclear stockpile.',
    details: { country: 'United States', agency: 'National Nuclear Security Administration (NNSA)' }
  },
  {
    id: 'nuke_mayak',
    layer: 'nuclear',
    name: 'Mayak Production Association (Ozyorsk)',
    coordinates: [60.85, 55.70],
    category: 'Nuclear Fuel Reprocessing & Isotope Plant',
    status: 'Operational',
    severity: 'high',
    description: 'Historic Soviet plutonium production plant; currently handles spent nuclear fuel storage, tritium processing, and radioisotope manufacture.',
    details: { country: 'Russia', facilityType: 'Rosatom closed administrative-territorial entity' }
  }
];
