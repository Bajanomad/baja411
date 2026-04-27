"use client";

import { ReactNode, useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";

interface WeatherImage {
  src: string;
  alt: string;
  label: string;
  subLabel: string;
}

type StormLevel = "low" | "monitor" | "alert";

interface StormResponse {
  level: StormLevel;
  headline: string;
  body: string;
  source: string;
  sourceUrl: string;
  checkedAt: string;
}

const statusStyles: Record<StormLevel, string> = {
  low: "border-jade/35 bg-jade-dim text-jade-light",
  monitor: "border-sunset/40 bg-sunset-dim text-sunset",
  alert: "border-red-400/40 bg-red-500/15 text-red-200",
};

const quickActions = [
  { href: "#forecast", icon: "🌤️", label: "Forecast" },
  { href: "#wind", icon: "💨", label: "Wind" },
  { href: "#storms", icon: "🌀", label: "Storms" },
  { href: "#satellite", icon: "🛰️", label: "Satellite" },
];

function StormStatusBanner() {
  const [status, setStatus] = useState<StormResponse | null>(null);

  useEffect(() => {
    fetch("/api/weather/storm-status")
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => null);
  }, []);

  const level = status?.level || "monitor";

  return (
    <div className={`rounded-2xl border p-4 ${statusStyles[level]}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] opacity-80">Storm status</p>
          <h3 className="mt-1 text-xl font-extrabold text-white">
            {status?.headline || "Checking storm conditions..."}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-white/70">
            {status?.body || "Pulling latest NHC signal. Open source if needed."}
          </p>
        </div>
        <a
          href={status?.sourceUrl || "https://www.nhc.noaa.gov/cyclones/"}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-extrabold text-night"
        >
          Open NHC
        </a>
      </div>

      <p className="mt-3 text-xs text-white/45">
        Source: {status?.source || "NHC"} · Updated {status ? new Date(status.checkedAt).toLocaleTimeString() : "..."}
      </p>
    </div>
  );
}

function WeatherStatusCard() {
  return (
    <section className="-mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-white shadow-2xl shadow-black/25 backdrop-blur sm:p-5">
      <StormStatusBanner />

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((action) => (
          <a
            key={action.href}
            href={action.href}
            className="rounded-2xl border border-white/10 bg-night/65 p-3 text-center shadow-sm transition hover:bg-white/[0.08]"
          >
            <span className="block text-2xl">{action.icon}</span>
            <span className="mt-2 block text-xs font-extrabold text-white/80">{action.label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

export default function WeatherPage() {
  return (
    <>
      <ScrollReveal />

      <PageHero
        image="https://images.unsplash.com/photo-1530908295418-a12e326966ba?w=1800&q=80&fit=crop&crop=center"
        alt="Clear blue sky over the Baja California coast"
        eyebrow="Windy maps · La Paz, BCS"
        title="Weather Tools"
        subtitle="Fast weather checks for Baja. Wind, forecast, storms, satellite."
        pageBg="#060d18"
      />

      <div className="bg-night px-4 pb-16 sm:px-5">
        <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
          <WeatherStatusCard />
        </div>
      </div>
    </>
  );
}
