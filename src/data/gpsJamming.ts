import { MapFeatureItem, GpsJammingZone } from '../types';

/**
 * Calculates a smooth, mathematically precise geodesic ellipse representing
 * physical radio-frequency (RF) signal propagation and electronic warfare envelopes.
 */
function createGeodesicEllipse(
  centerLon: number,
  centerLat: number,
  semiMajorKm: number,
  semiMinorKm: number,
  angleDeg: number,
  numPoints: number = 48
): [number, number][] {
  const R = 6371; // Earth radius in km
  const latRad = (centerLat * Math.PI) / 180;
  const lonRad = (centerLon * Math.PI) / 180;
  const angleRad = (angleDeg * Math.PI) / 180;
  const coords: [number, number][] = [];

  for (let i = 0; i <= numPoints; i++) {
    const theta = (i * 2 * Math.PI) / numPoints;
    const a = semiMajorKm;
    const b = semiMinorKm;
    const rKm = (a * b) / Math.sqrt((b * Math.cos(theta)) ** 2 + (a * Math.sin(theta)) ** 2);
    const dByR = rKm / R;
    const bearing = theta + angleRad;

    const sinLat = Math.sin(latRad) * Math.cos(dByR) + Math.cos(latRad) * Math.sin(dByR) * Math.cos(bearing);
    const ptLatRad = Math.asin(sinLat);
    const y = Math.sin(bearing) * Math.sin(dByR) * Math.cos(latRad);
    const x = Math.cos(dByR) - Math.sin(latRad) * sinLat;
    const ptLonRad = lonRad + Math.atan2(y, x);

    const ptLon = (ptLonRad * 180) / Math.PI;
    const ptLat = (ptLatRad * 180) / Math.PI;
    coords.push([Number(ptLon.toFixed(4)), Number(ptLat.toFixed(4))]);
  }
  return coords;
}

export const GPS_JAMMING_ZONES: GpsJammingZone[] = [
  {
    id: 'ew_baltic_kaliningrad',
    name: 'Baltic Sea & Kaliningrad EW Corridor',
    region: 'Baltic / Eastern Europe',
    center: [20.45, 54.71],
    intensity: 'critical',
    attenuationPercent: 92,
    frequencies: ['GPS L1 (1575.42 MHz)', 'GPS L2 (1227.60 MHz)', 'Galileo E1', 'GLONASS L1'],
    systemsDetected: ['1RL257 Krasukha-4', 'RB-341V Leer-3', 'Murmansk-BN Strategic EW', 'Tobol Electronic Shield'],
    advisory: 'Commercial aviation reports widespread loss of primary GNSS navigation across Poland, Baltic states, and southern Sweden. Aircraft reverting to VOR/DME terrestrial beacons and inertial navigation.',
    description: 'Commercial aviation reports widespread loss of primary GNSS navigation across Poland, Baltic states, and southern Sweden. Aircraft reverting to VOR/DME terrestrial beacons and inertial navigation.',
    updatedAt: 'Continuous Electronic Attack',
    coords: createGeodesicEllipse(20.45, 54.71, 380, 260, 25, 48)
  },
  {
    id: 'ew_black_sea_crimea',
    name: 'Black Sea & Crimean Electronic Warfare Bastion',
    region: 'Black Sea / Southern Ukraine',
    center: [33.5, 44.8],
    intensity: 'critical',
    attenuationPercent: 96,
    frequencies: ['GPS L1/L2/L5', 'BeiDou B1', 'GLONASS (selective)'],
    systemsDetected: ['R-330Zh Zhitel', 'Borisoglebsk-2', 'Krasukha-2O', 'Tirada-2S Satellite Jammer'],
    advisory: 'Severe GNSS spoofing with maritime vessels appearing inland near Sevastopol and Novorossiysk. High-threat drone jamming prevents commercial SAR and satellite comms.',
    description: 'Severe GNSS spoofing with maritime vessels appearing inland near Sevastopol and Novorossiysk. High-threat drone jamming prevents commercial SAR and satellite comms.',
    updatedAt: 'Active Naval & Aerial Jamming',
    coords: createGeodesicEllipse(33.5, 44.8, 320, 210, 80, 48)
  },
  {
    id: 'ew_levant_mediterranean',
    name: 'Eastern Mediterranean & Levant Jamming Umbrella',
    region: 'Middle East',
    center: [35.3, 33.2],
    intensity: 'critical',
    attenuationPercent: 94,
    frequencies: ['GPS L1', 'GPS L2', 'Galileo E1/E5a'],
    systemsDetected: ['Scorpius-G Active Array', 'DroneGuard Jamming System', 'C-UAS Directional Emitters'],
    advisory: 'Extensive GNSS spoofing originating in northern Israel and south Lebanon, causing false position fixes across Beirut, Tel Aviv, and Cyprus civil airspace (Flightradar aircraft reporting false Cairo/Beirut locations).',
    description: 'Extensive GNSS spoofing originating in northern Israel and south Lebanon, causing false position fixes across Beirut, Tel Aviv, and Cyprus civil airspace (Flightradar aircraft reporting false Cairo/Beirut locations).',
    updatedAt: '24/7 Air Defense Electronic Shield',
    coords: createGeodesicEllipse(35.3, 33.2, 220, 160, 15, 48)
  },
  {
    id: 'ew_red_sea_yemen',
    name: 'Southern Red Sea & Bab el-Mandeb Spoofing Sector',
    region: 'Red Sea',
    center: [42.5, 14.2],
    intensity: 'high',
    attenuationPercent: 84,
    frequencies: ['GPS L1', 'AIS VHF Marine Tracking'],
    systemsDetected: ['Iranian-supplied EW Jamming Suites', 'Coastal Radar Decoys', 'Man-portable GPS Spoofers'],
    advisory: 'Merchant shipping experiencing GPS dropouts and simulated AIS ghost ship tracks intended to steer commercial tankers into Houthi drone and missile strike arcs.',
    description: 'Merchant shipping experiencing GPS dropouts and simulated AIS ghost ship tracks intended to steer commercial tankers into Houthi drone and missile strike arcs.',
    updatedAt: 'Maritime Defense Alert',
    coords: createGeodesicEllipse(42.5, 14.2, 340, 130, 145, 48)
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
    coords: createGeodesicEllipse(55.8, 26.2, 250, 140, 70, 48)
  },
  {
    id: 'ew_korean_dmz',
    name: 'Korean DMZ & Incheon Approach GNSS Interdiction',
    region: 'East Asia',
    center: [126.8, 37.8],
    intensity: 'high',
    attenuationPercent: 86,
    frequencies: ['GPS L1', 'GLONASS L1', 'Civil Aviation Nav'],
    systemsDetected: ['KPA Truck-mounted Vehicle EW Transmitters', 'Directional Cavity Jammers'],
    advisory: 'Periodic electronic warfare pulses broadcast from Kaesong and Haeju toward Incheon International Airport and the Yellow Sea Northern Limit Line (NLL), disrupting civil airliners and fishing flotillas.',
    description: 'Periodic electronic warfare pulses broadcast from Kaesong and Haeju toward Incheon International Airport and the Yellow Sea Northern Limit Line (NLL), disrupting civil airliners and fishing flotillas.',
    updatedAt: 'Intermittent High-Power Pulses',
    coords: createGeodesicEllipse(126.8, 37.8, 170, 100, 75, 48)
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
    coords: createGeodesicEllipse(119.8, 24.0, 320, 110, 45, 48)
  },
  {
    id: 'ew_myanmar_border',
    name: 'Myanmar Border Transnational Communications Jamming',
    region: 'Southeast Asia',
    center: [98.8, 22.8],
    intensity: 'medium',
    attenuationPercent: 72,
    frequencies: ['Cellular GSM/LTE Bands', 'VHF/UHF Tactical Comms', 'Commercial Satellite Comms'],
    systemsDetected: ['State Administration Council Directional Jamming Vans', 'Tactical Radio Denial Arrays'],
    advisory: 'Cross-border communication blackouts and civilian satellite internet degradation in Shan State and Kokang border zones.',
    description: 'Cross-border communication blackouts and civilian satellite internet degradation in Shan State and Kokang border zones.',
    updatedAt: 'Counter-Insurgency EW',
    coords: createGeodesicEllipse(98.8, 22.8, 160, 110, 30, 48)
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
