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
  "BOONDOCKING","BEACH","WATER_FILL","DUMP_STATION",
  "MECHANIC","FUEL","TRAILHEAD","FISHING","MARKET","OTHER",
] as const;

const CATEGORY_LABELS: Record<string, string> = {
  BOONDOCKING:"Boondocking", BEACH:"Beach", WATER_FILL:"Water Fill",
  DUMP_STATION:"Dump Station", MECHANIC:"Mechanic", FUEL:"Fuel",
  TRAILHEAD:"Trailhead", FISHING:"Fishing", MARKET:"Market", OTHER:"Other",
};

const CATEGORY_EMOJI: Record<string, string> = {
  BOONDOCKING:"🏕️", BEACH:"🏖️", WATER_FILL:"💧", DUMP_STATION:"🚽",
  MECHANIC:"🔧", FUEL:"⛽", TRAILHEAD:"🥾", FISHING:"🎣", MARKET:"🛒", OTHER:"📍",
};

const TILE_LIGHT = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
const TILE_DARK  = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const TILE_ATTR  = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';

function createEmojiIcon(category: string): L.DivIcon {
  const emoji = CATEGORY_EMOJI[category] ?? "📍";
  return L.divIcon({
    html: `<div style="font-size:24px;line-height:1;filter:drop-shadow(0 1px 4px rgba(0,0,0,0.5))">${emoji}</div>`,
    className: "", iconSize: [28, 28], iconAnchor: [14, 24], popupAnchor: [0, -26],
  });
}

const TEMP_ICON = L.divIcon({
  html: `<div style="font-size:28px;line-height:1;filter:drop-shadow(0 1px 4px rgba(0,0,0,0.6))">📌</div>`,
  className: "", iconSize: [28, 32], iconAnchor: [8, 30],
});

function glassStyle(dark: boolean) {
  return dark
    ? { background: "rgba(10,16,26,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderColor: "rgba(255,255,255,0.08)" }
    : { background: "rgba(255,255,255,0.88)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", borderColor: "rgba(0,0,0,0.07)" };
}

export default function MapClient() {
  const mapContainerRef   = useRef<HTMLDivElement>(null);
  const outerRef          = useRef<HTMLDivElement>(null);
  const mapRef            = useRef<L.Map | null>(null);
  const tileLayerRef      = useRef<L.TileLayer | null>(null);
  const markersRef        = useRef<L.Marker[]>([]);
  const tempMarkerRef     = useRef<L.Marker | null>(null);
  const locationMarkerRef = useRef<L.Marker | null>(null);
  const watchIdRef        = useRef<number | null>(null);
  const addModeRef        = useRef(false);

  const [pins, setPins]           = useState<Pin[]>([]);
  const [session, setSession]     = useState<{ user?: SessionUser } | null>(null);
  const [showAddModal, setShowAddModal]   = useState(false);
  const [pendingLatLng, setPendingLatLng] = useState<[number, number] | null>(null);
  const [locating, setLocating]   = useState(false);
  const [tracking, setTracking]   = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [visibleCategories, setVisibleCategories] = useState<Set<string>>(
    () => new Set(CATEGORIES as unknown as string[])
  );
  const [dark, setDark] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("baja411-map-dark") === "1";
  });

  const [formTitle, setFormTitle]             = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formCategory, setFormCategory]       = useState("BOONDOCKING");
  const [submitting, setSubmitting]           = useState(false);
  const [submitError, setSubmitError]         = useState("");

  useEffect(() => {
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((d) => setSession(d?.user ? d : null))
      .catch(() => setSession(null));
  }, []);

  useEffect(() => {
    fetch("/api/pins").then((r) => r.json()).then(setPins).catch(() => setPins([]));
  }, []);

  useEffect(() => {
    const placing = showAddModal && !pendingLatLng;
    addModeRef.current = placing;
    if (mapRef.current) mapRef.current.getContainer().style.cursor = placing ? "crosshair" : "";
    if (!showAddModal) {
      tempMarkerRef.current?.remove();
      tempMarkerRef.current = null;
      setPendingLatLng(null);
    }
  }, [showAddModal, pendingLatLng]);

  // Init map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const map = L.map(mapContainerRef.current, { center: [23.5, -110.0], zoom: 8, zoomControl: false });

    const initialDark = localStorage.getItem("baja411-map-dark") === "1";
    tileLayerRef.current = L.tileLayer(initialDark ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR, subdomains: "abcd", maxZoom: 20,
    }).addTo(map);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    map.on("click", (e: L.LeafletMouseEvent) => {
      if (!addModeRef.current) return;
      tempMarkerRef.current?.remove();
      tempMarkerRef.current = L.marker([e.latlng.lat, e.latlng.lng], { icon: TEMP_ICON }).addTo(map);
      setPendingLatLng([e.latlng.lat, e.latlng.lng]);
    });

    mapRef.current = map;
    return () => { map.remove(); mapRef.current = null; };
  }, []);

  // Switch tile layer on dark toggle
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    localStorage.setItem("baja411-map-dark", dark ? "1" : "0");
    tileLayerRef.current?.remove();
    tileLayerRef.current = L.tileLayer(dark ? TILE_DARK : TILE_LIGHT, {
      attribution: TILE_ATTR, subdomains: "abcd", maxZoom: 20,
    }).addTo(map);
  }, [dark]);

  // Render markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    pins
      .filter((p) => visibleCategories.has(p.category))
      .forEach((pin) => {
        const marker = L.marker([pin.lat, pin.lng], { icon: createEmojiIcon(pin.category) });
        const cat   = CATEGORY_LABELS[pin.category] ?? pin.category;
        const emoji = CATEGORY_EMOJI[pin.category] ?? "📍";
        const bg    = dark ? "#0f1824" : "#ffffff";
        const fg    = dark ? "#f1f5f9" : "#1A1A1A";
        const muted = dark ? "#64748b" : "#6B7280";

        marker.bindPopup(
          `<div style="min-width:190px;font-family:system-ui,sans-serif;background:${bg};border-radius:12px;padding:2px">
            <div style="font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#E8956D;margin-bottom:5px">${emoji} ${cat}</div>
            <div style="font-weight:700;font-size:0.92rem;color:${fg};margin-bottom:4px;line-height:1.3">${pin.title}</div>
            ${pin.description ? `<div style="font-size:0.8rem;color:${muted};margin-bottom:6px;line-height:1.45">${pin.description}</div>` : ""}
            <div style="font-size:0.68rem;color:${muted}">Added by ${pin.author?.name ?? "Community"}</div>
          </div>`,
          { maxWidth: 260 }
        );

        marker.addTo(map);
        markersRef.current.push(marker);
      });
  }, [pins, visibleCategories, dark]);

  // Invalidate map size when fullscreen changes
  useEffect(() => {
    setTimeout(() => mapRef.current?.invalidateSize(), 150);
  }, [fullscreen]);

  const filteredCount = pins.filter((p) => visibleCategories.has(p.category)).length;

  function toggleCategory(cat: string) {
    setVisibleCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat); else next.add(cat);
      return next;
    });
  }
  function showAllCategories() { setVisibleCategories(new Set(CATEGORIES as unknown as string[])); }
  function hideAllCategories() { setVisibleCategories(new Set()); }

  function stopTracking() {
    if (watchIdRef.current !== null) { navigator.geolocation.clearWatch(watchIdRef.current); watchIdRef.current = null; }
    locationMarkerRef.current?.remove();
    locationMarkerRef.current = null;
    setTracking(false);
  }

  function handleLocate() {
    if (!navigator.geolocation) return;
    if (tracking) { stopTracking(); return; }
    setLocating(true);

    const dot = L.divIcon({
      html: `<div style="position:relative;width:22px;height:22px">
        <div class="location-pulse-ring" style="position:absolute;inset:0;border-radius:50%;background:rgba(42,122,90,0.45)"></div>
        <div style="position:absolute;inset:3px;border-radius:50%;background:#2A7A5A;border:2.5px solid white;box-shadow:0 0 10px rgba(42,122,90,0.7)"></div>
      </div>`,
      className: "", iconSize: [22, 22], iconAnchor: [11, 11],
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
        if (firstFix) { map.setView([lat, lng], 14, { animate: true }); firstFix = false; }
        setLocating(false);
        setTracking(true);
      },
      () => { setLocating(false); stopTracking(); },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleFullscreen() {
    setFullscreen((v) => !v);
  }

  function handleAddPinClick() {
    if (!session?.user) { window.location.href = "/signin"; return; }
    setFormTitle(""); setFormDescription(""); setFormCategory("BOONDOCKING");
    setSubmitError(""); setPendingLatLng(null); setShowAddModal(true);
  }

  async function handleSubmitPin(e: React.FormEvent) {
    e.preventDefault();
    if (!pendingLatLng) { setSubmitError("Tap the map to set a location first."); return; }
    setSubmitting(true); setSubmitError("");
    try {
      const res = await fetch("/api/pins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: formTitle, description: formDescription || null, lat: pendingLatLng[0], lng: pendingLatLng[1], category: formCategory }),
      });
      if (res.status === 401) { window.location.href = "/signin"; return; }
      if (!res.ok) { const d = await res.json(); setSubmitError(d.error ?? "Something went wrong."); return; }
      setShowAddModal(false);
      fetch("/api/pins").then((r) => r.json()).then(setPins).catch(() => {});
    } catch { setSubmitError("Network error. Please try again."); }
    finally { setSubmitting(false); }
  }

  const glass       = glassStyle(dark);
  const textPrimary = dark ? "text-white/90" : "text-foreground";
  const textMuted   = dark ? "text-white/40" : "text-muted";
  const btnBase     = dark
    ? "bg-white/10 border-white/10 text-white/80 hover:bg-white/15"
    : "bg-black/5 border-black/8 text-foreground/70 hover:bg-black/10";
  const btnActive   = "bg-jade text-white border-jade hover:bg-jade-light";
  const toolBtn     = "flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors shadow-sm whitespace-nowrap";

  // Category panel — rendered in both normal (below toolbar) and fullscreen (above footer)
  const categoryPanel = showCategoryMenu && (
    <div className="flex-shrink-0 border-b p-3" style={glass}>
      <div className="flex items-center justify-between mb-2.5">
        <span className={`text-[10px] font-bold uppercase tracking-widest ${textMuted}`}>Pin Types</span>
        <div className="flex gap-3">
          <button onClick={showAllCategories} className="text-xs font-semibold text-jade hover:underline">Show All</button>
          <button onClick={hideAllCategories} className={`text-xs font-semibold ${textMuted} hover:underline`}>Hide All</button>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {(CATEGORIES as unknown as string[]).map((cat) => {
          const on = visibleCategories.has(cat);
          return (
            <button key={cat} onClick={() => toggleCategory(cat)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                on ? "bg-jade text-white border-jade"
                   : dark ? "bg-white/5 border-white/8 text-white/35"
                           : "bg-black/4 border-black/6 text-foreground/35"
              }`}>
              {CATEGORY_EMOJI[cat]} {CATEGORY_LABELS[cat]}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* ── Outer wrapper: normal flow or CSS fullscreen ── */}
      <div
        ref={outerRef}
        className={`flex flex-col ${
          fullscreen ? "fixed inset-0 z-[99999]" : "h-full"
        } ${dark ? "bg-[#060d18]" : "bg-sand"}`}
        style={fullscreen ? { paddingTop: "var(--nav-height)" } : undefined}
      >
        {/* Normal-mode toolbar (hidden in fullscreen — footer replaces it) */}
        {!fullscreen && (
          <div className="flex items-center gap-2 px-3 py-2.5 border-b flex-shrink-0" style={glass}>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button onClick={handleAddPinClick}
                className={`${toolBtn} bg-jade text-white border-jade hover:bg-jade-light`}>
                + Add Pin
              </button>
              <button onClick={handleLocate} disabled={locating}
                className={`${toolBtn} disabled:opacity-50 ${tracking ? btnActive : btnBase}`}>
                {locating ? "⏳" : "📍"} {locating ? "Locating…" : tracking ? "Tracking" : "Find Me"}
              </button>
              <button onClick={handleFullscreen} className={`${toolBtn} ${btnBase}`}>
                ⛶ Full Screen
              </button>
              <button onClick={() => setDark((d) => !d)} className={`${toolBtn} ${btnBase}`}>
                {dark ? "☀️" : "🌙"}
              </button>
              <button onClick={() => setShowCategoryMenu((v) => !v)}
                className={`${toolBtn} ${showCategoryMenu ? btnActive : btnBase}`}>
                ☰ Layers
              </button>
            </div>
            <span className={`ml-auto text-[10px] font-semibold whitespace-nowrap ${textMuted}`}>
              {filteredCount} {filteredCount === 1 ? "pin" : "pins"}
            </span>
          </div>
        )}

        {/* Category panel — below toolbar in normal mode */}
        {!fullscreen && categoryPanel}

        {/* Map */}
        <div className="flex-1 min-h-0 relative">
          <div ref={mapContainerRef} style={{ height: "100%", width: "100%" }} />
        </div>

        {/* Category panel — above footer in fullscreen */}
        {fullscreen && categoryPanel}

        {/* Fullscreen footer toolbar */}
        {fullscreen && (
          <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 border-t" style={glass}>
            <button onClick={() => setShowCategoryMenu((v) => !v)}
              className={`${toolBtn} ${showCategoryMenu ? btnActive : btnBase}`}
              title="Show / hide pin types">
              ☰
              <span className={`text-[10px] ml-0.5 ${showCategoryMenu ? "text-white/80" : textMuted}`}>
                {visibleCategories.size}/{CATEGORIES.length}
              </span>
            </button>
            <button onClick={handleAddPinClick}
              className={`${toolBtn} bg-jade text-white border-jade hover:bg-jade-light`}>
              + Add Pin
            </button>
            <button onClick={handleLocate} disabled={locating}
              className={`${toolBtn} disabled:opacity-50 ${tracking ? btnActive : btnBase}`}>
              {locating ? "⏳" : "📍"} {locating ? "…" : tracking ? "Tracking" : "Find Me"}
            </button>
            <button onClick={() => setDark((d) => !d)} className={`${toolBtn} ${btnBase}`}>
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={handleFullscreen} className={`${toolBtn} ${btnBase} ml-auto`}>
              ⛶ Exit
            </button>
          </div>
        )}

        {/* Normal-mode category pills */}
        {!fullscreen && (
          <div className="flex-shrink-0 border-t overflow-x-auto" style={glass}>
            <div className="flex gap-1.5 px-3 py-2 w-max">
              {(CATEGORIES as unknown as string[]).map((cat) => {
                const on = visibleCategories.has(cat);
                return (
                  <button key={cat} onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors whitespace-nowrap border ${
                      on ? "bg-jade text-white border-jade"
                         : dark ? "bg-white/8 border-white/10 text-white/35"
                                : "bg-white/60 border-black/8 text-foreground/35"
                    }`}>
                    {CATEGORY_EMOJI[cat]} {CATEGORY_LABELS[cat]}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── Modals: z above fullscreen overlay ── */}

      {/* Step 1: tap-to-place banner */}
      {showAddModal && !pendingLatLng && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200000] flex items-center gap-3 rounded-2xl shadow-2xl px-5 py-3.5 border"
          style={glassStyle(dark)}>
          <span className="text-xl">📌</span>
          <span className={`text-sm font-semibold ${dark ? "text-white/90" : "text-foreground"}`}>Tap the map to place your pin</span>
          <button onClick={() => setShowAddModal(false)} className={`ml-2 text-xl leading-none ${dark ? "text-white/40" : "text-muted"}`}>×</button>
        </div>
      )}

      {/* Step 2: pin detail form */}
      {showAddModal && pendingLatLng && (
        <div className="fixed inset-0 z-[200000] flex items-end sm:items-center justify-center sm:p-4"
          style={{ background: "rgba(6,13,24,0.65)" }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowAddModal(false); }}>
          <div className="rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md p-6 max-h-[90vh] overflow-y-auto border" style={glassStyle(dark)}>
            <div className="flex items-center justify-between mb-5">
              <h2 className={`font-bold text-lg ${textPrimary}`}>Add a Pin</h2>
              <button onClick={() => setShowAddModal(false)} className={`text-xl leading-none ${textMuted}`}>×</button>
            </div>
            <div className="rounded-xl px-4 py-3 mb-5 text-sm flex items-center gap-2.5 bg-jade/15 text-jade">
              <span>✅</span>
              <span>Location set: <strong>{pendingLatLng[0].toFixed(4)}, {pendingLatLng[1].toFixed(4)}</strong></span>
              <button type="button" onClick={() => setPendingLatLng(null)} className="ml-auto text-xs underline opacity-70">Change</button>
            </div>
            <form onSubmit={handleSubmitPin} className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${textMuted}`}>Title <span className="text-sunset">*</span></label>
                <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} required placeholder="e.g. Playa Balandra"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${dark ? "bg-white/8 border-white/10 text-white placeholder-white/25 focus:border-jade/60" : "bg-white border-border text-foreground focus:border-jade/60"}`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${textMuted}`}>Description</label>
                <textarea value={formDescription} onChange={(e) => setFormDescription(e.target.value)} placeholder="What should people know?" rows={3}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors resize-none ${dark ? "bg-white/8 border-white/10 text-white placeholder-white/25 focus:border-jade/60" : "bg-white border-border text-foreground focus:border-jade/60"}`} />
              </div>
              <div>
                <label className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${textMuted}`}>Category <span className="text-sunset">*</span></label>
                <select value={formCategory} onChange={(e) => setFormCategory(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-colors ${dark ? "bg-[#0f1824] border-white/10 text-white focus:border-jade/60" : "bg-white border-border text-foreground focus:border-jade/60"}`}>
                  {(CATEGORIES as unknown as string[]).map((cat) => (
                    <option key={cat} value={cat}>{CATEGORY_EMOJI[cat]} {CATEGORY_LABELS[cat]}</option>
                  ))}
                </select>
              </div>
              {submitError && <p className="text-xs text-red-400 bg-red-500/10 rounded-lg px-3 py-2">{submitError}</p>}
              <div className="flex gap-3 pt-1">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className={`flex-1 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${dark ? "border-white/10 text-white/60 hover:text-white" : "border-border text-muted hover:text-foreground"}`}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-jade text-white text-sm font-semibold hover:bg-jade-light transition-colors disabled:opacity-50">
                  {submitting ? "Submitting…" : "Submit Pin"}
                </button>
              </div>
              <p className={`text-xs text-center ${textMuted}`}>Pins are reviewed before appearing on the map.</p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
