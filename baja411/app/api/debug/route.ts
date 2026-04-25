import { db } from "@/lib/db";

export async function GET() {
  const dbResult: Record<string, string> = {};

  try {
    await db.user.findFirst({ where: { email: "__probe__@example.com" } });
    dbResult.userQuery = "OK";
  } catch (e: any) {
    dbResult.userQuery = e?.message?.split("\n")[0] ?? "error";
  }

  let resendResult = "unknown";
  const apiKey = process.env.RESEND_API_KEY ?? "";
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Baja 411 <onboarding@resend.dev>",
        to: ["delivered@resend.dev"],
        subject: "Debug test",
        text: "This is a test.",
      }),
    });
    const body = await res.json();
    resendResult = res.ok ? "OK" : `${res.status}: ${JSON.stringify(body)}`;
  } catch (e: any) {
    resendResult = e?.message ?? "error";
  }

  return Response.json({
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      hasResendApiKey: !!apiKey,
      resendKeyPrefix: apiKey.slice(0, 8),
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    },
    db: dbResult,
    resend: resendResult,
  });
}
