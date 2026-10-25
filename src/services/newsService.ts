import { IntelNewsItem } from '../types';

export const BREAKING_INTEL_DISPATCHES: IntelNewsItem[] = [
  {
    id: 'news_1',
    title: 'CENTCOM: Coalition Destroyers Intercept Dual Ballistic Missiles Over Southern Red Sea',
    summary: 'Guided-missile destroyers operating under Operation Prosperity Guardian successfully engaged two anti-ship ballistic missiles launched from Houthi-controlled territory in Yemen.',
    source: 'CENTCOM Media Operations',
    timeAgo: '14m ago',
    category: 'military',
    severity: 'critical',
    coordinates: [43.1, 13.5],
    relatedHotspot: 'red_sea_bab_el_mandeb'
  },
  {
    id: 'news_2',
    title: 'IAEA Director General Warns of "Fragile Safety Margins" at Zaporizhzhia Nuclear Plant',
    summary: 'Rafael Grossi briefed the UN Security Council following localized artillery impacts near the cooling water spray ponds of the occupied plant.',
    source: 'IAEA Press Briefing (Vienna)',
    timeAgo: '32m ago',
    category: 'geopolitical',
    severity: 'critical',
    coordinates: [35.1, 47.5],
    relatedHotspot: 'zaporizhzhia_npp'
  },
  {
    id: 'news_3',
    title: 'PLA Eastern Theater Command Concludes 48-Hour Live-Fire Missile & ADIZ Saturation Drills',
    summary: 'Over 62 military aircraft and 14 PLAN surface vessels detected around Taiwan; multiple crossing points of the median line recorded by Taiwan Ministry of National Defense.',
    source: 'Taiwan MND / Reuters',
    timeAgo: '1h ago',
    category: 'military',
    severity: 'high',
    coordinates: [119.5, 24.2],
    relatedHotspot: 'taiwan_strait'
  },
  {
    id: 'news_4',
    title: 'Subsea Cable Consortium Confirms Repair Team En Route to Red Sea AAE-1 Optical Fiber Break',
    summary: 'Specialized cable ship chartered with naval security detachment to splice damaged undersea high-capacity optical fiber segments in the southern Red Sea basin.',
    source: 'Submarine Telecoms Forum',
    timeAgo: '2h ago',
    category: 'cyber',
    severity: 'high',
    coordinates: [42.8, 13.8],
    relatedHotspot: 'baltic_critical_infra'
  },
  {
    id: 'news_5',
    title: 'Brent Crude Surges 2.8% on Heightened Persian Gulf Tanker Escort Inquiries',
    summary: 'Global energy benchmark crosses $78/bbl amid maritime insurance war-risk surcharge adjustments for Strait of Hormuz and Arabian Gulf passages.',
    source: 'Bloomberg Energy',
    timeAgo: '3h ago',
    category: 'economic',
    severity: 'medium',
    coordinates: [56.3, 26.5],
    relatedHotspot: 'strait_of_hormuz'
  },
  {
    id: 'news_6',
    title: 'USGS Reports M6.4 Offshore Earthquake Along Kermadec Trench; No Pacific Basin Tsunami',
    summary: 'Deep seismic event registered at 142km focal depth; automatic PTWC tsunami evaluation confirmed no destructive wave generated.',
    source: 'USGS NEIC / NOAA PTWC',
    timeAgo: '4h ago',
    category: 'natural',
    severity: 'medium',
    coordinates: [-177.5, -30.2]
  },
  {
    id: 'news_7',
    title: 'G7 Finance Ministers Reaffirm Sanctions Tightening on Russian Shadow Tanker Flag Registries',
    summary: 'Coordinated enforcement action targeting fraudulent maritime flag registries, false AIS spoofing transmitters, and Western P&I club coverage circumvention.',
    source: 'US Department of the Treasury / EU Council',
    timeAgo: '5h ago',
    category: 'geopolitical',
    severity: 'high',
    coordinates: [37.6, 55.7]
  }
];
