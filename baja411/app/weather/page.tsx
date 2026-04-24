import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";

export const metadata: Metadata = {
  title: "Weather — Baja 411",
  description:
    "Live weather forecasts, wind data, and radar for La Paz and the Baja California Sur corridor.",
};

const stats = [
  { label: "Temperature", unit: "°F", icon: "🌡️" },
  { label: "Wind Speed", unit: "knots", icon: "💨" },
  { label: "Humidity", unit: "%", icon: "💧" },
];

export default function WeatherPage() {
  return (
    <>
      <ScrollReveal />

      <PageHero
        image="https://images.unsplash.com/photo-1504608524841-42584120d693?w=1800&q=80&fit=crop&crop=center"
        alt="Dramatic clouds rolling over the Pacific Ocean at sunset"
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
                <p className="font-bold text-foreground text-lg">—</p>
                <p className="text-xs text-muted mt-0.5">{s.label} · {s.unit}</p>
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
