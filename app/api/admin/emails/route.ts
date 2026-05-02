import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const user = await db.user.findUnique({ where: { email: session.user.email } });
  return user?.role === "ADMIN" ? user : null;
}

export async function GET() {
  if (!await requireAdmin()) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const users = await db.user.findMany({
    select: { email: true, marketingOptIn: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}
