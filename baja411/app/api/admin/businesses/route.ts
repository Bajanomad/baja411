import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"] as const;
const VALID_CATEGORIES = ["RESTAURANT", "BAR", "BAKERY", "BREWERY", "HOTEL", "RENTAL", "MECHANIC", "TIRE_SHOP", "FUEL", "MEDICAL", "DENTAL", "PHARMACY", "GROCERY", "OTHER"] as const;
const VALID_TOWNS = ["CERRITOS", "PESCADERO", "TODOS_SANTOS", "LA_PAZ", "CABO_SAN_LUCAS", "SAN_JOSE_DEL_CABO", "LORETO", "OTHER"] as const;

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await db.user.findUnique({ where: { email: session.user.email } });
  return user?.role === "ADMIN" ? user : null;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const businesses = await db.business.findMany({
    select: {
      id: true,
      name: true,
      category: true,
      town: true,
      address: true,
      phone: true,
      website: true,
      description: true,
      photos: true,
      lat: true,
      lng: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      lastVerified: true,
      author: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(businesses);
}

export async function PATCH(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { id, name, category, town, address, phone, website, description, lat, lng, status, lastVerified } = body;

  if (!id) return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  if (status !== undefined && !VALID_STATUSES.includes(status)) return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  if (category !== undefined && !VALID_CATEGORIES.includes(category)) return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  if (town !== undefined && !VALID_TOWNS.includes(town)) return NextResponse.json({ error: "Invalid town" }, { status: 400 });

  const data: Record<string, unknown> = {};
  if (name !== undefined) data.name = name;
  if (category !== undefined) data.category = category;
  if (town !== undefined) data.town = town;
  if (address !== undefined) data.address = address;
  if (phone !== undefined) data.phone = phone;
  if (website !== undefined) data.website = website;
  if (description !== undefined) data.description = description;
  if (lat !== undefined) data.lat = lat;
  if (lng !== undefined) data.lng = lng;
  if (status !== undefined) data.status = status;
  if (lastVerified !== undefined) data.lastVerified = lastVerified ? new Date(lastVerified) : null;

  const business = await db.business.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      category: true,
      town: true,
      address: true,
      phone: true,
      website: true,
      description: true,
      photos: true,
      lat: true,
      lng: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      lastVerified: true,
      author: { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(business);
}

export async function DELETE(req: NextRequest) {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Invalid" }, { status: 400 });

  await db.business.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
