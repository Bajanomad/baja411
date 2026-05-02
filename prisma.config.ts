import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  datasource: {
    // Fallback keeps `prisma generate` working during CI/build when
    // DATABASE_URL isn't injected yet. The real URL is required at runtime.
    url: process.env.DATABASE_URL ?? "postgresql://build:build@localhost:5432/build",
  },
});
