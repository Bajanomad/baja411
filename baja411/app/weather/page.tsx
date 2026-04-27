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
  label,
  title,
  description,
  defaultOpen = false,
  delayClass = "",
  children,
}: {
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
    <section className={`overflow-hidden rounded-3xl border border-border bg-white shadow-sm reveal ${delayClass}`}>
      <button
        type="button"
        onClick={toggleOpen}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-sand/60"
      >
        <div>
          <span className="label-tag mb-2 block">{label}</span>
          <h2 className="text-xl font-extrabold text-foreground">{title}</h2>
          <p className="mt-1 text-sm text-muted">{description}</p>
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-xl font-black text-foreground">
          {open ? "−" : "+"}
        </span>
      </button>

      {open && hasOpened && <div className="border-t border-border p-5">{children}</div>}
    </section>
  );
}

function NhcWidgetCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">NHC Tropical Cyclone Widget</h3>
          <p className="mt-0.5 text-xs text-muted">Official National Hurricane Center widget</p>
        </div>
        <a
          href="https://www.nhc.noaa.gov/cyclones/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs font-extrabold text-jade hover:underline"
        >
          Open NHC
        </a>
      </div>
      <div className="flex justify-center bg-sand p-4">
        <iframe
          id="nhc"
          src="https://www.nhc.noaa.gov/widgets/nhc_widget.shtml"
          title="National Hurricane Center Tropical Cyclone Widget"
          width="320"
          height="280"
          scrolling="no"
          className="max-w-full rounded-xl border-0 bg-white"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function WeatherImageCard({ src, alt, label, subLabel }: WeatherImage) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="group overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">{label}</h3>
          <p className="mt-0.5 text-xs text-muted">{subLabel}</p>
        </div>
        {!loaded && !error && (
          <span className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-muted">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-muted/50" />
            Loading
          </span>
        )}
        {loaded && (
          <span className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-jade">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-jade" />
            Source
          </span>
        )}
      </div>

      <div className="relative bg-black/[0.03]" style={{ minHeight: loaded ? 0 : "200px" }}>
        {!loaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-jade border-t-transparent" />
            <p className="text-xs text-muted">Fetching weather data…</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <p className="text-xs text-muted">Image unavailable</p>
            <a href={src} target="_blank" rel="noopener noreferrer" className="text-xs text-jade hover:underline">
              View source →
            </a>
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={proxied(src)}
          alt={alt}
          className={`w-full object-cover transition-opacity duration-500 group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
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
        pageBg="#FAFAF7"
      />

      <div className="bg-sand px-5 pb-16">
        <div className="mx-auto max-w-5xl space-y-6">
          <WeatherPanel
            label="Forecast"
            title="7-Day Forecast"
            description="La Paz, BCS · °F · Windy.com"
            defaultOpen
            delayClass="-mt-6"
          >
            <iframe
              src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.223&detailLat=23.446&detailLon=-110.223&width=100%25&height=210&zoom=8&level=surface&overlay=wind&menu=&message=false&marker=false&calendar=7&pressure=false&type=forecast&location=coordinates&detail=true&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1"
              className="w-full rounded-2xl border-0"
              style={{ height: "210px" }}
              title="7-day weather forecast"
              loading="lazy"
            />
          </WeatherPanel>

          <WeatherPanel
            label="Live map"
            title="Wind & Rain Map"
            description="Open the Windy radar only when you need the full live map."
            delayClass="reveal-delay-1"
          >
            <iframe
              src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.261&detailLat=23.446&detailLon=-110.261&width=100%25&height=520&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&type=map&location=coordinates&detail=&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1"
              className="w-full rounded-2xl border-0"
              style={{ height: "520px" }}
              title="Live wind and rain map"
              allowFullScreen
              loading="lazy"
            />
          </WeatherPanel>

          <WeatherPanel
            label="NHC products"
            title="Tropical Cyclones, SST & Surface Analysis"
            description="Official NHC tropical cyclone widget plus NOAA/NHC products for quick checks."
            delayClass="reveal-delay-2"
          >
            <p className="mb-5 text-xs text-muted">
              Includes the official National Hurricane Center widget, Gulf of California sea surface temperature, and Pacific surface analysis. Use the NHC link for the source page.
            </p>
            <div className="mb-5">
              <NhcWidgetCard />
            </div>
            <WeatherImageGrid images={nhcImages} />
          </WeatherPanel>

          <WeatherPanel
            label="Live satellite"
            title="GOES-19 Satellite Loops"
            description="Heavy animated satellite widgets. Keep these closed until you actually need them."
            delayClass="reveal-delay-2"
          >
            <p className="mb-5 text-xs text-muted">
              These NOAA GOES-19 loops can take a while on cell service. They only start loading after this panel opens.
            </p>
            <WeatherImageGrid images={satelliteImages} />
          </WeatherPanel>

          <p className="text-center text-xs text-muted">
            Weather imagery sourced from{" "}
            <a href="https://www.noaa.gov" target="_blank" rel="noopener noreferrer" className="text-jade hover:underline">
              NOAA
            </a>{" "}
            and the{" "}
            <a href="https://www.nhc.noaa.gov" target="_blank" rel="noopener noreferrer" className="text-jade hover:underline">
              National Hurricane Center
            </a>.
          </p>
        </div>
      </div>
    </>
  );
}
