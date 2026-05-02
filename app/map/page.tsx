import type { Metadata } from "next";
import { Suspense } from "react";
import MapLoader from "./MapLoader";

export const metadata: Metadata = {
  title: "Interactive Map — Baja 411",
  description:
    "Crowdsourced map of boondocking spots, beaches, water fills, mechanics, and more across Baja California Sur.",
};

function MapFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center bg-sand">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-jade border-t-transparent" />
        <p className="text-sm text-muted">Loading map…</p>
      </div>
    </div>
  );
}

export default function MapPage() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 overflow-hidden"
      style={{
        top: "var(--nav-height)",
        height: "calc(100dvh - var(--nav-height))",
        overscrollBehavior: "none",
      }}
    >
      <Suspense fallback={<MapFallback />}>
        <MapLoader />
      </Suspense>
    </div>
  );
}
