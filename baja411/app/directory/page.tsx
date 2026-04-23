import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = {
  title: "Business Directory",
  description: "Searchable directory of restaurants, mechanics, doctors, hotels, and more in Baja California Sur.",
};

export default function DirectoryPage() {
  return (
    <PlaceholderPage
      icon="🏪"
      eyebrow="Coming Month 3"
      title="Business Directory"
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
