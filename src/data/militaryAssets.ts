import { MapFeatureItem } from '../types';

export const MILITARY_ASSETS: MapFeatureItem[] = [
  {
    id: 'asset_truman_csg',
    layer: 'military',
    name: 'USS Harry S. Truman Carrier Strike Group (CSG-8)',
    coordinates: [33.5, 34.2],
    category: 'Nimitz-Class Nuclear Aircraft Carrier',
    status: 'Combat Ready / Deterrence Patrol',
    severity: 'critical',
    description: 'Operating in the Eastern Mediterranean with Carrier Air Wing 1, Ticonderoga-class cruiser USS Gettysburg, and Arleigh Burke destroyers providing air defense and regional deterrence.',
    details: { flagship: 'USS Harry S. Truman (CVN 75)', embarkedAirWing: 'F/A-18E/F Super Hornets, EA-18G Growlers, E-2D Hawkeyes' }
  },
  {
    id: 'asset_lincoln_csg',
    layer: 'military',
    name: 'USS Abraham Lincoln Carrier Strike Group (CSG-3)',
    coordinates: [60.5, 20.2],
    category: 'Arabian Sea Maritime Strike Force',
    status: 'Combat Air Patrols Active',
    severity: 'critical',
    description: 'Stationed in the Northern Arabian Sea under US Central Command (CENTCOM), equipped with stealth F-35C Lightning II fighters and destroyers.',
    details: { flagship: 'USS Abraham Lincoln (CVN 72)', stealthSquadron: 'VMFA-314 "Black Knights" (F-35C)' }
  },
  {
    id: 'asset_plan_shandong',
    layer: 'military',
    name: 'PLAN Shandong Carrier Strike Group (CV-17)',
    coordinates: [126.5, 21.0],
    category: 'Chinese Aircraft Carrier Task Force',
    status: 'Philippine Sea Sorties Recorded',
    severity: 'high',
    description: 'Second aircraft carrier of the People\'s Liberation Army Navy conducting intensive J-15 fighter catapult-free ski-jump launches east of the Bashi Channel.',
    details: { escortWarships: 'Type 055 Guided Missile Destroyer (112-cell VLS), Type 052D Destroyers' }
  },
  {
    id: 'asset_p8_patrol_taiwan',
    layer: 'military',
    name: 'US Navy P-8A Poseidon Maritime Surveillance Flight',
    coordinates: [119.8, 23.5],
    category: 'Anti-Submarine Warfare (ASW) Transit',
    status: 'International Airspace Transit',
    severity: 'high',
    description: 'Routine freedom-of-navigation surveillance transit through the Taiwan Strait tracking PLAN submarine acoustic signatures and surface combatants.',
    details: { aircraft: 'Boeing P-8A Poseidon', equipment: 'AN/APY-10 Multi-mission Surface Search Radar, Sonobuoys' }
  },
  {
    id: 'asset_rivet_joint_baltic',
    layer: 'military',
    name: 'USAF RC-135W Rivet Joint (Signals Intel)',
    coordinates: [21.5, 56.8],
    category: 'Electronic Reconnaissance Aircraft',
    status: 'Orbiting Baltic Perimeter',
    severity: 'medium',
    description: 'Electronic eavesdropping and communications reconnaissance flight monitoring radar emissions and radio chatter from Kaliningrad and western Russia.',
    details: { callsign: 'JAKE / HOMER', homeBase: 'RAF Mildenhall (UK)' }
  },
  {
    id: 'asset_b52_centcom',
    layer: 'military',
    name: 'USAF B-52H Stratofortress Deterrence Sortie',
    coordinates: [52.0, 27.5],
    category: 'Strategic Heavy Bomber Task Force',
    status: 'Mission Complete / Rotational Deployment',
    severity: 'high',
    description: 'Long-range non-stop deterrence patrol from Minot AFB through the Persian Gulf accompanied by regional allied fighter escorts.',
    details: { weaponsCapacity: '70,000 lbs munitions including JASSM-ER stealth cruise missiles' }
  },
  {
    id: 'asset_cdg_france',
    layer: 'military',
    name: 'French Carrier Strike Group (Charles de Gaulle R91)',
    coordinates: [15.2, 38.0],
    category: 'Nuclear-Powered Catapult Aircraft Carrier',
    status: 'NATO Mission Antares',
    severity: 'medium',
    description: 'French Navy flagship operating with Rafale Marine F4 fighters in integrated Mediterranean NATO interoperability maneuvers.',
    details: { catapults: 'C-13-3 steam catapults', complement: 'Rafale M, E-2C Hawkeye, Caïman Marine helicopters' }
  }
];
