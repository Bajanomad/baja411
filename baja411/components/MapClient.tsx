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

const CATEGORY_SEARCH_TERMS: Record<string, string[]> = {
  BOONDOCKING: ["boondocking", "camp", "camping", "rv", "overnight", "sleep"],
  BEACH: ["beach", "playa", "swim", "surf", "ocean"],
  WATER_FILL: ["water", "agua", "water fill", "fill water", "drinking water"],
  DUMP_STATION: ["dump", "dump station", "rv dump", "sewer", "black water"],
  MECHANIC: ["mechanic", "mechanics", "repair", "tire", "llanta", "taller", "auto repair"],
  FUEL: ["fuel", "gas", "gas station", "gasoline", "diesel", "pemex", "station"],
  TRAILHEAD: ["trail", "trailhead", "hike", "hiking", "sendero"],
  FISHING: ["fish", "fishing", "pesca", "launch", "boat ramp"],
  MARKET: ["market", "store", "grocery", "mercado", "food", "super", "tienda"],
  OTHER: ["other", "spot", "place", "pin"],
};

const TOWNS = [
  { name: "La Paz", aliases: ["la paz", "lapaz"], lat: 24.1426, lng: -110.3128, zoom: 13 },
  { name: "Todos Santos", aliases: ["todos santos", "todo santos"], lat: 23.4464, lng: -110.2265, zoom: 13 },
  { name: "El Pescadero", aliases: ["pescadero", "el pescadero", "pasadero", "pescadaro"], lat: 23.3655, lng: -110.1689, zoom: 13 },
  { name: "Cerritos", aliases: ["cerritos", "los cerritos", "playa cerritos"], lat: 23.3312, lng: -110.1776, zoom: 14 },
  { name: "Cabo San Lucas", aliases: ["cabo", "cabo san lucas", "san lucas"], lat: 22.8905, lng: -109.9167, zoom: 13 },
  { name: "San José del Cabo", aliases: ["san jose", "san jose del cabo", "sjc"], lat: 23.0617, lng: -109.7086, zoom: 13 },
  { name: "Loreto", aliases: ["loreto"], lat: 26.0118, lng: -111.3430, zoom: 13 },
  { name: "Los Barriles", aliases: ["los barriles", "barriles"], lat: 23.6823, lng: -109.6995, zoom: 13 },
  { name: "La Ventana", aliases: ["la ventana", "ventana"], lat: 24.0460, lng: -109.9938, zoom: 13 },
  { name: "El Sargento", aliases: ["el sargento", "sargento"], lat: 24.0807, lng: -110.0184, zoom: 13 },
  { name: "Santiago", aliases: ["santiago"], lat: 23.4772, lng: -109.7187, zoom: 13 },
  { name: "Miraflores", aliases: ["miraflores"], lat: 23.3695, lng: -109.7748, zoom: 13 },
];

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

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
    ? {
        background: "rgba(5,12,22,0.96)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderColor: "rgba(255,255,255,0.18)",
        color: "#f8fafc",
      }
    : {
        background: "rgba(255,255,255,0.96)",
        backdropFilter: "blur(18px)",
        WebkitBackdropFilter: "blur(18px)",
        borderColor: "rgba(15,23,42,0.14)",
        color: "#111827",
      };
}

function findTown(query: string) {
  const q = normalizeText(query);
  if (!q) return null;
  return TOWNS.find((town) => town.aliases.some((alias) => q.includes(normalizeText(alias)))) ?? null;
}

function findCategory(query: string) {
  const q = normalizeText(query);
  if (!q) return null;
  return (
    Object.entries(CATEGORY_SEARCH_TERMS).find(([, terms]) =>
      terms.some((term) => q.includes(normalizeText(term)))
    )?.[0] ?? null
  );
}

function pinMatchesSearch(pin: Pin, query: string) {
  const q = normalizeText(query);
  if (!q) return true;
  const label = CATEGORY_LABELS[pin.category] ?? pin.category;
  const categoryTerms = CATEGORY_SEARCH_TERMS[pin.category] ?? [];
  return [pin.title, pin.description ?? "", label, pin.category, ...categoryTerms]
    .map(normalizeText)
    .join(" ")
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
  const [lastSearchHint, setLastSearchHint] = useState("");
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
    setLastSearchHint("");
    recenter();
  }

  function switchToPlan() {
    setMode("PLAN");
    setFollowing(false);
  }

  function fitPins(matches: Pin[]) {
    const map = mapRef.current;
    if (!map || matches.length === 0) return;
    if (matches.length === 1) {
      map.setView([matches[0].lat, matches[0].lng], Math.max(map.getZoom(), 14), { animate: true });
      return;
    }
    const bounds = L.latLngBounds(matches.map((pin) => [pin.lat, pin.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [44, 44], maxZoom: 14, animate: true });
  }

  function handleSearchSubmit(event?: React.FormEvent) {
    event?.preventDefault();
    const q = search.trim();
    const map = mapRef.current;
    if (!q || !map) return;

    setShowCategoryMenu(false);
    setFollowing(false);

    const town = findTown(q);
    if (town) {
      map.setView([town.lat, town.lng], town.zoom, { animate: true });
      setLastSearchHint(`Centered on ${town.name}`);
      return;
    }

    const category = findCategory(q);
    const activeCategories = category ? new Set([category]) : visibleCategories;
    if (category) setVisibleCategories(activeCategories);

    const matches = pins.filter((pin) => activeCategories.has(pin.category) && pinMatchesSearch(pin, q));
    fitPins(matches);
    setLastSearchHint(matches.length ? `${matches.length} result${matches.length === 1 ? "" : "s"}` : "No results yet");
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

  const panel = panelStyle(dark);
  const textPrimary = dark ? "text-white" : "text-slate-950";
  const textMuted = dark ? "text-slate-300" : "text-slate-600";
  const textSoft = dark ? "text-slate-400" : "text-slate-500";
  const floating = "rounded-full border shadow-xl";
  const activeMode = "bg-jade text-white shadow-sm";
  const inactiveMode = dark ? "text-slate-200 hover:bg-white/10" : "text-slate-700 hover:bg-black/5";
  const iconButton = `w-12 h-12 ${floating} flex items-center justify-center text-lg font-extrabold`;

  return (
    <>
      <div className={`relative h-full w-full ${dark ? "bg-[#060d18]" : "bg-sand"}`}>
        <div ref={mapContainerRef} className="absolute inset-0" />

        <div className="absolute left-3 right-3 top-3 z-[1000] flex items-start gap-2">
          <div className="flex-1 min-w-0 space-y-2">
            <div className={`inline-flex rounded-full border p-1 shadow-xl ${dark ? "bg-[#050c16]/95 border-white/20" : "bg-white/95 border-black/10"}`}>
              <button onClick={switchToDrive} className={`px-4 py-2 rounded-full text-xs font-extrabold transition ${mode === "DRIVE" ? activeMode : inactiveMode}`}>
                Drive
              </button>
              <button onClick={switchToPlan} className={`px-4 py-2 rounded-full text-xs font-extrabold transition ${mode === "PLAN" ? activeMode : inactiveMode}`}>
                Plan
              </button>
            </div>

            {mode === "PLAN" && (
              <form onSubmit={handleSearchSubmit} className={`flex items-center gap-2 rounded-full border px-4 py-3 shadow-xl max-w-xl ${dark ? "bg-[#050c16]/95 border-white/20" : "bg-white/95 border-black/10"}`}>
                <span className="text-sm">🔎</span>
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setLastSearchHint("");
                  }}
                  placeholder="Search towns, fuel, water, beaches"
                  enterKeyHint="search"
                  className={`w-full bg-transparent text-base outline-none ${dark ? "text-white placeholder-slate-400" : "text-slate-950 placeholder-slate-500"}`}
                />
                {search && <button type="button" onClick={() => { setSearch(""); setLastSearchHint(""); }} className={`text-xs font-extrabold ${textMuted}`}>Clear</button>}
                <button type="submit" className="rounded-full bg-jade px-3 py-1.5 text-xs font-extrabold text-white">Go</button>
              </form>
            )}
          </div>

          <button onClick={() => setDark((value) => !value)} className={`${iconButton} ${dark ? "text-white" : "text-slate-950"}`} style={panel} aria-label="Toggle map style">
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {mode === "DRIVE" && (
          <div className={`absolute left-3 bottom-5 z-[1000] rounded-full border px-4 py-3 shadow-xl ${dark ? "bg-[#050c16]/95 border-white/20" : "bg-white/95 border-black/10"}`}>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${following ? "bg-jade" : tracking ? "bg-yellow-400" : "bg-red-500"}`} />
              <span className={`text-sm font-extrabold ${textPrimary}`}>{locating ? "Finding GPS" : following ? "Tracking" : tracking ? "Paused" : "Location off"}</span>
            </div>
          </div>
        )}

        <div className="absolute right-3 bottom-5 z-[1000] flex flex-col gap-3">
          {mode === "PLAN" && (
            <button onClick={() => setShowCategoryMenu((value) => !value)} className={`${iconButton} ${dark ? "text-white" : "text-slate-950"}`} style={panel} aria-label="Layers">☰</button>
          )}
          {mode === "PLAN" && (
            <button onClick={handleAddPinClick} className="w-12 h-12 rounded-full border border-jade/70 shadow-xl bg-jade text-white text-2xl font-light" aria-label="Add pin">+</button>
          )}
          <button onClick={recenter} className={`${iconButton} ${following ? "text-jade" : dark ? "text-white" : "text-slate-950"}`} style={panel} aria-label="Recenter">◎</button>
        </div>

        {mode === "PLAN" && showCategoryMenu && (
          <div className="absolute left-3 right-3 bottom-5 z-[1000] rounded-3xl border shadow-2xl p-4" style={panel}>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <p className={`text-sm font-extrabold ${textPrimary}`}>Map filters</p>
                <p className={`text-xs ${textSoft}`}>{visiblePins.length} visible pins</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setVisibleCategories(new Set(CATEGORIES as unknown as string[]))} className="px-3 py-2 rounded-full bg-jade text-white text-xs font-extrabold">All</button>
                <button onClick={() => setVisibleCategories(new Set())} className={`px-3 py-2 rounded-full border text-xs font-extrabold ${dark ? "border-white/20 text-white" : "border-black/10 text-slate-700"}`}>None</button>
                <button onClick={() => setShowCategoryMenu(false)} className={`px-3 py-2 rounded-full border text-xs font-extrabold ${dark ? "border-white/20 text-white" : "border-black/10 text-slate-700"}`}>Done</button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {(CATEGORIES as unknown as string[]).map((category) => {
                const on = visibleCategories.has(category);
                return (
                  <button key={category} onClick={() => toggleCategory(category)} className={`px-3 py-3 rounded-2xl border text-xs font-extrabold text-left transition ${on ? "bg-jade text-white border-jade" : dark ? "bg-white/8 border-white/15 text-slate-200" : "bg-white border-black/10 text-slate-700"}`}>
                    <span className="mr-1.5">{CATEGORY_EMOJI[category]}</span>
                    {CATEGORY_LABELS[category]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mode === "PLAN" && (search || lastSearchHint) && !showCategoryMenu && (
          <div className={`absolute left-4 bottom-5 z-[1000] px-4 py-3 rounded-full text-sm font-extrabold border shadow-xl ${textPrimary}`} style={panel}>
            {lastSearchHint || `${visiblePins.length} result${visiblePins.length === 1 ? "" : "s"}`}
          </div>
        )}
      </div>

      {selectedPin && (
        <div className="fixed inset-x-0 bottom-0 z-[200000] px-3 pb-3 pointer-events-none">
          <div className="pointer-events-auto max-w-md mx-auto rounded-3xl border shadow-2xl p-4" style={panelStyle(dark)}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{CATEGORY_EMOJI[selectedPin.category] ?? "📍"}</span>
              <div className="min-w-0 flex-1">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${textSoft}`}>{CATEGORY_LABELS[selectedPin.category] ?? selectedPin.category}</p>
                <h2 className={`font-extrabold text-lg leading-tight ${textPrimary}`}>{selectedPin.title}</h2>
                {selectedPin.description && <p className={`text-sm mt-1 leading-relaxed ${textMuted}`}>{selectedPin.description}</p>}
                <div className="flex gap-2 mt-4">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPin.lat},${selectedPin.lng}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-full bg-jade text-white text-xs font-bold">Directions</a>
                  <button onClick={() => setSelectedPin(null)} className={`px-4 py-2 rounded-full text-xs font-bold border ${dark ? "border-white/20 text-white" : "border-black/10 text-slate-700"}`}>Close</button>
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
              <input type="text" value={formTitle} onChange={(event) => setFormTitle(event.target.value)} required placeholder="Name this spot" className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${dark ? "bg-white/10 border-white/20 text-white placeholder-slate-400" : "bg-white border-black/10 text-slate-950"}`} />
              <textarea value={formDescription} onChange={(event) => setFormDescription(event.target.value)} placeholder="Useful details" rows={3} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none ${dark ? "bg-white/10 border-white/20 text-white placeholder-slate-400" : "bg-white border-black/10 text-slate-950"}`} />
              <select value={formCategory} onChange={(event) => setFormCategory(event.target.value)} className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${dark ? "bg-[#0f1824] border-white/20 text-white" : "bg-white border-black/10 text-slate-950"}`}>
                {(CATEGORIES as unknown as string[]).map((category) => <option key={category} value={category}>{CATEGORY_EMOJI[category]} {CATEGORY_LABELS[category]}</option>)}
              </select>
              {submitError && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{submitError}</p>}
              <button type="submit" disabled={submitting} className="w-full px-4 py-3 rounded-xl bg-jade text-white text-sm font-bold disabled:opacity-50">
                {submitting ? "Submitting" : "Submit pin"}
              </button>
              <p className={`text-xs text-center ${textSoft}`}>Pins are reviewed before appearing.</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
