"use client";

import { useState } from "react";

interface SatelliteImage {
  src: string;
  alt: string;
  label: string;
  subLabel: string;
}

function proxied(src: string) {
  return `/api/satellite?url=${encodeURIComponent(src)}`;
}

function SatelliteCard({ src, alt, label, subLabel }: SatelliteImage) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-sm text-foreground">{label}</h2>
          <p className="text-xs text-muted mt-0.5">{subLabel}</p>
        </div>
        {!loaded && !error && (
          <span className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-muted">
            <span className="w-1.5 h-1.5 rounded-full bg-muted/50 animate-pulse" />
            Loading
          </span>
        )}
        {loaded && (
          <span className="flex items-center gap-1.5 text-[0.6rem] font-bold uppercase tracking-wider text-jade">
            <span className="w-1.5 h-1.5 rounded-full bg-jade animate-pulse" />
            Live
          </span>
        )}
      </div>

      <div className="relative bg-black/[0.03]" style={{ minHeight: loaded ? 0 : "200px" }}>
        {!loaded && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-jade border-t-transparent animate-spin" />
            <p className="text-xs text-muted">Fetching satellite data…</p>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <p className="text-xs text-muted">Image unavailable</p>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-jade hover:underline"
            >
              View on NOAA →
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

export default function SatelliteGrid({ images }: { images: SatelliteImage[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {images.map((img) => (
        <SatelliteCard key={img.src} {...img} />
      ))}
    </div>
  );
}
