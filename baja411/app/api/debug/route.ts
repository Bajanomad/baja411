import { Pool } from "pg";

const PROJECT_REF = "jeaxvuzwcodagtyeykri";
const REGIONS = [
  "us-east-1",
  "us-east-2",
  "us-west-1",
  "us-west-2",
  "eu-west-1",
  "eu-west-2",
  "eu-central-1",
  "ap-southeast-1",
  "ap-northeast-1",
];

async function testPooler(region: string, password: string): Promise<string> {
  const host = `aws-0-${region}.pooler.supabase.com`;
  const pool = new Pool({
    host,
    port: 6543,
    database: "postgres",
    user: `postgres.${PROJECT_REF}`,
    password,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 4000,
  });
  try {
    const client = await pool.connect();
    client.release();
    await pool.end();
    return "OK";
  } catch (e: any) {
    await pool.end().catch(() => {});
    return e?.message?.split("\n")[0] ?? "error";
  }
}

export async function GET() {
  const rawUrl = process.env.DATABASE_URL ?? "";
  // Extract password from current DATABASE_URL
  const match = rawUrl.match(/:\/\/[^:]+:(.+)@/);
  const password = match ? decodeURIComponent(match[1]) : "";

  const results: Record<string, string> = {};
  await Promise.all(
    REGIONS.map(async (region) => {
      results[region] = await testPooler(region, password);
    })
  );

  return Response.json({
    testedRegions: results,
    correctRegion: Object.entries(results).find(([, v]) => v === "OK")?.[0] ?? null,
  });
}
