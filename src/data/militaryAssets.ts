import { MapFeatureItem } from '../types';

export const MILITARY_ASSETS: MapFeatureItem[] = [
  // =========================================================================
  // 1. NAVAL CSGs (Carrier Strike Groups & Surface Action Groups)
  // =========================================================================
  {
    id: 'asset_vikrant_r11',
    layer: 'military',
    name: 'INS Vikrant Carrier Battle Group (R11)',
    coordinates: [72.8, 18.2],
    category: 'Indigenous Aircraft Carrier (IAC-1)',
    status: 'DEPLOYED / COMBAT READY',
    severity: 'critical',
    operatorCode: 'IN',
    assetCategory: 'NAVAL CSGs',
    description: 'Flagship of the Indian Navy Western Fleet conducting blue-water strike operations in the Arabian Sea with MiG-29K strike fighters, Kamov Ka-31 AEW, and MH-60R Romeo ASW helicopters.',
    details: {
      displacement: '45,000 tonnes',
      flagship: 'INS Vikrant (R11)',
      escortScreen: 'INS Kolkata (D63) Destroyer, INS Teg (F45) Stealth Frigate',
      airWing: 'MiG-29K Fulcrum-D, MH-60R Seahawk, ALH Dhruv Mk-III'
    }
  },
  {
    id: 'asset_vikramaditya_r33',
    layer: 'military',
    name: 'INS Vikramaditya Carrier Battle Group (R33)',
    coordinates: [74.1, 14.8],
    category: 'Modified Kiev-Class STOBAR Carrier',
    status: 'HIGH READINESS / PATROL',
    severity: 'high',
    operatorCode: 'IN',
    assetCategory: 'NAVAL CSGs',
    description: 'Stationed at INS Kadamba (Karwar Naval Base), maintaining rapid-deployment deterrence over the Central Indian Ocean and maritime approaches to the Persian Gulf.',
    details: {
      displacement: '45,400 tonnes',
      flagship: 'INS Vikramaditya (R33)',
      escortScreen: 'INS Visakhapatnam (D66) P15B Guided Missile Destroyer, INS Tarkash (F50)',
      defenseSystem: 'Barak-8 LR-SAM 32-cell VLS'
    }
  },
  {
    id: 'asset_lincoln_cvn72',
    layer: 'military',
    name: 'USS Abraham Lincoln CSG (CSG-3 / CVN-72)',
    coordinates: [61.2, 21.0],
    category: 'Nimitz-Class Nuclear Supercarrier',
    status: 'COMBAT ACTIVE / CENTCOM',
    severity: 'critical',
    operatorCode: 'US',
    assetCategory: 'NAVAL CSGs',
    description: 'Operating in the Northern Arabian Sea under US Central Command (CENTCOM), equipped with F-35C Lightning II stealth strike squadrons and Aegis guided missile destroyers.',
    details: {
      flagship: 'USS Abraham Lincoln (CVN-72)',
      stealthSquadron: 'VMFA-314 "Black Knights" (F-35C Lightning II)',
      airWing: 'Carrier Air Wing 9 (CVW-9)',
      escortDestroyers: 'USS O\'Kane (DDG-77), USS Spruance (DDG-111)'
    }
  },
  {
    id: 'asset_truman_cvn75',
    layer: 'military',
    name: 'USS Harry S. Truman CSG (CSG-8 / CVN-75)',
    coordinates: [33.5, 34.2],
    category: 'Nimitz-Class Nuclear Supercarrier',
    status: 'DEPLOYED / 6TH FLEET',
    severity: 'critical',
    operatorCode: 'US',
    assetCategory: 'NAVAL CSGs',
    description: 'Deployed in the Eastern Mediterranean providing theater integrated air & missile defense, deterrence patrols against regional escalations, and NATO southern flank interoperability.',
    details: {
      flagship: 'USS Harry S. Truman (CVN-75)',
      airWing: 'Carrier Air Wing 1 (CVW-1)',
      escorts: 'USS Gettysburg (CG-64), USS Stout (DDG-55), USS Jason Dunham (DDG-109)'
    }
  },
  {
    id: 'asset_fujian_cv18',
    layer: 'military',
    name: 'CNS Fujian Aircraft Carrier (CV-18)',
    coordinates: [122.5, 31.4],
    category: 'Type 003 CATOBAR Supercarrier',
    status: 'HIGH READINESS / SEA TRIALS',
    severity: 'critical',
    operatorCode: 'CN',
    assetCategory: 'NAVAL CSGs',
    description: 'China\'s first electromagnetic catapult (EMALS) supercarrier undergoing advanced high-sea catapult launch and recovery trials in the East China Sea with J-35 stealth fighters and KJ-600 AEW&C.',
    details: {
      displacement: '80,000+ tonnes',
      launchSystem: '3 EMALS electromagnetic catapult tracks',
      projectedAirWing: 'Shenyang J-35 Stealth, J-15B Flying Shark, KJ-600 Airborne Early Warning'
    }
  },
  {
    id: 'asset_shandong_cv17',
    layer: 'military',
    name: 'CNS Shandong Carrier Task Force (CV-17)',
    coordinates: [110.5, 17.5],
    category: 'Type 002 STOBAR Aircraft Carrier',
    status: 'DEPLOYED / SOUTH CHINA SEA',
    severity: 'high',
    operatorCode: 'CN',
    assetCategory: 'NAVAL CSGs',
    description: 'Homeported at Sanya Naval Base (Hainan), projecting PLAN naval air dominance across the South China Sea and simulating multi-carrier interdictions east of Taiwan.',
    details: {
      flagship: 'CNS Shandong (CV-17)',
      escortScreen: 'Type 055 Large Destroyer (112-cell VLS), Type 052D Guided Missile Destroyer',
      airComplement: 'J-15 Heavy Multirole Fighters, Z-18F ASW Helicopters'
    }
  },
  {
    id: 'asset_cdg_r91',
    layer: 'military',
    name: 'FS Charles de Gaulle CSG (R91)',
    coordinates: [16.5, 37.8],
    category: 'Nuclear Catapult Aircraft Carrier',
    status: 'DEPLOYED / NATO MISSION ANTARES',
    severity: 'medium',
    operatorCode: 'FR',
    assetCategory: 'NAVAL CSGs',
    description: 'French Marine Nationale flagship operating Rafale Marine F4 fighters in coordinated Mediterranean interoperability missions with allied European naval forces.',
    details: {
      flagship: 'Charles de Gaulle (R91)',
      catapults: '2 C-13-3 75-meter steam catapults',
      airWing: 'Rafale M Standard 4, E-2C Hawkeye, Caïman Marine (NH90)'
    }
  },
  {
    id: 'asset_qnlz_r08',
    layer: 'military',
    name: 'HMS Queen Elizabeth (R08)',
    coordinates: [-4.2, 50.3],
    category: 'Queen Elizabeth-Class STOVL Carrier',
    status: 'HIGH READINESS / NORTH ATLANTIC',
    severity: 'medium',
    operatorCode: 'UK',
    assetCategory: 'NAVAL CSGs',
    description: 'Royal Navy fleet flagship operating F-35B Lightning II STOVL stealth aircraft for Joint Expeditionary Force (JEF) high-readiness deterrence in northern waters.',
    details: {
      flagship: 'HMS Queen Elizabeth (R08)',
      airWing: 'No. 617 Squadron RAF (F-35B), Merlin Mk2 ASW / Crowsnest AEW',
      displacement: '65,000 tonnes'
    }
  },

  // =========================================================================
  // 2. AIRBASES & BOMBER WINGS
  // =========================================================================
  {
    id: 'asset_afs_ambala',
    layer: 'military',
    name: 'Air Force Station Ambala (No. 17 Golden Arrows)',
    coordinates: [76.82, 30.37],
    category: 'IAF Frontline Rafale Strike Wing',
    status: 'COMBAT ACTIVE / NORTHERN SECTOR',
    severity: 'critical',
    operatorCode: 'IN',
    assetCategory: 'AIRBASES & BOMBER WINGS',
    description: 'Primary Northern Air Command operating base for Dassault Rafale DH/EH fighters armed with SCALP standoff cruise missiles and Meteor BVR air-to-air missiles covering Punjab and Ladakh.',
    details: {
      wing: 'No. 17 Squadron "Golden Arrows"',
      weaponry: 'SCALP-EG (500km standoff), Meteor BVRAAM (200km range), Hammer precision bombs',
      defenses: 'S-400 Triumf Sudarshan Air Defense Regiment Battery 1'
    }
  },
  {
    id: 'asset_afs_hasimara',
    layer: 'military',
    name: 'Air Force Station Hasimara (No. 101 Falcons)',
    coordinates: [89.37, 26.71],
    category: 'IAF Eastern Command Rafale Base',
    status: 'HIGH READINESS / SILIGURI HUB',
    severity: 'critical',
    operatorCode: 'IN',
    assetCategory: 'AIRBASES & BOMBER WINGS',
    description: 'Eastern frontline strategic bastion guarding the Siliguri Corridor (Chicken\'s Neck) and Sikkim-Bhutan trijunction with second squadron of Rafale omnirole aircraft.',
    details: {
      wing: 'No. 101 Squadron "Falcons"',
      strategicCoverage: 'Chumbi Valley, Doklam, Siliguri Corridor, Arunachal Pradesh',
      reinforcements: 'Su-30MKI forward dispersal at Tezpur and Chabua'
    }
  },
  {
    id: 'asset_andersen_afb',
    layer: 'military',
    name: 'Andersen Air Force Base (Guam)',
    coordinates: [144.92, 13.58],
    category: 'Pacific Air Forces Bomber Task Force Hub',
    status: 'DEPLOYED / PACIFIC DETERRENCE',
    severity: 'high',
    operatorCode: 'US',
    assetCategory: 'AIRBASES & BOMBER WINGS',
    description: 'Primary sovereign US deep-bomber staging bastion in the Second Island Chain hosting continuous rotational B-52H Stratofortress and B-2A Spirit stealth bomber rotations.',
    details: {
      units: '36th Wing (PACAF), Bomber Task Force Rotations',
      defenses: 'THAAD Battery, Patriot PAC-3, Integrated Guam 360-Degree Air Defense Architecture',
      fuelStorage: 'Largest military fuel storage reservoir in DoD (66 million gallons)'
    }
  },
  {
    id: 'asset_diego_garcia',
    layer: 'military',
    name: 'NSF Diego Garcia (BIOT)',
    coordinates: [72.41, -7.31],
    category: 'Joint US-UK Long-Range Bomber & Submarine Bastion',
    status: 'HIGH READINESS / IOR COMMAND',
    severity: 'high',
    operatorCode: 'US',
    assetCategory: 'AIRBASES & BOMBER WINGS',
    description: 'Deep Indian Ocean forward staging base with reinforced shelters for B-2 Spirit stealth bombers and deep-water submarine tender lagoon for SSGN/SSN vessels.',
    details: {
      runway: '12,000 ft hardened runway capable of handling all heavy bombers',
      maritimePrepositioning: 'MPSRON Two (Prepositioned heavy armor and supplies for Marine MEB)',
      spaceSurveillance: 'Ground-based Electro-Optical Deep Space Surveillance (GEODSS) Site'
    }
  },
  {
    id: 'asset_incirlik_ab',
    layer: 'military',
    name: 'Incirlik Air Base (39th Air Base Wing)',
    coordinates: [35.43, 37.0],
    category: 'NATO Southern Flank Tactical Base',
    status: 'OPERATIONAL / B61 CUSTODY',
    severity: 'critical',
    operatorCode: 'US',
    assetCategory: 'AIRBASES & BOMBER WINGS',
    description: 'Strategic NATO hub in southern Turkey hosting US 39th Air Base Wing and subterranean Weapon Storage and Security System (WS3) vaults containing B61 thermonuclear gravity bombs.',
    details: {
      nuclearCustody: 'Estimated ~20 to 50 B61-12 gravity bombs in WS3 vaults',
      units: 'USAF 39th Air Base Wing, Turkish Air Force 10th Tanker Base Command'
    }
  },
  {
    id: 'asset_al_udeid_ab',
    layer: 'military',
    name: 'Al Udeid Air Base (CENTCOM CAOC)',
    coordinates: [51.31, 25.12],
    category: 'CENTCOM Combined Air Operations Center',
    status: 'OPERATIONAL / THEATER HQ',
    severity: 'critical',
    operatorCode: 'US',
    assetCategory: 'AIRBASES & BOMBER WINGS',
    description: 'Largest US military base in the Middle East housing the Combined Air Operations Center (CAOC) coordinating all theater air, drone, and tanker refueling missions.',
    details: {
      units: '379th Air Expeditionary Wing, RAF 83 Expeditionary Air Group',
      aircraft: 'KC-135 Stratotankers, RC-135 Rivet Joint, C-17 Globemaster III'
    }
  },
  {
    id: 'asset_khmeimim_ab',
    layer: 'military',
    name: 'Khmeimim Air Base (Latakia, Syria)',
    coordinates: [35.95, 35.41],
    category: 'Russian Aerospace Forces Expeditionary Base',
    status: 'COMBAT ACTIVE / MEDITERRANEAN HUB',
    severity: 'high',
    operatorCode: 'RU',
    assetCategory: 'AIRBASES & BOMBER WINGS',
    description: 'Main Russian military airbase in the Levant supporting Su-35S air superiority fighters, Su-24M bombers, and S-400 missile systems paired with Tartus naval facility.',
    details: {
      operator: 'Russian Aerospace Forces (VKS)',
      defenses: 'S-400 Triumf, Pantsir-S1 point defense, Krasukha-4 EW systems',
      airAssets: 'Su-35S, Su-34 Fullback, Il-76, Tu-22M3 Backfire (intermittent)'
    }
  },
  {
    id: 'asset_yulin_naval_base',
    layer: 'military',
    name: 'Yulin Submarine & Naval Base (Sanya)',
    coordinates: [109.55, 18.21],
    category: 'PLAN South Sea Fleet SSBN Underground Complex',
    status: 'OPERATIONAL / MONITORED',
    severity: 'critical',
    operatorCode: 'CN',
    assetCategory: 'AIRBASES & BOMBER WINGS',
    description: 'Massive subterranean subterranean submarine base excavated into coastal mountain cliffs housing Type 094 Jin-class ballistic missile submarines (SSBNs) with JL-3 SLBMs.',
    details: {
      facilities: 'Underground submarine pens, nuclear reactor refueling docks, deep drop-off to South China Sea trench',
      submarinesTracked: 'Type 094A Jin SSBNs, Type 093B Shang nuclear attack submarines'
    }
  },

  // =========================================================================
  // 3. NUCLEAR & MISSILE SITES
  // =========================================================================
  {
    id: 'asset_barc_kalpakkam',
    layer: 'military',
    name: 'Kalpakkam Nuclear Complex & PFBR (DAE/BARC)',
    coordinates: [80.17, 12.56],
    category: 'Strategic Breeder & Nuclear Research Center',
    status: 'OPERATIONAL / STRATEGIC ASSET',
    severity: 'high',
    operatorCode: 'IN',
    assetCategory: 'NUCLEAR & MISSILE SITES',
    description: 'Indira Gandhi Centre for Atomic Research (IGCAR) housing India\'s 500 MWe Prototype Fast Breeder Reactor (PFBR), fast reactor fuel reprocessing facility, and naval submarine reactor test beds.',
    details: {
      reactors: 'PFBR (Prototype Fast Breeder Reactor), Madras Atomic Power Station (MAPS)',
      fuelCycle: 'Closed fuel cycle utilizing Thorium-232 and Plutonium-239 breeding',
      security: 'CISF Nuclear Security Command with offshore coastal radar network'
    }
  },
  {
    id: 'asset_natanz_fep',
    layer: 'military',
    name: 'Natanz Fuel Enrichment Plant (FEP & Underground Halls)',
    coordinates: [51.72, 33.72],
    category: 'Uranium Hexafluoride Centrifuge Enrichment Facility',
    status: 'MONITORED / HIGH ESCALATION',
    severity: 'critical',
    operatorCode: 'IR',
    assetCategory: 'NUCLEAR & MISSILE SITES',
    description: 'Main Iranian uranium enrichment complex comprising commercial underground cascade halls and pilot plant operating advanced IR-4, IR-6, and IR-2m centrifuges under IAEA safeguards.',
    details: {
      depth: '~8 meters reinforced subterranean concrete under earth berms',
      centrifugeTypes: 'IR-1, IR-2m, IR-4, IR-6 cascades producing up to 60% U-235',
      airDefenses: 'S-300PMU2, Tor-M1, Bavar-373 indigenous SAM batteries'
    }
  },
  {
    id: 'asset_fordow_ffep',
    layer: 'military',
    name: 'Fordow Fuel Enrichment Plant (FFEP)',
    coordinates: [50.99, 34.88],
    category: 'Deep Mountain Underground Enrichment Bunker',
    status: 'MONITORED / HARDENED SITE',
    severity: 'critical',
    operatorCode: 'IR',
    assetCategory: 'NUCLEAR & MISSILE SITES',
    description: 'Deep mountain bunker complex buried 80–90 meters under solid granite near Qom, built to withstand conventional bunker-buster penetrators (GBU-57 MOP).',
    details: {
      depth: '80–90 meters subterranean solid rock overburden',
      activity: 'Production of 60% enriched UF6 using advanced IR-6 centrifuge cascades',
      defenses: 'Overlapping Pantsir and Sayyad-3 air defense envelopes'
    }
  },
  {
    id: 'asset_zaporizhzhia_npp_site',
    layer: 'military',
    name: 'Zaporizhzhia Nuclear Power Station (ZNPP)',
    coordinates: [35.1, 47.51],
    category: 'VVER-1000 6-Reactor Complex (Europe\'s Largest)',
    status: 'COMBAT ACTIVE / CONTESTED',
    severity: 'critical',
    operatorCode: 'UA',
    assetCategory: 'NUCLEAR & MISSILE SITES',
    description: 'Europe\'s largest 6-gigawatt nuclear complex under Russian military control on the Kakhovka Reservoir shore; all 6 reactors currently maintained in cold shutdown amidst artillery and drone threats.',
    details: {
      reactors: '6 x VVER-1000/320 pressurized water reactors (5,700 MW net total)',
      inspection: 'IAEA Support and Assistance Mission to Zaporizhzhia (ISAMZ) permanently deployed',
      gridThreat: 'Repeated severing of external 750kV Dniprovska and 330kV backup power transmission lines'
    }
  },
  {
    id: 'asset_dimona_negev',
    layer: 'military',
    name: 'Negev Nuclear Research Center (Dimona)',
    coordinates: [35.14, 31.0],
    category: 'Shimon Peres Negev Nuclear Research Center',
    status: 'OPERATIONAL / CLASSIFIED',
    severity: 'critical',
    operatorCode: 'IL',
    assetCategory: 'NUCLEAR & MISSILE SITES',
    description: 'Heavy-water research reactor and underground reprocessing facility producing weapon-grade plutonium and tritium for Israel\'s unacknowledged nuclear deterrent.',
    details: {
      reactorType: 'EL-102 French-supplied heavy water moderated research reactor',
      defenses: 'Dedicated Arrow-3, David\'s Sling, and Patriot PAC-2 interceptor umbrellas',
      airspace: 'Permanent P-9 prohibited no-fly zone'
    }
  },
  {
    id: 'asset_yumen_icbm_silos',
    layer: 'military',
    name: 'Yumen DF-41 ICBM Silo Basin',
    coordinates: [96.8, 40.2],
    category: 'PLARF Solid-Fuel Intercontinental Missile Silo Field',
    status: 'OPERATIONAL / MONITORED',
    severity: 'critical',
    operatorCode: 'CN',
    assetCategory: 'NUCLEAR & MISSILE SITES',
    description: 'Major strategic missile field in Gansu province containing ~120 hardened subterranean ICBM silos constructed for DF-41 solid-fueled multi-warhead (MIRV) intercontinental missiles.',
    details: {
      siloCount: '120 silos arranged in 3km grid spacing across 800 sq km',
      missileSystem: 'DF-41 (12,000–15,000 km range, up to 10 MIRV warheads)',
      operator: 'People\'s Liberation Army Rocket Force (PLARF)'
    }
  },

  // =========================================================================
  // 4. SPACE & RADAR ARRAYS
  // =========================================================================
  {
    id: 'asset_isro_shar',
    layer: 'military',
    name: 'Satish Dhawan Space Centre (SHAR Sriharikota)',
    coordinates: [80.23, 13.72],
    category: 'ISRO Primary Spaceport & Strategic Launch Complex',
    status: 'OPERATIONAL / HIGH ACTIVITY',
    severity: 'high',
    operatorCode: 'IN',
    assetCategory: 'SPACE & RADAR ARRAYS',
    description: 'India\'s premier orbital launch site operating First & Second Launch Pads for LVM3, PSLV, and SSLV missions deploying military reconnaissance, Cartosat, and RISAT imaging satellites.',
    details: {
      launchPads: 'First Launch Pad (FLP), Second Launch Pad (SLP), upcoming SSLV Pad',
      strategicPayloads: 'EMISAT (Electronic Intelligence), RISAT-2BR1 (Radar Imaging), GSAT-7A/7B (Defense Comms)',
      tracking: 'Multi-Object Tracking Radar (MOTR) capable of tracking 10 targets simultaneously'
    }
  },
  {
    id: 'asset_fylingdales_sspar',
    layer: 'military',
    name: 'RAF Fylingdales Solid-State Phased Array (SSPAR)',
    coordinates: [-0.67, 54.36],
    category: 'BMEWS 3-Faced Early Warning Ballistic Radar',
    status: 'OPERATIONAL / 24-7 WATCH',
    severity: 'high',
    operatorCode: 'UK',
    assetCategory: 'SPACE & RADAR ARRAYS',
    description: 'Crucial 3-faced Solid-State Phased Array Radar (SSPAR) pyramid in North Yorkshire providing 360-degree early warning tracking of ICBM launches and deep space tracking for US-UK Space Command.',
    details: {
      coverage: '360° azimuth, tracking ballistic missiles up to 4,800 km',
      system: 'Raytheon SSPAR (AN/FPS-126/132 upgrade equivalent)',
      partners: 'Royal Air Force / US Space Force 10th Space Warning Squadron link'
    }
  },
  {
    id: 'asset_thule_pituffik',
    layer: 'military',
    name: 'Pituffik Space Base (AN/FPS-132 UEWR)',
    coordinates: [-68.7, 76.53],
    category: 'Arctic Upgraded Early Warning Radar (UEWR)',
    status: 'OPERATIONAL / ARCTIC SENTINEL',
    severity: 'high',
    operatorCode: 'US',
    assetCategory: 'SPACE & RADAR ARRAYS',
    description: 'Northernmost US military installation in Greenland operating a 2-faced AN/FPS-132 phased array radar providing early detection of trans-polar ballistic missile attacks against North America.',
    details: {
      radar: 'AN/FPS-132 Upgraded Early Warning Radar (UEWR)',
      operator: 'US Space Force Space Delta 4 (821st Space Base Group)',
      detectionRange: 'Over 5,000 km across the Arctic Circle'
    }
  },
  {
    id: 'asset_pine_gap_sigint',
    layer: 'military',
    name: 'Joint Defence Facility Pine Gap (Alice Springs)',
    coordinates: [133.73, -23.8],
    category: 'Five Eyes Satellite Downlink & SIGINT Complex',
    status: 'OPERATIONAL / TOP SECRET',
    severity: 'critical',
    operatorCode: 'US',
    assetCategory: 'SPACE & RADAR ARRAYS',
    description: 'Premier Five Eyes signals intelligence facility in central Australia operating over 38 radomes controlling geostationary reconnaissance satellites (Orion/Mentor) intercepting global communications and missile telemetry.',
    details: {
      radomes: '38+ white geodetic radomes housing satellite dish antennas',
      missions: 'Ballistic missile launch infrared detection (SBIRS downlinks), radar signature interception, EW emitter location',
      operators: 'CIA, NSA, Australian Signals Directorate (ASD), US Space Force'
    }
  },
  {
    id: 'asset_kwajalein_rts',
    layer: 'military',
    name: 'Ronald Reagan Ballistic Missile Defense Test Site (RTS)',
    coordinates: [167.73, 8.72],
    category: 'Mid-Pacific Ballistic Missile & Space Surveillance Range',
    status: 'OPERATIONAL / ACTIVE TESTING',
    severity: 'high',
    operatorCode: 'US',
    assetCategory: 'SPACE & RADAR ARRAYS',
    description: 'Located on Kwajalein Atoll in the Marshall Islands, hosting high-power metric radar instrumentation (ALCOR, TLDCS, TRADEX, MMW) tracking ICBM reentry vehicles launched from Vandenberg SFB.',
    details: {
      radars: 'Kwajalein Modernization and Remoting (KMAR), ALTAIR, TRADEX, MMW',
      mission: 'Impact target range for Minuteman III test flights and Ground-based Midcourse Defense (GMD) intercept testing'
    }
  }
];
