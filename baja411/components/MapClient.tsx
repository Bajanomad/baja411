"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useMemo, useRef, useState } from "react";

interface Pin {
  id: string;
  title: string;
  description?: string | null;
  lat: number;
  lng: number;
  category: string;
  author?: { name?: string | null } | null;
}

interface SessionUser {
  id?: string;
  name?: string | null;
  email?: string | null;
}

type MapMode = "DRIVE" | "PLAN";

const CATEGORIES = [
  "BOONDOCKING",
  "BEACH",
  "WATER_FILL",
  "DUMP_STATION",
  "MECHANIC",
  "FUEL",
  "TRAILHEAD",
  "FISHING",
  "MARKET",
  "OTHER",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  BOONDOCKING: "Boondocking",
  BEACH: "Beach",
  WATER_FILL: "Water Fill",
  DUMP_STATION: "Dump Station",
  MECHANIC: "Mechanic",
  FUEL: "Fuel",
  TRAILHEAD: "Trailhead",
  FISHING: "Fishing",
  MARKET: "Market",
  OTHER: "Other",
};

const CATEGORY_EMOJI: Record<string, string> = {
  BOONDOCKING: "🏕️",
  BEACH: "🏖️",
  WATER_FILL: "💧",
  DUMP_STATION: "🚽",
  MECHANIC: "🔧",
  FUEL: "⛽",
  TRAILHEAD: "🥾",
  FISHING: "🎣",
  MARKET: "🛒",
  OTHER: "📍",
};

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function createEmojiIcon(category: string): L.DivIcon {
  const emoji = CATEGORY_EMOJI[category] ?? "📍";
  return L.divIcon({
    html: `<div style="font-size:24px;line-height:1;filter:drop-shadow(0 1px 4px rgba(0,0,0,0.5))">${emoji}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 24],
  });
}

const TEMP_ICON = L.divIcon({
  html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 1px 4px rgba(0,0,0,0.6))">📌</div>`,
  className: "",
  iconSize: [28, 32],
  iconAnchor: [8, 30],
});

function panelStyle(dark: boolean) {
  return dark
    ? { background: "rgba(10,16,26,0.92)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderColor: "rgba(255,255,255,0.10)" }
    : { background: "rgba(255,255,255,0.94)", backdropFilter: "blur(18px)", WebkitBackdropFilter: "blur(18px)", borderColor: "rgba(0,0,0,0.10)" };
}

function pinMatchesSearch(pin: Pin, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const label = CATEGORY_LABELS[pin.category] ?? pin.category;
  return [pin.title, pin.description ?? "", label, pin.category]
    .join(" ")
    .toLowerCase()
    .includes(q);
}

export default function MapClient() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tempMarkerRef = useRef<L.Marker | null>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const addModeRef = useRef(false);
  const followRef = useRef(false);
  const modeRef = useRef<MapMode>("DRIVE");
  const snapBackTimerRef = useRef<number | null>(null);

  const [pins, setPins] = useState<Pin[]>([]);
  const [session, setSession] = useState<{ user?: SessionUser } | null>(null);
  const [mode, setMode] = useState<MapMode>("DRIVE");
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingLatLng, setPendingLatLng] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [following, setFollowing] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    () => new Set(CATEGORIES as unknown as string[])
  );
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("baja411-map-dark") === "1";
  });

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("BOONDOCKING");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const visiblePins = useMemo(() => {
    return pins.filter((pin) => visibleCategories.has(pin.category) && pinMatchesSearch(pin, search));
  }, [pins, search, visibleCategories]);

  useEffect(() => { followRef.current = following; }, [following]);
  useEffect(() => { modeRef.current = mode; }, [mode]);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data?.user ? data : null))
      .catch(() => setSession(null));

    fetch("/api/pins")
      .then((res) => res.json())
      .then((data) => setPins(Array.isArray(data) ? data : []))
      .catch(() => setPins([]));
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(mapContainerRef.current, {
      center: [23.5, -110.0],
      zoom: 8,
      zoomControl: false,
      attributionControl: false,
    });

    const initialDark = localStorage.getItem("baja411-map-dark") === "1";
    tileLayerRef.current = L.tileLayer(initialDark ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR,
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    map.on("dragstart zoomstart", () => {
      setFollowing(false);
      if (snapBackTimerRef.current !== null) window.clearTimeout(snapBackTimerRef.current);
      if (modeRef.current === "DRIVE") {
        snapBackTimerRef.current = window.setTimeout(() => {
          setFollowing(true);
          const current = locationMarkerRef.current?.getLatLng();
          if (current) map.setView(current, Math.max(map.getZoom(), 14), { animate: true });
        }, 12000);
      }
    });

    map.on("click", (event: L.LeafletMouseEvent) => {
      if (!addModeRef.current) return;
      tempMarkerRef.current?.remove();
      tempMarkerRef.current = L.marker([event.latlng.lat, event.latlng.lng], { icon: TEMP_ICON }).addTo(map);
      setPendingLatLng([event.latlng.lat, event.latlng.lng]);
    });

    mapRef.current = map;
    startTracking();

    return () => {
      if (snapBackTimerRef.current !== null) window.clearTimeout(snapBackTimerRef.current);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    localStorage.setItem("baja411-map-dark", dark ? "1" : "0");
    tileLayerRef.current?.remove();
    tileLayerRef.current = L.tileLayer(dark ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR,
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);
  }, [dark]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    visiblePins.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng], { icon: createEmojiIcon(pin.category) });
      marker.on("click", () => {
        setSelectedPin(pin);
        if (modeRef.current === "DRIVE") setMode("PLAN");
        map.setView([pin.lat, pin.lng], Math.max(map.getZoom(), 13), { animate: true });
      });
      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [visiblePins]);

  useEffect(() => {
    const placing = showAddModal && !pendingLatLng;
    addModeRef.current = placing;
    if (mapRef.current) mapRef.current.getContainer().style.cursor = placing ? "crosshair" : "";
    if (!showAddModal) {
      tempMarkerRef.current?.remove();
      tempMarkerRef.current = null;
      setPendingLatLng(null);
      addModeRef.current = false;
    }
  }, [showAddModal, pendingLatLng]);

  function startTracking() {
    if (!navigator.geolocation || watchIdRef.current !== null) return;
    setLocating(true);
    setFollowing(true);

    const dot = L.divIcon({
      html: `<div style="position:relative;width:22px;height:22px">
        <div class="location-pulse-ring" style="position:absolute;inset:0;border-radius:50%;background:rgba(42,122,90,0.45)"></div>
        <div style="position:absolute;inset:3px;border-radius:50%;background:#2A7A5A;border:2.5px solid white;box-shadow:0 0 10px rgba(42,122,90,0.7)"></div>
      </div>`,
      className: "",
      iconSize: [22, 22],
      iconAnchor: [11, 11],
    });

    let firstFix = true;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapRef.current;
        if (!map) return;

        if (!locationMarkerRef.current) {
          locationMarkerRef.current = L.marker([latitude, longitude], { icon: dot }).addTo(map);
        } else {
          locationMarkerRef.current.setLatLng([latitude, longitude]);
        }

        if (firstFix || followRef.current) {
          map.setView([latitude, longitude], firstFix ? 14 : map.getZoom(), { animate: true });
          firstFix = false;
        }

        setLocating(false);
        setTracking(true);
      },
      () => {
        setLocating(false);
        setTracking(false);
        setFollowing(false);
      },
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 5000 }
    );
  }

  function recenter() {
    if (!tracking) {
      startTracking();
      return;
    }
    const current = locationMarkerRef.current?.getLatLng();
    if (!current || !mapRef.current) return;
    setFollowing(true);
    mapRef.current.setView(current, Math.max(mapRef.current.getZoom(), 14), { animate: true });
  }

  function switchToDrive() {
    setMode("DRIVE");
    setShowCategoryMenu(false);
    setSelectedPin(null);
    setSearch("");
    recenter();
  }

  function switchToPlan() {
    setMode("PLAN");
    setFollowing(false);
  }

  function toggleCategory(category: string) {
    setVisibleCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function handleAddPinClick() {
    if (!session?.user) {
      window.location.href = "/signin";
      return;
    }
    setMode("PLAN");
    setFormTitle("");
    setFormDescription("");
    setFormCategory("BOONDOCKING");
    setSubmitError("");
    setPendingLatLng(null);
    setShowAddModal(true);
  }

  async function handleSubmitPin(event: React.FormEvent) {
    event.preventDefault();
    if (!pendingLatLng) {
      setSubmitError("Tap the map to set a location first.");
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          description: formDescription || null,
          lat: pendingLatLng[0],
          lng: pendingLatLng[1],
          category: formCategory,
        }),
      });

      if (res.status === 401) {
        window.location.href = "/signin";
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error ?? "Something went wrong.");
        return;
      }

      setShowAddModal(false);
      fetch("/api/pins").then((r) => r.json()).then((data) => setPins(Array.isArray(data) ? data : [])).catch(() => {});
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const textPrimary = dark ? "text-white/90" : "text-foreground";
  const textMuted = dark ? "text-white/50" : "text-muted";
  const floating = "rounded-full border shadow-lg";
  const panel = panelStyle(dark);

  return (
    <>
      <div className={`relative h-full w-full ${dark ? "bg-[#060d18]" : "bg-sand"}`}>
        <div ref={mapContainerRef} className="absolute inset-0" />

        <div className="absolute left-3 right-3 top-3 z-[1000] flex items-center gap-2">
          {mode === "DRIVE" ? (
            <div className={`flex items-center gap-2 px-3 py-2 ${floating} ${dark ? "text-white" : "text-foreground"}`} style={panel}>
              <span className="text-xs font-extrabold">Drive</span>
              <span className={`text-[10px] ${textMuted}`}>{locating ? "Finding GPS" : following ? "Tracking" : tracking ? "Paused" : "No GPS"}</span>
            </div>
          ) : (
            <div className={`flex-1 flex items-center gap-2 px-3 py-2 ${floating}`} style={panel}>
              <span className="text-sm">🔎</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search Baja411"
                className={`w-full bg-transparent text-sm outline-none ${dark ? "text-white placeholder-white/40" : "text-foreground placeholder-muted"}`}
              />
              {search && <button onClick={() => setSearch("")} className={`text-xs font-bold ${textMuted}`}>Clear</button>}
            </div>
          )}

          <button onClick={mode === "DRIVE" ? switchToPlan : switchToDrive} className={`px-4 py-2 text-xs font-extrabold ${floating} ${dark ? "text-white" : "text-foreground"}`} style={panel}>
            {mode === "DRIVE" ? "Plan" : "Drive"}
          </button>
        </div>

        <div className="absolute right-3 bottom-20 z-[1000] flex flex-col gap-2">
          {mode === "PLAN" && (
            <button onClick={() => setShowCategoryMenu((v) => !v)} className={`w-11 h-11 text-lg ${floating}`} style={panel} aria-label="Layers">☰</button>
          )}
          {mode === "PLAN" && (
            <button onClick={handleAddPinClick} className="w-11 h-11 rounded-full border shadow-lg bg-jade text-white text-2xl font-light" aria-label="Add pin">+</button>
          )}
          <button onClick={recenter} className={`w-11 h-11 text-lg ${floating} ${following ? "text-jade" : ""}`} style={panel} aria-label="Recenter">◎</button>
        </div>

        {mode === "PLAN" && showCategoryMenu && (
          <div className="absolute left-3 right-3 bottom-4 z-[1000] rounded-2xl border shadow-xl p-3" style={panel}>
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-extrabold ${textPrimary}`}>Show pins</p>
              <div className="flex gap-3">
                <button onClick={() => setVisibleCategories(new Set(CATEGORIES as unknown as string[]))} className="text-xs font-bold text-jade">All</button>
                <button onClick={() => setVisibleCategories(new Set())} className={`text-xs font-bold ${textMuted}`}>None</button>
                <button onClick={() => setDark((v) => !v)} className={`text-xs font-bold ${textMuted}`}>{dark ? "Light" : "Dark"}</button>
              </div>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(CATEGORIES as unknown as string[]).map((category) => {
                const on = visibleCategories.has(category);
                return (
                  <button key={category} onClick={() => toggleCategory(category)} className={`px-3 py-2 rounded-full border text-xs font-bold whitespace-nowrap ${on ? "bg-jade text-white border-jade" : dark ? "bg-white/10 border-white/10 text-white/45" : "bg-white border-black/10 text-muted"}`}>
                    {CATEGORY_EMOJI[category]} {CATEGORY_LABELS[category]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mode === "PLAN" && search && (
          <div className={`absolute left-4 bottom-20 z-[1000] px-3 py-2 rounded-full text-xs font-bold border shadow-lg ${textPrimary}`} style={panel}>
            {visiblePins.length} result{visiblePins.length === 1 ? "" : "s"}
          </div>
        )}
      </div>

      {selectedPin && (
        <div className="fixed inset-x-0 bottom-0 z-[200000] px-3 pb-3 pointer-events-none">
          <div className="pointer-events-auto max-w-md mx-auto rounded-2xl border shadow-2xl p-4" style={panelStyle(dark)}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{CATEGORY_EMOJI[selectedPin.category] ?? "📍"}</span>
              <div className="min-w-0 flex-1">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>{CATEGORY_LABELS[selectedPin.category] ?? selectedPin.category}</p>
                <h2 className={`font-extrabold text-base leading-tight ${textPrimary}`}>{selectedPin.title}</h2>
                {selectedPin.description && <p className={`text-sm mt-1 leading-relaxed ${textMuted}`}>{selectedPin.description}</p>}
                <div className="flex gap-2 mt-3">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPin.lat},${selectedPin.lng}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-jade text-white text-xs font-bold">Directions</a>
                  <button onClick={() => setSelectedPin(null)} className={`px-4 py-2 rounded-full text-xs font-bold border ${dark ? "border-white/10 text-white/70" : "border-black/10 text-muted"}`}>Close</button>
                </div>
              </div>
              <button onClick={() => setSelectedPin(null)} className={`text-xl leading-none ${textMuted}`}>×</button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && !pendingLatLng && (
        <div className="fixed bottom-20 left-1/2 z-[200000] flex -translate-x-1/2 items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl" style={panelStyle(dark)}>
          <span className="text-xl">📌</span>
          <span className={`text-sm font-semibold ${textPrimary}`}>Tap the map</span>
          <button onClick={() => setShowAddModal(false)} className={`text-xl leading-none ${textMuted}`}>×</button>
        </div>
      )}

      {showAddModal && pendingLatLng && (
        <div className="fixed inset-0 z-[200000] flex items-end sm:items-center justify-center sm:p-4" style={{ background: "rgba(6,13,24,0.65)" }} onClick={(event) => { if (event.target === event.currentTarget) setShowAddModal(false); }}>
          <div className="w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl border p-6 shadow-2xl max-h-[90vh] overflow-y-auto" style={panelStyle(dark)}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`font-bold text-lg ${textPrimary}`}>Add pin</h2>
              <button onClick={() => setShowAddModal(false)} className={`text-xl leading-none ${textMuted}`}>×</button>
            </div>
            <form onSubmit={handleSubmitPin} className="space-y-4">
              <input type="text" value={formTitle} onChange={(event) => setFormTitle(event.target.value)} required placeholder="Name this spot" className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${dark ? "bg-white/10 border-white/10 text-white placeholder-white/30" : "bg-white border-black/10 text-foreground"}`} />
              <textarea value={formDescription} onChange={(event) => setFormDescription(event.target.value)} placeholder="Useful details" rows={3} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none ${dark ? "bg-white/10 border-white/10 text-white placeholder-white/30" : "bg-white border-black/10 text-foreground"}`} />
              <select value={formCategory} onChange={(event) => setFormCategory(event.target.value)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${dark ? "bg-[#0f1824] border-white/10 text-white" : "bg-white border-black/10 text-foreground"}`}>
                {(CATEGORIES as unknown as string[]).map((category) => <option key={category} value={category}>{CATEGORY_EMOJI[category]} {CATEGORY_LABELS[category]}</option>)}
              </select>
              {submitError && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{submitError}</p>}
              <button type="submit" disabled={submitting} className="w-full px-4 py-3 rounded-xl bg-jade text-white text-sm font-bold disabled:opacity-50">
                {submitting ? "Submitting" : "Submit pin"}
              </button>
              <p className={`text-xs text-center ${textMuted}`}>Pins are reviewed before appearing.</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
