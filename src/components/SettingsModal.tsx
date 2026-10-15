/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Key, Volume2, Info, Check, RotateCcw, ShieldCheck, HelpCircle } from 'lucide-react';
import { busEngine } from '../services/busSimulation';
import { playArrivalChime } from '../utils/audioAlert';

interface SettingsModalProps {
  onClose: () => void;
  soundEnabled: boolean;
  onToggleSound: (enabled: boolean) => void;
  onResetData: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  soundEnabled,
  onToggleSound,
  onResetData
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(busEngine.getApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveApiKey = () => {
    busEngine.setApiKey(apiKeyInput);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg max-h-[90vh] rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">LTA Datamall Settings</h3>
              <p className="text-xs text-slate-400">Singapore Land Transport Authority configuration</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* LTA DataMall API Key */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-emerald-400" /> Custom LTA AccountKey
              </label>
              <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-800">
                Optional
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              SG BusPulse runs a high-fidelity real-time physics engine covering Singapore corridors. If you have a personal{' '}
              <span className="text-slate-200 font-medium">LTA DataMall AccountKey</span>, enter it below:
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                placeholder="Paste LTA DataMall AccountKey..."
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-600 font-mono outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                onClick={handleSaveApiKey}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1"
              >
                {savedSuccess ? <Check className="w-4 h-4" /> : 'Save'}
              </button>
            </div>
          </div>

          {/* Audio Chime Notification */}
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-slate-200">Arrival Alarm Chime</span>
              </div>
              <button
                onClick={() => onToggleSound(!soundEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  soundEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Plays an audio transit chime when your tracked bus is within 2 minutes of arriving at your stop.
            </p>

            <button
              onClick={() => playArrivalChime()}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> Test Chime Sound
            </button>
          </div>

          {/* LTA Official Codes Guide */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-blue-400" /> Official LTA Code Reference
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
                <span className="text-slate-400 font-bold block text-[11px]">Crowd Capacity (Load)</span>
                <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <span>SEA: Seats Available</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                  <span>SDA: Standing Available</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-400 font-medium">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  <span>LSD: Limited Standing</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1.5">
                <span className="text-slate-400 font-bold block text-[11px]">Bus Deck Types</span>
                <div className="text-slate-300">
                  <span className="font-mono text-emerald-400 font-bold">DD:</span> Double Deck Bus
                </div>
                <div className="text-slate-300">
                  <span className="font-mono text-emerald-400 font-bold">SD:</span> Single Deck Bus
                </div>
                <div className="text-slate-300">
                  <span className="font-mono text-emerald-400 font-bold">BD:</span> Articulated Bendy
                </div>
                <div className="text-slate-300">
                  <span className="font-mono text-blue-400 font-bold">WAB:</span> Wheelchair Accessible
                </div>
              </div>
            </div>
          </div>

          {/* Reset App Data */}
          <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs">
            <span className="text-slate-500">Reset saved stops & alarms</span>
            <button
              onClick={() => {
                if (window.confirm('Reset all saved bookmarks and active alarms?')) {
                  onResetData();
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center gap-1.5 font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Clear All Data
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400 flex items-center justify-between">
          <span className="flex items-center gap-1 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Compliant with LTA DataMall Standards
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
