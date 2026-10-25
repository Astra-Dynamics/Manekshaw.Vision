import { MapFeatureItem } from '../types';

export const CANADA_ALERTS: MapFeatureItem[] = [
  {
    id: 'alert_jasper_wildfire',
    layer: 'canadaAlerts',
    name: 'Jasper Complex Fire & Reconstruction Corridor (AB)',
    coordinates: [-118.08, 52.87],
    category: 'Post-Wildfire Recovery & Travel Watch',
    status: 'Alert in Effect',
    severity: 'high',
    description: 'Parks Canada and Alberta Wildfire monitoring perimeter containment; highway 16 access controls and air quality advisories active across Athabasca Valley.',
    details: { province: 'Alberta', agency: 'Alberta Emergency Management Agency / Parks Canada', affectedAcres: '32,000+ hectares' }
  },
  {
    id: 'alert_bc_fraser_canyon',
    layer: 'canadaAlerts',
    name: 'Fraser Canyon Mudslide & Highway 1 Risk (BC)',
    coordinates: [-121.44, 49.88],
    category: 'Atmospheric River Geotechnical Hazard',
    status: 'Watch / Flash Flood Advisory',
    severity: 'high',
    description: 'Heavy precipitation triggering slope instability along Trans-Canada Highway corridor between Hope and Boston Bar; freight supply chain monitor.',
    details: { province: 'British Columbia', agency: 'Emergency Management BC / DriveBC' }
  },
  {
    id: 'alert_sask_blizzard',
    layer: 'canadaAlerts',
    name: 'Prairie Blizzard & Wind Chill Warning (SK)',
    coordinates: [-104.61, 50.45],
    category: 'Severe Winter Weather Hazard',
    status: 'Extreme Cold Warning',
    severity: 'medium',
    description: 'Arctic high pressure system bringing wind chill values approaching -45°C across Regina, Saskatoon, and Prince Albert corridors.',
    details: { province: 'Saskatchewan', agency: 'Environment and Climate Change Canada (ECCC)' }
  },
  {
    id: 'alert_great_lakes_gale',
    layer: 'canadaAlerts',
    name: 'Lake Superior & Georgian Bay Gale Warning (ON)',
    coordinates: [-84.34, 46.52],
    category: 'Maritime Navigation & Shoreline Flood',
    status: 'Marine Gale Warning (35-45 knots)',
    severity: 'medium',
    description: 'Gale-force gusts and waves up to 5 meters impacting bulk cargo lake freighters moving grain and iron ore into the St. Lawrence Seaway.',
    details: { province: 'Ontario', agency: 'Canadian Coast Guard & ECCC Marine Weather' }
  },
  {
    id: 'alert_inuvik_arctic_ice',
    layer: 'canadaAlerts',
    name: 'Beaufort Sea / Inuvik Ice Drift Advisory (NWT)',
    coordinates: [-133.72, 68.36],
    category: 'Northern Resupply & Ice Reconnaissance',
    status: 'Active Ice Patrol',
    severity: 'info',
    description: 'Canadian Ice Service tracking multi-year pack ice consolidation along the Northwest Passage shipping lanes and Tuktoyaktuk harbor.',
    details: { territory: 'Northwest Territories', agency: 'Canadian Ice Service' }
  }
];
