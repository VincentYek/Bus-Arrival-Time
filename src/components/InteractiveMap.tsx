/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { BusStop, LiveBusVehicle, BusRoute } from '../types/bus';
import { BUS_ROUTES } from '../data/singaporeBuses';

interface InteractiveMapProps {
  stops: BusStop[];
  selectedStop: BusStop | null;
  onSelectStop: (stop: BusStop) => void;
  liveBuses: LiveBusVehicle[];
  selectedRoute: BusRoute | null;
  userLocation: { lat: number; lng: number } | null;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  stops,
  selectedStop,
  onSelectStop,
  liveBuses,
  selectedRoute,
  userLocation
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const stopMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const busMarkersRef = useRef<Map<string, L.Marker>>(new Map());
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on Orchard Road, Singapore
    const initialLat = selectedStop ? selectedStop.Latitude : 1.3044;
    const initialLng = selectedStop ? selectedStop.Longitude : 103.8341;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 15,
      minZoom: 11,
      maxZoom: 18,
      zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // CartoDB Dark Matter tiles (modern sleek dark mode for Singapore transit)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update stops markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clean up markers that are no longer in list
    const currentCodes = new Set(stops.map((s) => s.BusStopCode));
    stopMarkersRef.current.forEach((marker, code) => {
      if (!currentCodes.has(code)) {
        marker.remove();
        stopMarkersRef.current.delete(code);
      }
    });

    // Create or update markers
    stops.forEach((stop) => {
      const isSelected = selectedStop?.BusStopCode === stop.BusStopCode;
      let marker = stopMarkersRef.current.get(stop.BusStopCode);

      const html = `
        <div class="relative group cursor-pointer transition-transform duration-200 ${isSelected ? 'scale-125 z-50' : 'hover:scale-110 z-20'}">
          <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg border-2 ${
            isSelected
              ? 'bg-emerald-500 border-white text-white ring-4 ring-emerald-500/40 shadow-emerald-500/50'
              : 'bg-slate-900 border-emerald-400 text-emerald-300 shadow-slate-950/80 hover:bg-emerald-950'
          }">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h8m-8 4h8m-4 8v-4m-6 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <div class="absolute -top-7 left-1/2 -translate-x-1/2 px-1.5 py-0.5 rounded bg-slate-950/90 border border-slate-700 text-[10px] font-mono text-emerald-300 font-bold whitespace-nowrap pointer-events-none shadow">
            ${stop.BusStopCode}
          </div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-stop-marker',
        html,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
        popupAnchor: [0, -18]
      });

      if (!marker) {
        marker = L.marker([stop.Latitude, stop.Longitude], { icon }).addTo(map);
        marker.on('click', () => {
          onSelectStop(stop);
        });
        stopMarkersRef.current.set(stop.BusStopCode, marker);
      } else {
        marker.setIcon(icon);
        marker.setLatLng([stop.Latitude, stop.Longitude]);
      }

      // Popup
      marker.bindPopup(`
        <div class="p-2 text-xs">
          <div class="flex items-center gap-1.5 text-emerald-400 font-mono font-bold text-[11px]">
            <span class="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
            Stop ${stop.BusStopCode}
          </div>
          <div class="font-bold text-slate-100 text-sm mt-0.5">${stop.Description}</div>
          <div class="text-slate-400 text-[11px]">${stop.RoadName}</div>
          ${stop.mrtTransfer?.length ? `<div class="mt-1 flex gap-1">${stop.mrtTransfer.map(m => `<span class="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700 text-[10px] font-mono text-amber-300 font-bold">${m}</span>`).join('')}</div>` : ''}
          <div class="mt-2 text-[10px] text-emerald-400 font-medium">Click to view real-time arrivals</div>
        </div>
      `);
    });
  }, [stops, selectedStop, onSelectStop]);

  // Update live bus vehicle markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const currentBusIds = new Set(liveBuses.map((b) => b.id));

    // Remove old buses
    busMarkersRef.current.forEach((marker, id) => {
      if (!currentBusIds.has(id)) {
        marker.remove();
        busMarkersRef.current.delete(id);
      }
    });

    // Update each bus marker
    liveBuses.forEach((bus) => {
      const loadColor =
        bus.load === 'SEA'
          ? '#10b981' // Green
          : bus.load === 'SDA'
          ? '#f59e0b' // Amber
          : '#ef4444'; // Red

      const deckBadge = bus.type === 'DD' ? 'DD' : bus.type === 'BD' ? 'Bendy' : 'SD';

      const html = `
        <div class="relative transition-all duration-700 ease-linear cursor-pointer" style="transform: rotate(${bus.bearing}deg);">
          <div class="w-10 h-10 rounded-full flex flex-col items-center justify-center font-bold text-[10px] shadow-xl border-2 bg-slate-900"
               style="border-color: ${loadColor}; box-shadow: 0 0 12px ${loadColor}66;">
            <!-- Service number -->
            <span class="text-white text-[11px] font-extrabold tracking-tight" style="transform: rotate(-${bus.bearing}deg);">${bus.serviceNo}</span>
            <span class="text-[8px] font-mono text-slate-300" style="transform: rotate(-${bus.bearing}deg);">${deckBadge}</span>
          </div>
          <!-- Direction arrow tip -->
          <div class="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px]"
               style="border-b-color: ${loadColor};"></div>
        </div>
      `;

      const icon = L.divIcon({
        className: 'custom-bus-marker',
        html,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      });

      let marker = busMarkersRef.current.get(bus.id);
      if (!marker) {
        marker = L.marker([bus.lat, bus.lng], { icon, zIndexOffset: 1000 }).addTo(map);
        busMarkersRef.current.set(bus.id, marker);
      } else {
        marker.setLatLng([bus.lat, bus.lng]);
        marker.setIcon(icon);
      }

      // Popup
      marker.bindPopup(`
        <div class="p-2.5 text-xs min-w-[190px]">
          <div class="flex items-center justify-between border-b border-slate-700/60 pb-1.5 mb-1.5">
            <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-extrabold text-sm border border-emerald-500/40">
              Bus ${bus.serviceNo}
            </span>
            <span class="font-mono text-[11px] font-semibold text-slate-300">${bus.vehiclePlate}</span>
          </div>
          
          <div class="space-y-1 text-slate-300 text-[11px]">
            <div class="flex justify-between">
              <span class="text-slate-400">Operator:</span>
              <span class="font-medium text-slate-200">${bus.operator}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Bus Type:</span>
              <span class="font-medium text-slate-200">${bus.type === 'DD' ? 'Double Deck 🚌' : bus.type === 'BD' ? 'Bendy Bus 🚍' : 'Single Deck 🚎'}</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400">Crowd Load:</span>
              <span class="font-bold flex items-center gap-1" style="color: ${loadColor}">
                <span class="w-2 h-2 rounded-full" style="background-color: ${loadColor}"></span>
                ${bus.load === 'SEA' ? 'Seats Available' : bus.load === 'SDA' ? 'Standing Available' : 'Limited Standing'}
              </span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Speed:</span>
              <span class="font-mono text-emerald-400">${bus.speed} km/h</span>
            </div>
            <div class="flex justify-between">
              <span class="text-slate-400">Next Stop:</span>
              <span class="text-slate-200 font-medium truncate max-w-[110px]" title="${bus.nextStopName}">${bus.nextStopName || 'En route'}</span>
            </div>
          </div>
          
          <div class="mt-2 pt-1.5 border-t border-slate-700/60 text-[10px] text-slate-400">
            Destination: <span class="text-slate-200 font-semibold">${bus.destination}</span>
          </div>
        </div>
      `);
    });
  }, [liveBuses]);

  // Update Route Polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (routePolylineRef.current) {
      routePolylineRef.current.remove();
      routePolylineRef.current = null;
    }

    if (selectedRoute && selectedRoute.PolylineCoords.length > 1) {
      const poly = L.polyline(selectedRoute.PolylineCoords, {
        color: selectedRoute.Color || '#10b981',
        weight: 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
        dashArray: undefined
      }).addTo(map);

      routePolylineRef.current = poly;
      map.fitBounds(poly.getBounds(), { padding: [50, 50], maxZoom: 15 });
    }
  }, [selectedRoute]);

  // Update User Location Marker
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (!userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.remove();
        userMarkerRef.current = null;
      }
      return;
    }

    const html = `
      <div class="relative">
        <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-ping absolute inset-0 opacity-75"></div>
        <div class="w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-lg relative z-10"></div>
      </div>
    `;

    const icon = L.divIcon({
      className: 'user-loc-marker',
      html,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    if (!userMarkerRef.current) {
      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon, zIndexOffset: 2000 }).addTo(map);
      userMarkerRef.current.bindPopup('<div class="p-1 font-semibold text-xs text-blue-400">Your Current Location</div>');
    } else {
      userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
    }
  }, [userLocation]);

  // Recenter map when selectedStop changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStop) return;

    map.panTo([selectedStop.Latitude, selectedStop.Longitude], {
      animate: true,
      duration: 0.8
    });
  }, [selectedStop]);

  return (
    <div className="relative w-full h-full min-h-[350px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900">
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Legend Overlay */}
      <div className="absolute top-3 left-3 z-20 bg-slate-950/85 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800 shadow-lg text-[11px] space-y-1.5 pointer-events-auto">
        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Crowd Capacity</div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50"></span>
            <span className="text-slate-200">Seats (SEA)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50"></span>
            <span className="text-slate-200">Standing (SDA)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm shadow-red-500/50"></span>
            <span className="text-slate-200">Full (LSD)</span>
          </div>
        </div>
      </div>

      {/* Active Route Indicator */}
      {selectedRoute && (
        <div className="absolute bottom-3 left-3 z-20 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-emerald-500/40 shadow-lg text-xs flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedRoute.Color || '#10b981' }}></span>
          <span className="font-bold text-slate-100">Route {selectedRoute.ServiceNo}:</span>
          <span className="text-slate-300 truncate max-w-[200px]">{selectedRoute.RouteName}</span>
        </div>
      )}
    </div>
  );
};
