'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import type { Incident } from '../types';
import { useEffect, useMemo } from 'react';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function FitToMarkers({ incidents }: { incidents: Incident[] }) {
  const map = useMap();

  useEffect(() => {
    if (!incidents.length) return;
    const latlngs = incidents
      .filter((i) => Number.isFinite(i.latitude) && Number.isFinite(i.longitude))
      .map((i) => L.latLng(i.latitude, i.longitude));

    if (!latlngs.length) return;
    map.fitBounds(L.latLngBounds(latlngs).pad(0.2));
  }, [incidents, map]);

  return null;
}

function markerColor(status: string) {
  if (status === 'open') return '#d32f2f';
  if (status === 'assigned') return '#f57c00';
  if (status === 'en_route') return '#1976d2';
  if (status === 'resolved') return '#2e7d32';
  return '#616161';
}

export default function IncidentsMap({
  incidents,
  selectedId,
  onSelect,
}: {
  incidents: Incident[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const center = useMemo<[number, number]>(() => [-24.487, -47.844], []);

  return (
    <MapContainer center={center} zoom={10} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      <FitToMarkers incidents={incidents} />

      {incidents.map((i) => {
        const isSelected = i.id === selectedId;
        const icon = L.divIcon({
          className: '',
          html: 
            <div style="
              width:px;
              height:px;
              border-radius:999px;
              background:;
              border:2px solid white;
              box-shadow:0 1px 4px rgba(0,0,0,.35);
            "></div>
          ,
        });

        return (
          <Marker
            key={i.id}
            position={[i.latitude, i.longitude]}
            icon={icon}
            eventHandlers={{ click: () => onSelect(i.id) }}
          >
            <Popup>
              <strong>{i.status}</strong>
              <div>{i.tipo_problema}</div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}