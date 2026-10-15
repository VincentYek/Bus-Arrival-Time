/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BusStop, BusRoute, BusOperator } from '../types/bus';

export const SINGAPORE_BUS_STOPS: BusStop[] = [
  // Orchard & Somerset Corridor
  {
    BusStopCode: '09048',
    RoadName: 'Orchard Rd',
    Description: 'Orchard Stn/Lucky Plaza',
    Latitude: 1.3044,
    Longitude: 103.8341,
    mrtTransfer: ['NS22', 'TE14'],
    subzone: 'Orchard'
  },
  {
    BusStopCode: '09022',
    RoadName: 'Orchard Rd',
    Description: 'Orchard Stn/Tang Plaza',
    Latitude: 1.3048,
    Longitude: 103.8331,
    mrtTransfer: ['NS22', 'TE14'],
    subzone: 'Orchard'
  },
  {
    BusStopCode: '09038',
    RoadName: 'Orchard Blvd',
    Description: 'Opp Orchard Stn Exit 8',
    Latitude: 1.3032,
    Longitude: 103.8324,
    mrtTransfer: ['NS22', 'TE14'],
    subzone: 'Orchard'
  },
  {
    BusStopCode: '09059',
    RoadName: 'Orchard Rd',
    Description: 'Bef Orchard Stn Exit 12',
    Latitude: 1.3041,
    Longitude: 103.8353,
    subzone: 'Orchard'
  },
  {
    BusStopCode: '08111',
    RoadName: 'Orchard Rd',
    Description: 'Somerset Stn',
    Latitude: 1.3006,
    Longitude: 103.8384,
    mrtTransfer: ['NS23'],
    subzone: 'Somerset'
  },
  {
    BusStopCode: '08138',
    RoadName: 'Penang Rd',
    Description: 'Winsland Hse',
    Latitude: 1.2995,
    Longitude: 103.8402,
    subzone: 'Somerset'
  },
  {
    BusStopCode: '08057',
    RoadName: 'Orchard Rd',
    Description: 'Dhoby Ghaut Stn',
    Latitude: 1.2989,
    Longitude: 103.8458,
    mrtTransfer: ['NS24', 'NE6', 'CC1'],
    subzone: 'Dhoby Ghaut'
  },
  {
    BusStopCode: '08031',
    RoadName: 'Bras Basah Rd',
    Description: 'Bef Bencoolen Stn Exit A',
    Latitude: 1.2984,
    Longitude: 103.8507,
    mrtTransfer: ['DT21'],
    subzone: 'Bras Basah'
  },

  // Marina Bay, City Hall & CBD Corridor
  {
    BusStopCode: '03059',
    RoadName: 'Stamford Rd',
    Description: 'City Hall Stn Exit B',
    Latitude: 1.2934,
    Longitude: 103.8524,
    mrtTransfer: ['NS25', 'EW13'],
    subzone: 'City Hall'
  },
  {
    BusStopCode: '03019',
    RoadName: 'Bras Basah Rd',
    Description: 'Raffles Hotel',
    Latitude: 1.2951,
    Longitude: 103.8546,
    mrtTransfer: ['CC2'],
    subzone: 'City Hall'
  },
  {
    BusStopCode: '03211',
    RoadName: 'Temasek Ave',
    Description: 'Opp Suntec City / Promenade Stn',
    Latitude: 1.2938,
    Longitude: 103.8596,
    mrtTransfer: ['CC4', 'DT15'],
    subzone: 'Marina Centre'
  },
  {
    BusStopCode: '03223',
    RoadName: 'Temasek Blvd',
    Description: 'Suntec Convention Ctr',
    Latitude: 1.2942,
    Longitude: 103.8576,
    subzone: 'Marina Centre'
  },
  {
    BusStopCode: '03539',
    RoadName: 'Bayfront Ave',
    Description: 'Marina Bay Sands Theatre',
    Latitude: 1.2842,
    Longitude: 103.8591,
    mrtTransfer: ['DT16', 'CE1'],
    subzone: 'Marina Bay'
  },
  {
    BusStopCode: '03511',
    RoadName: 'Bayfront Ave',
    Description: 'Marina Bay Sands Hotel',
    Latitude: 1.2831,
    Longitude: 103.8608,
    mrtTransfer: ['DT16', 'CE1'],
    subzone: 'Marina Bay'
  },
  {
    BusStopCode: '03129',
    RoadName: 'Fullerton Rd',
    Description: 'Fullerton Sq / Raffles Place Stn',
    Latitude: 1.2868,
    Longitude: 103.8532,
    mrtTransfer: ['NS26', 'EW14'],
    subzone: 'Downtown Core'
  },
  {
    BusStopCode: '04121',
    RoadName: 'High St',
    Description: 'Opp The Treasury / Clarke Quay',
    Latitude: 1.2895,
    Longitude: 103.8492,
    mrtTransfer: ['NE5'],
    subzone: 'Clarke Quay'
  },

  // Bugis, Rochor & Little India
  {
    BusStopCode: '01112',
    RoadName: 'Victoria St',
    Description: 'Bugis Stn Exit A',
    Latitude: 1.3007,
    Longitude: 103.8559,
    mrtTransfer: ['EW12', 'DT14'],
    subzone: 'Bugis'
  },
  {
    BusStopCode: '01113',
    RoadName: 'Victoria St',
    Description: 'Bugis Stn Exit B',
    Latitude: 1.3012,
    Longitude: 103.8568,
    mrtTransfer: ['EW12', 'DT14'],
    subzone: 'Bugis'
  },
  {
    BusStopCode: '01012',
    RoadName: 'Victoria St',
    Description: 'Hotel Grand Pacific / Bras Basah',
    Latitude: 1.2973,
    Longitude: 103.8530,
    subzone: 'Bugis'
  },
  {
    BusStopCode: '07519',
    RoadName: 'Serangoon Rd',
    Description: 'Little India Stn Exit E',
    Latitude: 1.3068,
    Longitude: 103.8495,
    mrtTransfer: ['NE7', 'DT12'],
    subzone: 'Little India'
  },
  {
    BusStopCode: '07531',
    RoadName: 'Serangoon Rd',
    Description: 'Broadway Hotel / Mustafa Ctr',
    Latitude: 1.3115,
    Longitude: 103.8545,
    subzone: 'Little India'
  },

  // Chinatown & Outram
  {
    BusStopCode: '05013',
    RoadName: 'Eu Tong Sen St',
    Description: 'Chinatown Stn Exit C',
    Latitude: 1.2845,
    Longitude: 103.8443,
    mrtTransfer: ['NE4', 'DT19'],
    subzone: 'Chinatown'
  },
  {
    BusStopCode: '05049',
    RoadName: 'Upper Cross St',
    Description: 'Opp Hong Lim Cplx',
    Latitude: 1.2859,
    Longitude: 103.8465,
    subzone: 'Chinatown'
  },
  {
    BusStopCode: '05022',
    RoadName: 'New Bridge Rd',
    Description: "Opp People's Park Ctr",
    Latitude: 1.2865,
    Longitude: 103.8449,
    subzone: 'Chinatown'
  },
  {
    BusStopCode: '05039',
    RoadName: 'Outram Rd',
    Description: "Outram Park Stn Exit 6",
    Latitude: 1.2811,
    Longitude: 103.8401,
    mrtTransfer: ['EW16', 'NE3', 'TE17'],
    subzone: 'Outram'
  },

  // HarbourFront & Sentosa Gateway
  {
    BusStopCode: '14141',
    RoadName: 'Telok Blangah Rd',
    Description: 'HarbourFront Stn/VivoCity',
    Latitude: 1.2649,
    Longitude: 103.8225,
    mrtTransfer: ['NE1', 'CC29'],
    isInterchange: true,
    subzone: 'HarbourFront'
  },
  {
    BusStopCode: '14129',
    RoadName: 'Telok Blangah Rd',
    Description: 'Opp VivoCity',
    Latitude: 1.2657,
    Longitude: 103.8208,
    subzone: 'HarbourFront'
  },
  {
    BusStopCode: '14119',
    RoadName: 'Seah Im Rd',
    Description: 'HarbourFront Int',
    Latitude: 1.2662,
    Longitude: 103.8189,
    isInterchange: true,
    subzone: 'HarbourFront'
  },

  // Jurong East & Clementi (West)
  {
    BusStopCode: '28009',
    RoadName: 'Jurong Gateway Rd',
    Description: 'Jurong East Int',
    Latitude: 1.3332,
    Longitude: 103.7423,
    mrtTransfer: ['NS1', 'EW24', 'JE5'],
    isInterchange: true,
    subzone: 'Jurong East'
  },
  {
    BusStopCode: '28249',
    RoadName: 'Jurong Gateway Rd',
    Description: 'Jurong East Stn/Jem',
    Latitude: 1.3339,
    Longitude: 103.7438,
    mrtTransfer: ['NS1', 'EW24'],
    subzone: 'Jurong East'
  },
  {
    BusStopCode: '28301',
    RoadName: 'Toh Guan Rd',
    Description: 'IMM Bldg',
    Latitude: 1.3354,
    Longitude: 103.7468,
    subzone: 'Jurong East'
  },
  {
    BusStopCode: '17171',
    RoadName: 'Clementi Ave 3',
    Description: 'Clementi Int',
    Latitude: 1.3152,
    Longitude: 103.7654,
    mrtTransfer: ['EW23'],
    isInterchange: true,
    subzone: 'Clementi'
  },
  {
    BusStopCode: '17179',
    RoadName: 'Clementi Ave 3',
    Description: 'Clementi Stn Exit B',
    Latitude: 1.3148,
    Longitude: 103.7645,
    mrtTransfer: ['EW23'],
    subzone: 'Clementi'
  },

  // Bishan & Toa Payoh (Central-North)
  {
    BusStopCode: '53009',
    RoadName: 'Bishan Pl',
    Description: 'Bishan Int',
    Latitude: 1.3508,
    Longitude: 103.8488,
    mrtTransfer: ['NS17', 'CC15'],
    isInterchange: true,
    subzone: 'Bishan'
  },
  {
    BusStopCode: '53231',
    RoadName: 'Bishan Rd',
    Description: 'Bishan Stn Exit A',
    Latitude: 1.3514,
    Longitude: 103.8499,
    mrtTransfer: ['NS17', 'CC15'],
    subzone: 'Bishan'
  },
  {
    BusStopCode: '52009',
    RoadName: 'Lor 6 Toa Payoh',
    Description: 'Toa Payoh Int',
    Latitude: 1.3328,
    Longitude: 103.8475,
    mrtTransfer: ['NS19'],
    isInterchange: true,
    subzone: 'Toa Payoh'
  },

  // Tampines & Bedok (East)
  {
    BusStopCode: '75009',
    RoadName: 'Tampines Ctrl 1',
    Description: 'Tampines Int',
    Latitude: 1.3541,
    Longitude: 103.9431,
    mrtTransfer: ['EW2', 'DT32'],
    isInterchange: true,
    subzone: 'Tampines'
  },
  {
    BusStopCode: '75139',
    RoadName: 'Tampines Ave 4',
    Description: 'Tampines Stn/Int Exit B',
    Latitude: 1.3533,
    Longitude: 103.9442,
    mrtTransfer: ['EW2', 'DT32'],
    subzone: 'Tampines'
  },
  {
    BusStopCode: '84009',
    RoadName: 'Bedok North Ave 1',
    Description: 'Bedok Int',
    Latitude: 1.3243,
    Longitude: 103.9304,
    mrtTransfer: ['EW5'],
    isInterchange: true,
    subzone: 'Bedok'
  },
  {
    BusStopCode: '84039',
    RoadName: 'New Upper Changi Rd',
    Description: 'Bedok Stn Exit A',
    Latitude: 1.3239,
    Longitude: 103.9295,
    mrtTransfer: ['EW5'],
    subzone: 'Bedok'
  },

  // Woodlands & North Corridor
  {
    BusStopCode: '46009',
    RoadName: 'Woodlands Sq',
    Description: 'Woodlands Int',
    Latitude: 1.4368,
    Longitude: 103.7865,
    mrtTransfer: ['NS9', 'TE2'],
    isInterchange: true,
    subzone: 'Woodlands'
  },
  {
    BusStopCode: '46279',
    RoadName: 'Woodlands Ave 3',
    Description: 'Woodlands Stn',
    Latitude: 1.4377,
    Longitude: 103.7854,
    mrtTransfer: ['NS9', 'TE2'],
    subzone: 'Woodlands'
  },

  // Changi Airport
  {
    BusStopCode: '95129',
    RoadName: 'PTB3 Basement',
    Description: 'Changi Airport PTB3',
    Latitude: 1.3565,
    Longitude: 103.9873,
    mrtTransfer: ['CG2'],
    subzone: 'Changi Airport'
  },
  {
    BusStopCode: '95109',
    RoadName: 'PTB2 Basement',
    Description: 'Changi Airport PTB2',
    Latitude: 1.3582,
    Longitude: 103.9892,
    mrtTransfer: ['CG2'],
    subzone: 'Changi Airport'
  }
];

export const SINGAPORE_POPULAR_PRESETS = [
  { name: 'Orchard & Lucky Plaza', lat: 1.3044, lng: 103.8341, code: '09048' },
  { name: 'Marina Bay Sands / CBD', lat: 1.2842, lng: 103.8591, code: '03539' },
  { name: 'City Hall & Suntec City', lat: 1.2938, lng: 103.8596, code: '03211' },
  { name: 'Bugis & Victoria St', lat: 1.3007, lng: 103.8559, code: '01112' },
  { name: 'Chinatown / People’s Park', lat: 1.2845, lng: 103.8443, code: '05013' },
  { name: 'HarbourFront / VivoCity', lat: 1.2649, lng: 103.8225, code: '14141' },
  { name: 'Jurong East Interchange', lat: 1.3332, lng: 103.7423, code: '28009' },
  { name: 'Bishan Interchange', lat: 1.3508, lng: 103.8488, code: '53009' },
  { name: 'Tampines Interchange', lat: 1.3541, lng: 103.9431, code: '75009' },
  { name: 'Woodlands Interchange', lat: 1.4368, lng: 103.7865, code: '46009' },
  { name: 'Changi Airport T3', lat: 1.3565, lng: 103.9873, code: '95129' },
];

export const BUS_OPERATOR_CONFIG: Record<BusOperator, { name: string; color: string; bg: string; border: string }> = {
  SBST: {
    name: 'SBS Transit',
    color: 'text-purple-400',
    bg: 'bg-purple-950/40',
    border: 'border-purple-800/60'
  },
  SMRT: {
    name: 'SMRT Buses',
    color: 'text-red-400',
    bg: 'bg-red-950/40',
    border: 'border-red-800/60'
  },
  TTS: {
    name: 'Tower Transit',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-800/60'
  },
  GAS: {
    name: 'Go-Ahead Singapore',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-800/60'
  }
};

export const BUS_ROUTES: BusRoute[] = [
  {
    ServiceNo: '65',
    Operator: 'SBST',
    Direction: 1,
    Origin: 'Tampines Int',
    Destination: 'HarbourFront Int',
    RouteName: 'Tampines Int ➔ HarbourFront Int via Orchard',
    Color: '#10B981',
    PolylineCoords: [
      [1.3541, 103.9431], // Tampines Int
      [1.3533, 103.9442],
      [1.3243, 103.9304], // Bedok area
      [1.3115, 103.8545], // Little India
      [1.3068, 103.8495],
      [1.2989, 103.8458], // Dhoby Ghaut
      [1.3006, 103.8384], // Somerset
      [1.3041, 103.8353], // Orchard
      [1.3044, 103.8341], // Lucky Plaza
      [1.2811, 103.8401], // Outram
      [1.2649, 103.8225], // VivoCity
      [1.2662, 103.8189], // HarbourFront Int
    ],
    Stops: [
      { BusStopCode: '75009', Distance: 0.0, StopSequence: 1, RoadName: 'Tampines Ctrl 1', Description: 'Tampines Int', Direction: 1 },
      { BusStopCode: '75139', Distance: 0.8, StopSequence: 2, RoadName: 'Tampines Ave 4', Description: 'Tampines Stn/Int Exit B', Direction: 1 },
      { BusStopCode: '84009', Distance: 6.4, StopSequence: 12, RoadName: 'Bedok North Ave 1', Description: 'Bedok Int', Direction: 1 },
      { BusStopCode: '07531', Distance: 14.2, StopSequence: 25, RoadName: 'Serangoon Rd', Description: 'Broadway Hotel / Mustafa', Direction: 1 },
      { BusStopCode: '07519', Distance: 15.1, StopSequence: 27, RoadName: 'Serangoon Rd', Description: 'Little India Stn Exit E', Direction: 1 },
      { BusStopCode: '08057', Distance: 16.8, StopSequence: 30, RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', Direction: 1 },
      { BusStopCode: '08111', Distance: 17.6, StopSequence: 32, RoadName: 'Orchard Rd', Description: 'Somerset Stn', Direction: 1 },
      { BusStopCode: '09059', Distance: 18.2, StopSequence: 34, RoadName: 'Orchard Rd', Description: 'Bef Orchard Stn Exit 12', Direction: 1 },
      { BusStopCode: '09048', Distance: 18.7, StopSequence: 35, RoadName: 'Orchard Rd', Description: 'Orchard Stn/Lucky Plaza', Direction: 1 },
      { BusStopCode: '05039', Distance: 21.5, StopSequence: 40, RoadName: 'Outram Rd', Description: 'Outram Park Stn Exit 6', Direction: 1 },
      { BusStopCode: '14141', Distance: 24.3, StopSequence: 45, RoadName: 'Telok Blangah Rd', Description: 'HarbourFront Stn/VivoCity', Direction: 1 },
      { BusStopCode: '14119', Distance: 25.1, StopSequence: 47, RoadName: 'Seah Im Rd', Description: 'HarbourFront Int', Direction: 1 },
    ]
  },
  {
    ServiceNo: '190',
    Operator: 'SMRT',
    Direction: 1,
    Origin: 'Chua Chu Kang Int',
    Destination: 'New Bridge Rd Ter',
    RouteName: 'Chua Chu Kang ➔ New Bridge Rd via Orchard Express',
    Color: '#EF4444',
    PolylineCoords: [
      [1.3850, 103.7440], // CCK
      [1.3780, 103.7620], // Bukit Panjang
      [1.3200, 103.8250], // Stevens
      [1.3044, 103.8341], // Lucky Plaza
      [1.3006, 103.8384], // Somerset
      [1.2989, 103.8458], // Dhoby Ghaut
      [1.2895, 103.8492], // High St / Clarke Quay
      [1.2845, 103.8443], // Chinatown Stn
      [1.2811, 103.8401]  // New Bridge Rd / Outram
    ],
    Stops: [
      { BusStopCode: '09022', Distance: 14.5, StopSequence: 18, RoadName: 'Orchard Rd', Description: 'Orchard Stn/Tang Plaza', Direction: 1 },
      { BusStopCode: '09048', Distance: 15.0, StopSequence: 19, RoadName: 'Orchard Rd', Description: 'Orchard Stn/Lucky Plaza', Direction: 1 },
      { BusStopCode: '08111', Distance: 15.8, StopSequence: 21, RoadName: 'Orchard Rd', Description: 'Somerset Stn', Direction: 1 },
      { BusStopCode: '08057', Distance: 16.7, StopSequence: 23, RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', Direction: 1 },
      { BusStopCode: '04121', Distance: 18.1, StopSequence: 26, RoadName: 'High St', Description: 'Opp The Treasury / Clarke Quay', Direction: 1 },
      { BusStopCode: '05013', Distance: 19.0, StopSequence: 28, RoadName: 'Eu Tong Sen St', Description: 'Chinatown Stn Exit C', Direction: 1 },
      { BusStopCode: '05039', Distance: 20.2, StopSequence: 31, RoadName: 'Outram Rd', Description: 'Outram Park Stn Exit 6', Direction: 1 }
    ]
  },
  {
    ServiceNo: '36',
    Operator: 'TTS',
    Direction: 1,
    Origin: 'Changi Airport PTB3',
    Destination: 'Tomlinson Rd / Orchard Loop',
    RouteName: 'Changi Airport ↺ Orchard Rd Express Loop',
    Color: '#3B82F6',
    PolylineCoords: [
      [1.3565, 103.9873], // PTB3
      [1.3582, 103.9892], // PTB2
      [1.3000, 103.9000], // Marine Parade / ECP
      [1.2938, 103.8596], // Suntec
      [1.2951, 103.8546], // Raffles Hotel
      [1.2989, 103.8458], // Dhoby Ghaut
      [1.3006, 103.8384], // Somerset
      [1.3044, 103.8341], // Lucky Plaza
      [1.3048, 103.8331], // Tang Plaza
      [1.2938, 103.8596], // Return
      [1.3565, 103.9873]  // Return PTB
    ],
    Stops: [
      { BusStopCode: '95129', Distance: 0.0, StopSequence: 1, RoadName: 'PTB3 Basement', Description: 'Changi Airport PTB3', Direction: 1 },
      { BusStopCode: '95109', Distance: 1.2, StopSequence: 2, RoadName: 'PTB2 Basement', Description: 'Changi Airport PTB2', Direction: 1 },
      { BusStopCode: '03211', Distance: 18.5, StopSequence: 15, RoadName: 'Temasek Ave', Description: 'Opp Suntec City / Promenade', Direction: 1 },
      { BusStopCode: '03019', Distance: 19.3, StopSequence: 17, RoadName: 'Bras Basah Rd', Description: 'Raffles Hotel', Direction: 1 },
      { BusStopCode: '08057', Distance: 20.4, StopSequence: 19, RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', Direction: 1 },
      { BusStopCode: '08111', Distance: 21.2, StopSequence: 21, RoadName: 'Orchard Rd', Description: 'Somerset Stn', Direction: 1 },
      { BusStopCode: '09048', Distance: 22.0, StopSequence: 23, RoadName: 'Orchard Rd', Description: 'Orchard Stn/Lucky Plaza', Direction: 1 },
      { BusStopCode: '09022', Distance: 22.4, StopSequence: 24, RoadName: 'Orchard Rd', Description: 'Orchard Stn/Tang Plaza', Direction: 1 },
      { BusStopCode: '03223', Distance: 27.5, StopSequence: 32, RoadName: 'Temasek Blvd', Description: 'Suntec Convention Ctr', Direction: 1 },
      { BusStopCode: '95129', Distance: 44.0, StopSequence: 46, RoadName: 'PTB3 Basement', Description: 'Changi Airport PTB3', Direction: 1 }
    ]
  },
  {
    ServiceNo: '147',
    Operator: 'SBST',
    Direction: 1,
    Origin: 'Hougang Central Int',
    Destination: 'Clementi Int',
    RouteName: 'Hougang Central ➔ Clementi Int via Chinatown',
    Color: '#8B5CF6',
    PolylineCoords: [
      [1.3710, 103.8920], // Hougang
      [1.3508, 103.8488], // Bishan/Serangoon area
      [1.3007, 103.8559], // Bugis
      [1.2845, 103.8443], // Chinatown
      [1.2811, 103.8401], // Outram
      [1.3148, 103.7645], // Clementi Stn
      [1.3152, 103.7654]  // Clementi Int
    ],
    Stops: [
      { BusStopCode: '01112', Distance: 11.2, StopSequence: 22, RoadName: 'Victoria St', Description: 'Bugis Stn Exit A', Direction: 1 },
      { BusStopCode: '01012', Distance: 11.8, StopSequence: 23, RoadName: 'Victoria St', Description: 'Hotel Grand Pacific', Direction: 1 },
      { BusStopCode: '04121', Distance: 13.0, StopSequence: 26, RoadName: 'High St', Description: 'Opp The Treasury', Direction: 1 },
      { BusStopCode: '05013', Distance: 13.9, StopSequence: 28, RoadName: 'Eu Tong Sen St', Description: 'Chinatown Stn Exit C', Direction: 1 },
      { BusStopCode: '05039', Distance: 15.1, StopSequence: 31, RoadName: 'Outram Rd', Description: 'Outram Park Stn Exit 6', Direction: 1 },
      { BusStopCode: '17179', Distance: 25.4, StopSequence: 49, RoadName: 'Clementi Ave 3', Description: 'Clementi Stn Exit B', Direction: 1 },
      { BusStopCode: '17171', Distance: 25.8, StopSequence: 50, RoadName: 'Clementi Ave 3', Description: 'Clementi Int', Direction: 1 }
    ]
  },
  {
    ServiceNo: '14',
    Operator: 'SBST',
    Direction: 1,
    Origin: 'Bedok Int',
    Destination: 'Clementi Int',
    RouteName: 'Bedok Int ➔ Clementi Int via Orchard',
    Color: '#F59E0B',
    PolylineCoords: [
      [1.3243, 103.9304], // Bedok
      [1.2934, 103.8524], // City Hall
      [1.2989, 103.8458], // Dhoby Ghaut
      [1.3006, 103.8384], // Somerset
      [1.3044, 103.8341], // Lucky Plaza
      [1.3152, 103.7654]  // Clementi Int
    ],
    Stops: [
      { BusStopCode: '84009', Distance: 0.0, StopSequence: 1, RoadName: 'Bedok North Ave 1', Description: 'Bedok Int', Direction: 1 },
      { BusStopCode: '84039', Distance: 0.5, StopSequence: 2, RoadName: 'New Upper Changi Rd', Description: 'Bedok Stn Exit A', Direction: 1 },
      { BusStopCode: '03059', Distance: 13.2, StopSequence: 22, RoadName: 'Stamford Rd', Description: 'City Hall Stn Exit B', Direction: 1 },
      { BusStopCode: '08057', Distance: 14.5, StopSequence: 24, RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', Direction: 1 },
      { BusStopCode: '08111', Distance: 15.3, StopSequence: 26, RoadName: 'Orchard Rd', Description: 'Somerset Stn', Direction: 1 },
      { BusStopCode: '09048', Distance: 16.1, StopSequence: 28, RoadName: 'Orchard Rd', Description: 'Orchard Stn/Lucky Plaza', Direction: 1 },
      { BusStopCode: '17171', Distance: 26.5, StopSequence: 48, RoadName: 'Clementi Ave 3', Description: 'Clementi Int', Direction: 1 }
    ]
  },
  {
    ServiceNo: '960',
    Operator: 'SMRT',
    Direction: 1,
    Origin: 'Woodlands Int',
    Destination: 'Marina Centre Ter',
    RouteName: 'Woodlands Int ➔ Marina Centre via Bugis',
    Color: '#EC4899',
    PolylineCoords: [
      [1.4368, 103.7865], // Woodlands
      [1.4377, 103.7854],
      [1.3012, 103.8568], // Bugis B
      [1.2938, 103.8596], // Suntec
      [1.2842, 103.8591]  // MBS
    ],
    Stops: [
      { BusStopCode: '46009', Distance: 0.0, StopSequence: 1, RoadName: 'Woodlands Sq', Description: 'Woodlands Int', Direction: 1 },
      { BusStopCode: '46279', Distance: 0.7, StopSequence: 2, RoadName: 'Woodlands Ave 3', Description: 'Woodlands Stn', Direction: 1 },
      { BusStopCode: '01113', Distance: 24.3, StopSequence: 38, RoadName: 'Victoria St', Description: 'Bugis Stn Exit B', Direction: 1 },
      { BusStopCode: '03211', Distance: 25.8, StopSequence: 41, RoadName: 'Temasek Ave', Description: 'Opp Suntec City', Direction: 1 },
      { BusStopCode: '03539', Distance: 27.2, StopSequence: 44, RoadName: 'Bayfront Ave', Description: 'Marina Bay Sands Theatre', Direction: 1 }
    ]
  },
  {
    ServiceNo: '857',
    Operator: 'TTS',
    Direction: 1,
    Origin: 'Yishun Int',
    Destination: 'Suntec City Loop',
    RouteName: 'Yishun Int ↺ Suntec City Loop via Little India',
    Color: '#14B8A6',
    PolylineCoords: [
      [1.4290, 103.8350], // Yishun
      [1.3508, 103.8488], // Bishan
      [1.3068, 103.8495], // Little India
      [1.2984, 103.8507], // Bras Basah
      [1.2938, 103.8596]  // Suntec
    ],
    Stops: [
      { BusStopCode: '53231', Distance: 11.2, StopSequence: 18, RoadName: 'Bishan Rd', Description: 'Bishan Stn Exit A', Direction: 1 },
      { BusStopCode: '07519', Distance: 16.5, StopSequence: 25, RoadName: 'Serangoon Rd', Description: 'Little India Stn Exit E', Direction: 1 },
      { BusStopCode: '08031', Distance: 17.8, StopSequence: 27, RoadName: 'Bras Basah Rd', Description: 'Bef Bencoolen Stn Exit A', Direction: 1 },
      { BusStopCode: '03211', Distance: 19.1, StopSequence: 29, RoadName: 'Temasek Ave', Description: 'Opp Suntec City', Direction: 1 }
    ]
  },
  {
    ServiceNo: '106',
    Operator: 'TTS',
    Direction: 1,
    Origin: 'Bukit Batok Int',
    Destination: 'Shenton Way Ter',
    RouteName: 'Bukit Batok ➔ Shenton Way via Orchard & Marina Bay',
    Color: '#06B6D4',
    PolylineCoords: [
      [1.3490, 103.7490], // Bukit Batok
      [1.3152, 103.7654], // Clementi
      [1.3044, 103.8341], // Orchard Lucky Plaza
      [1.3006, 103.8384], // Somerset
      [1.2989, 103.8458], // Dhoby Ghaut
      [1.2938, 103.8596], // Suntec
      [1.2842, 103.8591], // MBS
      [1.2868, 103.8532]  // Fullerton
    ],
    Stops: [
      { BusStopCode: '17171', Distance: 7.2, StopSequence: 12, RoadName: 'Clementi Ave 3', Description: 'Clementi Int', Direction: 1 },
      { BusStopCode: '09048', Distance: 16.8, StopSequence: 26, RoadName: 'Orchard Rd', Description: 'Orchard Stn/Lucky Plaza', Direction: 1 },
      { BusStopCode: '08111', Distance: 17.6, StopSequence: 28, RoadName: 'Orchard Rd', Description: 'Somerset Stn', Direction: 1 },
      { BusStopCode: '08057', Distance: 18.5, StopSequence: 30, RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', Direction: 1 },
      { BusStopCode: '03211', Distance: 20.1, StopSequence: 33, RoadName: 'Temasek Ave', Description: 'Opp Suntec City', Direction: 1 },
      { BusStopCode: '03539', Distance: 21.6, StopSequence: 36, RoadName: 'Bayfront Ave', Description: 'Marina Bay Sands Theatre', Direction: 1 },
      { BusStopCode: '03129', Distance: 23.4, StopSequence: 39, RoadName: 'Fullerton Rd', Description: 'Fullerton Sq / Raffles Place Stn', Direction: 1 }
    ]
  },
  {
    ServiceNo: '10',
    Operator: 'SBST',
    Direction: 1,
    Origin: 'Tampines Int',
    Destination: 'Kent Ridge Ter',
    RouteName: 'Tampines ➔ Kent Ridge via Shenton Way & VivoCity',
    Color: '#10B981',
    PolylineCoords: [
      [1.3541, 103.9431], // Tampines
      [1.3243, 103.9304], // Bedok
      [1.2868, 103.8532], // Fullerton
      [1.2649, 103.8225], // VivoCity
      [1.2950, 103.7700]  // Kent Ridge
    ],
    Stops: [
      { BusStopCode: '75009', Distance: 0.0, StopSequence: 1, RoadName: 'Tampines Ctrl 1', Description: 'Tampines Int', Direction: 1 },
      { BusStopCode: '84009', Distance: 6.2, StopSequence: 11, RoadName: 'Bedok North Ave 1', Description: 'Bedok Int', Direction: 1 },
      { BusStopCode: '03129', Distance: 18.7, StopSequence: 32, RoadName: 'Fullerton Rd', Description: 'Fullerton Sq / Raffles Place Stn', Direction: 1 },
      { BusStopCode: '14141', Distance: 23.1, StopSequence: 41, RoadName: 'Telok Blangah Rd', Description: 'HarbourFront Stn/VivoCity', Direction: 1 }
    ]
  },
  {
    ServiceNo: '7',
    Operator: 'SBST',
    Direction: 1,
    Origin: 'Bedok Int',
    Destination: 'Clementi Int',
    RouteName: 'Bedok Int ➔ Clementi Int via Bugis & Orchard',
    Color: '#6366F1',
    PolylineCoords: [
      [1.3243, 103.9304], // Bedok
      [1.3007, 103.8559], // Bugis
      [1.2989, 103.8458], // Dhoby Ghaut
      [1.3006, 103.8384], // Somerset
      [1.3044, 103.8341], // Lucky Plaza
      [1.3152, 103.7654]  // Clementi
    ],
    Stops: [
      { BusStopCode: '84009', Distance: 0.0, StopSequence: 1, RoadName: 'Bedok North Ave 1', Description: 'Bedok Int', Direction: 1 },
      { BusStopCode: '01112', Distance: 11.5, StopSequence: 21, RoadName: 'Victoria St', Description: 'Bugis Stn Exit A', Direction: 1 },
      { BusStopCode: '08057', Distance: 13.0, StopSequence: 24, RoadName: 'Orchard Rd', Description: 'Dhoby Ghaut Stn', Direction: 1 },
      { BusStopCode: '08111', Distance: 13.8, StopSequence: 26, RoadName: 'Orchard Rd', Description: 'Somerset Stn', Direction: 1 },
      { BusStopCode: '09048', Distance: 14.6, StopSequence: 28, RoadName: 'Orchard Rd', Description: 'Orchard Stn/Lucky Plaza', Direction: 1 },
      { BusStopCode: '17171', Distance: 25.0, StopSequence: 46, RoadName: 'Clementi Ave 3', Description: 'Clementi Int', Direction: 1 }
    ]
  }
];

// Returns all bus stops within radius or sorted by distance
export function calculateDistanceMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3; // Earth radius in metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}
