import type { Metadata } from "next";
import MapLoader from "./MapLoader";

export const metadata: Metadata = {
  title: "Interactive Map — Baja 411",
  description:
    "Crowdsourced map of boondocking spots, beaches, water fills, mechanics, and more across Baja California Sur.",
};

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
      <MapLoader />
    </div>
  );
}
