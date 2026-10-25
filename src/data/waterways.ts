import { MapFeatureItem } from '../types';

export const STRATEGIC_WATERWAYS: MapFeatureItem[] = [
  {
    id: 'choke_hormuz',
    layer: 'waterways',
    name: 'Strait of Hormuz',
    coordinates: [56.25, 26.56],
    category: 'Global Crude Oil Chokepoint',
    status: 'High Alert',
    severity: 'critical',
    description: 'Narrowest point 21 nautical miles wide. Carries ~21 million barrels of petroleum and 20% of global LNG trade per day.',
    details: { dailyBarrels: '20.5M bpd', width: '21 nm', borderingCountries: 'Oman, Iran, UAE' }
  },
  {
    id: 'choke_bab_el_mandeb',
    layer: 'waterways',
    name: 'Bab el-Mandeb Strait',
    coordinates: [43.33, 12.58],
    category: 'Red Sea Gatekeeper',
    status: 'Severely Disrupted / Under Threat',
    severity: 'critical',
    description: 'Connects the Red Sea with the Gulf of Aden. Traffic down 65% due to Houthi missile and kamikaze boat strikes.',
    details: { dailyTransitsPreWar: '50-60 ships/day', currentTransits: '18-22 ships/day', alternativeRoute: 'Cape of Good Hope (+12 days)' }
  },
  {
    id: 'choke_suez',
    layer: 'waterways',
    name: 'Suez Canal (Port Said to Suez)',
    coordinates: [32.34, 30.70],
    category: 'Eurasian Maritime Lifeline',
    status: 'Revenue Impacted',
    severity: 'high',
    description: '193km artificial waterway connecting the Mediterranean and Red Sea. Vital for containerized manufactured goods and LNG.',
    details: { canalRevenueLoss: 'Over $6 billion in 2024', depth: '24m', operator: 'Suez Canal Authority' }
  },
  {
    id: 'choke_malacca',
    layer: 'waterways',
    name: 'Strait of Malacca & Singapore',
    coordinates: [101.50, 2.50],
    category: 'Indo-Pacific Trade Corridor',
    status: 'High Density Transit',
    severity: 'high',
    description: 'Busiest shipping lane globally; connects Indian Ocean to Pacific Ocean. 100,000+ vessels annually, including 80% of China\'s crude imports.',
    details: { annualVessels: '100,000+', minimumDepth: '25m (Malaccamax limit)', piracyLevel: 'Low to Moderate' }
  },
  {
    id: 'choke_panama',
    layer: 'waterways',
    name: 'Panama Canal Locks',
    coordinates: [-79.68, 9.08],
    category: 'Inter-Oceanic Lock System',
    status: 'Recovering Draft Depths',
    severity: 'medium',
    description: 'Connects Atlantic and Pacific oceans. Relies on Gatun Lake freshwater; previously curtailed by severe drought before seasonal recovery.',
    details: { dailyTransitsAllowed: '36 ships/day', maximumDraft: '50 feet (Neo-Panamax)', tollModel: 'Auction System' }
  },
  {
    id: 'choke_bosphorus',
    layer: 'waterways',
    name: 'Bosphorus & Turkish Straits',
    coordinates: [29.07, 41.11],
    category: 'Black Sea Exit Gateway',
    status: 'Montreux Convention Restricted',
    severity: 'high',
    description: 'Separates European and Asian Turkey. Governed by 1936 Montreux Convention, restricting belligerent naval warships during the Ukraine war.',
    details: { widthNarrowest: '700m', grainCorridorVolume: 'Millions of tonnes via humanitarian corridor' }
  },
  {
    id: 'choke_gibraltar',
    layer: 'waterways',
    name: 'Strait of Gibraltar',
    coordinates: [-5.58, 35.96],
    category: 'Atlantic-Mediterranean Keyhole',
    status: 'Operational',
    severity: 'info',
    description: '14km international waterway linking the Atlantic Ocean to the Mediterranean Sea. Monitored by UK Gibraltar and Spanish maritime authorities.',
    details: { annualTraffic: '71,000+ vessels', navalImportance: 'Submarine transit acoustic choke' }
  },
  {
    id: 'choke_danish_straits',
    layer: 'waterways',
    name: 'Danish Straits (Storebælt & Øresund)',
    coordinates: [11.20, 55.35],
    category: 'Baltic Sea Outflow',
    status: 'Heightened Surveillance',
    severity: 'medium',
    description: 'Crucial exit for Russian oil shipments out of Primorsk and Ust-Luga. Baltic Shadow Fleet tankers scrutinized for maritime insurance compliance.',
    details: { shadowFleetTransit: 'Estimated 40% of Russian seaborne crude', depthLimit: '15m (Baltimax)' }
  }
];
