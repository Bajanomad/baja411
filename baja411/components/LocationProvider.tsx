"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type BajaLocation = {
  lat: number;
  lon: number;
  label: string;
  source: "gps" | "fallback";
  updatedAt?: string;
};

const TODOS_SANTOS: BajaLocation = {
  lat: 23.4464,
  lon: -110.2249,
  label: "Todos Santos",
  source: "fallback",
};

const STORAGE_KEY = "baja411.location";
const GPS_STALE_MS = 30 * 60 * 1000;

type LocationContextValue = {
  location: BajaLocation;
  isRequesting: boolean;
  permissionState: PermissionState | "unknown";
  requestLocation: () => void;
};

const LocationContext = createContext<LocationContextValue | null>(null);

function readStoredLocation(): BajaLocation | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BajaLocation;
    if (typeof parsed.lat !== "number" || typeof parsed.lon !== "number") return null;
    return parsed;
  } catch {
    return null;
  }
}

function isFreshGpsLocation(location: BajaLocation | null): location is BajaLocation {
  if (!location || location.source !== "gps" || !location.updatedAt) return false;
  const updatedAtMs = Date.parse(location.updatedAt);
  if (!Number.isFinite(updatedAtMs)) return false;
  return Date.now() - updatedAtMs <= GPS_STALE_MS;
}

function storeLocation(location: BajaLocation) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {
    // localStorage can fail in private modes. Not worth crashing the app over.
  }
}

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<BajaLocation>(TODOS_SANTOS);
  const [isRequesting, setIsRequesting] = useState(false);
  const [permissionState, setPermissionState] = useState<PermissionState | "unknown">("unknown");

  const saveGpsPosition = useCallback((position: GeolocationPosition) => {
    const next: BajaLocation = {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
      label: "Current location",
      source: "gps",
      updatedAt: new Date().toISOString(),
    };
    setLocation(next);
    storeLocation(next);
  }, []);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    setIsRequesting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        saveGpsPosition(position);
        setIsRequesting(false);
      },
      () => {
        setLocation((current) => current || TODOS_SANTOS);
        setIsRequesting(false);
      },
      { enableHighAccuracy: true, maximumAge: 5 * 60 * 1000, timeout: 10000 },
    );
  }, [saveGpsPosition]);

  useEffect(() => {
    const stored = readStoredLocation();

    if (stored?.source === "fallback") {
      setLocation(stored);
    } else if (isFreshGpsLocation(stored)) {
      setLocation(stored);
    } else {
      setLocation(TODOS_SANTOS);
    }

    if (typeof navigator === "undefined") return;

    if (navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" as PermissionName })
        .then((permission) => {
          setPermissionState(permission.state);
          permission.onchange = () => setPermissionState(permission.state);
          if (permission.state === "granted") requestLocation();
        })
        .catch(() => setPermissionState("unknown"));
    }
  }, [requestLocation]);

  const value = useMemo(
    () => ({ location, isRequesting, permissionState, requestLocation }),
    [isRequesting, location, permissionState, requestLocation],
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
}

export function useBajaLocation() {
  const value = useContext(LocationContext);
  if (!value) throw new Error("useBajaLocation must be used inside LocationProvider");
  return value;
}
