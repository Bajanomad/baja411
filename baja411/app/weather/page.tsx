"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";

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

export default function WeatherPage() {
  const [current, setCurrent] = useState<CurrentWeather | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(OPEN_METEO_URL)
      .then((r) => r.json())
      .then((d) => setCurrent(d.current))
      .catch(() => setError(true));
  }, []);

  const stats = [
    {
      label: "Temperature",
      unit: "°F",
      icon: "🌡️",
      value: current ? `${Math.round(current.temperature_2m)}°` : null,
    },
    {
      label: "Wind Speed",
      unit: "kts",
      icon: "💨",
      value: current ? `${Math.round(current.wind_speed_10m)}` : null,
    },
    {
      label: "Humidity",
      unit: "%",
      icon: "💧",
      value: current ? `${current.relative_humidity_2m}` : null,
    },
  ];

  return (
    <>
      <ScrollReveal />

      <PageHero
        image="https://images.unsplash.com/photo-1530908295418-a12e326966ba?w=1800&q=80&fit=crop&crop=center"
        alt="Clear blue sky over the Baja California coast"
        eyebrow="Live data · La Paz, BCS"
        title="Local Weather"
        subtitle="Real-time forecasts and wind data for the Baja corridor — updated every 15 minutes."
        pageBg="#FAFAF7"
      />

      <div className="bg-sand pb-16 px-5">
        <div className="max-w-4xl mx-auto">

          {/* Stat strip */}
          <div className="grid grid-cols-3 gap-4 -mt-6 mb-10 reveal">
            {stats.map((s) => (
              <div
                key={s.label}
                className="bg-white rounded-2xl border border-border shadow-sm px-5 py-5 text-center"
              >
                <span className="text-2xl mb-2 block">{s.icon}</span>
                {s.value !== null ? (
                  <p className="font-bold text-foreground text-lg">
                    {s.value}
                    <span className="text-sm font-normal text-muted ml-0.5">
                      {s.unit}
                    </span>
                  </p>
                ) : error ? (
                  <p className="font-bold text-muted text-lg">—</p>
                ) : (
                  <div className="h-6 w-14 mx-auto bg-black/[0.06] rounded-full animate-pulse" />
                )}
                <p className="text-xs text-muted mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* 7-day forecast widget */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm mb-6 reveal">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-sm text-foreground">
                7-Day Forecast
              </h2>
              <p className="text-xs text-muted mt-0.5">La Paz, BCS · °F · Windy.com</p>
            </div>
            <iframe
              src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.223&detailLat=23.446&detailLon=-110.223&width=100%25&height=170&zoom=8&level=surface&overlay=wind&menu=&message=false&marker=false&calendar=7&pressure=false&type=forecast&location=coordinates&detail=true&metricWind=default&metricTemp=%C2%B0F&radarRange=-1"
              className="w-full border-0"
              style={{ height: "170px" }}
              title="7-day weather forecast"
            />
          </div>

          {/* Live map widget */}
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm reveal reveal-delay-1">
            <div className="px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-sm text-foreground">
                Live Radar &amp; Wind Map
              </h2>
              <p className="text-xs text-muted mt-0.5">ECMWF model · Rain overlay</p>
            </div>
            <iframe
              src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.261&detailLat=23.446&detailLon=-110.261&width=100%25&height=450&zoom=10&level=surface&overlay=rain&product=ecmwf&menu=&message=&marker=&calendar=now&type=map&location=coordinates&detail=&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1"
              className="w-full border-0"
              style={{ height: "450px" }}
              title="Live wind and rain map"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </>
  );
}
