import { MapFeatureItem } from '../types';

export const INFRASTRUCTURE_OUTAGES: MapFeatureItem[] = [
  {
    id: 'outage_baltic_cables',
    layer: 'outages',
    name: 'Baltic Sea C-Lion1 & BCS Cable Severance',
    coordinates: [18.2, 57.5],
    category: 'Subsea Telecommunications Sabotage',
    status: 'Repaired / Enhanced Patrols',
    severity: 'critical',
    description: 'Physical severance of high-capacity fiber cables connecting Finland to Germany and Lithuania to Sweden. Chinese bulk carrier investigated for dragging anchor.',
    details: { affectedCables: 'C-Lion1 (1,200km) & BCS East-West Interlink', trafficRerouted: 'Via terrestrial Scandinavian loops' }
  },
  {
    id: 'outage_red_sea_cables',
    layer: 'outages',
    name: 'Red Sea Submarine Fiber Conduits (AAE-1 / Seacom)',
    coordinates: [42.8, 13.8],
    category: 'Critical Undersea Data Disruption',
    status: 'Partially Repaired with Armed Naval Escorts',
    severity: 'critical',
    description: 'Anchor drag from sunken freighter Rubymar severed three major submarine cables (Seacom, TGN, AAE-1), degrading 25% of data traffic between Asia and Europe.',
    details: { affectedTraffic: 'Asia-to-Europe Internet Routing (-25% latency impact)', repairDifficulty: 'Hostile combat zone required specialized coalition clearance' }
  },
  {
    id: 'outage_cuba_blackout',
    layer: 'outages',
    name: 'Cuba Nationwide Electrical Grid Collapse',
    coordinates: [-82.36, 23.11],
    category: 'Total National Power Failure',
    status: 'Intermittent Rolling Blackouts',
    severity: 'high',
    description: 'Antonio Guiteras thermoelectric plant trip precipitated cascade failure of SEN (National Electrical System), disconnecting 10 million citizens.',
    details: { cause: 'Aging Soviet-era plants, lack of crude oil fuel supplies, Hurricane Rafael grid damage' }
  },
  {
    id: 'outage_sudan_comms',
    layer: 'outages',
    name: 'Sudan National Telecom Blackout',
    coordinates: [32.53, 15.50],
    category: 'Wartime Telecommunications Shutdown',
    status: 'Severe Impairment',
    severity: 'high',
    description: 'Zain and Sudani data centers captured or cut in Khartoum, leaving humanitarian agencies and civilians reliant on Starlink terminals.',
    details: { affectedPopulation: '20+ Million without banking access or emergency communications' }
  },
  {
    id: 'outage_ukraine_energy',
    layer: 'outages',
    name: 'Kharkiv & Dnipro Power Generation Deficit',
    coordinates: [36.23, 49.99],
    category: 'Ballistic Grid Degradation',
    status: 'Rolling Emergency Rationing',
    severity: 'critical',
    description: 'Russian missile and Shahed drone strikes targeted Trypilska and Zmiivska thermal plants; Ukraine lost over 9 GW of generation capacity.',
    details: { generationLoss: '9+ Gigawatts', response: 'Emergency electricity imports from Poland, Romania, Slovakia' }
  },
  {
    id: 'outage_gaza_telecom',
    layer: 'outages',
    name: 'Gaza Strip Cellular & Fiber Blackouts',
    coordinates: [34.46, 31.50],
    category: 'Communication Infrastructure Destruction',
    status: 'Periodic Complete Cutoffs',
    severity: 'critical',
    description: 'Paltel and Jawwal central exchanges damaged by repeated bombardments; fuel shortages prevent generator operation at backup microwave towers.',
    details: { provider: 'Paltel Group', alternativeRouting: 'Egyptian e-SIMs along southern border' }
  }
];
