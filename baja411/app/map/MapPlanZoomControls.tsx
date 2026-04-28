"use client";

import maplibregl from "maplibre-gl";
import { useEffect, useState } from "react";

type BajaZoomWindow = Window & {
  __baja411KnownMaps?: Set<maplibregl.Map>;
};

function getFirstMap() {
  const maps = (window as BajaZoomWindow).__baja411KnownMaps;
  if (!maps || maps.size === 0) return null;
  return Array.from(maps)[0] ?? null;
}

function isPlanModeActive() {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
  const planButton = buttons.find((button) => button.textContent?.trim() === "Plan");
  return Boolean(planButton?.className.includes("bg-jade"));
}

function hasMapCanvas() {
  return Boolean(document.querySelector(".maplibregl-canvas"));
}

export default function MapPlanZoomControls() {
  const [map, setMap] = useState<maplibregl.Map | null>(null);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMap(getFirstMap());
      setShowControls(isPlanModeActive() && hasMapCanvas());
    }, 300);

    return () => window.clearInterval(timer);
  }, []);

  if (!showControls) return null;

  const zoomBy = (delta: number) => {
    const activeMap = map ?? getFirstMap();
    if (!activeMap) return;

    activeMap.easeTo({
      zoom: activeMap.getZoom() + delta,
      duration: 260,
      essential: true,
    });
  };

  return (
    <div
      aria-label="Plan mode zoom controls"
      className="absolute right-3 z-[2000] flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-xl backdrop-blur"
      style={{ bottom: "142px" }}
    >
      <button
        type="button"
        aria-label="Zoom in"
        onClick={() => zoomBy(1)}
        className="flex h-12 w-12 items-center justify-center text-2xl font-black text-slate-950 active:bg-black/10"
      >
        +
      </button>
      <div className="h-px bg-black/10" />
      <button
        type="button"
        aria-label="Zoom out"
        onClick={() => zoomBy(-1)}
        className="flex h-12 w-12 items-center justify-center text-2xl font-black text-slate-950 active:bg-black/10"
      >
        −
      </button>
    </div>
  );
}
