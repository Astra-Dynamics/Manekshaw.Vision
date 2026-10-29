import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Compass } from 'lucide-react';
import {
  LayerKey,
  MapFeatureItem,
  IntelHotspot,
  ConflictZoneFeature,
  StrategicFeature,
  ThemeMode
} from '../types';
import { INDIA_OFFICIAL_BOUNDARY } from '../data/indiaOfficialBoundary';
import { ADIZ_ZONES } from '../data/adizZones';
import { GPS_JAMMING_ZONES } from '../data/gpsJamming';
import { FORTIFIED_BORDERS } from '../data/fortifiedBorders';
import { getFlagEmoji } from '../data/countryIntel';
import { getLayerColor, getHotspotEscalationColor } from '../utils/categoryColors';


interface MapComponentProps {
  center: [number, number]; // [lon, lat]
  zoom: number;
  activeLayers: Record<LayerKey, boolean>;
  hotspots: IntelHotspot[];
  conflicts: ConflictZoneFeature[];
  features: MapFeatureItem[];
  theme?: ThemeMode;
  onSelectFeature: (feature: StrategicFeature) => void;
  onSelectCountry?: (country: { code: string; name: string }) => void;
  onViewChange: (center: [number, number], zoom: number) => void;
  onFocusDefault?: () => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  center,
  zoom,
  activeLayers,
  hotspots,
  conflicts,
  features,
  theme = 'dark',
  onSelectFeature,
  onSelectCountry,
  onViewChange,
  onFocusDefault
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const cameraTargetRef = useRef<{ center: [number, number]; zoom: number } | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3D, setIs3D] = useState(false);

  // Tactical Warm Light Blueprint / Daylight Cartographic Palette for Light Mode ONLY
  const applyLightModeBasemapStyling = (map: maplibregl.Map) => {
    try {
      // 1. Background & Landcover / Parks
      if (map.getLayer('background')) {
        map.setPaintProperty('background', 'background-color', '#F3F1EA');
      }
      const parkFillLayers = [
        'landcover',
        'park_national_park',
        'park_nature_reserve',
        'landuse',
        'poi_park'
      ];
      parkFillLayers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, 'fill-color', '#EAECDD');
        }
      });
      if (map.getLayer('landuse_residential')) {
        map.setPaintProperty('landuse_residential', 'fill-color', '#F3F1EA');
      }
      if (map.getLayer('building')) {
        map.setPaintProperty('building', 'fill-color', '#EAE7DC');
      }
      if (map.getLayer('building-top')) {
        map.setPaintProperty('building-top', 'fill-color', '#E6E3D7');
      }

      // 2. Water & Waterways
      if (map.getLayer('water')) {
        map.setPaintProperty('water', 'fill-color', '#D4E0E6');
      }
      if (map.getLayer('waterway')) {
        map.setPaintProperty('waterway', 'line-color', '#D4E0E6');
      }
      if (map.getLayer('water_shadow')) {
        map.setLayoutProperty('water_shadow', 'visibility', 'none');
      }

      // 3. Roads, Bridges, Tunnels, Rails & Aeroways
      // Hidden or faint #E6E3D7 at low zoom
      const roadLineLayers = [
        'tunnel_service_case', 'tunnel_minor_case', 'tunnel_sec_case', 'tunnel_pri_case',
        'tunnel_trunk_case', 'tunnel_mot_case', 'tunnel_path',
        'tunnel_service_fill', 'tunnel_minor_fill', 'tunnel_sec_fill', 'tunnel_pri_fill',
        'tunnel_trunk_fill', 'tunnel_mot_fill', 'tunnel_rail', 'tunnel_rail_dash',
        'road_service_case', 'road_minor_case', 'road_pri_case_ramp', 'road_trunk_case_ramp',
        'road_mot_case_ramp', 'road_sec_case_noramp', 'road_pri_case_noramp',
        'road_trunk_case_noramp', 'road_mot_case_noramp', 'road_path', 'road_path_areas',
        'road_service_fill', 'road_minor_fill', 'road_pri_fill_ramp', 'road_trunk_fill_ramp',
        'road_mot_fill_ramp', 'road_sec_fill_noramp', 'road_pri_fill_noramp',
        'road_trunk_fill_noramp', 'road_mot_fill_noramp',
        'rail', 'rail_dash',
        'bridge_service_case', 'bridge_minor_case', 'bridge_sec_case', 'bridge_pri_case',
        'bridge_trunk_case', 'bridge_mot_case', 'bridge_path',
        'bridge_service_fill', 'bridge_minor_fill', 'bridge_sec_fill', 'bridge_pri_fill',
        'bridge_trunk_fill', 'bridge_mot_fill',
        'aeroway-runway', 'aeroway-taxiway'
      ];
      roadLineLayers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, 'line-color', '#E6E3D7');
          map.setPaintProperty(layerId, 'line-opacity', [
            'interpolate', ['linear'], ['zoom'],
            4, 0.0,
            7, 0.45,
            12, 0.95
          ]);
        }
      });

      // 4. Country & Disputed Boundaries
      if (map.getLayer('boundary_country_inner')) {
        map.setPaintProperty('boundary_country_inner', 'line-color', '#9C968A');
        map.setPaintProperty('boundary_country_inner', 'line-width', [
          'interpolate', ['linear'], ['zoom'],
          2, 0.8,
          5, 1.3
        ]);
      }
      if (map.getLayer('boundary_country_outline')) {
        map.setLayoutProperty('boundary_country_outline', 'visibility', 'none');
      }
      if (map.getLayer('boundary_county')) {
        map.setPaintProperty('boundary_county', 'line-color', '#B0A99B');
        map.setPaintProperty('boundary_county', 'line-dasharray', [3, 2]);
        map.setPaintProperty('boundary_county', 'line-width', 0.5);
      }

      // 5. Admin-1 / State Boundaries (line-color #D3CEBF, line-width 0.5, visible from zoom 4 only)
      if (map.getLayer('boundary_state')) {
        map.setPaintProperty('boundary_state', 'line-color', '#D3CEBF');
        map.setPaintProperty('boundary_state', 'line-width', 0.5);
        map.setLayoutProperty('boundary_state', 'visibility', 'visible');
      }

      // 6. Country Labels
      const countryLabelLayers = ['place_country_1', 'place_country_2', 'place_continent'];
      countryLabelLayers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, 'text-color', '#6F6A5E');
          map.setPaintProperty(layerId, 'text-halo-color', '#F3F1EA');
          map.setPaintProperty(layerId, 'text-halo-width', 1.5);
        }
      });
      if (map.getLayer('place_state')) {
        map.setPaintProperty('place_state', 'text-color', '#75746E');
        map.setPaintProperty('place_state', 'text-halo-color', '#F3F1EA');
        map.setPaintProperty('place_state', 'text-halo-width', 1.5);
      }

      // 7. City & Settlement Labels
      const cityLabelLayers = [
        'place_city_r6', 'place_city_r5', 'place_city_dot_r7', 'place_city_dot_r4',
        'place_city_dot_r2', 'place_city_dot_z7', 'place_capital_dot_z7',
        'place_town', 'place_villages', 'place_suburbs', 'place_hamlet'
      ];
      cityLabelLayers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, 'text-color', '#4A463E');
          map.setPaintProperty(layerId, 'text-halo-color', '#F3F1EA');
          map.setPaintProperty(layerId, 'text-halo-width', 1.5);
          try {
            map.setPaintProperty(layerId, 'icon-color', '#4A463E');
          } catch {
            // Some symbol layers do not have an icon
          }
        }
      });

      // 8. Water Labels (text-color #7F9AA6, font italic, halo #D4E0E6 1.0)
      const waterLabelLayers = [
        'watername_ocean', 'watername_sea', 'watername_lake',
        'watername_lake_pois', 'watername_lake_line', 'waterway_label'
      ];
      waterLabelLayers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, 'text-color', '#7F9AA6');
          map.setPaintProperty(layerId, 'text-halo-color', '#D4E0E6');
          map.setPaintProperty(layerId, 'text-halo-width', 1.0);
        }
      });

      // 9. Road Name Labels
      const roadNameLayers = ['roadname_minor', 'roadname_sec', 'roadname_pri', 'roadname_major'];
      roadNameLayers.forEach((layerId) => {
        if (map.getLayer(layerId)) {
          map.setPaintProperty(layerId, 'text-color', '#75746E');
          map.setPaintProperty(layerId, 'text-halo-color', '#F3F1EA');
          map.setPaintProperty(layerId, 'text-halo-width', 1.0);
        }
      });
    } catch (e) {
      console.warn('Could not apply light mode basemap styling:', e);
    }
  };


  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialStyle = theme === 'light'
      ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: initialStyle,
      center: center,
      zoom: zoom,
      pitch: 25,
      bearing: 0,
      maxZoom: 18,
      minZoom: 1.5,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.ScaleControl({ unit: 'metric' }), 'bottom-left');

    const popup = new maplibregl.Popup({
      closeButton: false,
      closeOnClick: false,
      offset: 12
    });
    popupRef.current = popup;

    map.on('load', () => {
      if (theme === 'light') {
        applyLightModeBasemapStyling(map);
      }
      setMapLoaded(true);
      map.resize();
    });

    const resizeObserver = new ResizeObserver(() => {
      map.resize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    map.on('moveend', () => {
      cameraTargetRef.current = null;
      const c = map.getCenter();
      const z = map.getZoom();
      onViewChange([c.lng, c.lat], z);
    });

    mapRef.current = map;

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Center / Zoom sync
  useEffect(() => {
    if (!mapRef.current) return;
    const currentCenter = mapRef.current.getCenter();
    const currentZoom = mapRef.current.getZoom();

    // If camera is already flying to this exact coordinate target, don't interrupt
    if (cameraTargetRef.current) {
      const targetDist = Math.hypot(
        cameraTargetRef.current.center[0] - center[0],
        cameraTargetRef.current.center[1] - center[1]
      );
      const targetZoomDiff = Math.abs(cameraTargetRef.current.zoom - zoom);
      if (targetDist < 0.001 && targetZoomDiff < 0.05) {
        return;
      }
    }

    const dist = Math.hypot(currentCenter.lng - center[0], currentCenter.lat - center[1]);
    const zoomDiff = Math.abs(currentZoom - zoom);

    if (dist > 0.001 || zoomDiff > 0.05) {
      cameraTargetRef.current = { center: [center[0], center[1]], zoom };
      mapRef.current.flyTo({
        center: center,
        zoom: zoom,
        speed: 1.2,
        curve: 1.4,
        essential: true
      });
    }
  }, [center, zoom]);

  // Theme Switching (Carto Dark Matter vs Positron)
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const targetStyle = theme === 'light'
      ? 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json'
      : 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

    setMapLoaded(false);
    map.setStyle(targetStyle);
    map.once('style.load', () => {
      if (theme === 'light') {
        applyLightModeBasemapStyling(map);
      }
      setMapLoaded(true);
    });
  }, [theme]);

  // Floating Control Handlers
  const handleToggle3D = () => {
    if (!mapRef.current) return;
    const nextPitch = is3D ? 0 : 45;
    mapRef.current.easeTo({ pitch: nextPitch, duration: 800 });
    setIs3D(!is3D);
  };

  const handleZoomIn = () => {
    mapRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapRef.current?.zoomOut();
  };

  const handleResetNorth = () => {
    mapRef.current?.resetNorthPitch({ duration: 600 });
    setIs3D(false);
  };

  const handleFocusIndia = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const map = mapRef.current;
    if (!map) return;

    setIs3D(false);
    popupRef.current?.remove();

    cameraTargetRef.current = { center: [86.35, 25.06], zoom: 3.5 };
    map.flyTo({
      center: [86.35, 25.06],
      zoom: 3.5,
      pitch: 25,
      bearing: 0,
      speed: 1.2,
      curve: 1.4,
      essential: true
    });

    onFocusDefault?.();
    onViewChange([86.35, 25.06], 3.5);
  };

  // Update GeoJSON Sources and Layers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !mapLoaded) return;

    // Global Interactive Country Boundaries (Every Country Clickable & Hoverable)
    if (!map.getSource('country-boundaries')) {
      map.addSource('country-boundaries', {
        type: 'geojson',
        data: '/data/countries.geojson'
      });

      // Transparent interactive polygon layer to detect clicks and hovers across all nations
      map.addLayer({
        id: 'country-interactive',
        type: 'fill',
        source: 'country-boundaries',
        paint: {
          'fill-color': '#38bdf8',
          'fill-opacity': 0.001
        }
      });

      // Hover fill
      map.addLayer({
        id: 'country-hover-fill',
        type: 'fill',
        source: 'country-boundaries',
        paint: {
          'fill-color': '#38bdf8',
          'fill-opacity': 0.09
        },
        filter: ['==', ['get', 'ISO3166-1-Alpha-2'], '']
      });

      // Hover border highlight
      map.addLayer({
        id: 'country-hover-border',
        type: 'line',
        source: 'country-boundaries',
        paint: {
          'line-color': theme === 'light' ? '#C6613F' : '#38bdf8',
          'line-width': 1.6,
          'line-opacity': 0.85
        },
        filter: ['==', ['get', 'ISO3166-1-Alpha-2'], '']
      });
    }

    const isLight = theme === 'light';

    // Official Sovereign Boundary of India (Survey of India)
    // Depicting Jammu & Kashmir, Ladakh (including PoK, Gilgit-Baltistan & Aksai Chin) as integral sovereign parts of India
    if (!map.getSource('india-soi-source')) {
      map.addSource('india-soi-source', {
        type: 'geojson',
        data: INDIA_OFFICIAL_BOUNDARY
      });

      // Subtle sovereign territory fill
      map.addLayer({
        id: 'india-soi-fill',
        type: 'fill',
        source: 'india-soi-source',
        paint: {
          'fill-color': isLight ? '#2F6F8F' : '#0ea5e9',
          'fill-opacity': isLight ? 0.06 : 0.05
        }
      });

      // Outer boundary glow
      map.addLayer({
        id: 'india-soi-glow',
        type: 'line',
        source: 'india-soi-source',
        paint: {
          'line-color': isLight ? '#2F6F8F' : '#38bdf8',
          'line-width': isLight ? 2 : 5,
          'line-blur': isLight ? 1 : 3,
          'line-opacity': isLight ? 0.15 : 0.6
        }
      });

      // Crisp solid sovereign border line
      map.addLayer({
        id: 'india-soi-line',
        type: 'line',
        source: 'india-soi-source',
        paint: {
          'line-color': isLight ? '#2F6F8F' : '#38bdf8',
          'line-width': isLight ? 1.5 : 2.2,
          'line-opacity': 0.95
        }
      });

      // Official Northern Territory Labels (J&K, Ladakh, Aksai Chin)
      const northernTerritoriesGeoJson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [75.1, 33.9] },
            properties: { label: 'JAMMU & KASHMIR' }
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.5, 34.2] },
            properties: { label: 'LADAKH' }
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [79.2, 35.1] },
            properties: { label: 'AKSAI CHIN (LADAKH)' }
          },
          {
            type: 'Feature',
            geometry: { type: 'Point', coordinates: [77.1, 35.5] },
            properties: { label: 'SIACHEN GLACIER' }
          }
        ]
      };

      map.addSource('india-territories-source', {
        type: 'geojson',
        data: northernTerritoriesGeoJson
      });

      map.addLayer({
        id: 'india-territories-labels',
        type: 'symbol',
        source: 'india-territories-source',
        minzoom: 3.5,
        layout: {
          'text-field': ['get', 'label'],
          'text-font': ['Open Sans Semibold'],
          'text-size': 11,
          'text-letter-spacing': 0.08,
          'text-transform': 'uppercase'
        },
        paint: {
          'text-color': isLight ? '#2F6F8F' : '#7dd3fc',
          'text-halo-color': isLight ? '#F3F1EA' : '#020617',
          'text-halo-width': isLight ? 1.5 : 2
        }
      });
    }


    // 1. Conflict Polygons Source
    const conflictGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: conflicts.map((c) => ({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [c.coords]
        },
        properties: {
          id: c.id,
          name: c.name,
          intensity: c.intensity,
          parties: c.parties.join(', '),
          casualties: c.casualties || '',
          description: c.description
        }
      }))
    };

    if (map.getSource('conflicts-source')) {
      (map.getSource('conflicts-source') as maplibregl.GeoJSONSource).setData(conflictGeoJson);
    } else {
      map.addSource('conflicts-source', {
        type: 'geojson',
        data: conflictGeoJson
      });

      map.addLayer({
        id: 'conflicts-fill',
        type: 'fill',
        source: 'conflicts-source',
        paint: {
          'fill-color': isLight ? '#B42318' : '#dc2626',
          'fill-opacity': isLight ? 0.10 : 0.18
        }
      });

      map.addLayer({
        id: 'conflicts-outline',
        type: 'line',
        source: 'conflicts-source',
        paint: isLight
          ? {
              'line-color': '#B42318',
              'line-width': 1.25,
              'line-dasharray': [2, 2],
              'line-opacity': 0.75
            }
          : {
              'line-color': '#ef4444',
              'line-width': 2,
              'line-dasharray': [2, 2]
            }
      });
    }


    // Toggle Conflict layer visibility
    const conflictVis = activeLayers.conflicts ? 'visible' : 'none';
    if (map.getLayer('conflicts-fill')) map.setLayoutProperty('conflicts-fill', 'visibility', conflictVis);
    if (map.getLayer('conflicts-outline')) map.setLayoutProperty('conflicts-outline', 'visibility', conflictVis);

    // 1b. Air Defense Identification Zones (ADIZ)
    const adizGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: ADIZ_ZONES.map((a) => ({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [a.coords]
        },
        properties: {
          id: a.id,
          name: a.name,
          country: a.country,
          authority: a.authority,
          alertLevel: a.alertLevel,
          rules: a.rules,
          description: a.description,
          color: a.color
        }
      }))
    };

    if (map.getSource('adiz-source')) {
      (map.getSource('adiz-source') as maplibregl.GeoJSONSource).setData(adizGeoJson);
    } else {
      map.addSource('adiz-source', {
        type: 'geojson',
        data: adizGeoJson
      });

      map.addLayer({
        id: 'adiz-fill',
        type: 'fill',
        source: 'adiz-source',
        paint: {
          'fill-color': isLight ? '#5B5BA6' : ['get', 'color'],
          'fill-opacity': 0.08
        }
      });

      map.addLayer({
        id: 'adiz-line',
        type: 'line',
        source: 'adiz-source',
        paint: {
          'line-color': isLight ? '#5B5BA6' : ['get', 'color'],
          'line-width': isLight ? 1.25 : 2,
          'line-dasharray': [4, 2],
          'line-opacity': isLight ? 0.75 : 0.85
        }
      });
    }


    const adizVis = activeLayers.adizZones ? 'visible' : 'none';
    if (map.getLayer('adiz-fill')) map.setLayoutProperty('adiz-fill', 'visibility', adizVis);
    if (map.getLayer('adiz-line')) map.setLayoutProperty('adiz-line', 'visibility', adizVis);

    // 1c. Electronic Warfare & GPS Jamming Zones
    const gpsJammingGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: GPS_JAMMING_ZONES.map((j) => ({
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [j.coords]
        },
        properties: {
          id: j.id,
          name: j.name,
          region: j.region,
          intensity: j.intensity,
          attenuationPercent: j.attenuationPercent,
          frequencies: j.frequencies.join(', '),
          systemsDetected: j.systemsDetected.join(', '),
          advisory: j.advisory,
          description: j.advisory,
          color: j.intensity === 'critical' ? '#06b6d4' : '#0891b2'
        }
      }))
    };

    if (map.getSource('gps-jamming-source')) {
      (map.getSource('gps-jamming-source') as maplibregl.GeoJSONSource).setData(gpsJammingGeoJson);
    } else {
      map.addSource('gps-jamming-source', {
        type: 'geojson',
        data: gpsJammingGeoJson
      });

      map.addLayer({
        id: 'gps-jamming-fill',
        type: 'fill',
        source: 'gps-jamming-source',
        paint: {
          'fill-color': isLight ? '#0E7490' : '#06b6d4',
          'fill-opacity': isLight ? 0.08 : 0.16
        }
      });

      map.addLayer({
        id: 'gps-jamming-outline',
        type: 'line',
        source: 'gps-jamming-source',
        paint: {
          'line-color': isLight ? '#0E7490' : '#22d3ee',
          'line-width': isLight ? 1.25 : 2,
          'line-dasharray': [2, 2],
          'line-opacity': isLight ? 0.75 : 0.95
        }
      });
    }

    const gpsVis = activeLayers.gpsJamming ? 'visible' : 'none';
    if (map.getLayer('gps-jamming-fill')) map.setLayoutProperty('gps-jamming-fill', 'visibility', gpsVis);
    if (map.getLayer('gps-jamming-outline')) map.setLayoutProperty('gps-jamming-outline', 'visibility', gpsVis);

    // 1d. Fortified Frontlines & Border Demarcations
    const fortifiedBordersGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: FORTIFIED_BORDERS.map((b) => ({
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: b.coords
        },
        properties: {
          id: b.id,
          name: b.name,
          theater: b.theater,
          lengthKm: b.lengthKm,
          status: b.status,
          forces: b.forces.join(', '),
          description: b.description,
          color: b.color
        }
      }))
    };

    if (map.getSource('fortified-borders-source')) {
      (map.getSource('fortified-borders-source') as maplibregl.GeoJSONSource).setData(fortifiedBordersGeoJson);
    } else {
      map.addSource('fortified-borders-source', {
        type: 'geojson',
        data: fortifiedBordersGeoJson
      });

      map.addLayer({
        id: 'fortified-borders-glow',
        type: 'line',
        source: 'fortified-borders-source',
        paint: {
          'line-color': isLight ? '#9F1D35' : ['get', 'color'],
          'line-width': isLight ? 3 : 5,
          'line-blur': isLight ? 1.5 : 2.5,
          'line-opacity': isLight ? 0.25 : 0.5
        }
      });

      map.addLayer({
        id: 'fortified-borders-line',
        type: 'line',
        source: 'fortified-borders-source',
        paint: {
          'line-color': isLight ? '#9F1D35' : ['get', 'color'],
          'line-width': isLight ? 1.5 : 2.4,
          'line-dasharray': [3, 1.5],
          'line-opacity': isLight ? 0.85 : 0.95
        }
      });
    }


    const bordersVis = activeLayers.fortifiedBorders ? 'visible' : 'none';
    if (map.getLayer('fortified-borders-glow')) map.setLayoutProperty('fortified-borders-glow', 'visibility', bordersVis);
    if (map.getLayer('fortified-borders-line')) map.setLayoutProperty('fortified-borders-line', 'visibility', bordersVis);

    // Ensure Survey of India Sovereign Boundary stays topmost
    const beforePointsLayer = map.getLayer('points-halo') ? 'points-halo' : undefined;
    if (map.getLayer('india-soi-fill')) map.moveLayer('india-soi-fill', beforePointsLayer);
    if (map.getLayer('india-soi-glow')) map.moveLayer('india-soi-glow', beforePointsLayer);
    if (map.getLayer('india-soi-line')) map.moveLayer('india-soi-line', beforePointsLayer);


    // 2. Point Features Source (Hotspots + other 12 layers)
    const allPointFeatures: GeoJSON.Feature[] = [];

    // Add hotspots
    if (activeLayers.hotspots) {
      hotspots.forEach((h) => {
        let hotColor = isLight
          ? getHotspotEscalationColor(h.escalationScore, 'light')
          : (h.escalationScore >= 5 ? '#ef4444' : h.escalationScore >= 4 ? '#f97316' : '#eab308');

        allPointFeatures.push({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: h.coordinates
          },
          properties: {
            id: h.id,
            layer: 'hotspots',
            name: h.name,
            score: h.escalationScore,
            trend: h.escalationTrend,
            description: h.description,
            whyItMatters: h.whyItMatters,
            color: hotColor
          }
        });
      });
    }

    // Add features from other active layers
    features.forEach((feat) => {
      if (!activeLayers[feat.layer]) return;
      if (isLight && feat.layer === 'natural') {
        // Natural features handled via dedicated natural-source in light mode
        return;
      }

      let color = isLight ? getLayerColor(feat.layer, 'light') : '#38bdf8';
      if (feat.layer === 'iranAttacks') color = isLight ? getLayerColor('iranAttacks', 'light') : '#ef4444';
      else if (feat.layer === 'bases') color = isLight ? getLayerColor('bases', 'light') : '#3b82f6';
      else if (feat.layer === 'nuclear') color = isLight ? getLayerColor('nuclear', 'light') : '#eab308';
      else if (feat.layer === 'military') color = isLight ? getLayerColor('military', 'light') : '#06b6d4';
      else if (feat.layer === 'weather') color = isLight ? getLayerColor('weather', 'light') : '#60a5fa';
      else if (feat.layer === 'canadaAlerts') color = isLight ? getLayerColor('canadaAlerts', 'light') : '#f43f5e';
      else if (feat.layer === 'outages') color = isLight ? getLayerColor('outages', 'light') : '#a855f7';
      else if (feat.layer === 'natural') color = isLight ? getLayerColor('natural', 'light') : '#ea580c';
      else if (feat.layer === 'waterways') color = isLight ? getLayerColor('waterways', 'light') : '#14b8a6';
      else if (feat.layer === 'economic') color = isLight ? getLayerColor('economic', 'light') : '#10b981';
      else if (feat.layer === 'sanctions') color = isLight ? getLayerColor('sanctions', 'light') : '#ec4899';
      else if (feat.layer === 'gpsJamming') color = isLight ? getLayerColor('gpsJamming', 'light') : '#06b6d4';

      allPointFeatures.push({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: feat.coordinates
        },
        properties: {
          id: feat.id,
          layer: feat.layer,
          name: feat.name,
          category: feat.category || '',
          severity: feat.severity || 'info',
          status: feat.status || '',
          description: feat.description,
          color: color,
          details: JSON.stringify(feat.details || {})
        }
      });
    });

    // Severity Z-Ordering: critical severity renders above low severity
    const SEVERITY_ORDER: Record<string, number> = {
      info: 1,
      low: 1,
      medium: 2,
      high: 3,
      critical: 4
    };
    allPointFeatures.sort((a, b) => {
      const sevA = SEVERITY_ORDER[(a.properties?.severity as string) || 'info'] || 1;
      const sevB = SEVERITY_ORDER[(b.properties?.severity as string) || 'info'] || 1;
      const scoreA = (a.properties?.score as number) || sevA;
      const scoreB = (b.properties?.score as number) || sevB;
      return scoreA - scoreB;
    });

    const pointsGeoJson: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: allPointFeatures
    };

    if (map.getSource('points-source')) {
      (map.getSource('points-source') as maplibregl.GeoJSONSource).setData(pointsGeoJson);
    } else {
      map.addSource('points-source', {
        type: 'geojson',
        data: pointsGeoJson
      });

      // Outer glowing halo (soft shadow in light mode, halo in dark mode)
      map.addLayer({
        id: 'points-halo',
        type: 'circle',
        source: 'points-source',
        paint: isLight
          ? {
              'circle-radius': [
                'case',
                ['boolean', ['feature-state', 'selected'], false], 11,
                ['boolean', ['feature-state', 'hover'], false], 10,
                7
              ],
              'circle-color': 'rgba(31, 30, 29, 0.30)',
              'circle-opacity': [
                'case',
                [
                  'all',
                  ['in', ['get', 'layer'], ['literal', ['weather', 'outages', 'canadaAlerts', 'economic', 'sanctions']]],
                  ['<', ['zoom'], 3.0]
                ],
                0.0,
                0.8
              ],
              'circle-stroke-width': 0,
              'circle-stroke-color': ['get', 'color'],
              'circle-stroke-opacity': 0
            }
          : {
              'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                2, 6,
                8, 14
              ],
              'circle-color': ['get', 'color'],
              'circle-opacity': 0.25,
              'circle-stroke-width': 1,
              'circle-stroke-color': ['get', 'color'],
              'circle-stroke-opacity': 0.5
            }
      });

      // Inner solid tactical dot (2px white ring, radius 5 default / 8 hover / 9 selected in light mode)
      map.addLayer({
        id: 'points-core',
        type: 'circle',
        source: 'points-source',
        paint: isLight
          ? {
              'circle-radius': [
                'case',
                ['boolean', ['feature-state', 'selected'], false], 9,
                ['boolean', ['feature-state', 'hover'], false], 8,
                5
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-width': 2,
              'circle-stroke-color': '#FFFFFF'
            }
          : {
              'circle-radius': [
                'interpolate', ['linear'], ['zoom'],
                2, 3.5,
                8, 6.5
              ],
              'circle-color': ['get', 'color'],
              'circle-stroke-width': 1.5,
              'circle-stroke-color': '#0c1017'
            }
      });

      // Marker labels on zoom >= 4
      map.addLayer({
        id: 'points-label',
        type: 'symbol',
        source: 'points-source',
        minzoom: 4,
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Semibold'],
          'text-size': 11,
          'text-offset': [0, 1.2],
          'text-anchor': 'top',
          'text-max-width': 14
        },
        paint: {
          'text-color': isLight ? '#1F1E1D' : '#f8fafc',
          'text-halo-color': isLight ? '#F3F1EA' : '#020617',
          'text-halo-width': 1.5
        }
      });

      // Mouse interactions
      const handleMouseEnter = (e: maplibregl.MapMouseEvent & { features?: maplibregl.MapGeoJSONFeature[] }) => {
        map.getCanvas().style.cursor = 'pointer';
        if (!e.features || e.features.length === 0 || !popupRef.current) return;

        const f = e.features[0];
        const geom = f.geometry as GeoJSON.Point;
        const p = f.properties;

        const html = isLight
          ? `
            <div style="font-family: 'Inter', -apple-system, sans-serif; font-size: 11px; padding: 2px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; border-bottom: 1px solid #E8E6DC; padding-bottom: 4px;">
                <span style="color: ${p.color}; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">
                  ${p.layer}
                </span>
                ${p.score ? `<span style="background: #F6E3DA; color: #A6492A; border: 1px solid rgba(198,97,63,0.3); padding: 1px 5px; border-radius: 4px; font-weight: 700; font-size: 9.5px;">LEVEL ${p.score}</span>` : ''}
              </div>
              <div style="font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; color: #1F1E1D; font-size: 13px; margin-bottom: 4px; line-height: 1.3;">
                ${p.name}
              </div>
              <div style="color: #5E5D59; font-size: 11px; line-height: 1.4;">
                ${p.description ? p.description.slice(0, 115) + '...' : ''}
              </div>
            </div>
          `
          : `
            <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; padding: 2px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 5px; border-bottom: 1px solid rgba(255,255,255,0.08); padding-bottom: 4px;">
                <span style="color: ${p.color}; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">
                  ${p.layer}
                </span>
                ${p.score ? `<span style="background: rgba(244,63,94,0.15); color: #f43f5e; border: 1px solid rgba(244,63,94,0.3); padding: 1px 5px; border-radius: 3px; font-weight: 700; font-size: 9.5px;">LEVEL ${p.score}</span>` : ''}
              </div>
              <div style="font-weight: 700; color: #f8fafc; font-size: 12px; margin-bottom: 4px; line-height: 1.3;">
                ${p.name}
              </div>
              <div style="color: #94a3b8; font-size: 10px; line-height: 1.4; font-family: 'Inter', sans-serif;">
                ${p.description ? p.description.slice(0, 115) + '...' : ''}
              </div>
            </div>
          `;

        popupRef.current.setLngLat(geom.coordinates as [number, number]).setHTML(html).addTo(map);
      };


      const handleMouseLeave = () => {
        map.getCanvas().style.cursor = '';
        if (popupRef.current) popupRef.current.remove();
      };

      map.on('mouseenter', 'points-core', handleMouseEnter);
      map.on('mouseleave', 'points-core', handleMouseLeave);

      // Click on point
      map.on('click', 'points-core', (e) => {
        if (!e.features || e.features.length === 0) return;
        const p = e.features[0].properties;

        // Find the original item
        if (p.layer === 'hotspots') {
          const match = hotspots.find((h) => h.id === p.id);
          if (match) onSelectFeature(match);
        } else {
          const match = features.find((f) => f.id === p.id);
          if (match) onSelectFeature(match);
        }
      });

      // Click on conflict polygons
      map.on('click', 'conflicts-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const p = e.features[0].properties;
        const match = conflicts.find((c) => c.id === p.id);
        if (match) onSelectFeature(match);
      });

      // Click on ADIZ polygons
      map.on('click', 'adiz-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const p = e.features[0].properties;
        const match = ADIZ_ZONES.find((a) => a.id === p.id);
        if (match) onSelectFeature(match);
      });

      // Click on GPS Jamming polygons
      map.on('click', 'gps-jamming-fill', (e) => {
        if (!e.features || e.features.length === 0) return;
        const p = e.features[0].properties;
        const match = GPS_JAMMING_ZONES.find((j) => j.id === p.id);
        if (match) onSelectFeature(match);
      });

      // Click on Fortified Borders
      map.on('click', 'fortified-borders-line', (e) => {
        if (!e.features || e.features.length === 0) return;
        const p = e.features[0].properties;
        const match = FORTIFIED_BORDERS.find((b) => b.id === p.id);
        if (match) onSelectFeature(match);
      });

      // Pointer cursor on tactical defense layers
      ['conflicts-fill', 'adiz-fill', 'gps-jamming-fill', 'fortified-borders-line'].forEach((layerId) => {
        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = '';
        });
      });

      // Hover on Country
      map.on('mousemove', 'country-interactive', (e) => {
        // If hovering over a point marker or conflict, don't show country hover
        const pointHover = map.queryRenderedFeatures(e.point, { layers: ['points-core'] });
        if (pointHover && pointHover.length > 0) {
          map.setFilter('country-hover-fill', ['==', ['get', 'ISO3166-1-Alpha-2'], '']);
          map.setFilter('country-hover-border', ['==', ['get', 'ISO3166-1-Alpha-2'], '']);
          return;
        }

        if (!e.features || e.features.length === 0) return;
        const props = e.features[0].properties;
        const code = props['ISO3166-1-Alpha-2'];
        const name = props['name'];

        if (code) {
          map.setFilter('country-hover-fill', ['==', ['get', 'ISO3166-1-Alpha-2'], code]);
          map.setFilter('country-hover-border', ['==', ['get', 'ISO3166-1-Alpha-2'], code]);
          map.getCanvas().style.cursor = 'pointer';

          const flag = getFlagEmoji(code);
          const html = isLight
            ? `
              <div style="font-family: 'Inter', -apple-system, sans-serif; font-size: 11px;">
                <div style="display: flex; align-items: center; gap: 6px; font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; color: #1F1E1D; font-size: 13px;">
                  <span>${flag}</span> <span>${name}</span> <span style="font-size: 10px; color: #A6492A; background: #F6E3DA; padding: 1px 4px; border-radius: 3px; font-family: 'Inter', sans-serif; font-weight: 600;">${code}</span>
                </div>
                <div style="color: #5E5D59; font-size: 10px; margin-top: 3px;">
                  Click to open Country Intelligence Dossier
                </div>
              </div>
            `
            : `
              <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px;">
                <div style="display: flex; align-items: center; gap: 6px; font-weight: 700; color: #f1f5f9; font-size: 13px;">
                  <span>${flag}</span> <span>${name}</span> <span style="font-size: 10px; color: #38bdf8; background: rgba(56,189,248,0.15); padding: 1px 4px; border-radius: 3px;">${code}</span>
                </div>
                <div style="color: #94a3b8; font-size: 10px; margin-top: 3px;">
                  Click to open Country Intelligence Dossier
                </div>
              </div>
            `;

          if (popupRef.current) {
            popupRef.current.setLngLat(e.lngLat).setHTML(html).addTo(map);
          }
        }
      });

      map.on('mouseleave', 'country-interactive', () => {
        map.setFilter('country-hover-fill', ['==', ['get', 'ISO3166-1-Alpha-2'], '']);
        map.setFilter('country-hover-border', ['==', ['get', 'ISO3166-1-Alpha-2'], '']);
        map.getCanvas().style.cursor = '';
        if (popupRef.current) popupRef.current.remove();
      });

      // Click on Country (Opens World Monitor Country Intelligence Dossier)
      map.on('click', 'country-interactive', (e) => {
        // If a point marker, conflict, ADIZ, or defense zone was clicked, ignore country click
        const pointFeatures = map.queryRenderedFeatures(e.point, {
          layers: ['points-core', 'conflicts-fill', 'adiz-fill', 'gps-jamming-fill', 'fortified-borders-line']
        });
        if (pointFeatures && pointFeatures.length > 0) return;

        if (!e.features || e.features.length === 0) return;
        const props = e.features[0].properties;
        const code = props['ISO3166-1-Alpha-2'];
        const name = props['name'];
        if (code && onSelectCountry) {
          onSelectCountry({ code, name });
        }
      });
    }

    // 2b. Clustered Earthquakes & Volcanoes in Light Mode
    if (isLight) {
      const naturalFeatures: GeoJSON.Feature[] = [];
      if (activeLayers.natural) {
        features.forEach((feat) => {
          if (feat.layer !== 'natural') return;
          const mag = Number(feat.details?.magnitude || 4.5);
          naturalFeatures.push({
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: feat.coordinates
            },
            properties: {
              id: feat.id,
              layer: 'natural',
              name: feat.name,
              category: feat.category || 'Seismic / Natural Event',
              severity: feat.severity || 'info',
              magnitude: mag,
              color: '#8A6D3B',
              description: feat.description,
              details: JSON.stringify(feat.details || {})
            }
          });
        });
      }

      const naturalGeoJson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: naturalFeatures
      };

      if (map.getSource('natural-source')) {
        (map.getSource('natural-source') as maplibregl.GeoJSONSource).setData(naturalGeoJson);
      } else {
        map.addSource('natural-source', {
          type: 'geojson',
          data: naturalGeoJson,
          cluster: true,
          clusterMaxZoom: 4,
          clusterRadius: 35
        });

        map.addLayer({
          id: 'natural-clusters',
          type: 'circle',
          source: 'natural-source',
          filter: ['has', 'point_count'],
          paint: {
            'circle-color': '#8A6D3B',
            'circle-opacity': 0.35,
            'circle-radius': [
              'step',
              ['get', 'point_count'],
              10,
              10, 14,
              50, 18
            ],
            'circle-stroke-width': 1.5,
            'circle-stroke-color': '#8A6D3B'
          }
        });

        map.addLayer({
          id: 'natural-cluster-count',
          type: 'symbol',
          source: 'natural-source',
          filter: ['has', 'point_count'],
          layout: {
            'text-field': '{point_count_abbreviated}',
            'text-font': ['Open Sans Semibold'],
            'text-size': 10
          },
          paint: {
            'text-color': '#1F1E1D'
          }
        });

        map.addLayer({
          id: 'natural-unclustered',
          type: 'circle',
          source: 'natural-source',
          filter: ['!', ['has', 'point_count']],
          paint: {
            'circle-color': '#8A6D3B',
            'circle-opacity': 0.7,
            'circle-stroke-width': 0.5,
            'circle-stroke-color': '#FFFFFF',
            'circle-radius': [
              'interpolate',
              ['linear'],
              ['coalesce', ['get', 'magnitude'], 4.5],
              4.0, 3.5,
              6.0, 6.0,
              8.0, 9.0
            ]
          }
        });

        map.on('mouseenter', 'natural-clusters', () => {
          map.getCanvas().style.cursor = 'pointer';
        });
        map.on('mouseleave', 'natural-clusters', () => {
          map.getCanvas().style.cursor = '';
        });
        map.on('click', 'natural-clusters', (e) => {
          const f = map.queryRenderedFeatures(e.point, { layers: ['natural-clusters'] });
          if (!f.length) return;
          const clusterId = f[0].properties.cluster_id;
          const src = map.getSource('natural-source') as maplibregl.GeoJSONSource;
          src.getClusterExpansionZoom(clusterId).then((nextZoom) => {
            const geom = f[0].geometry as GeoJSON.Point;
            map.easeTo({
              center: geom.coordinates as [number, number],
              zoom: Math.min(nextZoom, 8)
            });
          }).catch(() => {});
        });

        map.on('mouseenter', 'natural-unclustered', (e) => {
          map.getCanvas().style.cursor = 'pointer';
          if (!e.features || e.features.length === 0 || !popupRef.current) return;
          const f = e.features[0];
          const geom = f.geometry as GeoJSON.Point;
          const p = f.properties;

          const html = `
            <div style="font-family: 'Inter', -apple-system, sans-serif; font-size: 11px; padding: 2px;">
              <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; border-bottom: 1px solid #E8E6DC; padding-bottom: 4px;">
                <span style="color: #8A6D3B; font-weight: 700; text-transform: uppercase; font-size: 10px; letter-spacing: 0.05em;">
                  EARTHQUAKES & VOLCANOES
                </span>
                ${p.magnitude ? `<span style="background: #FBF3D6; color: #8A6100; border: 1px solid rgba(138,97,0,0.3); padding: 1px 5px; border-radius: 4px; font-weight: 700; font-size: 9.5px;">M${Number(p.magnitude).toFixed(1)}</span>` : ''}
              </div>
              <div style="font-family: 'Source Serif 4', Georgia, serif; font-weight: 600; color: #1F1E1D; font-size: 13px; margin-bottom: 4px; line-height: 1.3;">
                ${p.name}
              </div>
              <div style="color: #5E5D59; font-size: 11px; line-height: 1.4;">
                ${p.description ? p.description.slice(0, 115) + '...' : ''}
              </div>
            </div>
          `;
          popupRef.current.setLngLat(geom.coordinates as [number, number]).setHTML(html).addTo(map);
        });
        map.on('mouseleave', 'natural-unclustered', () => {
          map.getCanvas().style.cursor = '';
          if (popupRef.current) popupRef.current.remove();
        });
        map.on('click', 'natural-unclustered', (e) => {
          if (!e.features || e.features.length === 0) return;
          const p = e.features[0].properties;
          const orig = features.find((x) => x.id === p.id);
          if (orig) onSelectFeature(orig);
        });
      }

      const naturalVis = activeLayers.natural ? 'visible' : 'none';
      if (map.getLayer('natural-clusters')) map.setLayoutProperty('natural-clusters', 'visibility', naturalVis);
      if (map.getLayer('natural-cluster-count')) map.setLayoutProperty('natural-cluster-count', 'visibility', naturalVis);
      if (map.getLayer('natural-unclustered')) map.setLayoutProperty('natural-unclustered', 'visibility', naturalVis);
    }
  }, [mapLoaded, activeLayers, hotspots, conflicts, features, theme]);


  return (
    <div className={`relative w-full h-full flex-1 overflow-hidden ${theme === 'light' ? 'bg-[#FAF9F5]' : 'bg-[#07090e]'}`}>

      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Tactical Map Controls (Offset below Header 44px + TabBar 32px) */}
      <div className="absolute top-[84px] left-3 z-10 flex flex-col gap-1 p-1 rounded-lg hud-panel shadow-2xl select-none">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] font-bold text-sm transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] font-bold text-sm transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <div className="h-px w-5 bg-[var(--hud-border)] mx-auto my-0.5" />
        <button
          type="button"
          onClick={handleToggle3D}
          className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
            is3D
              ? (theme === 'light' ? 'bg-[var(--accent)] text-white shadow-xs' : 'bg-sky-500 text-slate-950 shadow-xs')
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
          title={is3D ? 'Reset to 2D Planar View' : 'Switch to 3D Perspective (45° Pitch)'}
        >
          3D
        </button>
        <button
          type="button"
          onClick={handleResetNorth}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          title="Reset Compass / Orient North"
        >
          <Compass size={13} />
        </button>
        <button
          type="button"
          onClick={handleFocusIndia}
          className={`w-7 h-7 rounded-md flex items-center justify-center font-mono font-bold text-[11px] hover:bg-[var(--bg-surface-hover)] hover:scale-110 transition-all cursor-pointer ${
            theme === 'light' ? 'text-[var(--accent)] hover:text-[var(--accent-hover)]' : 'text-orange-400 hover:text-sky-300'
          }`}
          title="Center Sovereign India (SOI) [IN] - 25.06°N, 86.35°E, Z3.5"
        >
          IN
        </button>
      </div>

    </div>
  );
};
