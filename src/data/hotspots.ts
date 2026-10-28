import { IntelHotspot } from '../types';

export const INTEL_HOTSPOTS: IntelHotspot[] = [
  {
    id: 'taiwan_strait',
    name: 'Taiwan Strait & Bashi Channel',
    coordinates: [119.5, 24.2],
    escalationScore: 89,
    escalationTrend: 'escalating',
    escalationDelta: '▲ +3.8',
    countryCode: 'TW',
    region: 'indo-pacific',
    telemetry: {
      airActivity: 'HIGH (42 SORTIES/24H)',
      navalDensity: '16 PLAN COMBATANTS',
      gnssJamming: 'ELEVATED IN STRAIT',
      adizIncursions: '28 COMBAT AIRFRAMES'
    },
    description: 'Heightened cross-strait military maneuvers, median line air patrols, and joint naval blockading exercises by PLA Eastern Theater Command.',
    whyItMatters: 'Global semiconductor manufacturing chokepoint (TSMC); primary US-China direct conflict trigger.',
    agencies: ['PLA Eastern Theater', 'Taiwan MND', 'USINDOPACOM'],
    recentIncidents: [
      'Joint Sword amphibious blockade simulations',
      'Median line regular air patrols and drone flyovers',
      'Submarine acoustic tracking around Bashi Channel'
    ]
  },
  {
    id: 'strait_of_hormuz',
    name: 'Strait of Hormuz',
    coordinates: [56.3, 26.5],
    escalationScore: 94,
    escalationTrend: 'escalating',
    escalationDelta: '▲ +4.5',
    countryCode: 'IR',
    region: 'middle-east',
    telemetry: {
      airActivity: 'UAV SURVEILLANCE ACTIVE',
      navalDensity: 'IRGC FAST ATTACK SWARMS',
      gnssJamming: 'ACTIVE (78% ATTENUATION)',
      adizIncursions: 'CENTCOM B-52 PATROL'
    },
    description: 'Vessel seizures, IRGC fast-attack boat harassment, electronic warfare and GPS spoofing targeting commercial oil tankers.',
    whyItMatters: '21 million barrels of crude transit daily (21% of global petroleum consumption).',
    agencies: ['IRGC Navy', 'US NAVCENT / 5th Fleet', 'UK MTO'],
    recentIncidents: [
      'GPS spoofing drifting commercial tankers toward territorial waters',
      'Ballistic coastal battery drills by Iranian armed forces',
      'Coalition naval escort operations Sentinel & Aspides'
    ]
  },
  {
    id: 'red_sea_bab_el_mandeb',
    name: 'Bab el-Mandeb & Red Sea Corridor',
    coordinates: [43.3, 12.6],
    escalationScore: 96,
    escalationTrend: 'escalating',
    escalationDelta: '▲ +5.2',
    countryCode: 'YE',
    region: 'middle-east',
    telemetry: {
      airActivity: 'MQ-9 & STRIKE PATROLS',
      navalDensity: 'OP PROSPERITY GUARDIAN',
      gnssJamming: 'AIS SPOOFING REPORTED',
      adizIncursions: 'ASBM LAUNCH SIGNATURES'
    },
    description: 'Ansar Allah (Houthi) anti-ship ballistic missile and one-way explosive USV strikes on commercial and naval vessels.',
    whyItMatters: 'Forces vessels to divert around Cape of Good Hope, adding 10-14 days transit and 30% shipping costs.',
    agencies: ['Operation Prosperity Guardian', 'CENTCOM', 'EUNAVFOR Aspides'],
    recentIncidents: [
      'Anti-ship ballistic missile launched at bulk cargo carrier',
      'Uncrewed surface vessel (USV) intercepted by guided missile destroyer',
      'Combined airstrikes targeting subterranean weapons depots in Hodeidah'
    ]
  },
  {
    id: 'eastern_ladakh_lac',
    name: 'Eastern Ladakh LAC (Galwan / Depsang)',
    coordinates: [78.2, 34.5],
    escalationScore: 82,
    escalationTrend: 'stable',
    escalationDelta: '▼ -1.2',
    countryCode: 'IN',
    region: 'india',
    telemetry: {
      airActivity: 'SU-30MKI & RAFALE PATROLS',
      navalDensity: 'PANGONG TSO SPEED BOATS',
      gnssJamming: 'LOCALIZED EW MONITORING',
      adizIncursions: 'VERIFIED DISENGAGEMENT'
    },
    description: 'High-altitude standoff along the Line of Actual Control between Indian Army 14 Corps and PLA Western Theater Command with forward armor and radar arrays.',
    whyItMatters: 'Direct border boundary between two nuclear powers; strategic control over Karakoram Pass, DBO runway, and Aksai Chin.',
    agencies: ['Indian Army Northern Command', 'PLA Western Theater Command', 'ITBP'],
    recentIncidents: [
      'Coordinated patrolling agreement operationalized in Depsang and Demchok',
      'High-altitude drone surveillance sorties along Galwan River valley',
      'Winter prepositioning of mechanized infantry and T-90 Bhishma tanks'
    ]
  },
  {
    id: 'south_china_sea',
    name: 'Second Thomas Shoal & Scarborough',
    coordinates: [115.86, 9.74],
    escalationScore: 86,
    escalationTrend: 'escalating',
    escalationDelta: '▲ +2.7',
    countryCode: 'PH',
    region: 'indo-pacific',
    telemetry: {
      airActivity: 'P-8A ASW OVERFLIGHTS',
      navalDensity: '24 CCG & MARITIME MILITIA',
      gnssJamming: 'SATELLITE DOWNLINK NOISE',
      adizIncursions: 'MILITIA SWARM BLOCKADE'
    },
    description: 'China Coast Guard water cannon assaults, collision maneuvers, and ramming incidents opposing Philippine resupply missions to BRP Sierra Madre.',
    whyItMatters: 'Mutual Defense Treaty triggers between United States and Philippines; $3.4 trillion in annual shipborne commerce.',
    agencies: ['China Coast Guard', 'Philippine Coast Guard', 'USINDOPACOM'],
    recentIncidents: [
      'High-pressure water cannoning of PCG resupply vessel Unaizah May 4',
      'Acoustic sound-cannon deployments and rigid hull inflatable interdictions',
      'Joint naval patrols with US, Australian, Japanese, and Filipino warships'
    ]
  },
  {
    id: 'korean_dmz',
    name: 'Korean DMZ & Northern Limit Line',
    coordinates: [126.9, 38.0],
    escalationScore: 78,
    escalationTrend: 'escalating',
    escalationDelta: '▲ +2.1',
    countryCode: 'KR',
    region: 'indo-pacific',
    telemetry: {
      airActivity: 'RC-135 RECONNAISSANCE',
      navalDensity: 'NLL PATROL CRAFT INTERCEPT',
      gnssJamming: 'WEST COAST GPS JAMMING',
      adizIncursions: 'IRBM LAUNCH TRAJECTORY'
    },
    description: 'Artillery drills, missile testing, GPS jamming along the border, and complete severance of road/rail links by Pyongyang.',
    whyItMatters: 'Direct artillery range of Seoul metropolitan area (25M population); nuclear deterrence standoff.',
    agencies: ['ROK JCS', 'USFK / Combined Forces Command', 'KPA Supreme Command'],
    recentIncidents: [
      'Solid-fuel hypersonic IRBM test trajectory toward Sea of Japan',
      'Demolition of northern sections of Gyeongui and Donghae inter-Korean corridors',
      'Massive GPS disruption signals recorded near Yeonpyeong island'
    ]
  },
  {
    id: 'zaporizhzhia_npp',
    name: 'Zaporizhzhia Nuclear Complex',
    coordinates: [35.1, 47.5],
    escalationScore: 92,
    escalationTrend: 'escalating',
    escalationDelta: '▲ +3.4',
    countryCode: 'UA',
    region: 'europe',
    telemetry: {
      airActivity: 'FPV DRONE RECON ACTIVE',
      navalDensity: 'DNIPRO COMBAT PATROLS',
      gnssJamming: 'TOTAL SAT-NAV BLACKOUT',
      adizIncursions: 'ARTILLERY IMPACT WITHIN 1KM'
    },
    description: 'Europe\'s largest nuclear station under Russian military occupation, subject to drone attacks, artillery strikes, and backup grid outages.',
    whyItMatters: 'Catastrophic radiological contamination risk across Eastern and Central Europe.',
    agencies: ['IAEA Mission', 'Energoatom', 'Rosatom'],
    recentIncidents: [
      'Cooling tower fire following armed drone detonation',
      'Loss of external 750kV Dniprovska power line connection',
      'IAEA inspectors confirm physical damage to containment structures'
    ]
  },
  {
    id: 'golan_lebanon_border',
    name: 'Northern Israel & Southern Lebanon',
    coordinates: [35.5, 33.2],
    escalationScore: 95,
    escalationTrend: 'escalating',
    escalationDelta: '▲ +4.1',
    countryCode: 'IL',
    region: 'middle-east',
    telemetry: {
      airActivity: 'IDF AIR SORTIES / DAHIEH',
      navalDensity: 'SAAR-6 CORVETTES ON PATROL',
      gnssJamming: 'ISRAEL-WIDE GPS SPOOFING',
      adizIncursions: 'HEZBOLLAH DRONE SALVOS'
    },
    description: 'High-intensity ground operations, cross-border missile and precision drone volleys, airstrikes across Dahieh and Bekaa.',
    whyItMatters: 'Escalation into regional theater war pulling in Iranian proxies and coalition missile defense shields.',
    agencies: ['IDF Northern Command', 'Hezbollah Military Council', 'UNIFIL'],
    recentIncidents: [
      'Precision air interdictions on subterranean missile stockpiles',
      'Heavy rocket salvos targeting military bases in Haifa and Upper Galilee',
      'Ground skirmishes along the UN Blue Line'
    ]
  },
  {
    id: 'suwalki_gap',
    name: 'Suwałki Corridor (NATO Flank)',
    coordinates: [23.3, 54.3],
    escalationScore: 71,
    escalationTrend: 'stable',
    escalationDelta: '— 0.0',
    countryCode: 'PL',
    region: 'europe',
    telemetry: {
      airActivity: 'NATO AWACS E-3A SURVEILLANCE',
      navalDensity: 'BALTIC NATO STANDING GROUP',
      gnssJamming: 'KALININGRAD EW ARRAYS',
      adizIncursions: 'BALTIC AIR POLICING'
    },
    description: 'Narrow 65km land strip linking Baltic NATO allies (Lithuania/Poland) between Russian exclave Kaliningrad and Belarus.',
    whyItMatters: 'NATO\'s most vulnerable land corridor; strategic cut-off vector in high-intensity European conflict.',
    agencies: ['NATO Enhanced Forward Presence', 'Polish 16th Div', 'Belarus Border Guard'],
    recentIncidents: [
      'NATO Steadfast Defender armored mobility drills',
      'Kaliningrad deployment of Iskander-M nuclear-capable missile brigades',
      'Electronic countermeasure spoofing disrupting civil aviation across Baltic airspace'
    ]
  },
  {
    id: 'malacca_andaman_chokepoint',
    name: 'Strait of Malacca & Great Nicobar',
    coordinates: [95.5, 5.8],
    escalationScore: 68,
    escalationTrend: 'stable',
    escalationDelta: '▼ -0.5',
    countryCode: 'IN',
    region: 'india',
    telemetry: {
      airActivity: 'INAS 312 P-8I SURVEILLANCE',
      navalDensity: 'ANDAMAN COMMAND WARSHIPS',
      gnssJamming: 'NOMINAL COMMERCE TRANSIT',
      adizIncursions: 'SUBMARINE ACOUSTIC TRACE'
    },
    description: 'Crucial Indo-Pacific maritime chokepoint through which over 80% of East Asia\'s oil imports transit past India\'s Andaman & Nicobar Command.',
    whyItMatters: 'Primary global energy SLOC; naval blockade leverage over Chinese energy supply lines.',
    agencies: ['Indian Navy Andaman & Nicobar Command', 'Indonesian Navy', 'Singapore Navy'],
    recentIncidents: [
      'Anti-submarine acoustic barrier upgrades at Great Nicobar Indira Point',
      'Coordinated patrols (CORPAT) across Six Degree Channel',
      'Tracking of PLA Navy Yuan-class AIP submarine transits toward IOR'
    ]
  },
  {
    id: 'sahel_burkina_mali_niger',
    name: 'Central Sahel Flashpoint',
    coordinates: [-1.2, 14.5],
    escalationScore: 84,
    escalationTrend: 'escalating',
    escalationDelta: '▲ +3.1',
    countryCode: 'ML',
    region: 'africa',
    telemetry: {
      airActivity: 'BAYRAKTAR TB2 COMBAT DRONES',
      navalDensity: 'INLAND RIVER PATROLS',
      gnssJamming: 'RURAL COMM SHUTDOWNS',
      adizIncursions: 'INSURGENT CONVOY MOVEMENT'
    },
    description: 'Alliance of Sahel States (AES) junta consolidation, expulsion of Western forces, and expanding operations by Wagner / Africa Corps against JNIM and ISGS.',
    whyItMatters: 'Loss of Western counter-terror access; expanding Russian gold/uranium concessions; massive displacement.',
    agencies: ['Africa Corps (Wagner)', 'AES Military Alliance', 'JNIM'],
    recentIncidents: [
      'Ambush on combined military-mercenary convoy near Tinzaouaten',
      'Severe drone strikes on insurgent training compounds in northern Mali',
      'Withdrawal from ECOWAS regional defense framework'
    ]
  },
  {
    id: 'baltic_critical_infra',
    name: 'Baltic Sea Undersea Infrastructure',
    coordinates: [22.0, 59.5],
    escalationScore: 76,
    escalationTrend: 'escalating',
    escalationDelta: '▲ +1.9',
    countryCode: 'EE',
    region: 'europe',
    telemetry: {
      airActivity: 'MARITIME PATROL OVERFLIGHTS',
      navalDensity: 'NATO MINE COUNTERMEASURES',
      gnssJamming: 'GULF OF FINLAND SPOOFING',
      adizIncursions: 'SHADOW FLEET TRANSPONDER OFF'
    },
    description: 'Targeted physical damage to undersea gas pipelines (Balticconnector) and telecommunications fiber cables.',
    whyItMatters: 'Hybrid warfare targeting NATO energy security, data transport, and power grid links.',
    agencies: ['NATO Maritime Command', 'Finnish Border Guard', 'Swedish Coast Guard'],
    recentIncidents: [
      'Anchor drag incident severing high-capacity telecom conduits',
      'Shadow tanker fleet transits without certified AIS telemetry or pilots',
      'NATO Baltic Sea mine-countermeasure and seabed surveillance patrols'
    ]
  }
];
