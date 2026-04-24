import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = {
  title: "Blog & Lore — Baja 411",
  description: "History, stories, and deep dives into the culture, landscape, and lore of Baja California.",
};

export default function BlogPage() {
  return (
    <PlaceholderPage
      icon="📖"
      eyebrow="Coming Month 4"
      title="Blog & Lore"
      heroImage="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1800&q=80&fit=crop&crop=center"
      heroAlt="Sweeping desert and mountain panorama at sunrise, Baja California"
      heroTagline="A thousand miles of stories."
      description="Long-form stories about the history, culture, wildlife, and hidden corners of the Baja Peninsula. Written by people who actually live here."
      launchMonth="Month 4"
      features={[
        "History and lore of the peninsula",
        "Local culture, food, and traditions",
        "Wildlife and natural wonders",
        "Expat and overlander stories",
        "Practical guides for living in Baja",
        "Monthly newsletter highlights",
      ]}
    />
  );
}
