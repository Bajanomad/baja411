"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";

type StormLevel = "low" | "monitor" | "alert";
type WeatherPanelKey = "forecast" | "wind" | "storms" | "satellite";

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

const quickActions: { key: WeatherPanelKey; icon: string; label: string }[] = [
  { key: "forecast", icon: "🌤️", label: "Forecast" },
  { key: "wind", icon: "💨", label: "Wind" },
  { key: "storms", icon: "🌀", label: "Storms" },
  { key: "satellite", icon: "🛰️", label: "Satellite" },
];

function PanelShell({ title, kicker, children }: { title: string; kicker: string; children: React.ReactNode }) {
  return (
    <div className="mt-4 overflow-hidden rounded-3xl border border-white/10 bg-night/80 text-white shadow-2xl shadow-black/25">
      <div className="border-b border-white/10 px-4 py-4">
        <p className="text-[0.65rem] font-extrabold uppercase tracking-[0.18em] text-sunset">{kicker}</p>
        <h2 className="mt-1 text-xl font-extrabold">{title}</h2>
      </div>
      <div className="p-3 sm:p-4">{children}</div>
    </div>
  );
}

function ForecastPanel() {
  return (
    <PanelShell title="7-Day Forecast" kicker="Windy · La Paz, BCS">
      <iframe
        src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.223&detailLat=23.446&detailLon=-110.223&width=100%25&height=210&zoom=8&level=surface&overlay=wind&menu=&message=false&marker=false&calendar=7&pressure=false&type=forecast&location=coordinates&detail=true&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1"
        className="w-full rounded-2xl border-0"
        style={{ height: "210px" }}
        title="7-day weather forecast"
        loading="lazy"
      />
      <p className="mt-3 text-xs text-white/45">Source: Windy.com embedded forecast.</p>
    </PanelShell>
  );
}

function WindPanel() {
  return (
    <PanelShell title="Wind & Rain Map" kicker="Live map">
      <iframe
        src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.261&detailLat=23.446&detailLon=-110.261&width=100%25&height=520&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&type=map&location=coordinates&detail=&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1"
        className="w-full rounded-2xl border-0"
        style={{ height: "min(520px, 72vh)" }}
        title="Live wind and rain map"
        allowFullScreen
        loading="lazy"
      />
      <p className="mt-3 text-xs text-white/45">Source: Windy.com live map embed.</p>
    </PanelShell>
  );
}

function StormsPanel() {
  return (
    <PanelShell title="NHC Storm Tools" kicker="Storms">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
        <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4">
          <div>
            <h3 className="text-sm font-semibold text-white">NHC Tropical Cyclone Status</h3>
            <p className="mt-0.5 text-xs text-white/50">Official National Hurricane Center widget</p>
          </div>
          <a
            href="https://www.nhc.noaa.gov/cyclones/"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-jade px-3 py-2 text-xs font-extrabold text-white hover:bg-jade-light"
          >
            NHC
          </a>
        </div>
        <div className="p-2 sm:p-4">
          <div className="mx-auto flex max-w-[360px] justify-center overflow-hidden rounded-2xl bg-white p-2 shadow-inner sm:p-3">
            <iframe
              id="nhc"
              src="https://www.nhc.noaa.gov/widgets/nhc_widget.shtml"
              title="National Hurricane Center Tropical Cyclone Widget"
              width="320"
              height="280"
              scrolling="no"
              className="block max-w-full border-0 bg-white"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

function SatellitePanel() {
  return (
    <PanelShell title="GOES-19 Satellite" kicker="Satellite">
      <div className="grid gap-4">
        <SatelliteImage
          label="Mexico Sector · Infrared"
          src="https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/13/GOES19-MEX-13-1000x1000.gif"
        />
        <SatelliteImage
          label="East Pacific · Infrared"
          src="https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/eep/13/GOES19-EEP-13-900x540.gif"
        />
      </div>
      <p className="mt-3 text-xs text-white/45">Source: NOAA GOES-19 satellite loops. These can be heavy on cell service.</p>
    </PanelShell>
  );
}

function SatelliteImage({ label, src }: { label: string; src: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="border-b border-white/10 px-4 py-3">
        <p className="text-sm font-bold text-white">{label}</p>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={`/api/satellite?url=${encodeURIComponent(src)}`} alt={label} className="w-full" loading="lazy" />
    </div>
  );
}

function WeatherButtons() {
  const [status, setStatus] = useState<StormResponse | null>(null);
  const [activePanel, setActivePanel] = useState<WeatherPanelKey>("forecast");

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
          <button
            type="button"
            key={action.key}
            onClick={() => setActivePanel(action.key)}
            className={`rounded-2xl border p-4 text-center shadow-sm transition ${
              activePanel === action.key
                ? "border-jade bg-jade/20 text-white"
                : "border-white/10 bg-night/65 text-white hover:bg-white/[0.08]"
            }`}
          >
            <span className="block text-2xl">{action.icon}</span>
            <span className="mt-2 block text-xs font-extrabold text-white/85">{action.label}</span>
          </button>
        ))}
      </div>

      {activePanel === "forecast" && <ForecastPanel />}
      {activePanel === "wind" && <WindPanel />}
      {activePanel === "storms" && <StormsPanel />}
      {activePanel === "satellite" && <SatellitePanel />}
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
