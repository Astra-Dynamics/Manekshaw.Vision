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
  },
  AF: {
    code: 'AF',
    name: 'Afghanistan',
    capital: 'Kabul',
    region: 'South / Central Asia',
    population: '42.2 Million',
    gdp: '$14.5 Billion',
    leader: 'Supreme Leader Hibatullah Akhundzada (Taliban Administration)',
    ciiScore: 86,
    ciiRiskLevel: 'Critical',
    ciiTrend: 'Escalating',
    bounds: [60.5, 29.4, 74.9, 38.5],
    executiveSummary:
      'Governed by unrecognized de-facto Taliban interim authority facing deep diplomatic and economic isolation. Confronts acute armed resistance from ISKP (Islamic State Khorasan Province) and National Resistance Front. Frequent armed skirmishes with Pakistani border forces along disputed Durand Line.',
    militaryPosture: {
      activePersonnel: '110,000 (Taliban Security Forces + captured US/NATO equipment)',
      defenseBudget: '$1.2 Billion (Estimated)',
      nuclearStatus: 'Non-Nuclear Weapon State',
      alliances: ['None (Unrecognized internationally; bilateral engagement with regional states)'],
      readiness: 'High Alert (Anti-insurgency counter-terror sweeps & border fortifications)'
    },
    economicStatus: {
      inflation: '-6.5% (Severe Liquidity Deficit / Deflation)',
      currency: 'Afghan Afghani (AFN)',
      foreignReserves: '$9.2 Billion (Largely frozen in US/Swiss Bank for International Settlements)',
      primaryExports: ['Agricultural Produce', 'Carpets', 'Dried Fruits & Nuts', 'Raw Gemstones'],
      sanctionsStatus: 'UN Security Council 1988 Sanctions & US Banking Restrictions'
    },
    strategicRisks: [
      'ISKP transnational terror operations targeting diplomatic missions and religious minorities',
      'Escalating border friction, airstrikes, and trade chokepoints along Durand Line with Pakistan',
      'Acute humanitarian and food security crisis under international aid reductions'
    ]
  },
  PK: {
    code: 'PK',
    name: 'Pakistan',
    capital: 'Islamabad',
    region: 'South Asia',
    population: '241.5 Million',
    gdp: '$375 Billion',
    leader: 'Prime Minister Shehbaz Sharif',
    ciiScore: 74,
    ciiRiskLevel: 'High',
    ciiTrend: 'Escalating',
    bounds: [60.9, 23.7, 75.4, 37.1],
    executiveSummary:
      'Major non-NATO ally confronting simultaneous domestic political volatility, structural debt obligations, and active multi-front insurgencies from Balochistan Liberation Army (BLA) and Tehrik-i-Taliban Pakistan (TTP). Maintains active strategic defense partnership with China (CPEC).',
    militaryPosture: {
      activePersonnel: '654,000 (6th Largest Globally)',
      defenseBudget: '$7.6 Billion (15.8% of federal budget)',
      nuclearStatus: 'Declared Nuclear Weapons State (~170 warheads; Shaheen/Ghauri ballistic delivery)',
      alliances: ['CPEC Strategic Partnership with China', 'SCO', 'OIC'],
      readiness: 'Heightened Alert (Internal counter-terror operations & western border deployments)'
    },
    economicStatus: {
      inflation: '9.6%',
      currency: 'Pakistani Rupee (PKR)',
      foreignReserves: '$9.5 Billion (Backed by IMF Extended Fund Facility)',
      primaryExports: ['Textiles & Garments', 'Rice', 'Leather Goods', 'Surgical Instruments'],
      sanctionsStatus: 'FATF Compliant (Exited Grey List)'
    },
    strategicRisks: [
      'Surge in BLA militant ambushes targeting Chinese engineers and military convoys in Balochistan',
      'Cross-border kinetic strikes and militant infiltration across Afghan Durand Line',
      'Severe fiscal vulnerability and dependence on external bilateral debt rollovers'
    ]
  },
  JP: {
    code: 'JP',
    name: 'Japan',
    capital: 'Tokyo',
    region: 'East Asia',
    population: '124.5 Million',
    gdp: '$4.2 Trillion',
    leader: 'Prime Minister Shigeru Ishiba',
    ciiScore: 18,
    ciiRiskLevel: 'Stable',
    ciiTrend: 'Stable',
    bounds: [129.5, 31.0, 145.8, 45.5],
    executiveSummary:
      'Cornerstone of democratic security architecture in Northeast Asia. Implementing historic defense posture overhaul to double defense spending to 2% of GDP, acquiring counterstrike Tomahawk cruise missiles, and fortifying southwestern Nansei island chain.',
    militaryPosture: {
      activePersonnel: '247,000 (Japan Self-Defense Forces) + 54,000 US Forward Personnel',
      defenseBudget: '$56 Billion (Surging toward 2% GDP by 2027)',
      nuclearStatus: 'Non-Nuclear (Protected by US Extended Nuclear Umbrella)',
      alliances: ['US-Japan Security Treaty', 'QUAD', 'Trilateral Partnership with US & South Korea'],
      readiness: 'Heightened Readiness (East China Sea air scramble frequency at historic peak)'
    },
    economicStatus: {
      inflation: '2.5%',
      currency: 'Japanese Yen (JPY)',
      foreignReserves: '$1.25 Trillion (2nd Largest Globally)',
      primaryExports: ['Automobiles & Parts', 'Semiconductor Manufacturing Equipment', 'Industrial Robotics', 'Steel'],
      sanctionsStatus: 'Major G7 Sanctions Enforcer'
    },
    strategicRisks: [
      'PLA Navy & Air Force incursions around Senkaku Islands in East China Sea',
      'North Korean ballistic missile trajectories crossing Japanese sovereign airspace',
      'Demographic contractions constraining Self-Defense Forces military recruitment'
    ]
  },
  KR: {
    code: 'KR',
    name: 'South Korea',
    capital: 'Seoul',
    region: 'East Asia',
    population: '51.7 Million',
    gdp: '$1.7 Trillion',
    leader: 'President Yoon Suk Yeol',
    ciiScore: 34,
    ciiRiskLevel: 'Watchlist',
    ciiTrend: 'Stable',
    bounds: [126.0, 34.0, 129.6, 38.6],
    executiveSummary:
      'High-technology industrial powerhouse facing direct existential threat across 250km Demilitarized Zone (DMZ) from nuclear-armed DPRK. Key global defense exporter (K2 Black Panther tanks, K9 Thunder howitzers) and core supplier of memory semiconductors.',
    militaryPosture: {
      activePersonnel: '500,000 + 28,500 US Forces Korea (USFK)',
      defenseBudget: '$44.5 Billion',
      nuclearStatus: 'Non-Nuclear (Covered by US-ROK Nuclear Consultative Group)',
      alliances: ['ROK-US Mutual Defense Treaty', 'Trilateral Security Framework (US-Japan-ROK)'],
      readiness: 'High Alert (Kill Chain pre-emptive strike & KAMD air defense integration)'
    },
    economicStatus: {
      inflation: '1.6%',
      currency: 'South Korean Won (KRW)',
      foreignReserves: '$415 Billion',
      primaryExports: ['Memory Chips (Samsung, SK Hynix)', 'Automobiles', 'Petroleum Products', 'Shipbuilding'],
      sanctionsStatus: 'Enforcer of UN & Coalition Export Controls'
    },
    strategicRisks: [
      'North Korean artillery and tactical nuclear threats within range of Greater Seoul Metropolitan Area',
      'Deep economic exposure to Chinese retaliatory trade restrictions',
      'Lowest fertility rate in the world impacting military manpower sustainability'
    ]
  },
  SA: {
    code: 'SA',
    name: 'Saudi Arabia',
    capital: 'Riyadh',
    region: 'Middle East',
    population: '36.5 Million',
    gdp: '$1.1 Trillion',
    leader: 'Crown Prince Mohammed bin Salman (Prime Minister)',
    ciiScore: 42,
    ciiRiskLevel: 'Watchlist',
    ciiTrend: 'Stable',
    bounds: [34.5, 16.3, 55.7, 32.2],
    executiveSummary:
      'De-facto leader of OPEC+ and principal Arab economy executing comprehensive "Vision 2030" economic diversification. Pursuing strategic balancing between long-standing US security guarantees, growing energy ties with China, and détente with Iran.',
    militaryPosture: {
      activePersonnel: '257,000',
      defenseBudget: '$71.7 Billion (5th Largest Globally)',
      nuclearStatus: 'Non-Nuclear (Pursuing civilian nuclear energy framework)',
      alliances: ['Gulf Cooperation Council (GCC)', 'Strategic Defense Ties with US'],
      readiness: 'High Alert (Integrated air defense safeguarding oil refineries against drone/missiles)'
    },
    economicStatus: {
      inflation: '1.7%',
      currency: 'Saudi Riyal (SAR - Pegged to USD at 3.75)',
      foreignReserves: '$455 Billion',
      primaryExports: ['Crude Petroleum', 'Refined Petroleum Products', 'Petrochemical Polymers'],
      sanctionsStatus: 'None'
    },
    strategicRisks: [
      'Houthi drone and ballistic missile threats originating from northern Yemen',
      'Global oil demand volatility impacting Vision 2030 megaproject financing',
      'Maritime vulnerability in Strait of Hormuz and Bab el-Mandeb chokepoints'
    ]
  },
  TR: {
    code: 'TR',
    name: 'Turkey',
    capital: 'Ankara',
    region: 'Middle East / Eurasia',
    population: '85.3 Million',
    gdp: '$1.15 Trillion',
    leader: 'President Recep Tayyip Erdogan',
    ciiScore: 48,
    ciiRiskLevel: 'Watchlist',
    ciiTrend: 'Stable',
    bounds: [25.7, 35.8, 44.8, 42.1],
    executiveSummary:
      'Transcontinental NATO power controlling the strategic Bosphorus and Dardanelles straits (Montreux Convention). Boasts rapidly expanding indigenous defense aerospace sector (Bayraktar TB2/Akinci, KAAN 5th-gen fighter). Balances NATO membership with active commercial engagement with Russia.',
    militaryPosture: {
      activePersonnel: '425,000 (2nd Largest Army in NATO)',
      defenseBudget: '$40 Billion (Surging recapitalization)',
      nuclearStatus: 'Non-Nuclear (Hosts US B61 nuclear gravity bombs at Incirlik Air Base under NATO nuclear sharing)',
      alliances: ['NATO (Article 5)', 'Organization of Turkic States'],
      readiness: 'High Operational Deployment (Cross-border operations in northern Syria and Iraq)'
    },
    economicStatus: {
      inflation: '49.4% (Orthodox Tightening under Central Bank)',
      currency: 'Turkish Lira (TRY)',
      foreignReserves: '$156 Billion (Gross Record High)',
      primaryExports: ['Automotive Vehicles & Parts', 'Machinery & Steel', 'Defense Drones', 'Apparel'],
      sanctionsStatus: 'Subject to US CAATSA sanctions on S-400 procurement; otherwise compliant'
    },
    strategicRisks: [
      'Chronic currency depreciation and high domestic inflation rate',
      'Active counter-terror engagements against PKK in Qandil Mountains and YPG in northern Syria',
      'Maritime boundary and airspace sovereignty disputes with Greece in the Aegean Sea'
    ]
  },
  SY: {
    code: 'SY',
    name: 'Syria',
    capital: 'Damascus',
    region: 'Middle East',
    population: '22.1 Million',
    gdp: '$19 Billion',
    leader: 'President Bashar al-Assad',
    ciiScore: 91,
    ciiRiskLevel: 'Critical',
    ciiTrend: 'Escalating',
    bounds: [35.7, 32.3, 42.4, 37.3],
    executiveSummary:
      'Sovereignty fractured by thirteen years of civil war, with multiple foreign military occupations (Russian naval base in Tartus, Russian air base in Hmeimim, Turkish presence in northern buffer zones, US base at Al-Tanf). Targeted continuously by Israeli airstrikes against Iranian weapons transit corridors.',
    militaryPosture: {
      activePersonnel: '130,000 (Syrian Arab Army + foreign paramilitary proxies)',
      defenseBudget: '$1.8 Billion',
      nuclearStatus: 'Non-Nuclear (Al-Kibar reactor destroyed by Israel in 2007)',
      alliances: ['Strategic Military Alliance with Russia and Iran', 'Axis of Resistance'],
      readiness: 'Fragile Wartime Standoff Footing'
    },
    economicStatus: {
      inflation: '80%+',
      currency: 'Syrian Pound (SYP - Catastrophic Devaluation)',
      foreignReserves: '< $200 Million',
      primaryExports: ['Captagon (Illicit Amphetamines)', 'Phosphates', 'Agricultural Commodities'],
      sanctionsStatus: 'Severe US Caesar Act & European Union Comprehensive Sanctions'
    },
    strategicRisks: [
      'Frequent Israeli precision strikes neutralizing IRGC command personnel and weapons depots',
      'Residual ISIS sleeper cells launching ambushes across Badia desert',
      'Economic collapse and acute energy/fuel shortages paralyzing state services'
    ]
  },
  LB: {
    code: 'LB',
    name: 'Lebanon',
    capital: 'Beirut',
    region: 'Middle East',
    population: '5.4 Million',
    gdp: '$21 Billion',
    leader: 'Caretaker Prime Minister Najib Mikati',
    ciiScore: 89,
    ciiRiskLevel: 'Critical',
    ciiTrend: 'Escalating',
    bounds: [35.1, 33.0, 36.6, 34.7],
    executiveSummary:
      'Active frontline theater between Israel and Hezbollah following regional war spillover. Suffers from unprecedented financial breakdown (loss of 98% of currency value since 2019) and prolonged presidential vacancy, leaving official state apparatus incapacitated.',
    militaryPosture: {
      activePersonnel: '73,000 (Lebanese Armed Forces - funded largely by foreign aid) vs. Hezbollah paramilitary arm',
      defenseBudget: '$900 Million',
      nuclearStatus: 'Non-Nuclear',
      alliances: ['None (Hezbollah component integral to Iranian Axis of Resistance)'],
      readiness: 'High Alert (Territorial defense along Litani River & Blue Line)'
    },
    economicStatus: {
      inflation: '35%+',
      currency: 'Lebanese Pound (LBP)',
      foreignReserves: '$10 Billion',
      primaryExports: ['Jewelry', 'Chemical Products', 'Agricultural Fruits & Wines'],
      sanctionsStatus: 'Hezbollah-affiliated financial entities sanctioned by US Treasury'
    },
    strategicRisks: [
      'Devastating infrastructure destruction and mass displacement across southern Lebanon and Dahieh',
      'Complete paralysis of constitutional institutions and banking sector insolvency',
      'Sectarian friction and risk of renewed domestic civil fracture'
    ]
  },
  YE: {
    code: 'YE',
    name: 'Yemen',
    capital: "Sana'a / Aden",
    region: 'Middle East',
    population: '34.4 Million',
    gdp: '$21 Billion',
    leader: 'Rashad al-Alimi (PLC Chairman) / Abdul-Malik al-Houthi (Ansarallah Leader)',
    ciiScore: 92,
    ciiRiskLevel: 'Critical',
    ciiTrend: 'Escalating',
    bounds: [42.5, 12.1, 53.0, 19.0],
    executiveSummary:
      'Divided between internationally recognized Presidential Leadership Council in Aden and Iranian-backed Houthi Ansarallah governing Sanaa and northern highlands. Houthis enforce maritime interdiction against commercial shipping in Red Sea and Bab el-Mandeb strait using anti-ship ballistic missiles and drone boats.',
    militaryPosture: {
      activePersonnel: 'Estimated 200,000+ across divided factions (Houthis + PLC/STC Forces)',
      defenseBudget: 'Disintegrated Sovereign Accounting',
      nuclearStatus: 'Non-Nuclear',
      alliances: ['Houthis allied with Axis of Resistance; PLC backed by Saudi Arabia & UAE'],
      readiness: 'Active Kinetic Operations (Red Sea maritime strikes and coalition retaliation)'
    },
    economicStatus: {
      inflation: '25%+',
      currency: 'Yemeni Rial (YER - Divergent dual exchange rates)',
      foreignReserves: '< $800 Million (Central Bank in Aden)',
      primaryExports: ['Crude Oil (Interrupted)', 'Scrap Metal', 'Fish'],
      sanctionsStatus: 'Houthis designated as Specially Designated Global Terrorists by US'
    },
    strategicRisks: [
      'US and UK coalition strikes degrading Houthi missile launch complexes and radar sites',
      'Severe maritime shipping insurance hikes and rerouting around Cape of Good Hope',
      'One of the world\'s most protracted humanitarian catastrophes with 17M food insecure'
    ]
  },
  IQ: {
    code: 'IQ',
    name: 'Iraq',
    capital: 'Baghdad',
    region: 'Middle East',
    population: '44.5 Million',
    gdp: '$250 Billion',
    leader: 'Prime Minister Mohammed Shia al-Sudani',
    ciiScore: 68,
    ciiRiskLevel: 'High',
    ciiTrend: 'Stable',
    bounds: [38.8, 29.1, 48.6, 37.4],
    executiveSummary:
      'Major OPEC oil producer navigating precarious equilibrium between strategic security cooperation with the United States and pervasive political influence from Iranian-aligned Popular Mobilization Forces (PMF / Hashd al-Shaabi). Negotiating timeline for withdrawal of US-led anti-ISIS coalition forces.',
    militaryPosture: {
      activePersonnel: '200,000 Iraqi Security Forces + 160,000 Popular Mobilization Forces + 2,500 US Troops',
      defenseBudget: '$11.5 Billion',
      nuclearStatus: 'Non-Nuclear State (Osirak reactor destroyed 1981)',
      alliances: ['Strategic Framework Agreement with United States', 'Security Coordination with Iran'],
      readiness: 'Moderate Alert (Counter-insurgency sweeps in Anbar and Kirkuk provinces)'
    },
    economicStatus: {
      inflation: '3.0%',
      currency: 'Iraqi Dinar (IQD)',
      foreignReserves: '$100+ Billion (Supported by high oil sales)',
      primaryExports: ['Crude Petroleum (95% of state revenue)'],
      sanctionsStatus: 'Central Bank under tight US Federal Reserve scrutiny for dollar transfers to Iran'
    },
    strategicRisks: [
      'PMF militias launching drone attacks against US garrisons and Israeli territory',
      'Turkish cross-border air and ground campaigns targeting PKK positions in Iraqi Kurdistan',
      'Extreme vulnerability to climate-induced water scarcity along Tigris and Euphrates rivers'
    ]
  },
  DE: {
    code: 'DE',
    name: 'Germany',
    capital: 'Berlin',
    region: 'Western Europe',
    population: '84.4 Million',
    gdp: '$4.5 Trillion (3rd Largest Globally)',
    leader: 'Chancellor Olaf Scholz',
    ciiScore: 18,
    ciiRiskLevel: 'Stable',
    ciiTrend: 'Stable',
    bounds: [5.9, 47.3, 15.0, 55.1],
    executiveSummary:
      'Economic anchor of the European Union executing "Zeitenwende" defense transformation, establishing a €100 Billion military modernization special fund and committing permanently to meet NATO\'s 2% GDP defense spending target. Second-largest financial and military donor to Ukraine.',
    militaryPosture: {
      activePersonnel: '181,000 (Bundeswehr) + 35,000 Forward US Personnel',
      defenseBudget: '$73 Billion (2.1% of GDP)',
      nuclearStatus: 'Non-Nuclear (Participates in NATO Nuclear Sharing via Tornado/F-35A dual-capable aircraft)',
      alliances: ['NATO (Article 5)', 'European Union PESCO', 'Joint Expeditionary Force Partner'],
      readiness: 'High Readiness (Leading NATO Forward Presence Battlegroup in Lithuania)'
    },
    economicStatus: {
      inflation: '1.6%',
      currency: 'Euro (EUR)',
      foreignReserves: '$320 Billion',
      primaryExports: ['Motor Vehicles & Components', 'Machinery & Equipment', 'Chemicals', 'Pharmaceuticals'],
      sanctionsStatus: 'Key EU Sanctions Architect'
    },
    strategicRisks: [
      'Industrial competitiveness headwinds stemming from high structural energy costs',
      'Vulnerability of Baltic Sea energy cables and offshore wind infrastructure to hybrid sabotage',
      'Defense equipment procurement backlogs and artillery ammunition replenishment cycles'
    ]
  },
  FR: {
    code: 'FR',
    name: 'France',
    capital: 'Paris',
    region: 'Western Europe',
    population: '68.2 Million',
    gdp: '$3.1 Trillion',
    leader: 'President Emmanuel Macron',
    ciiScore: 24,
    ciiRiskLevel: 'Stable',
    ciiTrend: 'Stable',
    bounds: [-5.1, 41.3, 9.6, 51.1],
    executiveSummary:
      'Permanent UN Security Council member and sole European Union sovereign nuclear power. Strong advocate for European "strategic autonomy" possessing independent nuclear triad delivery, carrier strike group (Charles de Gaulle), and expeditionary military bases across Indo-Pacific and Africa.',
    militaryPosture: {
      activePersonnel: '205,000',
      defenseBudget: '$54 Billion (2.1% of GDP under Military Programming Law 2024-2030)',
      nuclearStatus: 'Independent Sovereign Nuclear Arsenal (~290 warheads; ASMP-A missiles & Triomphant SSBNs)',
      alliances: ['NATO', 'European Union', 'UNSC Permanent Member'],
      readiness: 'High Operational Deployment (Carrier strike group and eastern flank air patrols)'
    },
    economicStatus: {
      inflation: '1.2%',
      currency: 'Euro (EUR)',
      foreignReserves: '$250 Billion',
      primaryExports: ['Aerospace (Airbus)', 'Defense Hardware (Rafale)', 'Luxury Goods', 'Pharmaceuticals', 'Nuclear Technology'],
      sanctionsStatus: 'EU Sanctions Enforcer'
    },
    strategicRisks: [
      'High sovereign debt burden limiting rapid long-term military spending expansion',
      'Loss of strategic influence in Sahel region following military coups in Niger, Mali, and Burkina Faso',
      'Domestic political gridlock following snap legislative elections'
    ]
  },
  CA: {
    code: 'CA',
    name: 'Canada',
    capital: 'Ottawa',
    region: 'North America',
    population: '40.5 Million',
    gdp: '$2.1 Trillion',
    leader: 'Prime Minister Justin Trudeau',
    ciiScore: 15,
    ciiRiskLevel: 'Stable',
    ciiTrend: 'Stable',
    bounds: [-141.0, 41.7, -52.6, 83.1],
    executiveSummary:
      'Founding member of NATO and co-defender of North American airspace through NORAD (North American Aerospace Defense Command). Upgrading Arctic radar surveillance (Over-The-Horizon Radar) and maritime patrol aircraft (P-8A Poseidon) to protect sovereign Northwest Passage claims.',
    militaryPosture: {
      activePersonnel: '68,000 (Canadian Armed Forces)',
      defenseBudget: '$29 Billion (Targeting 2% NATO benchmark by 2032)',
      nuclearStatus: 'Non-Nuclear (Protected by NORAD & NATO Umbrella)',
      alliances: ['NORAD', 'NATO', 'Five Eyes', 'G7'],
      readiness: 'Standard NATO Readiness (Leading Multinational Battlegroup in Latvia)'
    },
    economicStatus: {
      inflation: '1.6%',
      currency: 'Canadian Dollar (CAD)',
      foreignReserves: '$115 Billion',
      primaryExports: ['Crude Bitumen & Oil', 'Automobiles', 'Natural Gas', 'Gold & Minerals', 'Wheat & Potash'],
      sanctionsStatus: 'Autonomous Sanctions Regime (SEMA) aligned with G7'
    },
    strategicRisks: [
      'Russian and Chinese naval and airborne activity challenging sovereign Arctic maritime passages',
      'Chronic military equipment procurement delays and personnel retention deficits',
      'Wildfire and severe climate anomalies threatening critical transport corridors'
    ]
  },
  AU: {
    code: 'AU',
    name: 'Australia',
    capital: 'Canberra',
    region: 'Indo-Pacific / Oceania',
    population: '26.8 Million',
    gdp: '$1.7 Trillion',
    leader: 'Prime Minister Anthony Albanese',
    ciiScore: 14,
    ciiRiskLevel: 'Stable',
    ciiTrend: 'Stable',
    bounds: [112.9, -43.7, 159.3, -10.0],
    executiveSummary:
      'Key maritime democracy and southern anchor of Indo-Pacific deterrence. Implementing AUKUS Pillar 1 (conventionally armed nuclear-powered attack submarines) and Pillar 2 (hypersonics, quantum, and AI warfare). Enhancing northern bases in Darwin and Tindal for joint operations with US forces.',
    militaryPosture: {
      activePersonnel: '60,000 (Australian Defence Force) + US Marine Rotational Force - Darwin',
      defenseBudget: '$35 Billion (Surging toward 2.4% of GDP under National Defence Strategy)',
      nuclearStatus: 'Non-Nuclear (AUKUS submarines will use sealed naval reactors without domestic enrichment)',
      alliances: ['AUKUS', 'ANZUS Treaty', 'QUAD', 'Five Eyes'],
      readiness: 'High Readiness (Maritime surveillance over South China Sea and Indian Ocean)'
    },
    economicStatus: {
      inflation: '2.8%',
      currency: 'Australian Dollar (AUD)',
      foreignReserves: '$65 Billion',
      primaryExports: ['Iron Ore & Concentrates', 'Coal', 'LNG', 'Gold', 'Critical Rare Earth Minerals'],
      sanctionsStatus: 'Active Autonomous Sanctions Enforcer'
    },
    strategicRisks: [
      'High trade exposure to Chinese demand for bulk commodities and critical minerals',
      'Vulnerability of long sea lines of communication and subsea fiber connectivity',
      'Pacific island diplomacy competition with China (Solomon Islands, Vanuatu)'
    ]
  },
  PH: {
    code: 'PH',
    name: 'Philippines',
    capital: 'Manila',
    region: 'Southeast Asia / Indo-Pacific',
    population: '115.5 Million',
    gdp: '$440 Billion',
    leader: 'President Ferdinand Marcos Jr.',
    ciiScore: 52,
    ciiRiskLevel: 'Elevated',
    ciiTrend: 'Escalating',
    bounds: [116.9, 4.6, 126.6, 21.1],
    executiveSummary:
      'Critical front-line state facing intense maritime grey-zone coercion from China Coast Guard and maritime militia in the West Philippine Sea (Second Thomas Shoal, Sabina Shoal). Expanding US access to military sites under Enhanced Defense Cooperation Agreement (EDCA).',
    militaryPosture: {
      activePersonnel: '143,000 (Armed Forces of the Philippines)',
      defenseBudget: '$4.5 Billion (Horizon 3 Modernization Program)',
      nuclearStatus: 'Non-Nuclear State (Treaty of Bangkok SEANWFZ)',
      alliances: ['US-Philippines Mutual Defense Treaty (1951)', 'Trilateral Defense Pact with US & Japan'],
      readiness: 'Heightened Maritime Alert (Frequent resupply missions to BRP Sierra Madre)'
    },
    economicStatus: {
      inflation: '1.9%',
      currency: 'Philippine Peso (PHP)',
      foreignReserves: '$107 Billion',
      primaryExports: ['Integrated Circuits & Electronic Components', 'Office Equipment', 'Nickel Ore', 'Agricultural Commodities'],
      sanctionsStatus: 'None'
    },
    strategicRisks: [
      'Water cannon and ramming collisions in exclusive economic zone (EEZ) risking invocation of US Mutual Defense Treaty',
      'Internal security operations against communist insurgents and extremist splinter groups in Mindanao',
      'Vulnerability to intense seasonal super-typhoons disrupting infrastructure networks'
    ]
  }
};

interface CountryMetadataLookupItem {
  capital: string;
  region: string;
  population: string;
  gdp: string;
  leader: string;
  ciiScore: number;
  ciiRiskLevel: 'Critical' | 'High' | 'Elevated' | 'Watchlist' | 'Stable';
  ciiTrend: 'Escalating' | 'Stable' | 'De-escalating';
  activePersonnel: string;
  defenseBudget: string;
  currency: string;
  inflation: string;
  foreignReserves: string;
  primaryExports: string[];
}

const EXTENDED_COUNTRY_LOOKUP: Record<string, CountryMetadataLookupItem> = {
  BR: { capital: 'Brasília', region: 'South America', population: '215 Million', gdp: '$2.17 Trillion', leader: 'President Luiz Inácio Lula da Silva', ciiScore: 36, ciiRiskLevel: 'Watchlist', ciiTrend: 'Stable', activePersonnel: '360,000', defenseBudget: '$23 Billion', currency: 'Brazilian Real (BRL)', inflation: '4.4%', foreignReserves: '$350 Billion', primaryExports: ['Soybeans', 'Crude Petroleum', 'Iron Ore', 'Beef & Poultry'] },
  MX: { capital: 'Mexico City', region: 'North America / Latin America', population: '128.5 Million', gdp: '$1.79 Trillion', leader: 'President Claudia Sheinbaum', ciiScore: 46, ciiRiskLevel: 'Watchlist', ciiTrend: 'Stable', activePersonnel: '280,000', defenseBudget: '$9.5 Billion', currency: 'Mexican Peso (MXN)', inflation: '4.5%', foreignReserves: '$225 Billion', primaryExports: ['Automobiles & Parts', 'Computers', 'Crude Oil', 'Medical Instruments'] },
  ID: { capital: 'Jakarta / Nusantara', region: 'Southeast Asia', population: '277.5 Million', gdp: '$1.37 Trillion', leader: 'President Prabowo Subianto', ciiScore: 38, ciiRiskLevel: 'Watchlist', ciiTrend: 'Stable', activePersonnel: '400,000', defenseBudget: '$9.2 Billion', currency: 'Indonesian Rupiah (IDR)', inflation: '1.8%', foreignReserves: '$150 Billion', primaryExports: ['Coal Briquettes', 'Palm Oil', 'Ferronickel', 'Petroleum Gas'] },
  IT: { capital: 'Rome', region: 'Southern Europe', population: '58.9 Million', gdp: '$2.25 Trillion', leader: 'Prime Minister Giorgia Meloni', ciiScore: 22, ciiRiskLevel: 'Stable', ciiTrend: 'Stable', activePersonnel: '165,000', defenseBudget: '$32 Billion', currency: 'Euro (EUR)', inflation: '0.7%', foreignReserves: '$240 Billion', primaryExports: ['Pharmaceuticals', 'Industrial Machinery', 'Automobiles', 'Luxury Fashion'] },
  ES: { capital: 'Madrid', region: 'Southern Europe', population: '48.6 Million', gdp: '$1.58 Trillion', leader: 'Prime Minister Pedro Sánchez', ciiScore: 20, ciiRiskLevel: 'Stable', ciiTrend: 'Stable', activePersonnel: '120,000', defenseBudget: '$23 Billion', currency: 'Euro (EUR)', inflation: '1.5%', foreignReserves: '$95 Billion', primaryExports: ['Motor Vehicles', 'Pharmaceuticals', 'Refined Petroleum', 'Olive Oil & Produce'] },
  PL: { capital: 'Warsaw', region: 'Central / Eastern Europe', population: '37.8 Million', gdp: '$850 Billion', leader: 'Prime Minister Donald Tusk', ciiScore: 32, ciiRiskLevel: 'Watchlist', ciiTrend: 'Stable', activePersonnel: '215,000', defenseBudget: '$35 Billion (4.1% of GDP - Highest in NATO)', currency: 'Polish Zloty (PLN)', inflation: '4.9%', foreignReserves: '$200 Billion', primaryExports: ['Machinery & Electronics', 'Automotive Parts', 'Furniture', 'Agri-food'] },
  NL: { capital: 'Amsterdam / The Hague', region: 'Western Europe', population: '17.9 Million', gdp: '$1.1 Trillion', leader: 'Prime Minister Dick Schoof', ciiScore: 14, ciiRiskLevel: 'Stable', ciiTrend: 'Stable', activePersonnel: '41,000', defenseBudget: '$24 Billion', currency: 'Euro (EUR)', inflation: '3.5%', foreignReserves: '$70 Billion', primaryExports: ['Semiconductor Lithography (ASML)', 'Refined Petroleum', 'Machinery', 'Flowers & Agriculture'] },
  EG: { capital: 'Cairo', region: 'North Africa / Middle East', population: '112 Million', gdp: '$395 Billion', leader: 'President Abdel Fattah el-Sisi', ciiScore: 64, ciiRiskLevel: 'High', ciiTrend: 'Escalating', activePersonnel: '440,000', defenseBudget: '$5.5 Billion', currency: 'Egyptian Pound (EGP)', inflation: '26.4%', foreignReserves: '$46.5 Billion', primaryExports: ['Petroleum Gas', 'Crude Oil', 'Fertilizers', 'Textiles'] },
  ZA: { capital: 'Pretoria / Cape Town', region: 'Southern Africa', population: '60.6 Million', gdp: '$380 Billion', leader: 'President Cyril Ramaphosa', ciiScore: 48, ciiRiskLevel: 'Watchlist', ciiTrend: 'Stable', activePersonnel: '73,000', defenseBudget: '$3.2 Billion', currency: 'South African Rand (ZAR)', inflation: '3.8%', foreignReserves: '$63 Billion', primaryExports: ['Platinum & Palladium', 'Gold', 'Iron Ore', 'Automobiles'] },
  NG: { capital: 'Abuja', region: 'West Africa', population: '223.8 Million', gdp: '$375 Billion', leader: 'President Bola Tinubu', ciiScore: 72, ciiRiskLevel: 'High', ciiTrend: 'Escalating', activePersonnel: '143,000', defenseBudget: '$3.1 Billion', currency: 'Nigerian Naira (NGN)', inflation: '32.7%', foreignReserves: '$38.5 Billion', primaryExports: ['Crude Petroleum', 'LNG', 'Cocoa Beans', 'Fertilizers'] },
  AR: { capital: 'Buenos Aires', region: 'South America', population: '46.7 Million', gdp: '$640 Billion', leader: 'President Javier Milei', ciiScore: 44, ciiRiskLevel: 'Watchlist', ciiTrend: 'Stable', activePersonnel: '84,000', defenseBudget: '$3.0 Billion', currency: 'Argentine Peso (ARS)', inflation: '209% (Decelerating)', foreignReserves: '$28 Billion', primaryExports: ['Soymeal & Soybean Oil', 'Corn', 'Lithium & Minerals', 'Automotive Trucks'] },
  VN: { capital: 'Hanoi', region: 'Southeast Asia', population: '99.5 Million', gdp: '$430 Billion', leader: 'General Secretary To Lam', ciiScore: 32, ciiRiskLevel: 'Watchlist', ciiTrend: 'Stable', activePersonnel: '482,000', defenseBudget: '$7.9 Billion', currency: 'Vietnamese Dong (VND)', inflation: '2.6%', foreignReserves: '$90 Billion', primaryExports: ['Smartphones & Electronics', 'Textiles & Footwear', 'Coffee', 'Integrated Circuits'] },
  TH: { capital: 'Bangkok', region: 'Southeast Asia', population: '71.8 Million', gdp: '$515 Billion', leader: 'Prime Minister Paetongtarn Shinawatra', ciiScore: 38, ciiRiskLevel: 'Watchlist', ciiTrend: 'Stable', activePersonnel: '360,000', defenseBudget: '$5.8 Billion', currency: 'Thai Baht (THB)', inflation: '0.6%', foreignReserves: '$225 Billion', primaryExports: ['Automobiles & Parts', 'Hard Drives & Circuits', 'Rubber', 'Refined Petroleum'] },
  MY: { capital: 'Kuala Lumpur', region: 'Southeast Asia', population: '34.3 Million', gdp: '$435 Billion', leader: 'Prime Minister Anwar Ibrahim', ciiScore: 28, ciiRiskLevel: 'Stable', ciiTrend: 'Stable', activePersonnel: '115,000', defenseBudget: '$4.3 Billion', currency: 'Malaysian Ringgit (MYR)', inflation: '1.9%', foreignReserves: '$118 Billion', primaryExports: ['Semiconductors & Electronic Components', 'Petroleum Gas', 'Palm Oil'] },
  SG: { capital: 'Singapore', region: 'Southeast Asia', population: '5.9 Million', gdp: '$500 Billion', leader: 'Prime Minister Lawrence Wong', ciiScore: 10, ciiRiskLevel: 'Stable', ciiTrend: 'Stable', activePersonnel: '72,000', defenseBudget: '$15 Billion (3.0% of GDP)', currency: 'Singapore Dollar (SGD)', inflation: '1.8%', foreignReserves: '$380 Billion', primaryExports: ['High-Tech Electronics', 'Refined Petroleum', 'Biomedicals', 'Financial Services'] },
  BD: { capital: 'Dhaka', region: 'South Asia', population: '171 Million', gdp: '$455 Billion', leader: 'Chief Adviser Muhammad Yunus (Interim Administration)', ciiScore: 66, ciiRiskLevel: 'High', ciiTrend: 'Escalating', activePersonnel: '160,000', defenseBudget: '$3.8 Billion', currency: 'Bangladeshi Taka (BDT)', inflation: '9.9%', foreignReserves: '$25 Billion', primaryExports: ['Ready-made Garments', 'Knitwear', 'Jute Goods', 'Leather'] },
  MM: { capital: 'Naypyidaw', region: 'Southeast Asia', population: '54.5 Million', gdp: '$65 Billion', leader: 'Senior General Min Aung Hlaing (Military Junta)', ciiScore: 94, ciiRiskLevel: 'Critical', ciiTrend: 'Escalating', activePersonnel: '150,000', defenseBudget: '$2.7 Billion', currency: 'Myanmar Kyat (MMK)', inflation: '28%+', foreignReserves: '$3.5 Billion', primaryExports: ['Natural Gas', 'Gems & Jade', 'Garments', 'Rare Earth Minerals'] }
};

export function getCountryIntel(code: string, name?: string): CountryIntelDetails {
  const c = code.toUpperCase();
  if (COUNTRY_INTEL_DATABASE[c]) {
    return COUNTRY_INTEL_DATABASE[c];
  }

  const lookup = EXTENDED_COUNTRY_LOOKUP[c];
  const countryName = name || c;

  if (lookup) {
    return {
      code: c,
      name: countryName,
      capital: lookup.capital,
      region: lookup.region,
      population: lookup.population,
      gdp: lookup.gdp,
      leader: lookup.leader,
      ciiScore: lookup.ciiScore,
      ciiRiskLevel: lookup.ciiRiskLevel,
      ciiTrend: lookup.ciiTrend,
      executiveSummary: `${countryName} is an active sovereign state in ${lookup.region} monitored under MANEKSHAW.VISION geopolitical situational telemetry. High-frequency tracking monitors defense posture, trade chokepoints, airspace integrity, and critical economic infrastructure.`,
      militaryPosture: {
        activePersonnel: lookup.activePersonnel,
        defenseBudget: lookup.defenseBudget,
        nuclearStatus: 'Non-Nuclear Weapon State (IAEA Safeguards)',
        alliances: ['United Nations Member State', 'Regional Security Frameworks'],
        readiness: 'Standard Readiness Posture'
      },
      economicStatus: {
        inflation: lookup.inflation,
        currency: lookup.currency,
        foreignReserves: lookup.foreignReserves,
        primaryExports: lookup.primaryExports,
        sanctionsStatus: 'Compliant with International Trade Regulations'
      },
      strategicRisks: [
        'Regional economic stability and trade corridor access',
        'Vulnerability to global commodity supply chain disruptions',
        'Cybersecurity integrity of critical sovereign digital networks'
      ]
    };
  }

  // Realistic regional fallback (NO placeholder "World Monitor" strings)
  return {
    code: c,
    name: countryName,
    capital: 'Sovereign Capital',
    region: 'Global Theater',
    population: 'Regional Sovereign Population',
    gdp: 'Sovereign Output Matrix',
    leader: 'Sovereign Government Leadership',
    ciiScore: 35,
    ciiRiskLevel: 'Watchlist',
    ciiTrend: 'Stable',
    executiveSummary: `${countryName} is monitored under MANEKSHAW.VISION sovereign intelligence and defense telemetry. Real-time telemetry monitors border airspace, maritime vessel movements, seismic activity, and geopolitical stability.`,
    militaryPosture: {
      activePersonnel: 'National Defense Force',
      defenseBudget: 'National Defense Allocation',
      nuclearStatus: 'Non-Nuclear State (NPT Signatory)',
      alliances: ['United Nations Member State'],
      readiness: 'Standard Peace-Time Posture'
    },
    economicStatus: {
      inflation: 'Regional Benchmark Rate',
      currency: 'National Legal Tender',
      foreignReserves: 'Sovereign Central Bank Reserves',
      primaryExports: ['Primary Commodities', 'Manufactured Goods', 'Agricultural Produce'],
      sanctionsStatus: 'Standard Multilateral Trade'
    },
    strategicRisks: [
      'Regional border security and bilateral diplomatic relations',
      'Exposure to external currency fluctuations and energy commodity prices',
      'Resilience of critical domestic transport and electrical networks'
    ]
  };
}
