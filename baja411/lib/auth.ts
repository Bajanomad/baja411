import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";

// Lazy init: setEnvDefaults runs per-request so AUTH_SECRET is always read fresh.
export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  trustHost: true,
  adapter: PrismaAdapter(db),
  providers: [
    Nodemailer({
      server: {
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
}));
