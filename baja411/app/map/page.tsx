import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = {
  title: "Interactive Map — Baja 411",
  description: "Crowdsourced map of boondocking spots, beaches, and local knowledge for the Baja corridor.",
};

export default function MapPage() {
  return (
    <PlaceholderPage
      icon="🗺️"
      eyebrow="Coming Month 2"
      title="Interactive Map"
      heroImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80&fit=crop&crop=top"
      heroAlt="Aerial view of turquoise Baja waters stretching to the horizon"
      heroTagline="Every great adventure starts with a pin."
      description="A crowdsourced iOverlander-style map for the Baja corridor. Submit pins, rate spots, and discover what the community knows."
      launchMonth="Month 2"
      features={[
        "Boondocking and free camping spots",
        "Beach access and hidden coves",
        "Water fills and dump stations",
        "Reliable mechanics and fuel stops",
        "Fishing spots, flea markets, trailheads",
        "User-submitted photos and ratings",
      ]}
    />
  );
}
