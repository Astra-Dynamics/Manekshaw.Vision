import { MapFeatureItem } from '../types';

export const SANCTIONS_REGIMES: MapFeatureItem[] = [
  {
    id: 'sanct_russia',
    layer: 'sanctions',
    name: 'Russian Federation (G7/EU Total Sanctions)',
    coordinates: [37.61, 55.75],
    category: 'Sovereign Debt & Banking Blacklist',
    status: 'Maximum Pressure',
    severity: 'critical',
    description: 'Over 20,000 designated individuals and entities. Key measures: $300B sovereign reserves immobilized, SWIFT cutoff for major banks, G7 $60/bbl crude oil price cap, dual-use semiconductor export bans.',
    details: { designatedEntities: '20,000+', frozenReserves: '$300 Billion', primaryIssuers: 'US OFAC, EU, UK OFSI, Japan' }
  },
  {
    id: 'sanct_iran',
    layer: 'sanctions',
    name: 'Islamic Republic of Iran (OFAC / Secondary Sanctions)',
    coordinates: [51.38, 35.68],
    category: 'Petroleum & Non-Proliferation Embargo',
    status: 'Comprehensive Embargo',
    severity: 'critical',
    description: 'Extensive secondary sanctions penalizing any foreign institution conducting transactions with the Central Bank of Iran, NIOC, or designated IRGC commercial conglomerates.',
    details: { keyPrograms: 'IRAN-EO13846, IRGC-SDGT, Non-Proliferation (NPWMD)' }
  },
  {
    id: 'sanct_north_korea',
    layer: 'sanctions',
    name: 'DPRK (UN Security Council & Coalition Sanctions)',
    coordinates: [125.76, 39.03],
    category: 'Complete Arms & Mineral Embargo',
    status: 'Total Interdiction',
    severity: 'critical',
    description: 'Bans on coal, iron, seafood, textiles, crude petroleum caps (500,000 bbl/yr refined). High-seas ship-to-ship transfer interdictions.',
    details: { unResolutions: 'UNSCR 1718, 1874, 2270, 2375, 2397', enforcement: 'Pacific Maritime Sanctions Monitoring' }
  },
  {
    id: 'sanct_syria',
    layer: 'sanctions',
    name: 'Syria (Caesar Act Sanctions Regime)',
    coordinates: [36.29, 33.51],
    category: 'Humanitarian & Reconstruction Restrictions',
    status: 'Transition / Monitoring',
    severity: 'high',
    description: 'Secondary sanctions targeting foreign investment, military supply, and hydrocarbon rehabilitation aiding the previous Assad apparatus.',
    details: { legislation: 'Caesar Syria Civilian Protection Act', currentReview: 'Subject to US legislative reassessment' }
  },
  {
    id: 'sanct_belarus',
    layer: 'sanctions',
    name: 'Belarus (Lukashenko Regime Co-Belligerent Measures)',
    coordinates: [27.56, 53.90],
    category: 'Potash & Defense Sector Sanctions',
    status: 'Targeted Isolation',
    severity: 'high',
    description: 'Sanctions on Belaruskali (world\'s second-largest potash producer), civil aviation overflight bans, and defense industrial base restrictions.',
    details: { trigger: 'Airspace hijacking of FR4978 & logistical staging for Russian invasion' }
  },
  {
    id: 'sanct_venezuela',
    layer: 'sanctions',
    name: 'Venezuela (OFAC General License 44 Revocation)',
    coordinates: [-66.90, 10.48],
    category: 'Oil & Gold Sector Controls',
    status: 'Reimposed Restrictions',
    severity: 'medium',
    description: 'Revocation of relief on oil and gas transactions following disputed presidential elections; individual sanctions on electoral and military leadership.',
    details: { affectedCompanies: 'PDVSA, Minerven (Gold)', issuedBy: 'US Treasury OFAC' }
  },
  {
    id: 'sanct_myanmar',
    layer: 'sanctions',
    name: 'Myanmar SAC Military Junta (MOGE Sanctions)',
    coordinates: [96.16, 16.86],
    category: 'Aviation Fuel & State Energy Controls',
    status: 'Incremental Escalation',
    severity: 'high',
    description: 'Prohibitions on financial services to Myanma Oil and Gas Enterprise (MOGE), jet fuel delivery chains, and junta state administration council members.',
    details: { goal: 'Degrade junta aerial bombing capability against resistance positions' }
  }
];
