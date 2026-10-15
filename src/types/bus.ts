/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type BusOperator = 'SBST' | 'SMRT' | 'TTS' | 'GAS';

export type BusLoad = 'SEA' | 'SDA' | 'LSD'; // Seats Available (Green), Standing Available (Amber), Limited Standing (Red)

export type BusDeckType = 'SD' | 'DD' | 'BD'; // Single Deck, Double Deck, Bendy

export interface BusStop {
  BusStopCode: string; // 5-digit string e.g. "09048"
  RoadName: string;
  Description: string;
  Latitude: number;
  Longitude: number;
  mrtTransfer?: string[]; // e.g. ['NS22', 'TE14']
  isInterchange?: boolean;
  subzone?: string;
  distanceMeters?: number; // Calculated relative to current user coords
}

export interface NextBusInfo {
  EstimatedArrival: string; // ISO 8601 string
  Latitude: number;
  Longitude: number;
  VisitNumber: number;
  Load: BusLoad;
  Feature: 'WAB' | ''; // Wheelchair Accessible Bus
  Type: BusDeckType;
  VehiclePlate?: string; // e.g. "SG6021A", "SBS3982R"
  Speed?: number; // km/h
  Bearing?: number; // Heading degrees
  DistanceMeters?: number; // Meters away
  secondsRemaining?: number; // Dynamic countdown
}

export interface BusArrivalService {
  ServiceNo: string;
  Operator: BusOperator;
  NextBus: NextBusInfo | null;
  NextBus2: NextBusInfo | null;
  NextBus3: NextBusInfo | null;
  OriginatingCode?: string;
  DestinationCode?: string;
  DestinationName?: string;
  Category?: 'Trunk' | 'Express' | 'Feeder' | 'NightRider';
  OperatingHours?: {
    firstBusWeekday: string;
    lastBusWeekday: string;
    firstBusWeekend: string;
    lastBusWeekend: string;
  };
  LoopDesc?: string;
}

export interface BusStopArrivalResponse {
  BusStopCode: string;
  Services: BusArrivalService[];
  timestamp: number;
}

export interface BusRouteStop {
  BusStopCode: string;
  Distance: number; // km from origin
  StopSequence: number;
  RoadName: string;
  Description: string;
  Direction: 1 | 2;
  hasBusApproaching?: boolean;
  liveBusesHere?: LiveBusVehicle[];
}

export interface BusRoute {
  ServiceNo: string;
  Operator: BusOperator;
  Direction: 1 | 2;
  Origin: string;
  Destination: string;
  RouteName: string;
  Stops: BusRouteStop[];
  PolylineCoords: [number, number][]; // Lat, Lng pairs
  Color?: string;
}

export interface LiveBusVehicle {
  id: string;
  serviceNo: string;
  operator: BusOperator;
  vehiclePlate: string;
  lat: number;
  lng: number;
  speed: number; // km/h
  bearing: number; // 0-360 degrees
  type: BusDeckType;
  load: BusLoad;
  wab: boolean;
  nextStopCode: string;
  nextStopName: string;
  destination: string;
  direction: 1 | 2;
  lastUpdated: number;
}

export interface FavoriteStop {
  busStopCode: string;
  customLabel?: string;
  pinnedServices?: string[];
  addedAt: number;
}

export interface ActiveBusAlarm {
  id: string;
  busStopCode: string;
  busStopName: string;
  serviceNo: string;
  targetArrivalSeconds: number; // Notify when <= this threshold (e.g. 120s)
  notified: boolean;
  createdTime: number;
}
