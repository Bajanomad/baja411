import { BusinessCategory, Town } from "@prisma/client";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

function cleanRequiredText(value: unknown, maxLength: number) { if (typeof value !== "string") return ""; return value.trim().slice(0, maxLength); }
function cleanOptionalText(value: unknown, maxLength: number) { if (typeof value !== "string") return null; const trimmed = value.trim().slice(0, maxLength); return trimmed.length ? trimmed : null; }
function parseOptionalCoordinate(value: unknown): number | null { if (value == null) return null; if (typeof value === "string" && value.trim() === "") return null; const num = typeof value === "number" ? value : Number(value); return Number.isFinite(num) ? num : Number.NaN; }

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid JSON" }, { status: 400 }); }
  if (!body || typeof body !== "object") return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  const data = body as Record<string, unknown>;
  const name = cleanRequiredText(data.name, 120);
  const category = data.category;
  const town = data.town;
  const description = cleanRequiredText(data.description, 1000);
  const address = cleanOptionalText(data.address, 240);
  const phone = cleanOptionalText(data.phone, 60);
  const website = cleanOptionalText(data.website, 240);
  const lat = parseOptionalCoordinate(data.lat);
  const lng = parseOptionalCoordinate(data.lng);
  if (!name) return NextResponse.json({ error: "Business name is required" }, { status: 400 });
  if (!description) return NextResponse.json({ error: "Short description is required" }, { status: 400 });
  if (typeof category !== "string" || !Object.values(BusinessCategory).includes(category as BusinessCategory)) return NextResponse.json({ error: "Category is invalid" }, { status: 400 });
  if (typeof town !== "string" || !Object.values(Town).includes(town as Town)) return NextResponse.json({ error: "Town is invalid" }, { status: 400 });
  if (website && !/^https?:\/\//i.test(website)) return NextResponse.json({ error: "Website must start with http:// or https://" }, { status: 400 });
  if (lat !== null && (Number.isNaN(lat) || lat < -90 || lat > 90)) return NextResponse.json({ error: "Latitude is invalid" }, { status: 400 });
  if (lng !== null && (Number.isNaN(lng) || lng < -180 || lng > 180)) return NextResponse.json({ error: "Longitude is invalid" }, { status: 400 });
  try {
    const business = await db.business.create({ data: { name, category: category as BusinessCategory, town: town as Town, description, address, phone, website, lat, lng, photos: [], status: "PENDING", authorId: session.user.id }, select: { id: true, status: true } });
    return NextResponse.json(business, { status: 201 });
  } catch { return NextResponse.json({ error: "Unable to submit listing right now" }, { status: 500 }); }
}
