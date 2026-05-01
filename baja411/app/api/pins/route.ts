import { NextResponse } from "next/server";
import { BusinessCategory, PinCategory, Town } from "@prisma/client";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const revalidate = 60;

const PIN_CATEGORIES = new Set<PinCategory>([
  PinCategory.BOONDOCKING,
  PinCategory.BEACH,
  PinCategory.WATER_FILL,
  PinCategory.DUMP_STATION,
  PinCategory.MECHANIC,
  PinCategory.FUEL,
  PinCategory.TRAILHEAD,
  PinCategory.FISHING,
  PinCategory.MARKET,
  PinCategory.OTHER,
]);

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function parseCoordinate(value: unknown) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return Number.NaN;
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

function isPinCategory(value: unknown): value is PinCategory {
  return typeof value === "string" && PIN_CATEGORIES.has(value as PinCategory);
}



function mapBusinessCategoryToPinCategory(category: BusinessCategory): PinCategory {
  if (category === BusinessCategory.FUEL) return PinCategory.FUEL;
  if (category === BusinessCategory.MECHANIC || category === BusinessCategory.TIRE_SHOP) return PinCategory.MECHANIC;
  if ([BusinessCategory.RESTAURANT, BusinessCategory.BAR, BusinessCategory.BAKERY, BusinessCategory.BREWERY, BusinessCategory.GROCERY].includes(category)) {
    return PinCategory.MARKET;
  }
  return PinCategory.OTHER;
}

function formatTown(town: Town): string {
  return town.replaceAll("_", " ");
}
export async function GET() {
  try {
    const [pins, businesses] = await Promise.all([
      db.mapPin.findMany({
        where: { status: "APPROVED" },
        select: {
          id: true,
          title: true,
          description: true,
          lat: true,
          lng: true,
          category: true,
          createdAt: true,
          author: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      }),
      db.business.findMany({
        where: { status: "APPROVED", lat: { not: null }, lng: { not: null } },
        select: {
          id: true,
          name: true,
          description: true,
          lat: true,
          lng: true,
          category: true,
          address: true,
          phone: true,
          website: true,
          town: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    const pinEntries = pins.map((pin) => ({ ...pin, source: "PIN" as const }));
    const businessEntries = businesses.map((business) => ({
      id: `business-${business.id}`,
      title: business.name,
      description: business.description,
      lat: business.lat as number,
      lng: business.lng as number,
      category: mapBusinessCategoryToPinCategory(business.category),
      createdAt: business.createdAt,
      source: "BUSINESS" as const,
      businessId: business.id,
      address: business.address,
      phone: business.phone,
      website: business.website,
      town: formatTown(business.town),
      author: null,
    }));

    return NextResponse.json([...pinEntries, ...businessEntries]);
  } catch {
    return NextResponse.json({ error: "Database unavailable", pins: [] }, { status: 503 });
  }
}

export async function POST(req: Request) {
  let session;
  try {
    session = await auth();
  } catch {
    session = null;
  }

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const data = body as Record<string, unknown>;
  const title = cleanText(data.title, 100);
  const description = cleanText(data.description, 800);
  const lat = parseCoordinate(data.lat);
  const lng = parseCoordinate(data.lng);
  const category = data.category;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  if (!isFiniteNumber(lat) || lat < -90 || lat > 90) {
    return NextResponse.json({ error: "Latitude is invalid" }, { status: 400 });
  }

  if (!isFiniteNumber(lng) || lng < -180 || lng > 180) {
    return NextResponse.json({ error: "Longitude is invalid" }, { status: 400 });
  }

  if (!isPinCategory(category)) {
    return NextResponse.json({ error: "Category is invalid" }, { status: 400 });
  }

  try {
    const pin = await db.mapPin.create({
      data: {
        title,
        description: description || null,
        lat,
        lng,
        category,
        photos: [],
        status: "PENDING",
        authorId: session.user.id,
      },
    });
    return NextResponse.json(pin, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
