"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import MapSearchEnhancer from "./MapSearchEnhancer";

const ORIENTATION_EVENTS = new Set(["deviceorientation", "deviceorientationabsolute"]);
const PATCH_KEY = "__baja411OrientationGuard";

type OrientationGuard = {
  originalAddEventListener: typeof window.addEventListener;
  originalRemoveEventListener: typeof window.removeEventListener;
  count: number;
};

declare global {
  interface Window {
    [PATCH_KEY]?: OrientationGuard;
  }
}

function installOrientationGuard() {
  if (typeof window === "undefined") return () => {};

  const existing = window[PATCH_KEY];
  if (existing) {
    existing.count += 1;
    return () => uninstallOrientationGuard();
  }

  const originalAddEventListener = window.addEventListener.bind(window) as typeof window.addEventListener;
  const originalRemoveEventListener = window.removeEventListener.bind(window) as typeof window.removeEventListener;

  window[PATCH_KEY] = {
    originalAddEventListener,
    originalRemoveEventListener,
    count: 1,
  };

  window.addEventListener = function guardedAddEventListener(type, listener, options) {
    if (typeof type === "string" && ORIENTATION_EVENTS.has(type)) return;
    return originalAddEventListener(type, listener, options);
  } as typeof window.addEventListener;

  window.removeEventListener = function guardedRemoveEventListener(type, listener, options) {
    if (typeof type === "string" && ORIENTATION_EVENTS.has(type)) return;
    return originalRemoveEventListener(type, listener, options);
  } as typeof window.removeEventListener;

  return () => uninstallOrientationGuard();
}

function uninstallOrientationGuard() {
  if (typeof window === "undefined") return;

  const guard = window[PATCH_KEY];
  if (!guard) return;

  guard.count -= 1;
  if (guard.count > 0) return;

  window.addEventListener = guard.originalAddEventListener;
  window.removeEventListener = guard.originalRemoveEventListener;
  delete window[PATCH_KEY];
}

const MapClient = dynamic(() => import("@/components/MapClientMapLibre"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-sand" style={{ height: "75vh" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-jade border-t-transparent animate-spin" />
        <p className="text-sm text-muted">Loading map…</p>
      </div>
    </div>
  ),
});

function useMapPageScrollLock() {
  useEffect(() => {
    const removeOrientationGuard = installOrientationGuard();
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyWidth = body.style.width;
    const previousBodyHeight = body.style.height;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.height = "100%";
    body.style.overscrollBehavior = "none";

    return () => {
      removeOrientationGuard();
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.width = previousBodyWidth;
      body.style.height = previousBodyHeight;
      body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, []);
}

export default function MapLoader() {
  useMapPageScrollLock();

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapClient />
      <MapSearchEnhancer />
    </div>
  );
}
