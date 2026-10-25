import { MapFeatureItem } from '../types';

export const IRAN_ATTACKS: MapFeatureItem[] = [
  {
    id: 'strike_nevatim_airbase',
    layer: 'iranAttacks',
    name: 'Nevatim Airbase (F-35I Squadron)',
    coordinates: [35.01, 31.21],
    category: 'Ballistic Missile Impact Zone',
    status: 'Intercepts & Multiple Impacts Recorded',
    severity: 'critical',
    description: 'Targeted in Operation True Promise II by ~30 Fattah and Emad ballistic missiles. Damage recorded to taxiways, aircraft shelters, and assembly hangars.',
    details: { attacker: 'IRGC Aerospace Force', defender: 'Arrow 3 / Arrow 2 / David\'s Sling', date: 'October 1, 2024' }
  },
  {
    id: 'strike_tel_nof',
    layer: 'iranAttacks',
    name: 'Tel Nof Air Base',
    coordinates: [34.82, 31.84],
    category: 'Fighter & Drone Base Target',
    status: 'Interception Clustered',
    severity: 'critical',
    description: 'Primary air superiority base hosting F-15 Eagle squadrons and UAV reconnaissance wings targeted during multi-wave saturation salvos.',
    details: { attacker: 'Iran / IRGC', weaponsUsed: 'Ghadr-110 & Kheibar Shekan MRBMs' }
  },
  {
    id: 'strike_parchin_complex',
    layer: 'iranAttacks',
    name: 'Parchin Military Research Complex (Iran)',
    coordinates: [51.78, 35.52],
    category: 'Precision Counter-Strike Target',
    status: 'Solid-Fuel Mixers & Test Chambers Destroyed',
    severity: 'critical',
    description: 'Taleghan 2 facility struck by IAF standoff missiles during Operation Days of Repentance; destroyed critical planetary mixers used for ballistic solid rocket propellant.',
    details: { attacker: 'Israeli Air Force (IAF)', date: 'October 26, 2024', weapon: 'Air-launched ballistic missiles (ALBMs)' }
  },
  {
    id: 'strike_khojir_missile_base',
    layer: 'iranAttacks',
    name: 'Khojir Missile Production Facility',
    coordinates: [51.68, 35.61],
    category: 'Ballistic Industrial Site',
    status: 'Industrial Structures Severely Damaged',
    severity: 'critical',
    description: 'Underground tunnel network and missile assembly buildings struck during counter-strikes, setting back Iranian domestic ballistic production.',
    details: { attacker: 'IAF Long-Range Strike Packages' }
  },
  {
    id: 'strike_shahrud_space_center',
    layer: 'iranAttacks',
    name: 'Shahrud Missile & Space Testing Facility',
    coordinates: [55.33, 36.42],
    category: 'IRGC Solid-Fuel Rocket Hub',
    status: 'Main Fabrication Building Levelled',
    severity: 'critical',
    description: 'Central building used for casting solid rocket motors for intermediate-range ballistic missiles destroyed by precision munition.',
    details: { province: 'Semnan Province, Iran', damageAssessment: 'High-resolution satellite confirmation' }
  },
  {
    id: 'strike_isfahan_radar',
    layer: 'iranAttacks',
    name: 'Isfahan 8th Shekari Airbase S-300 Radar',
    coordinates: [51.86, 32.75],
    category: 'Air Defense Radar Neutralization',
    status: 'Radar Flap Lid Struck',
    severity: 'high',
    description: 'Precision engagement of 30N6E "Flap Lid" radar protecting Natanz and adjacent nuclear infrastructure.',
    details: { target: 'S-300PMU2 strategic SAM site', impact: 'Degraded early warning coverage' }
  },
  {
    id: 'strike_glilot_mossad_8200',
    layer: 'iranAttacks',
    name: 'Glilot Base (Unit 8200 & Mossad HQ area)',
    coordinates: [34.82, 32.14],
    category: 'Signals Intelligence & Cyber Center',
    status: 'Air Defense Interceptions in Vicinity',
    severity: 'critical',
    description: 'Targeted in Iranian missile launches; intercepted by multi-tier Arrow 3 and US Navy Aegis destroyers stationed in the eastern Mediterranean.',
    details: { casualtiesReported: 'Minimal due to bunker shelters and layered interceptors' }
  },
  {
    id: 'strike_hodeidah_port',
    layer: 'iranAttacks',
    name: 'Hodeidah Port & Fuel Terminals (Yemen)',
    coordinates: [42.94, 14.83],
    category: 'Houthi Supply & Power Infrastructure',
    status: 'Oil Storage Tanks Ignited',
    severity: 'high',
    description: 'Struck by long-range Israeli F-15/F-35 strike packages following Houthi UAV and missile launches on Tel Aviv.',
    details: { distance: '1,800km non-stop flight with mid-air refueling' }
  }
];
