export type VideoRegionGroup =
  | 'ALL'
  | 'ANALYSTS'
  | 'INDIA'
  | 'US'
  | 'EUROPE'
  | 'MIDDLE_EAST'
  | 'EAST_ASIA'
  | 'AMERICAS'
  | 'AFRICA';

export interface VideoCatalogueItem {
  id: string;
  title: string;
  channel: string;
  channelId: string;
  uploadsPlaylistId: string;
  category: '★ SPECIAL ANALYSTS' | '24/7 LIVE NEWS' | 'DEFENSE & THINK TANKS' | 'THEATER CAMS & FEEDS';
  region: 'India / S. Asia' | 'Global Wire' | 'Europe / UK' | 'Americas / US' | 'Middle East' | 'East Asia / Indo-Pacific';
  regionGroup: VideoRegionGroup;
  countryCode: string;
  isLive?: boolean;
  isSpecialAnalyst?: boolean;
  tags: string[];
  youtubeId: string;
  externalUrl: string;
  description: string;
  monogram: string;
  streamUrl?: string;
}

export const VIDEO_CATALOGUE: VideoCatalogueItem[] = [
  {
    "id": "perun",
    "title": "Perun",
    "channel": "Perun",
    "channelId": "UCC3ehuUksTyQ7bbjGntmx3Q",
    "uploadsPlaylistId": "UUC3ehuUksTyQ7bbjGntmx3Q",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Global Wire",
    "regionGroup": "ANALYSTS",
    "countryCode": "AU",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Defense Economics",
      "Logistics",
      "Procurement",
      "Ukraine",
      "Indo-Pacific"
    ],
    "youtubeId": "Hc2Wx-agDr0",
    "externalUrl": "https://www.youtube.com/@PerunAU",
    "description": "Deep-dive defense economics, military logistics, and force-structure procurement modeling.",
    "monogram": "PRN"
  },
  {
    "id": "caspian_report",
    "title": "CaspianReport (Shirvan)",
    "channel": "CaspianReport",
    "channelId": "UCnZjF-jc2h8I1fKAce1vFog",
    "uploadsPlaylistId": "UUnZjF-jc2h8I1fKAce1vFog",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Global Wire",
    "regionGroup": "ANALYSTS",
    "countryCode": "GLOBAL",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Geopolitics",
      "Grand Strategy",
      "Maritime Corridors",
      "Eurasia"
    ],
    "youtubeId": "ckEywpMl82c",
    "externalUrl": "https://www.youtube.com/@CaspianReport",
    "description": "Objective historical and geopolitical strategic briefings across Eurasia and global maritime chokepoints.",
    "monogram": "CAS"
  },
  {
    "id": "covert_cabal",
    "title": "Covert Cabal",
    "channel": "Covert Cabal",
    "channelId": "UCzMV_BNHRP71kMA7ZZ95MaA",
    "uploadsPlaylistId": "UUzMV_BNHRP71kMA7ZZ95MaA",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Americas / US",
    "regionGroup": "ANALYSTS",
    "countryCode": "US",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Satellite Imagery OSINT",
      "Base Counts",
      "Strategic Arsenals"
    ],
    "youtubeId": "0eOWMleP7vk",
    "externalUrl": "https://www.youtube.com/@CovertCabal",
    "description": "Commercial satellite imagery verification of armored storage bases, air wings, and naval drydocks.",
    "monogram": "COV"
  },
  {
    "id": "task_and_purpose",
    "title": "Task & Purpose (Chris Cappy)",
    "channel": "Task & Purpose",
    "channelId": "UCSq3p5NKEtyp5Rjd4ctiEbg",
    "uploadsPlaylistId": "UUSq3p5NKEtyp5Rjd4ctiEbg",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Americas / US",
    "regionGroup": "ANALYSTS",
    "countryCode": "US",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Infantry Tactics",
      "Weapons Systems",
      "Frontline Engineering"
    ],
    "youtubeId": "xsvYAkw12ts",
    "externalUrl": "https://www.youtube.com/@Taskandpurpose",
    "description": "Ground-level military technology breakdowns, vehicle armor analysis, and frontline tactical doctrine.",
    "monogram": "T&P"
  },
  {
    "id": "binkov",
    "title": "Binkov's Battlegrounds",
    "channel": "Binkov's Battlegrounds",
    "channelId": "UCK09g6gYGMvU-0x1VCF1hgA",
    "uploadsPlaylistId": "UUK09g6gYGMvU-0x1VCF1hgA",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Global Wire",
    "regionGroup": "ANALYSTS",
    "countryCode": "GLOBAL",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Force-on-Force",
      "Order of Battle",
      "Military Capabilities"
    ],
    "youtubeId": "MtWlvPMOuDk",
    "externalUrl": "https://www.youtube.com/@Binkov",
    "description": "Data-driven military capability comparisons, order of battle audits, and theater scenario projections.",
    "monogram": "BNK"
  },
  {
    "id": "reallifelore",
    "title": "RealLifeLore",
    "channel": "RealLifeLore",
    "channelId": "UCR3GENuF521t8e3_lR0p5Eg",
    "uploadsPlaylistId": "UUR3GENuF521t8e3_lR0p5Eg",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Americas / US",
    "regionGroup": "ANALYSTS",
    "countryCode": "US",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Geopolitics",
      "Logistics",
      "Strategic Chokepoints",
      "Global Maps"
    ],
    "youtubeId": "47d9V_V2-wU",
    "externalUrl": "https://www.youtube.com/@RealLifeLore",
    "description": "Comprehensive geopolitical maps, conflict logistics analysis, and strategic chokepoint assessments.",
    "monogram": "RLL"
  },
  {
    "id": "visualpolitik_en",
    "title": "VisualPolitik EN",
    "channel": "VisualPolitik EN",
    "channelId": "UCLSR_L9U1y3N19Lq8v7A1wA",
    "uploadsPlaylistId": "UULSR_L9U1y3N19Lq8v7A1wA",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Global Wire",
    "regionGroup": "ANALYSTS",
    "countryCode": "GLOBAL",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Geopolitical Economy",
      "Defense Alliances",
      "Global Strategy"
    ],
    "youtubeId": "i_y-Yl-qE0E",
    "externalUrl": "https://www.youtube.com/@VisualPolitikEN",
    "description": "Geopolitical analysis focusing on national grand strategies, economic statecraft, and power balance shifts.",
    "monogram": "VPK"
  },
  {
    "id": "tldr_news_global",
    "title": "TLDR News Global",
    "channel": "TLDR News Global",
    "channelId": "UCSMqateX8OA2s1wsOR2EgJA",
    "uploadsPlaylistId": "UUSMqateX8OA2s1wsOR2EgJA",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Europe / UK",
    "regionGroup": "ANALYSTS",
    "countryCode": "GB",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "World Politics",
      "Diplomatic Treaties",
      "International Crises"
    ],
    "youtubeId": "Z-2yLSmYgGQ",
    "externalUrl": "https://www.youtube.com/@TLDRnewsGlobal",
    "description": "Concise daily breakdowns of global security summits, international treaties, and frontier friction points.",
    "monogram": "TLDR"
  },
  {
    "id": "csis_think_tank",
    "title": "CSIS (Center for Strategic & International Studies)",
    "channel": "CSIS: Center for Strategic & International Studies",
    "channelId": "UCr5mq645-flhx7n_Xn9H5iA",
    "uploadsPlaylistId": "UUr5mq645-flhx7n_Xn9H5iA",
    "category": "DEFENSE & THINK TANKS",
    "region": "Americas / US",
    "regionGroup": "ANALYSTS",
    "countryCode": "US",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Wargaming",
      "Missile Defense",
      "Asia Maritime Transparency (AMTI)"
    ],
    "youtubeId": "hR1p-s6aT2A",
    "externalUrl": "https://www.youtube.com/@csistv",
    "description": "Bipartisan national security think tank conducting wargames, missile defense studies, and South China Sea radar monitoring.",
    "monogram": "CSIS"
  },
  {
    "id": "cfr_think_tank",
    "title": "CFR (Council on Foreign Relations)",
    "channel": "Council on Foreign Relations",
    "channelId": "UCo_i1yJ21A_iV71_rG_c4wQ",
    "uploadsPlaylistId": "UUo_i1yJ21A_iV71_rG_c4wQ",
    "category": "DEFENSE & THINK TANKS",
    "region": "Americas / US",
    "regionGroup": "ANALYSTS",
    "countryCode": "US",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Grand Strategy",
      "Nuclear Nonproliferation",
      "Intelligence Oversight"
    ],
    "youtubeId": "N9y9mD-G2hY",
    "externalUrl": "https://www.youtube.com/@cfr",
    "description": "Leading foreign policy institute convening defense ministers, intelligence directors, and strategic scholars.",
    "monogram": "CFR"
  },
  {
    "id": "nasa_live",
    "title": "NASA Live & ISS Telemetry",
    "channel": "NASA",
    "channelId": "UCLA_DiR1FfKNvjuUpBHmylQ",
    "uploadsPlaylistId": "UULA_DiR1FfKNvjuUpBHmylQ",
    "category": "THEATER CAMS & FEEDS",
    "region": "Americas / US",
    "regionGroup": "ANALYSTS",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "Orbital Surveillance",
      "Space Launch",
      "Telemetry"
    ],
    "youtubeId": "21X5lGlDOfg",
    "externalUrl": "https://www.youtube.com/@NASA",
    "description": "Continuous orbital views, space launch missions, and low-Earth orbit tracking feeds.",
    "monogram": "NASA"
  },
  {
    "id": "un_security_council",
    "title": "UN Security Council (UN Web TV)",
    "channel": "United Nations",
    "channelId": "UCizB11eQI48m_h67m0D16HQ",
    "uploadsPlaylistId": "UUizB11eQI48m_h67m0D16HQ",
    "category": "DEFENSE & THINK TANKS",
    "region": "Global Wire",
    "regionGroup": "ANALYSTS",
    "countryCode": "UN",
    "isLive": true,
    "tags": [
      "Security Council",
      "Sanctions Regimes",
      "Diplomatic Sessions"
    ],
    "youtubeId": "zPn40c5fW_8",
    "externalUrl": "https://www.youtube.com/@unitednations",
    "description": "Live broadcast of UN Security Council sessions, emergency sanctions votes, and peacekeeping briefings.",
    "monogram": "UN"
  },
  {
    "id": "sub_brief",
    "title": "Sub Brief (Aaron Amick)",
    "channel": "Sub Brief",
    "channelId": "UC9bMgCQyFNaMPsK9GtzM5dQ",
    "uploadsPlaylistId": "UU9bMgCQyFNaMPsK9GtzM5dQ",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Americas / US",
    "regionGroup": "ANALYSTS",
    "countryCode": "US",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Submarine Warfare",
      "Undersea Cables",
      "Sonar",
      "Naval OSINT"
    ],
    "youtubeId": "MRRFGVZqI4w",
    "externalUrl": "https://www.youtube.com/@SubBrief",
    "description": "Former US Navy sonar supervisor analyzing acoustic signatures, nuclear attack subs, and seabed sabotage.",
    "monogram": "SUB"
  },
  {
    "id": "ward_carroll",
    "title": "Ward Carroll (F-14 RIO)",
    "channel": "Ward Carroll",
    "channelId": "UCiUteckG37fXz0g5h8iZ_0g",
    "uploadsPlaylistId": "UUiUteckG37fXz0g5h8iZ_0g",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Americas / US",
    "regionGroup": "ANALYSTS",
    "countryCode": "US",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Naval Aviation",
      "Air Combat Doctrine",
      "Carrier Strike Groups"
    ],
    "youtubeId": "fk8NpQ3RT6E",
    "externalUrl": "https://www.youtube.com/@WardCarroll",
    "description": "Naval aviation doctrine, carrier strike group airwings, and fighter radar intercept telemetry.",
    "monogram": "WRC"
  },
  {
    "id": "anders_puck_nielsen",
    "title": "Anders Puck Nielsen",
    "channel": "Anders Puck Nielsen",
    "channelId": "UCPPfK7Nq_yQR84rn1wcTXBg",
    "uploadsPlaylistId": "UUPPfK7Nq_yQR84rn1wcTXBg",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Europe / UK",
    "regionGroup": "ANALYSTS",
    "countryCode": "DK",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Naval Strategy",
      "NATO Posture",
      "Baltic & Black Sea"
    ],
    "youtubeId": "ElRegbf3bes",
    "externalUrl": "https://www.youtube.com/@anderspuck",
    "description": "Royal Danish Defence College military analyst on maritime warfare, mine counter-measures, and NATO strategy.",
    "monogram": "APN"
  },
  {
    "id": "millennium_7",
    "title": "Millennium 7* (Aviation & Stealth)",
    "channel": "Millennium 7* HistoryTech",
    "channelId": "UCVDkfkGRzo0qcZ8AkB4TMuw",
    "uploadsPlaylistId": "UUVDkfkGRzo0qcZ8AkB4TMuw",
    "category": "★ SPECIAL ANALYSTS",
    "region": "Europe / UK",
    "regionGroup": "ANALYSTS",
    "countryCode": "EU",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Air Defense",
      "Radar EW",
      "5th-Gen Fighter Doctrine"
    ],
    "youtubeId": "2nPE5M6Ujbs",
    "externalUrl": "https://www.youtube.com/@Millennium7HistoryTech",
    "description": "Technical military aviation, stealth radar cross-section modeling, and electronic countermeasures.",
    "monogram": "M7"
  },
  {
    "id": "amit_sengupta",
    "title": "Amit Sengupta",
    "channel": "Amit Sengupta",
    "channelId": "UCYrILCIt8INyfMYrZdXMfCA",
    "uploadsPlaylistId": "UUYrILCIt8INyfMYrZdXMfCA",
    "category": "★ SPECIAL ANALYSTS",
    "region": "India / S. Asia",
    "regionGroup": "ANALYSTS",
    "countryCode": "IN",
    "isSpecialAnalyst": true,
    "isLive": false,
    "tags": [
      "Indian Defense",
      "LAC / LOC",
      "Geopolitics",
      "Indo-Pacific"
    ],
    "youtubeId": "2H7bXjKq5mE",
    "externalUrl": "https://www.youtube.com/@AmitSengupta",
    "description": "Analytical cartography and geopolitical analysis on Indian defense posture, LAC friction points, and IOR choke points.",
    "monogram": "ASG"
  },
  {
    "id": "dd_india",
    "title": "DD India Live",
    "channel": "DD India",
    "channelId": "UCGDQNvybfDDeGTf4GtigXaw",
    "uploadsPlaylistId": "UUGDQNvybfDDeGTf4GtigXaw",
    "category": "24/7 LIVE NEWS",
    "region": "India / S. Asia",
    "regionGroup": "INDIA",
    "countryCode": "IN",
    "isLive": true,
    "tags": [
      "Doordarshan",
      "Public Broadcaster",
      "National Security",
      "Official Dispatches"
    ],
    "youtubeId": "0cK3B6X6q50",
    "externalUrl": "https://www.youtube.com/@DDIndia",
    "description": "India's international public service broadcaster providing authoritative government statements, diplomacy, and defense dispatches.",
    "monogram": "DDI"
  },
  {
    "id": "wion",
    "title": "WION: World Is One News",
    "channel": "WION",
    "channelId": "UC_gUM8rL-Lrg6O3adPW9K1g",
    "uploadsPlaylistId": "UU_gUM8rL-Lrg6O3adPW9K1g",
    "category": "24/7 LIVE NEWS",
    "region": "India / S. Asia",
    "regionGroup": "INDIA",
    "countryCode": "IN",
    "isLive": true,
    "tags": [
      "Indo-Pacific",
      "Defense Analysis",
      "Global Flashpoints",
      "South Asia"
    ],
    "youtubeId": "Xmm3Kr5P1Uw",
    "externalUrl": "https://www.youtube.com/@WION",
    "description": "New Delhi-headquartered international English news channel focusing on global geopolitical developments and Indo-Pacific security.",
    "monogram": "WION"
  },
  {
    "id": "ndtv_india",
    "title": "NDTV 24x7",
    "channel": "NDTV 24x7",
    "channelId": "UCZFMm1mMw0F81Z37aaEzTUA",
    "uploadsPlaylistId": "UUZFMm1mMw0F81Z37aaEzTUA",
    "category": "24/7 LIVE NEWS",
    "region": "India / S. Asia",
    "regionGroup": "INDIA",
    "countryCode": "IN",
    "isLive": true,
    "tags": [
      "India National",
      "Geopolitics",
      "South Asia",
      "Breaking News"
    ],
    "youtubeId": "3mYg1q0j1rU",
    "externalUrl": "https://www.youtube.com/@ndtv",
    "description": "Premier Indian English news network delivering live coverage of national security, economic policy, and regional diplomacy.",
    "monogram": "NDTV"
  },
  {
    "id": "india_today",
    "title": "India Today Live",
    "channel": "India Today",
    "channelId": "UCYPvAwZP8pZhSMW8qs7cVCw",
    "uploadsPlaylistId": "UUYPvAwZP8pZhSMW8qs7cVCw",
    "category": "24/7 LIVE NEWS",
    "region": "India / S. Asia",
    "regionGroup": "INDIA",
    "countryCode": "IN",
    "isLive": true,
    "tags": [
      "Defense News",
      "Border Security",
      "Strategic Affairs",
      "India"
    ],
    "youtubeId": "dQw4w9WgXcQ",
    "externalUrl": "https://www.youtube.com/@indiatoday",
    "description": "Frontline defense reporting, military procurement analysis, and South Asian strategic affairs.",
    "monogram": "ITD"
  },
  {
    "id": "times_now",
    "title": "Times Now 24/7",
    "channel": "Times Now",
    "channelId": "UC6RJ7-PaXg6TIH2BzZfTV7w",
    "uploadsPlaylistId": "UU6RJ7-PaXg6TIH2BzZfTV7w",
    "category": "24/7 LIVE NEWS",
    "region": "India / S. Asia",
    "regionGroup": "INDIA",
    "countryCode": "IN",
    "isLive": true,
    "tags": [
      "National Security",
      "Defense Debates",
      "Counter-Terrorism",
      "India"
    ],
    "youtubeId": "9YffrCViTVk",
    "externalUrl": "https://www.youtube.com/@timesnow",
    "description": "Comprehensive coverage of Indian defense, border security at LAC/LOC, and Indo-Pacific maritime strategy.",
    "monogram": "TNOW"
  },
  {
    "id": "republic_world",
    "title": "Republic World",
    "channel": "Republic World",
    "channelId": "UCwqusr8YDwM-3mEYTDeJHzw",
    "uploadsPlaylistId": "UUwqusr8YDwM-3mEYTDeJHzw",
    "category": "24/7 LIVE NEWS",
    "region": "India / S. Asia",
    "regionGroup": "INDIA",
    "countryCode": "IN",
    "isLive": true,
    "tags": [
      "Breaking News",
      "Strategic Affairs",
      "India First"
    ],
    "youtubeId": "5qap5aO4i9A",
    "externalUrl": "https://www.youtube.com/@RepublicWorld",
    "description": "High-tempo 24/7 coverage of national security incidents, military operations, and counter-terrorist developments.",
    "monogram": "REP"
  },
  {
    "id": "abp_news",
    "title": "ABP News Live",
    "channel": "ABP News",
    "channelId": "UCRWFSbif-RFENbBrSiez1DA",
    "uploadsPlaylistId": "UURWFSbif-RFENbBrSiez1DA",
    "category": "24/7 LIVE NEWS",
    "region": "India / S. Asia",
    "regionGroup": "INDIA",
    "countryCode": "IN",
    "isLive": true,
    "tags": [
      "National Broadcaster",
      "Hindi/English Coverage",
      "India Security"
    ],
    "youtubeId": "2bX9k1b3_0M",
    "externalUrl": "https://www.youtube.com/@abpnews",
    "description": "One of India's largest broadcast networks reporting on defense operations, political developments, and internal security.",
    "monogram": "ABP"
  },
  {
    "id": "sansad_tv",
    "title": "Sansad TV (Parliament of India)",
    "channel": "Sansad TV",
    "channelId": "UCv01OP4p0c1XnB3fG7B1P-w",
    "uploadsPlaylistId": "UUv01OP4p0c1XnB3fG7B1P-w",
    "category": "24/7 LIVE NEWS",
    "region": "India / S. Asia",
    "regionGroup": "INDIA",
    "countryCode": "IN",
    "isLive": true,
    "tags": [
      "Parliament of India",
      "Defense Ministry Statements",
      "Lok Sabha",
      "Rajya Sabha"
    ],
    "youtubeId": "7T_2K1pX6pE",
    "externalUrl": "https://www.youtube.com/@SansadTV",
    "description": "Official broadcaster for the Parliament of India, broadcasting defense budget debates, committee hearings, and ministerial briefings.",
    "monogram": "SND"
  },
  {
    "id": "aaj_tak",
    "title": "Aaj Tak Live",
    "channel": "Aaj Tak",
    "channelId": "UCt4t-jeY85JegMlZ-E5UWtA",
    "uploadsPlaylistId": "UUt4t-jeY85JegMlZ-E5UWtA",
    "category": "24/7 LIVE NEWS",
    "region": "India / S. Asia",
    "regionGroup": "INDIA",
    "countryCode": "IN",
    "isLive": true,
    "tags": [
      "National Security",
      "Hindi News",
      "Breaking",
      "India"
    ],
    "youtubeId": "Nq2wYlWFucg",
    "externalUrl": "https://www.youtube.com/@aajtak",
    "description": "Premier Indian news broadcaster delivering 24/7 breaking national defense, LAC border tracking, and security reporting.",
    "monogram": "ATK"
  },
  {
    "id": "firstpost_vantage",
    "title": "Firstpost (Vantage)",
    "channel": "Firstpost",
    "channelId": "UCz8QaiQxApLq8sLNcszYyJw",
    "uploadsPlaylistId": "UUz8QaiQxApLq8sLNcszYyJw",
    "category": "24/7 LIVE NEWS",
    "region": "India / S. Asia",
    "regionGroup": "INDIA",
    "countryCode": "IN",
    "isLive": true,
    "tags": [
      "Vantage",
      "Palki Sharma",
      "Geopolitics",
      "Global South"
    ],
    "youtubeId": "H9bS51o1q3g",
    "externalUrl": "https://www.youtube.com/@Firstpost",
    "description": "Global geopolitical analysis and strategic affairs from an Indian and Global South perspective.",
    "monogram": "FP"
  },
  {
    "id": "reuters_live",
    "title": "Reuters Live Wires",
    "channel": "Reuters",
    "channelId": "UChqUTb7kYRX8-EiaN3XFrSQ",
    "uploadsPlaylistId": "UUhqUTb7kYRX8-EiaN3XFrSQ",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "Tier-1 Wire",
      "Global Markets",
      "Defense Press Briefings"
    ],
    "youtubeId": "HhD_GvGjEeo",
    "externalUrl": "https://www.youtube.com/@Reuters",
    "description": "Global wire agency covering breaking geopolitical crises, Pentagon briefings, and commodities tracking.",
    "monogram": "RTR"
  },
  {
    "id": "ap_archive",
    "title": "Associated Press (AP)",
    "channel": "Associated Press",
    "channelId": "UC52X5wxOL_s5yw0dQk7NtgA",
    "uploadsPlaylistId": "UU52X5wxOL_s5yw0dQk7NtgA",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": false,
    "tags": [
      "Global Wire",
      "Frontline Footage",
      "Unfiltered OSINT"
    ],
    "youtubeId": "6T3p8P1k7lA",
    "externalUrl": "https://www.youtube.com/@AssociatedPress",
    "description": "Primary global wire service with boots on the ground across all active conflict zones and diplomatic capitals.",
    "monogram": "AP"
  },
  {
    "id": "abc_news_us",
    "title": "ABC News Live (US)",
    "channel": "ABC News (US)",
    "channelId": "UCBi2mrWuNuyYy4gbM6fU18Q",
    "uploadsPlaylistId": "UUBi2mrWuNuyYy4gbM6fU18Q",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "US News",
      "White House",
      "Pentagon",
      "National Security"
    ],
    "youtubeId": "w_Ma8oQLmSM",
    "externalUrl": "https://www.youtube.com/@ABCNews",
    "description": "Major US broadcast news organization covering White House security policy, DoD operations, and national events.",
    "monogram": "ABC"
  },
  {
    "id": "nbc_news_now",
    "title": "NBC News NOW 24/7",
    "channel": "NBC News NOW",
    "channelId": "UCeY0bbntWzzVIaj2z3QigXg",
    "uploadsPlaylistId": "UUeY0bbntWzzVIaj2z3QigXg",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "Continuous Live",
      "US Defense",
      "Global Geopolitics"
    ],
    "youtubeId": "yR0m_2K8o1o",
    "externalUrl": "https://www.youtube.com/@NBCNews",
    "description": "Continuous 24/7 live news network featuring real-time dispatches from Washington, Europe, and the Middle East.",
    "monogram": "NBC"
  },
  {
    "id": "cbs_news_live",
    "title": "CBS News 24/7",
    "channel": "CBS News 24/7",
    "channelId": "UC8p1vwvWtl6T73JiExfWs1g",
    "uploadsPlaylistId": "UU8p1vwvWtl6T73JiExfWs1g",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "Continuous Broadcast",
      "National Intelligence",
      "Capitol Hill"
    ],
    "youtubeId": "2bX9k1b3_0M",
    "externalUrl": "https://www.youtube.com/@CBSNews",
    "description": "Premier American news stream with in-depth reporting from intelligence agencies, Capitol Hill, and international posts.",
    "monogram": "CBS"
  },
  {
    "id": "bloomberg_tv",
    "title": "Bloomberg Television",
    "channel": "Bloomberg Television",
    "channelId": "UCIALMKvObZNtJ6AmdCLP7Lg",
    "uploadsPlaylistId": "UUIALMKvObZNtJ6AmdCLP7Lg",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "Geopolitical Economy",
      "Energy Chokepoints",
      "Commodities",
      "Sanctions"
    ],
    "youtubeId": "dp8PhLsUcFE",
    "externalUrl": "https://www.youtube.com/@BloombergTV",
    "description": "Essential tracking for defense supply chains, sanctions impacts, crude oil tankers, and sovereign debt markets.",
    "monogram": "BLM"
  },
  {
    "id": "cnbc_tv",
    "title": "CNBC Television",
    "channel": "CNBC Television",
    "channelId": "UCrp_UI8XtuYfpiqluWLD7Lw",
    "uploadsPlaylistId": "UUr_UI8XtuYfpiqluWLD7Lw",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "Defense Industry",
      "Military Contractors",
      "Supply Chains"
    ],
    "youtubeId": "fN2gW5j3y1E",
    "externalUrl": "https://www.youtube.com/@CNBCtelevision",
    "description": "Tracking major aerospace and defense prime contractors (Lockheed, Raytheon, Northrop) and industrial supply chains.",
    "monogram": "CNBC"
  },
  {
    "id": "pbs_newshour",
    "title": "PBS NewsHour",
    "channel": "PBS NewsHour",
    "channelId": "UC6ZFN9Tx6xh-skXCuRHCDpQ",
    "uploadsPlaylistId": "UU6ZFN9Tx6xh-skXCuRHCDpQ",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "Analytical Journalism",
      "DoD Policy",
      "Arms Treaties"
    ],
    "youtubeId": "3mYg1q0j1rU",
    "externalUrl": "https://www.youtube.com/@PBSNewsHour",
    "description": "In-depth, balanced daily geopolitical coverage, foreign policy interviews, and defense strategy analysis.",
    "monogram": "PBS"
  },
  {
    "id": "cspan_live",
    "title": "C-SPAN",
    "channel": "C-SPAN",
    "channelId": "UCb--64Gl51jIEVE-GLDAVTg",
    "uploadsPlaylistId": "UUb--64Gl51jIEVE-GLDAVTg",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "Armed Services Committee",
      "Congressional Hearings",
      "DoD"
    ],
    "youtubeId": "dQw4w9WgXcQ",
    "externalUrl": "https://www.youtube.com/@CSPAN",
    "description": "Unfiltered live coverage of US House & Senate Armed Services Committee hearings and Pentagon budget debates.",
    "monogram": "CSPN"
  },
  {
    "id": "livenow_fox",
    "title": "LiveNOW from FOX",
    "channel": "LiveNOW from FOX",
    "channelId": "UCJg9wBPyKMNA5sRDnvzmkdg",
    "uploadsPlaylistId": "UUJg9wBPyKMNA5sRDnvzmkdg",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "Raw Breaking Feeds",
      "Unfiltered Live",
      "Tactical Incident Response"
    ],
    "youtubeId": "5qap5aO4i9A",
    "externalUrl": "https://www.youtube.com/@LiveNOWfromFOX",
    "description": "Raw, non-stop breaking news streams with direct feeds from police, military, and international monitors.",
    "monogram": "LNF"
  },
  {
    "id": "newsmax_tv",
    "title": "Newsmax Live",
    "channel": "Newsmax",
    "channelId": "UCx6h-dWzJ5NpAlja1YsApdg",
    "uploadsPlaylistId": "UUx6h-dWzJ5NpAlja1YsApdg",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": true,
    "tags": [
      "US News",
      "National Politics",
      "Defense Analysis"
    ],
    "youtubeId": "0cK3B6X6q50",
    "externalUrl": "https://www.youtube.com/@NewsmaxTV",
    "description": "American conservative news network covering US defense policy, border enforcement, and national elections.",
    "monogram": "NMAX"
  },
  {
    "id": "wsj_news",
    "title": "The Wall Street Journal",
    "channel": "The Wall Street Journal",
    "channelId": "UCK7tptUDHh-RYDtsxF1gvUw",
    "uploadsPlaylistId": "UUK7tptUDHh-RYDtsxF1gvUw",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "US",
    "countryCode": "US",
    "isLive": false,
    "tags": [
      "Defense Industry",
      "Global Trade",
      "Strategic Intel"
    ],
    "youtubeId": "7T_2K1pX6pE",
    "externalUrl": "https://www.youtube.com/@WSJ",
    "description": "Investigations into defense contracting, weapons supply bottlenecks, and multinational statecraft.",
    "monogram": "WSJ"
  },
  {
    "id": "sky_news_uk",
    "title": "Sky News Live (UK)",
    "channel": "Sky News (UK)",
    "channelId": "UCoMdktPbSTixAyNGwb-UYkQ",
    "uploadsPlaylistId": "UUoMdktPbSTixAyNGwb-UYkQ",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "GB",
    "isLive": true,
    "tags": [
      "NATO",
      "UK MoD",
      "Middle East",
      "Breaking News"
    ],
    "youtubeId": "9Auq9mYxFEE",
    "externalUrl": "https://www.youtube.com/@SkyNews",
    "description": "British 24/7 news broadcaster providing continuous live coverage of UK MoD dispatches, NATO summits, and European defense.",
    "monogram": "SKY"
  },
  {
    "id": "bbc_news",
    "title": "BBC News Live",
    "channel": "BBC News",
    "channelId": "UC16niRr50-MSBwiO3YDb3RA",
    "uploadsPlaylistId": "UU16niRr50-MSBwiO3YDb3RA",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "GB",
    "isLive": true,
    "tags": [
      "World Service",
      "Verified Intelligence",
      "Global Wires"
    ],
    "youtubeId": "21X5lGlDOfg",
    "externalUrl": "https://www.youtube.com/@BBCNews",
    "description": "Global news authority with unmatched worldwide correspondent networks across Eastern Europe, Africa, and Asia.",
    "monogram": "BBC"
  },
  {
    "id": "dw_news_live",
    "title": "DW News 24/7 (Germany)",
    "channel": "DW News (Deutsche Welle)",
    "channelId": "UCknLrEdhRCp1aegoMqRaCZg",
    "uploadsPlaylistId": "UUknLrEdhRCp1aegoMqRaCZg",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "DE",
    "isLive": true,
    "tags": [
      "Bundeswehr",
      "EU Foreign Policy",
      "Eastern Flank",
      "NATO"
    ],
    "youtubeId": "Lu_q_oP4_9A",
    "externalUrl": "https://www.youtube.com/@dwnews",
    "description": "Germany's international broadcaster delivering analytical European perspectives on Ukraine, NATO forward deployments, and EU diplomacy.",
    "monogram": "DW"
  },
  {
    "id": "tagesschau24",
    "title": "Tagesschau24 (ARD Germany)",
    "channel": "Tagesschau24",
    "channelId": "UC5NOEUbkLheQcaaRldYW5GA",
    "uploadsPlaylistId": "UU5NOEUbkLheQcaaRldYW5GA",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "DE",
    "isLive": true,
    "tags": [
      "ARD",
      "German Federal Government",
      "European Security"
    ],
    "youtubeId": "2H7bXjKq5mE",
    "externalUrl": "https://www.youtube.com/@tagesschau",
    "description": "Germany's flagship public news service providing continuous reporting on European defense spending and Bundeswehr deployments.",
    "monogram": "TAG"
  },
  {
    "id": "welt_tv",
    "title": "WELT Nachrichtensender (N24)",
    "channel": "WELT",
    "channelId": "UCZMsvbAhhRblVGXmEXW8TSA",
    "uploadsPlaylistId": "UUZMsvbAhhRblVGXmEXW8TSA",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "DE",
    "isLive": true,
    "tags": [
      "Military Documentaries",
      "Frontline Analysis",
      "German Defense"
    ],
    "youtubeId": "fN2gW5j3y1E",
    "externalUrl": "https://www.youtube.com/@WELTVideoTV",
    "description": "German 24-hour news and military documentary channel known for technical weapons analysis and operational theater maps.",
    "monogram": "WELT"
  },
  {
    "id": "france24_en",
    "title": "France 24 English",
    "channel": "France 24 English",
    "channelId": "UCQfwfsi5VrQ8yKZ-UWmAEFg",
    "uploadsPlaylistId": "UUQfwfsi5VrQ8yKZ-UWmAEFg",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "FR",
    "isLive": true,
    "tags": [
      "Francophone Security",
      "Sahel Counter-Terrorism",
      "EU Defense"
    ],
    "youtubeId": "h3MuIUNCCzI",
    "externalUrl": "https://www.youtube.com/@France24_en",
    "description": "Paris-based international news network with deep investigative reporting across Africa, the Mediterranean, and Europe.",
    "monogram": "F24"
  },
  {
    "id": "france24_fr",
    "title": "France 24 Français",
    "channel": "France 24 Français",
    "channelId": "UCCCPCZNChQdGa9EkATeye4g",
    "uploadsPlaylistId": "UUCCPCZNChQdGa9EkATeye4g",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "FR",
    "isLive": true,
    "tags": [
      "French Defense",
      "Sahel Ops",
      "European Geopolitics"
    ],
    "youtubeId": "47d9V_V2-wU",
    "externalUrl": "https://www.youtube.com/@France24_fr",
    "description": "French-language live broadcast covering Marine Nationale naval maneuvers, African operations, and European strategy.",
    "monogram": "F24F"
  },
  {
    "id": "franceinfo",
    "title": "franceinfo: (France Télévisions)",
    "channel": "franceinfo",
    "channelId": "UCO6K_kkdP-lnSCiO3tPx7WA",
    "uploadsPlaylistId": "UUO6K_kkdP-lnSCiO3tPx7WA",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "FR",
    "isLive": true,
    "tags": [
      "Public Broadcaster",
      "European Geopolitics",
      "French MoD"
    ],
    "youtubeId": "w_Ma8oQLmSM",
    "externalUrl": "https://www.youtube.com/@franceinfo",
    "description": "Continuous French public television news with verified military updates and diplomatic analysis.",
    "monogram": "F枪"
  },
  {
    "id": "euronews_en",
    "title": "Euronews English",
    "channel": "Euronews English",
    "channelId": "UCSrZ3UV4jOidv8ppoVuvW9Q",
    "uploadsPlaylistId": "UUSrZ3UV4jOidv8ppoVuvW9Q",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "EU",
    "isLive": true,
    "tags": [
      "Pan-European",
      "EU Parliament",
      "European Commission"
    ],
    "youtubeId": "pykdAU3P_90",
    "externalUrl": "https://www.youtube.com/@euronews",
    "description": "Pan-European multilingual news channel tracking European Commission sanctions, NATO summits, and eastern border security.",
    "monogram": "EU"
  },
  {
    "id": "euronews_fr",
    "title": "Euronews Français",
    "channel": "Euronews Français",
    "channelId": "UCW2QcKZiU8aUGg4yxCIditg",
    "uploadsPlaylistId": "UUW2QcKZiU8aUGg4yxCIditg",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "FR",
    "isLive": true,
    "tags": [
      "Europe",
      "NATO",
      "EU Policy"
    ],
    "youtubeId": "yR0m_2K8o1o",
    "externalUrl": "https://www.youtube.com/@euronewsfr",
    "description": "Francophone edition of Euronews tracking Continental European security developments.",
    "monogram": "EUFR"
  },
  {
    "id": "rtve_24h",
    "title": "RTVE 24H (Spain)",
    "channel": "RTVE Noticias",
    "channelId": "UC7QZIf0dta-XPXsp9Hv4dTw",
    "uploadsPlaylistId": "UU7QZIf0dta-XPXsp9Hv4dTw",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "ES",
    "isLive": true,
    "tags": [
      "Ibero-America",
      "Mediterranean Security",
      "Spanish Armed Forces"
    ],
    "youtubeId": "6T3p8P1k7lA",
    "externalUrl": "https://www.youtube.com/@rtvenoticias",
    "description": "Spain's public news channel covering Mediterranean maritime corridors, Gibraltar chokepoints, and Latin American diplomacy.",
    "monogram": "RTVE"
  },
  {
    "id": "sky_tg24",
    "title": "Sky TG24 (Italy)",
    "channel": "Sky TG24",
    "channelId": "UCPP3MC_f35e7cS5E3-8fBVA",
    "uploadsPlaylistId": "UUPP3MC_f35e7cS5E3-8fBVA",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "IT",
    "isLive": true,
    "tags": [
      "Central Mediterranean",
      "NATO Southern Flank",
      "Italian Navy"
    ],
    "youtubeId": "9Auq9mYxFEE",
    "externalUrl": "https://www.youtube.com/@SkyTG24",
    "description": "Italy's premier 24-hour news network monitoring central Mediterranean naval routes, Red Sea escort missions, and NATO southern flank.",
    "monogram": "TG24"
  },
  {
    "id": "tvp_world",
    "title": "TVP World (Poland / Eastern Flank)",
    "channel": "TVP World",
    "channelId": "UClCg35Lp3aPZ-G3GqQ2b2Tw",
    "uploadsPlaylistId": "UUlCg35Lp3aPZ-G3GqQ2b2Tw",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "PL",
    "isLive": true,
    "tags": [
      "Suwałki Corridor",
      "NATO Eastern Flank",
      "Belarus Border",
      "Ukraine"
    ],
    "youtubeId": "dp8PhLsUcFE",
    "externalUrl": "https://www.youtube.com/@TVPWorld",
    "description": "Warsaw-based English news channel covering frontlines in Ukraine, Belarusian border fortification, and NATO deterrence in the Baltic basin.",
    "monogram": "TVP"
  },
  {
    "id": "trt_world",
    "title": "TRT World (Turkey)",
    "channel": "TRT World",
    "channelId": "UC7fWeaHhqgM4Ry-RMpM2YYw",
    "uploadsPlaylistId": "UU7fWeaHhqgM4Ry-RMpM2YYw",
    "category": "24/7 LIVE NEWS",
    "region": "Europe / UK",
    "regionGroup": "EUROPE",
    "countryCode": "TR",
    "isLive": true,
    "tags": [
      "Turkish Armed Forces",
      "Black Sea Grain Corridor",
      "Syria / Caucasus"
    ],
    "youtubeId": "HhD_GvGjEeo",
    "externalUrl": "https://www.youtube.com/@trtworld",
    "description": "Turkish international broadcaster providing critical strategic reporting on Bosporus maritime transit, Black Sea security, and drone warfare.",
    "monogram": "TRT"
  },
  {
    "id": "al_jazeera_en",
    "title": "Al Jazeera English",
    "channel": "Al Jazeera English",
    "channelId": "UCNye-wNBqNL5ZzHSJj3l8Bg",
    "uploadsPlaylistId": "UUNye-wNBqNL5ZzHSJj3l8Bg",
    "category": "24/7 LIVE NEWS",
    "region": "Middle East",
    "regionGroup": "MIDDLE_EAST",
    "countryCode": "QA",
    "isLive": true,
    "tags": [
      "Levant Conflict",
      "Red Sea Crisis",
      "Gulf Security",
      "Breaking Dispatches"
    ],
    "youtubeId": "gCNeDWCI0vo",
    "externalUrl": "https://www.youtube.com/@aljazeeraenglish",
    "description": "Leading Middle Eastern news network providing ground-level reporting across Gaza, Southern Lebanon, Yemen, and the Persian Gulf.",
    "monogram": "AJE"
  },
  {
    "id": "al_jazeera_ar",
    "title": "Al Jazeera Arabic",
    "channel": "Al Jazeera Arabic",
    "channelId": "UCfiwzLy-8yKzIbsmZTzxDgw",
    "uploadsPlaylistId": "UUfiwzLy-8yKzIbsmZTzxDgw",
    "category": "24/7 LIVE NEWS",
    "region": "Middle East",
    "regionGroup": "MIDDLE_EAST",
    "countryCode": "QA",
    "isLive": true,
    "tags": [
      "Middle East",
      "Breaking Dispatches",
      "Arab World"
    ],
    "youtubeId": "2bX9k1b3_0M",
    "externalUrl": "https://www.youtube.com/@AlJazeeraArabic",
    "description": "Flagship Arabic 24-hour news broadcast with real-time battlefield telemetry across the Levant and Arabian Peninsula.",
    "monogram": "AJAR"
  },
  {
    "id": "al_arabiya",
    "title": "Al Arabiya News",
    "channel": "Al Arabiya",
    "channelId": "UCahpxixMCwoANAftn6IxkTg",
    "uploadsPlaylistId": "UUahpxixMCwoANAftn6IxkTg",
    "category": "24/7 LIVE NEWS",
    "region": "Middle East",
    "regionGroup": "MIDDLE_EAST",
    "countryCode": "SA",
    "isLive": true,
    "tags": [
      "Saudi Arabia",
      "OPEC+",
      "Gulf Cooperation Council",
      "Houthi Tracking"
    ],
    "youtubeId": "pykdAU3P_90",
    "externalUrl": "https://www.youtube.com/@AlArabiya",
    "description": "Major pan-Arab news channel based in Riyadh, monitoring energy infrastructure security, maritime threats in the Red Sea, and Iranian regional activities.",
    "monogram": "ARB"
  },
  {
    "id": "i24news_en",
    "title": "i24NEWS English (Israel)",
    "channel": "i24NEWS English",
    "channelId": "UCvHDpsWKADrDia0c99X37vg",
    "uploadsPlaylistId": "UUvHDpsWKADrDia0c99X37vg",
    "category": "24/7 LIVE NEWS",
    "region": "Middle East",
    "regionGroup": "MIDDLE_EAST",
    "countryCode": "IL",
    "isLive": true,
    "tags": [
      "IDF Operations",
      "Iron Dome Intercepts",
      "Northern Border",
      "Levant"
    ],
    "youtubeId": "3mYg1q0j1rU",
    "externalUrl": "https://www.youtube.com/@i24NEWS_EN",
    "description": "Tel Aviv-based international network reporting on Israel Defense Forces operations, ballistic missile defense shields, and regional defense pacts.",
    "monogram": "I24"
  },
  {
    "id": "kan_11",
    "title": "KAN 11 News (Israel Public TV)",
    "channel": "KAN 11 News",
    "channelId": "UC_HwfTAcjBESKZRJq6BTCpg",
    "uploadsPlaylistId": "UU_HwfTAcjBESKZRJq6BTCpg",
    "category": "24/7 LIVE NEWS",
    "region": "Middle East",
    "regionGroup": "MIDDLE_EAST",
    "countryCode": "IL",
    "isLive": true,
    "tags": [
      "Public Broadcaster",
      "IDF War Cabinet",
      "Intelligence Community"
    ],
    "youtubeId": "0cK3B6X6q50",
    "externalUrl": "https://www.youtube.com/@KAN11",
    "description": "Israel's public broadcast corporation providing official war cabinet statements, Home Front Command alerts, and strategic security debates.",
    "monogram": "KAN"
  },
  {
    "id": "iran_intl",
    "title": "Iran International English / Farsi",
    "channel": "Iran International",
    "channelId": "UCat6bC0Wrqq9Bcq7EkH_yQw",
    "uploadsPlaylistId": "UUat6bC0Wrqq9Bcq7EkH_yQw",
    "category": "24/7 LIVE NEWS",
    "region": "Middle East",
    "regionGroup": "MIDDLE_EAST",
    "countryCode": "IR",
    "isLive": true,
    "tags": [
      "IRGC Dissident",
      "Nuclear Program",
      "Internal Protests",
      "Sanctions"
    ],
    "youtubeId": "5qap5aO4i9A",
    "externalUrl": "https://www.youtube.com/@IranInternational",
    "description": "Independent Persian news channel tracking IRGC military exercises, uranium enrichment centrifuges at Fordow/Natanz, and domestic political unrest.",
    "monogram": "INTL"
  },
  {
    "id": "trt_haber",
    "title": "TRT Haber (Turkey 24/7)",
    "channel": "TRT Haber",
    "channelId": "UC7fWeaHhqgM4Ry-RMpM2YYw",
    "uploadsPlaylistId": "UU7fWeaHhqgM4Ry-RMpM2YYw",
    "category": "24/7 LIVE NEWS",
    "region": "Middle East",
    "regionGroup": "MIDDLE_EAST",
    "countryCode": "TR",
    "isLive": true,
    "tags": [
      "Turkish Military",
      "MIT Intelligence",
      "East Med"
    ],
    "youtubeId": "7T_2K1pX6pE",
    "externalUrl": "https://www.youtube.com/@trthaber",
    "description": "Turkish state news channel covering military operations across northern Syria, Iraq border security, and Bayraktar drone strikes.",
    "monogram": "HBR"
  },
  {
    "id": "sky_news_arabia",
    "title": "Sky News Arabia",
    "channel": "Sky News Arabia",
    "channelId": "UC-Yq_eY5m-q-z9_F3V62r7A",
    "uploadsPlaylistId": "UU-Yq_eY5m-q-z9_F3V62r7A",
    "category": "24/7 LIVE NEWS",
    "region": "Middle East",
    "regionGroup": "MIDDLE_EAST",
    "countryCode": "AE",
    "isLive": true,
    "tags": [
      "UAE News",
      "Arabian Gulf",
      "Maritime Security"
    ],
    "youtubeId": "w_Ma8oQLmSM",
    "externalUrl": "https://www.youtube.com/@skynewsarabia",
    "description": "Abu Dhabi-based news channel covering energy corridors, Strait of Hormuz freedom of navigation, and Gulf defense coordination.",
    "monogram": "SNA"
  },
  {
    "id": "nhk_world_japan",
    "title": "NHK World-Japan Live",
    "channel": "NHK World-Japan",
    "channelId": "UCSPEjw8F2nQDtmUKPFNF7_A",
    "uploadsPlaylistId": "UUSPEjw8F2nQDtmUKPFNF7_A",
    "category": "24/7 LIVE NEWS",
    "region": "East Asia / Indo-Pacific",
    "regionGroup": "EAST_ASIA",
    "countryCode": "JP",
    "isLive": true,
    "tags": [
      "JMSDF",
      "Senkaku Islands",
      "North Korea Missile Alerts",
      "Disaster Warning"
    ],
    "youtubeId": "f0lYkdA-Gtw",
    "externalUrl": "https://www.youtube.com/@NHKWORLDJAPAN",
    "description": "Japan's international public broadcaster tracking Japan Self-Defense Forces movements, ballistic missile launches from North Korea, and seismic events.",
    "monogram": "NHK"
  },
  {
    "id": "tbs_news_dig",
    "title": "TBS NEWS DIG (Japan)",
    "channel": "TBS NEWS DIG",
    "channelId": "UC6AG81pAkf6Lbi_1VC5NmPA",
    "uploadsPlaylistId": "UU6AG81pAkf6Lbi_1VC5NmPA",
    "category": "24/7 LIVE NEWS",
    "region": "East Asia / Indo-Pacific",
    "regionGroup": "EAST_ASIA",
    "countryCode": "JP",
    "isLive": true,
    "tags": [
      "Japanese Domestic",
      "Maritime Defense",
      "J-Alert Monitoring"
    ],
    "youtubeId": "2bX9k1b3_0M",
    "externalUrl": "https://www.youtube.com/@tbsnewsdig",
    "description": "Leading Japanese commercial news stream monitoring national defense developments, emergency J-Alert warnings, and regional maritime affairs.",
    "monogram": "TBS"
  },
  {
    "id": "ntv_news24_japan",
    "title": "NTV News24 (Nippon TV)",
    "channel": "NTV News24",
    "channelId": "UCuTAXTexrhetbOe3zgskJBQ",
    "uploadsPlaylistId": "UUTAXTexrhetbOe3zgskJBQ",
    "category": "24/7 LIVE NEWS",
    "region": "East Asia / Indo-Pacific",
    "regionGroup": "EAST_ASIA",
    "countryCode": "JP",
    "isLive": true,
    "tags": [
      "Continuous Live",
      "Japan Security",
      "Pacific Weather"
    ],
    "youtubeId": "47d9V_V2-wU",
    "externalUrl": "https://www.youtube.com/@ntv_news",
    "description": "Non-stop Japanese 24-hour news network reporting on East China Sea airspace security and government defense councils.",
    "monogram": "NTV"
  },
  {
    "id": "cna_live",
    "title": "CNA (Channel NewsAsia - Singapore)",
    "channel": "CNA (Channel NewsAsia)",
    "channelId": "UC83jt4dlz1Gjl58fzQrrKZg",
    "uploadsPlaylistId": "UU83jt4dlz1Gjl58fzQrrKZg",
    "category": "24/7 LIVE NEWS",
    "region": "East Asia / Indo-Pacific",
    "regionGroup": "EAST_ASIA",
    "countryCode": "SG",
    "isLive": true,
    "tags": [
      "Malacca Strait",
      "ASEAN Defense",
      "South China Sea",
      "Singapore"
    ],
    "youtubeId": "XWq5kBlakcQ",
    "externalUrl": "https://www.youtube.com/@channelnewsasia",
    "description": "Premier Asian English news channel headquartered in Singapore, providing neutral coverage of Southeast Asian diplomacy and maritime chokepoints.",
    "monogram": "CNA"
  },
  {
    "id": "taiwanplus_news",
    "title": "TaiwanPlus News",
    "channel": "TaiwanPlus",
    "channelId": "UCCJBSLNtozkO-NqjpPZujiQ",
    "uploadsPlaylistId": "UUCJBSLNtozkO-NqjpPZujiQ",
    "category": "24/7 LIVE NEWS",
    "region": "East Asia / Indo-Pacific",
    "regionGroup": "EAST_ASIA",
    "countryCode": "TW",
    "isLive": true,
    "tags": [
      "Cross-Strait",
      "PLA ADIZ Incursions",
      "TSMC Semiconductor Security",
      "Taipei"
    ],
    "youtubeId": "6T3p8P1k7lA",
    "externalUrl": "https://www.youtube.com/@TaiwanPlusNews",
    "description": "Taiwan's premier English-language international broadcaster tracking cross-strait military maneuvers, MND incursions, and semiconductor resilience.",
    "monogram": "TWP"
  },
  {
    "id": "cti_news_taiwan",
    "title": "CTI News (Chung T'ien Taiwan)",
    "channel": "CTI News",
    "channelId": "UC5l1Yto5oOIgRXlI4p4VKbw",
    "uploadsPlaylistId": "UU5l1Yto5oOIgRXlI4p4VKbw",
    "category": "24/7 LIVE NEWS",
    "region": "East Asia / Indo-Pacific",
    "regionGroup": "EAST_ASIA",
    "countryCode": "TW",
    "isLive": true,
    "tags": [
      "Taiwan Strait",
      "Cross-Strait Dialogue",
      "Kinmen / Matsu"
    ],
    "youtubeId": "0cK3B6X6q50",
    "externalUrl": "https://www.youtube.com/@ctitv",
    "description": "Major Taiwanese broadcast channel providing continuous reporting on cross-strait military tensions and Taiwanese domestic political debates.",
    "monogram": "CTI"
  },
  {
    "id": "tvbs_news_taiwan",
    "title": "TVBS News 24/7 (Taiwan)",
    "channel": "TVBS News",
    "channelId": "UC5nwNW4KdC0SzrhF9BXEYOQ",
    "uploadsPlaylistId": "UU5nwNW4KdC0SzrhF9BXEYOQ",
    "category": "24/7 LIVE NEWS",
    "region": "East Asia / Indo-Pacific",
    "regionGroup": "EAST_ASIA",
    "countryCode": "TW",
    "isLive": true,
    "tags": [
      "Taiwan MND Reports",
      "Air Defense Alerts",
      "Naval Exercises"
    ],
    "youtubeId": "5qap5aO4i9A",
    "externalUrl": "https://www.youtube.com/@TVBSNEWS01",
    "description": "Taiwan's widely watched news broadcaster with live coverage of MND press conferences, civil defense drills, and coastal radar reports.",
    "monogram": "TVBS"
  },
  {
    "id": "arirang_news_korea",
    "title": "Arirang News (South Korea)",
    "channel": "Arirang News",
    "channelId": "UCzznO4xSV8BKnUBPyswtCUw",
    "uploadsPlaylistId": "UUzznO4xSV8BKnUBPyswtCUw",
    "category": "24/7 LIVE NEWS",
    "region": "East Asia / Indo-Pacific",
    "regionGroup": "EAST_ASIA",
    "countryCode": "KR",
    "isLive": true,
    "tags": [
      "Korean Peninsula",
      "DMZ Alert",
      "ROK-US Alliance",
      "Pyongyang Tracking"
    ],
    "youtubeId": "dp8PhLsUcFE",
    "externalUrl": "https://www.youtube.com/@arirangnews",
    "description": "Seoul-based English international broadcaster monitoring KPA artillery drills, North Korean ICBM launches, and ROK joint military exercises.",
    "monogram": "ARI"
  },
  {
    "id": "yonhap_news_tv",
    "title": "YONHAP News TV (South Korea)",
    "channel": "YONHAP News TV",
    "channelId": "UCTHCOPwqNfZ0uiKOvFyhGwg",
    "uploadsPlaylistId": "UUTHCOPwqNfZ0uiKOvFyhGwg",
    "category": "24/7 LIVE NEWS",
    "region": "East Asia / Indo-Pacific",
    "regionGroup": "EAST_ASIA",
    "countryCode": "KR",
    "isLive": true,
    "tags": [
      "Korean Wire",
      "JCS Briefings",
      "Frontline Guard Posts"
    ],
    "youtubeId": "7T_2K1pX6pE",
    "externalUrl": "https://www.youtube.com/@yonhapnewstv",
    "description": "South Korea's primary news agency broadcast channel delivering live briefings from the Joint Chiefs of Staff and Ministry of National Defense.",
    "monogram": "YNP"
  },
  {
    "id": "abc_news_australia",
    "title": "ABC News Live (Australia)",
    "channel": "ABC News (Australia)",
    "channelId": "UCVgO39Bk5sMo66-6o6Spn6Q",
    "uploadsPlaylistId": "UUVgO39Bk5sMo66-6o6Spn6Q",
    "category": "24/7 LIVE NEWS",
    "region": "East Asia / Indo-Pacific",
    "regionGroup": "EAST_ASIA",
    "countryCode": "AU",
    "isLive": true,
    "tags": [
      "AUKUS",
      "South Pacific",
      "Indo-Pacific Naval Exercises",
      "Canberra"
    ],
    "youtubeId": "dQw4w9WgXcQ",
    "externalUrl": "https://www.youtube.com/@ABCNewsIn-depth",
    "description": "Australian national broadcaster tracking AUKUS nuclear submarine programs, Solomon Islands security pacts, and Indo-Pacific maritime missions.",
    "monogram": "AUBC"
  },
  {
    "id": "cbc_news_canada",
    "title": "CBC News Live (Canada)",
    "channel": "CBC News",
    "channelId": "UCuFFtHWoLl5fauMMD5Ww2jA",
    "uploadsPlaylistId": "UUuFFtHWoLl5fauMMD5Ww2jA",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "AMERICAS",
    "countryCode": "CA",
    "isLive": true,
    "tags": [
      "NORAD Arctic Defense",
      "Canadian Armed Forces",
      "NATO Northern Flank"
    ],
    "youtubeId": "2H7bXjKq5mE",
    "externalUrl": "https://www.youtube.com/@CBCNews",
    "description": "Canada's public broadcaster reporting on Arctic sovereignty, NORAD radar modernization, and Canadian Armed Forces NATO deployments.",
    "monogram": "CBC"
  },
  {
    "id": "global_news_canada",
    "title": "Global News (Canada)",
    "channel": "Global News",
    "channelId": "UChLtXXpo4Ge1ReTEboVvTDg",
    "uploadsPlaylistId": "UUhLtXXpo4Ge1ReTEboVvTDg",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "AMERICAS",
    "countryCode": "CA",
    "isLive": true,
    "tags": [
      "Canadian Security",
      "Foreign Interference",
      "Arctic Watch"
    ],
    "youtubeId": "fN2gW5j3y1E",
    "externalUrl": "https://www.youtube.com/@GlobalNews",
    "description": "Major Canadian commercial news network tracking national security investigations, defense reviews, and North American trade flows.",
    "monogram": "GLB"
  },
  {
    "id": "tn_argentina",
    "title": "TN Todo Noticias (Argentina)",
    "channel": "TN - Todo Noticias",
    "channelId": "UCj6PcyLvpnIRT_2W_mwa9Aw",
    "uploadsPlaylistId": "UUj6PcyLvpnIRT_2W_mwa9Aw",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "AMERICAS",
    "countryCode": "AR",
    "isLive": true,
    "tags": [
      "South Atlantic",
      "Antarctic Access",
      "Latin American Politics"
    ],
    "youtubeId": "HhD_GvGjEeo",
    "externalUrl": "https://www.youtube.com/@todonoticias",
    "description": "Argentina's leading 24-hour news network providing coverage of South Atlantic maritime patrols, Magellan Strait transit, and regional affairs.",
    "monogram": "TN"
  },
  {
    "id": "cnn_brasil",
    "title": "CNN Brasil 24/7",
    "channel": "CNN Brasil",
    "channelId": "UCvdwhh_fDyWccR42-rReZLw",
    "uploadsPlaylistId": "UUvdwhh_fDyWccR42-rReZLw",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "AMERICAS",
    "countryCode": "BR",
    "isLive": true,
    "tags": [
      "Amazon Sovereignty",
      "South America Geopolitics",
      "BRICS"
    ],
    "youtubeId": "pykdAU3P_90",
    "externalUrl": "https://www.youtube.com/@CNNBrasil",
    "description": "Brazil's 24-hour news channel monitoring South American defense policy, Amazon border monitoring, and BRICS summits.",
    "monogram": "CNNB"
  },
  {
    "id": "ntn24_latam",
    "title": "NTN24 (Nuestra Tele Noticias 24)",
    "channel": "NTN24",
    "channelId": "UCj6PcyLvpnIRT_2W_mwa9Aw",
    "uploadsPlaylistId": "UUj6PcyLvpnIRT_2W_mwa9Aw",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "AMERICAS",
    "countryCode": "CO",
    "isLive": true,
    "tags": [
      "Panama Canal",
      "Colombia",
      "Venezuela Security",
      "Caribbean"
    ],
    "youtubeId": "3mYg1q0j1rU",
    "externalUrl": "https://www.youtube.com/@ntn24",
    "description": "Pan-American news network covering Caribbean basin security, Panama Canal traffic disruptions, and Venezuelan frontier tensions.",
    "monogram": "NTN"
  },
  {
    "id": "enca_south_africa",
    "title": "eNCA (eNews Channel Africa)",
    "channel": "eNCA",
    "channelId": "UCoMdktPbSTixAyNGwb-UYkQ",
    "uploadsPlaylistId": "UUoMdktPbSTixAyNGwb-UYkQ",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "AFRICA",
    "countryCode": "ZA",
    "isLive": true,
    "tags": [
      "Cape of Good Hope SLOC",
      "SADC Peacekeeping",
      "African Union"
    ],
    "youtubeId": "0cK3B6X6q50",
    "externalUrl": "https://www.youtube.com/@eNCA",
    "description": "South Africa's independent 24-hour television news broadcaster monitoring Cape of Good Hope maritime traffic and southern African security.",
    "monogram": "ENCA"
  },
  {
    "id": "channels_tv_nigeria",
    "title": "Channels Television (Nigeria / West Africa)",
    "channel": "Channels Television",
    "channelId": "UCEXGDNclvmg6RW0vipJYsTQ",
    "uploadsPlaylistId": "UUEXGDNclvmg6RW0vipJYsTQ",
    "category": "24/7 LIVE NEWS",
    "region": "Americas / US",
    "regionGroup": "AFRICA",
    "countryCode": "NG",
    "isLive": true,
    "tags": [
      "Gulf of Guinea Piracy",
      "ECOWAS Defense",
      "Sahel Flashpoint"
    ],
    "youtubeId": "5qap5aO4i9A",
    "externalUrl": "https://www.youtube.com/@channelstv",
    "description": "Leading Nigerian news channel tracking Gulf of Guinea maritime piracy, ECOWAS military readiness, and West African counter-insurgency.",
    "monogram": "CTV"
  }
];
