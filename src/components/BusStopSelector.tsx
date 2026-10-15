/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { BusStop } from '../types/bus';
import { SINGAPORE_BUS_STOPS, SINGAPORE_POPULAR_PRESETS } from '../data/singaporeBuses';
import { Search, MapPin, Locate, X, Train, ChevronRight } from 'lucide-react';

interface BusStopSelectorProps {
  selectedStop: BusStop | null;
  onSelectStop: (stop: BusStop) => void;
  onLocateMe: () => void;
  isLocating: boolean;
}

export const BusStopSelector: React.FC<BusStopSelectorProps> = ({
  selectedStop,
  onSelectStop,
  onLocateMe,
  isLocating
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Filter stops based on search query
  const filteredStops = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const q = searchQuery.toLowerCase().trim();
    return SINGAPORE_BUS_STOPS.filter((stop) => {
      return (
        stop.BusStopCode.toLowerCase().includes(q) ||
        stop.Description.toLowerCase().includes(q) ||
        stop.RoadName.toLowerCase().includes(q) ||
        (stop.subzone && stop.subzone.toLowerCase().includes(q)) ||
        (stop.mrtTransfer && stop.mrtTransfer.some((m) => m.toLowerCase().includes(q)))
      );
    }).slice(0, 8);
  }, [searchQuery]);

  return (
    <div className="space-y-3">
      {/* Search Input Bar */}
      <div className="relative">
        <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-2xl border transition-all duration-200 bg-slate-900 ${
          isFocused ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-lg' : 'border-slate-800 hover:border-slate-700'
        }`}>
          <Search className="w-5 h-5 text-emerald-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder="Search 5-digit stop code (e.g. 09048), road, stop or MRT..."
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none font-medium"
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          <div className="h-5 w-[1px] bg-slate-800 shrink-0"></div>

          {/* GPS Locate Me Button */}
          <button
            onClick={onLocateMe}
            disabled={isLocating}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all shrink-0 active:scale-95 disabled:opacity-50"
            title="Use current GPS coordinates"
          >
            <Locate className={`w-3.5 h-3.5 text-emerald-400 ${isLocating ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Near Me</span>
          </button>
        </div>

        {/* Instant Search Suggestions Dropdown */}
        {searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 z-40 max-h-80 overflow-y-auto rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 space-y-1">
            {filteredStops.length > 0 ? (
              filteredStops.map((stop) => (
                <button
                  key={stop.BusStopCode}
                  onClick={() => {
                    onSelectStop(stop);
                    setSearchQuery('');
                    setIsFocused(false);
                  }}
                  className="w-full text-left p-2.5 rounded-xl hover:bg-slate-800 flex items-center justify-between gap-3 group transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {stop.BusStopCode}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-100 group-hover:text-emerald-300 transition-colors">
                        {stop.Description}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {stop.RoadName} {stop.subzone ? `• ${stop.subzone}` : ''}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {stop.mrtTransfer?.slice(0, 2).map((m) => (
                      <span key={m} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono font-bold text-amber-300 border border-slate-700">
                        {m}
                      </span>
                    ))}
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs text-slate-500">
                No bus stops found matching "{searchQuery}". Try searching "09048", "Lucky Plaza", or "Bugis".
              </div>
            )}
          </div>
        )}
      </div>

      {/* Popular Singapore Locations Preset Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-emerald-400" /> Key Hubs:
        </span>
        {SINGAPORE_POPULAR_PRESETS.map((preset) => {
          const isSelected = selectedStop?.BusStopCode === preset.code;
          return (
            <button
              key={preset.code}
              onClick={() => {
                const stop = SINGAPORE_BUS_STOPS.find((s) => s.BusStopCode === preset.code);
                if (stop) onSelectStop(stop);
              }}
              className={`px-3 py-1.5 rounded-xl font-medium shrink-0 border transition-all text-[11px] ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white hover:bg-slate-800/80'
              }`}
            >
              {preset.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};
