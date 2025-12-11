// file: lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

if (!process.env.DATABASE_URL) {
  console.error(">>> ERROR: process.env.DATABASE_URL is not defined!");
} else {
  console.log(">>> Prisma DATABASE_URL at runtime:", process.env.DATABASE_URL);
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (!globalForPrisma.prisma) {
  globalForPrisma.prisma = prisma;
}
