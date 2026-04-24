import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import SatelliteGrid from "./SatelliteGrid";

export const metadata: Metadata = {
  title: "Hurricane Tracker — Baja 411",
  description:
    "Real-time NOAA GOES-19 satellite imagery and storm tracking for Baja California Sur and the Eastern Pacific.",
};

const images = [
  {
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/13/GOES19-MEX-13-1000x1000.gif",
    alt: "Mexico Sector — Band 13 (Infrared)",
    label: "Mexico Sector · Band 13",
    subLabel: "Infrared · GOES-19",
  },
  {
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/eep/13/GOES19-EEP-13-900x540.gif",
    alt: "East Pacific — Band 13 (Infrared)",
    label: "East Pacific · Band 13",
    subLabel: "Infrared · GOES-19",
  },
  {
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/mex/GEOCOLOR/GOES19-MEX-GEOCOLOR-1000x1000.gif",
    alt: "Mexico Sector — GeoColor",
    label: "Mexico Sector · GeoColor",
    subLabel: "True color · GOES-19",
  },
  {
    src: "https://cdn.star.nesdis.noaa.gov/GOES19/ABI/SECTOR/eep/GEOCOLOR/GOES19-EEP-GEOCOLOR-900x540.gif",
    alt: "East Pacific — GeoColor",
    label: "East Pacific · GeoColor",
    subLabel: "True color · GOES-19",
  },
  {
    src: "https://www.nhc.noaa.gov/archive/xgtwo/epac/latest/two_pac_7d0.png",
    alt: "7-Day Pacific Tropical Weather Outlook",
    label: "7-Day Pacific Outlook",
    subLabel: "NHC · Tropical weather",
  },
  {
    src: "https://www.ospo.noaa.gov/data/sst/contour/gulfcalf.c.gif",
    alt: "Gulf of California Sea Surface Temperature",
    label: "Gulf of California SST",
    subLabel: "Sea surface temperature",
  },
  {
    src: "https://www.nhc.noaa.gov/tafb_latest/pacsfc24_latestBW.gif",
    alt: "Pacific Surface Analysis 24-hour",
    label: "Pacific Surface Analysis",
    subLabel: "24-hour forecast · NHC",
  },
  {
    src: "https://www.nhc.noaa.gov/tafb_latest/pacsea_latestBW.gif",
    alt: "Pacific Surface Analysis",
    label: "Pacific Surface Analysis",
    subLabel: "Current · NHC",
  },
];

export default function HurricanePage() {
  return (
    <>
      <PageHero
        image="https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1800&q=80&fit=crop&crop=top"
        alt="Dramatic golden-hour sky over the Eastern Pacific Ocean"
        eyebrow="Eastern Pacific · Live GOES-19 Imagery"
        title="Hurricane Tracker"
        subtitle="Live satellite imagery updated every 10–15 minutes."
        pageBg="#FAFAF7"
      />

      <div className="bg-sand pb-16 px-5">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs text-muted text-center mb-8 pt-2">
            All satellite imagery updates automatically · Sources: NOAA GOES-19 &amp; NHC
          </p>

          <SatelliteGrid images={images} />

          <p className="mt-10 text-xs text-muted text-center">
            All imagery sourced from{" "}
            <a href="https://www.noaa.gov" target="_blank" rel="noopener noreferrer" className="text-jade hover:underline">
              NOAA
            </a>{" "}
            and the{" "}
            <a href="https://www.nhc.noaa.gov" target="_blank" rel="noopener noreferrer" className="text-jade hover:underline">
              National Hurricane Center
            </a>.
          </p>
        </div>
      </div>
    </>
  );
}
