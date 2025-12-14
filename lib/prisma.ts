// file: lib/prisma.ts
import { PrismaClient } from "@prisma/client";

type DatabaseConfig = { url: string; directUrl?: string };

function getDatabaseConfig(): DatabaseConfig {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      "DATABASE_URL manquante. Ajoutez une URL MongoDB complète incluant la base `smove` dans `.env`.",
    );
  }

  if (!url.includes("/smove")) {
    console.warn("DATABASE_URL ne semble pas cibler la base `smove`. Ajoutez `/smove` à la fin de l'URL MongoDB.");
  }

  const directUrl = process.env.DIRECT_DATABASE_URL;
  if (directUrl && !directUrl.includes("/smove")) {
    console.warn(
      "DIRECT_DATABASE_URL ne semble pas cibler la base `smove`. Ajoutez `/smove` à l'URL direct si elle est utilisée.",
    );
  }

  return directUrl ? { url, directUrl } : { url };
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
    datasources: {
      db: getDatabaseConfig(),
    },
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
