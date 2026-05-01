"use client";

import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";

type Props = {
  onConfirm: (coords: { lat: number; lng: number }) => void;
};

const DEFAULT_CENTER: [number, number] = [-110.2265, 23.4464];

export default function BusinessLocationPicker({ onConfirm }: Props) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: {
        version: 8,
        sources: {
          carto: {
            type: "raster",
            tiles: ["https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          },
        },
        layers: [{ id: "carto", type: "raster", source: "carto" }],
      },
      center: DEFAULT_CENTER,
      zoom: 7.4,
      attributionControl: true,
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "top-right");

    map.on("click", (event) => {
      const point = { lat: event.lngLat.lat, lng: event.lngLat.lng };
      setSelected(point);

      if (!markerRef.current) {
        markerRef.current = new maplibregl.Marker({ color: "#0f8b8d" })
          .setLngLat([point.lng, point.lat])
          .addTo(map);
      } else {
        markerRef.current.setLngLat([point.lng, point.lat]);
      }
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      markerRef.current = null;
      map.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="mt-3 rounded-2xl border border-border bg-sand p-3">
      <p className="text-xs font-semibold text-muted">Tap on the map to place a pin, then confirm.</p>
      <div ref={mapContainerRef} className="mt-3 h-64 w-full overflow-hidden rounded-xl border border-border" />
      <button
        type="button"
        disabled={!selected}
        onClick={() => selected && onConfirm(selected)}
        className="mt-3 min-h-11 rounded-full bg-jade px-5 py-2 text-sm font-extrabold text-white disabled:opacity-60"
      >
        Confirm pin
      </button>
    </div>
  );
}
