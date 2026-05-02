import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = {
  title: "Classifieds — Baja 411",
  description: "Free buy, sell, and trade classifieds for the Baja California Sur corridor.",
};

export default function ClassifiedsPage() {
  return (
    <PlaceholderPage
      icon="🛒"
      eyebrow="Coming Month 3"
      title="Classifieds"
      heroImage="https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1800&q=80&fit=crop&crop=entropy"
      heroAlt="Colorful waterfront scene along the Baja California Sur corridor"
      heroTagline="One person's spare tire is another's treasure."
      description="A free, spam-filtered classifieds board for the Baja corridor. Vehicles, gear, housing, services — listings auto-expire after 30 days."
      launchMonth="Month 3"
      features={[
        "Vehicles, boats, and gear",
        "Housing and rentals",
        "Services and work offered",
        "Free stuff and giveaways",
        "Photo uploads and GPS location",
        "Auto-expiry after 30 days — always fresh",
      ]}
    />
  );
}
