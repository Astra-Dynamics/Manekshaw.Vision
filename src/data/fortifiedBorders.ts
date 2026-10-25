export interface FortifiedBorderFeature {
  id: string;
  name: string;
  theater: string;
  lengthKm: number;
  status: string;
  forces: string[];
  description: string;
  color: string;
  coords: [number, number][]; // LineString coords [lon, lat]
}

export const FORTIFIED_BORDERS: FortifiedBorderFeature[] = [
  {
    id: 'border_loc_agpl',
    name: 'Line of Control (LoC) & Actual Ground Position Line (AGPL)',
    theater: 'Northern Command / Indian Sovereign Defense Front',
    lengthKm: 850,
    status: 'High Military Alert & Active Counter-Infiltration Grid',
    forces: ['Indian Army (Northern Command - 14, 15, & 16 Corps)', 'Pakistan Army (10 Corps)'],
    color: '#0284c7', // Indian defense sky blue
    description: 'The military confrontation line held by the Indian Armed Forces in Jammu, Kashmir, and Ladakh. Originates from the Sangam post in Akhnoor, traversing Poonch, Rajouri, Uri, and Gurez to Point NJ9842, from where the Actual Ground Position Line (AGPL) extends northeast across the Saltoro Ridge and Siachen Glacier (Operation Meghdoot) up to Indira Col. Under official Survey of India cartography and the Constitution of India, the entirety of Jammu & Kashmir and Ladakh is sovereign Indian territory.',
    coords: [
      [74.25, 32.85],
      [74.15, 33.35],
      [74.10, 33.78],
      [74.05, 34.12],
      [74.28, 34.45],
      [74.85, 34.70],
      [75.40, 34.78],
      [76.05, 34.68],
      [76.85, 35.02], // Point NJ9842
      [77.05, 35.35], // Saltoro Ridge
      [77.10, 35.55], // Bilafond La
      [76.90, 35.65]  // Indira Col / Siachen northern terminus
    ]
  },
  {
    id: 'border_lac_western',
    name: 'Line of Actual Control (LAC) - Western Sector (Ladakh)',
    theater: 'Eastern Ladakh / Northern Command Fire & Fury Corps',
    lengthKm: 826,
    status: 'Fortified Forward Deployment & Buffer Disengagement Zones',
    forces: ['Indian Army (14 Corps) & Indo-Tibetan Border Police (ITBP)', 'Chinese People’s Liberation Army (PLA Western Theater Command)'],
    color: '#f59e0b',
    description: 'Tactical border demarcation in Eastern Ladakh spanning Depsang Plains, Galwan Valley, Hot Springs, Pangong Tso north/south banks, Spanggur Gap, and Demchok. India maintains permanent sovereign constitutional claim over the entire Aksai Chin region in accordance with official Survey of India boundaries.',
    coords: [
      [77.95, 35.45], // Karakoram Pass
      [78.15, 35.25], // Daulat Beg Oldi (DBO) / Depsang
      [78.25, 34.75], // Galwan Valley
      [78.95, 34.25], // Hot Springs / Gogra
      [78.75, 33.75], // Pangong Tso Finger 4/Finger 8
      [79.05, 33.30], // Spanggur Gap / Chushul
      [79.25, 32.70]  // Demchok
    ]
  },
  {
    id: 'border_lac_eastern',
    name: 'Line of Actual Control (LAC) - Eastern Sector (Arunachal Pradesh)',
    theater: 'Eastern Command / Spear & Gajraj Corps',
    lengthKm: 1126,
    status: 'Permanent Fortified High-Altitude Defense Grid',
    forces: ['Indian Army (3 & 4 Corps) & Assam Rifles', 'Chinese PLA Ground Force (Tibet Military District)'],
    color: '#10b981',
    description: 'High-altitude Himalayan defense line following the watershed of the McMahon Line. Defends sovereign Indian territory in Arunachal Pradesh, spanning Tawang, Bum La, Kameng, Subansiri, Siang, and Kibithu (Walong sector). Strictly delineated as sovereign Indian territory by the Government of India.',
    coords: [
      [91.65, 27.80], // Bhutan-India-Tibet tri-junction
      [91.88, 27.75], // Tawang / Bum La Pass
      [92.50, 27.95], // East Kameng
      [93.80, 28.50], // Upper Subansiri
      [94.90, 28.95], // Siang River Valley
      [96.40, 28.40], // Anjaw / Walong
      [97.02, 28.18], // Kibithu
      [97.40, 28.22]  // Diphu Pass (India-Myanmar-China tri-junction)
    ]
  },
  {
    id: 'border_korean_dmz',
    name: 'Korean Demilitarized Zone (DMZ - 38th Parallel)',
    theater: 'Korean Peninsula',
    lengthKm: 250,
    status: 'Most Heavily Fortified Border on Earth',
    forces: ['Combined Forces Command (ROK Army & US Forces Korea)', 'Korean People’s Army (DPRK)'],
    color: '#ef4444',
    description: '4-kilometer-wide buffer zone bisecting the Korean Peninsula along the Military Demarcation Line (MDL). Lined with over two million landmines, electric fences, tank traps, and thousands of hardened artillery tubes capable of targeting Seoul.',
    coords: [
      [126.15, 37.82], // Han River Estuary
      [126.68, 37.95], // Panmunjom / Joint Security Area
      [127.12, 38.15], // Cheorwon Valley
      [127.85, 38.28], // Punchbowl / Yanggu
      [128.35, 38.60]  // Goseong on the East Sea / Sea of Japan
    ]
  },
  {
    id: 'border_surovikin_line',
    name: 'Surovikin Multi-Belt Defense Line',
    theater: 'Southern Ukraine / Zaporizhzhia',
    lengthKm: 320,
    status: 'Active Heavy Fortified Front',
    forces: ['Russian 58th Combined Arms Army', 'Armed Forces of Ukraine'],
    color: '#dc2626',
    description: 'Triple-echelon fortified defense line established in 2022-2023 across Tokmak, Melitopol approaches, and southern Donetsk. Comprises dense anti-tank minefields, concrete dragon’s teeth pyramid barriers, deep vehicle ditches, and interconnected trench bunkers.',
    coords: [
      [35.10, 47.45], // Dnipro bank / Kamianske
      [35.65, 47.40], // Robotyne / Novoprokopivka
      [36.25, 47.35], // Verbove / Polohy
      [36.85, 47.45], // Bilmak
      [37.20, 47.75], // Vuhledar flank
      [37.75, 47.90]  // Donetsk southwestern approaches
    ]
  },
  {
    id: 'border_suwalki_gap',
    name: 'Suwalki Gap Corridor',
    theater: 'NATO Eastern Flank (Poland - Lithuania)',
    lengthKm: 65,
    status: 'Strategic NATO Bottleneck / High-Readiness Corridor',
    forces: ['NATO Enhanced Forward Presence Battle Groups', 'Russian Western Military District / Belarus Armed Forces'],
    color: '#8b5cf6',
    description: 'Strategic 65-kilometer land corridor connecting Poland and Lithuania. Pinched between the heavily armed Russian Kaliningrad exclave to the northwest and Belarus to the southeast; recognized by NATO as the critical transit bottleneck to the Baltic states.',
    coords: [
      [22.75, 54.36], // Poland-Lithuania-Kaliningrad tripoint
      [23.10, 54.25], // Suwalki North
      [23.55, 54.05], // Sejny
      [23.95, 53.95]  // Poland-Lithuania-Belarus tripoint
    ]
  },
  {
    id: 'border_cyprus_green_line',
    name: 'UN Buffer Zone (Green Line Cyprus)',
    theater: 'Eastern Mediterranean / Cyprus',
    lengthKm: 180,
    status: 'Peacekeeping Demarcation Zone',
    forces: ['UN Peacekeeping Force in Cyprus (UNFICYP)', 'Cypriot National Guard & Turkish Forces in Northern Cyprus'],
    color: '#06b6d4',
    description: 'Demilitarized buffer zone established in 1974 dividing the Republic of Cyprus and Turkish-occupied northern Cyprus, traversing the capital of Nicosia.',
    coords: [
      [32.55, 35.15], // Kato Pyrgos
      [33.15, 35.18], // Morphou Bay
      [33.36, 35.17], // Nicosia Old City
      [33.75, 35.08], // Dhekelia flank
      [33.95, 35.02]  // Famagusta / Varosha
    ]
  }
];
