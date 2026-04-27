"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const MapClient = dynamic(() => import("@/components/MapClientMapLibre"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-sand" style={{ height: "75vh" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-jade border-t-transparent animate-spin" />
        <p className="text-sm text-muted">Loading map…</p>
      </div>
    </div>
  ),
});

function useMapPageScrollLock() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyPosition = body.style.position;
    const previousBodyWidth = body.style.width;
    const previousBodyHeight = body.style.height;
    const previousBodyOverscroll = body.style.overscrollBehavior;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.width = "100%";
    body.style.height = "100%";
    body.style.overscrollBehavior = "none";

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
      body.style.position = previousBodyPosition;
      body.style.width = previousBodyWidth;
      body.style.height = previousBodyHeight;
      body.style.overscrollBehavior = previousBodyOverscroll;
    };
  }, []);
}

export default function MapLoader() {
  useMapPageScrollLock();

  return (
    <div className="relative h-full w-full overflow-hidden">
      <MapClient />
    </div>
  );
}
