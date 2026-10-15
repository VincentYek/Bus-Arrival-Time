/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  BusStop,
  BusArrivalService,
  LiveBusVehicle,
  BusRoute,
  FavoriteStop,
  ActiveBusAlarm
} from './types/bus';
import { SINGAPORE_BUS_STOPS, BUS_ROUTES } from './data/singaporeBuses';
import { busEngine } from './services/busSimulation';
import { playArrivalChime } from './utils/audioAlert';
import { Header } from './components/Header';
import { BusStopSelector } from './components/BusStopSelector';
import { BusArrivalCard } from './components/BusArrivalCard';
import { InteractiveMap } from './components/InteractiveMap';
import { BusRouteDrawer } from './components/BusRouteDrawer';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { SettingsModal } from './components/SettingsModal';
import { ActiveAlarmBanner } from './components/ActiveAlarmBanner';
import {
  Star,
  RefreshCw,
  Compass,
  Bus,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export default function App() {
  // Current selected bus stop (defaults to Orchard Stn/Lucky Plaza - 09048)
  const [selectedStop, setSelectedStop] = useState<BusStop>(() => {
    return SINGAPORE_BUS_STOPS.find((s) => s.BusStopCode === '09048') || SINGAPORE_BUS_STOPS[0];
  });

  // Real-time arrivals for selected stop
  const [arrivals, setArrivals] = useState<BusArrivalService[]>([]);
  // Live bus vehicles
  const [liveBuses, setLiveBuses] = useState<LiveBusVehicle[]>([]);
  // Selected route for inspection
  const [selectedRoute, setSelectedRoute] = useState<BusRoute | null>(null);
  // View mode
  const [viewMode, setViewMode] = useState<'both' | 'map' | 'list'>('both');

  // Favorites
  const [favorites, setFavorites] = useState<FavoriteStop[]>(() => {
    try {
      const stored = localStorage.getItem('sg_buspulse_favorites');
      return stored ? JSON.parse(stored) : [
        { busStopCode: '09048', customLabel: 'Orchard Shopping Hub', addedAt: Date.now() },
        { busStopCode: '03539', customLabel: 'Marina Bay Sands', addedAt: Date.now() }
      ];
    } catch {
      return [];
    }
  });

  // Active arrival alarms
  const [alarms, setAlarms] = useState<ActiveBusAlarm[]>(() => {
    try {
      const stored = localStorage.getItem('sg_buspulse_alarms');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // UI Modals
  const [showFavorites, setShowFavorites] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // User GPS
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  // Search filter for services inside selected stop
  const [serviceFilter, setServiceFilter] = useState('');

  // Persist favorites
  useEffect(() => {
    localStorage.setItem('sg_buspulse_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Persist alarms
  useEffect(() => {
    localStorage.setItem('sg_buspulse_alarms', JSON.stringify(alarms));
  }, [alarms]);

  // Refresh arrivals and vehicles
  const refreshData = useCallback(() => {
    if (!selectedStop) return;
    const currentArrivals = busEngine.getBusStopArrivals(selectedStop.BusStopCode);
    const currentVehicles = busEngine.getLiveVehicles();
    setArrivals(currentArrivals);
    setLiveBuses(currentVehicles);

    // Check alarms
    setAlarms((prevAlarms) => {
      let alarmTriggered = false;
      const updated = prevAlarms.map((alarm) => {
        if (alarm.busStopCode === selectedStop.BusStopCode) {
          const matchService = currentArrivals.find((s) => s.ServiceNo === alarm.serviceNo);
          if (matchService && matchService.NextBus) {
            const sec = matchService.NextBus.secondsRemaining ?? 999;
            if (sec <= 120 && !alarm.notified) {
              alarmTriggered = true;
              return { ...alarm, notified: true };
            }
          }
        }
        return alarm;
      });

      if (alarmTriggered && soundEnabled) {
        playArrivalChime();
      }

      return updated;
    });
  }, [selectedStop, soundEnabled]);

  // Subscribe to engine ticks
  useEffect(() => {
    refreshData();
    const unsubscribe = busEngine.subscribe(() => {
      refreshData();
    });
    return () => unsubscribe();
  }, [refreshData]);

  // 1-second countdown decrement for smooth visual timers
  useEffect(() => {
    const timer = setInterval(() => {
      setArrivals((prev) =>
        prev.map((svc) => ({
          ...svc,
          NextBus: svc.NextBus
            ? { ...svc.NextBus, secondsRemaining: Math.max(0, (svc.NextBus.secondsRemaining ?? 0) - 1) }
            : null,
          NextBus2: svc.NextBus2
            ? { ...svc.NextBus2, secondsRemaining: Math.max(0, (svc.NextBus2.secondsRemaining ?? 0) - 1) }
            : null,
          NextBus3: svc.NextBus3
            ? { ...svc.NextBus3, secondsRemaining: Math.max(0, (svc.NextBus3.secondsRemaining ?? 0) - 1) }
            : null
        }))
      );
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Handle Manual Refresh
  const handleManualRefresh = () => {
    setIsRefreshing(true);
    refreshData();
    setTimeout(() => setIsRefreshing(false), 600);
  };

  // Toggle favorite stop
  const isCurrentStopFavorited = useMemo(() => {
    return favorites.some((f) => f.busStopCode === selectedStop.BusStopCode);
  }, [favorites, selectedStop]);

  const handleToggleCurrentStopFavorite = () => {
    if (isCurrentStopFavorited) {
      setFavorites(favorites.filter((f) => f.busStopCode !== selectedStop.BusStopCode));
    } else {
      setFavorites([
        ...favorites,
        {
          busStopCode: selectedStop.BusStopCode,
          customLabel: selectedStop.Description,
          addedAt: Date.now()
        }
      ]);
    }
  };

  // Toggle Service Pinned inside the stop
  const handleTogglePinService = (serviceNo: string) => {
    setFavorites((prev) => {
      const existing = prev.find((f) => f.busStopCode === selectedStop.BusStopCode);
      if (existing) {
        const pinned = existing.pinnedServices || [];
        const newPinned = pinned.includes(serviceNo)
          ? pinned.filter((s) => s !== serviceNo)
          : [...pinned, serviceNo];

        return prev.map((f) =>
          f.busStopCode === selectedStop.BusStopCode ? { ...f, pinnedServices: newPinned } : f
        );
      } else {
        return [
          ...prev,
          {
            busStopCode: selectedStop.BusStopCode,
            pinnedServices: [serviceNo],
            addedAt: Date.now()
          }
        ];
      }
    });
  };

  // Toggle 2-min arrival alarm
  const handleToggleAlarm = (serviceNo: string) => {
    const existing = alarms.find(
      (a) => a.busStopCode === selectedStop.BusStopCode && a.serviceNo === serviceNo
    );

    if (existing) {
      setAlarms(alarms.filter((a) => a.id !== existing.id));
    } else {
      const newAlarm: ActiveBusAlarm = {
        id: `alarm-${selectedStop.BusStopCode}-${serviceNo}-${Date.now()}`,
        busStopCode: selectedStop.BusStopCode,
        busStopName: selectedStop.Description,
        serviceNo,
        targetArrivalSeconds: 120,
        notified: false,
        createdTime: Date.now()
      };
      setAlarms([...alarms, newAlarm]);
      if (soundEnabled) {
        playArrivalChime(); // Brief confirmation tone
      }
    }
  };

  // Geolocation
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });

        // Find nearest bus stop
        const nearest = busEngine.getNearbyStops(latitude, longitude, 1)[0];
        if (nearest) {
          setSelectedStop(nearest);
        }
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation failed or denied, centering on Orchard:', err);
        // Fallback default
        setUserLocation({ lat: 1.3044, lng: 103.8341 });
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Select Route for details
  const handleSelectRoute = (serviceNo: string) => {
    const route = BUS_ROUTES.find((r) => r.ServiceNo === serviceNo);
    if (route) {
      setSelectedRoute(route);
    }
  };

  // Filtered & Sorted arrivals list (pinned services first)
  const displayedArrivals = useMemo(() => {
    let list = arrivals;
    if (serviceFilter.trim()) {
      const f = serviceFilter.toLowerCase().trim();
      list = list.filter((s) => s.ServiceNo.toLowerCase().includes(f));
    }

    const currentFav = favorites.find((f) => f.busStopCode === selectedStop.BusStopCode);
    const pinnedSet = new Set(currentFav?.pinnedServices || []);

    return [...list].sort((a, b) => {
      const aPinned = pinnedSet.has(a.ServiceNo);
      const bPinned = pinnedSet.has(b.ServiceNo);
      if (aPinned && !bPinned) return -1;
      if (!aPinned && bPinned) return 1;

      // Then by ETA of NextBus
      const aSec = a.NextBus?.secondsRemaining ?? 9999;
      const bSec = b.NextBus?.secondsRemaining ?? 9999;
      return aSec - bSec;
    });
  }, [arrivals, serviceFilter, favorites, selectedStop]);

  const currentFavEntry = favorites.find((f) => f.busStopCode === selectedStop.BusStopCode);
  const pinnedSet = new Set(currentFavEntry?.pinnedServices || []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <Header
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setShowFavorites(true)}
        onOpenSettings={() => setShowSettings(true)}
        onManualRefresh={handleManualRefresh}
        isRefreshing={isRefreshing}
        activeAlarmsCount={alarms.length}
        busesCount={liveBuses.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 flex flex-col gap-4">
        {/* Search & Location Bar */}
        <BusStopSelector
          selectedStop={selectedStop}
          onSelectStop={(stop) => {
            setSelectedStop(stop);
            setSelectedRoute(null);
          }}
          onLocateMe={handleLocateMe}
          isLocating={isLocating}
        />

        {/* Selected Bus Stop Card Banner */}
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 shrink-0">
              <MapPin className="w-6 h-6" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 shadow-sm">
                  {selectedStop.BusStopCode}
                </span>
                <span className="text-xs text-slate-400 font-semibold">
                  {selectedStop.RoadName}
                </span>
                {selectedStop.isInterchange && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/40">
                    Bus Interchange
                  </span>
                )}
                {selectedStop.mrtTransfer?.map((m) => (
                  <span key={m} className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono font-bold text-amber-300 border border-slate-700">
                    MRT {m}
                  </span>
                ))}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white mt-1 tracking-tight">
                {selectedStop.Description}
              </h2>

              <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                <span>{arrivals.length} bus services available at this stop</span>
                {selectedStop.distanceMeters !== undefined && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-400 font-mono font-medium">
                      ~{selectedStop.distanceMeters}m away from you
                    </span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              onClick={handleToggleCurrentStopFavorite}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                isCurrentStopFavorited
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:text-white hover:bg-slate-700'
              }`}
            >
              <Star className={`w-4 h-4 ${isCurrentStopFavorited ? 'fill-amber-400' : ''}`} />
              <span>{isCurrentStopFavorited ? 'Saved Stop' : 'Bookmark Stop'}</span>
            </button>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>

        {/* View Mode Content Container (Split Grid or Single) */}
        <div className={`grid gap-5 items-start ${
          viewMode === 'both'
            ? 'grid-cols-1 lg:grid-cols-12'
            : 'grid-cols-1'
        }`}>
          {/* Map Column */}
          {(viewMode === 'both' || viewMode === 'map') && (
            <div className={`h-[420px] sm:h-[540px] lg:h-[680px] sticky top-20 rounded-2xl overflow-hidden ${
              viewMode === 'both' ? 'lg:col-span-5' : 'w-full'
            }`}>
              <InteractiveMap
                stops={SINGAPORE_BUS_STOPS}
                selectedStop={selectedStop}
                onSelectStop={(s) => setSelectedStop(s)}
                liveBuses={liveBuses}
                selectedRoute={selectedRoute}
                userLocation={userLocation}
              />
            </div>
          )}

          {/* Bus Arrivals List Column */}
          {(viewMode === 'both' || viewMode === 'list') && (
            <div className={`space-y-4 ${
              viewMode === 'both' ? 'lg:col-span-7' : 'w-full'
            }`}>
              {/* Filter and stats row */}
              <div className="flex items-center justify-between gap-2 bg-slate-900/60 p-2.5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 flex-1">
                  <input
                    type="text"
                    value={serviceFilter}
                    onChange={(e) => setServiceFilter(e.target.value)}
                    placeholder="Filter service no. (e.g. 65, 190)..."
                    className="w-full max-w-xs px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 outline-none focus:border-emerald-500 font-medium"
                  />
                  {serviceFilter && (
                    <button
                      onClick={() => setServiceFilter('')}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Clear
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Auto-updating (1s)</span>
                </div>
              </div>

              {/* Arrivals Card Stream */}
              {displayedArrivals.length > 0 ? (
                <div className="space-y-3.5">
                  {displayedArrivals.map((service) => {
                    const isPinned = pinnedSet.has(service.ServiceNo);
                    const hasAlarm = alarms.some(
                      (a) => a.busStopCode === selectedStop.BusStopCode && a.serviceNo === service.ServiceNo
                    );

                    return (
                      <BusArrivalCard
                        key={service.ServiceNo}
                        service={service}
                        busStopCode={selectedStop.BusStopCode}
                        busStopName={selectedStop.Description}
                        isPinned={isPinned}
                        onTogglePin={handleTogglePinService}
                        onSelectRoute={handleSelectRoute}
                        hasActiveAlarm={hasAlarm}
                        onToggleAlarm={handleToggleAlarm}
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
                  <Bus className="w-10 h-10 text-slate-600 mx-auto mb-2" />
                  <p className="font-bold text-slate-200">No services matching filter</p>
                  <p className="text-xs text-slate-500 mt-1">Try clearing your search query above.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Floating Active Alarms Toast/Banner */}
      <ActiveAlarmBanner
        alarms={alarms}
        onDismissAlarm={(id) => setAlarms(alarms.filter((a) => a.id !== id))}
      />

      {/* Route Detail Drawer Modal */}
      {selectedRoute && (
        <BusRouteDrawer
          route={selectedRoute}
          currentStopCode={selectedStop.BusStopCode}
          liveBuses={liveBuses}
          onClose={() => setSelectedRoute(null)}
          onSelectStopCode={(code) => {
            const stp = SINGAPORE_BUS_STOPS.find((s) => s.BusStopCode === code);
            if (stp) setSelectedStop(stp);
          }}
        />
      )}

      {/* Favorites Drawer */}
      {showFavorites && (
        <FavoritesDrawer
          favorites={favorites}
          onSelectStop={(stop) => {
            setSelectedStop(stop);
            setSelectedRoute(null);
          }}
          onRemoveFavorite={(code) => setFavorites(favorites.filter((f) => f.busStopCode !== code))}
          onUpdateLabel={(code, label) => {
            setFavorites(favorites.map((f) => (f.busStopCode === code ? { ...f, customLabel: label } : f)));
          }}
          onClose={() => setShowFavorites(false)}
        />
      )}

      {/* Settings Modal */}
      {showSettings && (
        <SettingsModal
          onClose={() => setShowSettings(false)}
          soundEnabled={soundEnabled}
          onToggleSound={setSoundEnabled}
          onResetData={() => {
            localStorage.clear();
            setFavorites([]);
            setAlarms([]);
            setShowSettings(false);
          }}
        />
      )}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-900 bg-slate-950/80 px-4 py-4 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-1.5 justify-center sm:justify-start">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Built for Singapore Public Transport • Real-Time LTA Datamall v2 Protocol</span>
          </div>
          <div>
            <span>SG BusPulse • Covers SBS Transit, SMRT, Tower Transit & Go-Ahead</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
