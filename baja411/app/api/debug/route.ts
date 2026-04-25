import { Pool } from "pg";

const PROJECT_REF = "jeaxvuzwcodagtyeykri";
const HOSTS = [
  "aws-0-us-east-1.pooler.supabase.com",
  "aws-0-us-east-2.pooler.supabase.com",
  "aws-1-us-east-2.pooler.supabase.com",
  "aws-0-us-west-1.pooler.supabase.com",
  "aws-0-us-west-2.pooler.supabase.com",
  "aws-0-eu-west-1.pooler.supabase.com",
  "aws-0-eu-west-2.pooler.supabase.com",
  "aws-0-eu-central-1.pooler.supabase.com",
  "aws-0-ap-southeast-1.pooler.supabase.com",
  "aws-0-ap-northeast-1.pooler.supabase.com",
];

async function testHost(host: string, password: string): Promise<string> {
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
  const match = rawUrl.match(/:\/\/[^:]+:(.+)@/);
  const password = match ? decodeURIComponent(match[1]) : "";

  const results: Record<string, string> = {};
  await Promise.all(
    HOSTS.map(async (host) => {
      results[host] = await testHost(host, password);
    })
  );

  const parsedUrl = rawUrl.replace(/:([^@]+)@/, ":[REDACTED]@");

  return Response.json({
    databaseUrlInVercel: parsedUrl || "(empty)",
    passwordLength: password.length,
    testedHosts: results,
    correctHost: Object.entries(results).find(([, v]) => v === "OK")?.[0] ?? null,
  });
}
