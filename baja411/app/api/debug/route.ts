import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";

export async function GET() {
  const adapter = PrismaAdapter(db);
  const adapterMethods = Object.keys(adapter as object);

  const requiredEmailMethods = [
    "createVerificationToken",
    "useVerificationToken",
    "getUserByEmail",
  ];
  const missingMethods = requiredEmailMethods.filter(
    (m) => !(m in (adapter as object))
  );

  return Response.json({
    env: {
      hasAuthSecret: !!process.env.AUTH_SECRET,
      authSecretLength: process.env.AUTH_SECRET?.length ?? 0,
      hasResendApiKey: !!process.env.RESEND_API_KEY,
      hasDatabaseUrl: !!process.env.DATABASE_URL,
      hasNextauthUrl: !!process.env.NEXTAUTH_URL,
      hasAuthUrl: !!process.env.AUTH_URL,
      nodeEnv: process.env.NODE_ENV,
      vercel: !!process.env.VERCEL,
    },
    adapter: {
      methods: adapterMethods,
      missingRequiredMethods: missingMethods,
      allRequiredPresent: missingMethods.length === 0,
    },
  });
}
