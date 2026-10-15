/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActiveBusAlarm } from '../types/bus';
import { BellRing, X, Radio } from 'lucide-react';

interface ActiveAlarmBannerProps {
  alarms: ActiveBusAlarm[];
  onDismissAlarm: (id: string) => void;
}

export const ActiveAlarmBanner: React.FC<ActiveAlarmBannerProps> = ({
  alarms,
  onDismissAlarm
}) => {
  if (alarms.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full space-y-2 pointer-events-none px-4 sm:px-0">
      {alarms.map((alarm) => {
        return (
          <div
            key={alarm.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border shadow-2xl flex items-center justify-between gap-3 transition-all ${
              alarm.notified
                ? 'bg-rose-950/95 border-rose-500/80 text-white animate-bounce shadow-rose-950/80 ring-2 ring-rose-500/50'
                : 'bg-slate-900/95 border-emerald-500/40 text-slate-100 shadow-slate-950/80'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl flex items-center justify-center ${
                  alarm.notified ? 'bg-rose-500 text-slate-950 animate-pulse' : 'bg-emerald-500/20 text-emerald-400'
                }`}
              >
                <BellRing className="w-5 h-5" />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-emerald-400">
                    Bus {alarm.serviceNo}
                  </span>
                  {alarm.notified ? (
                    <span className="px-2 py-0.5 rounded-full bg-rose-500 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                      Arriving Soon!
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Radio className="w-3 h-3 text-emerald-400 animate-spin" /> Tracking
                    </span>
                  )}
                </div>
                <div className="text-xs text-slate-300 font-medium line-clamp-1 mt-0.5">
                  {alarm.busStopName} ({alarm.busStopCode})
                </div>
              </div>
            </div>

            <button
              onClick={() => onDismissAlarm(alarm.id)}
              className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
