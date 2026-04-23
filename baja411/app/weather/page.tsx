import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Weather",
  description:
    "Live weather forecasts, wind data, and radar for La Paz and the Baja California Sur corridor.",
};

export default function WeatherPage() {
  return (
    <div className="bg-sand min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-5">
        {/* Header */}
        <div className="mb-8">
          <span className="label-tag mb-2 block">Live data</span>
          <h1 className="font-bold text-foreground mb-2"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}>
            Weather
          </h1>
          <p className="text-muted text-base">
            Forecasts and wind data for La Paz, BCS — updated in real time.
          </p>
        </div>

        {/* 7-day forecast widget */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm mb-6">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm text-foreground">
              7-Day Forecast
            </h2>
            <p className="text-xs text-muted mt-0.5">La Paz, BCS · °F</p>
          </div>
          <iframe
            src="https://embed.windy.com/embed2.html?lat=23.446&lon=-110.223&detailLat=23.446&detailLon=-110.223&width=100%25&height=170&zoom=8&level=surface&overlay=wind&menu=&message=false&marker=false&calendar=7&pressure=false&type=forecast&location=coordinates&detail=true&metricWind=default&metricTemp=%C2%B0F&radarRange=-1"
            className="w-full border-0"
            style={{ height: "170px" }}
            title="7-day weather forecast"
          />
        </div>

        {/* Live map widget */}
        <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border">
            <h2 className="font-semibold text-sm text-foreground">
              Live Radar & Wind Map
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
  );
}
