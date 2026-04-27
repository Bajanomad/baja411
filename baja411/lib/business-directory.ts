import { PinStatus, type Business as PrismaBusiness, type BusinessCategory as PrismaBusinessCategory, type Town as PrismaTown } from "@prisma/client";
import { db } from "@/lib/db";
import { businesses as seedBusinesses, type Business, type BusinessCategory, type BusinessTown } from "@/data/businesses";

const categoryLabels: Record<PrismaBusinessCategory, BusinessCategory> = {
  RESTAURANT: "Food & Coffee",
  BAR: "Food & Coffee",
  BAKERY: "Food & Coffee",
  BREWERY: "Food & Coffee",
  HOTEL: "Hotels & Rentals",
  RENTAL: "Hotels & Rentals",
  MECHANIC: "Auto & Mechanics",
  TIRE_SHOP: "Auto & Mechanics",
  FUEL: "Gas & Supplies",
  MEDICAL: "Medical & Pharmacy",
  DENTAL: "Medical & Pharmacy",
  PHARMACY: "Medical & Pharmacy",
  GROCERY: "Groceries",
  OTHER: "Professional Services",
};

const townLabels: Record<PrismaTown, BusinessTown> = {
  CERRITOS: "Cerritos",
  PESCADERO: "El Pescadero",
  TODOS_SANTOS: "Todos Santos",
  LA_PAZ: "La Paz",
  CABO_SAN_LUCAS: "Cabo San Lucas",
  SAN_JOSE_DEL_CABO: "San José del Cabo",
  LORETO: "Loreto",
  OTHER: "Other",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildTags(business: PrismaBusiness, category: BusinessCategory, town: BusinessTown) {
  const raw = [category, town, business.name, business.address ?? "", business.description ?? ""].join(" ");
  return Array.from(new Set(raw.toLowerCase().split(" ").filter(Boolean))).slice(0, 10);
}

function toDirectoryBusiness(business: PrismaBusiness): Business {
  const category = categoryLabels[business.category] ?? "Professional Services";
  const town = townLabels[business.town] ?? "Other";

  return {
    id: business.id,
    slug: `${slugify(business.name)}-${business.id.slice(0, 6)}`,
    name: business.name,
    category,
    town,
    area: business.address ?? undefined,
    description: business.description ?? "Local Baja business listing. Details are being verified.",
    phone: business.phone ?? undefined,
    whatsapp: business.phone ?? undefined,
    website: business.website ?? undefined,
    address: business.address ?? undefined,
    tags: buildTags(business, category, town),
    latitude: business.lat ?? undefined,
    longitude: business.lng ?? undefined,
    mapPinId: null,
    verified: Boolean(business.lastVerified),
    updatedAt: business.updatedAt.toISOString().slice(0, 10),
  };
}

export async function getDirectoryBusinesses(): Promise<Business[]> {
  try {
    const dbBusinesses = await db.business.findMany({
      where: { status: PinStatus.APPROVED },
      orderBy: [{ lastVerified: "desc" }, { updatedAt: "desc" }, { name: "asc" }],
    });

    if (!dbBusinesses.length) return seedBusinesses;
    return dbBusinesses.map(toDirectoryBusiness);
  } catch (error) {
    console.error("Failed to load businesses from database. Falling back to seed businesses.", error);
    return seedBusinesses;
  }
}
