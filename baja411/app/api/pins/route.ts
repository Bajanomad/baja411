import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export const revalidate = 60;

const SEED_PINS = [
  {
    id: "seed-1",
    title: "Playa Balandra",
    description: "Shallow turquoise lagoon north of La Paz. No fees, no services. Perfect for kayaking.",
    lat: 24.3622,
    lng: -110.3422,
    category: "BEACH",
    author: { name: "Baja 411" },
    createdAt: new Date(0),
  },
  {
    id: "seed-2",
    title: "El Sargento Free Camp",
    description: "Flat gravel pull-off on the East Cape road. 30A hookups at the nearby palapa.",
    lat: 24.1081,
    lng: -109.9494,
    category: "BOONDOCKING",
    author: { name: "Baja 411" },
    createdAt: new Date(0),
  },
  {
    id: "seed-3",
    title: "Agua Pura La Paz (Centro)",
    description: "Water refill station on Blvd. Forjadores. 5-gallon jugs, purified RO water.",
    lat: 24.1353,
    lng: -110.3127,
    category: "WATER_FILL",
    author: { name: "Baja 411" },
    createdAt: new Date(0),
  },
  {
    id: "seed-4",
    title: "PEMEX Todos Santos",
    description: "The one and only fuel station in Todos Santos. Diesel and Magna available.",
    lat: 23.4507,
    lng: -110.2249,
    category: "FUEL",
    author: { name: "Baja 411" },
    createdAt: new Date(0),
  },
  {
    id: "seed-5",
    title: "Mechanic — Taller Juárez",
    description: "Reliable diesel and gasoline mechanic near the La Paz bus terminal. English spoken.",
    lat: 24.1424,
    lng: -110.3098,
    category: "MECHANIC",
    author: { name: "Baja 411" },
    createdAt: new Date(0),
  },
  {
    id: "seed-6",
    title: "Cerro La Laguna Trailhead",
    description: "6km round-trip to a pine-forest summit lake above Todos Santos. Bring water.",
    lat: 23.5003,
    lng: -110.1741,
    category: "TRAILHEAD",
    author: { name: "Baja 411" },
    createdAt: new Date(0),
  },
  {
    id: "seed-7",
    title: "Playa Los Cerritos",
    description: "Best surf beach on the Pacific side. Gentle breaks, reliable year-round.",
    lat: 23.2839,
    lng: -110.0548,
    category: "BEACH",
    author: { name: "Baja 411" },
    createdAt: new Date(0),
  },
  {
    id: "seed-8",
    title: "Punta Pescadero — East Cape Boondock",
    description: "Rocky point with incredible sunrises. No facilities. Self-contained only.",
    lat: 23.9056,
    lng: -109.8229,
    category: "BOONDOCKING",
    author: { name: "Baja 411" },
    createdAt: new Date(0),
  },
  {
    id: "seed-9",
    title: "Mercado El Sinai — La Paz",
    description: "Best local market for fresh produce, meats, and spices. Open 7am–2pm daily.",
    lat: 24.1472,
    lng: -110.3052,
    category: "MARKET",
    author: { name: "Baja 411" },
    createdAt: new Date(0),
  },
  {
    id: "seed-10",
    title: "Dump Station — La Paz Marina",
    description: "RV/boat dump station at the La Paz marina. Bring your own adapter.",
    lat: 24.1621,
    lng: -110.3229,
    category: "DUMP_STATION",
    author: { name: "Baja 411" },
    createdAt: new Date(0),
  },
];

export async function GET() {
  try {
    const pins = await db.mapPin.findMany({
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
    });

    const dbIds = new Set(pins.map((p) => p.id));
    const merged = [...pins, ...SEED_PINS.filter((s) => !dbIds.has(s.id))];

    return NextResponse.json(merged);
  } catch {
    return NextResponse.json(SEED_PINS);
  }
}

export async function POST(req: Request) {
  let session;
  try {
    session = await getServerSession(authOptions);
  } catch {
    session = null;
  }

  if (!session?.user || !(session.user as { id?: string }).id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { title, description, lat, lng, category } = body;

  if (!title || lat == null || lng == null || !category) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  try {
    const pin = await db.mapPin.create({
      data: {
        title: String(title),
        description: description ? String(description) : null,
        lat: Number(lat),
        lng: Number(lng),
        category,
        photos: [],
        status: "PENDING",
        authorId: (session.user as { id: string }).id,
      },
    });
    return NextResponse.json(pin, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
