import { db } from "@/lib/db";

export async function GET() {
  const env = {
    hasAuthSecret: !!process.env.AUTH_SECRET,
    authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
    hasResendApiKey: !!process.env.RESEND_API_KEY,
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    nodeEnv: process.env.NODE_ENV,
    vercel: !!process.env.VERCEL,
  };

  // Test whether each auth table actually exists in the database
  const tables: Record<string, string> = {};

  try {
    await (db as any).user.count();
    tables.User = "ok";
  } catch (e: any) {
    tables.User = e?.message ?? "error";
  }

  try {
    await (db as any).verificationToken.count();
    tables.VerificationToken = "ok";
  } catch (e: any) {
    tables.VerificationToken = e?.message ?? "error";
  }

  try {
    await (db as any).session.count();
    tables.Session = "ok";
  } catch (e: any) {
    tables.Session = e?.message ?? "error";
  }

  try {
    await (db as any).account.count();
    tables.Account = "ok";
  } catch (e: any) {
    tables.Account = e?.message ?? "error";
  }

  return Response.json({ env, tables });
}
