"use client";

import dynamic from "next/dynamic";
import MapModeBridge from "./MapModeBridge";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center bg-sand"
      style={{ height: "75vh" }}
    >
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-jade border-t-transparent animate-spin" />
        <p className="text-sm text-muted">Loading map…</p>
      </div>
    </div>
  ),
});

export default function MapLoader() {
  return (
    <>
      <MapClient />
      <MapModeBridge />
    </>
  );
}
