import { IntelHotspot } from '../types';

export const INTEL_HOTSPOTS: IntelHotspot[] = [
  {
    id: 'taiwan_strait',
    name: 'Taiwan Strait',
    coordinates: [119.5, 24.2],
    escalationScore: 4,
    escalationTrend: 'escalating',
    description: 'Heightened cross-strait military maneuvers, ADIZ incursions, and naval blockading drills by PLA Eastern Theater Command.',
    whyItMatters: 'Global semiconductor manufacturing chokepoint (TSMC); direct US-China conflict tripwire.',
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
    escalationScore: 5,
    escalationTrend: 'escalating',
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
    name: 'Bab el-Mandeb & Red Sea',
    coordinates: [43.3, 12.6],
    escalationScore: 5,
    escalationTrend: 'escalating',
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
    id: 'south_china_sea',
    name: 'Second Thomas Shoal (Spratlys)',
    coordinates: [115.86, 9.74],
    escalationScore: 4,
    escalationTrend: 'escalating',
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
    escalationScore: 4,
    escalationTrend: 'escalating',
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
    escalationScore: 5,
    escalationTrend: 'escalating',
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
    id: 'suwalki_gap',
    name: 'Suwałki Corridor',
    coordinates: [23.3, 54.3],
    escalationScore: 3,
    escalationTrend: 'stable',
    description: 'Narrow land strip linking Baltic NATO allies (Lithuania/Poland) between Russian exclave Kaliningrad and Belarus.',
    whyItMatters: 'NATO\'s most vulnerable land corridor; strategic cut-off vector in high-intensity European conflict.',
    agencies: ['NATO Enhanced Forward Presence', 'Polish 16th Div', 'Belarus Border Guard'],
    recentIncidents: [
      'NATO Steadfast Defender armored mobility drills',
      'Kaliningrad deployment of Iskander-M nuclear-capable missile brigades',
      'Electronic countermeasure spoofing disrupting civil aviation across Baltic airspace'
    ]
  },
  {
    id: 'golan_lebanon_border',
    name: 'Northern Israel & Southern Lebanon',
    coordinates: [35.5, 33.2],
    escalationScore: 5,
    escalationTrend: 'escalating',
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
    id: 'sahel_burkina_mali_niger',
    name: 'Central Sahel Flashpoint',
    coordinates: [-1.2, 14.5],
    escalationScore: 4,
    escalationTrend: 'escalating',
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
    escalationScore: 4,
    escalationTrend: 'escalating',
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
