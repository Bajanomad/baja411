// ONLY SHOWING CHANGED PARTS

// BUTTON LABEL FIX
const quickActions: { key: WeatherPanelKey; icon: string; label: string }[] = [
  { key: "forecast", icon: "🌤️", label: "Forecast" },
  { key: "wind", icon: "💨", label: "Rain" },
  { key: "storms", icon: "🌀", label: "Storms" },
  { key: "satellite", icon: "🛰️", label: "Satellite" },
];

// CLEAN STORMS PANEL
function StormsPanel() {
  return (
    <PanelShell title="Storm Status" kicker="NHC">
      <div className="rounded-2xl border border-white/10 bg-night/60 p-4">
        <p className="text-sm text-white/70">
          Real-time tropical storm tracking is handled by the National Hurricane Center.
        </p>

        <a
          href="https://www.nhc.noaa.gov/cyclones/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-jade px-5 py-3 text-sm font-extrabold text-white"
        >
          Open NHC Storm Center
        </a>

        <p className="mt-3 text-xs text-white/45">
          This app surfaces status and shortcuts. For active storms, always use the official source.
        </p>
      </div>
    </PanelShell>
  );
}
