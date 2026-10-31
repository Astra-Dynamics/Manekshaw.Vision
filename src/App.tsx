import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import LZString from 'lz-string';
import { Radio, GripVertical } from 'lucide-react';
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
import { AuthProvider, useAuth } from './context/AuthContext';
import { PlayerProvider } from './context/PlayerContext';
import { AuthModal } from './components/AuthModal';
import { AuthPage } from './components/AuthPage';
import { StatusDiag } from './pages/StatusDiag';
import { filterByTimeRange, getLiveHotspots } from './services/liveFeedAdapter';
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
  WorkspaceRow,
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
import { getAggregatedOsintFeed } from './services/osintFeedService';

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

// YouTube-Style Saved Workspace Config Helpers
export const DEFAULT_MAP_CENTER: [number, number] = [86.35, 25.06];
export const DEFAULT_MAP_ZOOM = 3.5;

export const createBrandNewDefaultWorkspace = (view: TheaterView = 'global') => {
  const defaultLayers = ALL_LAYER_KEYS.reduce((acc, k) => {
    acc[k] = true;
    return acc;
  }, {} as Record<LayerKey, boolean>);

  const defaultTab: WorkspaceTab = {
    id: 'tab_main',
    title: view !== 'global' ? `${view.charAt(0).toUpperCase() + view.slice(1)} Ops` : 'Main',
    lat: 25.06,
    lon: 86.35,
    zoom: 3.5,
    view: view,
    timeRange: '7d',
    activeLayers: defaultLayers,
    intelDesk: createDefaultIntelDeskState(view),
    rightDrawer: createDefaultRightDrawerState()
  };

  return {
    tabs: [defaultTab],
    activeTabId: 'tab_main',
    mapCenter: DEFAULT_MAP_CENTER,
    mapZoom: DEFAULT_MAP_ZOOM,
    currentView: view,
    timeRange: '7d',
    activeLayers: defaultLayers,
    isRightPanelOpen: true,
    deskWidth: 380
  };
};

export const getSavedWorkspaceConfig = (userId?: string) => {
  const key = userId ? `manvis_saved_workspace_${userId}` : 'manvis_saved_workspace_guest';
  try {
    let raw = localStorage.getItem(key);
    if (!raw && userId) {
      raw = localStorage.getItem('manvis_saved_workspace_guest');
    }
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && Array.isArray(parsed.tabs) && parsed.tabs.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse saved workspace config:', e);
  }
  return null;
};

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const savedWorkspaceKey = user?.id ? `manvis_saved_workspace_${user.id}` : 'manvis_saved_workspace_guest';

  // Check initial saved configuration
  const initialSavedConfig = useMemo(() => {
    return getSavedWorkspaceConfig(user?.id);
  }, [user?.id]);

  const [isWorkspaceSaved, setIsWorkspaceSaved] = useState<boolean>(() => Boolean(initialSavedConfig));

  // Parse URL Parameters (Supporting micro coordinates and deep workspace configs)
  const urlParams = useMemo(() => new URLSearchParams(window.location.search), []);

  // Decompress shared full workspace configuration from ?cfg=...
  const sharedConfig = useMemo(() => {
    const cfgParam = urlParams.get('cfg');
    if (!cfgParam) return null;
    try {
      const decompressed = LZString.decompressFromEncodedURIComponent(cfgParam);
      if (decompressed) {
        return JSON.parse(decompressed) as {
          tabs?: WorkspaceTab[];
          activeTabId?: string;
          deskWidth?: number;
          isRightPanelOpen?: boolean;
        };
      }
    } catch (err) {
      console.warn('Failed to decompress shared configuration from URL:', err);
    }
    return null;
  }, [urlParams]);

  // Micro coordinates format: ?c=25.06,86.35,3.5
  const cParam = urlParams.get('c');
  const [cLat, cLon, cZoom] = cParam ? cParam.split(',') : [null, null, null];

  const initialLat = cLat ? parseFloat(cLat) : parseFloat(urlParams.get('lat') || '25.06');
  const initialLon = cLon ? parseFloat(cLon) : parseFloat(urlParams.get('lon') || '86.35');
  const initialZoom = cZoom ? parseFloat(cZoom) : parseFloat(urlParams.get('zoom') || urlParams.get('z') || '3.5');
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
  const isAuthPage = ['/login', '/signin', '/signup', '/auth'].includes(currentPath.toLowerCase());

  const handleLaunchDashboard = () => {
    const saved = getSavedWorkspaceConfig(user?.id);
    window.history.pushState({}, '', '/Dashboard');
    setCurrentPath('/Dashboard');
    if (!saved) {
      setMapCenter([86.35, 25.06]);
      setMapZoom(3.5);
    }
  };

  const handleNavigateHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
  };

  const handleNavigateLogin = (mode: 'signin' | 'signup' = 'signin') => {
    const target = mode === 'signup' ? '/signup' : '/login';
    window.history.pushState({}, '', target);
    setCurrentPath(target);
  };

  // Auth Modal State (Fallback / Quick access)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'signin' | 'signup'>('signin');

  const handleOpenAuth = (mode: 'signin' | 'signup' = 'signin') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  // -------------------------------------------------------------
  // Multi-Tab Tactical Workspace State
  // -------------------------------------------------------------
  const [tabs, setTabs] = useState<WorkspaceTab[]>(() => {
    if (sharedConfig?.tabs && Array.isArray(sharedConfig.tabs) && sharedConfig.tabs.length > 0) {
      return sharedConfig.tabs;
    }
    if (initialSavedConfig?.tabs && initialSavedConfig.tabs.length > 0) {
      return initialSavedConfig.tabs;
    }
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
    return [defaultTab];
  });

  const [activeTabId, setActiveTabId] = useState<string>(() => {
    if (sharedConfig?.activeTabId) return sharedConfig.activeTabId;
    if (initialSavedConfig?.activeTabId) return initialSavedConfig.activeTabId;
    return 'tab_main';
  });

  // State
  const [mapCenter, setMapCenter] = useState<[number, number]>(() => {
    if (initialSavedConfig?.mapCenter) return initialSavedConfig.mapCenter;
    return [initialLon, initialLat];
  });

  const [mapZoom, setMapZoom] = useState<number>(() => {
    if (initialSavedConfig?.mapZoom) return initialSavedConfig.mapZoom;
    return initialZoom;
  });

  const [currentView, setCurrentView] = useState<TheaterView>(() => {
    if (initialSavedConfig?.currentView) return initialSavedConfig.currentView;
    return initialView;
  });

  const [timeRange, setTimeRange] = useState<string>(() => {
    if (initialSavedConfig?.timeRange) return initialSavedConfig.timeRange;
    return initialTimeRange;
  });

  const [activeLayers, setActiveLayers] = useState<Record<LayerKey, boolean>>(() => {
    if (initialSavedConfig?.activeLayers) return initialSavedConfig.activeLayers;
    return initialActiveLayers;
  });

  // Synchronize active tab snapshot whenever state changes
  useEffect(() => {
    setTabs((prevTabs) => {
      return prevTabs.map((t) =>
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
      }

      setTabs(remainingTabs);
    },
    [tabs, activeTabId]
  );

  const handleRenameTab = useCallback((tabId: string, newTitle: string) => {
    setTabs((prevTabs) => {
      return prevTabs.map((t) => (t.id === tabId ? { ...t, title: newTitle } : t));
    });
  }, []);

  // Theme Management (Always load in Dark Mode by default)
  const [theme, setTheme] = useState<ThemeMode>(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const urlTheme = urlParams.get('theme') as ThemeMode | null;
      if (urlTheme === 'light' || urlTheme === 'dark') return urlTheme;
    } catch {}
    return 'dark';
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
    try {
      localStorage.setItem('manvis_theme', theme);
    } catch {}
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
  const [isRightPanelOpen, setIsRightPanelOpen] = useState<boolean>(() => {
    if (sharedConfig?.isRightPanelOpen !== undefined) return sharedConfig.isRightPanelOpen;
    return true;
  });
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
        return prevTabs.map((t) =>
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
      });
    },
    [activeTabId]
  );

  const updateActiveTabRightDrawer = useCallback(
    (updates: Partial<WorkspaceTabRightDrawerState>) => {
      setTabs((prevTabs) => {
        return prevTabs.map((t) =>
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

        const newRow: WorkspaceRow = {
          rowId: `row_${item.id}_${Date.now()}`,
          columns: [
            {
              id: `col_${item.id}_${Date.now()}`,
              item,
              widthFlex: 1,
              customHeight: item.type === 'video' ? 240 : undefined
            }
          ]
        };

        if (!targetDrawerTab) {
          const newTab: WorkspaceDrawerTab = {
            id: 'drawer_tab_1',
            title: item.type === 'video' ? 'Live Stream' : 'Intel Brief',
            items: [item],
            rows: [newRow]
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
                    items: [...t.items, item],
                    rows: [...(t.rows || []), newRow]
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
      return prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: updatedDrawer } : t));
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
          return prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: resetDrawer } : t));
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
        return prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: updatedDrawer } : t));
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
        return prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: updatedDrawer } : t));
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
          drawerTabs: currentDrawer.drawerTabs.map((t) => {
            if (t.id !== tabId) return t;
            const nextItems = t.items.filter((i) => i.id !== itemId);
            const nextRows = (t.rows || [])
              .map((row) => ({
                ...row,
                columns: row.columns.filter((c) => c.item.id !== itemId)
              }))
              .filter((row) => row.columns.length > 0);
            return {
              ...t,
              items: nextItems,
              rows: nextRows
            };
          })
        };
        return prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: updatedDrawer } : t));
      });
    },
    [activeTabId]
  );

  const handleUpdateDrawerRows = useCallback(
    (tabId: string, rows: WorkspaceRow[]) => {
      setTabs((prevTabs) => {
        const currentTab = prevTabs.find((t) => t.id === activeTabId);
        if (!currentTab) return prevTabs;
        const currentDrawer = currentTab.rightDrawer || createDefaultRightDrawerState();
        const flattenedItems = rows.flatMap((r) => r.columns.map((c) => c.item));
        const updatedDrawer: WorkspaceTabRightDrawerState = {
          ...currentDrawer,
          drawerTabs: currentDrawer.drawerTabs.map((t) =>
            t.id === tabId ? { ...t, rows, items: flattenedItems } : t
          )
        };
        return prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: updatedDrawer } : t));
      });
    },
    [activeTabId]
  );

  const handleClearDrawerTab = useCallback(
    (tabId: string) => {
      setTabs((prevTabs) => {
        const currentTab = prevTabs.find((t) => t.id === activeTabId);
        if (!currentTab) return prevTabs;
        const currentDrawer = currentTab.rightDrawer || createDefaultRightDrawerState();
        const updatedDrawer: WorkspaceTabRightDrawerState = {
          ...currentDrawer,
          drawerTabs: currentDrawer.drawerTabs.map((t) => {
            if (t.id !== tabId) return t;
            return {
              ...t,
              items: [],
              rows: []
            };
          })
        };
        return prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: updatedDrawer } : t));
      });
    },
    [activeTabId]
  );

  const handleCloseAllWorkspace = useCallback(() => {
    setTabs((prevTabs) => {
      const currentTab = prevTabs.find((t) => t.id === activeTabId);
      if (!currentTab) return prevTabs;
      const currentDrawer = currentTab.rightDrawer || createDefaultRightDrawerState();
      const defaultDrawer = createDefaultRightDrawerState();
      const resetDrawer: WorkspaceTabRightDrawerState = {
        ...defaultDrawer,
        isOpen: false,
        isWholePage: false,
        width: currentDrawer.width || 460
      };
      return prevTabs.map((t) => (t.id === activeTabId ? { ...t, rightDrawer: resetDrawer } : t));
    });
  }, [activeTabId]);

  // Interactive Panel Drag-Resizing States
  const [deskWidth, setDeskWidth] = useState<number>(() => {
    if (sharedConfig?.deskWidth) return sharedConfig.deskWidth;
    return 380;
  });
  const [isDraggingAnyResizer, setIsDraggingAnyResizer] = useState<boolean>(false);

  const handleStartDeskResize = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingAnyResizer(true);

    const startX = e.clientX;
    const initialWidth = deskWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      // Dragging left increases width
      const deltaX = startX - moveEvent.clientX;
      const newWidth = Math.max(280, Math.min(680, initialWidth + deltaX));
      setDeskWidth(Math.round(newWidth));
    };

    const handleMouseUp = () => {
      setIsDraggingAnyResizer(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleDropDrawerItem = useCallback(
    (tabId: string, item: WorkspaceDrawerItem) => {
      updateActiveTabRightDrawer({ isOpen: true, isMinimized: false });
    },
    [updateActiveTabRightDrawer]
  );

  // -------------------------------------------------------------
  // Comprehensive Undo / Redo Engine (Ctrl+Z & Ctrl+Y / Ctrl+Shift+Z)
  // Reverts: Desk width, Workstation width, Tab shifts, Clear All,
  // Element drop/move/delete, and Landmarks / Map locations
  // -------------------------------------------------------------
  interface AppHistorySnapshot {
    tabs: WorkspaceTab[];
    activeTabId: string;
    mapCenter: [number, number];
    mapZoom: number;
    currentView: TheaterView;
    deskWidth: number;
    isRightPanelOpen: boolean;
    selectedFeature: StrategicFeature | null;
    selectedCountry: CountryIntelDetails | null;
  }

  const undoStackRef = useRef<AppHistorySnapshot[]>([]);
  const redoStackRef = useRef<AppHistorySnapshot[]>([]);
  const lastCommittedKeyRef = useRef<string>('');
  const lastCommittedSnapshotRef = useRef<AppHistorySnapshot | null>(null);
  const isApplyingHistoryRef = useRef<boolean>(false);
  const debounceHistoryTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [historyToast, setHistoryToast] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  const showHistoryToast = useCallback((msg: string) => {
    setHistoryToast(msg);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => {
      setHistoryToast(null);
    }, 2200);
  }, []);

  const getCurrentSnapshot = useCallback((): AppHistorySnapshot => ({
    tabs: JSON.parse(JSON.stringify(tabs)),
    activeTabId,
    mapCenter: [mapCenter[0], mapCenter[1]],
    mapZoom,
    currentView,
    deskWidth,
    isRightPanelOpen,
    selectedFeature: selectedFeature ? { ...selectedFeature } : null,
    selectedCountry: selectedCountry ? { ...selectedCountry } : null
  }), [tabs, activeTabId, mapCenter, mapZoom, currentView, deskWidth, isRightPanelOpen, selectedFeature, selectedCountry]);

  const getSnapshotKey = useCallback((snap: AppHistorySnapshot): string => {
    return JSON.stringify({
      tabs: snap.tabs,
      activeTabId: snap.activeTabId,
      center: [snap.mapCenter[0].toFixed(3), snap.mapCenter[1].toFixed(3)],
      zoom: snap.mapZoom.toFixed(1),
      view: snap.currentView,
      deskW: snap.deskWidth,
      panelOpen: snap.isRightPanelOpen,
      feat: snap.selectedFeature?.id,
      country: snap.selectedCountry?.code
    });
  }, []);

  const describeChange = useCallback((prev: AppHistorySnapshot, curr: AppHistorySnapshot): string => {
    if (prev.activeTabId !== curr.activeTabId) return 'Workspace Tab Shift';
    if (prev.deskWidth !== curr.deskWidth) return `Intel Desk Width (${curr.deskWidth}px)`;

    const prevActiveTab = prev.tabs.find((t) => t.id === prev.activeTabId);
    const currActiveTab = curr.tabs.find((t) => t.id === curr.activeTabId);
    const prevDrawer = prevActiveTab?.rightDrawer;
    const currDrawer = currActiveTab?.rightDrawer;

    if (prevDrawer && currDrawer) {
      if (prevDrawer.width !== currDrawer.width) return `Workstation Width (${currDrawer.width}px)`;
      if (prevDrawer.isOpen !== currDrawer.isOpen) {
        return currDrawer.isOpen ? 'Open Workstation' : 'Close Workstation';
      }
      if (prevDrawer.activeDrawerTabId !== currDrawer.activeDrawerTabId) {
        return 'Workstation Tab Shift';
      }
      const prevItems = prevDrawer.drawerTabs.flatMap((t) => t.items).length;
      const currItems = currDrawer.drawerTabs.flatMap((t) => t.items).length;
      if (prevItems > 0 && currItems === 0) return 'Clear Workspace Elements';
      if (prevItems !== currItems) return 'Workspace Elements';
    }

    if (prev.tabs.length !== curr.tabs.length) return 'Workspace Tabs';
    if (prev.currentView !== curr.currentView) return `Theater: ${curr.currentView.toUpperCase()}`;
    if (prev.selectedCountry?.code !== curr.selectedCountry?.code) {
      return curr.selectedCountry ? `Landmark: ${curr.selectedCountry.name}` : 'Country Brief Closed';
    }
    if (prev.selectedFeature?.id !== curr.selectedFeature?.id) {
      const featName = curr.selectedFeature
        ? ('name' in curr.selectedFeature
            ? (curr.selectedFeature as { name: string }).name
            : 'title' in curr.selectedFeature
            ? (curr.selectedFeature as { title: string }).title
            : 'Landmark')
        : null;
      return featName ? `Landmark: ${featName}` : 'Landmark Closed';
    }
    if (
      Math.abs(prev.mapCenter[0] - curr.mapCenter[0]) > 0.05 ||
      Math.abs(prev.mapCenter[1] - curr.mapCenter[1]) > 0.05 ||
      Math.abs(prev.mapZoom - curr.mapZoom) > 0.1
    ) {
      return `Landmark: ${curr.mapCenter[1].toFixed(2)}°, ${curr.mapCenter[0].toFixed(2)}°`;
    }
    return 'Workspace State';
  }, []);

  const handleUndo = useCallback(() => {
    if (undoStackRef.current.length === 0) {
      showHistoryToast('Nothing to Undo');
      return;
    }

    const current = getCurrentSnapshot();
    const previous = undoStackRef.current.pop()!;
    redoStackRef.current.push(current);

    const desc = describeChange(previous, current);
    showHistoryToast(`↩ UNDO: ${desc}`);

    isApplyingHistoryRef.current = true;
    lastCommittedKeyRef.current = getSnapshotKey(previous);
    lastCommittedSnapshotRef.current = previous;

    setTabs(previous.tabs);
    setActiveTabId(previous.activeTabId);
    setMapCenter(previous.mapCenter);
    setMapZoom(previous.mapZoom);
    setCurrentView(previous.currentView);
    setDeskWidth(previous.deskWidth);
    setIsRightPanelOpen(previous.isRightPanelOpen);
    setSelectedFeature(previous.selectedFeature);
    setSelectedCountry(previous.selectedCountry);

    setTimeout(() => {
      isApplyingHistoryRef.current = false;
    }, 120);
  }, [getCurrentSnapshot, getSnapshotKey, describeChange, showHistoryToast]);

  const handleRedo = useCallback(() => {
    if (redoStackRef.current.length === 0) {
      showHistoryToast('Nothing to Redo');
      return;
    }

    const current = getCurrentSnapshot();
    const next = redoStackRef.current.pop()!;
    undoStackRef.current.push(current);

    const desc = describeChange(current, next);
    showHistoryToast(`↪ REDO: ${desc}`);

    isApplyingHistoryRef.current = true;
    lastCommittedKeyRef.current = getSnapshotKey(next);
    lastCommittedSnapshotRef.current = next;

    setTabs(next.tabs);
    setActiveTabId(next.activeTabId);
    setMapCenter(next.mapCenter);
    setMapZoom(next.mapZoom);
    setCurrentView(next.currentView);
    setDeskWidth(next.deskWidth);
    setIsRightPanelOpen(next.isRightPanelOpen);
    setSelectedFeature(next.selectedFeature);
    setSelectedCountry(next.selectedCountry);

    setTimeout(() => {
      isApplyingHistoryRef.current = false;
    }, 120);
  }, [getCurrentSnapshot, getSnapshotKey, describeChange, showHistoryToast]);

  // Track state changes and commit snapshots
  useEffect(() => {
    if (isApplyingHistoryRef.current) return;

    const current = getCurrentSnapshot();
    const currentKey = getSnapshotKey(current);

    if (!lastCommittedKeyRef.current) {
      lastCommittedKeyRef.current = currentKey;
      lastCommittedSnapshotRef.current = current;
      return;
    }

    if (currentKey === lastCommittedKeyRef.current) return;

    const prev = lastCommittedSnapshotRef.current;
    const isDiscrete =
      !prev ||
      prev.activeTabId !== current.activeTabId ||
      prev.currentView !== current.currentView ||
      prev.isRightPanelOpen !== current.isRightPanelOpen ||
      prev.selectedFeature?.id !== current.selectedFeature?.id ||
      prev.selectedCountry?.code !== current.selectedCountry?.code ||
      JSON.stringify(prev.tabs) !== JSON.stringify(current.tabs);

    const commitSnapshot = () => {
      if (isApplyingHistoryRef.current) return;
      if (lastCommittedSnapshotRef.current) {
        undoStackRef.current.push(lastCommittedSnapshotRef.current);
        if (undoStackRef.current.length > 50) {
          undoStackRef.current.shift();
        }
        redoStackRef.current = [];
      }
      lastCommittedKeyRef.current = currentKey;
      lastCommittedSnapshotRef.current = current;
    };

    if (isDiscrete) {
      if (debounceHistoryTimerRef.current) clearTimeout(debounceHistoryTimerRef.current);
      commitSnapshot();
    } else {
      // Continuous changes: map pan/zoom or desk resize
      if (debounceHistoryTimerRef.current) clearTimeout(debounceHistoryTimerRef.current);
      debounceHistoryTimerRef.current = setTimeout(() => {
        commitSnapshot();
      }, 380);
    }
  }, [
    tabs,
    activeTabId,
    mapCenter,
    mapZoom,
    currentView,
    deskWidth,
    isRightPanelOpen,
    selectedFeature,
    selectedCountry,
    getCurrentSnapshot,
    getSnapshotKey
  ]);

  // Global Keyboard Listener for Ctrl+Z and Ctrl+Y / Ctrl+Shift+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as HTMLElement).isContentEditable);

      if (isInput) return;

      const isCtrlOrMeta = e.ctrlKey || e.metaKey;
      if (!isCtrlOrMeta) return;

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if ((e.key.toLowerCase() === 'y' && !e.shiftKey) || (e.key.toLowerCase() === 'z' && e.shiftKey)) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Undo: Ctrl+Z
      if (e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo]);

  useEffect(() => {
    return () => {
      if (debounceHistoryTimerRef.current) clearTimeout(debounceHistoryTimerRef.current);
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // -------------------------------------------------------------
  // YouTube-Style Workspace Bookmark & Save Engine
  // -------------------------------------------------------------
  // 1. Check if user has saved layout and auto-restore on login or user change
  useEffect(() => {
    const saved = getSavedWorkspaceConfig(user?.id);
    if (saved) {
      setIsWorkspaceSaved(true);
      if (Array.isArray(saved.tabs) && saved.tabs.length > 0) {
        setTabs(saved.tabs);
        if (saved.activeTabId) setActiveTabId(saved.activeTabId);
        if (saved.currentView) setCurrentView(saved.currentView);
        if (saved.timeRange) setTimeRange(saved.timeRange);
        if (saved.mapCenter) setMapCenter(saved.mapCenter);
        if (saved.mapZoom) setMapZoom(saved.mapZoom);
        if (saved.activeLayers) setActiveLayers(saved.activeLayers);
        if (saved.isRightPanelOpen !== undefined) setIsRightPanelOpen(saved.isRightPanelOpen);
        if (saved.deskWidth) setDeskWidth(saved.deskWidth);
      }
    } else {
      setIsWorkspaceSaved(false);
    }
  }, [user?.id]);

  // 2. Keep saved configuration in sync with ongoing edits when bookmarked/saved
  useEffect(() => {
    if (!isWorkspaceSaved) return;

    const payload = {
      savedAt: Date.now(),
      tabs,
      activeTabId,
      currentView,
      timeRange,
      mapCenter,
      mapZoom,
      activeLayers,
      isRightPanelOpen,
      deskWidth
    };
    try {
      localStorage.setItem(savedWorkspaceKey, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to update saved workspace:', e);
    }
  }, [isWorkspaceSaved, savedWorkspaceKey, tabs, activeTabId, currentView, timeRange, mapCenter, mapZoom, activeLayers, isRightPanelOpen, deskWidth]);

  // 3. Toggle Save / Bookmark Workspace Layout
  const handleToggleSaveWorkspace = useCallback(() => {
    if (isWorkspaceSaved) {
      // Unsave layout: erase stored configuration from storage
      // Let current session stay how it is (no immediate reset)
      localStorage.removeItem(savedWorkspaceKey);
      localStorage.removeItem('manvis_saved_workspace_guest');
      if (user?.id) {
        localStorage.removeItem(`manvis_saved_workspace_${user.id}`);
      }
      try {
        sessionStorage.removeItem('manvis_workspace_tabs');
        sessionStorage.removeItem('manvis_active_tab_id');
      } catch (e) {}

      setIsWorkspaceSaved(false);
    } else {
      // Save current layout
      const payload = {
        savedAt: Date.now(),
        tabs,
        activeTabId,
        currentView,
        timeRange,
        mapCenter,
        mapZoom,
        activeLayers,
        isRightPanelOpen,
        deskWidth
      };
      try {
        localStorage.setItem(savedWorkspaceKey, JSON.stringify(payload));
        setIsWorkspaceSaved(true);
      } catch (e) {
        console.warn('Failed to save workspace:', e);
      }

      if (!user?.id) {
        handleOpenAuth('signin');
      }
    }
  }, [user?.id, isWorkspaceSaved, savedWorkspaceKey, tabs, activeTabId, currentView, timeRange, mapCenter, mapZoom, activeLayers, isRightPanelOpen, deskWidth]);

  // Live dynamic feeds
  const [liveEarthquakes, setLiveEarthquakes] = useState<MapFeatureItem[]>([]);
  const [liveEonet, setLiveEonet] = useState<MapFeatureItem[]>([]);
  const [liveWeather, setLiveWeather] = useState<MapFeatureItem[]>([]);
  const [newsFeed, setNewsFeed] = useState<IntelNewsItem[]>(BREAKING_INTEL_DISPATCHES);
  const [liveHotspots, setLiveHotspots] = useState<IntelHotspot[]>(INTEL_HOTSPOTS);

  // Active time-range filtered news feed
  const filteredNewsFeed = useMemo(() => {
    return filterByTimeRange(newsFeed, timeRange);
  }, [newsFeed, timeRange]);

  // Load Real-Time Public APIs & OSINT Feed
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

    // Initial Live OSINT Feed & Hotspots fetch
    getAggregatedOsintFeed().then((feed) => {
      if (mounted && feed && feed.length > 0) {
        setNewsFeed(feed);
      }
    });

    getLiveHotspots().then((hs) => {
      if (mounted && hs && hs.length > 0) {
        setLiveHotspots(hs);
      }
    });

    // 3-minute recurring refresh for live USGS quakes and OSINT dispatches
    const osintInterval = setInterval(() => {
      getAggregatedOsintFeed().then((feed) => {
        if (mounted && feed && feed.length > 0) {
          setNewsFeed(feed);
        }
      });
      getLiveHotspots().then((hs) => {
        if (mounted && hs && hs.length > 0) {
          setLiveHotspots(hs);
        }
      });
    }, 3 * 60 * 1000);

    return () => {
      mounted = false;
      clearInterval(osintInterval);
    };
  }, []);

  const handleRefreshFeed = useCallback(async () => {
    try {
      const [feed, hs] = await Promise.all([
        getAggregatedOsintFeed(),
        getLiveHotspots()
      ]);
      if (feed && feed.length > 0) setNewsFeed(feed);
      if (hs && hs.length > 0) setLiveHotspots(hs);
    } catch (e) {
      console.warn('[App] Feed refresh error:', e);
    }
  }, []);

  // Maintain clean address bar: strictly '/Dashboard' without query strings
  useEffect(() => {
    if (!isDashboard) return;

    if (window.location.pathname !== '/Dashboard' || window.location.search) {
      window.history.replaceState({}, '', '/Dashboard');
    }
  }, [isDashboard]);

  // Generate Sharable Deep Link with Full Configuration (Landmark + All Tabs + Intel Desk + Intel Workspace + Video Feeds)
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

    // 5. Selected landmark feature or country
    if (selectedFeature) {
      params.set('sf', selectedFeature.id);
    }
    if (selectedCountry) {
      params.set('sc', selectedCountry.code);
    }

    // 6. Full Workspace Configuration (All tabs, Intel Desk, Intel Workspace, video feeds, block rows)
    try {
      const fullConfigPayload = {
        tabs,
        activeTabId,
        deskWidth,
        isRightPanelOpen
      };
      const jsonStr = JSON.stringify(fullConfigPayload);
      const compressed = LZString.compressToEncodedURIComponent(jsonStr);
      params.set('cfg', compressed);
    } catch (err) {
      console.warn('Failed to compress workspace config for share link:', err);
    }

    const origin = window.location.origin;
    return `${origin}/Dashboard?${params.toString()}`;
  }, [
    mapCenter,
    mapZoom,
    currentView,
    timeRange,
    activeLayers,
    selectedFeature,
    selectedCountry,
    tabs,
    activeTabId,
    deskWidth,
    isRightPanelOpen
  ]);

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

  // Restore selected landmark feature or country from shared link (?sf=... or ?sc=...)
  useEffect(() => {
    const sfId = urlParams.get('sf');
    if (sfId) {
      const match = allFeatures.find((f) => f.id === sfId);
      if (match) setSelectedFeature(match);
    }
    const scCode = urlParams.get('sc');
    if (scCode) {
      const details = getCountryIntel(scCode);
      if (details) setSelectedCountry(details);
    }
  }, [allFeatures, urlParams]);

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

  // Theater Views Presets (Continental Matrix with Asia on top + Antarctica)
  const handleSelectView = (view: TheaterView) => {
    setCurrentView(view);
    if (view === 'global') {
      setMapCenter([30.0, 25.0]);
      setMapZoom(2.8);
    } else if (view === 'asia' || view === 'indo-pacific') {
      setMapCenter([95.0, 35.0]);
      setMapZoom(3.0);
    } else if (view === 'africa') {
      setMapCenter([20.0, 3.0]);
      setMapZoom(3.2);
    } else if (view === 'europe') {
      setMapCenter([15.0, 50.0]);
      setMapZoom(3.8);
    } else if (view === 'north-america' || view === 'americas') {
      setMapCenter([-100.0, 45.0]);
      setMapZoom(3.2);
    } else if (view === 'south-america' || view === 'latin-america') {
      setMapCenter([-60.0, -20.0]);
      setMapZoom(3.3);
    } else if (view === 'oceania') {
      setMapCenter([138.0, -25.0]);
      setMapZoom(3.5);
    } else if (view === 'antarctica') {
      setMapCenter([0.0, -82.0]);
      setMapZoom(2.6);
    } else if (view === 'india') {
      setMapCenter([86.35, 25.06]);
      setMapZoom(3.5);
    } else if (view === 'middle-east') {
      setMapCenter([48.0, 28.0]);
      setMapZoom(4.6);
    }

    const theaterRegionNameMap: Record<string, string> = {
      'asia': 'East Asia / Indo-Pacific',
      'indo-pacific': 'East Asia / Indo-Pacific',
      'africa': 'all',
      'europe': 'Europe / UK',
      'north-america': 'Americas / US',
      'americas': 'Americas / US',
      'south-america': 'Americas / US',
      'latin-america': 'Americas / US',
      'oceania': 'all',
      'antarctica': 'all',
      'india': 'India / S. Asia',
      'middle-east': 'Middle East',
      'global': 'all'
    };
    updateActiveTabIntelDesk({
      videoRegionFilter: theaterRegionNameMap[view] || 'all'
    });
  };

  const handleFocusDefault = useCallback(() => {
    setMapCenter(DEFAULT_MAP_CENTER);
    setMapZoom(DEFAULT_MAP_ZOOM);
    setCurrentView('global');
    setSelectedFeature(null);
    setSelectedCountry(null);
    if (window.location.search) {
      window.history.replaceState({}, '', '/Dashboard');
    }
  }, []);

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
      source: alert.source,
      link: alert.link
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

  if (isAuthPage) {
    return (
      <AuthPage
        onNavigateHome={handleNavigateHome}
        onNavigateDashboard={handleLaunchDashboard}
        initialMode={currentPath.toLowerCase() === '/signup' ? 'signup' : 'signin'}
      />
    );
  }

  if (currentPath.toLowerCase() === '/status') {
    return (
      <StatusDiag
        onNavigateHome={handleNavigateHome}
        onNavigateDashboard={handleLaunchDashboard}
        theme={theme}
      />
    );
  }

  if (!isDashboard) {
    return (
      <div className="w-full min-h-screen overflow-y-auto bg-[#06090e]">
        <LandingPage
          onLaunchDashboard={handleLaunchDashboard}
          onOpenAuthModal={() => handleOpenAuth('signin')}
          onNavigateLogin={() => handleNavigateLogin('signin')}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          defaultMode={authModalMode}
        />
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
          hotspots={liveHotspots}
          conflicts={CONFLICT_ZONES}
          features={allFeatures}
          theme={theme}
          onSelectFeature={handleSelectFeature}
          onSelectCountry={handleSelectCountry}
          onViewChange={(c, z) => {
            setMapCenter(c);
            setMapZoom(z);
          }}
          onFocusDefault={handleFocusDefault}
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
        isWorkspaceDrawerOpen={activeRightDrawer.isOpen}
        onToggleWorkspaceDrawer={() =>
          updateActiveTabRightDrawer({
            isOpen: !activeRightDrawer.isOpen,
            isMinimized: false
          })
        }
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onNavigateHome={handleNavigateHome}
        getShareUrl={getSharableUrl}
        coordinates={mapCenter}
        zoom={mapZoom}
        onChangeCoordinates={(coords, newZoom) => {
          setMapCenter(coords);
          if (newZoom !== undefined) {
            setMapZoom(newZoom);
          }
        }}
        alerts={filteredNewsFeed}
        onSelectAlert={handleSelectAlert}
        onOpenAuthModal={() => handleOpenAuth('signin')}
        onNavigateLogin={() => handleNavigateLogin('signin')}
        isWorkspaceSaved={isWorkspaceSaved}
        onToggleSaveWorkspace={handleToggleSaveWorkspace}
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
          theme={theme}
        />
      )}

      {/* Right: Palantir Edge-Docked Intelligence Desk (Per-Tab Isolated State) */}
      {isRightPanelOpen && (
        <div
          className="absolute z-30 flex flex-col animate-fade-in cq-panel"
          style={{
            top: '76px',
            right: activeRightDrawer.isOpen
              ? activeRightDrawer.isMinimized
                ? '36px'
                : activeRightDrawer.isWholePage
                ? '0px'
                : `${activeRightDrawer.width}px`
              : '0px',
            bottom: 0,
            width: `${deskWidth}px`,
            maxWidth: '100vw',
            background: 'var(--bg-surface)',
            borderLeft: '1px solid var(--border-medium)',
            boxShadow: theme === 'light' ? '-6px 0 20px rgba(15, 23, 42, 0.08)' : '-12px 0 24px rgba(0, 0, 0, 0.6)',
            borderRadius: 0,
            transition: isDraggingAnyResizer ? 'none' : 'right 0.28s cubic-bezier(0.16, 1, 0.3, 1), width 0.15s ease'
          }}
        >
          {/* Left-Edge Drag-Resize Handle (↔) for Intelligence Desk */}
          <div
            onMouseDown={handleStartDeskResize}
            className="absolute left-0 top-0 bottom-0 w-[6px] -translate-x-[3px] z-50 cursor-ew-resize group select-none flex items-center justify-center"
            title="Drag to resize Intelligence Desk width (280px - 680px)"
          >
            <div
              className={`w-[2px] h-full transition-all ${
                isDraggingAnyResizer
                  ? 'bg-[#38BDF8] shadow-[0_0_12px_#38BDF8]'
                  : 'bg-transparent group-hover:bg-[#38BDF8]/60 group-hover:shadow-[0_0_8px_#38BDF8]'
              }`}
            />
            <div
              className={`absolute top-1/2 -translate-y-1/2 w-3.5 h-8 rounded-full flex items-center justify-center transition-all ${
                isDraggingAnyResizer
                  ? 'bg-sky-500 text-slate-950 shadow-[0_0_12px_#38BDF8]'
                  : theme === 'light'
                  ? 'bg-white text-slate-600 border border-slate-300 shadow-sm group-hover:border-sky-500 group-hover:text-sky-600'
                  : 'bg-slate-900/95 text-slate-400 border border-slate-700/80 group-hover:border-sky-400 group-hover:text-sky-300'
              }`}
            >
              <GripVertical size={11} />
            </div>
          </div>

          <RightIntelligencePanel
            isOpen={isRightPanelOpen}
            onClose={() => setIsRightPanelOpen(false)}
            theme={theme}
            hotspots={liveHotspots}
            conflicts={CONFLICT_ZONES}
            features={allFeatures}
            news={filteredNewsFeed}
            selectedFeature={selectedFeature}
            onSelectFeature={handleSelectFeature}
            onCenterMap={(c) => {
              setMapCenter(c);
              setMapZoom(6.5);
            }}
            onOpenInWorkspace={handleOpenInWorkspace}
            onDragStartItem={() => setIsDraggingIntel(true)}
            onRefreshFeed={handleRefreshFeed}
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
        isWholePage={activeRightDrawer.isWholePage}
        onToggleWholePage={() =>
          updateActiveTabRightDrawer({ isWholePage: !activeRightDrawer.isWholePage })
        }
        width={activeRightDrawer.width}
        tabs={activeRightDrawer.drawerTabs}
        activeTabId={activeRightDrawer.activeDrawerTabId}
        theme={theme}
        onClose={() => updateActiveTabRightDrawer({ isOpen: false })}
        onToggleMinimize={() => updateActiveTabRightDrawer({ isMinimized: !activeRightDrawer.isMinimized })}
        onToggleWidth={() =>
          updateActiveTabRightDrawer({ width: activeRightDrawer.width >= 600 ? 440 : 680 })
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
        onResizeWidth={(newWidth) => updateActiveTabRightDrawer({ width: newWidth })}
        onUpdateRows={handleUpdateDrawerRows}
        onClearTab={handleClearDrawerTab}
        onCloseAllWorkspace={handleCloseAllWorkspace}
        isDraggingResizer={isDraggingAnyResizer}
        onSetDraggingResizer={setIsDraggingAnyResizer}
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
        isLight={theme === 'light'}
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

      {/* 6. Operator Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authModalMode}
      />

      {/* 7. History HUD Notification (Ctrl+Z / Ctrl+Y Feedback) */}
      {historyToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none select-none transition-all duration-300">
          <div
            className={`px-4 py-1.5 rounded-full font-mono text-[11px] font-bold tracking-wide flex items-center gap-2 shadow-2xl backdrop-blur-md border ${
              theme === 'light'
                ? 'bg-slate-900/90 text-white border-slate-700 shadow-slate-900/25'
                : 'bg-[#0A101D]/90 text-sky-400 border-sky-500/40 shadow-[0_0_20px_rgba(56,189,248,0.3)]'
            }`}
          >
            <span>{historyToast}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => (
  <AuthProvider>
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  </AuthProvider>
);

export default App;
