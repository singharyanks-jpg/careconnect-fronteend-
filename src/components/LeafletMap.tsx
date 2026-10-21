import React, { useEffect, useRef } from 'react';
import L from 'leaflet';

interface LeafletMapProps {
  patientCoords?: [number, number];
  nurseCoords?: [number, number];
  nurseName?: string;
  distanceKm?: number;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  patientCoords,
  nurseCoords,
  nurseName,
  distanceKm,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center if coords not supplied: New Delhi NCR
    const center: [number, number] = patientCoords || nurseCoords || [28.4312, 77.0984];

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 13,
        zoomControl: true,
        attributionControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers and layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        map.removeLayer(layer);
      }
    });

    const latLngs: L.LatLngExpression[] = [];

    // Patient Marker (Teal circle with cross)
    if (patientCoords) {
      const patientIcon = L.divIcon({
        className: 'custom-patient-marker',
        html: `<div style="background-color: #0F172A; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.3);">P</div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      });

      L.marker(patientCoords, { icon: patientIcon })
        .addTo(map)
        .bindPopup('<b>Patient Location</b>');
      latLngs.push(patientCoords);
    }

    // Nurse Marker (Clinical teal pin with N)
    if (nurseCoords) {
      const nurseIcon = L.divIcon({
        className: 'custom-nurse-marker',
        html: `<div style="background-color: #1F6F6B; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: bold; border: 2px solid white; box-shadow: 0 1px 4px rgba(0,0,0,0.3);">N</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      L.marker(nurseCoords, { icon: nurseIcon })
        .addTo(map)
        .bindPopup(`<b>${nurseName || 'Dispatched Nurse'}</b><br/>${distanceKm ? `${distanceKm} km away` : ''}`);
      latLngs.push(nurseCoords);
    }

    // Draw connecting line between patient and nurse
    if (patientCoords && nurseCoords) {
      L.polyline([patientCoords, nurseCoords], {
        color: '#1F6F6B',
        weight: 3,
        dashArray: '6, 6',
        opacity: 0.8,
      }).addTo(map);

      map.fitBounds(L.latLngBounds(latLngs), { padding: [30, 30], maxZoom: 14 });
    } else if (patientCoords) {
      map.setView(patientCoords, 13);
    }

    // Invalidate map size after a tick to prevent partial rendering
    setTimeout(() => {
      map.invalidateSize();
    }, 150);

    return () => {
      // Don't necessarily destroy on every render, but clean up on full unmount
    };
  }, [patientCoords, nurseCoords, nurseName, distanceKm]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative w-full h-48 sm:h-56 bg-slate-100 rounded-md overflow-hidden border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full" />
      {distanceKm !== undefined && (
        <div className="absolute bottom-2 right-2 z-[400] bg-white/95 px-2 py-1 rounded text-xs font-semibold text-slate-800 shadow-sm border border-slate-200">
          {distanceKm} km direct distance
        </div>
      )}
    </div>
  );
};
