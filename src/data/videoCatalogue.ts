export interface VideoCatalogueItem {
  id: string;
  title: string;
  channel: string;
  category: '★ SPECIAL ANALYSTS' | '24/7 LIVE NEWS' | 'DEFENSE & THINK TANKS' | 'THEATER CAMS & FEEDS';
  region: 'India / S. Asia' | 'Global Wire' | 'Europe / UK' | 'Americas / US' | 'Middle East' | 'East Asia / Indo-Pacific';
  countryCode: string;
  isLive?: boolean;
  isSpecialAnalyst?: boolean;
  tags: string[];
  youtubeId: string;
  externalUrl: string;
  description: string;
  monogram: string;
}

export const VIDEO_CATALOGUE: VideoCatalogueItem[] = [
  // =========================================================================
  // Category A: ★ SPECIAL ANALYSTS (Independent Defense, OSINT & Strategic)
  // =========================================================================
  {
    id: 'perun',
    title: 'Perun',
    channel: 'Perun',
    category: '★ SPECIAL ANALYSTS',
    region: 'Global Wire',
    countryCode: 'AU',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Defense Economics', 'Logistics', 'Procurement', 'Ukraine', 'Indo-Pacific'],
    youtubeId: 'wS7qFp-k8jY',
    externalUrl: 'https://www.youtube.com/@PerunAU',
    description: 'Deep-dive defense economics, military logistics, and force-structure procurement modeling.',
    monogram: 'PRN'
  },
  {
    id: 'caspian_report',
    title: 'CaspianReport (Shirvan)',
    channel: 'CaspianReport',
    category: '★ SPECIAL ANALYSTS',
    region: 'Global Wire',
    countryCode: 'GLOBAL',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Geopolitics', 'Grand Strategy', 'Maritime Corridors', 'Eurasia'],
    youtubeId: 'g-f5J11kL64',
    externalUrl: 'https://www.youtube.com/@CaspianReport',
    description: 'Objective historical and geopolitical strategic briefings across Eurasia and global maritime chokepoints.',
    monogram: 'CAS'
  },
  {
    id: 'covert_cabal',
    title: 'Covert Cabal',
    channel: 'Covert Cabal',
    category: '★ SPECIAL ANALYSTS',
    region: 'Americas / US',
    countryCode: 'US',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Satellite Imagery OSINT', 'Base Counts', 'Strategic Arsenals'],
    youtubeId: 'uN3aP_M-pWk',
    externalUrl: 'https://www.youtube.com/@CovertCabal',
    description: 'Commercial satellite imagery verification of armored storage bases, air wings, and naval drydocks.',
    monogram: 'COV'
  },
  {
    id: 'task_and_purpose',
    title: 'Task & Purpose (Chris Cappy)',
    channel: 'Task & Purpose',
    category: '★ SPECIAL ANALYSTS',
    region: 'Americas / US',
    countryCode: 'US',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Infantry Tactics', 'Weapons Systems', 'Frontline Engineering'],
    youtubeId: 'D_Q35b3iUaI',
    externalUrl: 'https://www.youtube.com/@Taskandpurpose',
    description: 'Ground-level military technology breakdowns, vehicle armor analysis, and frontline tactical doctrine.',
    monogram: 'T&P'
  },
  {
    id: 'binkov',
    title: "Binkov's Battlegrounds",
    channel: "Binkov's Battlegrounds",
    category: '★ SPECIAL ANALYSTS',
    region: 'Global Wire',
    countryCode: 'GLOBAL',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Force-on-Force', 'Order of Battle', 'Military Capabilities'],
    youtubeId: 'jM1W2f8k2lQ',
    externalUrl: 'https://www.youtube.com/@Binkov',
    description: 'Data-driven military capability comparisons, order of battle audits, and theater scenario projections.',
    monogram: 'BNK'
  },
  {
    id: 'sub_brief',
    title: 'Sub Brief (Aaron Amick)',
    channel: 'Sub Brief',
    category: '★ SPECIAL ANALYSTS',
    region: 'Americas / US',
    countryCode: 'US',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Submarine Warfare', 'Undersea Cables', 'Sonar', 'Naval OSINT'],
    youtubeId: 'O9cT5r_15jU',
    externalUrl: 'https://www.youtube.com/@SubBrief',
    description: 'Former US Navy sonar supervisor analyzing acoustic signatures, nuclear attack subs, and seabed sabotage.',
    monogram: 'SUB'
  },
  {
    id: 'ward_carroll',
    title: 'Ward Carroll (F-14 RIO)',
    channel: 'Ward Carroll',
    category: '★ SPECIAL ANALYSTS',
    region: 'Americas / US',
    countryCode: 'US',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Naval Aviation', 'Air Combat Doctrine', 'Carrier Strike Groups'],
    youtubeId: 'jM1Z7F4bK2g',
    externalUrl: 'https://www.youtube.com/@WardCarroll',
    description: 'Naval aviation doctrine, carrier strike group airwings, and fighter radar intercept telemetry.',
    monogram: 'WRC'
  },
  {
    id: 'anders_puck_nielsen',
    title: 'Anders Puck Nielsen',
    channel: 'Anders Puck Nielsen',
    category: '★ SPECIAL ANALYSTS',
    region: 'Europe / UK',
    countryCode: 'DK',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Naval Strategy', 'NATO Posture', 'Baltic & Black Sea'],
    youtubeId: '2m8C-hXoU_E',
    externalUrl: 'https://www.youtube.com/@anderspuck',
    description: 'Royal Danish Defence College military analyst on maritime warfare, mine counter-measures, and NATO strategy.',
    monogram: 'APN'
  },
  {
    id: 'millennium_7',
    title: 'Millennium 7* (Aviation & Stealth)',
    channel: 'Millennium 7* HistoryTech',
    category: '★ SPECIAL ANALYSTS',
    region: 'Europe / UK',
    countryCode: 'EU',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Air Defense', 'Radar EW', '5th-Gen Fighter Doctrine'],
    youtubeId: 'G1wE-xX1yZk',
    externalUrl: 'https://www.youtube.com/@Millennium7HistoryTech',
    description: 'Technical military aviation, stealth radar cross-section modeling, and electronic countermeasures.',
    monogram: 'M7'
  },
  {
    id: 'amit_sengupta',
    title: 'Amit Sengupta',
    channel: 'Amit Sengupta',
    category: '★ SPECIAL ANALYSTS',
    region: 'India / S. Asia',
    countryCode: 'IN',
    isSpecialAnalyst: true,
    isLive: false,
    tags: ['Indian Geopolitics', 'LAC/LOC Geography', 'Strategic Infrastructure'],
    youtubeId: '7uHh5-rQ_9k',
    externalUrl: 'https://www.youtube.com/@AmitSengupta',
    description: 'Cartographic and geopolitical breakdowns of South Asian Himalayan borders, Indo-Pacific sea lanes, and diplomacy.',
    monogram: 'ASG'
  },

  // =========================================================================
  // Category B: 24/7 LIVE NEWS (Public Broadcasters & Global Wires)
  // =========================================================================
  {
    id: 'dd_india_live',
    title: 'DD India Live',
    channel: 'DD India',
    category: '24/7 LIVE NEWS',
    region: 'India / S. Asia',
    countryCode: 'IN',
    isLive: true,
    tags: ['Indian Public Broadcaster', 'Diplomacy', 'South Asia'],
    youtubeId: 'gCNeDWCI0vo',
    externalUrl: 'https://www.youtube.com/@DDIndia/live',
    description: 'Official 24/7 strategic broadcast from the Indian Ministry of External Affairs and national defense wire.',
    monogram: 'DDI'
  },
  {
    id: 'dw_news_live',
    title: 'DW News (Deutsche Welle)',
    channel: 'DW News',
    category: '24/7 LIVE NEWS',
    region: 'Europe / UK',
    countryCode: 'DE',
    isLive: true,
    tags: ['European Security', 'Global Wire', 'Multilingual Public Broadcast'],
    youtubeId: 'Lu_b5sWlA40',
    externalUrl: 'https://www.youtube.com/@dwnews/live',
    description: 'German public international broadcaster reporting on European security and NATO frontlines.',
    monogram: 'DW'
  },
  {
    id: 'france24_live',
    title: 'France 24 English',
    channel: 'France 24',
    category: '24/7 LIVE NEWS',
    region: 'Europe / UK',
    countryCode: 'FR',
    isLive: true,
    tags: ['Global Wire', 'Sahel Security', 'Middle East', 'Europe'],
    youtubeId: 'h3MuIUNCCzI',
    externalUrl: 'https://www.youtube.com/watch?v=h3MuIUNCCzI',
    description: 'French international news channel with deep field reporting in the Sahel, Levant, and Eastern Europe.',
    monogram: 'F24'
  },
  {
    id: 'al_jazeera_live',
    title: 'Al Jazeera English',
    channel: 'Al Jazeera',
    category: '24/7 LIVE NEWS',
    region: 'Middle East',
    countryCode: 'QA',
    isLive: true,
    tags: ['Middle East', 'Levant', 'Red Sea', 'Global South'],
    youtubeId: '_uQrJ0TkZlc',
    externalUrl: 'https://www.youtube.com/@aljazeeraenglish/live',
    description: 'Middle East coverage focusing on the Red Sea chokepoint, Persian Gulf, and Levant security.',
    monogram: 'AJE'
  },
  {
    id: 'nhk_world_live',
    title: 'NHK World-Japan',
    channel: 'NHK World',
    category: '24/7 LIVE NEWS',
    region: 'East Asia / Indo-Pacific',
    countryCode: 'JP',
    isLive: true,
    tags: ['Indo-Pacific', 'East China Sea', 'Taiwan Strait', 'Seismic Alerts'],
    youtubeId: 'f0lYkdA-Gtw',
    externalUrl: 'https://www3.nhk.or.jp/nhkworld/en/live/',
    description: 'Japanese public media tracking East China Sea maneuvers, Korean peninsula alerts, and seismic telemetry.',
    monogram: 'NHK'
  },
  {
    id: 'cna_live',
    title: 'CNA (Channel NewsAsia)',
    channel: 'CNA',
    category: '24/7 LIVE NEWS',
    region: 'East Asia / Indo-Pacific',
    countryCode: 'SG',
    isLive: true,
    tags: ['Malacca Strait', 'ASEAN', 'South China Sea', 'Asian Economy'],
    youtubeId: 'XWq5kBlakcQ',
    externalUrl: 'https://www.youtube.com/@channelnewsasia/live',
    description: 'Singapore-based international broadcaster tracking Southeast Asian corridors and South China Sea developments.',
    monogram: 'CNA'
  },
  {
    id: 'reuters_live',
    title: 'Reuters Live Wire',
    channel: 'Reuters',
    category: '24/7 LIVE NEWS',
    region: 'Global Wire',
    countryCode: 'GLOBAL',
    isLive: true,
    tags: ['Unbiased Raw Wire Feeds', 'Diplomatic Summits', 'Market Shocks'],
    youtubeId: 'W31_G_g3P-8',
    externalUrl: 'https://www.youtube.com/@Reuters/live',
    description: 'Raw field feeds, diplomatic summits, emergency security sessions, and institutional dispatches.',
    monogram: 'RTR'
  },
  {
    id: 'ap_live',
    title: 'Associated Press (AP) Live',
    channel: 'Associated Press',
    category: '24/7 LIVE NEWS',
    region: 'Global Wire',
    countryCode: 'GLOBAL',
    isLive: true,
    tags: ['Raw Field Feeds', 'UN Security Council', 'Global Flashpoints'],
    youtubeId: 'Xl37B-qZt9U',
    externalUrl: 'https://www.youtube.com/@AssociatedPress/live',
    description: 'Unfiltered global field feeds and emergency UN Security Council deliberations.',
    monogram: 'AP'
  },
  {
    id: 'abc_news_au_live',
    title: 'ABC News Australia',
    channel: 'ABC News Australia',
    category: '24/7 LIVE NEWS',
    region: 'East Asia / Indo-Pacific',
    countryCode: 'AU',
    isLive: true,
    tags: ['Indo-Pacific', 'Oceania', 'AUKUS', 'Maritime Surveillance'],
    youtubeId: 'vOTiJkg_vgM',
    externalUrl: 'https://www.youtube.com/@abcnewsaustralia/live',
    description: 'Australian national broadcaster covering AUKUS naval alliances and South Pacific maritime security.',
    monogram: 'ABC'
  },
  {
    id: 'pbs_cspan_live',
    title: 'PBS NewsHour / C-SPAN',
    channel: 'PBS / C-SPAN',
    category: '24/7 LIVE NEWS',
    region: 'Americas / US',
    countryCode: 'US',
    isLive: true,
    tags: ['Pentagon Briefings', 'Congressional Hearings', 'State Dept'],
    youtubeId: 'V1Yp0n-n16k',
    externalUrl: 'https://www.youtube.com/@PBSNewsHour/live',
    description: 'Direct live coverage of Pentagon defense briefings and Congressional foreign relations hearings.',
    monogram: 'PBS'
  },

  // =========================================================================
  // Category C: DEFENSE & THINK TANKS (Institutional Strategic Research)
  // =========================================================================
  {
    id: 'rusi_defense',
    title: 'RUSI (Royal United Services Institute)',
    channel: 'RUSI',
    category: 'DEFENSE & THINK TANKS',
    region: 'Europe / UK',
    countryCode: 'UK',
    tags: ['Land Warfare', 'Sanctions', 'Electronic Warfare', 'Airpower'],
    youtubeId: 'b_fL8J11kL4',
    externalUrl: 'https://www.youtube.com/@RUSI_org',
    description: "World's oldest defense and security think tank providing operational combat reports and sanctions analysis.",
    monogram: 'RUSI'
  },
  {
    id: 'csis_thinktank',
    title: 'CSIS (Center for Strategic & International Studies)',
    channel: 'CSIS',
    category: 'DEFENSE & THINK TANKS',
    region: 'Americas / US',
    countryCode: 'US',
    tags: ['Missile Threat Project', 'Taiwan Wargames', 'AMTI South China Sea'],
    youtubeId: 'bQ5i-Tz8kL4',
    externalUrl: 'https://www.youtube.com/@csistv',
    description: 'Bipartisan strategic defense research, wargame simulations, and South China Sea maritime transparency.',
    monogram: 'CSIS'
  },
  {
    id: 'orf_delhi',
    title: 'ORF (Observer Research Foundation)',
    channel: 'ORF',
    category: 'DEFENSE & THINK TANKS',
    region: 'India / S. Asia',
    countryCode: 'IN',
    tags: ['Raisina Dialogue', 'Indian Ocean Security', 'Tech & Deterrence'],
    youtubeId: 'iOqJ-ZgM_3c',
    externalUrl: 'https://www.youtube.com/@ORFDelhi',
    description: 'Host of the Raisina Dialogue analyzing Indian Ocean naval deterrence and critical technology defense.',
    monogram: 'ORF'
  },
  {
    id: 'iiss_london',
    title: 'IISS (International Institute for Strategic Studies)',
    channel: 'IISS',
    category: 'DEFENSE & THINK TANKS',
    region: 'Global Wire',
    countryCode: 'UK',
    tags: ['Shangri-La Dialogue', 'Military Balance', 'Nuclear Posture'],
    youtubeId: 'K_j1w0xX4qQ',
    externalUrl: 'https://www.youtube.com/@IISSorg',
    description: 'Publisher of The Military Balance and convener of the Shangri-La Dialogue security summit.',
    monogram: 'IISS'
  },
  {
    id: 'usni_naval',
    title: 'USNI (U.S. Naval Institute)',
    channel: 'USNI',
    category: 'DEFENSE & THINK TANKS',
    region: 'Americas / US',
    countryCode: 'US',
    tags: ['Fleet Tracker', 'Maritime Chokepoints', 'Naval Proceedings'],
    youtubeId: 'L8m9k1w3P5o',
    externalUrl: 'https://www.youtube.com/@USNavalInstitute',
    description: 'Independent naval proceedings covering carrier strike groups, hypersonic missiles, and maritime chokepoints.',
    monogram: 'USNI'
  },
  {
    id: 'iaea_nuclear',
    title: 'IAEA Official Briefings',
    channel: 'IAEA',
    category: 'DEFENSE & THINK TANKS',
    region: 'Global Wire',
    countryCode: 'GLOBAL',
    tags: ['Nuclear Safeguards', 'Zaporizhzhia', 'Non-Proliferation'],
    youtubeId: 'q6f_w3T_4oI',
    externalUrl: 'https://www.youtube.com/@iaeavideo',
    description: 'International Atomic Energy Agency technical inspector reports and nuclear non-proliferation compliance.',
    monogram: 'IAEA'
  },

  // =========================================================================
  // Category D: THEATER CAMS & FEEDS (Raw Earth & Infrastructure Monitors)
  // =========================================================================
  {
    id: 'nasa_iss_hdev',
    title: 'NASA ISS High-Definition Earth Viewing',
    channel: 'NASA',
    category: 'THEATER CAMS & FEEDS',
    region: 'Global Wire',
    countryCode: 'GLOBAL',
    isLive: true,
    tags: ['Orbital Telemetry', 'Live Low-Earth Orbit Pass'],
    youtubeId: 'xRPjKOmTrEA',
    externalUrl: 'https://www.youtube.com/watch?v=xRPjKOmTrEA',
    description: 'Continuous real-time optical view of Earth from the International Space Station at 400km altitude.',
    monogram: 'ISS'
  },
  {
    id: 'usgs_volcano_monitor',
    title: 'USGS / Volcano & Seismic Live Monitors',
    channel: 'USGS',
    category: 'THEATER CAMS & FEEDS',
    region: 'Global Wire',
    countryCode: 'GLOBAL',
    isLive: true,
    tags: ['Pacific Ring of Fire', 'Tectonic & Volcanic Telemetry'],
    youtubeId: '6f_kL2jQ1w4',
    externalUrl: 'https://www.usgs.gov/programs/earthquake-hazards',
    description: 'Live seismic recording stations and real-time volcanic caldera visual observation feeds.',
    monogram: 'USGS'
  },
  {
    id: 'chokepoint_corridor_cams',
    title: 'Panama & Suez Maritime Corridor Cams',
    channel: 'Maritime Corridors',
    category: 'THEATER CAMS & FEEDS',
    region: 'Global Wire',
    countryCode: 'GLOBAL',
    isLive: true,
    tags: ['Chokepoint Vessel Traffic', 'Supply Chain Telemetry'],
    youtubeId: 'Y9j2m0w1X7k',
    externalUrl: 'https://micanaldepanama.com/en/cameras/',
    description: 'Real-time vessel convoy transits, locks throughput, and container traffic telemetry through strategic canals.',
    monogram: 'CANAL'
  }
];
