"use client";

import { useEffect, useState } from "react";

interface CurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
}

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=23.446&longitude=-110.223" +
  "&current=temperature_2m,relative_humidity_2m,wind_speed_10m" +
  "&temperature_unit=fahrenheit&wind_speed_unit=kn" +
  "&timezone=America%2FMazatlan";

const fallbackStats = [
  { label: "Temp", icon: "🌡️", value: null as string | null, unit: "F" },
  { label: "Wind", icon: "💨", value: null as string | null, unit: "kt" },
  { label: "Humidity", icon: "💧", value: null as string | null, unit: "%" },
];

export default function HomeWeatherStrip() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(OPEN_METEO_URL)
      .then((res) => res.json())
      .then((data) => setCurrent(data.current ?? null))
      .catch(() => setError(true));
  }, []);

  const stats = current
    ? [
        { label: "Temp", icon: "🌡️", value: `${Math.round(current.temperature_2m)}°`, unit: "F" },
        { label: "Wind", icon: "💨", value: `${Math.round(current.wind_speed_10m)}`, unit: "kt" },
        { label: "Humidity", icon: "💧", value: `${Math.round(current.relative_humidity_2m)}`, unit: "%" },
      ]
    : fallbackStats;

  return (
    <div className="mt-5 grid max-w-xl grid-cols-3 gap-2 sm:gap-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="min-w-0 rounded-2xl border border-white/14 bg-white/12 px-3 py-3 text-white shadow-lg backdrop-blur-md sm:px-4 sm:py-4"
        >
          <div className="flex min-w-0 items-center gap-1 text-[10px] font-extrabold leading-none text-white/58 sm:text-xs">
            <span className="shrink-0 text-sm sm:text-base">{stat.icon}</span>
            <span className="truncate">{stat.label}</span>
          </div>
          <div className="mt-3 flex items-end gap-1">
            {stat.value ? (
              <>
                <span className="text-[2rem] font-extrabold leading-[0.9] tracking-tight sm:text-4xl">{stat.value}</span>
                <span className="pb-0.5 text-sm font-extrabold text-white/55">{stat.unit}</span>
              </>
            ) : error ? (
              <span className="text-3xl font-extrabold leading-none text-white/35">—</span>
            ) : (
              <div className="h-8 w-14 animate-pulse rounded-full bg-white/15" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
