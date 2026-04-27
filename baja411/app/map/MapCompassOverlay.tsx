"use client";

import { useEffect, useState } from "react";

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

function getDeviceOrientationConstructor() {
  if (typeof window === "undefined" || !("DeviceOrientationEvent" in window)) return null;
  return window.DeviceOrientationEvent as DeviceOrientationEventConstructorWithPermission;
}

export default function MapCompassOverlay() {
  const [permission, setPermission] = useState<PermissionState>("idle");
  const [heading, setHeading] = useState<number | null>(null);
  const [needsTap, setNeedsTap] = useState(false);

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
        return current * 0.78 + nextHeading * 0.22;
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

  const compassRotation = heading ?? 0;

  return (
    <div className="pointer-events-none absolute bottom-20 right-4 z-[1100] flex flex-col items-end gap-2">
      {(needsTap || permission === "denied" || permission === "requesting") && (
        <button
          type="button"
          onClick={requestCompass}
          className="pointer-events-auto rounded-full border border-white/15 bg-black/90 px-3 py-2 text-[10px] font-extrabold text-white shadow-xl backdrop-blur-md"
        >
          {permission === "requesting"
            ? "Starting compass"
            : permission === "denied"
              ? "Compass blocked"
              : "Enable compass"}
        </button>
      )}

      <button
        type="button"
        onClick={needsTap || permission === "denied" ? requestCompass : undefined}
        aria-label="Compass"
        className="pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black/95 shadow-2xl backdrop-blur-md"
      >
        <div className="absolute inset-[4px] rounded-full border border-white/20" />
        <div className="absolute inset-[8px] rounded-full border border-white/10" />

        {Array.from({ length: 24 }).map((_, index) => {
          const angle = index * 15;
          const major = index % 3 === 0;

          return (
            <span
              key={angle}
              className="absolute left-1/2 top-1/2 origin-center"
              style={{ transform: `translate(-50%, -50%) rotate(${angle}deg)` }}
            >
              <span
                className={`block rounded-full bg-white/85 ${major ? "h-[7px] w-[1.5px]" : "h-[4px] w-px"}`}
                style={{ transform: "translateY(-21px)" }}
              />
            </span>
          );
        })}

        <span className="absolute top-[6px] left-1/2 -translate-x-1/2 text-[7px] font-black leading-none text-white/90">
          N
        </span>

        <div
          className="absolute left-1/2 top-1/2 h-8 w-4 origin-center transition-transform duration-150 ease-out"
          style={{ transform: `translate(-50%, -50%) rotate(${compassRotation}deg)` }}
        >
          <div className="absolute left-1/2 top-[1px] h-0 w-0 -translate-x-1/2 border-x-[5px] border-b-[13px] border-x-transparent border-b-[#ef4444] drop-shadow" />
          <div className="absolute bottom-[1px] left-1/2 h-0 w-0 -translate-x-1/2 border-x-[4px] border-t-[10px] border-x-transparent border-t-white/90" />
          <div className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/80 bg-black" />
        </div>
      </button>
    </div>
  );
}
