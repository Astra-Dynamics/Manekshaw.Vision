import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Radio } from 'lucide-react';
import { Header } from './components/Header';
import { AlertTicker } from './components/AlertTicker';
import { MapComponent } from './components/MapComponent';
import { LayerDock } from './components/LayerDock';
import { RightIntelligencePanel } from './components/RightIntelligencePanel';
import { CountryBriefModal } from './components/CountryBriefModal';
import { CommandPalette } from './components/CommandPalette';
import { LandingPage } from './components/LandingPage';
import { WorkspaceTabBar } from './components/WorkspaceTabBar';
import { IntelWorkspaceDrawer } from './components/IntelWorkspaceDrawer';
import { getCountryIntel, CountryIntelDetails } from './data/countryIntel';
import {
  LayerKey,
  TheaterView,
  MapFeatureItem,
  IntelHotspot,
  ConflictZoneFeature,
  StrategicFeature,
  IntelNewsItem,
  ThemeMode,
  WorkspaceTab,
  WorkspaceDrawerItem,
  WorkspaceDrawerTab,
  WorkspaceTabIntelDeskState,
  WorkspaceTabRightDrawerState,
  createDefaultIntelDeskState,
  createDefaultRightDrawerState
} from './types';

// Curated Datasets
import { INTEL_HOTSPOTS } from './data/hotspots';
import { CONFLICT_ZONES } from './data/conflicts';
import { MILITARY_BASES } from './data/militaryBases';
import { NUCLEAR_SITES } from './data/nuclearSites';
import { STRATEGIC_WATERWAYS } from './data/waterways';
import { SANCTIONS_REGIMES } from './data/sanctions';
import { ECONOMIC_CENTERS } from './data/economic';
import { INFRASTRUCTURE_OUTAGES } from './data/outages';
import { CANADA_ALERTS } from './data/canadaAlerts';
import { IRAN_ATTACKS } from './data/iranAttacks';
import { MILITARY_ASSETS } from './data/militaryAssets';
import { GPS_JAMMING_POINTS, GPS_JAMMING_ZONES } from './data/gpsJamming';
import { ADIZ_ZONES } from './data/adizZones';
import { FORTIFIED_BORDERS } from './data/fortifiedBorders';

// Real-Time Live Data Feeds
import { fetchLiveEarthquakes } from './services/earthquakes';
import { fetchNasaEonetEvents } from './services/nasaEonet';
import { fetchWeatherAlerts } from './services/weatherAlerts';
import { BREAKING_INTEL_DISPATCHES } from './services/newsService';

const ALL_LAYER_KEYS: LayerKey[] = [
  'iranAttacks',
  'hotspots',
  'conflicts',
  'bases',
  'nuclear',
  'military',
  'weather',
  'canadaAlerts',
  'outages',
  'natural',
  'waterways',
  'economic',
  'sanctions',
  'gpsJamming',
  'adizZones',
  'fortifiedBorders'
];

// Bitmask encoding: 16 layers fit into 16 bits -> 4 hex characters
const DEFAULT_LAYER_MASK = (1 << ALL_LAYER_KEYS.length) - 1; // 65535 (0xffff)

export const encodeLayersToHex = (layers: Record<LayerKey, boolean>): string => {
  let mask = 0;
  ALL_LAYER_KEYS.forEach((key, idx) => {
    if (layers[key]) {
      mask |= (1 << idx);
    }
  });
  return mask.toString(16);
};

export const decodeLayersFromHex = (hex: string): Record<LayerKey, boolean> => {
  const mask = parseInt(hex, 16);
  const obj = {} as Record<LayerKey, boolean>;
  ALL_LAYER_KEYS.forEach((key, idx) => {
    obj[key] = isNaN(mask) ? true : Boolean((mask >> idx) & 1);
  });
  return obj;
};

export const App: React.FC = () => {
  // Parse URL Parameters (Supporting both micro bitmask and legacy format)
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

  // Micro coordinates format: ?c=22.46,82.75,3.25
  const cParam = urlParams.get('c');
  const [cLat, cLon, cZoom] = cParam ? cParam.split(',') : [null, null, null];

  const initialLat = cLat ? parseFloat(cLat) : parseFloat(urlParams.get('lat') || '22.4589');
  const initialLon = cLon ? parseFloat(cLon) : parseFloat(urlParams.get('lon') || '82.7533');
  const initialZoom = cZoom ? parseFloat(cZoom) : parseFloat(urlParams.get('zoom') || urlParams.get('z') || '3.25');
  const initialView = (urlParams.get('v') || urlParams.get('view') || 'global') as TheaterView;
  const initialTimeRange = urlParams.get('t') || urlParams.get('timeRange') || '7d';

  const initialLayersHex = urlParams.get('l');
  const initialLegacyLayers = urlParams.get('layers');

  const initialActiveLayers = useMemo((): Record<LayerKey, boolean> => {
    if (initialLayersHex) {
      return decodeLayersFromHex(initialLayersHex);
    }
    if (initialLegacyLayers) {
      const activeList = initialLegacyLayers.split(',');
      const obj = {} as Record<LayerKey, boolean>;
      ALL_LAYER_KEYS.forEach((k) => {
        obj[k] = activeList.includes(k);
      });
      return obj;
    }
    const obj = {} as Record<LayerKey, boolean>;
    ALL_LAYER_KEYS.forEach((k) => {
      obj[k] = true;
    });
    return obj;
  }, [initialLayersHex, initialLegacyLayers]);

  // Routing State: '/' for Landing Page, '/dashboard' or '/Dashboard' for live map
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const isDashboard = currentPath.toLowerCase().startsWith('/dashboard');

  const handleLaunchDashboard = () => {
    window.history.pushState({}, '', '/Dashboard');
    setCurrentPath('/Dashboard');
  };

  const handleNavigateHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  // -------------------------------------------------------------
  // Multi-Tab Tactical Workspace State
  // -------------------------------------------------------------
  const [tabs, setTabs] = useState<WorkspaceTab[]>(() => {
    const defaultTab: WorkspaceTab = {
      id: 'tab_main',
      title:
        initialView && initialView !== 'global'
          ? `${initialView.charAt(0).toUpperCase() + initialView.slice(1)} Ops`
          : 'Main',
      lat: initialLat,
      lon: initialLon,
      zoom: initialZoom,
      view: initialView,
      timeRange: initialTimeRange,
      activeLayers: initialActiveLayers,
      intelDesk: createDefaultIntelDeskState(initialView),
      rightDrawer: createDefaultRightDrawerState()
    };

    const hasExplicitUrlParams = Boolean(cParam || urlParams.get('lat') || urlParams.get('v') || urlParams.get('l'));
    if (hasExplicitUrlParams) {
      return [defaultTab];
    }

    try {
      const saved = sessionStorage.getItem('manvis_workspace_tabs');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((t) => ({
            ...t,
            intelDesk: t.intelDesk || createDefaultIntelDeskState(t.view),
            rightDrawer: t.rightDrawer || createDefaultRightDrawerState()
          }));
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved workspace tabs:', e);
    }
    return [defaultTab];
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    const hasExplicitUrlParams = Boolean(cParam || urlParams.get('lat') || urlParams.get('v') || urlParams.get('l'));
    if (hasExplicitUrlParams) {
      return 'tab_main';
    }

    try {
      const savedId = sessionStorage.getItem('manvis_active_tab_id');
      if (savedId) {
        return savedId;
      }
    } catch (e) {}
    return 'tab_main';
  });

  // State
  const [mapCenter, setMapCenter] = useState<[number, number]>(() => {
    const hasExplicitUrlParams = Boolean(cParam || urlParams.get('lat') || urlParams.get('v') || urlParams.get('l'));
    if (!hasExplicitUrlParams) {
      try {
        const saved = sessionStorage.getItem('manvis_workspace_tabs');
        const savedId = sessionStorage.getItem('manvis_active_tab_id');
        if (saved && savedId) {
          const parsed: WorkspaceTab[] = JSON.parse(saved);
          const found = parsed.find((t) => t.id === savedId);
          if (found) return [found.lon, found.lat];
        }
      } catch (e) {}
    }
    return [initialLon, initialLat];
  });

  const [mapZoom, setMapZoom] = useState<number>(() => {
    const hasExplicitUrlParams = Boolean(cParam || urlParams.get('lat') || urlParams.get('v') || urlParams.get('l'));
    if (!hasExplicitUrlParams) {
      try {
        const saved = sessionStorage.getItem('manvis_workspace_tabs');
        const savedId = sessionStorage.getItem('manvis_active_tab_id');
        if (saved && savedId) {
          const parsed: WorkspaceTab[] = JSON.parse(saved);
          const found = parsed.find((t) => t.id === savedId);
          if (found) return found.zoom;
        }
      } catch (e) {}
    }
    return initialZoom;
  });

  const [currentView, setCurrentView] = useState<TheaterView>(() => {
    const hasExplicitUrlParams = Boolean(cParam || urlParams.get('lat') || urlParams.get('v') || urlParams.get('l'));
    if (!hasExplicitUrlParams) {
      try {
        const saved = sessionStorage.getItem('manvis_workspace_tabs');
        const savedId = sessionStorage.getItem('manvis_active_tab_id');
        if (saved && savedId) {
          const parsed: WorkspaceTab[] = JSON.parse(saved);
          const found = parsed.find((t) => t.id === savedId);
          if (found) return found.view;
        }
      } catch (e) {}
    }
    return initialView;
  });

  const [timeRange, setTimeRange] = useState<string>(() => {
    const hasExplicitUrlParams = Boolean(cParam || urlParams.get('lat') || urlParams.get('v') || urlParams.get('l'));
    if (!hasExplicitUrlParams) {
      try {
        const saved = sessionStorage.getItem('manvis_workspace_tabs');
        const savedId = sessionStorage.getItem('manvis_active_tab_id');
        if (saved && savedId) {
          const parsed: WorkspaceTab[] = JSON.parse(saved);
          const found = parsed.find((t) => t.id === savedId);
          if (found) return found.timeRange;
        }
      } catch (e) {}
    }
    return initialTimeRange;
  });

  const [activeLayers, setActiveLayers] = useState<Record<LayerKey, boolean>>(() => {
    const hasExplicitUrlParams = Boolean(cParam || urlParams.get('lat') || urlParams.get('v') || urlParams.get('l'));
    if (!hasExplicitUrlParams) {
      try {
        const saved = sessionStorage.getItem('manvis_workspace_tabs');
        const savedId = sessionStorage.getItem('manvis_active_tab_id');
        if (saved && savedId) {
          const parsed: WorkspaceTab[] = JSON.parse(saved);
          const found = parsed.find((t) => t.id === savedId);
          if (found && found.activeLayers) return found.activeLayers;
        }
      } catch (e) {}
    }
    return initialActiveLayers;
  });

  // Synchronize active tab snapshot whenever state changes
  useEffect(() => {
    setTabs((prevTabs) => {
      const updated = prevTabs.map((t) =>
        t.id === activeTabId
          ? {
              ...t,
              lon: mapCenter[0],
              lat: mapCenter[1],
              zoom: mapZoom,
              view: currentView,
              timeRange: timeRange,
              activeLayers: { ...activeLayers }
            }
          : t
      );
      try {
        sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(updated));
        sessionStorage.setItem('manvis_active_tab_id', activeTabId);
      } catch (e) {}
      return updated;
    });
  }, [activeTabId, mapCenter, mapZoom, currentView, timeRange, activeLayers]);

  // Tab interaction handlers
  const handleSelectTab = useCallback(
    (targetTabId: string) => {
      if (targetTabId === activeTabId) return;

      const targetTab = tabs.find((t) => t.id === targetTabId);
      if (!targetTab) return;

      setActiveTabId(targetTabId);
      setMapCenter([targetTab.lon, targetTab.lat]);
      setMapZoom(targetTab.zoom);
      setCurrentView(targetTab.view);
      setTimeRange(targetTab.timeRange);
      setActiveLayers(targetTab.activeLayers);

      try {
        sessionStorage.setItem('manvis_active_tab_id', targetTabId);
      } catch (e) {}
    },
    [activeTabId, tabs]
  );

  const handleNewTab = useCallback(() => {
    const nextNum = tabs.length + 1;
    const newTabId = `tab_${Date.now()}`;
    const newTab: WorkspaceTab = {
      id: newTabId,
      title: `Sector ${nextNum}`,
      lon: mapCenter[0],
      lat: mapCenter[1],
      zoom: mapZoom,
      view: currentView,
      timeRange: timeRange,
      activeLayers: { ...activeLayers },
      intelDesk: createDefaultIntelDeskState(currentView),
      rightDrawer: createDefaultRightDrawerState()
    };

    const nextTabs = [...tabs, newTab];
    setTabs(nextTabs);
    setActiveTabId(newTabId);

    try {
      sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(nextTabs));
      sessionStorage.setItem('manvis_active_tab_id', newTabId);
    } catch (e) {}
  }, [tabs, mapCenter, mapZoom, currentView, timeRange, activeLayers]);

  const handleCloseTab = useCallback(
    (tabIdToClose: string) => {
      if (tabs.length <= 1) return; // Prevent closing if only 1 tab remains

      const closeIndex = tabs.findIndex((t) => t.id === tabIdToClose);
      if (closeIndex === -1) return;

      const remainingTabs = tabs.filter((t) => t.id !== tabIdToClose);

      if (tabIdToClose === activeTabId) {
        const nextIndex = closeIndex === 0 ? 0 : closeIndex - 1;
        const nextTab = remainingTabs[nextIndex];

        setActiveTabId(nextTab.id);
        setMapCenter([nextTab.lon, nextTab.lat]);
        setMapZoom(nextTab.zoom);
        setCurrentView(nextTab.view);
        setTimeRange(nextTab.timeRange);
        setActiveLayers(nextTab.activeLayers);

        try {
          sessionStorage.setItem('manvis_active_tab_id', nextTab.id);
        } catch (e) {}
      }

      setTabs(remainingTabs);
      try {
        sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(remainingTabs));
      } catch (e) {}
    },
    [tabs, activeTabId]
  );

  const handleRenameTab = useCallback((tabId: string, newTitle: string) => {
    setTabs((prevTabs) => {
      const nextTabs = prevTabs.map((t) => (t.id === tabId ? { ...t, title: newTitle } : t));
      try {
        sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(nextTabs));
      } catch (e) {}
      return nextTabs;
    });
  }, []);

  // Theme Management (Dark default, persists in localStorage)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem('manvis_theme') as ThemeMode) || 'dark';
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');
    } else {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('manvis_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Keyboard shortcut for Command Palette (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // UI Panels
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(true);
  const [isLayerDockOpen, setIsLayerDockOpen] = useState<boolean>(true);
  const [selectedFeature, setSelectedFeature] = useState<StrategicFeature | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryIntelDetails | null>(null);

  // -------------------------------------------------------------
  // Rightmost Intel Workspace Drawer State & Multi-Tab Logic (Isolated Per-Tab)
  // -------------------------------------------------------------
  const activeTab = useMemo(() => {
    return tabs.find((t) => t.id === activeTabId) || tabs[0];
  }, [tabs, activeTabId]);

  const activeIntelDesk = activeTab.intelDesk || createDefaultIntelDeskState(activeTab.view);
  const activeRightDrawer = activeTab.rightDrawer || createDefaultRightDrawerState();

  const [isDraggingIntel, setIsDraggingIntel] = useState<boolean>(false);

  // Reset drag state on window dragend
  useEffect(() => {
    const handleDragEnd = () => setIsDraggingIntel(false);
    window.addEventListener('dragend', handleDragEnd);
    return () => window.removeEventListener('dragend', handleDragEnd);
  }, []);

  const updateActiveTabIntelDesk = useCallback(
    (updates: Partial<WorkspaceTabIntelDeskState>) => {
      setTabs((prevTabs) => {
        const nextTabs = prevTabs.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                intelDesk: {
                  ...(t.intelDesk || createDefaultIntelDeskState(t.view)),
                  ...updates
                }
              }
            : t
        );
        try {
          sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(nextTabs));
        } catch (e) {}
        return nextTabs;
      });
    },
    [activeTabId]
  );

  const updateActiveTabRightDrawer = useCallback(
    (updates: Partial<WorkspaceTabRightDrawerState>) => {
      setTabs((prevTabs) => {
        const nextTabs = prevTabs.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                rightDrawer: {
                  ...(t.rightDrawer || createDefaultRightDrawerState()),
                  ...updates
                }
              }
            : t
        );
        try {
          sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(nextTabs));
        } catch (e) {}
        return nextTabs;
      });
    },
    [activeTabId]
  );

  const handleOpenInWorkspace = useCallback(
    (item: WorkspaceDrawerItem) => {
      setTabs((prevTabs) => {
        const currentTab = prevTabs.find((t) => t.id === activeTabId) || prevTabs[0];
        if (!currentTab) return prevTabs;

        const currentDrawer = currentTab.rightDrawer || createDefaultRightDrawerState();
        let targetDrawerTabId = currentDrawer.activeDrawerTabId;
        let targetDrawerTab = currentDrawer.drawerTabs.find((t) => t.id === targetDrawerTabId);

        if (!targetDrawerTab) {
          targetDrawerTab = currentDrawer.drawerTabs[0];
          targetDrawerTabId = targetDrawerTab ? targetDrawerTab.id : 'drawer_tab_1';
        }

        let updatedDrawerTabs = currentDrawer.drawerTabs;

        if (!targetDrawerTab) {
          const newTab: WorkspaceDrawerTab = {
            id: 'drawer_tab_1',
            title: item.type === 'video' ? 'Live Stream' : 'Intel Brief',
            items: [item]
          };
          updatedDrawerTabs = [newTab];
          targetDrawerTabId = 'drawer_tab_1';
        } else {
          const alreadyExists = targetDrawerTab.items.some((i) => i.id === item.id);
          if (!alreadyExists) {
            updatedDrawerTabs = currentDrawer.drawerTabs.map((t) =>
              t.id === targetDrawerTabId
                ? {
                    ...t,
                    title:
                      t.title === 'Tactical Watch' && t.items.length === 0
                        ? item.type === 'video'
                          ? 'Live Stream'
                          : 'Intel Brief'
                        : t.title,
                    items: [...t.items, item]
                  }
                : t
            );
          }
        }

        const nextTabs = prevTabs.map((t) =>
          t.id === activeTabId
            ? {
                ...t,
                rightDrawer: {
                  ...currentDrawer,
                  isOpen: true,
                  isMinimized: false,
                  activeDrawerTabId: targetDrawerTabId,
                  drawerTabs: updatedDrawerTabs
                }
              }
            : t
        );

        try {
          sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(nextTabs));
        } catch (e) {}
        return nextTabs;
      });
    },
    [activeTabId]
  );

  const handleNewDrawerTab = useCallback(() => {
    setTabs((prevTabs) => {
      const currentTab = prevTabs.find((t) => t.id === activeTabId);
      if (!currentTab) return prevTabs;
      const currentDrawer = currentTab.rightDrawer || createDefaultRightDrawerState();
      const nextNum = currentDrawer.drawerTabs.length + 1;
      const newTabId = `drawer_tab_${Date.now()}`;
      const newDrawerTab: WorkspaceDrawerTab = {
        id: newTabId,
        title: `Workspace ${nextNum}`,
        items: []
      };
      const updatedDrawer: WorkspaceTabRightDrawerState = {
        ...currentDrawer,
        activeDrawerTabId: newTabId,
        drawerTabs: [...currentDrawer.drawerTabs, newDrawerTab]
      };
      const nextTabs = prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: updatedDrawer } : t));
      try {
        sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(nextTabs));
      } catch (e) {}
      return nextTabs;
    });
  }, [activeTabId]);

  const handleCloseDrawerTab = useCallback(
    (tabId: string) => {
      setTabs((prevTabs) => {
        const currentTab = prevTabs.find((t) => t.id === activeTabId);
        if (!currentTab) return prevTabs;
        const currentDrawer = currentTab.rightDrawer || createDefaultRightDrawerState();
        if (currentDrawer.drawerTabs.length <= 1) {
          const resetDrawer: WorkspaceTabRightDrawerState = {
            ...currentDrawer,
            drawerTabs: [{ id: currentDrawer.drawerTabs[0].id, title: 'Tactical Watch', items: [] }]
          };
          const nextTabs = prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: resetDrawer } : t));
          try {
            sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(nextTabs));
          } catch (e) {}
          return nextTabs;
        }

        const remaining = currentDrawer.drawerTabs.filter((t) => t.id !== tabId);
        let nextActiveId = currentDrawer.activeDrawerTabId;
        if (tabId === nextActiveId) {
          nextActiveId = remaining[0].id;
        }

        const updatedDrawer: WorkspaceTabRightDrawerState = {
          ...currentDrawer,
          activeDrawerTabId: nextActiveId,
          drawerTabs: remaining
        };
        const nextTabs = prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: updatedDrawer } : t));
        try {
          sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(nextTabs));
        } catch (e) {}
        return nextTabs;
      });
    },
    [activeTabId]
  );

  const handleRenameDrawerTab = useCallback(
    (tabId: string, newTitle: string) => {
      setTabs((prevTabs) => {
        const currentTab = prevTabs.find((t) => t.id === activeTabId);
        if (!currentTab) return prevTabs;
        const currentDrawer = currentTab.rightDrawer || createDefaultRightDrawerState();
        const updatedDrawer: WorkspaceTabRightDrawerState = {
          ...currentDrawer,
          drawerTabs: currentDrawer.drawerTabs.map((t) => (t.id === tabId ? { ...t, title: newTitle } : t))
        };
        const nextTabs = prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: updatedDrawer } : t));
        try {
          sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(nextTabs));
        } catch (e) {}
        return nextTabs;
      });
    },
    [activeTabId]
  );

  const handleRemoveDrawerItem = useCallback(
    (tabId: string, itemId: string) => {
      setTabs((prevTabs) => {
        const currentTab = prevTabs.find((t) => t.id === activeTabId);
        if (!currentTab) return prevTabs;
        const currentDrawer = currentTab.rightDrawer || createDefaultRightDrawerState();
        const updatedDrawer: WorkspaceTabRightDrawerState = {
          ...currentDrawer,
          drawerTabs: currentDrawer.drawerTabs.map((t) =>
            t.id === tabId ? { ...t, items: t.items.filter((i) => i.id !== itemId) } : t
          )
        };
        const nextTabs = prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: updatedDrawer } : t));
        try {
          sessionStorage.setItem('manvis_workspace_tabs', JSON.stringify(nextTabs));
        } catch (e) {}
        return nextTabs;
      });
    },
    [activeTabId]
  );

  const handleDropDrawerItem = useCallback(
    (tabId: string, item: WorkspaceDrawerItem) => {
      handleOpenInWorkspace(item);
    },
    [handleOpenInWorkspace]
  );

  // Live dynamic feeds
  const [liveEarthquakes, setLiveEarthquakes] = useState<MapFeatureItem[]>([]);
  const [liveEonet, setLiveEonet] = useState<MapFeatureItem[]>([]);
  const [liveWeather, setLiveWeather] = useState<MapFeatureItem[]>([]);
  const [newsFeed, setNewsFeed] = useState<IntelNewsItem[]>(BREAKING_INTEL_DISPATCHES);

  // Load Real-Time Public APIs
  useEffect(() => {
    let mounted = true;

    fetchLiveEarthquakes().then((eq) => {
      if (mounted) setLiveEarthquakes(eq);
    });

    fetchNasaEonetEvents().then((ev) => {
      if (mounted) setLiveEonet(ev);
    });

    fetchWeatherAlerts().then((w) => {
      if (mounted) setLiveWeather(w);
    });

    return () => {
      mounted = false;
    };
  }, []);

  // Maintain clean address bar: strictly '/Dashboard' without query strings
  useEffect(() => {
    if (!isDashboard) return;

    if (window.location.pathname !== '/Dashboard' || window.location.search) {
      window.history.replaceState({}, '', '/Dashboard');
    }
  }, [isDashboard]);

  // Generate Sharable Deep Link with Telemetry on demand (accessible via SHARE button)
  const getSharableUrl = useCallback(() => {
    const params = new URLSearchParams();

    // 1. Compact coordinates: c=lat,lon,zoom (e.g. c=25.58,89.88,4.2)
    const latStr = mapCenter[1].toFixed(2);
    const lonStr = mapCenter[0].toFixed(2);
    const zoomStr = mapZoom.toFixed(1);
    params.set('c', `${latStr},${lonStr},${zoomStr}`);

    // 2. Only include theater view if not default 'global'
    if (currentView && currentView !== 'global') {
      params.set('v', currentView);
    }

    // 3. Only include time range if not default '7d'
    if (timeRange && timeRange !== '7d') {
      params.set('t', timeRange);
    }

    // 4. Compact 4-character hex layer bitmask (e.g. l=fffe)
    const layerHex = encodeLayersToHex(activeLayers);
    if (layerHex !== DEFAULT_LAYER_MASK.toString(16)) {
      params.set('l', layerHex);
    }

    const origin = window.location.origin;
    return `${origin}/Dashboard?${params.toString()}`;
  }, [mapCenter, mapZoom, currentView, timeRange, activeLayers]);

  // Combined feature items
  const allFeatures = useMemo(() => {
    return [
      ...IRAN_ATTACKS,
      ...MILITARY_BASES,
      ...NUCLEAR_SITES,
      ...MILITARY_ASSETS,
      ...GPS_JAMMING_POINTS,
      ...STRATEGIC_WATERWAYS,
      ...SANCTIONS_REGIMES,
      ...ECONOMIC_CENTERS,
      ...INFRASTRUCTURE_OUTAGES,
      ...CANADA_ALERTS,
      ...liveEarthquakes,
      ...liveEonet,
      ...liveWeather
    ];
  }, [liveEarthquakes, liveEonet, liveWeather]);

  // Counts per layer
  const layerCounts = useMemo((): Record<LayerKey, number> => {
    const res: Record<LayerKey, number> = {
      iranAttacks: IRAN_ATTACKS.length,
      hotspots: INTEL_HOTSPOTS.length,
      conflicts: CONFLICT_ZONES.length,
      bases: MILITARY_BASES.length,
      nuclear: NUCLEAR_SITES.length,
      military: MILITARY_ASSETS.length,
      weather: liveWeather.length,
      canadaAlerts: CANADA_ALERTS.length,
      outages: INFRASTRUCTURE_OUTAGES.length,
      natural: liveEarthquakes.length + liveEonet.length,
      waterways: STRATEGIC_WATERWAYS.length,
      economic: ECONOMIC_CENTERS.length,
      sanctions: SANCTIONS_REGIMES.length,
      gpsJamming: GPS_JAMMING_ZONES.length + GPS_JAMMING_POINTS.length,
      adizZones: ADIZ_ZONES.length,
      fortifiedBorders: FORTIFIED_BORDERS.length
    };
    return res;
  }, [liveWeather, liveEarthquakes, liveEonet]);

  // Theater Views Presets (Matching Reference Menu)
  const handleSelectView = (view: TheaterView) => {
    setCurrentView(view);
    if (view === 'global') {
      setMapCenter([30.0, 25.0]);
      setMapZoom(2.8);
    } else if (view === 'india') {
      setMapCenter([80.0, 23.5]);
      setMapZoom(4.4);
    } else if (view === 'americas') {
      setMapCenter([-98.0, 39.0]);
      setMapZoom(3.6);
    } else if (view === 'middle-east') {
      setMapCenter([48.0, 28.0]);
      setMapZoom(4.6);
    } else if (view === 'europe') {
      setMapCenter([24.0, 52.0]);
      setMapZoom(4.2);
    } else if (view === 'indo-pacific') {
      setMapCenter([115.0, 18.0]);
      setMapZoom(4.0);
    } else if (view === 'latin-america') {
      setMapCenter([-60.0, -18.0]);
      setMapZoom(3.5);
    } else if (view === 'africa') {
      setMapCenter([22.0, 4.0]);
      setMapZoom(3.5);
    } else if (view === 'oceania') {
      setMapCenter([140.0, -25.0]);
      setMapZoom(3.8);
    }

    const theaterRegionNameMap: Record<string, string> = {
      'india': 'India / S. Asia',
      'middle-east': 'Middle East',
      'europe': 'Europe / UK',
      'americas': 'Americas / US',
      'indo-pacific': 'East Asia / Indo-Pacific',
      'global': 'all'
    };
    updateActiveTabIntelDesk({
      videoRegionFilter: theaterRegionNameMap[view] || 'all'
    });
  };

  const handleToggleLayer = useCallback((layer: LayerKey) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layer]: !prev[layer]
    }));
  }, []);

  const handleSetAllLayers = useCallback((enabled: boolean) => {
    const next: Record<LayerKey, boolean> = {} as any;
    ALL_LAYER_KEYS.forEach((k) => {
      next[k] = enabled;
    });
    setActiveLayers(next);
  }, []);

  const handleSelectFeature = useCallback(
    (feature: StrategicFeature) => {
      setSelectedFeature(feature);

      // Center map smoothly
      let c: [number, number] = [0, 0];
      if ('coordinates' in feature && feature.coordinates) {
        c = feature.coordinates;
      } else if ('center' in feature && feature.center) {
        c = feature.center;
      } else if ('coords' in feature && Array.isArray(feature.coords) && feature.coords.length > 0) {
        // LineString or polygon fallback
        const midIdx = Math.floor(feature.coords.length / 2);
        c = feature.coords[midIdx];
      }

      if (c[0] !== 0 || c[1] !== 0) {
        setMapCenter(c);
        setMapZoom((prev) => Math.max(prev, 5.5));
      }
    },
    []
  );

  const handleSelectAlert = (alert: IntelNewsItem) => {
    if (alert.coordinates) {
      setMapCenter(alert.coordinates);
      setMapZoom(6.0);
    }
    // Also create a feature dossier
    setSelectedFeature({
      id: alert.id,
      layer: 'military',
      name: alert.title,
      coordinates: alert.coordinates || [0, 0],
      category: alert.category,
      severity: alert.severity,
      description: alert.summary,
      source: alert.source
    });
    updateActiveTabIntelDesk({
      activeSubTab: 'dossier'
    });
  };

  const handleSelectCountry = useCallback(
    ({ code, name }: { code: string; name: string }) => {
      const intel = getCountryIntel(code, name);
      setSelectedCountry(intel);
    },
    []
  );

  const countryNews = useMemo(() => {
    if (!selectedCountry) return [];
    return newsFeed.filter(
      (n) =>
        n.title.toLowerCase().includes(selectedCountry.name.toLowerCase()) ||
        n.summary.toLowerCase().includes(selectedCountry.name.toLowerCase())
    );
  }, [selectedCountry, newsFeed]);

  const countryAssets = useMemo(() => {
    if (!selectedCountry || !selectedCountry.bounds) return [];
    const [minX, minY, maxX, maxY] = selectedCountry.bounds;
    return allFeatures.filter((f) => {
      const [lon, lat] = f.coordinates;
      return lon >= minX && lon <= maxX && lat >= minY && lat <= maxY;
    });
  }, [selectedCountry, allFeatures]);

  if (!isDashboard) {
    return (
      <div className="w-full min-h-screen overflow-y-auto bg-[#06090e]">
        <LandingPage onLaunchDashboard={handleLaunchDashboard} />
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)] font-sans select-none transition-colors">
      {/* 1. Full-Bleed Map Canvas (100vw x 100vh) */}
      <div className="absolute inset-0 w-full h-full">
        <MapComponent
          center={mapCenter}
          zoom={mapZoom}
          activeLayers={activeLayers}
          hotspots={INTEL_HOTSPOTS}
          conflicts={CONFLICT_ZONES}
          features={allFeatures}
          theme={theme}
          onSelectFeature={handleSelectFeature}
          onSelectCountry={handleSelectCountry}
          onViewChange={(c, z) => {
            setMapCenter(c);
            setMapZoom(z);
          }}
        />
      </div>

      {/* 2. Top Telemetry HUD Bar (Single-line 44px bar, floating z-30) */}
      <Header
        currentView={currentView}
        onSelectView={handleSelectView}
        timeRange={timeRange}
        onSelectTimeRange={setTimeRange}
        isRightPanelOpen={isRightPanelOpen}
        onToggleRightPanel={() => setIsRightPanelOpen(!isRightPanelOpen)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onNavigateHome={handleNavigateHome}
        getShareUrl={getSharableUrl}
        coordinates={mapCenter}
        zoom={mapZoom}
        alerts={newsFeed}
        onSelectAlert={handleSelectAlert}
      />

      {/* 2.5 Multi-Tab Tactical Workspace Bar (Below Header, height: 32px, z-30) */}
      <WorkspaceTabBar
        tabs={tabs}
        activeTabId={activeTabId}
        onSelectTab={handleSelectTab}
        onNewTab={handleNewTab}
        onCloseTab={handleCloseTab}
        onRenameTab={handleRenameTab}
        theme={theme}
      />

      {/* 3. Floating Modular HUD Panels */}
      {/* Left: Categorized Layer Matrix */}
      {isLayerDockOpen && (
        <LayerDock
          activeLayers={activeLayers}
          onToggleLayer={handleToggleLayer}
          onSetAllLayers={handleSetAllLayers}
          counts={layerCounts}
        />
      )}

      {/* Right: Palantir Edge-Docked Intelligence Desk (Per-Tab Isolated State) */}
      {isRightPanelOpen && (
        <div
          className="absolute z-30 flex flex-col animate-fade-in"
          style={{
            top: '76px',
            right: activeRightDrawer.isOpen
              ? activeRightDrawer.isMinimized
                ? '36px'
                : `${activeRightDrawer.width}px`
              : '0px',
            bottom: 0,
            width: '380px',
            maxWidth: '100vw',
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-medium)',
            boxShadow: '-12px 0 24px rgba(0, 0, 0, 0.6)',
            borderRadius: 0,
            transition: 'right 0.28s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <RightIntelligencePanel
            isOpen={isRightPanelOpen}
            onClose={() => setIsRightPanelOpen(false)}
            hotspots={INTEL_HOTSPOTS}
            conflicts={CONFLICT_ZONES}
            features={allFeatures}
            news={newsFeed}
            selectedFeature={selectedFeature}
            onSelectFeature={handleSelectFeature}
            onCenterMap={(c) => {
              setMapCenter(c);
              setMapZoom(6.5);
            }}
            onOpenInWorkspace={handleOpenInWorkspace}
            onDragStartItem={() => setIsDraggingIntel(true)}
            activeSubTab={activeIntelDesk.activeSubTab}
            onChangeSubTab={(subTab) => updateActiveTabIntelDesk({ activeSubTab: subTab })}
            searchQuery={activeIntelDesk.searchQuery}
            onChangeSearchQuery={(q) => updateActiveTabIntelDesk({ searchQuery: q })}
            severityFilter={activeIntelDesk.severityFilter}
            onChangeSeverityFilter={(sev) => updateActiveTabIntelDesk({ severityFilter: sev })}
            videoCategoryFilter={activeIntelDesk.videoCategoryFilter}
            onChangeVideoCategoryFilter={(cat) => updateActiveTabIntelDesk({ videoCategoryFilter: cat })}
            videoRegionFilter={activeIntelDesk.videoRegionFilter}
            onChangeVideoRegionFilter={(reg) => updateActiveTabIntelDesk({ videoRegionFilter: reg })}
            activeVideoChannelId={activeIntelDesk.activeVideoChannelId}
            onChangeActiveVideoChannelId={(id) => updateActiveTabIntelDesk({ activeVideoChannelId: id })}
            isPlayerMinimized={activeIntelDesk.isPlayerMinimized}
            onTogglePlayerMinimized={() =>
              updateActiveTabIntelDesk({ isPlayerMinimized: !activeIntelDesk.isPlayerMinimized })
            }
            currentTheater={currentView}
          />
        </div>
      )}

      {/* Rightmost: Intel Workspace Drawer (Per-Tab Isolated State) */}
      <IntelWorkspaceDrawer
        isOpen={activeRightDrawer.isOpen}
        isMinimized={activeRightDrawer.isMinimized}
        width={activeRightDrawer.width}
        tabs={activeRightDrawer.drawerTabs}
        activeTabId={activeRightDrawer.activeDrawerTabId}
        theme={theme}
        onClose={() => updateActiveTabRightDrawer({ isOpen: false })}
        onToggleMinimize={() => updateActiveTabRightDrawer({ isMinimized: !activeRightDrawer.isMinimized })}
        onToggleWidth={() =>
          updateActiveTabRightDrawer({ width: activeRightDrawer.width === 440 ? 640 : 440 })
        }
        onSelectTab={(tabId) => updateActiveTabRightDrawer({ activeDrawerTabId: tabId })}
        onNewTab={handleNewDrawerTab}
        onCloseTab={handleCloseDrawerTab}
        onRenameTab={handleRenameDrawerTab}
        onRemoveItem={handleRemoveDrawerItem}
        onDropItem={handleDropDrawerItem}
        onCenterMap={(c) => {
          setMapCenter(c);
          setMapZoom(6.5);
        }}
      />

      {/* Auto-Open Drop Target on Right Edge (When dragging and drawer is closed) */}
      {isDraggingIntel && !activeRightDrawer.isOpen && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'copy';
          }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDraggingIntel(false);
            try {
              const rawData = e.dataTransfer.getData('application/json');
              if (rawData) {
                const parsed = JSON.parse(rawData);
                if (parsed && parsed.item) {
                  handleOpenInWorkspace(parsed.item);
                }
              }
            } catch (err) {
              console.warn('Failed to drop into target:', err);
            }
          }}
          className="absolute top-[76px] bottom-0 right-0 z-40 flex items-center justify-center p-3 animate-fade-in select-none"
          style={{
            width: '260px',
            background: 'rgba(8, 12, 20, 0.94)',
            borderLeft: '2px dashed #38BDF8',
            boxShadow: '-10px 0 30px rgba(14, 165, 233, 0.25)'
          }}
        >
          <div className="flex flex-col items-center gap-2 text-center text-sky-400 font-mono text-xs">
            <Radio size={24} className="animate-pulse" />
            <span className="font-bold tracking-wider text-[11px]">
              + DROP INTEL TO OPEN IN WORKSPACE
            </span>
            <span className="text-[10px] text-slate-400">
              Mounts directly into multi-tab canvas
            </span>
          </div>
        </div>
      )}

      {/* 4. Country Intelligence Dossier Modal */}
      <CountryBriefModal
        country={selectedCountry}
        onClose={() => setSelectedCountry(null)}
        onCenterMap={(c, z) => {
          setMapCenter(c);
          if (z) setMapZoom(z);
        }}
        relatedNews={countryNews}
        relatedAssets={countryAssets}
      />

      {/* 5. Tactical Command Palette (Cmd+K / Search) */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectCountry={(code, name) => handleSelectCountry({ code, name })}
        onSelectView={handleSelectView}
        onCenterMap={(c, z) => {
          setMapCenter(c);
          if (z) setMapZoom(z);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onToggleLayer={handleToggleLayer}
      />
    </div>
  );
};

export default App;
