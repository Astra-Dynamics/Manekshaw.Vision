import { MapFeatureItem } from '../types';

export const ECONOMIC_CENTERS: MapFeatureItem[] = [
  {
    id: 'econ_nyse_fed',
    layer: 'economic',
    name: 'New York (NYSE / Federal Reserve)',
    coordinates: [-74.00, 40.71],
    category: 'Global Capital Anchor',
    status: 'Active Trading',
    severity: 'info',
    description: 'World\'s largest equity marketplace with over $28 trillion market cap. Federal Reserve Bank of NY executes system open market operations.',
    details: { marketCap: '$28T+ (NYSE) + $24T (NASDAQ)', currency: 'USD Reserve Standard (58% of global FX reserves)' }
  },
  {
    id: 'econ_london',
    layer: 'economic',
    name: 'City of London & Bank of England',
    coordinates: [-0.09, 51.51],
    category: 'Global FX & Derivatives Hub',
    status: 'Active Trading',
    severity: 'info',
    description: 'Handles 38% of global foreign exchange turnover ($3.8 trillion daily). Global center for maritime insurance (Lloyd\'s of London) and metals trading (LME).',
    details: { dailyFxVolume: '$3.8 Trillion', keyInstitutions: 'Bank of England, LSE, Lloyd\'s' }
  },
  {
    id: 'econ_frankfurt_ecb',
    layer: 'economic',
    name: 'Frankfurt (European Central Bank / Deutsche Börse)',
    coordinates: [8.68, 50.11],
    category: 'Eurozone Monetary Command',
    status: 'Active Policy Monitoring',
    severity: 'info',
    description: 'Headquarters of the European Central Bank governing monetary policy for 20 eurozone member states and 350M citizens.',
    details: { currencyGoverned: 'Euro (EUR - 20% global reserves)', benchmarkIndex: 'DAX 40' }
  },
  {
    id: 'econ_tokyo',
    layer: 'economic',
    name: 'Tokyo (Tokyo Stock Exchange / Bank of Japan)',
    coordinates: [139.77, 35.68],
    category: 'Asian Sovereign Debt & Equity Market',
    status: 'Active Trading',
    severity: 'info',
    description: 'Third-largest stock exchange globally. Bank of Japan unwinding decades of negative interest rate policy (NIRP) with global carry trade ramifications.',
    details: { benchmark: 'Nikkei 225', fxImportance: 'JPY (Primary global funding/carry currency)' }
  },
  {
    id: 'econ_shanghai_pboc',
    layer: 'economic',
    name: 'Shanghai (SSE / PBOC Operations)',
    coordinates: [121.47, 31.23],
    category: 'State-Capital Financial Center',
    status: 'Active Market Intervention',
    severity: 'info',
    description: 'Mainland China\'s financial heart. People\'s Bank of China manages Yuan parity and liquidity injections targeting real estate and consumer recovery.',
    details: { benchmark: 'SSE Composite', crossBorderClearance: 'CIPS (Cross-Border Interbank Payment System)' }
  },
  {
    id: 'econ_hong_kong',
    layer: 'economic',
    name: 'Hong Kong (HKEX & HKMA)',
    coordinates: [114.16, 22.28],
    category: 'Offshore RMB Conduit',
    status: 'Active Trading',
    severity: 'info',
    description: 'Primary bridge connecting international capital with mainland China. Hosts 70% of offshore renminbi clearing transactions.',
    details: { benchmark: 'Hang Seng Index (HSI)', pegStatus: 'USD Peg via Currency Board (7.75 - 7.85 HKD/USD)' }
  },
  {
    id: 'econ_singapore',
    layer: 'economic',
    name: 'Singapore (SGX / MAS Wealth Center)',
    coordinates: [103.85, 1.29],
    category: 'Southeast Asia Private Banking & FX Hub',
    status: 'Capital Inflow Surge',
    severity: 'info',
    description: 'Leading wealth management hub in Asia; Singapore Exchange (SGX) leads in Asian commodity futures, iron ore contracts, and FX derivatives.',
    details: { sovereignWealth: 'GIC & Temasek combined assets >$1.1 Trillion' }
  },
  {
    id: 'econ_dubai_adx',
    layer: 'economic',
    name: 'Abu Dhabi & Dubai (Sovereign Wealth Capital)',
    coordinates: [54.37, 24.45],
    category: 'Petrodollar Recycling & Sovereign Capital',
    status: 'Aggressive Global Deployment',
    severity: 'info',
    description: 'Sovereign wealth powerhouse overseeing $1.5+ trillion in state assets (ADIA, Mubadala, ADQ, ICD). Leading destination for trade re-routing and tech investment.',
    details: { totalAUM: '$1.5+ Trillion', role: 'Global capital allocator & AI infrastructure financing' }
  },
  {
    id: 'econ_mumbai',
    layer: 'economic',
    name: 'Mumbai (NSE / BSE / Reserve Bank of India)',
    coordinates: [72.87, 19.07],
    category: 'Emerging Growth Engine ($4.5T+ Market Cap)',
    status: 'Fast-Growing Global Exchange',
    severity: 'info',
    description: 'National Stock Exchange of India (NSE) is the world\'s largest derivatives exchange by volume. Indian equity market crossed $5 trillion milestone.',
    details: { benchmark: 'NIFTY 50 / SENSEX', foreignInstitutionalInflows: 'Record highs across domestic mutual funds' }
  }
];
