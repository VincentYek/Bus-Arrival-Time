/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { BusArrivalService, NextBusInfo, BusLoad } from '../types/bus';
import { BUS_OPERATOR_CONFIG } from '../data/singaporeBuses';
import { Bell, BellRing, MapPin, Star, Layers, Accessibility, Clock, ChevronDown, ChevronUp, Radio } from 'lucide-react';

interface BusArrivalCardProps {
  service: BusArrivalService;
  busStopCode: string;
  busStopName: string;
  isPinned: boolean;
  onTogglePin: (serviceNo: string) => void;
  onSelectRoute: (serviceNo: string) => void;
  hasActiveAlarm: boolean;
  onToggleAlarm: (serviceNo: string) => void;
}

export const BusArrivalCard: React.FC<BusArrivalCardProps> = ({
  service,
  busStopCode,
  busStopName,
  isPinned,
  onTogglePin,
  onSelectRoute,
  hasActiveAlarm,
  onToggleAlarm
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const operatorInfo = BUS_OPERATOR_CONFIG[service.Operator] || BUS_OPERATOR_CONFIG.SBST;

  // Render timing badge
  const formatTimeBadge = (info: NextBusInfo | null, isPrimary: boolean = false) => {
    if (!info) {
      return (
        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-500 text-xs font-mono">
          <span>--</span>
          <span className="text-[10px]">No info</span>
        </div>
      );
    }

    const sec = info.secondsRemaining ?? 0;
    const mins = Math.floor(sec / 60);

    let displayTime = '';
    let isArrivingNow = false;

    if (sec <= 45) {
      displayTime = 'Arr';
      isArrivingNow = true;
    } else if (sec < 60) {
      displayTime = '< 1m';
    } else {
      displayTime = `${mins}m`;
    }

    // Load styling
    const loadConfig: Record<BusLoad, { text: string; bg: string; textCol: string; border: string }> = {
      SEA: { text: 'Seats', bg: 'bg-emerald-500/15', textCol: 'text-emerald-400', border: 'border-emerald-500/40' },
      SDA: { text: 'Standing', bg: 'bg-amber-500/15', textCol: 'text-amber-400', border: 'border-amber-500/40' },
      LSD: { text: 'Full', bg: 'bg-rose-500/15', textCol: 'text-rose-400', border: 'border-rose-500/40' }
    };

    const loadStyle = loadConfig[info.Load] || loadConfig.SEA;

    if (isPrimary) {
      return (
        <div className={`relative p-3.5 rounded-2xl border transition-all duration-300 ${
          isArrivingNow
            ? 'bg-gradient-to-br from-emerald-950/70 to-slate-900 border-emerald-500/50 shadow-lg shadow-emerald-950/40'
            : 'bg-slate-900/90 border-slate-800 hover:border-slate-700'
        }`}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Next Bus</span>
            {isArrivingNow && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold animate-pulse border border-emerald-500/30">
                <Radio className="w-3 h-3 animate-spin text-emerald-400" /> Arriving
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-2 mt-1">
            <span className={`font-mono-numbers font-extrabold tracking-tight ${
              isArrivingNow
                ? 'text-3xl text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : mins <= 3
                ? 'text-3xl text-amber-300'
                : 'text-3xl text-slate-100'
            }`}>
              {displayTime}
            </span>
            {sec > 45 && (
              <span className="text-xs text-slate-400 font-mono-numbers">
                ({sec}s)
              </span>
            )}
          </div>

          {/* Badges: Deck, Load, Wheelchair */}
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            {/* Load Badge */}
            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border flex items-center gap-1 ${loadStyle.bg} ${loadStyle.textCol} ${loadStyle.border}`}>
              <span className="w-1.5 h-1.5 rounded-full currentColor bg-current"></span>
              {loadStyle.text}
            </span>

            {/* Deck Badge */}
            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800/80 text-slate-300 border border-slate-700 flex items-center gap-1">
              <Layers className="w-3 h-3 text-slate-400" />
              {info.Type === 'DD' ? 'Double Deck' : info.Type === 'BD' ? 'Bendy' : 'Single Deck'}
            </span>

            {/* WAB Badge */}
            {info.Feature === 'WAB' && (
              <span className="p-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/30" title="Wheelchair Accessible">
                <Accessibility className="w-3 h-3" />
              </span>
            )}
          </div>

          {/* Telematics: Plate & Distance */}
          {info.VehiclePlate && (
            <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
              <span className="text-slate-300 font-semibold">{info.VehiclePlate}</span>
              {info.Speed !== undefined && <span>{info.Speed} km/h</span>}
            </div>
          )}
        </div>
      );
    }

    // Secondary / Tertiary arrival
    return (
      <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
          <span>{info.VisitNumber === 2 ? '2nd Bus' : '3rd Bus'}</span>
          <span className="font-mono text-slate-300">{info.Type}</span>
        </div>

        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-extrabold font-mono-numbers text-slate-200">
            {displayTime}
          </span>
        </div>

        <div className="mt-1.5 flex items-center gap-1">
          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold border ${loadStyle.bg} ${loadStyle.textCol} ${loadStyle.border}`}>
            {loadStyle.text}
          </span>
          {info.Feature === 'WAB' && (
            <Accessibility className="w-2.5 h-2.5 text-blue-400 ml-auto" />
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isPinned
        ? 'bg-slate-900/90 border-amber-500/30 shadow-lg shadow-amber-950/20 ring-1 ring-amber-500/20'
        : 'bg-slate-900/70 border-slate-800/90 hover:border-slate-700 hover:shadow-xl'
    }`}>
      {/* Service Header */}
      <div className="p-4 border-b border-slate-800/70 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* Service Number Badge */}
          <div className="relative group cursor-pointer" onClick={() => onSelectRoute(service.ServiceNo)}>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-black text-xl tracking-tight shadow-md shadow-emerald-500/20 group-hover:bg-emerald-400 transition-colors flex items-center gap-1">
              {service.ServiceNo}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${operatorInfo.bg} ${operatorInfo.color} ${operatorInfo.border}`}>
                {operatorInfo.name}
              </span>
              {service.Category && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {service.Category}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-300 font-medium mt-1 truncate max-w-[220px] sm:max-w-[280px]">
              {service.DestinationName ? `➔ ${service.DestinationName}` : service.LoopDesc || 'Scheduled Route'}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Pin / Favorite */}
          <button
            onClick={() => onTogglePin(service.ServiceNo)}
            className={`p-2 rounded-xl border transition-colors ${
              isPinned
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={isPinned ? 'Remove from pinned' : 'Pin to top'}
          >
            <Star className={`w-4 h-4 ${isPinned ? 'fill-amber-400' : ''}`} />
          </button>

          {/* Alarm reminder */}
          <button
            onClick={() => onToggleAlarm(service.ServiceNo)}
            className={`p-2 rounded-xl border transition-colors ${
              hasActiveAlarm
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-slate-800/60 text-slate-400 border-slate-700/60 hover:text-slate-200 hover:bg-slate-800'
            }`}
            title={hasActiveAlarm ? 'Alarm active! Click to cancel' : 'Set 2-min arrival chime alarm'}
          >
            {hasActiveAlarm ? <BellRing className="w-4 h-4" /> : <Bell className="w-4 h-4" />}
          </button>

          {/* View Route sequence */}
          <button
            onClick={() => onSelectRoute(service.ServiceNo)}
            className="p-2 rounded-xl bg-slate-800/60 text-slate-400 border border-slate-700/60 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
            title="View route map and stops"
          >
            <MapPin className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Arrival Timings Grid (1 Primary + 2 Secondary) */}
      <div className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="sm:col-span-1">
          {formatTimeBadge(service.NextBus, true)}
        </div>
        <div className="sm:col-span-2 grid grid-cols-2 gap-3">
          {formatTimeBadge(service.NextBus2, false)}
          {formatTimeBadge(service.NextBus3, false)}
        </div>
      </div>

      {/* Expandable details drawer */}
      <div className="px-4 pb-3">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition-colors py-1 border-t border-slate-800/60"
        >
          <span className="flex items-center gap-1.5 font-medium">
            <Clock className="w-3.5 h-3.5 text-emerald-400" /> First & Last Bus Timings
          </span>
          {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {showDetails && (
          <div className="mt-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-500 block text-[10px]">Weekday Operating:</span>
              <span className="font-mono text-emerald-300">
                {service.OperatingHours?.firstBusWeekday || '05:30'} - {service.OperatingHours?.lastBusWeekday || '23:50'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Weekend / Public Hol:</span>
              <span className="font-mono text-emerald-300">
                {service.OperatingHours?.firstBusWeekend || '05:45'} - {service.OperatingHours?.lastBusWeekend || '23:30'}
              </span>
            </div>
            <div className="col-span-2 text-[10px] text-slate-400 pt-1 border-t border-slate-800/80 flex items-center justify-between">
              <span>Standard LTA frequency: 8 - 14 mins</span>
              <button
                onClick={() => onSelectRoute(service.ServiceNo)}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Inspect Full Route ➔
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
