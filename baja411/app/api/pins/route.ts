import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export const revalidate = 60;

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

    return NextResponse.json(pins);
  } catch {
    return NextResponse.json([]);
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
        authorId: session.user.id,
      },
    });
    return NextResponse.json(pin, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
