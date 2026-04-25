import type { Metadata } from "next";
import MapLoader from "./MapLoader";

export const metadata: Metadata = {
  title: "Interactive Map — Baja 411",
  description:
    "Crowdsourced map of boondocking spots, beaches, water fills, mechanics, and more across Baja California Sur.",
};

export default function MapPage() {
  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - var(--nav-height))" }}>
      <MapLoader />
    </div>
  );
}
