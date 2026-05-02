import NextAuth from "next-auth";
import Nodemailer from "next-auth/providers/nodemailer";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";

export const { handlers, auth, signIn, signOut } = NextAuth(() => ({
  trustHost: true,
  adapter: PrismaAdapter(db),
  pages: {
    signIn: "/signin",
  },
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
  events: {
    async signIn({ user }) {
      if (!user.email) return;
      const pending = await db.pendingOptIn.findUnique({ where: { email: user.email } });
      if (!pending) return;
      await db.user.update({
        where: { email: user.email },
        data: { marketingOptIn: pending.optIn },
      });
      await db.pendingOptIn.delete({ where: { email: user.email } });
    },
  },
}));
