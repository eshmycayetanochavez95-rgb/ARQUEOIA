import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { SiteRecord } from '../types/archaeology';

interface InteractiveMapProps {
  latitude: number | null;
  longitude: number | null;
  altitude?: string;
  label?: string;
  sites?: SiteRecord[];
  onSelectCoordinates?: (lat: number, lng: number) => void;
}

type LayerKey = 'topo' | 'satellite' | 'osm';

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  altitude,
  label,
  sites = [],
  onSelectCoordinates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const activeMarkerRef = useRef<L.CircleMarker | null>(null);
  const siteMarkersGroupRef = useRef<L.LayerGroup | null>(null);

  const [activeLayer, setActiveLayer] = useState<LayerKey>('topo');

  const TILE_SOURCES: Record<
    LayerKey,
    { url: string; attribution: string; name: string }
  > = {
    topo: {
      name: 'Topográfico (Curvas de nivel)',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors, SRTM | © OpenTopoMap',
    },
    satellite: {
      name: 'Satelital (Esri World Imagery)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles © Esri — Source: Esri, USGS, NOAA',
    },
    osm: {
      name: 'Cartografía Base (OSM)',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '© OpenStreetMap contributors',
    },
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const defaultLat = latitude !== null && !isNaN(latitude) ? latitude : -13.516;
    const defaultLng = longitude !== null && !isNaN(longitude) ? longitude : -71.978;

    const map = L.map(mapContainerRef.current, {
      center: [defaultLat, defaultLng],
      zoom: latitude !== null ? 13 : 6,
    });

    const initialSource = TILE_SOURCES[activeLayer];
    const tileLayer = L.tileLayer(initialSource.url, {
      attribution: initialSource.attribution,
      maxZoom: 18,
    }).addTo(map);

    tileLayerRef.current = tileLayer;
    siteMarkersGroupRef.current = L.layerGroup().addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (onSelectCoordinates) {
        const roundedLat = Number(e.latlng.lat.toFixed(6));
        const roundedLng = Number(e.latlng.lng.toFixed(6));
        onSelectCoordinates(roundedLat, roundedLng);
      }
    });

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch tile layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const source = TILE_SOURCES[activeLayer];
    tileLayerRef.current = L.tileLayer(source.url, {
      attribution: source.attribution,
      maxZoom: 18,
    }).addTo(map);
  }, [activeLayer]);

  // Update active coordinate marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (activeMarkerRef.current) {
      map.removeLayer(activeMarkerRef.current);
      activeMarkerRef.current = null;
    }

    if (
      latitude !== null &&
      longitude !== null &&
      !isNaN(latitude) &&
      !isNaN(longitude)
    ) {
      const marker = L.circleMarker([latitude, longitude], {
        radius: 9,
        fillColor: '#9A3412',
        color: '#FBF9F5',
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(map);

      const popupHtml = `
        <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px; color: #1C1917;">
          <strong style="display:block; margin-bottom:2px;">${label || 'Punto de Control Arqueológico'}</strong>
          <span style="font-family: 'IBM Plex Mono', monospace;">Lat: ${latitude} · Lng: ${longitude}</span>
          ${altitude ? `<div style="margin-top:2px;">Altitud: ${altitude}</div>` : ''}
        </div>
      `;
      marker.bindPopup(popupHtml).openPopup();
      activeMarkerRef.current = marker;
      map.setView([latitude, longitude], Math.max(map.getZoom(), 12));
    }
  }, [latitude, longitude, altitude, label]);

  // Plot registered sites on map
  useEffect(() => {
    const group = siteMarkersGroupRef.current;
    if (!group) return;

    group.clearLayers();
    sites.forEach((site) => {
      if (
        typeof site.latitud === 'number' &&
        typeof site.longitud === 'number' &&
        !isNaN(site.latitud) &&
        !isNaN(site.longitud)
      ) {
        const sMarker = L.circleMarker([site.latitud, site.longitud], {
          radius: 7,
          fillColor: '#78350F',
          color: '#FBF9F5',
          weight: 2,
          fillOpacity: 0.85,
        });
        sMarker.bindPopup(`
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; font-size: 12px;">
            <strong>${site.nombreSitio}</strong><br/>
            <span>${site.region || ''}, ${site.pais || ''}</span><br/>
            <span style="font-family: monospace;">${site.latitud}, ${site.longitud}</span>
            ${site.altitud ? `<br/>Altitud: ${site.altitud}` : ''}
          </div>
        `);
        group.addLayer(sMarker);
      }
    });
  }, [sites]);

  return (
    <div className="border border-[#D6CEBE] rounded bg-[#FBF9F5] overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#EBE6DF] border-b border-[#D6CEBE]">
        <div className="text-xs font-medium text-[#292524]">
          Visor Cartográfico Arqueológico · Haga clic en el mapa para capturar coordenadas reales
        </div>
        <div className="flex items-center gap-1 p-1 bg-[#FBF9F5] rounded border border-[#D6CEBE]">
          {(['topo', 'satellite', 'osm'] as LayerKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveLayer(key)}
              className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap ${
                activeLayer === key
                  ? 'bg-[#78350F] text-[#FBF9F5]'
                  : 'text-[#44403C] hover:text-[#1C1917]'
              }`}
            >
              {key === 'topo'
                ? 'Topográfico'
                : key === 'satellite'
                ? 'Satélite'
                : 'Mapa Base'}
            </button>
          ))}
        </div>
      </div>
      <div ref={mapContainerRef} className="w-full h-[400px] z-0" />
    </div>
  );
};
