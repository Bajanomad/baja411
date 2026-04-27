"use client";

import { ReactNode, useState } from "react";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";

interface WeatherImage {
  src: string;
  alt: string;
  label: string;
  subLabel: string;
}

type StormStatusLevel = "low" | "monitor" | "alert";

const stormStatus: {
  level: StormStatusLevel;
  headline: string;
  body: string;
  action: string;
  sourceLabel: string;
} = {
  level: "monitor",
  headline: "Storm status: check NHC before travel.",
  body: "This page pulls official storm tools into one place, but always confirm active tropical cyclone details with the National Hurricane Center source page before making travel or safety decisions.",
  action: "Open NHC Source",
  sourceLabel: "NHC / NOAA source tools",
};

const statusStyles: Record<StormStatusLevel, string> = {
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

const nhcImages: WeatherImage[] = [
  {
    src: "https://www.ospo.noaa.gov/data/sst/contour/gulfcalf.c.gif",
    alt: "Gulf of California Sea Surface Temperature",
    label: "Gulf of California SST",
    subLabel: "Sea surface temperature",
  },
  {
    src: "https://www.nhc.noaa.gov/tafb_latest/pacsfc24_latestBW.gif",
    alt: "Pacific Surface Analysis 24-hour",
    label: "Pacific Surface Analysis",
    subLabel: "24-hour forecast · NHC",
  },
  {
    src: "https://www.nhc.noaa.gov/tafb_latest/pacsea_latestBW.gif",
    alt: "Pacific Surface Analysis",
    label: "Pacific Surface Analysis",
    subLabel: "Current · NHC",
  },
];

const satelliteImages: WeatherImage[] = [
  {
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/13/GOES19-MEX-13-1000x1000.gif",
    alt: "Mexico Sector — Band 13 (Infrared)",
    label: "Mexico Sector · Band 13",
    subLabel: "Infrared · GOES-19",
  },
  {
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/eep/13/GOES19-EEP-13-900x540.gif",
    alt: "East Pacific — Band 13 (Infrared)",
    label: "East Pacific · Band 13",
    subLabel: "Infrared · GOES-19",
  },
  {
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/GEOCOLOR/GOES19-MEX-GEOCOLOR-1000x1000.gif",
    alt: "Mexico Sector — GeoColor",
    label: "Mexico Sector · GeoColor",
    subLabel: "True color · GOES-19",
  },
  {
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/eep/GEOCOLOR/GOES19-EEP-GEOCOLOR-900x540.gif",
    alt: "East Pacific — GeoColor",
    label: "East Pacific · GeoColor",
    subLabel: "True color · GOES-19",
  },
];

function proxied(src: string) {
  return `/api/satellite?url=${encodeURIComponent(src)}`;
}

function WeatherPanel({
  id,
  label,
  title,
  description,
  defaultOpen = false,
  delayClass = "",
  children,
}: {
  id?: string;
  label: string;
  title: string;
  description: string;
  defaultOpen?: boolean;
  delayClass?: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const [hasOpened, setHasOpened] = useState(defaultOpen);

  function toggleOpen() {
    setOpen((current) => {
      if (!current) setHasOpened(true);
      return !current;
    });
  }

  return (
    <section id={id} className={`scroll-mt-24 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.055] text-white shadow-2xl shadow-black/20 backdrop-blur reveal ${delayClass}`}>
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-white/[0.04] sm:px-5 sm:py-5"
      >
        <div>
          <span className="label-tag mb-2 block">{label}</span>
          <h2 className="text-lg font-extrabold text-white sm:text-xl">{title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-white/55">{description}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 bg-white/[0.07] text-xl font-black text-white">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && hasOpened && <div className="border-t border-white/10 p-3 sm:p-5">{children}</div>}
    </section>
  );
}

function StormStatusBanner() {
  return (
    <div className={`rounded-2xl border p-4 ${statusStyles[stormStatus.level]}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] opacity-80">Storm status</p>
          <h3 className="mt-1 text-xl font-extrabold text-white">{stormStatus.headline}</h3>
          <p className="mt-2 text-sm leading-relaxed text-white/68">{stormStatus.body}</p>
        </div>
        <a
          href="https://www.nhc.noaa.gov/cyclones/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-extrabold text-night"
        >
          {stormStatus.action}
        </a>
      </div>
      <p className="mt-3 text-xs text-white/45">Source: {stormStatus.sourceLabel}. Status summary is a safety prompt, not an official alert.</p>
    </div>
  );
}

function WeatherStatusCard() {
  return (
    <section className="-mt-6 rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-white shadow-2xl shadow-black/25 backdrop-blur sm:p-5">
      <StormStatusBanner />
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
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

function NhcWidgetCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-night shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
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
          Open NHC
        </a>
      </div>
      <div className="bg-black p-2 sm:p-4">
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
  );
}

function WeatherImageCard({ src, alt, label, subLabel }: WeatherImage) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="group overflow-hidden rounded-2xl border border-white/10 bg-night shadow-sm">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-5">
        <div>
          <h3 className="text-sm font-semibold text-white">{label}</h3>
          <p className="mt-0.5 text-xs text-white/50">{subLabel}</p>
        </div>
        {!loaded && !error && (
          <span className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-white/45">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/35" />
            Loading
          </span>
        )}
        {loaded && (
          <span className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-jade-light">
            <span className="h-1.5 w-1.5 rounded-full bg-jade-light" />
            Source
          </span>
        )}
      </div>

      <div className="relative bg-black" style={{ minHeight: loaded ? 0 : "200px" }}>
        {!loaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-jade border-t-transparent" />
            <p className="text-xs text-white/50">Fetching weather data…</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center">
            <p className="text-xs text-white/55">Image unavailable</p>
            <a href={src} target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-jade-light hover:underline">
              View source →
            </a>
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={proxied(src)}
          alt={alt}
          className={`w-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      </div>
    </div>
  );
}

function WeatherImageGrid({ images }: { images: WeatherImage[] }) {
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
      {images.map((image) => (
        <WeatherImageCard key={image.src} {...image} />
      ))}
    </div>
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
        subtitle="Wind, rain, forecast, satellite imagery, and storm tools for the Baja corridor."
        pageBg="#060d18"
      />

      <div className="bg-night px-4 pb-16 sm:px-5">
        <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
          <WeatherStatusCard />

          <WeatherPanel
            id="forecast"
            label="Forecast"
            title="7-Day Forecast"
            description="La Paz, BCS · °F · Windy.com"
            defaultOpen
          >
            <iframe
              src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.223&detailLat=23.446&detailLon=-110.223&width=100%25&height=210&zoom=8&level=surface&overlay=wind&menu=&message=false&marker=false&calendar=7&pressure=false&type=forecast&location=coordinates&detail=true&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1"
              className="w-full rounded-2xl border-0"
              style={{ height: "210px" }}
              title="7-day weather forecast"
              loading="lazy"
            />
            <p className="mt-3 text-xs text-white/45">Source: Windy.com embedded forecast.</p>
          </WeatherPanel>

          <WeatherPanel
            id="wind"
            label="Live map"
            title="Wind & Rain Map"
            description="Open the Windy radar only when you need the full live map."
          >
            <iframe
              src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.261&detailLat=23.446&detailLon=-110.261&width=100%25&height=520&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&type=map&location=coordinates&detail=&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1"
              className="w-full rounded-2xl border-0"
              style={{ height: "min(520px, 72vh)" }}
              title="Live wind and rain map"
              allowFullScreen
              loading="lazy"
            />
            <p className="mt-3 text-xs text-white/45">Source: Windy.com live map embed.</p>
          </WeatherPanel>

          <WeatherPanel
            id="storms"
            label="NHC products"
            title="Tropical Cyclones, SST & Surface Analysis"
            description="Official NHC tropical cyclone widget plus NOAA/NHC products for quick checks."
          >
            <p className="mb-5 text-xs leading-relaxed text-white/50">
              Official storm products from NOAA and the National Hurricane Center. Use the NHC button when you need the source page directly.
            </p>
            <div className="mb-5">
              <NhcWidgetCard />
            </div>
            <WeatherImageGrid images={nhcImages} />
          </WeatherPanel>

          <WeatherPanel
            id="satellite"
            label="Live satellite"
            title="GOES-19 Satellite Loops"
            description="Heavy animated satellite widgets. Keep these closed until you actually need them."
          >
            <p className="mb-5 text-xs leading-relaxed text-white/50">
              These NOAA GOES-19 loops can take a while on cell service. They only start loading after this panel opens.
            </p>
            <WeatherImageGrid images={satelliteImages} />
          </WeatherPanel>

          <p className="text-center text-xs text-white/40">
            Weather imagery sourced from{" "}
            <a href="https://www.noaa.gov" target="_blank" rel="noopener noreferrer" className="text-jade-light hover:underline">
              NOAA
            </a>{" "}
            and the{" "}
            <a href="https://www.nhc.noaa.gov" target="_blank" rel="noopener noreferrer" className="text-jade-light hover:underline">
              National Hurricane Center
            </a>.
          </p>
        </div>
      </div>
    </>
  );
}
