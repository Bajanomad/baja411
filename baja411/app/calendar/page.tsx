import type { Metadata } from "next";
import PlaceholderPage from "@/components/PlaceholderPage";

export const metadata: Metadata = {
  title: "Events Calendar",
  description: "Local events, festivals, art walks, and fiestas across the Baja California Sur corridor.",
};

export default function CalendarPage() {
  return (
    <PlaceholderPage
      icon="📅"
      eyebrow="Coming Month 4"
      title="Events Calendar"
      description="Never miss a festival, art walk, market day, or government holiday in the corridor again. Filterable by town and category."
      launchMonth="Month 4"
      features={[
        "Festivals, fiestas, and cultural events",
        "Art walks and gallery openings",
        "Markets and flea markets",
        "Government holidays and closures",
        "Filter by town: Todos Santos, La Paz, Cabo, and more",
        "User-submitted community events",
      ]}
    />
  );
}
