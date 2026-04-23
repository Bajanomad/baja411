import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Hurricane Tracker",
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
    <div className="bg-sand min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-5">
        {/* Header */}
        <div className="mb-8">
          <span className="label-tag mb-2 block">Real-time · NOAA GOES-19</span>
          <h1
            className="font-bold text-foreground mb-2"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)" }}
          >
            Hurricane Tracker
          </h1>
          <p className="text-muted text-base">
            Live satellite imagery for Baja California Sur and the Eastern Pacific.
            Images update automatically every 10–15 minutes.
          </p>
        </div>

        {/* Satellite image grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {images.map((img) => (
            <div
              key={img.src}
              className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden"
            >
              <div className="px-5 py-4 border-b border-border">
                <h2 className="font-semibold text-sm text-foreground">
                  {img.label}
                </h2>
                <p className="text-xs text-muted mt-0.5">{img.subLabel}</p>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                className="w-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>

        {/* Attribution */}
        <p className="mt-8 text-xs text-muted text-center">
          All imagery sourced from{" "}
          <a
            href="https://www.noaa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-jade hover:underline"
          >
            NOAA
          </a>{" "}
          and the{" "}
          <a
            href="https://www.nhc.noaa.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="text-jade hover:underline"
          >
            National Hurricane Center
          </a>
          .
        </p>
      </div>
    </div>
  );
}
