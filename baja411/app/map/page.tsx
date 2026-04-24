import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import ScrollReveal from "@/components/ScrollReveal";
import MapLoader from "./MapLoader";

export const metadata: Metadata = {
  title: "Interactive Map — Baja 411",
  description:
    "Crowdsourced map of boondocking spots, beaches, water fills, mechanics, and more across Baja California Sur.",
};

export default function MapPage() {
  return (
    <>
      <ScrollReveal />
      <PageHero
        image="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80&fit=crop&crop=top"
        alt="Aerial view of turquoise Baja waters stretching to the horizon"
        eyebrow="Community · Crowdsourced"
        title="Interactive Map"
        subtitle="Boondocking, beaches, water fills, mechanics, and more — submitted by the community."
        pageBg="#FAFAF7"
      />
      <div className="bg-sand pb-16">
        <MapLoader />
      </div>
    </>
  );
}
