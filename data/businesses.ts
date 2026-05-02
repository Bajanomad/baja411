export type BusinessCategory =
  | "Food & Coffee"
  | "Gas & Supplies"
  | "Auto & Mechanics"
  | "Medical & Pharmacy"
  | "Groceries"
  | "Hardware"
  | "Water & Propane"
  | "Hotels & Rentals"
  | "Real Estate"
  | "Tours & Activities"
  | "Pets & Vets"
  | "Professional Services"
  | "Emergency";

export type BusinessTown =
  | "Cerritos"
  | "El Pescadero"
  | "Todos Santos"
  | "La Paz"
  | "Cabo San Lucas"
  | "San José del Cabo"
  | "Loreto"
  | "Other";

export type Business = {
  id: string;
  slug: string;
  name: string;
  category: BusinessCategory;
  town: BusinessTown;
  area?: string;
  description: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  address?: string;
  tags: string[];
  latitude?: number;
  longitude?: number;
  mapPinId?: string | null;
  verified?: boolean;
  updatedAt: string;
};

export const businessCategories: BusinessCategory[] = [
  "Food & Coffee",
  "Gas & Supplies",
  "Auto & Mechanics",
  "Medical & Pharmacy",
  "Groceries",
  "Hardware",
  "Water & Propane",
  "Hotels & Rentals",
  "Real Estate",
  "Tours & Activities",
  "Pets & Vets",
  "Professional Services",
  "Emergency",
];

export const businessTowns: BusinessTown[] = [
  "Cerritos",
  "El Pescadero",
  "Todos Santos",
  "La Paz",
  "Cabo San Lucas",
  "San José del Cabo",
  "Loreto",
  "Other",
];

export const businesses: Business[] = [
  {
    id: "sample-fuel-pescadero",
    slug: "pescadero-fuel-stop",
    name: "Pescadero Fuel Stop",
    category: "Gas & Supplies",
    town: "El Pescadero",
    area: "Highway corridor",
    description: "Fuel stop placeholder for the directory backbone. Replace with verified local info before launch.",
    tags: ["fuel", "gas", "road stop", "supplies"],
    mapPinId: null,
    verified: false,
    updatedAt: "2026-04-27",
  },
  {
    id: "sample-mechanic-todos-santos",
    slug: "todos-santos-mechanic",
    name: "Todos Santos Mechanic",
    category: "Auto & Mechanics",
    town: "Todos Santos",
    description: "Auto repair placeholder for search, category filters, and future map-pin linking.",
    tags: ["mechanic", "auto", "repair", "tires"],
    mapPinId: null,
    verified: false,
    updatedAt: "2026-04-27",
  },
  {
    id: "sample-pharmacy-la-paz",
    slug: "la-paz-pharmacy",
    name: "La Paz Pharmacy",
    category: "Medical & Pharmacy",
    town: "La Paz",
    description: "Pharmacy placeholder for medical and everyday needs in the directory layout.",
    tags: ["pharmacy", "medicine", "medical", "health"],
    mapPinId: null,
    verified: false,
    updatedAt: "2026-04-27",
  },
  {
    id: "sample-coffee-cerritos",
    slug: "cerritos-coffee",
    name: "Cerritos Coffee Spot",
    category: "Food & Coffee",
    town: "Cerritos",
    description: "Coffee and food placeholder so the page has real card behavior before business data is loaded.",
    tags: ["coffee", "food", "breakfast", "cafe"],
    mapPinId: null,
    verified: false,
    updatedAt: "2026-04-27",
  },
];
