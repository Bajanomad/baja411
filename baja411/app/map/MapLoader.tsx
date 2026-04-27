"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import MapCompassOverlay from "./MapCompassOverlay";

const MAP_PERMISSION_KEY = "baja411-map-permissions-v1";
const MAP_PERMISSION_EVENT = "baja411:map-permissions-ready";

type DeviceOrientationEventConstructorWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-sand"
      style={{ height: "75vh" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-jade border-t-transparent animate-spin" />
        <p className="text-sm text-muted">Loading map…</p>
      </div>
    </div>
  ),
});

function getDeviceOrientationConstructor() {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return null;
  return window.DeviceOrientationEvent as DeviceOrientationEventConstructorWithPermission;
}

function requestLocationPermission() {
  return new Promise<void>((resolve) => {
    if (!navigator.geolocation) {
      resolve();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      () => resolve(),
      () => resolve(),
      { enableHighAccuracy: true, timeout: 12000, maximumAge: 0 }
    );
  });
}

async function requestCompassPermission() {
  const OrientationEvent = getDeviceOrientationConstructor();
  if (!OrientationEvent) return;

  if (typeof OrientationEvent.requestPermission === "function") {
    try {
      await OrientationEvent.requestPermission();
    } catch {
      // If the browser blocks it, do not keep nagging the user on the map.
    }
  }
}

function MapPermissionGate({ onReady }: { onReady: () => void }) {
  const [showGate, setShowGate] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(MAP_PERMISSION_KEY) === "1") {
      onReady();
      return;
    }

    setShowGate(true);
  }, [onReady]);

  async function enableMapTools() {
    setBusy(true);
    await Promise.allSettled([requestLocationPermission(), requestCompassPermission()]);
    localStorage.setItem(MAP_PERMISSION_KEY, "1");
    window.dispatchEvent(new CustomEvent(MAP_PERMISSION_EVENT));
    onReady();
  }

  function continueWithoutTools() {
    localStorage.setItem(MAP_PERMISSION_KEY, "1");
    window.dispatchEvent(new CustomEvent(MAP_PERMISSION_EVENT));
    onReady();
  }

  if (!showGate) return null;

  return (
    <div className="flex h-full min-h-[75vh] items-center justify-center bg-night px-5 text-white">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur-md">
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-sunset">First map setup</p>
        <h1 className="mt-3 text-3xl font-extrabold leading-tight">Enable driving tools</h1>
        <p className="mt-4 text-sm leading-relaxed text-white/62">
          Baja 411 uses your location for live map tracking and your phone orientation for the compass. Your phone should remember this after the first approval.
        </p>

        <div className="mt-5 space-y-3 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
          <div className="flex items-center gap-3">
            <span className="text-lg">◎</span>
            <span>GPS tracking while using the map</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-lg">🧭</span>
            <span>Compass heading while driving</span>
          </div>
        </div>

        <button
          type="button"
          onClick={enableMapTools}
          disabled={busy}
          className="mt-6 flex min-h-14 w-full items-center justify-center rounded-full bg-jade px-6 py-4 text-sm font-extrabold text-white shadow-xl shadow-jade/25 transition hover:bg-jade-light disabled:cursor-wait disabled:opacity-70"
        >
          {busy ? "Opening permissions…" : "Enable map tools"}
        </button>

        <button
          type="button"
          onClick={continueWithoutTools}
          disabled={busy}
          className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full border border-white/12 bg-white/5 px-6 py-3 text-sm font-extrabold text-white/65 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
        >
          Continue without GPS
        </button>
      </div>
    </div>
  );
}

export default function MapLoader() {
  const [ready, setReady] = useState(false);

  return (
    <div className="relative h-full w-full">
      {ready ? (
        <>
          <MapClient />
          <MapCompassOverlay />
        </>
      ) : (
        <MapPermissionGate onReady={() => setReady(true)} />
      )}
    </div>
  );
}
