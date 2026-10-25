import { MapFeatureItem, GpsJammingZone } from '../types';

export const GPS_JAMMING_ZONES: GpsJammingZone[] = [
  {
    id: 'ew_baltic_kaliningrad',
    name: 'Baltic Sea & Kaliningrad EW Corridor',
    region: 'Baltic / Eastern Europe',
    center: [20.8, 54.9],
    intensity: 'critical',
    attenuationPercent: 92,
    frequencies: ['GPS L1 (1575.42 MHz)', 'GPS L2 (1227.60 MHz)', 'Galileo E1', 'GLONASS L1'],
    systemsDetected: ['1RL257 Krasukha-4', 'RB-341V Leer-3', 'Murmansk-BN Strategic EW', 'Tobol Electronic Shield'],
    advisory: 'Commercial aviation reports widespread loss of primary GNSS navigation across Poland, Baltic states, and southern Sweden. Aircraft reverting to VOR/DME terrestrial beacons and inertial navigation.',
    description: 'Commercial aviation reports widespread loss of primary GNSS navigation across Poland, Baltic states, and southern Sweden. Aircraft reverting to VOR/DME terrestrial beacons and inertial navigation.',
    updatedAt: 'Continuous Electronic Attack',
    coords: [
      [18.5, 54.2],
      [20.5, 54.0],
      [22.8, 54.5],
      [23.5, 55.6],
      [22.2, 56.4],
      [20.0, 56.2],
      [18.2, 55.4],
      [18.5, 54.2]
    ]
  },
  {
    id: 'ew_black_sea_crimea',
    name: 'Black Sea & Crimean Electronic Warfare Bastion',
    region: 'Black Sea / Southern Ukraine',
    center: [33.8, 44.9],
    intensity: 'critical',
    attenuationPercent: 96,
    frequencies: ['GPS L1/L2/L5', 'BeiDou B1', 'GLONASS (selective)'],
    systemsDetected: ['R-330Zh Zhitel', 'Borisoglebsk-2', 'Krasukha-2O', 'Tirada-2S Satellite Jammer'],
    advisory: 'Severe GNSS spoofing with maritime vessels appearing inland near Sevastopol and Novorossiysk. High-threat drone jamming prevents commercial SAR and satellite comms.',
    description: 'Severe GNSS spoofing with maritime vessels appearing inland near Sevastopol and Novorossiysk. High-threat drone jamming prevents commercial SAR and satellite comms.',
    updatedAt: 'Active Naval & Aerial Jamming',
    coords: [
      [31.2, 45.8],
      [34.5, 46.2],
      [37.2, 45.4],
      [38.5, 44.5],
      [36.8, 43.6],
      [33.0, 43.8],
      [31.0, 44.5],
      [31.2, 45.8]
    ]
  },
  {
    id: 'ew_levant_mediterranean',
    name: 'Eastern Mediterranean & Levant Jamming Umbrella',
    region: 'Middle East',
    center: [35.2, 33.2],
    intensity: 'critical',
    attenuationPercent: 94,
    frequencies: ['GPS L1', 'GPS L2', 'Galileo E1/E5a'],
    systemsDetected: ['Scorpius-G Active Array', 'DroneGuard Jamming System', 'C-UAS Directional Emitters'],
    advisory: 'Extensive GNSS spoofing originating in northern Israel and south Lebanon, causing false position fixes across Beirut, Tel Aviv, and Cyprus civil airspace (Flightradar aircraft reporting false Cairo/Beirut locations).',
    description: 'Extensive GNSS spoofing originating in northern Israel and south Lebanon, causing false position fixes across Beirut, Tel Aviv, and Cyprus civil airspace (Flightradar aircraft reporting false Cairo/Beirut locations).',
    updatedAt: '24/7 Air Defense Electronic Shield',
    coords: [
      [33.8, 31.8],
      [35.8, 31.8],
      [36.5, 33.6],
      [36.2, 34.8],
      [34.6, 34.8],
      [33.5, 33.5],
      [33.8, 31.8]
    ]
  },
  {
    id: 'ew_red_sea_yemen',
    name: 'Southern Red Sea & Bab el-Mandeb Spoofing Sector',
    region: 'Red Sea',
    center: [42.8, 13.5],
    intensity: 'high',
    attenuationPercent: 84,
    frequencies: ['GPS L1', 'AIS VHF Marine Tracking'],
    systemsDetected: ['Iranian-supplied EW Jamming Suites', 'Coastal Radar Decoys', 'Man-portable GPS Spoofers'],
    advisory: 'Merchant shipping experiencing GPS dropouts and simulated AIS ghost ship tracks intended to steer commercial tankers into Houthi drone and missile strike arcs.',
    description: 'Merchant shipping experiencing GPS dropouts and simulated AIS ghost ship tracks intended to steer commercial tankers into Houthi drone and missile strike arcs.',
    updatedAt: 'Maritime Defense Alert',
    coords: [
      [41.5, 12.2],
      [43.8, 12.0],
      [44.5, 13.5],
      [43.8, 15.2],
      [42.0, 15.0],
      [41.2, 13.8],
      [41.5, 12.2]
    ]
  },
  {
    id: 'ew_persian_gulf',
    name: 'Strait of Hormuz GPS Jamming & Spoofing Arc',
    region: 'Persian Gulf',
    center: [55.8, 26.2],
    intensity: 'high',
    attenuationPercent: 88,
    frequencies: ['GPS L1', 'Marine Radar Band X/S', 'AIS Transponders'],
    systemsDetected: ['IRGC Electronic Warfare Regiments', 'Avtobaza-M ELINT System'],
    advisory: 'Vessels navigating near Abu Musa and the Tunb Islands report GPS deviation alerts of up to 4 nautical miles, with vessels falsely indicated inside Iranian territorial waters.',
    description: 'Vessels navigating near Abu Musa and the Tunb Islands report GPS deviation alerts of up to 4 nautical miles, with vessels falsely indicated inside Iranian territorial waters.',
    updatedAt: 'Ongoing Maritime Advisory',
    coords: [
      [54.2, 25.5],
      [56.8, 25.3],
      [57.4, 26.5],
      [56.8, 27.4],
      [55.2, 27.2],
      [54.0, 26.4],
      [54.2, 25.5]
    ]
  },
  {
    id: 'ew_korean_dmz',
    name: 'Korean DMZ & Incheon Approach GNSS Interdiction',
    region: 'East Asia',
    center: [126.6, 37.8],
    intensity: 'high',
    attenuationPercent: 86,
    frequencies: ['GPS L1', 'GLONASS L1', 'Civil Aviation Nav'],
    systemsDetected: ['KPA Truck-mounted Vehicle EW Transmitters', 'Directional Cavity Jammers'],
    advisory: 'Periodic electronic warfare pulses broadcast from Kaesong and Haeju toward Incheon International Airport and the Yellow Sea Northern Limit Line (NLL), disrupting civil airliners and fishing flotillas.',
    description: 'Periodic electronic warfare pulses broadcast from Kaesong and Haeju toward Incheon International Airport and the Yellow Sea Northern Limit Line (NLL), disrupting civil airliners and fishing flotillas.',
    updatedAt: 'Intermittent High-Power Pulses',
    coords: [
      [125.4, 37.2],
      [127.4, 37.4],
      [127.8, 38.3],
      [126.5, 38.4],
      [125.2, 38.0],
      [125.4, 37.2]
    ]
  },
  {
    id: 'ew_taiwan_strait',
    name: 'Taiwan Strait & Bashi Channel Electronic Recon Grid',
    region: 'Indo-Pacific',
    center: [119.8, 24.0],
    intensity: 'medium',
    attenuationPercent: 78,
    frequencies: ['Military Radar (X/Ku-band)', 'UAV C2 Datallinks', 'GPS L1/L2'],
    systemsDetected: ['PLA Navy Type 055 Electronic Warfare Arrays', 'Shaanxi Y-9DZ EW Aircraft', 'Land-based Coastal OTH-B Radars'],
    advisory: 'Continuous radar frequency agility testing, ESM interception, and localized UAV datalink disruption across the median line and southwest ADIZ air corridors.',
    description: 'Continuous radar frequency agility testing, ESM interception, and localized UAV datalink disruption across the median line and southwest ADIZ air corridors.',
    updatedAt: 'Active Electronic Reconnaissance',
    coords: [
      [118.2, 22.8],
      [120.8, 22.5],
      [121.5, 24.8],
      [120.2, 25.6],
      [118.5, 24.5],
      [118.2, 22.8]
    ]
  },
  {
    id: 'ew_myanmar_border',
    name: 'Myanmar Border Transnational Communications Jamming',
    region: 'Southeast Asia',
    center: [98.5, 22.5],
    intensity: 'medium',
    attenuationPercent: 72,
    frequencies: ['Cellular GSM/LTE Bands', 'VHF/UHF Tactical Comms', 'Commercial Satellite Comms'],
    systemsDetected: ['State Administration Council Directional Jamming Vans', 'Tactical Radio Denial Arrays'],
    advisory: 'Cross-border communication blackouts and civilian satellite internet degradation in Shan State and Kokang border zones.',
    description: 'Cross-border communication blackouts and civilian satellite internet degradation in Shan State and Kokang border zones.',
    updatedAt: 'Counter-Insurgency EW',
    coords: [
      [97.0, 21.0],
      [99.8, 21.2],
      [100.2, 23.6],
      [98.4, 23.8],
      [96.8, 22.4],
      [97.0, 21.0]
    ]
  }
];

// Point features for electronic warfare emitter complexes
export const GPS_JAMMING_POINTS: MapFeatureItem[] = [
  {
    id: 'ew_emitter_kaliningrad',
    layer: 'gpsJamming',
    name: 'Kaliningrad Strategic EW Regimental Array',
    coordinates: [20.45, 54.71],
    category: 'Strategic Electronic Warfare Base',
    status: 'Active Transmission',
    severity: 'critical',
    description: 'Home of the 841st Separate Electronic Warfare Center equipped with Krasukha-4 and Murmansk-BN long-range HF jamming systems capable of covering the Baltic sea.',
    details: {
      unit: 'Baltic Fleet 841st EW Center',
      systems: 'Krasukha-4, Murmansk-BN, Leer-3',
      range: 'Over 500 km',
      effect: 'Civil aviation & NATO exercise GPS denial'
    }
  },
  {
    id: 'ew_emitter_sevastopol',
    layer: 'gpsJamming',
    name: 'Crimea Cape Fiolent Electronic Warfare Hub',
    coordinates: [33.48, 44.52],
    category: 'Maritime & Air Jamming Complex',
    status: 'Active Transmission',
    severity: 'critical',
    description: 'Black Sea Fleet 475th Electronic Warfare Center conducting continuous denial of GPS guidance for Storm Shadow and ATACMS missiles and maritime drones.',
    details: {
      unit: '475th Separate EW Center',
      systems: 'Borisoglebsk-2, Pole-21E, Zhitel',
      targetFrequencies: '1.2 - 1.6 GHz GNSS bands'
    }
  },
  {
    id: 'ew_emitter_meron',
    layer: 'gpsJamming',
    name: 'Mount Meron Air Surveillance & EW Station',
    coordinates: [35.41, 32.99],
    category: 'Air Control & EW Installation',
    status: 'High Alert',
    severity: 'critical',
    description: 'Northern Air Control Center commanding widespread GPS defensive spoofing over Upper Galilee to defeat GPS-guided precision drones and munitions.',
    details: {
      affiliation: 'Israeli Air Force 506th Tactical Air Control Squadron',
      system: 'Electronic Warfare & Radar Direction Center',
      impact: 'Regional civil GPS spoofing'
    }
  },
  {
    id: 'ew_emitter_kaesong',
    layer: 'gpsJamming',
    name: 'Kaesong Peak GPS Jamming Facility',
    coordinates: [126.55, 37.97],
    category: 'High-Power Ground Transmitter',
    status: 'Periodic Pulsing',
    severity: 'high',
    description: 'Korean People’s Army Electronic Warfare Regiment operating multi-frequency noise transmitters oriented south toward Seoul metropolitan airspace.',
    details: {
      affiliation: 'KPA Reconnaissance General Bureau',
      frequencyCoverage: 'L1 1575.42 MHz',
      radius: 'Up to 100 km line-of-sight'
    }
  },
  {
    id: 'ew_emitter_hodeidah',
    layer: 'gpsJamming',
    name: 'Ras Isa Coastal EW & Radar Decoy Site',
    coordinates: [42.75, 15.18],
    category: 'Coastal Anti-Ship EW Site',
    status: 'Operational',
    severity: 'high',
    description: 'Coastal electronic warfare node executing radar frequency sweeping and false-target AIS broadcast into southern Red Sea traffic lanes.',
    details: {
      affiliation: 'Ansar Allah (Houthi) Coastal Defense Forces',
      role: 'Maritime navigation spoofing'
    }
  }
];
