"use client";

import { useEffect, useMemo, useState } from "react";

type PermissionState = "idle" | "requesting" | "active" | "denied" | "unavailable";

type DeviceOrientationEventWithCompass = DeviceOrientationEvent & {
  webkitCompassHeading?: number;
};

type DeviceOrientationEventConstructorWithPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<"granted" | "denied">;
};

function normalizeDegrees(value: number) {
  return ((value % 360) + 360) % 360;
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

function cardinalDirection(heading: number) {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return directions[Math.round(heading / 45) % directions.length];
}

function getDeviceOrientationConstructor() {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return null;
  return window.DeviceOrientationEvent as DeviceOrientationEventConstructorWithPermission;
}

export default function MapCompassOverlay() {
  const [permission, setPermission] = useState<PermissionState>("idle");
  const [heading, setHeading] = useState<number | null>(null);
  const [needsTap, setNeedsTap] = useState(false);

  const direction = useMemo(() => {
    if (heading === null) return "N";
    return cardinalDirection(heading);
  }, [heading]);

  useEffect(() => {
    const OrientationEvent = getDeviceOrientationConstructor();
    if (!OrientationEvent) {
      setPermission("unavailable");
      return;
    }

    if (typeof OrientationEvent.requestPermission === "function") {
      setNeedsTap(true);
      return;
    }

    const cleanup = startCompass();
    return cleanup;
  }, []);

  function startCompass() {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const nextHeading = getHeading(event as DeviceOrientationEventWithCompass);
      if (nextHeading === null) return;
      setHeading((current) => {
        if (current === null) return nextHeading;
        return current * 0.72 + nextHeading * 0.28;
      });
      setPermission("active");
    };

    window.addEventListener("deviceorientationabsolute", handleOrientation, true);
    window.addEventListener("deviceorientation", handleOrientation, true);

    return () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }

  async function requestCompass() {
    const OrientationEvent = getDeviceOrientationConstructor();
    if (!OrientationEvent) {
      setPermission("unavailable");
      return;
    }

    setPermission("requesting");

    try {
      if (typeof OrientationEvent.requestPermission === "function") {
        const result = await OrientationEvent.requestPermission();
        if (result !== "granted") {
          setPermission("denied");
          return;
        }
      }

      setNeedsTap(false);
      startCompass();
      setPermission("active");
    } catch {
      setPermission("denied");
    }
  }

  if (permission === "unavailable") return null;

  const displayHeading = heading === null ? "--" : `${Math.round(heading)}°`;
  const isActive = permission === "active" && heading !== null;

  return (
    <div className="pointer-events-none absolute right-3 top-20 z-[1100] flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={needsTap || permission === "denied" ? requestCompass : undefined}
        className="pointer-events-auto flex h-16 w-16 flex-col items-center justify-center rounded-full border border-white/20 bg-[#050c16]/92 text-white shadow-2xl backdrop-blur-md"
        aria-label="Compass heading"
      >
        <div className="relative h-8 w-8">
          <div className="absolute inset-0 rounded-full border border-white/20" />
          <div
            className="absolute left-1/2 top-1/2 h-7 w-1 -translate-x-1/2 -translate-y-1/2 origin-center rounded-full bg-white/90 transition-transform duration-150"
            style={{ transform: `translate(-50%, -50%) rotate(${heading ?? 0}deg)` }}
          >
            <div className="absolute -top-1 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-b-[9px] border-x-transparent border-b-[#E8956D]" />
          </div>
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[9px] font-extrabold text-white/75">
            {direction}
          </span>
        </div>
        <span className="mt-1 text-[10px] font-extrabold leading-none text-white/75">{displayHeading}</span>
      </button>

      {(needsTap || permission === "denied" || permission === "requesting") && (
        <button
          type="button"
          onClick={requestCompass}
          className="pointer-events-auto rounded-full border border-white/15 bg-[#050c16]/92 px-3 py-2 text-[10px] font-extrabold text-white shadow-xl backdrop-blur-md"
        >
          {permission === "requesting"
            ? "Starting compass"
            : permission === "denied"
              ? "Compass blocked"
              : "Enable compass"}
        </button>
      )}

      {isActive && (
        <div className="rounded-full border border-white/15 bg-[#050c16]/82 px-3 py-1 text-[10px] font-extrabold text-white/65 shadow-xl backdrop-blur-md">
          Heading
        </div>
      )}
    </div>
  );
}
