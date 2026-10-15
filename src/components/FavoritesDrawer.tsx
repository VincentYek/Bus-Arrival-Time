/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FavoriteStop, BusStop } from '../types/bus';
import { SINGAPORE_BUS_STOPS } from '../data/singaporeBuses';
import { X, Star, Trash2, Edit2, Check, MapPin, ChevronRight } from 'lucide-react';

interface FavoritesDrawerProps {
  favorites: FavoriteStop[];
  onSelectStop: (stop: BusStop) => void;
  onRemoveFavorite: (code: string) => void;
  onUpdateLabel: (code: string, label: string) => void;
  onClose: () => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  favorites,
  onSelectStop,
  onRemoveFavorite,
  onUpdateLabel,
  onClose
}) => {
  const [editingCode, setEditingCode] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');

  const handleStartEdit = (code: string, currentLabel?: string) => {
    setEditingCode(code);
    setEditLabel(currentLabel || '');
  };

  const handleSaveEdit = (code: string) => {
    onUpdateLabel(code, editLabel.trim());
    setEditingCode(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-950/70 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full sm:max-w-md h-full sm:h-[90vh] sm:rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Star className="w-5 h-5 fill-amber-400" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Saved Bus Stops</h3>
              <p className="text-xs text-slate-400">{favorites.length} bookmarked locations</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {favorites.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <Star className="w-12 h-12 text-slate-700 mb-3 stroke-[1.5]" />
              <p className="font-semibold text-slate-300 text-sm">No saved bus stops yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">
                Click the star icon on any bus stop or bus card to pin it here for 1-tap arrival checks!
              </p>
            </div>
          ) : (
            favorites.map((fav) => {
              const stop = SINGAPORE_BUS_STOPS.find((s) => s.BusStopCode === fav.busStopCode);
              const isEditing = editingCode === fav.busStopCode;

              return (
                <div
                  key={fav.busStopCode}
                  className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex-1 cursor-pointer"
                      onClick={() => {
                        if (!isEditing && stop) {
                          onSelectStop(stop);
                          onClose();
                        }
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {fav.busStopCode}
                        </span>
                        {isEditing ? (
                          <div className="flex items-center gap-1.5 flex-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editLabel}
                              onChange={(e) => setEditLabel(e.target.value)}
                              placeholder="e.g. Home, Office..."
                              className="px-2 py-0.5 rounded bg-slate-800 border border-slate-600 text-xs text-slate-100 outline-none w-36"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(fav.busStopCode)}
                              className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-500"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                            {fav.customLabel ? `🏷️ ${fav.customLabel}` : stop?.Description}
                          </span>
                        )}
                      </div>

                      <div className="mt-1.5 text-xs text-slate-300 font-medium">
                        {stop?.Description}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {stop?.RoadName}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(fav.busStopCode, fav.customLabel)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-slate-800"
                          title="Rename label"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={() => onRemoveFavorite(fav.busStopCode)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete from saved"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (stop) {
                            onSelectStop(stop);
                            onClose();
                          }
                        }}
                        className="p-1.5 rounded-lg text-emerald-400 hover:bg-slate-800"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 text-xs text-slate-400 flex items-center justify-between">
          <span>Synced locally to browser storage</span>
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
