import { db } from "@/lib/db";

export async function GET() {
  const results: Record<string, string> = {};

  try {
    await db.user.findFirst({ where: { email: "__probe__@example.com" } });
    results.userQuery = "OK";
  } catch (e: any) {
    results.userQuery = e?.message?.split("\n")[0] ?? "error";
  }

  try {
    await db.verificationToken.findFirst({
      where: { identifier: "__probe__@example.com" },
    });
    results.verificationTokenQuery = "OK";
  } catch (e: any) {
    results.verificationTokenQuery = e?.message?.split("\n")[0] ?? "error";
  }

  return Response.json({
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    },
    db: results,
  });
}
