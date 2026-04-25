import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST() {
  // Create table + seed on first run, then atomically increment
  await db.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "SiteCounter" (
      id TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0
    )
  `);
  await db.$executeRawUnsafe(`
    INSERT INTO "SiteCounter" (id, count) VALUES ('visits', 1420)
    ON CONFLICT (id) DO NOTHING
  `);
  const rows = await db.$queryRawUnsafe<Array<{ count: bigint }>>(
    `UPDATE "SiteCounter" SET count = count + 1 WHERE id = 'visits' RETURNING count`
  );
  return NextResponse.json({ count: Number(rows[0].count) });
}
