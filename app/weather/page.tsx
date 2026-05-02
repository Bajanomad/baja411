"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import { useBajaLocation } from "@/components/LocationProvider";

type StormLevel = "low" | "monitor" | "alert" | "unavailable";
type WeatherPanelKey = "forecast" | "rain" | "storms" | "satellite";
type SatelliteKey = "mex-ir" | "eep-ir" | "mex-color" | "eep-color";

interface StormResponse {
  level: Exclude<StormLevel, "unavailable">;
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

type ForecastMode = "today" | "7day" | "16day";

interface OpenMeteoForecast {
  current: {
    time: string;
    temperature: number;
    apparentTemperature: number;
    weatherCode: number;
    windSpeed: number;
    windGusts: number | null;
    precipitation: number;
    isDay: number | null;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    apparentTemperature: number;
    weatherCode: number;
    precipitationProbability: number | null;
    precipitation: number;
    windSpeed: number;
    windGusts: number | null;
  }>;
  daily: Array<{
    date: string;
    weatherCode: number;
    tempMax: number;
    tempMin: number;
    precipitationSum: number;
    precipitationProbabilityMax: number | null;
    windSpeedMax: number;
    windGustsMax: number | null;
  }>;
  updatedAt: string;
}

const statusDot: Record<StormLevel, string> = {
  low: "bg-jade-light",
  monitor: "bg-sunset",
  alert: "bg-red-400",
  unavailable: "bg-white/35",
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

function windyRainSrc(lat: number, lon: number) {
  return `https://embed.windy.com/embed2.html?lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&width=100%25&height=520&zoom=8&level=surface&overlay=rain&product=ecmwf&menu=&message=false&marker=false&calendar=now&type=map&location=coordinates&detail=false&metricWind=kt&metricTemp=%C2%B0F&radarRange=-1`;
}

function weatherLabel(code: number) {
  if (code === 0) return "Clear";
  if (code === 1) return "Mostly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Cloudy";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return "Rain";
  if ([95, 96, 99].includes(code)) return "Storms";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  return "Unknown";
}

function weatherIcon(code: number, isDay: number | null) {
  if ([95, 96, 99].includes(code)) return "⛈️";
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "❄️";
  if ([61, 63, 65, 66, 67, 80, 81, 82, 51, 53, 55, 56, 57].includes(code)) return "🌧️";
  if ([45, 48].includes(code)) return "🌫️";
  if (code === 0) return isDay === 0 ? "🌙" : "☀️";
  if ([1, 2].includes(code)) return isDay === 0 ? "☁️" : "⛅";
  if (code === 3) return "☁️";
  return "🌤️";
}

function openMeteoForecastUrl(lat: number, lon: number) {
  return (
    "https://api.open-meteo.com/v1/forecast" +
    `?latitude=${lat}&longitude=${lon}` +
    "&forecast_days=16&timezone=auto&temperature_unit=fahrenheit&wind_speed_unit=kn&precipitation_unit=mm" +
    "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_gusts_10m,precipitation,is_day" +
    "&hourly=temperature_2m,apparent_temperature,weather_code,precipitation_probability,precipitation,wind_speed_10m,wind_gusts_10m" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max"
  );
}

function normalizeOpenMeteo(data: unknown): OpenMeteoForecast | null {
  const candidate = data as Record<string, any>;
  const current = candidate?.current;
  const hourly = candidate?.hourly;
  const daily = candidate?.daily;
  if (!current || !hourly || !daily) return null;

  const normCurrent = {
    time: String(current.time ?? ""),
    temperature: Number(current.temperature_2m),
    apparentTemperature: Number(current.apparent_temperature),
    weatherCode: Number(current.weather_code),
    windSpeed: Number(current.wind_speed_10m),
    windGusts: Number.isFinite(Number(current.wind_gusts_10m)) ? Number(current.wind_gusts_10m) : null,
    precipitation: Number(current.precipitation),
    isDay: Number.isFinite(Number(current.is_day)) ? Number(current.is_day) : null,
  };
  if (!Number.isFinite(normCurrent.temperature) || !Number.isFinite(normCurrent.weatherCode)) return null;

  const hourlyTimes: unknown[] = Array.isArray(hourly.time) ? hourly.time : [];
  const normHourly = hourlyTimes
    .map((_, i) => ({
      time: String(hourly.time?.[i] ?? ""),
      temperature: Number(hourly.temperature_2m?.[i]),
      apparentTemperature: Number(hourly.apparent_temperature?.[i]),
      weatherCode: Number(hourly.weather_code?.[i]),
      precipitationProbability:
        Number.isFinite(Number(hourly.precipitation_probability?.[i])) ? Number(hourly.precipitation_probability?.[i]) : null,
      precipitation: Number(hourly.precipitation?.[i]),
      windSpeed: Number(hourly.wind_speed_10m?.[i]),
      windGusts: Number.isFinite(Number(hourly.wind_gusts_10m?.[i])) ? Number(hourly.wind_gusts_10m?.[i]) : null,
    }))
    .filter((entry) => Number.isFinite(entry.temperature) && Number.isFinite(entry.weatherCode) && entry.time);

  const dailyTimes: unknown[] = Array.isArray(daily.time) ? daily.time : [];
  const normDaily = dailyTimes
    .map((_, i) => ({
      date: String(daily.time?.[i] ?? ""),
      weatherCode: Number(daily.weather_code?.[i]),
      tempMax: Number(daily.temperature_2m_max?.[i]),
      tempMin: Number(daily.temperature_2m_min?.[i]),
      precipitationSum: Number(daily.precipitation_sum?.[i]),
      precipitationProbabilityMax:
        Number.isFinite(Number(daily.precipitation_probability_max?.[i])) ? Number(daily.precipitation_probability_max?.[i]) : null,
      windSpeedMax: Number(daily.wind_speed_10m_max?.[i]),
      windGustsMax: Number.isFinite(Number(daily.wind_gusts_10m_max?.[i])) ? Number(daily.wind_gusts_10m_max?.[i]) : null,
    }))
    .filter((entry) => Number.isFinite(entry.weatherCode) && Number.isFinite(entry.tempMax) && Number.isFinite(entry.tempMin) && entry.date);

  if (!normHourly.length || !normDaily.length) return null;
  return { current: normCurrent, hourly: normHourly, daily: normDaily, updatedAt: new Date().toISOString() };
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
  const [mode, setMode] = useState<ForecastMode>("today");
  const [forecast, setForecast] = useState<OpenMeteoForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setFailed(false);
    setForecast(null);

    fetch(openMeteoForecastUrl(lat, lon))
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const normalized = normalizeOpenMeteo(data);
        if (!normalized) {
          setFailed(true);
          return;
        }
        setForecast(normalized);
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lat, lon]);

  const current = forecast?.current;
  const today = forecast?.daily[0];
  const hourly = forecast?.hourly
    .filter((entry) => new Date(entry.time).getTime() >= Date.now())
    .slice(0, 8);
  const listDays = mode === "16day" ? forecast?.daily.slice(0, 16) : forecast?.daily.slice(0, 7);
  const title = mode === "today" ? "Today Forecast" : mode === "7day" ? "7 Day Forecast" : "16 Day Outlook";

  return (
    <PanelShell title={title} kicker={`${label} · Open Meteo`}>
      <div className="mb-3 flex gap-2">
        {[
          { key: "today", label: "Today" },
          { key: "7day", label: "7 Day" },
          { key: "16day", label: "16 Day" },
        ].map((option) => (
          <button
            key={option.key}
            type="button"
            onClick={() => setMode(option.key as ForecastMode)}
            className={`min-h-11 rounded-xl border px-4 py-2 text-sm font-extrabold ${
              mode === option.key ? "border-jade bg-jade/20 text-white" : "border-white/10 bg-black/25 text-white/75"
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-white/50">{loading ? "Updating forecast..." : `Updated ${forecast ? new Date(forecast.updatedAt).toLocaleTimeString() : "recently"}`}</p>

      {loading && <div className="mt-3 rounded-2xl border border-white/10 bg-night/60 p-6 text-sm text-white/60">Loading forecast…</div>}
      {!loading && failed && <div className="mt-3 rounded-2xl border border-white/10 bg-night/60 p-6 text-sm text-white/60">Forecast is unavailable right now.</div>}
      {!loading && !failed && !forecast && <div className="mt-3 rounded-2xl border border-white/10 bg-night/60 p-6 text-sm text-white/60">Forecast data is missing right now.</div>}

      {!loading && !failed && forecast && mode === "today" && current && today && (
        <div className="mt-3 space-y-3">
          <div className="rounded-2xl border border-white/10 bg-night/60 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-white/45">{label}</p>
            <div className="mt-2 flex items-end justify-between gap-4">
              <div>
                <p className="text-5xl font-extrabold leading-none">{Math.round(current.temperature)}°</p>
                <p className="mt-1 text-lg">{weatherIcon(current.weatherCode, current.isDay)} {weatherLabel(current.weatherCode)}</p>
              </div>
              <div className="text-right text-sm text-white/70">
                <p>Feels like {Math.round(current.apparentTemperature)}°</p>
                <p>H {Math.round(today.tempMax)}° · L {Math.round(today.tempMin)}°</p>
                <p>Wind {Math.round(current.windSpeed)} kt</p>
                {current.windGusts !== null && <p>Gusts {Math.round(current.windGusts)} kt</p>}
                <p>Rain {current.precipitation.toFixed(1)} mm</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto pb-1">
            <div className="flex min-w-max gap-2">
              {hourly?.map((entry) => (
                <div key={entry.time} className="w-28 shrink-0 rounded-xl border border-white/10 bg-black/25 p-3 text-xs">
                  <p className="font-bold text-white/80">{new Date(entry.time).toLocaleTimeString([], { hour: "numeric" })}</p>
                  <p className="mt-1 text-lg">{weatherIcon(entry.weatherCode, 1)}</p>
                  <p>{Math.round(entry.temperature)}°</p>
                  <p className="text-white/55">Rain {entry.precipitationProbability ?? 0}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {!loading && !failed && forecast && mode !== "today" && (
        <div className="mt-3 space-y-2">
          {listDays?.map((day, index) => (
            <div key={day.date} className="rounded-xl border border-white/10 bg-night/60 p-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-bold">{new Date(day.date).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })}</p>
                  <p className="text-white/60">{weatherIcon(day.weatherCode, 1)} {weatherLabel(day.weatherCode)}</p>
                </div>
                <div className="text-right text-white/75">
                  <p>H {Math.round(day.tempMax)}° · L {Math.round(day.tempMin)}°</p>
                  <p>Rain {day.precipitationSum.toFixed(1)} mm{day.precipitationProbabilityMax !== null ? ` · ${Math.round(day.precipitationProbabilityMax)}%` : ""}</p>
                  <p>Wind {Math.round(day.windSpeedMax)} kt{day.windGustsMax !== null ? ` · Gust ${Math.round(day.windGustsMax)} kt` : ""}</p>
                  {mode === "16day" && index >= 7 && <p className="text-[11px] text-white/45">Outlook</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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

function StormsPanel({ status, unavailable }: { status: StormResponse | null; unavailable: boolean }) {
  const level: StormLevel = unavailable ? "unavailable" : status?.level || "monitor";
  const hasStorms = level === "alert";

  return (
    <PanelShell title="Storms" kicker="Current storm check">
      <div className="rounded-2xl border border-white/10 bg-night/60 p-4">
        <div className="flex items-start gap-3">
          <span className={`mt-1 h-3 w-3 shrink-0 rounded-full ${statusDot[level]}`} />
          <div>
            <h3 className="text-lg font-extrabold text-white">
              {unavailable ? "Storm status unavailable" : hasStorms ? "Storm activity detected" : status?.headline || "No storms showing right now"}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/62">
              {unavailable
                ? "Storm status is not loading right now. Use the rain and satellite tools, and check official sources if weather looks active."
                : hasStorms
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
          Last checked: {status ? new Date(status.checkedAt).toLocaleTimeString() : unavailable ? "unavailable" : "checking..."}
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
  const [stormStatusUnavailable, setStormStatusUnavailable] = useState(false);
  const [activePanel, setActivePanel] = useState<WeatherPanelKey>("forecast");

  useEffect(() => {
    fetch("/api/weather/storm-status")
      .then((res) => {
        if (!res.ok) throw new Error("Storm status request failed");
        return res.json();
      })
      .then((nextStatus: StormResponse) => {
        setStatus(nextStatus);
        setStormStatusUnavailable(false);
      })
      .catch(() => setStormStatusUnavailable(true));
  }, []);

  const level: StormLevel = stormStatusUnavailable ? "unavailable" : status?.level || "monitor";
  const locationLabel = location.source === "gps" ? "Your location" : location.label;

  return (
    <section className="-mt-2 rounded-3xl border border-white/10 bg-white/[0.07] p-4 text-white shadow-2xl shadow-black/25 backdrop-blur sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-night/65 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${statusDot[level]}`} />
          <p className="truncate text-xs font-extrabold text-white/75">
            {locationLabel} · {stormStatusUnavailable ? "Storm status unavailable" : status?.headline || "Checking storm status..."}
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
      {activePanel === "storms" && <StormsPanel status={status} unavailable={stormStatusUnavailable} />}
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
