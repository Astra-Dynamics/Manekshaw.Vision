export interface CountryIntelDetails {
  code: string;
  name: string;
  capital: string;
  region: string;
  population: string;
  gdp: string;
  leader: string;
  ciiScore: number; // 0 - 100
  ciiRiskLevel: 'Critical' | 'High' | 'Elevated' | 'Watchlist' | 'Stable';
  ciiTrend: 'Escalating' | 'Stable' | 'De-escalating';
  executiveSummary: string;
  militaryPosture: {
    activePersonnel: string;
    defenseBudget: string;
    nuclearStatus: string;
    alliances: string[];
    readiness: string;
  };
  economicStatus: {
    inflation: string;
    currency: string;
    foreignReserves: string;
    primaryExports: string[];
    sanctionsStatus: string;
  };
  strategicRisks: string[];
  bounds?: [number, number, number, number]; // [minLon, minLat, maxLon, maxLat]
}

export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '🌐';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export const COUNTRY_INTEL_DATABASE: Record<string, CountryIntelDetails> = {
  IN: {
    code: 'IN',
    name: 'India',
    capital: 'New Delhi',
    region: 'South Asia / Indo-Pacific',
    population: '1.43 Billion',
    gdp: '$3.75 Trillion (5th Largest)',
    leader: 'Prime Minister Narendra Modi',
    ciiScore: 38,
    ciiRiskLevel: 'Watchlist',
    ciiTrend: 'Stable',
    bounds: [68.1, 6.7, 97.4, 37.1],
    executiveSummary:
      'Fastest-growing major global economy and cornerstone of Indo-Pacific security. Balances strategic autonomy through QUAD alliance participation alongside historic defense supply diversification. Maintains active two-front deterrence posture along northern Karakoram/Himalayan borders (Line of Actual Control) and western Line of Control.',
    militaryPosture: {
      activePersonnel: '1,450,000 (2nd largest)',
      defenseBudget: '$75.5 Billion',
      nuclearStatus: 'Declared Nuclear Weapons State (~172 warheads; Nuclear Triad operational)',
      alliances: ['QUAD (US, India, Japan, Australia)', 'BRICS', 'SCO'],
      readiness: 'High (Border deployments in Ladakh and Arunachal Pradesh)'
    },
    economicStatus: {
      inflation: '4.85%',
      currency: 'Indian Rupee (INR)',
      foreignReserves: '$690+ Billion (Record High)',
      primaryExports: ['Refined Petroleum', 'Pharmaceuticals', 'IT Software Services', 'Precious Gems', 'Machinery'],
      sanctionsStatus: 'None'
    },
    strategicRisks: [
      'Line of Actual Control (LAC) border standoff with China along eastern Ladakh sector',
      'Maritime security of Indian Ocean sea lanes and Malacca Strait access',
      'Cross-border militant activity along western frontier'
    ]
  },
  US: {
    code: 'US',
    name: 'United States',
    capital: 'Washington, D.C.',
    region: 'North America',
    population: '335 Million',
    gdp: '$28.8 Trillion (1st Globally)',
    leader: 'President of the United States',
    ciiScore: 24,
    ciiRiskLevel: 'Stable',
    ciiTrend: 'Stable',
    bounds: [-125.0, 24.5, -66.9, 49.0],
    executiveSummary:
      'Global superpower underwriting worldwide maritime freedom-of-navigation and coalition deterrence frameworks. Manages high-readiness global forward carrier strike groups across CENTCOM and INDOPACOM theaters.',
    militaryPosture: {
      activePersonnel: '1,328,000',
      defenseBudget: '$842 Billion',
      nuclearStatus: 'Major Nuclear Power (5,044 warheads; Full Triad)',
      alliances: ['NATO (Article 5)', 'AUKUS', 'QUAD', 'Five Eyes', 'US-Japan/ROK/Phil Bilateral'],
      readiness: 'DEFCON 3 (Heightened Middle East & Indo-Pacific Alert)'
    },
    economicStatus: {
      inflation: '2.6%',
      currency: 'US Dollar (USD - Primary Global Reserve Currency 58%)',
      foreignReserves: '$38 Billion (Excl. Gold/SDR)',
      primaryExports: ['Advanced Technology', 'LNG & Crude Oil', 'Aerospace', 'Semiconductor Equipment', 'Financial Services'],
      sanctionsStatus: 'Primary Sanctions Issuer (OFAC)'
    },
    strategicRisks: [
      'Simultaneous multi-theater deterrence commitments in Europe, Middle East, and Indo-Pacific',
      'Domestic political polarization impacting foreign military aid authorizations',
      'Supply chain reliance on East Asian semiconductor manufacturing'
    ]
  },
  CN: {
    code: 'CN',
    name: 'China',
    capital: 'Beijing',
    region: 'East Asia',
    population: '1.41 Billion',
    gdp: '$18.5 Trillion',
    leader: 'President Xi Jinping (CCP General Secretary)',
    ciiScore: 54,
    ciiRiskLevel: 'Elevated',
    ciiTrend: 'Escalating',
    bounds: [73.5, 18.2, 134.8, 53.6],
    executiveSummary:
      'Primary revisionist competitor to international rules-based order. Rapidly expanding PLA blue-water naval power (fastest shipbuilding expansion in history) and modernizing subterranean silo-based nuclear deterrent. Persistent military pressure across the Taiwan Strait and South China Sea.',
    militaryPosture: {
      activePersonnel: '2,035,000 (Largest Standing Army)',
      defenseBudget: '$230 Billion (Official)',
      nuclearStatus: 'Expanding Arsenal (~500 warheads, projected 1,000+ by 2030)',
      alliances: ['SCO', 'BRICS+', 'Sino-Russian "No Limits" Partnership'],
      readiness: 'Active Joint Sword blockading drills around Taiwan'
    },
    economicStatus: {
      inflation: '0.3% (Deflationary Pressures)',
      currency: 'Chinese Yuan (CNY)',
      foreignReserves: '$3.25 Trillion (World\'s Largest)',
      primaryExports: ['Consumer Electronics', 'Electric Vehicles & Batteries', 'Solar PV', 'Steel & Industrial Machinery'],
      sanctionsStatus: 'Subject to US Entity List technology export restrictions'
    },
    strategicRisks: [
      'Economic slowdown driven by property sector crisis and demographic decline',
      'Potential catastrophic escalation of military blockade against Taiwan',
      'Maritime friction with Philippines, Japan, and Vietnam in contested waters'
    ]
  },
  RU: {
    code: 'RU',
    name: 'Russia',
    capital: 'Moscow',
    region: 'Eurasia',
    population: '144 Million',
    gdp: '$2.0 Trillion',
    leader: 'President Vladimir Putin',
    ciiScore: 78,
    ciiRiskLevel: 'Critical',
    ciiTrend: 'Escalating',
    bounds: [19.6, 41.2, 180.0, 82.0],
    executiveSummary:
      'High-intensity war economy mobilized for prolonged attrition warfare in Ukraine. Substantial nuclear rhetoric and shadow fleet evasion tactics circumventing G7/EU energy sanctions. Deepening security integration with Iran, North Korea, and China.',
    militaryPosture: {
      activePersonnel: '1,320,000 (Mobilized wartime footing)',
      defenseBudget: '$140+ Billion (40% of federal budget)',
      nuclearStatus: 'World\'s Largest Nuclear Arsenal (5,580 warheads; Full Triad)',
      alliances: ['CSTO', 'Union State (Belarus)', 'SCO', 'BRICS'],
      readiness: 'Full Wartime Operational Deployment'
    },
    economicStatus: {
      inflation: '8.8%',
      currency: 'Russian Ruble (RUB)',
      foreignReserves: '$300B Frozen in Western Jurisdictions; $310B Sovereign Accessible',
      primaryExports: ['Crude Oil & Petroleum Products', 'Natural Gas', 'Fertilizers', 'Wheat', 'Defense Hardware'],
      sanctionsStatus: 'Most Heavily Sanctioned Sovereign State Globally'
    },
    strategicRisks: [
      'High military casualty rates and heavy reliance on North Korean ammunition/troops',
      'Structural inflation and severe labor shortages driven by defense militarization',
      'Undersea infrastructure sabotages and Baltic Sea naval tensions with NATO'
    ]
  },
  UA: {
    code: 'UA',
    name: 'Ukraine',
    capital: 'Kyiv',
    region: 'Eastern Europe',
    population: '38 Million',
    gdp: '$175 Billion',
    leader: 'President Volodymyr Zelenskyy',
    ciiScore: 88,
    ciiRiskLevel: 'Critical',
    ciiTrend: 'Escalating',
    bounds: [22.1, 44.4, 40.2, 52.4],
    executiveSummary:
      'Fighting active full-scale territorial defense war against Russian invasion across 1,000km frontline. Heavily dependent on Western coalition air defense (Patriot, NASAMS), artillery ammunition, and financial stabilization loans.',
    militaryPosture: {
      activePersonnel: '800,000+ (Total Defense Forces)',
      defenseBudget: 'Over 50% of National GDP (Wartime budget)',
      nuclearStatus: 'Non-Nuclear (Relinquished in 1994 Budapest Memorandum)',
      alliances: ['NATO Aspirant', 'EU Candidate', 'Bilateral Security Agreements with 25+ Nations'],
      readiness: 'Total Martial Law Mobilization'
    },
    economicStatus: {
      inflation: '9.7%',
      currency: 'Ukrainian Hryvnia (UAH)',
      foreignReserves: '$39 Billion (Backed by Western Macro-Financial Assistance)',
      primaryExports: ['Grain & Agriculture (Black Sea Corridor)', 'Iron Ore', 'Sunflower Oil'],
      sanctionsStatus: 'Beneficiary of Coalition Trade Protections'
    },
    strategicRisks: [
      'Severe thermal power generation deficit following ballistic strikes on electrical grid',
      'Frontline pressure in Donbas (Pokrovsk and Kurakhove sectors)',
      'Uncertainty surrounding long-term Western military assistance pipelines'
    ]
  },
  IR: {
    code: 'IR',
    name: 'Iran',
    capital: 'Tehran',
    region: 'Middle East',
    population: '89 Million',
    gdp: '$400 Billion',
    leader: 'Supreme Leader Ayatollah Ali Khamenei',
    ciiScore: 82,
    ciiRiskLevel: 'Critical',
    ciiTrend: 'Escalating',
    bounds: [44.0, 25.0, 63.3, 39.8],
    executiveSummary:
      'Leader of regional "Axis of Resistance" network encompassing Hezbollah, Houthis, and Iraqi militias. Engaged in direct missile and air defense exchanges with Israel. Enriches uranium to 60% purity, near weapons-grade breakout threshold.',
    militaryPosture: {
      activePersonnel: '610,000 (IRGC + Artesh)',
      defenseBudget: '$25 Billion (Estimated incl. off-budget IRGC conglomerates)',
      nuclearStatus: 'Threshold Nuclear State (Enriching to 60% at Natanz & Fordow)',
      alliances: ['Axis of Resistance', 'Strategic Partnership with Russia (Shahed UAVs & Ballistic tech)'],
      readiness: 'High Alert (Air Defense Batteries Rebuilding Post-Strikes)'
    },
    economicStatus: {
      inflation: '35%+',
      currency: 'Iranian Rial (IRR - Extreme Devaluation)',
      foreignReserves: '$25 Billion Accessible',
      primaryExports: ['Crude Oil (Discounted illicit shipments to China)', 'Petrochemicals'],
      sanctionsStatus: 'Total Secondary Financial & Energy Embargo'
    },
    strategicRisks: [
      'Direct military retaliation on nuclear or energy infrastructure',
      'Severe economic hardship driving domestic social unrest and currency collapse',
      'Loss of senior command personnel and communication compromises within regional proxies'
    ]
  },
  IL: {
    code: 'IL',
    name: 'Israel',
    capital: 'Jerusalem / Tel Aviv',
    region: 'Middle East',
    population: '9.8 Million',
    gdp: '$520 Billion',
    leader: 'Prime Minister Benjamin Netanyahu',
    ciiScore: 76,
    ciiRiskLevel: 'Critical',
    ciiTrend: 'Escalating',
    bounds: [34.2, 29.5, 35.9, 33.3],
    executiveSummary:
      'Engaged in multi-front high-intensity regional combat operations in Gaza and Southern Lebanon, alongside long-range standoff interdictions against Iranian and Houthi ballistic launch networks. Deploys world-leading multi-tiered missile defense umbrella (Iron Dome, David\'s Sling, Arrow 2/3).',
    militaryPosture: {
      activePersonnel: '170,000 active + 300,000 mobilized reservists',
      defenseBudget: '$30+ Billion (Wartime Surge)',
      nuclearStatus: 'Undeclared Nuclear Deterrent (~90-200 warheads; Dimona reactor)',
      alliances: ['US-Israel Strategic Partnership', 'Abraham Accords'],
      readiness: 'Continuous Active Combat Operations'
    },
    economicStatus: {
      inflation: '3.5%',
      currency: 'Israeli New Shekel (ILS)',
      foreignReserves: '$215 Billion',
      primaryExports: ['High-Tech Hardware & Software', 'Cybersecurity', 'Defense Systems', 'Cut Diamonds', 'Pharmaceuticals'],
      sanctionsStatus: 'None'
    },
    strategicRisks: [
      'Sustained multi-front missile saturation taxing interceptor stockpiles',
      'Economic fiscal deficits resulting from protracted reservist mobilization',
      'Regional diplomatic fallout and heightened international scrutiny'
    ]
  },
  TW: {
    code: 'TW',
    name: 'Taiwan',
    capital: 'Taipei',
    region: 'East Asia',
    population: '23.4 Million',
    gdp: '$790 Billion',
    leader: 'President Lai Ching-te',
    ciiScore: 62,
    ciiRiskLevel: 'High',
    ciiTrend: 'Escalating',
    bounds: [119.5, 21.8, 122.1, 25.4],
    executiveSummary:
      'Critical geopolitical flashpoint and linchpin of global technology supply chain (produces 90% of world\'s advanced logic microchips via TSMC). Faces continuous PLA coercive grey-zone operations, naval quarantine simulations, and cyber warfare.',
    militaryPosture: {
      activePersonnel: '170,000 + Consociational Reserve Force',
      defenseBudget: '$19 Billion (2.5% of GDP)',
      nuclearStatus: 'Non-Nuclear (Asymmetric Porcupine Defense Strategy)',
      alliances: ['Taiwan Relations Act Security Ties with United States'],
      readiness: 'Heightened Readiness (Anti-blockade drills & civil defense preparation)'
    },
    economicStatus: {
      inflation: '2.1%',
      currency: 'New Taiwan Dollar (TWD)',
      foreignReserves: '$570+ Billion (4th Largest Globally)',
      primaryExports: ['Advanced Semiconductors (TSMC)', 'Electronic Components', 'Optical Equipment', 'IT Hardware'],
      sanctionsStatus: 'None'
    },
    strategicRisks: [
      'Vulnerability to maritime trade blockade or undersea cable severance',
      'Overwhelming missile saturation threat from mainland PLA Rocket Force',
      'Energy security (relies on sea-borne LNG imports with only 8-11 days of strategic reserves)'
    ]
  },
  KP: {
    code: 'KP',
    name: 'North Korea',
    capital: 'Pyongyang',
    region: 'East Asia',
    population: '26 Million',
    gdp: '$25 Billion',
    leader: 'Supreme Leader Kim Jong Un',
    ciiScore: 84,
    ciiRiskLevel: 'Critical',
    ciiTrend: 'Escalating',
    bounds: [124.2, 37.7, 130.7, 43.0],
    executiveSummary:
      'Heavily militarized totalitarian state possessing road-mobile intercontinental ballistic missiles (Hwasong-17/18/19) capable of reaching the US mainland. Formally ratified mutual defense pact with Russia, deploying troops and ballistic artillery to support Russian frontlines in exchange for military-technical transfers.',
    militaryPosture: {
      activePersonnel: '1,280,000 (One of world\'s largest active armies)',
      defenseBudget: 'Estimated 25-30% of National Output',
      nuclearStatus: 'Self-Declared Nuclear Power (~50-80 warheads; thermonuclear capability)',
      alliances: ['Comprehensive Strategic Partnership Treaty with Russia', 'Sino-DPRK Mutual Aid Treaty'],
      readiness: 'High Alert (Regular ICBM & IRBM live-fire flight tests)'
    },
    economicStatus: {
      inflation: 'High / Centrally Planned Rationing',
      currency: 'North Korean Won (KPW)',
      foreignReserves: 'Severely Constrained ($1-2B in illicit crypto & hard currency)',
      primaryExports: ['Illicit Arms Deliveries to Russia', 'Coal (Smuggled)', 'State-Sponsored Cyber Extortion'],
      sanctionsStatus: 'Comprehensive UN Security Council & Western Embargo'
    },
    strategicRisks: [
      'Nuclear accident or unauthorized proliferation of advanced missile telemetry',
      'Direct military border clash along DMZ or Northern Limit Line with South Korea',
      'Deep chronic domestic food and agricultural insecurity'
    ]
  },
  GB: {
    code: 'GB',
    name: 'United Kingdom',
    capital: 'London',
    region: 'Western Europe',
    population: '67.5 Million',
    gdp: '$3.3 Trillion',
    leader: 'Prime Minister Keir Starmer',
    ciiScore: 16,
    ciiRiskLevel: 'Stable',
    ciiTrend: 'Stable',
    bounds: [-8.2, 49.9, 1.8, 58.7],
    executiveSummary:
      'Core NATO nuclear power and permanent UN Security Council member. Key architect of European maritime deterrence and long-range precision weapon supplies to Ukraine (Storm Shadow missiles). Global center for international finance, maritime arbitration, and intelligence alliance networks.',
    militaryPosture: {
      activePersonnel: '142,000',
      defenseBudget: '$68 Billion (2.3% of GDP)',
      nuclearStatus: 'Nuclear Weapons State (Vanguard-class Trident D5 submarine patrol)',
      alliances: ['NATO', 'AUKUS', 'Five Eyes', 'Joint Expeditionary Force (JEF)'],
      readiness: 'Standard NATO High Readiness Force'
    },
    economicStatus: {
      inflation: '2.3%',
      currency: 'British Pound (GBP)',
      foreignReserves: '$180 Billion',
      primaryExports: ['Financial & Professional Services', 'Aerospace & Gas Turbines', 'Pharmaceuticals', 'Machinery'],
      sanctionsStatus: 'Major Sanctions Enforcer (OFSI)'
    },
    strategicRisks: [
      'Undersea communication cable and energy interconnect vulnerability in the North Sea',
      'Fiscal constraints on defense industrial recapitalization',
      'Russian grey-zone cyber attacks and espionage operations targeting state institutions'
    ]
  }
};

export function getCountryIntel(code: string, name?: string): CountryIntelDetails {
  const c = code.toUpperCase();
  if (COUNTRY_INTEL_DATABASE[c]) {
    return COUNTRY_INTEL_DATABASE[c];
  }

  // Fallback intelligent generator for any other country clicked
  const flag = getFlagEmoji(c);
  return {
    code: c,
    name: name || c,
    capital: 'National Capital',
    region: 'International Community',
    population: 'Monitored Sovereign State',
    gdp: 'Developing Market Output',
    leader: 'Head of State',
    ciiScore: 32,
    ciiRiskLevel: 'Watchlist',
    ciiTrend: 'Stable',
    executiveSummary: `${name || c} is a sovereign member of the international community monitored by World Monitor intelligence telemetry. Data feeds track local seismic activity, flight corridors, maritime vessel density, and infrastructure integrity in real time.`,
    militaryPosture: {
      activePersonnel: 'National Armed Forces',
      defenseBudget: 'State Defense Allocation',
      nuclearStatus: 'Non-Nuclear State (NPT Safeguards)',
      alliances: ['United Nations Member State'],
      readiness: 'Standard Peace-Time Posture'
    },
    economicStatus: {
      inflation: 'Nominal Regional Benchmark',
      currency: 'Sovereign National Currency',
      foreignReserves: 'Central Bank Assets',
      primaryExports: ['Manufactured Goods', 'Agricultural Produce', 'Raw Materials'],
      sanctionsStatus: 'Standard Multilateral Trade'
    },
    strategicRisks: [
      'Regional border stability and economic trade integration',
      'Exposure to global commodity price volatility',
      'Critical digital infrastructure cybersecurity posture'
    ]
  };
}
