import { LayerKey, ThemeMode } from '../types';

export interface CategoryHuePair {
  light: string;
  dark: string;
}

export const UNIFIED_LAYER_COLORS: Record<LayerKey, CategoryHuePair> = {
  // Kinetic & Conflict
  iranAttacks: {
    light: '#C0392B',
    dark: '#f43f5e'
  },
  conflicts: {
    light: '#B42318',
    dark: '#f43f5e'
  },
  hotspots: {
    light: '#D9730D',
    dark: '#fb7185'
  },
  fortifiedBorders: {
    light: '#9F1D35',
    dark: '#e11d48'
  },

  // Military & Strategic
  bases: {
    light: '#2F6F8F',
    dark: '#38bdf8'
  },
  nuclear: {
    light: '#B7791F',
    dark: '#f59e0b'
  },
  military: {
    light: '#3B7A6B',
    dark: '#06b6d4'
  },
  adizZones: {
    light: '#5B5BA6',
    dark: '#0ea5e9'
  },
  gpsJamming: {
    light: '#0E7490',
    dark: '#22d3ee'
  },

  // Infrastructure & Environment
  waterways: {
    light: '#1F7A5C',
    dark: '#10b981'
  },
  outages: {
    light: '#6B5CA5',
    dark: '#818cf8'
  },
  weather: {
    light: '#5E7C99',
    dark: '#6366f1'
  },
  natural: {
    light: '#8A6D3B',
    dark: '#34d399'
  },

  // Geopolitical & Economics
  economic: {
    light: '#7A5C99',
    dark: '#a78bfa'
  },
  sanctions: {
    light: '#A04F78',
    dark: '#c084fc'
  },
  canadaAlerts: {
    light: '#C6613F',
    dark: '#f472b6'
  }
};

/**
 * Returns the exact unified category hex color for a given tactical layer and theme mode.
 */
export function getLayerColor(layerId: LayerKey | string, theme: ThemeMode = 'dark'): string {
  const pair = UNIFIED_LAYER_COLORS[layerId as LayerKey];
  if (!pair) {
    return theme === 'light' ? '#C6613F' : '#38bdf8';
  }
  return theme === 'light' ? pair.light : pair.dark;
}

/**
 * Returns escalation score color for intel hotspots.
 */
export function getHotspotEscalationColor(score: number, theme: ThemeMode = 'dark'): string {
  if (theme === 'light') {
    if (score >= 5) return '#B42318';
    if (score >= 4) return '#D9730D';
    return '#B7791F';
  }
  if (score >= 5) return '#ef4444';
  if (score >= 4) return '#f97316';
  return '#eab308';
}
