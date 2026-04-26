"use client";

import Link from "next/link";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import SatelliteGrid from "../hurricane/SatelliteGrid";

const satelliteImages = [
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
  {
    src: "https://www.nhc.noaa.gov/archive/xgtwo/epac/latest/two_pac_7d0.png",
    alt: "7-Day Pacific Tropical Weather Outlook",
    label: "7-Day Pacific Outlook",
    subLabel: "NHC · Tropical weather",
  },
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
          <div className="-mt-6 rounded-3xl border border-border bg-white p-5 shadow-sm reveal">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="label-tag mb-2 block">Forecast</span>
                <h2 className="text-xl font-extrabold text-foreground">7-Day Forecast</h2>
                <p className="mt-1 text-sm text-muted">La Paz, BCS · °F · Windy.com</p>
              </div>
              <Link
                href="/hurricane"
                className="inline-flex w-fit rounded-full bg-jade px-5 py-3 text-xs font-extrabold text-white transition hover:bg-jade-light"
              >
                Hurricane Tracker
              </Link>
            </div>
            <iframe
              src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.223&detailLat=23.446&detailLon=-110.223&width=100%25&height=210&zoom=8&level=surface&overlay=wind&menu=&message=false&marker=false&calendar=7&pressure=false&type=forecast&location=coordinates&detail=true&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1"
              className="w-full rounded-2xl border-0"
              style={{ height: "210px" }}
              title="7-day weather forecast"
              loading="lazy"
            />
          </div>

          <div className="overflow-hidden rounded-3xl border border-border bg-white shadow-sm reveal reveal-delay-1">
            <div className="border-b border-border px-5 py-4">
              <span className="label-tag mb-2 block">Live map</span>
              <h2 className="text-xl font-extrabold text-foreground">Wind &amp; Rain Map</h2>
              <p className="mt-1 text-sm text-muted">ECMWF model · wind speed in knots · temperature in °F</p>
            </div>
            <iframe
              src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.261&detailLat=23.446&detailLon=-110.261&width=100%25&height=520&zoom=8&level=surface&overlay=wind&product=ecmwf&menu=&message=&marker=&calendar=now&type=map&location=coordinates&detail=&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1"
              className="w-full border-0"
              style={{ height: "520px" }}
              title="Live wind map"
              allowFullScreen
              loading="lazy"
            />
          </div>

          <section className="rounded-3xl border border-border bg-white p-5 shadow-sm reveal reveal-delay-2">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <span className="label-tag mb-2 block">Storm watch</span>
                <h2 className="text-xl font-extrabold text-foreground">Live Satellite &amp; Storm Widgets</h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted">
                  NOAA GOES-19 satellite loops, NHC Pacific outlooks, sea surface temperature, and surface analysis.
                </p>
              </div>
              <Link
                href="/hurricane"
                className="inline-flex w-fit rounded-full bg-sunset px-6 py-3 text-sm font-extrabold text-white shadow-lg shadow-sunset/20 transition hover:opacity-90"
              >
                Open Full Tracker
              </Link>
            </div>

            <p className="mb-5 text-xs text-muted">
              All satellite imagery updates automatically · Sources: NOAA GOES-19 &amp; NHC
            </p>

            <SatelliteGrid images={satelliteImages} />

            <p className="mt-6 text-center text-xs text-muted">
              Imagery sourced from{" "}
              <a href="https://www.noaa.gov" target="_blank" rel="noopener noreferrer" className="text-jade hover:underline">
                NOAA
              </a>{" "}
              and the{" "}
              <a href="https://www.nhc.noaa.gov" target="_blank" rel="noopener noreferrer" className="text-jade hover:underline">
                National Hurricane Center
              </a>.
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
