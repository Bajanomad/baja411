"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";

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

const CATEGORIES = [
  "ALL",
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
  ALL: "All",
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

function createEmojiIcon(category: string): L.DivIcon {
  const emoji = CATEGORY_EMOJI[category] ?? "📍";
  return L.divIcon({
    html: `<div style="font-size:24px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.45))">${emoji}</div>`,
    className: "",
    iconSize: [28, 28],
    iconAnchor: [14, 24],
    popupAnchor: [0, -26],
  });
}

const TEMP_ICON = L.divIcon({
  html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 1px 3px rgba(0,0,0,0.5))">📌</div>`,
  className: "",
  iconSize: [28, 32],
  iconAnchor: [8, 30],
});

export default function MapClient() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const tempMarkerRef = useRef<L.Marker | null>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const mapWrapperRef = useRef<HTMLDivElement>(null);
  const addModeRef = useRef(false);

  const [pins, setPins] = useState<Pin[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [session, setSession] = useState<{ user?: SessionUser } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [pendingLatLng, setPendingLatLng] = useState<[number, number] | null>(null);
  const [locating, setLocating] = useState(false);
  const [tracking, setTracking] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory] = useState("BOONDOCKING");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  // Fetch session (no SessionProvider needed)
  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((data) => setSession(data && data.user ? data : null))
      .catch(() => setSession(null));
  }, []);

  // Fetch pins
  useEffect(() => {
    fetch("/api/pins")
      .then((r) => r.json())
      .then(setPins)
      .catch(() => setPins([]));
  }, []);

  // Keep addModeRef synced — map is clickable whenever modal is open and pin not yet placed
  useEffect(() => {
    const placing = showAddModal && !pendingLatLng;
    addModeRef.current = placing;
    if (mapRef.current) {
      mapRef.current.getContainer().style.cursor = placing ? "crosshair" : "";
    }
    if (!showAddModal) {
      tempMarkerRef.current?.remove();
      tempMarkerRef.current = null;
      setPendingLatLng(null);
    }
  }, [showAddModal, pendingLatLng]);

  // Initialize Leaflet map (once)
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // Fix Leaflet's broken default icon paths in bundled environments
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
      zoomControl: true,
    });

    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (!addModeRef.current) return;

      tempMarkerRef.current?.remove();
      const tempMarker = L.marker([e.latlng.lat, e.latlng.lng], {
        icon: TEMP_ICON,
      }).addTo(map);
      tempMarkerRef.current = tempMarker;

      setPendingLatLng([e.latlng.lat, e.latlng.lng]);
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  // Re-render markers when pins or filter changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered =
      activeCategory === "ALL"
        ? pins
        : pins.filter((p) => p.category === activeCategory);

    filtered.forEach((pin) => {
      const marker = L.marker([pin.lat, pin.lng], {
        icon: createEmojiIcon(pin.category),
      });

      const categoryLabel = CATEGORY_LABELS[pin.category] ?? pin.category;
      const emoji = CATEGORY_EMOJI[pin.category] ?? "📍";

      marker.bindPopup(
        `<div style="min-width:190px;font-family:system-ui,sans-serif">
          <div style="font-size:0.68rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#E8956D;margin-bottom:5px">
            ${emoji} ${categoryLabel}
          </div>
          <div style="font-weight:700;font-size:0.95rem;color:#1A1A1A;margin-bottom:5px;line-height:1.3">${pin.title}</div>
          ${pin.description ? `<div style="font-size:0.82rem;color:#6B7280;margin-bottom:7px;line-height:1.45">${pin.description}</div>` : ""}
          <div style="font-size:0.7rem;color:#9CA3AF">Added by ${pin.author?.name ?? "Community"}</div>
        </div>`,
        { maxWidth: 260 }
      );

      marker.addTo(map);
      markersRef.current.push(marker);
    });
  }, [pins, activeCategory]);

  const filteredCount =
    activeCategory === "ALL"
      ? pins.length
      : pins.filter((p) => p.category === activeCategory).length;

  function stopTracking() {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    locationMarkerRef.current?.remove();
    locationMarkerRef.current = null;
    setTracking(false);
  }

  function handleLocate() {
    if (!navigator.geolocation) return;

    if (tracking) {
      stopTracking();
      return;
    }

    setLocating(true);

    const dot = L.divIcon({
      html: `<div style="width:16px;height:16px;border-radius:50%;background:#2A7A5A;border:3px solid white;box-shadow:0 0 0 3px rgba(42,122,90,0.35)"></div>`,
      className: "",
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    });

    let firstFix = true;

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        const map = mapRef.current;
        if (!map) return;

        if (!locationMarkerRef.current) {
          locationMarkerRef.current = L.marker([lat, lng], { icon: dot })
            .bindPopup("<div style='font-size:0.8rem;font-weight:600'>You are here</div>")
            .addTo(map);
        } else {
          locationMarkerRef.current.setLatLng([lat, lng]);
        }

        if (firstFix) {
          map.setView([lat, lng], 14, { animate: true });
          firstFix = false;
        }

        setLocating(false);
        setTracking(true);
      },
      () => { setLocating(false); stopTracking(); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleFullscreen() {
    const el = mapWrapperRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setFullscreen(false)).catch(() => {});
    }
  }

  function handleAddPinClick() {
    if (!session?.user) {
      window.location.href = "/api/auth/signin";
      return;
    }
    setFormTitle("");
    setFormDescription("");
    setFormCategory("BOONDOCKING");
    setSubmitError("");
    setPendingLatLng(null);
    setShowAddModal(true);
  }

  async function handleSubmitPin(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingLatLng) {
      setSubmitError("Click the map to set a location first.");
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
        window.location.href = "/api/auth/signin";
        return;
      }
      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.error ?? "Something went wrong.");
        return;
      }

      setShowAddModal(false);
      // Refetch pins
      fetch("/api/pins")
        .then((r) => r.json())
        .then(setPins)
        .catch(() => {});
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Toolbar above map */}
      <div className="flex items-center gap-2 py-3 flex-wrap">
        <button
          onClick={handleAddPinClick}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-jade text-white text-sm font-semibold hover:bg-jade-light transition-colors shadow-sm"
        >
          <span className="text-base leading-none">+</span> Add Pin
        </button>
        <button
          onClick={handleLocate}
          disabled={locating}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-colors shadow-sm disabled:opacity-50 ${
            tracking
              ? "bg-jade text-white hover:bg-jade-light"
              : "bg-white border border-border text-foreground hover:border-jade/40"
          }`}
        >
          <span className="text-base leading-none">{locating ? "⏳" : "📍"}</span>
          {locating ? "Locating…" : tracking ? "Tracking" : "Find Me"}
        </button>
        <button
          onClick={handleFullscreen}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-border text-foreground text-sm font-semibold hover:border-jade/40 transition-colors shadow-sm"
        >
          <span className="text-base leading-none">{fullscreen ? "⛶" : "⛶"}</span>
          {fullscreen ? "Exit Full" : "Full Screen"}
        </button>
        <span className="ml-auto text-xs font-semibold text-muted bg-white border border-border px-3 py-1.5 rounded-full shadow-sm">
          {filteredCount} {filteredCount === 1 ? "pin" : "pins"}
        </span>
      </div>

      {/* Map wrapper */}
      <div ref={mapWrapperRef} className="relative rounded-2xl overflow-hidden border border-border shadow-sm">
        <div
          ref={mapContainerRef}
          style={{ height: "65vh", minHeight: "480px" }}
        />
      </div>

      <p className="text-xs text-muted text-center mt-3">
        Click a pin to see details · Sign in to add your own
      </p>

      {/* Category filter pills */}
      <div className="flex gap-2 flex-wrap py-4">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap ${
              activeCategory === cat
                ? "bg-jade text-white"
                : "bg-white text-muted border border-border hover:border-jade/40"
            }`}
          >
            {cat === "ALL"
              ? "All"
              : `${CATEGORY_EMOJI[cat]} ${CATEGORY_LABELS[cat]}`}
          </button>
        ))}
      </div>

      {/* Step 1: tap-to-place banner (no modal blocking the map) */}
      {showAddModal && !pendingLatLng && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 bg-white rounded-2xl shadow-2xl px-5 py-3.5 border border-border">
          <span className="text-xl">📌</span>
          <span className="text-sm font-semibold text-foreground">Tap the map to place your pin</span>
          <button
            onClick={() => setShowAddModal(false)}
            className="ml-2 text-muted hover:text-foreground text-xl leading-none transition-colors"
          >
            ×
          </button>
        </div>
      )}

      {/* Step 2: form modal appears after location is chosen */}
      {showAddModal && pendingLatLng && (
        <div
          className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center sm:p-4"
          style={{ background: "rgba(6,13,24,0.55)" }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowAddModal(false);
          }}
        >
          <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-foreground text-lg">Add a Pin</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-muted hover:text-foreground transition-colors text-xl leading-none"
              >
                ×
              </button>
            </div>

            {/* Location confirmation */}
            <div className="rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2.5 bg-jade/10 text-jade">
              <span className="text-base">✅</span>
              <span>
                Location set:{" "}
                <strong>
                  {pendingLatLng[0].toFixed(4)}, {pendingLatLng[1].toFixed(4)}
                </strong>
              </span>
              <button
                type="button"
                onClick={() => setPendingLatLng(null)}
                className="ml-auto text-xs underline opacity-70 hover:opacity-100"
              >
                Change
              </button>
            </div>

            <form onSubmit={handleSubmitPin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
                  Title <span className="text-sunset">*</span>
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  required
                  placeholder="e.g. Playa Balandra"
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-foreground focus:outline-none focus:border-jade/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="What should people know about this spot?"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-foreground focus:outline-none focus:border-jade/60 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted mb-1.5 uppercase tracking-wide">
                  Category <span className="text-sunset">*</span>
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-border text-sm text-foreground bg-white focus:outline-none focus:border-jade/60 transition-colors"
                >
                  {CATEGORIES.filter((c) => c !== "ALL").map((cat) => (
                    <option key={cat} value={cat}>
                      {CATEGORY_EMOJI[cat]} {CATEGORY_LABELS[cat]}
                    </option>
                  ))}
                </select>
              </div>

              {submitError && (
                <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">
                  {submitError}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold text-muted hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting…" : "Submit Pin"}
                </button>
              </div>

              <p className="text-xs text-muted text-center">
                Pins are reviewed before appearing on the map.
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
