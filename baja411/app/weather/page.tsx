"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";

type StormLevel = "low" | "monitor" | "alert";

interface StormResponse {
  level: StormLevel;
  headline: string;
  sourceUrl: string;
  checkedAt: string;
}

const statusDot: Record<StormLevel, string> = {
  low: "bg-jade-light",
  monitor: "bg-sunset",
  alert: "bg-red-400",
};

const quickActions = [
  { href: "#forecast", icon: "🌤️", label: "Forecast" },
  { href: "#wind", icon: "💨", label: "Wind" },
  { href: "#storms", icon: "🌀", label: "Storms" },
  { href: "#satellite", icon: "🛰️", label: "Satellite" },
];

function WeatherButtons() {
  const [status, setStatus] = useState<StormResponse | null>(null);

  useEffect(() => {
    fetch("/api/weather/storm-status")
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => null);
  }, []);

  const level = status?.level || "monitor";

  return (
    <section className="-mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-white shadow-2xl shadow-black/25 backdrop-blur sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-night/65 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot[level]}`} />
          <p className="truncate text-xs font-extrabold text-white/75">
            {status?.headline || "Checking NHC storm status..."}
          </p>
        </div>
        <a
          href={status?.sourceUrl || "https://www.nhc.noaa.gov/cyclones/"}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 text-xs font-extrabold text-jade-light"
        >
          NHC
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((action) => (
          <a
            key={action.href}
            href={action.href}
            className="rounded-2xl border border-white/10 bg-night/65 p-4 text-center shadow-sm transition hover:bg-white/[0.08]"
          >
            <span className="block text-2xl">{action.icon}</span>
            <span className="mt-2 block text-xs font-extrabold text-white/85">{action.label}</span>
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
          <WeatherButtons />
        </div>
      </div>
    </>
  );
}
