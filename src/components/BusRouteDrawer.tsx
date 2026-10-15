/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BusRoute, LiveBusVehicle, BusStop } from '../types/bus';
import { X, Navigation, Radio, MapPin, ArrowRight } from 'lucide-react';
import { BUS_OPERATOR_CONFIG } from '../data/singaporeBuses';

interface BusRouteDrawerProps {
  route: BusRoute;
  currentStopCode: string;
  liveBuses: LiveBusVehicle[];
  onClose: () => void;
  onSelectStopCode: (code: string) => void;
}

export const BusRouteDrawer: React.FC<BusRouteDrawerProps> = ({
  route,
  currentStopCode,
  liveBuses,
  onClose,
  onSelectStopCode
}) => {
  const operatorConfig = BUS_OPERATOR_CONFIG[route.Operator] || BUS_OPERATOR_CONFIG.SBST;
  const routeBuses = liveBuses.filter((b) => b.serviceNo === route.ServiceNo);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md h-full sm:h-[92vh] sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-slate-950 font-black text-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30">
              {route.ServiceNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded border ${operatorConfig.bg} ${operatorConfig.color} ${operatorConfig.border}`}>
                  {operatorConfig.name}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">
                  {route.Stops.length} stops
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-100 mt-1 line-clamp-1">
                {route.Origin} ➔ {route.Destination}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Buses Active on Route */}
        <div className="px-5 py-3 bg-emerald-950/30 border-b border-emerald-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <Radio className="w-4 h-4 animate-pulse" />
            <span>{routeBuses.length} Live Buses on Road</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {routeBuses.map((b) => b.vehiclePlate).join(', ')}
          </div>
        </div>

        {/* Route Stops Sequence */}
        <div className="flex-1 overflow-y-auto p-5 space-y-0 relative">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center justify-between">
            <span>Route Sequence (Direction {route.Direction})</span>
            <span>Tap stop to switch view</span>
          </div>

          <div className="relative pl-6 space-y-4">
            {/* Vertical route guide line */}
            <div className="absolute left-2.5 top-2 bottom-4 w-1 bg-gradient-to-b from-emerald-500 via-teal-500 to-emerald-600 rounded-full opacity-60"></div>

            {route.Stops.map((stop, index) => {
              const isCurrent = stop.BusStopCode === currentStopCode;
              // Check if any bus is approaching this stop
              const approachingBus = routeBuses.find(
                (b) => b.nextStopCode === stop.BusStopCode
              );

              return (
                <div
                  key={stop.BusStopCode + index}
                  onClick={() => {
                    onSelectStopCode(stop.BusStopCode);
                    onClose();
                  }}
                  className={`group relative p-3 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/80 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700'
                  }`}
                >
                  {/* Sequence Node Dot */}
                  <div
                    className={`absolute -left-[29px] top-4 w-4 h-4 rounded-full border-2 transition-transform duration-200 ${
                      isCurrent
                        ? 'bg-emerald-400 border-white ring-4 ring-emerald-500/30 scale-125'
                        : 'bg-slate-950 border-slate-600 group-hover:border-emerald-400 group-hover:scale-110'
                    }`}
                  />

                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-emerald-400">
                          {stop.BusStopCode}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Seq {stop.StopSequence} • {stop.Distance} km
                        </span>
                      </div>

                      <div className="font-semibold text-sm text-slate-100 group-hover:text-emerald-300 transition-colors mt-0.5">
                        {stop.Description}
                      </div>

                      <div className="text-xs text-slate-400">
                        {stop.RoadName}
                      </div>
                    </div>

                    <div className="text-right">
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-extrabold text-[10px] shadow">
                          Selected
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Approaching bus alert badge */}
                  {approachingBus && (
                    <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-amber-300 bg-amber-950/30 -mx-3 -mb-3 p-2.5 rounded-b-2xl">
                      <div className="flex items-center gap-1.5 font-semibold">
                        <Navigation className="w-3.5 h-3.5 animate-bounce" />
                        <span>Bus approaching: {approachingBus.vehiclePlate}</span>
                      </div>
                      <span className="font-mono text-[10px] text-slate-400">
                        {approachingBus.speed} km/h • {approachingBus.load}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400 flex items-center justify-between">
          <span>Singapore Land Transport Authority</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
