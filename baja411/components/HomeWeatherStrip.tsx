"use client";

import { useEffect, useMemo, useState } from "react";
import { useBajaLocation } from "@/components/LocationProvider";

interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
}

type WeatherStatus = "ok" | "updating" | "fallback" | "unavailable";

const fallbackStats = [
  { label: "Temp", icon: "🌡️", value: null as string | null, unit: "F" },
  { label: "Wind", icon: "💨", value: null as string | null, unit: "kt" },
  { label: "Humidity", icon: "💧", value: null as string | null, unit: "%" },
];

function openMeteoUrl(lat: number, lon: number) {
  return (
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lon}` +
    "&current=temperature_2m,relative_humidity_2m,wind_speed_10m" +
    "&temperature_unit=fahrenheit&wind_speed_unit=kn" +
    "&timezone=America%2FMazatlan"
  );
}

export default function HomeWeatherStrip() {
  const { location, isRequesting, permissionState, requestLocation } = useBajaLocation();
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [error, setError] = useState(false);

  const isGpsFresh = useMemo(() => {
    if (location.source !== "gps" || !location.updatedAt) return false;
    const updatedAt = Date.parse(location.updatedAt);
    if (!Number.isFinite(updatedAt)) return false;
    return Date.now() - updatedAt <= 30 * 60 * 1000;
  }, [location.source, location.updatedAt]);

  const url = useMemo(() => openMeteoUrl(location.lat, location.lon), [location.lat, location.lon]);

  useEffect(() => {
    let cancelled = false;
    setCurrent(null);
    setError(false);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const candidate = data?.current;
        const temp = candidate?.temperature_2m;
        const humidity = candidate?.relative_humidity_2m;
        const wind = candidate?.wind_speed_10m;
        const isValid =
          Number.isFinite(temp) &&
          Number.isFinite(humidity) &&
          Number.isFinite(wind) &&
          temp >= -20 &&
          temp <= 130 &&
          humidity >= 0 &&
          humidity <= 100 &&
          wind >= 0 &&
          wind <= 150;

        if (isValid) {
          setCurrent({
            temperature_2m: temp,
            relative_humidity_2m: humidity,
            wind_speed_10m: wind,
          });
          setError(false);
          return;
        }

        setCurrent(null);
        setError(true);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  const stats = current
    ? [
        { label: "Temp", icon: "🌡️", value: `${Math.round(current.temperature_2m)}°`, unit: "F" },
        { label: "Wind", icon: "💨", value: `${Math.round(current.wind_speed_10m)}`, unit: "kt" },
        { label: "Humidity", icon: "💧", value: `${Math.round(current.relative_humidity_2m)}`, unit: "%" },
      ]
    : fallbackStats;

  const status: WeatherStatus = error ? "unavailable" : current ? location.source === "gps" && isGpsFresh ? "ok" : "fallback" : "updating";

  const statusText =
    status === "ok"
      ? `Your location · updated ${location.updatedAt ? new Date(location.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "just now"}`
      : status === "updating"
        ? isRequesting
          ? "Using GPS · updating…"
          : "Weather · updating…"
        : status === "fallback"
          ? permissionState === "denied"
            ? "GPS denied · using Todos Santos"
            : permissionState === "prompt"
              ? "Using Todos Santos · tap Use GPS"
              : "Using Todos Santos fallback"
          : "Weather unavailable";

  return (
    <div>
      <div className="mt-4 grid max-w-xl grid-cols-3 gap-2 sm:mt-5 sm:gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="min-w-0 rounded-2xl border border-white/14 bg-white/12 px-3 py-2.5 text-white shadow-lg backdrop-blur-md sm:px-4 sm:py-4"
          >
            <div className="flex min-w-0 items-center gap-1 text-[10px] font-extrabold leading-none text-white/62 sm:text-xs">
              <span className="shrink-0 text-sm sm:text-base">{stat.icon}</span>
              <span className="truncate">{stat.label}</span>
            </div>
            <div className="mt-2 flex items-end gap-1 sm:mt-3">
              {stat.value ? (
                <>
                  <span className="text-[1.8rem] font-extrabold leading-[0.9] tracking-tight sm:text-4xl">{stat.value}</span>
                  <span className="pb-0.5 text-xs font-extrabold text-white/58 sm:text-sm">{stat.unit}</span>
                </>
              ) : error ? (
                <span className="text-3xl font-extrabold leading-none text-white/35">—</span>
              ) : (
                <div className="h-7 w-12 animate-pulse rounded-full bg-white/15 sm:h-8 sm:w-14" />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex max-w-xl items-center justify-end gap-3 text-[10px] font-semibold tracking-[0.08em] text-white/55">
        <p>{statusText}</p>
        {location.source === "fallback" && permissionState !== "denied" && (
          <button type="button" onClick={requestLocation} className="text-jade-light">
            {isRequesting ? "Locating..." : "Use GPS"}
          </button>
        )}
      </div>
    </div>
  );
}
