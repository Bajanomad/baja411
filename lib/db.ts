import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function makeClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set.");
  }
  const adapter = new PrismaPg(connectionString);
  return new PrismaClient({ adapter });
}

// Proxy so the module can be imported without DATABASE_URL at build time.
// The error is deferred until the first actual database call.
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_, prop: string | symbol) {
    const client =
      globalForPrisma.prisma ?? (globalForPrisma.prisma = makeClient());
    return (client as unknown as Record<string | symbol, unknown>)[prop];
  },
});
