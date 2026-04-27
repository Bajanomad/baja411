"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import { useBajaLocation } from "@/components/LocationProvider";

type StormLevel = "low" | "monitor" | "alert";
type WeatherPanelKey = "forecast" | "rain" | "storms" | "satellite";
type SatelliteKey = "mex-ir" | "eep-ir" | "mex-color" | "eep-color";

interface StormResponse {
  level: StormLevel;
  headline: string;
  body?: string;
  checkedAt: string;
}

interface SatelliteProduct {
  key: SatelliteKey;
  label: string;
  detail: string;
  src: string;
}

const statusDot: Record<StormLevel, string> = {
  low: "bg-jade-light",
  monitor: "bg-sunset",
  alert: "bg-red-400",
};

const quickActions: { key: WeatherPanelKey; icon: string; label: string }[] = [
  { key: "forecast", icon: "🌤️", label: "Forecast" },
  { key: "rain", icon: "🌧️", label: "Rain" },
  { key: "storms", icon: "🌀", label: "Storms" },
  { key: "satellite", icon: "🛰️", label: "Satellite" },
];

const satelliteProducts: SatelliteProduct[] = [
  {
    key: "mex-ir",
    label: "Mexico IR",
    detail: "Best quick cloud check",
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/13/GOES19-MEX-13-1000x1000.gif",
  },
  {
    key: "eep-ir",
    label: "East Pacific IR",
    detail: "Storms forming offshore",
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/eep/13/GOES19-EEP-13-900x540.gif",
  },
  {
    key: "mex-color",
    label: "Mexico Color",
    detail: "Daylight visual view",
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/GEOCOLOR/GOES19-MEX-GEOCOLOR-1000x1000.gif",
  },
  {
    key: "eep-color",
    label: "Pacific Color",
    detail: "Daylight ocean view",
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/eep/GEOCOLOR/GOES19-EEP-GEOCOLOR-900x540.gif",
  },
];

function windyForecastSrc(lat: number, lon: number) {
  return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=100%25&height=210&zoom=8&level=surface&overlay=wind&menu=&message=false&marker=false&calendar=7&pressure=false&type=forecast&location=coordinates&detail=true&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1`;
}

function windyRainSrc(lat: number, lon: number) {
  return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=100%25&height=520&zoom=8&level=surface&overlay=rain&product=ecmwf&menu=&message=false&marker=false&calendar=now&type=map&location=coordinates&detail=false&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1`;
}

function proxied(src: string) {
  return `/api/satellite?url=${encodeURIComponent(src)}`;
}

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

function ForecastPanel({ lat, lon, label }: { lat: number; lon: number; label: string }) {
  return (
    <PanelShell title="7-Day Forecast" kicker={`${label} · Windy`}>
      <iframe
        src={windyForecastSrc(lat, lon)}
        className="w-full rounded-2xl border-0"
        style={{ height: "210px" }}
        title={`${label} 7-day weather forecast`}
        loading="lazy"
      />
      <p className="mt-3 text-xs text-white/45">Forecast centered on {label}.</p>
    </PanelShell>
  );
}

function RainPanel({ lat, lon, label }: { lat: number; lon: number; label: string }) {
  return (
    <PanelShell title="Rain Map" kicker={`${label} · Live map`}>
      <iframe
        src={windyRainSrc(lat, lon)}
        className="w-full rounded-2xl border-0"
        style={{ height: "min(520px, 72vh)" }}
        title={`${label} rain map`}
        allowFullScreen
        loading="lazy"
      />
      <p className="mt-3 text-xs text-white/45">Rain map centered on {label}.</p>
    </PanelShell>
  );
}

function StormsPanel({ status }: { status: StormResponse | null }) {
  const level = status?.level || "monitor";
  const hasStorms = level === "alert";

  return (
    <PanelShell title="Storms" kicker="Current storm check">
      <div className="rounded-2xl border border-white/10 bg-night/60 p-4">
        <div className="flex items-start gap-3">
          <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${statusDot[level]}`} />
          <div>
            <h3 className="text-lg font-extrabold text-white">
              {hasStorms ? "Storm activity detected" : status?.headline || "No storms showing right now"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/62">
              {hasStorms
                ? "Storm activity is showing in the current signal. Storm details will surface here."
                : "No tropical cyclones are showing right now. If conditions change, storm tools will appear here."}
            </p>
          </div>
        </div>

        {hasStorms && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-black">
            <iframe
              src="https://www.nhc.noaa.gov/widgets/nhc_widget.shtml"
              title="National Hurricane Center Tropical Cyclone Widget"
              width="320"
              height="280"
              scrolling="no"
              className="mx-auto block max-w-full border-0 bg-white"
              loading="lazy"
            />
          </div>
        )}

        <p className="mt-3 text-xs text-white/40">
          Last checked: {status ? new Date(status.checkedAt).toLocaleTimeString() : "checking..."}
        </p>
      </div>
    </PanelShell>
  );
}

function SatellitePanel() {
  const [activeKey, setActiveKey] = useState<SatelliteKey>("mex-ir");
  const activeProduct = satelliteProducts.find((product) => product.key === activeKey) ?? satelliteProducts[0];

  return (
    <PanelShell title="Satellite" kicker="GOES-19">
      <div className="rounded-2xl border border-white/10 bg-night/60 p-3">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {satelliteProducts.map((product) => (
            <button
              key={product.key}
              type="button"
              onClick={() => setActiveKey(product.key)}
              className={`rounded-2xl border px-3 py-3 text-left transition ${
                activeKey === product.key
                  ? "border-jade bg-jade/20 text-white"
                  : "border-white/10 bg-black/30 text-white/70 hover:bg-white/[0.06]"
              }`}
            >
              <span className="block text-xs font-extrabold">{product.label}</span>
              <span className="mt-1 block text-[0.65rem] leading-snug text-white/45">{product.detail}</span>
            </button>
          ))}
        </div>

        <SatelliteImage key={activeProduct.key} product={activeProduct} />

        <p className="mt-3 text-xs leading-relaxed text-white/45">
          Satellite loops can be heavy on cell service. Pick one view at a time so the page does not choke itself like an overpacked pickup.
        </p>
      </div>
    </PanelShell>
  );
}

function SatelliteImage({ product }: { product: SatelliteProduct }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="mt-3 overflow-hidden rounded-2xl border border-white/10 bg-black">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div>
          <p className="text-sm font-bold text-white">{product.label}</p>
          <p className="mt-0.5 text-xs text-white/45">{product.detail}</p>
        </div>
        {!loaded && !failed && <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-white/35">Loading</span>}
        {loaded && <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-jade-light">Live</span>}
        {failed && <span className="text-[0.65rem] font-extrabold uppercase tracking-[0.14em] text-red-300">Failed</span>}
      </div>

      <div className="relative min-h-[240px] bg-black sm:min-h-[360px]">
        {!loaded && !failed && (
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-jade border-t-transparent" />
          </div>
        )}

        {failed && (
          <div className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white/50">
            Satellite image is not loading right now. Try another view.
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={proxied(product.src)}
          alt={product.label}
          className={`w-full transition-opacity duration-300 ${loaded ? "opacity-100" : "opacity-0"}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      </div>
    </div>
  );
}

function WeatherButtons() {
  const { location, isRequesting, permissionState, requestLocation } = useBajaLocation();
  const [status, setStatus] = useState<StormResponse | null>(null);
  const [activePanel, setActivePanel] = useState<WeatherPanelKey>("forecast");

  useEffect(() => {
    fetch("/api/weather/storm-status")
      .then((res) => res.json())
      .then(setStatus)
      .catch(() => null);
  }, []);

  const level = status?.level || "monitor";
  const locationLabel = location.source === "gps" ? "Your location" : location.label;

  return (
    <section className="-mt-2 rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-white shadow-2xl shadow-black/25 backdrop-blur sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-night/65 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot[level]}`} />
          <p className="truncate text-xs font-extrabold text-white/75">
            {locationLabel} · {status?.headline || "Checking storm status..."}
          </p>
        </div>
        {location.source === "fallback" && permissionState !== "denied" ? (
          <button type="button" onClick={requestLocation} className="shrink-0 text-xs font-extrabold text-jade-light">
            {isRequesting ? "Locating..." : "Use GPS"}
          </button>
        ) : (
          <span className="shrink-0 text-xs font-extrabold text-jade-light">{location.source === "gps" ? "GPS" : "Todos Santos"}</span>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickActions.map((action) => (
          <button
            type="button"
            key={action.key}
            onClick={() => setActivePanel(action.key)}
            className={`rounded-2xl border p-4 text-center shadow-sm transition ${
              activePanel === action.key ? "border-jade bg-jade/20 text-white" : "border-white/10 bg-night/65 text-white hover:bg-white/[0.08]"
            }`}
          >
            <span className="block text-2xl">{action.icon}</span>
            <span className="mt-2 block text-xs font-extrabold text-white/85">{action.label}</span>
          </button>
        ))}
      </div>

      {activePanel === "forecast" && <ForecastPanel lat={location.lat} lon={location.lon} label={locationLabel} />}
      {activePanel === "rain" && <RainPanel lat={location.lat} lon={location.lon} label={locationLabel} />}
      {activePanel === "storms" && <StormsPanel status={status} />}
      {activePanel === "satellite" && <SatellitePanel />}
    </section>
  );
}

export default function WeatherPage() {
  const { location } = useBajaLocation();
  const locationLabel = location.source === "gps" ? "Your location" : location.label;

  return (
    <>
      <ScrollReveal />

      <PageHero
        image=""
        alt=""
        eyebrow={`${locationLabel} · Weather`}
        title="Weather Tools"
        subtitle="Forecast, rain, storms, and satellite for Baja Sur."
        pageBg="#060d18"
      />

      <div className="bg-night px-4 pb-16 pt-4 sm:px-5">
        <div className="mx-auto max-w-5xl space-y-5 sm:space-y-6">
          <WeatherButtons />
        </div>
      </div>
    </>
  );
}
