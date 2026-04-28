"use client";

import maplibregl from "maplibre-gl";
import { useEffect } from "react";

type BajaGuardWindow = Window & {
  __baja411PlanGpsGuardInstalled?: boolean;
  __baja411OriginalEaseTo?: maplibregl.Map["easeTo"];
  __baja411LatestGpsCenter?: [number, number] | null;
};

function bajaWindow() {
  return window as BajaGuardWindow;
}

function isPlanModeActive() {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>("button"));
  const planButton = buttons.find((button) => button.textContent?.trim() === "Plan");
  return Boolean(planButton?.className.includes("bg-jade"));
}

function toLngLatTuple(center: unknown): [number, number] | null {
  if (Array.isArray(center) && center.length >= 2) {
    const lng = Number(center[0]);
    const lat = Number(center[1]);
    return Number.isFinite(lng) && Number.isFinite(lat) ? [lng, lat] : null;
  }

  if (center && typeof center === "object" && "lng" in center && "lat" in center) {
    const point = center as { lng: unknown; lat: unknown };
    const lng = Number(point.lng);
    const lat = Number(point.lat);
    return Number.isFinite(lng) && Number.isFinite(lat) ? [lng, lat] : null;
  }

  return null;
}

function isNearGpsCenter(center: [number, number], gps: [number, number]) {
  const lngDiff = Math.abs(center[0] - gps[0]);
  const latDiff = Math.abs(center[1] - gps[1]);
  return lngDiff < 0.00025 && latDiff < 0.00025;
}

function installPlanGpsGuard() {
  const win = bajaWindow();
  if (win.__baja411PlanGpsGuardInstalled) return;

  const proto = maplibregl.Map.prototype;
  const originalEaseTo = proto.easeTo;
  win.__baja411OriginalEaseTo = originalEaseTo;

  proto.easeTo = function guardedEaseTo(this: maplibregl.Map, ...args: Parameters<maplibregl.Map["easeTo"]>) {
    const [options] = args;
    const center = options && typeof options === "object" ? toLngLatTuple(options.center) : null;
    const gpsCenter = bajaWindow().__baja411LatestGpsCenter ?? null;

    if (center && gpsCenter && isPlanModeActive() && isNearGpsCenter(center, gpsCenter)) {
      return this;
    }

    return originalEaseTo.call(this, ...args);
  } as maplibregl.Map["easeTo"];

  win.__baja411PlanGpsGuardInstalled = true;
}

function installGpsRecorder() {
  if (!navigator.geolocation?.watchPosition) return;

  const originalWatchPosition = navigator.geolocation.watchPosition.bind(navigator.geolocation);

  navigator.geolocation.watchPosition = ((success, error, options) => {
    const wrappedSuccess: PositionCallback = (position) => {
      bajaWindow().__baja411LatestGpsCenter = [position.coords.longitude, position.coords.latitude];
      success(position);
    };

    return originalWatchPosition(wrappedSuccess, error, options);
  }) as Geolocation["watchPosition"];
}

export default function MapPlanGpsGuard() {
  useEffect(() => {
    installGpsRecorder();
    installPlanGpsGuard();
  }, []);

  return null;
}
