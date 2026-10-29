import { IntelNewsItem } from '../types';

export const BREAKING_INTEL_DISPATCHES: IntelNewsItem[] = [
  // ==========================================
  // Middle East & Red Sea Corridor
  // ==========================================
  {
    id: 'news_me_1',
    title: 'CENTCOM: Coalition Destroyers Intercept Dual Anti-Ship Ballistic Missiles Over Bab-el-Mandeb',
    summary: 'Arleigh Burke-class guided missile destroyers operating in southern Red Sea engaged two ASBMs launched from Houthi coastal launch pads near Al-Hudaydah; zero commercial casualties reported.',
    source: 'CENTCOM Media Operations / Reuters',
    timeAgo: '12m ago',
    category: 'military',
    severity: 'critical',
    region: 'middle-east',
    countryCode: 'YE',
    coordinates: [43.1, 13.5],
    relatedHotspot: 'red_sea_bab_el_mandeb',
    link: 'https://news.google.com/search?q=CENTCOM+Red+Sea+missiles'
  },
  {
    id: 'news_me_2',
    title: 'IRGC Navy Deploys Fast-Attack Catamarans in Strait of Hormuz Separation Scheme',
    summary: 'Maritime trade telemetry indicates Iranian Revolutionary Guard Islamic naval speedboats shadowing VLCC crude carriers passing east of Ras Musandam peninsula; UKMTO issues advisory 024.',
    source: 'UKMTO / Lloyd\'s List Maritime',
    timeAgo: '35m ago',
    category: 'military',
    severity: 'high',
    region: 'middle-east',
    countryCode: 'IR',
    coordinates: [56.35, 26.55],
    relatedHotspot: 'strait_of_hormuz',
    link: 'https://news.google.com/search?q=Strait+of+Hormuz+tanker+escort'
  },
  {
    id: 'news_me_3',
    title: 'IAEA Technical Safeguards Report Notes 60% Enriched UF6 Stockpile Surge at Fordow',
    summary: 'Director General Rafael Grossi confirms advanced IR-6 centrifuge cascades operating with increased feed rates; emergency verification meeting requested at UN Security Council in Vienna.',
    source: 'IAEA Press Briefing (Vienna)',
    timeAgo: '1h ago',
    category: 'geopolitical',
    severity: 'critical',
    region: 'middle-east',
    countryCode: 'IR',
    coordinates: [50.99, 34.88],
    relatedHotspot: 'iran_nuclear_facilities',
    link: 'https://news.google.com/search?q=IAEA+Iran+Fordow+enriched'
  },
  {
    id: 'news_me_4',
    title: 'IDF Northern Command Strikes Air Defense Batteries Near Baalbek Following Cross-Border Volleys',
    summary: 'Israeli Air Force multirole fighters executed standoff munitions strikes on subterranean munition depot and medium-range rocket launchers in the Bekaa Valley.',
    source: 'IDF Spokesperson / Al Jazeera',
    timeAgo: '1h 45m ago',
    category: 'military',
    severity: 'critical',
    region: 'middle-east',
    countryCode: 'LB',
    coordinates: [36.21, 34.0],
    relatedHotspot: 'golan_heights',
    link: 'https://news.google.com/search?q=IDF+Bekaa+Valley+airstrikes'
  },
  {
    id: 'news_me_5',
    title: 'Subsea Cable Consortium Commences Deep-Sea Optical Repair on AAE-1 Red Sea Segment',
    summary: 'Specialized cable-laying vessel with acoustic sonar and armed naval escort reaches the Djibouti-Yemen maritime border to repair severed optical trunk lines.',
    source: 'Submarine Telecoms Forum',
    timeAgo: '2h ago',
    category: 'cyber',
    severity: 'high',
    region: 'middle-east',
    countryCode: 'DJ',
    coordinates: [43.25, 12.58],
    relatedHotspot: 'red_sea_bab_el_mandeb',
    link: 'https://news.google.com/search?q=Red+Sea+undersea+cable+repair'
  },
  {
    id: 'news_me_6',
    title: 'Brent Crude Surges Past $82/bbl as War Risk Insurance Surcharges Double Across Gulf of Aden',
    summary: 'Joint War Committee in London expands listed waters notification boundaries; container lines rerouting an additional 12% of Asia-to-Europe trade around Cape of Good Hope.',
    source: 'Bloomberg Energy',
    timeAgo: '3h ago',
    category: 'economic',
    severity: 'medium',
    region: 'middle-east',
    countryCode: 'SA',
    coordinates: [48.0, 12.0],
    link: 'https://news.google.com/search?q=Brent+Crude+Red+Sea+shipping'
  },

  // ==========================================
  // Indo-Pacific & Taiwan Strait
  // ==========================================
  {
    id: 'news_ip_1',
    title: 'PLA Eastern Theater Command Mobilizes 54 Aircraft Across Taiwan Strait Median Line',
    summary: 'Taiwan MND reports J-16 fighters, KJ-500 AEW&C, and Y-8 ASW aircraft conducting continuous combat patrol orbits off the southwestern ADIZ; CAP patrols scrambled.',
    source: 'Taiwan Ministry of National Defense / Reuters',
    timeAgo: '18m ago',
    category: 'military',
    severity: 'critical',
    region: 'indo-pacific',
    countryCode: 'TW',
    coordinates: [119.5, 24.2],
    relatedHotspot: 'taiwan_strait',
    link: 'https://news.google.com/search?q=Taiwan+MND+PLA+aircraft+sortie'
  },
  {
    id: 'news_ip_2',
    title: 'Philippines Coast Guard Reports CCG Vessel Cut-Off Maneuver Near Second Thomas Shoal',
    summary: 'China Coast Guard vessel 5204 deployed high-pressure water monitors against Philippine resupply boat Unaizah May 4 during routine rotation to BRP Sierra Madre.',
    source: 'National Task Force West Philippine Sea',
    timeAgo: '42m ago',
    category: 'military',
    severity: 'high',
    region: 'indo-pacific',
    countryCode: 'PH',
    coordinates: [115.85, 9.75],
    relatedHotspot: 'spratly_islands',
    link: 'https://news.google.com/search?q=Second+Thomas+Shoal+water+cannon'
  },
  {
    id: 'news_ip_3',
    title: 'Japan Maritime Self-Defense Force Shadows PLAN Aircraft Carrier Shandong in Philippine Sea',
    summary: 'JS Sazanami tracked carrier battle group maneuvers 340km south of Miyako Island; over 120 carrier-borne fighter sorties conducted over a 72-hour exercise window.',
    source: 'Japan Joint Staff / NHK World',
    timeAgo: '2h ago',
    category: 'military',
    severity: 'high',
    region: 'indo-pacific',
    countryCode: 'JP',
    coordinates: [127.8, 24.1],
    relatedHotspot: 'senkaku_diaoyu',
    link: 'https://news.google.com/search?q=Japan+Miyako+Shandong+carrier'
  },
  {
    id: 'news_ip_4',
    title: 'TSMC Completes Trial Fabrication of 2nm Test Chips at Baoshan Fab 20 Amid Subsidies Review',
    summary: 'Leading global semiconductor manufacturer confirms gate-all-around (GAA) nanosheet architecture yield targets met ahead of volume production schedule.',
    source: 'DigiTimes Asia / Nikkei',
    timeAgo: '3h ago',
    category: 'economic',
    severity: 'medium',
    region: 'indo-pacific',
    countryCode: 'TW',
    coordinates: [120.98, 24.78],
    link: 'https://news.google.com/search?q=TSMC+2nm+Baoshan+Fab'
  },
  {
    id: 'news_ip_5',
    title: 'ROK Navy and US 7th Fleet Launch Bilateral Anti-Submarine Drill Off Busan',
    summary: 'Nuclear-powered attack submarine USS Annapolis participates alongside ROKS Dosan Ahn Chang-ho in acoustic detection and undersea chokepoint interdiction.',
    source: 'Yonhap News Agency / US 7th Fleet',
    timeAgo: '4h ago',
    category: 'military',
    severity: 'medium',
    region: 'indo-pacific',
    countryCode: 'KR',
    coordinates: [129.1, 35.1],
    relatedHotspot: 'korean_demilitarized_zone',
    link: 'https://news.google.com/search?q=US+7th+Fleet+Busan+drill'
  },

  // ==========================================
  // India & South Asia Theater
  // ==========================================
  {
    id: 'news_in_1',
    title: 'Indian Army Operationalizes High-Altitude Drone Hub Along Depsang Plains (Eastern Ladakh)',
    summary: 'New forward reconnaissance squad deployed with tethered UAV platforms and solar-powered radar transceivers to continuously monitor the LAC and Daulat Beg Oldie access corridors.',
    source: 'HQ Northern Command / ANI',
    timeAgo: '25m ago',
    category: 'military',
    severity: 'high',
    region: 'india',
    countryCode: 'IN',
    coordinates: [78.1, 35.2],
    relatedHotspot: 'line_of_actual_control',
    link: 'https://news.google.com/search?q=Indian+Army+Ladakh+LAC+drone'
  },
  {
    id: 'news_in_2',
    title: 'Indian Navy Guided Missile Destroyer INS Kolkata Rescues Merchant Crew From Dhow Hijacking',
    summary: 'Marine Commandos (MARCOS) executed airborne insertion and board-search-and-seizure operation 260 nautical miles off Socotra Island, securing all 17 crew members.',
    source: 'Indian Navy Spokesperson',
    timeAgo: '1h 10m ago',
    category: 'military',
    severity: 'high',
    region: 'india',
    countryCode: 'IN',
    coordinates: [54.5, 12.8],
    relatedHotspot: 'red_sea_bab_el_mandeb',
    link: 'https://news.google.com/search?q=Indian+Navy+INS+Kolkata+piracy'
  },
  {
    id: 'news_in_3',
    title: 'Border Roads Organisation Completes Critical Tunnel Breakthrough on Shinku La Pass',
    summary: 'The 4.1km high-altitude twin-tube tunnel will provide year-round all-weather connectivity between Manali and Kargil, circumventing vulnerable surface routes.',
    source: 'BRO Delhi / Press Information Bureau',
    timeAgo: '2h 30m ago',
    category: 'geopolitical',
    severity: 'medium',
    region: 'india',
    countryCode: 'IN',
    coordinates: [77.2, 32.9],
    relatedHotspot: 'line_of_actual_control',
    link: 'https://news.google.com/search?q=Shinku+La+tunnel+BRO'
  },
  {
    id: 'news_in_4',
    title: 'Tri-Service Command at Port Blair Receives Advanced Coastal Surveillance Radar Array',
    summary: 'Andaman and Nicobar Command integrates maritime domain awareness radar network monitoring the northern entrance of the Malacca Strait.',
    source: 'Andaman & Nicobar Command',
    timeAgo: '4h ago',
    category: 'military',
    severity: 'medium',
    region: 'india',
    countryCode: 'IN',
    coordinates: [92.73, 11.66],
    relatedHotspot: 'malacca_strait',
    link: 'https://news.google.com/search?q=Andaman+Nicobar+Command+radar'
  },

  // ==========================================
  // Europe & Eastern Flank
  // ==========================================
  {
    id: 'news_eu_1',
    title: 'Ukraine Magura V5 USV Naval Drone Strikes Russian Patrol Ship Near Novorossiysk Bay',
    summary: 'Ukrainian military intelligence (GUR) footage shows maritime kamikaze drone detonating against Russian Project 22160 patrol vessel; localized oil boom deployed.',
    source: 'Main Directorate of Intelligence (Ukraine) / BBC',
    timeAgo: '30m ago',
    category: 'military',
    severity: 'critical',
    region: 'europe',
    countryCode: 'UA',
    coordinates: [37.8, 44.7],
    relatedHotspot: 'black_sea_crimea',
    link: 'https://news.google.com/search?q=Magura+V5+Novorossiysk+strike'
  },
  {
    id: 'news_eu_2',
    title: 'NATO Air Policing Jets Scrambled from Siauliai Over Baltic Electronic Warfare Spikes',
    summary: 'Extensive GPS jamming recorded across the Suwalki Corridor and Gulf of Finland originating from electronic warfare installations in Kaliningrad Oblast.',
    source: 'NATO Allied Air Command (Ramstein)',
    timeAgo: '1h 15m ago',
    category: 'cyber',
    severity: 'high',
    region: 'europe',
    countryCode: 'LT',
    coordinates: [23.3, 55.9],
    relatedHotspot: 'suwalki_gap',
    link: 'https://news.google.com/search?q=Baltic+GPS+jamming+Kaliningrad'
  },
  {
    id: 'news_eu_3',
    title: 'IAEA Inspection Team Rotates at Zaporizhzhia Nuclear Power Plant Under Ceasefire Window',
    summary: 'Technical monitors observe localized perimeter damage following drone strikes on auxiliary coolant pump station; all 6 reactors remain in cold shutdown.',
    source: 'IAEA Director General Update (Vienna)',
    timeAgo: '2h 15m ago',
    category: 'geopolitical',
    severity: 'critical',
    region: 'europe',
    countryCode: 'UA',
    coordinates: [35.1, 47.5],
    relatedHotspot: 'zaporizhzhia_npp',
    link: 'https://news.google.com/search?q=IAEA+Zaporizhzhia+rotation'
  },
  {
    id: 'news_eu_4',
    title: 'Finland and Estonia Implement Joint Underwater Critical Infrastructure Patrols in Gulf of Finland',
    summary: 'Naval mine countermeasure vessels and autonomous undersea gliders deployed to safeguard Balticconnector gas pipeline and Estlink 2 electricity cables.',
    source: 'Finnish Border Guard / YLE News',
    timeAgo: '3h 30m ago',
    category: 'military',
    severity: 'medium',
    region: 'europe',
    countryCode: 'FI',
    coordinates: [24.9, 59.9],
    relatedHotspot: 'baltic_critical_infra',
    link: 'https://news.google.com/search?q=Gulf+of+Finland+pipeline+patrol'
  },

  // ==========================================
  // Americas, Arctic & Latin America
  // ==========================================
  {
    id: 'news_am_1',
    title: 'NORAD E-3 Sentry Detects and Intercepts Russian Tu-95 Bear Bombers in Alaska ADIZ',
    summary: 'US Air Force F-16 and F-35 fighters escorted four Russian strategic bombers and Su-35 escort fighters operating in international airspace within the Alaskan buffer zone.',
    source: 'North American Aerospace Defense Command (NORAD)',
    timeAgo: '45m ago',
    category: 'military',
    severity: 'high',
    region: 'americas',
    countryCode: 'US',
    coordinates: [-166.0, 65.0],
    link: 'https://news.google.com/search?q=NORAD+Alaska+Tu-95+intercept'
  },
  {
    id: 'news_am_2',
    title: 'Panama Canal Authority Restores Daily Transit Slots to 34 Vessels Following Lake Gatun Inflows',
    summary: 'Seasonal rainfall allows draft limits to increase to 48 feet; neo-panamax container convoys reduce waiting times from 14 days to under 4 days.',
    source: 'Panama Canal Authority (ACP) Maritime Bulletin',
    timeAgo: '2h ago',
    category: 'economic',
    severity: 'medium',
    region: 'americas',
    countryCode: 'PA',
    coordinates: [-79.9, 9.1],
    relatedHotspot: 'panama_canal',
    link: 'https://news.google.com/search?q=Panama+Canal+transit+slots+ACP'
  },
  {
    id: 'news_am_3',
    title: 'US Coast Guard Cutter Healy Patrols Bering Strait to Monitor Joint Sino-Russian Coast Guard Drills',
    summary: 'Medium icebreaker maintains presence near Saint Lawrence Island as joint maritime law enforcement task force transits near the maritime boundary line.',
    source: 'US Coast Guard District 17',
    timeAgo: '3h 40m ago',
    category: 'military',
    severity: 'medium',
    region: 'americas',
    countryCode: 'US',
    coordinates: [-169.0, 64.5],
    link: 'https://news.google.com/search?q=USCG+Healy+Bering+Strait'
  },

  // ==========================================
  // Global Wire, Cyber & Natural Hazards
  // ==========================================
  {
    id: 'news_gl_1',
    title: 'USGS Reports M6.7 Tectonic Subduction Earthquake Near Kermadec Trench',
    summary: 'Hypocenter registered at 110km depth; Pacific Tsunami Warning Center (PTWC) confirms no destructive basin-wide tsunami threat.',
    source: 'USGS National Earthquake Information Center',
    timeAgo: '50m ago',
    category: 'natural',
    severity: 'medium',
    region: 'global',
    countryCode: 'NZ',
    coordinates: [-177.5, -30.2],
    link: 'https://earthquake.usgs.gov'
  },
  {
    id: 'news_gl_2',
    title: 'G7 Taskforce Imposes Coordinated Sanctions on Russian Shadow Fleet Flag Registries',
    summary: 'Treasury OFAC and EU Commission blacklist 28 maritime tankers utilizing fraudulent flag states, AIS manipulation, and unverified P&I insurance.',
    source: 'US Department of the Treasury / EU Council',
    timeAgo: '4h 15m ago',
    category: 'geopolitical',
    severity: 'high',
    region: 'global',
    countryCode: 'GLOBAL',
    coordinates: [37.6, 55.7],
    link: 'https://news.google.com/search?q=G7+Russia+shadow+fleet+sanctions'
  },
  {
    id: 'news_gl_3',
    title: 'CISA Issues Critical Advisory on State-Sponsored Volt Typhoon Router Exploits',
    summary: 'Cybersecurity and Infrastructure Security Agency warns critical infrastructure operators of persistent firmware tampering on edge gateway devices.',
    source: 'CISA / NSA Cybersecurity Directorate',
    timeAgo: '5h ago',
    category: 'cyber',
    severity: 'high',
    region: 'global',
    countryCode: 'US',
    coordinates: [-77.03, 38.89],
    link: 'https://www.cisa.gov/news-events/cybersecurity-advisories'
  }
];

export async function fetchLiveNewsDispatches(timeRange: string = '7d'): Promise<IntelNewsItem[]> {
  try {
    const { getLiveIntelDispatches } = await import('./liveFeedAdapter');
    return await getLiveIntelDispatches(timeRange);
  } catch (e) {
    return BREAKING_INTEL_DISPATCHES;
  }
}
