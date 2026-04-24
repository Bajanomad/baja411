import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = {
  title: "Business Directory — Baja 411",
  description: "Searchable directory of restaurants, mechanics, doctors, hotels, and more in Baja California Sur.",
};

export default function DirectoryPage() {
  return (
    <PlaceholderPage
      icon="🏪"
      eyebrow="Coming Month 3"
      title="Business Directory"
      heroImage="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80&fit=crop&crop=center"
      heroAlt="Golden hour glow on the malecón waterfront of La Paz, Baja California Sur"
      heroTagline="The best spots are the ones locals love."
      description="Restaurants, bars, mechanics, doctors, hotels, and more — searchable by category and town, with community reviews and a map view."
      launchMonth="Month 3"
      features={[
        "Restaurants, bars, bakeries, and breweries",
        "Mechanics, tire shops, and fuel stations",
        "Medical, dental, and pharmacy",
        "Hotels, rentals, and accommodations",
        "Filter by town: Cerritos, La Paz, Cabo, and more",
        "User reviews and ratings",
      ]}
    />
  );
}
