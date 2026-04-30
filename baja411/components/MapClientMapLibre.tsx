"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import maplibregl, { type StyleSpecification } from "maplibre-gl";
import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { useBajaLocation } from "@/components/LocationProvider";
import PlanSearchPanel, { type SearchSuggestion } from "@/components/map/PlanSearchPanel";

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
type DeviceOrientationEventWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

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
  { name: "Loreto", aliases: ["loreto"], lat: 26.0118, lng: -111.343, zoom: 13 },
  { name: "Los Barriles", aliases: ["los barriles", "barriles"], lat: 23.6823, lng: -109.6995, zoom: 13 },
  { name: "La Ventana", aliases: ["la ventana", "ventana"], lat: 24.046, lng: -109.9938, zoom: 13 },
  { name: "El Sargento", aliases: ["el sargento", "sargento"], lat: 24.0807, lng: -110.0184, zoom: 13 },
  { name: "Santiago", aliases: ["santiago"], lat: 23.4772, lng: -109.7187, zoom: 13 },
  { name: "Miraflores", aliases: ["miraflores"], lat: 23.3695, lng: -109.7748, zoom: 13 },
];

const MAP_DARK_KEY = "baja411-map-dark";
const CARTO_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

const CARTO_LIGHT_TILES = [
  "https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  "https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  "https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
  "https://d.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
];

const CARTO_DARK_TILES = [
  "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  "https://d.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
];

function createRasterStyle(dark: boolean): StyleSpecification {
  return {
    version: 8,
    sources: {
      "carto-base": {
        type: "raster",
        tiles: dark ? CARTO_DARK_TILES : CARTO_LIGHT_TILES,
        tileSize: 256,
        attribution: CARTO_ATTRIBUTION,
      },
    },
    layers: [
      {
        id: "carto-base-layer",
        type: "raster",
        source: "carto-base",
        minzoom: 0,
        maxzoom: 22,
      },
    ],
  };
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
}

function headingDifference(from: number, to: number) {
  return ((to - from + 540) % 360) - 180;
}

function smoothHeading(current: number | null, next: number) {
  if (current === null) return normalizeDegrees(next);
  return normalizeDegrees(current + headingDifference(current, next) * 0.22);
}

function getHeading(event: DeviceOrientationEventWithCompass) {
  if (typeof event.webkitCompassHeading === "number") {
    return normalizeDegrees(event.webkitCompassHeading);
  }

  if (typeof event.alpha === "number") {
    return normalizeDegrees(360 - event.alpha);
  }

  return null;
}

function panelStyle(dark: boolean): CSSProperties {
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

function distanceKm(fromLng: number, fromLat: number, toLng: number, toLat: number) {
  const toRad = (degrees: number) => (degrees * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const dLat = toRad(toLat - fromLat);
  const dLng = toRad(toLng - fromLng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(fromLat)) * Math.cos(toRad(toLat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c;
}

function formatDistance(distance: number | null) {
  if (distance === null || !Number.isFinite(distance)) return null;
  if (distance < 1) {
    return `${Math.max(1, Math.round(distance * 1000))} m`;
  }
  return `${distance.toFixed(1)} km`;
}

function nearestTownLabel(lng: number, lat: number) {
  const closestTown = TOWNS.reduce<{ name: string; distance: number } | null>((closest, town) => {
    const dist = distanceKm(lng, lat, town.lng, town.lat);
    if (!closest || dist < closest.distance) return { name: town.name, distance: dist };
    return closest;
  }, null);
  return closestTown?.name ?? "Unknown area";
}

function createEmojiMarkerElement(category: string) {
  const element = document.createElement("button");
  element.type = "button";
  element.title = CATEGORY_LABELS[category] ?? category;
  element.textContent = CATEGORY_EMOJI[category] ?? "📍";
  element.style.width = "34px";
  element.style.height = "34px";
  element.style.border = "0";
  element.style.padding = "0";
  element.style.background = "transparent";
  element.style.fontSize = "25px";
  element.style.lineHeight = "1";
  element.style.cursor = "pointer";
  element.style.filter = "drop-shadow(0 2px 5px rgba(0,0,0,0.55))";
  element.style.transform = "translateY(-2px)";
  return element;
}

function createTempMarkerElement() {
  const element = document.createElement("div");
  element.textContent = "📌";
  element.style.width = "34px";
  element.style.height = "38px";
  element.style.fontSize = "30px";
  element.style.lineHeight = "1";
  element.style.filter = "drop-shadow(0 2px 5px rgba(0,0,0,0.65))";
  return element;
}

function createLocationMarkerElement() {
  const element = document.createElement("div");
  element.style.position = "relative";
  element.style.width = "24px";
  element.style.height = "24px";
  element.innerHTML = `
    <div class="location-pulse-ring" style="position:absolute;inset:0;border-radius:50%;background:rgba(42,122,90,0.45)"></div>
    <div style="position:absolute;inset:3px;border-radius:50%;background:#2A7A5A;border:2.5px solid white;box-shadow:0 0 10px rgba(42,122,90,0.7)"></div>
  `;
  return element;
}

function safeClearTimeout(timer: React.MutableRefObject<number | null>) {
  if (timer.current !== null) {
    window.clearTimeout(timer.current);
    timer.current = null;
  }
}

export default function MapClientMapLibre() {
  const { location } = useBajaLocation();
  const providerCenter: [number, number] = [location.lon, location.lat];
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const tempMarkerRef = useRef<maplibregl.Marker | null>(null);
  const locationMarkerRef = useRef<maplibregl.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const addModeRef = useRef(false);
  const followRef = useRef(false);
  const modeRef = useRef<MapMode>("DRIVE");
  const snapBackTimerRef = useRef<number | null>(null);
  const latestLocationRef = useRef<[number, number] | null>(null);
  const headingRef = useRef<number | null>(null);

  const [pins, setPins] = useState<Pin[]>([]);
  const [session, setSession] = useState<{ user?: SessionUser } | null>(null);
  const [mode, setMode] = useState<MapMode>("DRIVE");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPinWarningModal, setShowPinWarningModal] = useState(false);
  const [pendingLatLng, setPendingLatLng] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [following, setFollowing] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [search, setSearch] = useState("");
  const [lastSearchHint, setLastSearchHint] = useState("");
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    () => new Set(CATEGORIES as unknown as string[])
  );
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(MAP_DARK_KEY) === "1";
  });

  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("BOONDOCKING");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const visiblePins = useMemo(() => {
    return pins.filter((pin) => visibleCategories.has(pin.category) && pinMatchesSearch(pin, search));
  }, [pins, search, visibleCategories]);

  const searchSuggestions = useMemo(() => {
    if (mode !== "PLAN") return [] as SearchSuggestion[];
    const q = normalizeText(search);
    if (!q) return [] as SearchSuggestion[];

    const towns: SearchSuggestion[] = TOWNS.filter((town) => {
      const aliases = town.aliases.map(normalizeText);
      return normalizeText(town.name).includes(q) || aliases.some((alias) => alias.includes(q));
    })
      .slice(0, 4)
      .map((town) => ({
        id: `town-${town.name}`,
        type: "town",
        label: town.name,
        detail: "Town",
        query: town.name,
      }));

    const categories: SearchSuggestion[] = Object.entries(CATEGORY_LABELS)
      .filter(([category, label]) => {
        const terms = CATEGORY_SEARCH_TERMS[category] ?? [];
        return normalizeText(label).includes(q) || terms.some((term) => normalizeText(term).includes(q));
      })
      .slice(0, 4)
      .map(([category, label]) => ({
        id: `category-${category}`,
        type: "category",
        label,
        detail: "Category",
        query: label,
      }));

    const referencePoint = latestLocationRef.current ?? providerCenter;
    const matchingPins: SearchSuggestion[] = visiblePins
      .filter((pin) => pinMatchesSearch(pin, search))
      .map((pin) => {
        const categoryLabel = CATEGORY_LABELS[pin.category] ?? pin.category;
        const townLabel = nearestTownLabel(pin.lng, pin.lat);
        const distance =
          referencePoint
            ? distanceKm(referencePoint[0], referencePoint[1], pin.lng, pin.lat)
            : null;
        const formattedDistance = formatDistance(distance);
        const detail = formattedDistance
          ? `${categoryLabel} · ${formattedDistance} away · near ${townLabel}`
          : `${categoryLabel} · near ${townLabel}`;

        return {
          id: `pin-${pin.id}`,
          type: "pin" as const,
          label: pin.title,
          detail,
          query: pin.title,
          pinId: pin.id,
          distance: distance ?? Number.POSITIVE_INFINITY,
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 4)
      .map(({ distance: _distance, ...suggestion }) => suggestion);

    return [...towns, ...categories, ...matchingPins].slice(0, 8);
  }, [mode, search, visiblePins]);

  useEffect(() => {
    followRef.current = following;
  }, [following]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    fetch("/api/auth/session")
      .then((res) => res.json())
      .then((data) => setSession(data?.user ? data : null))
      .catch(() => setSession(null));

    refreshPins();
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const initialDark = localStorage.getItem(MAP_DARK_KEY) === "1";
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: createRasterStyle(initialDark),
      center: providerCenter,
      zoom: location.source === "gps" ? 14 : 13,
      attributionControl: false,
      dragRotate: true,
      pitchWithRotate: true,
      touchPitch: true,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true }), "bottom-left");
    map.touchZoomRotate.enableRotation();

    const handleUserMove = () => {
      setFollowing(false);
      safeClearTimeout(snapBackTimerRef);
      if (modeRef.current !== "DRIVE") return;

      snapBackTimerRef.current = window.setTimeout(() => {
        const latest = latestLocationRef.current;
        const activeMap = mapRef.current;
        if (!latest || !activeMap) return;

        setFollowing(true);
        activeMap.easeTo({
          center: latest,
          zoom: Math.max(activeMap.getZoom(), 14),
          bearing: headingRef.current ?? activeMap.getBearing(),
          duration: 700,
          essential: true,
        });
      }, 12000);
    };

    const handleMapClick = (event: maplibregl.MapMouseEvent) => {
      if (!addModeRef.current) return;
      const { lat, lng } = event.lngLat;
      tempMarkerRef.current?.remove();
      tempMarkerRef.current = new maplibregl.Marker({ element: createTempMarkerElement(), anchor: "bottom" })
        .setLngLat([lng, lat])
        .addTo(map);
      setPendingLatLng([lat, lng]);
    };

    map.on("dragstart", handleUserMove);
    map.on("rotatestart", handleUserMove);
    map.on("pitchstart", handleUserMove);
    map.on("click", handleMapClick);

    const canvas = map.getCanvas();
    canvas.addEventListener("wheel", handleUserMove, { passive: true });
    canvas.addEventListener("touchstart", handleUserMove, { passive: true });

    mapRef.current = map;
    startTracking();

    return () => {
      safeClearTimeout(snapBackTimerRef);
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      markersRef.current.forEach((marker) => marker.remove());
      tempMarkerRef.current?.remove();
      locationMarkerRef.current?.remove();
      canvas.removeEventListener("wheel", handleUserMove);
      canvas.removeEventListener("touchstart", handleUserMove);
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    localStorage.setItem(MAP_DARK_KEY, dark ? "1" : "0");
    map.setStyle(createRasterStyle(dark));
  }, [dark]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const next: [number, number] = [location.lon, location.lat];
    if (location.source === "gps") {
      latestLocationRef.current = next;
    }

    if (!locationMarkerRef.current) {
      locationMarkerRef.current = new maplibregl.Marker({
        element: createLocationMarkerElement(),
        anchor: "center",
      })
        .setLngLat(next)
        .addTo(map);
    } else {
      locationMarkerRef.current.setLngLat(next);
    }

    if (modeRef.current === "DRIVE" && (followRef.current || (location.source === "gps" && !tracking))) {
      map.easeTo({
        center: next,
        zoom: Math.max(map.getZoom(), location.source === "gps" ? 14 : 13),
        bearing: headingRef.current ?? map.getBearing(),
        duration: 650,
        essential: true,
      });
    }
  }, [location.lat, location.lon, location.source, tracking]);

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const nextHeading = getHeading(event as DeviceOrientationEventWithCompass);
      if (nextHeading === null) return;

      const smoothed = smoothHeading(headingRef.current, nextHeading);
      const previous = headingRef.current;
      headingRef.current = smoothed;

      const map = mapRef.current;
      if (!map || modeRef.current !== "DRIVE" || !followRef.current) return;
      if (previous !== null && Math.abs(headingDifference(previous, smoothed)) < 2) return;

      map.easeTo({
        bearing: smoothed,
        duration: 160,
        essential: true,
      });
    };

    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    visiblePins.forEach((pin) => {
      const element = createEmojiMarkerElement(pin.category);
      const marker = new maplibregl.Marker({ element, anchor: "bottom" })
        .setLngLat([pin.lng, pin.lat])
        .addTo(map);

      element.addEventListener("click", () => {
        setSelectedPin(pin);
        setFollowing(false);
        if (modeRef.current === "DRIVE") setMode("PLAN");
        map.easeTo({
          center: [pin.lng, pin.lat],
          zoom: Math.max(map.getZoom(), 13),
          duration: 650,
          essential: true,
        });
      });

      markersRef.current.push(marker);
    });
  }, [visiblePins]);

  useEffect(() => {
    const placing = showAddModal && !pendingLatLng;
    addModeRef.current = placing;
    const map = mapRef.current;
    if (map) map.getCanvas().style.cursor = placing ? "crosshair" : "";

    if (!showAddModal) {
      tempMarkerRef.current?.remove();
      tempMarkerRef.current = null;
      setPendingLatLng(null);
      addModeRef.current = false;
    }
  }, [showAddModal, pendingLatLng]);

  function refreshPins() {
    fetch("/api/pins")
      .then((res) => res.json())
      .then((data) => setPins(Array.isArray(data) ? data : []))
      .catch(() => setPins([]));
  }

  function startTracking() {
    if (!navigator.geolocation || watchIdRef.current !== null) return;
    setLocating(true);
    setFollowing(location.source === "gps" || latestLocationRef.current !== null);

    let firstFix = true;
    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapRef.current;
        if (!map) return;

        const center: [number, number] = [longitude, latitude];
        latestLocationRef.current = center;

        if (!locationMarkerRef.current) {
          locationMarkerRef.current = new maplibregl.Marker({
            element: createLocationMarkerElement(),
            anchor: "center",
          })
            .setLngLat(center)
            .addTo(map);
        } else {
          locationMarkerRef.current.setLngLat(center);
        }

        if (modeRef.current === "PLAN") {
          firstFix = false;
          setLocating(false);
          setTracking(true);
          setFollowing(false);
          return;
        }

        if (firstFix || followRef.current) {
          map.easeTo({
            center,
            zoom: firstFix ? 14 : map.getZoom(),
            bearing: headingRef.current ?? map.getBearing(),
            duration: firstFix ? 800 : 500,
            essential: true,
          });
          firstFix = false;
        }

        setLocating(false);
        setTracking(true);
        setFollowing(true);
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
    }

    const providerLocation: [number, number] = [location.lon, location.lat];
    const current = latestLocationRef.current ?? providerLocation;
    const map = mapRef.current;
    if (!current || !map) return;

    safeClearTimeout(snapBackTimerRef);
    const hasGpsCenter = location.source === "gps" || latestLocationRef.current !== null;
    const shouldFollow = modeRef.current === "DRIVE" && hasGpsCenter;
    setFollowing(shouldFollow);
    map.easeTo({
      center: current,
      zoom: Math.max(map.getZoom(), hasGpsCenter ? 14 : 13),
      bearing: modeRef.current === "DRIVE" ? headingRef.current ?? map.getBearing() : map.getBearing(),
      duration: 650,
      essential: true,
    });
  }

  function switchToDrive() {
    setMode("DRIVE");
    setShowCategoryMenu(false);
    setSelectedPin(null);
    setSearch("");
    setLastSearchHint("");
    setShowSuggestions(false);
    recenter();
  }

  function switchToPlan() {
    setMode("PLAN");
    setFollowing(false);
    safeClearTimeout(snapBackTimerRef);
  }

  function fitPins(matches: Pin[]) {
    const map = mapRef.current;
    if (!map || matches.length === 0) return;

    if (matches.length === 1) {
      map.easeTo({
        center: [matches[0].lng, matches[0].lat],
        zoom: Math.max(map.getZoom(), 14),
        duration: 650,
        essential: true,
      });
      return;
    }

    const bounds = new maplibregl.LngLatBounds();
    matches.forEach((pin) => bounds.extend([pin.lng, pin.lat]));
    map.fitBounds(bounds, { padding: 44, maxZoom: 14, duration: 700 });
  }

  function runSearch(query: string) {
    const q = query.trim();
    const map = mapRef.current;
    if (!q || !map) return;

    setShowCategoryMenu(false);
    setFollowing(false);
    safeClearTimeout(snapBackTimerRef);

    const town = findTown(q);
    if (town) {
      map.easeTo({ center: [town.lng, town.lat], zoom: town.zoom, duration: 700, essential: true });
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

  function handleSearchSubmit(event?: FormEvent) {
    event?.preventDefault();
    setShowSuggestions(false);
    runSearch(search);
  }

  function applySuggestion(suggestion: SearchSuggestion) {
    const map = mapRef.current;
    if (!map) return;
    setSearch(suggestion.query);
    setShowSuggestions(false);

    if (suggestion.type === "pin" && suggestion.pinId) {
      const pin = pins.find((entry) => entry.id === suggestion.pinId);
      if (pin) {
        setSelectedPin(pin);
        setFollowing(false);
        map.easeTo({ center: [pin.lng, pin.lat], zoom: Math.max(map.getZoom(), 13), duration: 650, essential: true });
        setLastSearchHint(pin.title);
        return;
      }
    }

    runSearch(suggestion.query);
  }

  function toggleCategory(category: string) {
    setVisibleCategories((prev) => {
      const next = new Set(prev);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return next;
    });
  }

  function continueAddPinFlow() {
    if (!session?.user) {
      window.location.href = "/signin";
      return;
    }

    setMode("PLAN");
    setFollowing(false);
    setFormTitle("");
    setFormDescription("");
    setFormCategory("BOONDOCKING");
    setSubmitError("");
    setPendingLatLng(null);
    setShowAddModal(true);
  }

  function handleAddPinClick() {
    setShowPinWarningModal(true);
  }

  async function handleSubmitPin(event: FormEvent) {
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
      refreshPins();
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
          <div className="min-w-0 flex-1 space-y-2">
            <div className={`inline-flex rounded-full border p-1 shadow-xl ${dark ? "bg-[#050c16]/95 border-white/20" : "bg-white/95 border-black/10"}`}>
              <button type="button" onClick={switchToDrive} className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${mode === "DRIVE" ? activeMode : inactiveMode}`}>
                Drive
              </button>
              <button type="button" onClick={switchToPlan} className={`rounded-full px-4 py-2 text-xs font-extrabold transition ${mode === "PLAN" ? activeMode : inactiveMode}`}>
                Plan
              </button>
            </div>

            {mode === "PLAN" && (
              <PlanSearchPanel
                dark={dark}
                search={search}
                showSuggestions={showSuggestions}
                searchSuggestions={searchSuggestions}
                textMuted={textMuted}
                textSoft={textSoft}
                onSubmit={handleSearchSubmit}
                onSearchChange={(value) => {
                  setSearch(value);
                  setLastSearchHint("");
                  setShowSuggestions(Boolean(value.trim()));
                }}
                onApplySuggestion={applySuggestion}
                onClear={() => {
                  setSearch("");
                  setLastSearchHint("");
                  setShowSuggestions(false);
                }}
              />
            )}
          </div>

          <button type="button" onClick={() => setDark((value) => !value)} className={`${iconButton} ${dark ? "text-white" : "text-slate-950"}`} style={panel} aria-label="Toggle map style">
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {mode === "DRIVE" && (
          <div className={`absolute bottom-5 left-3 z-[1000] rounded-full border px-4 py-3 shadow-xl ${dark ? "bg-[#050c16]/95 border-white/20" : "bg-white/95 border-black/10"}`}>
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${following ? "bg-jade" : tracking ? "bg-yellow-400" : "bg-red-500"}`} />
              <span className={`text-sm font-extrabold ${textPrimary}`}>{locating ? "Finding GPS" : following ? "Tracking" : tracking ? "Paused" : "Location off"}</span>
            </div>
          </div>
        )}

        <div className="absolute bottom-5 right-3 z-[1000] flex flex-col gap-3">
          {mode === "PLAN" && (
            <button type="button" onClick={() => setShowCategoryMenu((value) => !value)} className={`${iconButton} ${dark ? "text-white" : "text-slate-950"}`} style={panel} aria-label="Layers">
              ☰
            </button>
          )}
          {mode === "PLAN" && (
            <button type="button" onClick={handleAddPinClick} className="h-12 w-12 rounded-full border border-jade/70 bg-jade text-2xl font-light text-white shadow-xl" aria-label="Add pin">
              +
            </button>
          )}
          <button type="button" onClick={recenter} className={`${iconButton} ${following ? "text-jade" : dark ? "text-white" : "text-slate-950"}`} style={panel} aria-label="Recenter">
            ◎
          </button>
        </div>

        {mode === "PLAN" && showCategoryMenu && (
          <div className="absolute bottom-5 left-3 right-3 z-[1000] rounded-3xl border p-4 shadow-2xl" style={panel}>
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className={`text-sm font-extrabold ${textPrimary}`}>Map filters</p>
                <p className={`text-xs ${textSoft}`}>{visiblePins.length} visible pins</p>
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setVisibleCategories(new Set(CATEGORIES as unknown as string[]))} className="rounded-full bg-jade px-3 py-2 text-xs font-extrabold text-white">
                  All
                </button>
                <button type="button" onClick={() => setVisibleCategories(new Set())} className={`rounded-full border px-3 py-2 text-xs font-extrabold ${dark ? "border-white/20 text-white" : "border-black/10 text-slate-700"}`}>
                  None
                </button>
                <button type="button" onClick={() => setShowCategoryMenu(false)} className={`rounded-full border px-3 py-2 text-xs font-extrabold ${dark ? "border-white/20 text-white" : "border-black/10 text-slate-700"}`} aria-label="Close filters">
                  ✕
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
              {(CATEGORIES as unknown as string[]).map((category) => {
                const on = visibleCategories.has(category);
                return (
                  <button key={category} type="button" onClick={() => toggleCategory(category)} className={`rounded-2xl border px-3 py-3 text-left text-xs font-extrabold transition ${on ? "bg-jade text-white border-jade" : dark ? "bg-white/8 border-white/15 text-slate-200" : "bg-white border-black/10 text-slate-700"}`}>
                    <span className="mr-1.5">{CATEGORY_EMOJI[category]}</span>
                    {CATEGORY_LABELS[category]}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {mode === "PLAN" && (search || lastSearchHint) && !showCategoryMenu && (
          <div className={`absolute bottom-5 left-4 z-[1000] rounded-full border px-4 py-3 text-sm font-extrabold shadow-xl ${textPrimary}`} style={panel}>
            {lastSearchHint || `${visiblePins.length} result${visiblePins.length === 1 ? "" : "s"}`}
          </div>
        )}
      </div>

      {selectedPin && (
        <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[200000] px-3 pb-3">
          <div className="pointer-events-auto mx-auto max-w-md rounded-3xl border p-4 shadow-2xl" style={panelStyle(dark)}>
            <div className="flex items-start gap-3">
              <span className="text-2xl">{CATEGORY_EMOJI[selectedPin.category] ?? "📍"}</span>
              <div className="min-w-0 flex-1">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${textSoft}`}>{CATEGORY_LABELS[selectedPin.category] ?? selectedPin.category}</p>
                <h2 className={`text-lg font-extrabold leading-tight ${textPrimary}`}>{selectedPin.title}</h2>
                {selectedPin.description && <p className={`mt-1 text-sm leading-relaxed ${textMuted}`}>{selectedPin.description}</p>}
                <div className="mt-4 flex gap-2">
                  <a href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPin.lat},${selectedPin.lng}`} target="_blank" rel="noopener noreferrer" className="rounded-full bg-jade px-4 py-2 text-xs font-bold text-white">
                    Directions
                  </a>
                  <button type="button" onClick={() => setSelectedPin(null)} className={`rounded-full border px-4 py-2 text-xs font-bold ${dark ? "border-white/20 text-white" : "border-black/10 text-slate-700"}`}>
                    Close
                  </button>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedPin(null)} className={`text-xl leading-none ${textMuted}`}>
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {showPinWarningModal && (
        <div className="fixed inset-0 z-[200000] flex items-end justify-center sm:items-center sm:p-4" style={{ background: "rgba(6,13,24,0.65)" }} onClick={(event) => { if (event.target === event.currentTarget) setShowPinWarningModal(false); }}>
          <div className="w-full rounded-t-3xl border px-5 pb-5 pt-4 shadow-2xl sm:max-w-sm sm:rounded-3xl sm:px-6 sm:pb-6" style={panelStyle(dark)}>
            <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/20 sm:hidden" />
            <h2 className={`text-lg font-extrabold tracking-tight ${textPrimary}`}>Before you add a pin</h2>
            <div className={`mt-3 space-y-3 text-sm leading-relaxed ${textMuted}`}>
              <p>Please do not submit pins for surf breaks.</p>
              <p>They will be denied.</p>
              <p>Respect local access.</p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setShowPinWarningModal(false);
                  continueAddPinFlow();
                }}
                className="rounded-full bg-jade px-5 py-3 text-sm font-bold text-white shadow-lg shadow-jade/30"
              >
                I understand
              </button>
              <button type="button" onClick={() => setShowPinWarningModal(false)} className={`rounded-full border px-5 py-3 text-sm font-bold ${dark ? "border-white/20 bg-white/5 text-white" : "border-black/10 bg-slate-50 text-slate-700"}`}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddModal && !pendingLatLng && (
        <div className="fixed bottom-20 left-1/2 z-[200000] flex -translate-x-1/2 items-center gap-3 rounded-2xl border px-5 py-3 shadow-2xl" style={panelStyle(dark)}>
          <span className="text-xl">📌</span>
          <span className={`text-sm font-semibold ${textPrimary}`}>Tap the map</span>
          <button type="button" onClick={() => setShowAddModal(false)} className={`text-xl leading-none ${textMuted}`}>
            ×
          </button>
        </div>
      )}

      {showAddModal && pendingLatLng && (
        <div className="fixed inset-0 z-[200000] flex items-end justify-center sm:items-center sm:p-4" style={{ background: "rgba(6,13,24,0.65)" }} onClick={(event) => { if (event.target === event.currentTarget) setShowAddModal(false); }}>
          <div className="max-h-[90vh] w-full overflow-y-auto rounded-t-2xl border p-6 shadow-2xl sm:max-w-md sm:rounded-2xl" style={panelStyle(dark)}>
            <div className="mb-5 flex items-center justify-between">
              <h2 className={`text-lg font-bold ${textPrimary}`}>Add pin</h2>
              <button type="button" onClick={() => setShowAddModal(false)} className={`text-xl leading-none ${textMuted}`}>
                ×
              </button>
            </div>
            <form onSubmit={handleSubmitPin} className="space-y-4">
              <input
                type="text"
                value={formTitle}
                onChange={(event) => setFormTitle(event.target.value)}
                placeholder="Spot name"
                required
                className={`w-full rounded-xl border px-4 py-3 outline-none ${dark ? "border-white/15 bg-white/8 text-white placeholder-slate-400" : "border-black/10 bg-white text-slate-950 placeholder-slate-500"}`}
              />
              <textarea
                value={formDescription}
                onChange={(event) => setFormDescription(event.target.value)}
                placeholder="Notes, access, road condition, warnings"
                rows={4}
                className={`w-full rounded-xl border px-4 py-3 outline-none ${dark ? "border-white/15 bg-white/8 text-white placeholder-slate-400" : "border-black/10 bg-white text-slate-950 placeholder-slate-500"}`}
              />
              <select
                value={formCategory}
                onChange={(event) => setFormCategory(event.target.value)}
                className={`w-full rounded-xl border px-4 py-3 outline-none ${dark ? "border-white/15 bg-[#07111f] text-white" : "border-black/10 bg-white text-slate-950"}`}
              >
                {(CATEGORIES as unknown as string[]).map((category) => (
                  <option key={category} value={category}>
                    {CATEGORY_LABELS[category]}
                  </option>
                ))}
              </select>
              <p className={`text-xs ${textSoft}`}>
                Location: {pendingLatLng[0].toFixed(5)}, {pendingLatLng[1].toFixed(5)}
              </p>
              {submitError && <p className="text-sm font-semibold text-red-500">{submitError}</p>}
              <div className="flex gap-2">
                <button type="button" onClick={() => setShowAddModal(false)} className={`flex-1 rounded-full border px-5 py-3 text-sm font-bold ${dark ? "border-white/20 text-white" : "border-black/10 text-slate-700"}`}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="flex-1 rounded-full bg-jade px-5 py-3 text-sm font-bold text-white disabled:cursor-wait disabled:opacity-60">
                  {submitting ? "Saving…" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
