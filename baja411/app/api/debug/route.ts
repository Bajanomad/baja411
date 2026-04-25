import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function GET() {
  const dbResult: Record<string, string> = {};

  try {
    await db.user.findFirst({ where: { email: "__probe__@example.com" } });
    dbResult.userQuery = "OK";
  } catch (e: any) {
    dbResult.userQuery = e?.message?.split("\n")[0] ?? "error";
  }

  let authResult = "unknown";
  try {
    await auth();
    authResult = "OK";
  } catch (e: any) {
    authResult = e?.message?.split("\n")[0] ?? "error";
  }

  return Response.json({
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      resendKeyPrefix: process.env.RESEND_API_KEY?.slice(0, 8) ?? "",
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    },
    db: dbResult,
    auth: authResult,
  });
}
