/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  BusStop,
  BusArrivalService,
  NextBusInfo,
  LiveBusVehicle,
  BusDeckType,
  BusLoad,
  BusOperator,
  BusRoute
} from '../types/bus';
import { SINGAPORE_BUS_STOPS, BUS_ROUTES, calculateDistanceMeters } from '../data/singaporeBuses';

// Seed initial fleet of buses running along Singapore routes
const BUS_PLATES = [
  'SG6021A', 'SBS3982R', 'SMB5011L', 'SG1744B', 'SG5901K',
  'SBS6712D', 'SG1008H', 'SMB3115K', 'SBS2888T', 'SG5432P',
  'SG2044C', 'SBS8921M', 'SMB1402X', 'SG4001B', 'SBS3411Y'
];

interface InternalBusSim {
  id: string;
  serviceNo: string;
  operator: BusOperator;
  plate: string;
  routeIndex: number; // Index in BUS_ROUTES
  segmentIndex: number; // Current segment along polyline
  segmentProgress: number; // 0.0 to 1.0 along current polyline segment
  speedKmh: number;
  type: BusDeckType;
  load: BusLoad;
  wab: boolean;
  direction: 1 | 2;
  dwellingRemainingSec: number; // If stopped at a bus stop
}

class SingaporeBusEngine {
  private buses: InternalBusSim[] = [];
  private listeners: Set<() => void> = new Set();
  private timer: number | null = null;
  private customLtaApiKey: string = '';

  constructor() {
    this.customLtaApiKey = localStorage.getItem('sg_buspulse_lta_key') || '';
    this.initializeFleet();
    this.startSimulation();
  }

  public setApiKey(key: string) {
    this.customLtaApiKey = key.trim();
    if (this.customLtaApiKey) {
      localStorage.setItem('sg_buspulse_lta_key', this.customLtaApiKey);
    } else {
      localStorage.removeItem('sg_buspulse_lta_key');
    }
  }

  public getApiKey(): string {
    return this.customLtaApiKey;
  }

  private initializeFleet() {
    let plateCounter = 0;
    this.buses = [];

    // Spawn 2-4 buses for every route in our dataset
    BUS_ROUTES.forEach((route, rIdx) => {
      const numBuses = 3;
      for (let i = 0; i < numBuses; i++) {
        const segIdx = Math.floor((i / numBuses) * (route.PolylineCoords.length - 1));
        const progress = (i * 0.33) % 1.0;
        const plate = BUS_PLATES[plateCounter % BUS_PLATES.length];
        plateCounter++;

        const types: BusDeckType[] = ['DD', 'DD', 'SD', 'BD'];
        const loads: BusLoad[] = ['SEA', 'SEA', 'SDA', 'LSD'];

        this.buses.push({
          id: `bus-${route.ServiceNo}-${i}`,
          serviceNo: route.ServiceNo,
          operator: route.Operator,
          plate,
          routeIndex: rIdx,
          segmentIndex: Math.min(segIdx, route.PolylineCoords.length - 2),
          segmentProgress: progress,
          speedKmh: 35 + Math.floor(Math.random() * 15),
          type: types[(rIdx + i) % types.length],
          load: loads[(rIdx * 2 + i) % loads.length],
          wab: true,
          direction: route.Direction,
          dwellingRemainingSec: 0
        });
      }
    });
  }

  private startSimulation() {
    if (this.timer) return;
    // Step simulation every 1.5 seconds
    this.timer = window.setInterval(() => {
      this.step();
      this.notifyListeners();
    }, 1500);
  }

  private step() {
    // Progress each bus along its polyline
    this.buses.forEach((bus) => {
      if (bus.dwellingRemainingSec > 0) {
        bus.dwellingRemainingSec -= 1.5;
        return;
      }

      const route = BUS_ROUTES[bus.routeIndex];
      if (!route || route.PolylineCoords.length < 2) return;

      const p1 = route.PolylineCoords[bus.segmentIndex];
      const p2 = route.PolylineCoords[bus.segmentIndex + 1];
      if (!p1 || !p2) {
        bus.segmentIndex = 0;
        bus.segmentProgress = 0;
        return;
      }

      const dist = calculateDistanceMeters(p1[0], p1[1], p2[0], p2[1]);
      // Advance by speed * dt
      const speedMs = (bus.speedKmh * 1000) / 3600;
      const stepDistanceMeters = speedMs * 1.5 * 2.5; // slight speedup for dynamic visual feeling
      const progressDelta = dist > 0 ? stepDistanceMeters / dist : 0.05;

      bus.segmentProgress += progressDelta;

      if (bus.segmentProgress >= 1.0) {
        bus.segmentProgress = 0;
        bus.segmentIndex++;

        // Randomly simulate boarding dwell at intermediate stops
        if (Math.random() < 0.25) {
          bus.dwellingRemainingSec = 4;
        }

        // Randomly adjust passenger load at stops
        if (Math.random() < 0.2) {
          const loads: BusLoad[] = ['SEA', 'SDA', 'LSD'];
          bus.load = loads[Math.floor(Math.random() * loads.length)];
        }

        if (bus.segmentIndex >= route.PolylineCoords.length - 1) {
          // Loop back to start
          bus.segmentIndex = 0;
          bus.segmentProgress = 0;
        }
      }
    });
  }

  public subscribe(cb: () => void): () => void {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  private notifyListeners() {
    this.listeners.forEach((cb) => cb());
  }

  // Get current live state of all vehicles
  public getLiveVehicles(): LiveBusVehicle[] {
    const now = Date.now();
    return this.buses.map((bus) => {
      const route = BUS_ROUTES[bus.routeIndex];
      const p1 = route.PolylineCoords[bus.segmentIndex] || [1.3044, 103.8341];
      const p2 = route.PolylineCoords[bus.segmentIndex + 1] || p1;

      // Linear interpolation between p1 and p2
      const lat = p1[0] + (p2[0] - p1[0]) * bus.segmentProgress;
      const lng = p1[1] + (p2[1] - p1[1]) * bus.segmentProgress;

      // Bearing angle in degrees
      const dLat = p2[0] - p1[0];
      const dLng = p2[1] - p1[1];
      let angle = (Math.atan2(dLng, dLat) * 180) / Math.PI;
      if (angle < 0) angle += 360;

      // Find next stop on route
      const nextStop = route.Stops[Math.min(bus.segmentIndex + 1, route.Stops.length - 1)] || route.Stops[0];

      return {
        id: bus.id,
        serviceNo: bus.serviceNo,
        operator: bus.operator,
        vehiclePlate: bus.plate,
        lat,
        lng,
        speed: bus.dwellingRemainingSec > 0 ? 0 : bus.speedKmh,
        bearing: Math.round(angle),
        type: bus.type,
        load: bus.load,
        wab: bus.wab,
        nextStopCode: nextStop ? nextStop.BusStopCode : '',
        nextStopName: nextStop ? nextStop.Description : '',
        destination: route.Destination,
        direction: bus.direction,
        lastUpdated: now
      };
    });
  }

  // Get arrivals for a specific bus stop code
  public getBusStopArrivals(busStopCode: string): BusArrivalService[] {
    const stop = SINGAPORE_BUS_STOPS.find((s) => s.BusStopCode === busStopCode);
    if (!stop) return [];

    // Find all routes that serve this stop
    const routesServingStop = BUS_ROUTES.filter((route) =>
      route.Stops.some((s) => s.BusStopCode === busStopCode)
    );

    const now = Date.now();

    const services: BusArrivalService[] = routesServingStop.map((route) => {
      const stopIndexInRoute = route.Stops.findIndex((s) => s.BusStopCode === busStopCode);
      const targetStop = route.Stops[stopIndexInRoute];

      // Find buses on this route that are approaching this stop
      const routeBuses = this.buses.filter((b) => BUS_ROUTES[b.routeIndex].ServiceNo === route.ServiceNo);

      // Calculate approximate ETA in seconds for each bus to reach this stop
      const busETAs = routeBuses.map((b) => {
        const busSeg = b.segmentIndex + b.segmentProgress;
        const totalSegments = route.PolylineCoords.length - 1;
        // Map target stop to approximate polyline index
        const stopProgress = (stopIndexInRoute / (route.Stops.length - 1 || 1)) * totalSegments;

        let diffSegments = stopProgress - busSeg;
        if (diffSegments < 0) {
          // Bus already passed this stop in this cycle, will arrive in next cycle
          diffSegments += totalSegments;
        }

        // Each segment ~ 3-4 minutes average
        const estimatedSeconds = Math.max(10, Math.round(diffSegments * 160));

        // Get coordinates of this bus
        const p1 = route.PolylineCoords[b.segmentIndex] || [stop.Latitude, stop.Longitude];
        const p2 = route.PolylineCoords[b.segmentIndex + 1] || p1;
        const bLat = p1[0] + (p2[0] - p1[0]) * b.segmentProgress;
        const bLng = p1[1] + (p2[1] - p1[1]) * b.segmentProgress;
        const distM = calculateDistanceMeters(bLat, bLng, stop.Latitude, stop.Longitude);

        return {
          bus: b,
          lat: bLat,
          lng: bLng,
          distM,
          seconds: estimatedSeconds
        };
      });

      // Sort by ETA
      busETAs.sort((a, b) => a.seconds - b.seconds);

      const makeNextBus = (entry: typeof busETAs[0] | undefined, visit: number, defaultMinutesAhead: number): NextBusInfo => {
        if (!entry) {
          // Fallback realistic next bus
          const arrivalDate = new Date(now + defaultMinutesAhead * 60 * 1000);
          return {
            EstimatedArrival: arrivalDate.toISOString(),
            Latitude: stop.Latitude + (Math.random() - 0.5) * 0.02,
            Longitude: stop.Longitude + (Math.random() - 0.5) * 0.02,
            VisitNumber: visit,
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'DD',
            VehiclePlate: 'SG' + Math.floor(1000 + Math.random() * 8999) + 'X',
            Speed: 38,
            DistanceMeters: defaultMinutesAhead * 450,
            secondsRemaining: defaultMinutesAhead * 60
          };
        }

        const arrivalDate = new Date(now + entry.seconds * 1000);
        return {
          EstimatedArrival: arrivalDate.toISOString(),
          Latitude: entry.lat,
          Longitude: entry.lng,
          VisitNumber: visit,
          Load: entry.bus.load,
          Feature: entry.bus.wab ? 'WAB' : '',
          Type: entry.bus.type,
          VehiclePlate: entry.bus.plate,
          Speed: entry.bus.speedKmh,
          DistanceMeters: entry.distM,
          secondsRemaining: entry.seconds
        };
      };

      const next1 = makeNextBus(busETAs[0], 1, 3);
      const next2 = makeNextBus(busETAs[1], 2, (next1.secondsRemaining || 180) / 60 + 8);
      const next3 = makeNextBus(busETAs[2], 3, (next2.secondsRemaining || 600) / 60 + 10);

      return {
        ServiceNo: route.ServiceNo,
        Operator: route.Operator,
        NextBus: next1,
        NextBus2: next2,
        NextBus3: next3,
        OriginatingCode: route.Stops[0]?.BusStopCode,
        DestinationCode: route.Stops[route.Stops.length - 1]?.BusStopCode,
        DestinationName: route.Destination,
        Category: ['190', '857'].includes(route.ServiceNo) ? 'Express' : 'Trunk',
        OperatingHours: {
          firstBusWeekday: '05:30',
          lastBusWeekday: '23:45',
          firstBusWeekend: '05:45',
          lastBusWeekend: '23:30'
        },
        LoopDesc: route.RouteName.includes('↺') ? 'Loop Service' : undefined
      };
    });

    // If stop has no explicit routes mapped in demo, generate rich realistic arrivals for major SG trunk routes!
    if (services.length === 0) {
      const defaultServices = ['65', '14', '190', '147'];
      return defaultServices.map((svcNo, i) => {
        const route = BUS_ROUTES.find((r) => r.ServiceNo === svcNo) || BUS_ROUTES[0];
        const eta1 = 60 + i * 180;
        const eta2 = eta1 + 420;
        const eta3 = eta2 + 600;

        return {
          ServiceNo: svcNo,
          Operator: route.Operator,
          NextBus: {
            EstimatedArrival: new Date(now + eta1 * 1000).toISOString(),
            Latitude: stop.Latitude + 0.005,
            Longitude: stop.Longitude + 0.005,
            VisitNumber: 1,
            Load: (['SEA', 'SDA', 'LSD'] as BusLoad[])[i % 3],
            Feature: 'WAB',
            Type: (['DD', 'SD', 'BD'] as BusDeckType[])[i % 3],
            VehiclePlate: BUS_PLATES[i % BUS_PLATES.length],
            Speed: 36,
            DistanceMeters: Math.round(eta1 * 8),
            secondsRemaining: eta1
          },
          NextBus2: {
            EstimatedArrival: new Date(now + eta2 * 1000).toISOString(),
            Latitude: stop.Latitude + 0.015,
            Longitude: stop.Longitude + 0.015,
            VisitNumber: 2,
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'DD',
            VehiclePlate: BUS_PLATES[(i + 1) % BUS_PLATES.length],
            Speed: 40,
            DistanceMeters: Math.round(eta2 * 8),
            secondsRemaining: eta2
          },
          NextBus3: {
            EstimatedArrival: new Date(now + eta3 * 1000).toISOString(),
            Latitude: stop.Latitude + 0.03,
            Longitude: stop.Longitude + 0.03,
            VisitNumber: 3,
            Load: 'SEA',
            Feature: 'WAB',
            Type: 'SD',
            VehiclePlate: BUS_PLATES[(i + 2) % BUS_PLATES.length],
            Speed: 42,
            DistanceMeters: Math.round(eta3 * 8),
            secondsRemaining: eta3
          },
          DestinationName: route.Destination,
          Category: 'Trunk',
          OperatingHours: {
            firstBusWeekday: '05:30',
            lastBusWeekday: '23:45',
            firstBusWeekend: '05:45',
            lastBusWeekend: '23:30'
          }
        };
      });
    }

    return services.sort((a, b) => {
      // Numerical or alphabetical sort
      const numA = parseInt(a.ServiceNo, 10);
      const numB = parseInt(b.ServiceNo, 10);
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.ServiceNo.localeCompare(b.ServiceNo);
    });
  }

  // Check server LTA Datamall status
  public async checkServerLtaStatus(): Promise<{ configured: boolean; endpoint: string; message: string }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Could not query /api/health', e);
    }
    return {
      configured: false,
      endpoint: 'https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival',
      message: 'Serverless backend proxy offline'
    };
  }

  // Fetch real-time arrivals from serverless LTA DataMall v3 endpoint
  public async fetchLiveLtaArrivals(
    busStopCode: string,
    serviceNo?: string
  ): Promise<{ live: boolean; services: BusArrivalService[]; error?: string; endpoint?: string; source?: string }> {
    const cleanStop = busStopCode.trim();
    const headers: Record<string, string> = {
      'accept': 'application/json'
    };

    if (this.customLtaApiKey) {
      headers['x-account-key'] = this.customLtaApiKey;
    }

    const url = new URL('/api/busarrival', window.location.origin);
    url.searchParams.set('BusStopCode', cleanStop);
    if (serviceNo) {
      url.searchParams.set('ServiceNo', serviceNo.trim());
    }

    try {
      const res = await fetch(url.toString(), { headers });
      const json = await res.json();

      if (!res.ok || !json.live) {
        console.warn('[LTA Live Feed Fallback]', json.error || 'Live data unavailable');
        // Fall back gracefully to simulation
        return {
          live: false,
          services: this.getBusStopArrivals(cleanStop),
          error: json.error || `HTTP ${res.status}`,
          endpoint: json.endpointUsed
        };
      }

      // Convert LTA v3 payload to app structure
      const rawServices = json.data?.Services || [];
      const stop = SINGAPORE_BUS_STOPS.find((s) => s.BusStopCode === cleanStop);
      const defaultLat = stop?.Latitude || 1.3044;
      const defaultLng = stop?.Longitude || 103.8341;

      const converted: BusArrivalService[] = rawServices.map((raw: any) => {
        const parseBus = (b: any, visit: number): NextBusInfo | null => {
          if (!b || !b.EstimatedArrival) return null;
          const etaMs = Date.parse(b.EstimatedArrival);
          const nowMs = Date.now();
          const secondsRemaining = isNaN(etaMs) ? 180 : Math.max(0, Math.round((etaMs - nowMs) / 1000));
          const lat = parseFloat(b.Latitude) || defaultLat;
          const lng = parseFloat(b.Longitude) || defaultLng;

          return {
            EstimatedArrival: b.EstimatedArrival,
            Latitude: lat,
            Longitude: lng,
            VisitNumber: parseInt(b.VisitNumber, 10) || visit,
            Load: (b.Load as BusLoad) || 'SEA',
            Feature: b.Feature === 'WAB' ? 'WAB' : '',
            Type: (b.Type as BusDeckType) || 'SD',
            VehiclePlate: b.VehiclePlate || `SG${Math.floor(2000 + Math.random() * 7000)}L`,
            Speed: 35,
            DistanceMeters: Math.round(secondsRemaining * 8),
            secondsRemaining
          };
        };

        const next1 = parseBus(raw.NextBus, 1);
        const next2 = parseBus(raw.NextBus2, 2);
        const next3 = parseBus(raw.NextBus3, 3);

        const route = BUS_ROUTES.find((r) => r.ServiceNo === raw.ServiceNo);

        return {
          ServiceNo: String(raw.ServiceNo),
          Operator: (raw.Operator as BusOperator) || 'SBST',
          NextBus: next1,
          NextBus2: next2,
          NextBus3: next3,
          OriginatingCode: raw.NextBus?.OriginCode || route?.Stops[0]?.BusStopCode,
          DestinationCode: raw.NextBus?.DestinationCode || route?.Stops[route.Stops.length - 1]?.BusStopCode,
          DestinationName: route?.Destination || 'Singapore Loop',
          Category: ['190', '857'].includes(String(raw.ServiceNo)) ? 'Express' : 'Trunk',
          OperatingHours: {
            firstBusWeekday: '05:30',
            lastBusWeekday: '23:45',
            firstBusWeekend: '05:45',
            lastBusWeekend: '23:30'
          },
          isLiveFeed: true
        };
      });

      return {
        live: true,
        services: converted,
        source: 'lta-datamall-v3',
        endpoint: json.endpoint
      };
    } catch (err: any) {
      console.warn('[LTA Live Feed Network Error]', err);
      return {
        live: false,
        services: this.getBusStopArrivals(cleanStop),
        error: err.message || 'Network error connecting to proxy'
      };
    }
  }

  // Find nearest bus stops from coordinate
  public getNearbyStops(lat: number, lng: number, limit: number = 8): BusStop[] {
    const withDistance = SINGAPORE_BUS_STOPS.map((stop) => {
      const distanceMeters = calculateDistanceMeters(lat, lng, stop.Latitude, stop.Longitude);
      return {
        ...stop,
        distanceMeters
      };
    });

    withDistance.sort((a, b) => (a.distanceMeters || 0) - (b.distanceMeters || 0));
    return withDistance.slice(0, limit);
  }

  // Search bus stops or bus routes
  public search(query: string): {
    stops: BusStop[];
    routes: BusRoute[];
  } {
    const clean = query.trim().toLowerCase();
    if (!clean) {
      return { stops: SINGAPORE_BUS_STOPS.slice(0, 10), routes: BUS_ROUTES };
    }

    const stops = SINGAPORE_BUS_STOPS.filter((s) => {
      return (
        s.BusStopCode.toLowerCase().includes(clean) ||
        s.Description.toLowerCase().includes(clean) ||
        s.RoadName.toLowerCase().includes(clean) ||
        (s.subzone && s.subzone.toLowerCase().includes(clean)) ||
        (s.mrtTransfer && s.mrtTransfer.some((m) => m.toLowerCase().includes(clean)))
      );
    });

    const routes = BUS_ROUTES.filter((r) => {
      return (
        r.ServiceNo.toLowerCase() === clean ||
        r.ServiceNo.toLowerCase().includes(clean) ||
        r.Origin.toLowerCase().includes(clean) ||
        r.Destination.toLowerCase().includes(clean) ||
        r.RouteName.toLowerCase().includes(clean)
      );
    });

    return { stops, routes };
  }
}

// Global singleton instance
export const busEngine = new SingaporeBusEngine();

