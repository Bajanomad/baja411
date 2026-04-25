import NextAuth from "next-auth";
import Resend from "next-auth/providers/resend";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";

// Lazy init: setEnvDefaults runs per-request so AUTH_SECRET is always read fresh.
export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  trustHost: true,
  adapter: PrismaAdapter(db),
  providers: [
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: "Baja 411 <onboarding@resend.dev>",
    }),
  ],
}));
