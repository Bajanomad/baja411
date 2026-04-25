import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";

export async function GET() {
  const adapter = PrismaAdapter(db);

  const adapterResults: Record<string, string> = {};

  try {
    await adapter.getUserByEmail!("__debug_probe__@example.com");
    adapterResults.getUserByEmail = "OK";
  } catch (e: any) {
    adapterResults.getUserByEmail = e?.message?.split("\n")[0] ?? "error";
  }

  try {
    const token = await adapter.createVerificationToken!({
      identifier: "__debug_probe__@example.com",
      token: "debug-token-" + Date.now(),
      expires: new Date(Date.now() + 60000),
    });
    adapterResults.createVerificationToken = token ? "OK" : "returned null";
    // Clean up
    await adapter.useVerificationToken!({
      identifier: "__debug_probe__@example.com",
      token: token!.token,
    }).catch(() => {});
  } catch (e: any) {
    adapterResults.createVerificationToken = e?.message?.split("\n")[0] ?? "error";
  }

  return Response.json({
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
    },
    adapter: adapterResults,
  });
}
