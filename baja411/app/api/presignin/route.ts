import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { email, optIn } = await req.json();
  if (!email || typeof email !== "string") {
    return NextResponse.json({ error: "email required" }, { status: 400 });
  }

  await db.pendingOptIn.upsert({
    where: { email },
    create: { email, optIn: !!optIn, expiresAt: new Date(Date.now() + 3_600_000) },
    update: { optIn: !!optIn, expiresAt: new Date(Date.now() + 3_600_000) },
  });

  return NextResponse.json({ ok: true });
}
