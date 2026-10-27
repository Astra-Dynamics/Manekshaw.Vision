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
  onViewChange
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [is3D, setIs3D] = useState(false);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
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

    const dist = Math.hypot(currentCenter.lng - center[0], currentCenter.lat - center[1]);
    const zoomDiff = Math.abs(currentZoom - zoom);

    if (dist > 0.1 || zoomDiff > 0.2) {
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

  const handleFocusIndia = () => {
    mapRef.current?.flyTo({ center: [80.0, 23.5], zoom: 4.5, essential: true });
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
          'line-color': '#38bdf8',
          'line-width': 1.6,
          'line-opacity': 0.85
        },
        filter: ['==', ['get', 'ISO3166-1-Alpha-2'], '']
      });
    }

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
          'fill-color': '#0ea5e9',
          'fill-opacity': 0.05
        }
      });

      // Outer boundary glow
      map.addLayer({
        id: 'india-soi-glow',
        type: 'line',
        source: 'india-soi-source',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 5,
          'line-blur': 3,
          'line-opacity': 0.6
        }
      });

      // Crisp solid sovereign border line
      map.addLayer({
        id: 'india-soi-line',
        type: 'line',
        source: 'india-soi-source',
        paint: {
          'line-color': '#38bdf8',
          'line-width': 2.2,
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
          'text-color': '#7dd3fc',
          'text-halo-color': '#020617',
          'text-halo-width': 2
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
          'fill-color': '#dc2626',
          'fill-opacity': 0.18
        }
      });

      map.addLayer({
        id: 'conflicts-outline',
        type: 'line',
        source: 'conflicts-source',
        paint: {
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
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.08
        }
      });

      map.addLayer({
        id: 'adiz-line',
        type: 'line',
        source: 'adiz-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2,
          'line-dasharray': [4, 2],
          'line-opacity': 0.85
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
          'fill-color': '#06b6d4',
          'fill-opacity': 0.16
        }
      });

      map.addLayer({
        id: 'gps-jamming-outline',
        type: 'line',
        source: 'gps-jamming-source',
        paint: {
          'line-color': '#22d3ee',
          'line-width': 2,
          'line-dasharray': [2, 2],
          'line-opacity': 0.95
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
          'line-color': ['get', 'color'],
          'line-width': 5,
          'line-blur': 2.5,
          'line-opacity': 0.5
        }
      });

      map.addLayer({
        id: 'fortified-borders-line',
        type: 'line',
        source: 'fortified-borders-source',
        paint: {
          'line-color': ['get', 'color'],
          'line-width': 2.4,
          'line-dasharray': [3, 1.5],
          'line-opacity': 0.95
        }
      });
    }

    const bordersVis = activeLayers.fortifiedBorders ? 'visible' : 'none';
    if (map.getLayer('fortified-borders-glow')) map.setLayoutProperty('fortified-borders-glow', 'visibility', bordersVis);
    if (map.getLayer('fortified-borders-line')) map.setLayoutProperty('fortified-borders-line', 'visibility', bordersVis);

    // Ensure Survey of India Sovereign Boundary stays topmost
    if (map.getLayer('india-soi-fill')) map.moveLayer('india-soi-fill');
    if (map.getLayer('india-soi-glow')) map.moveLayer('india-soi-glow');
    if (map.getLayer('india-soi-line')) map.moveLayer('india-soi-line');

    // 2. Point Features Source (Hotspots + other 12 layers)
    const allPointFeatures: GeoJSON.Feature[] = [];

    // Add hotspots
    if (activeLayers.hotspots) {
      hotspots.forEach((h) => {
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
            color: h.escalationScore >= 5 ? '#ef4444' : h.escalationScore >= 4 ? '#f97316' : '#eab308'
          }
        });
      });
    }

    // Add features from other active layers
    features.forEach((feat) => {
      if (!activeLayers[feat.layer]) return;

      let color = '#38bdf8';
      if (feat.layer === 'iranAttacks') color = '#ef4444';
      else if (feat.layer === 'bases') color = '#3b82f6';
      else if (feat.layer === 'nuclear') color = '#eab308';
      else if (feat.layer === 'military') color = '#06b6d4';
      else if (feat.layer === 'weather') color = '#60a5fa';
      else if (feat.layer === 'canadaAlerts') color = '#f43f5e';
      else if (feat.layer === 'outages') color = '#a855f7';
      else if (feat.layer === 'natural') color = '#ea580c';
      else if (feat.layer === 'waterways') color = '#14b8a6';
      else if (feat.layer === 'economic') color = '#10b981';
      else if (feat.layer === 'sanctions') color = '#ec4899';
      else if (feat.layer === 'gpsJamming') color = '#06b6d4';

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

      // Outer glowing halo
      map.addLayer({
        id: 'points-halo',
        type: 'circle',
        source: 'points-source',
        paint: {
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

      // Inner solid tactical dot
      map.addLayer({
        id: 'points-core',
        type: 'circle',
        source: 'points-source',
        paint: {
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
          'text-color': '#f8fafc',
          'text-halo-color': '#020617',
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

        const html = `
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
          const html = `
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
  }, [mapLoaded, activeLayers, hotspots, conflicts, features]);

  return (
    <div className="relative w-full h-full flex-1 overflow-hidden bg-[#07090e]">
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating Tactical Map Controls */}
      <div className="absolute top-13 left-3 z-10 flex flex-col gap-1 p-1 rounded-lg hud-panel shadow-2xl select-none">
        <button
          onClick={handleZoomIn}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] font-bold text-sm transition-colors"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={handleZoomOut}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] font-bold text-sm transition-colors"
          title="Zoom Out"
        >
          −
        </button>
        <div className="h-px w-5 bg-[var(--hud-border)] mx-auto my-0.5" />
        <button
          onClick={handleToggle3D}
          className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-mono font-bold transition-colors ${
            is3D
              ? 'bg-sky-500 text-slate-950 shadow-xs'
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
          }`}
          title={is3D ? 'Reset to 2D Planar View' : 'Switch to 3D Perspective (45° Pitch)'}
        >
          3D
        </button>
        <button
          onClick={handleResetNorth}
          className="w-7 h-7 rounded-md flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] transition-colors"
          title="Reset Compass / Orient North"
        >
          <Compass size={13} />
        </button>
        <button
          onClick={handleFocusIndia}
          className="w-7 h-7 rounded-md flex items-center justify-center text-xs hover:scale-115 transition-transform"
          title="Center Sovereign India (SOI)"
        >
          🇮🇳
        </button>
      </div>
    </div>
  );
};
