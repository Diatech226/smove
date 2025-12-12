// file: lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["error", "warn"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/**
 * Wrap Prisma calls to avoid hard crashes in case of connection/auth errors.
 */
export async function safePrisma<T>(
  callback: (client: PrismaClient) => Promise<T>,
): Promise<{ ok: true; data: T } | { ok: false; error: Error }> {
  try {
    const data = await callback(prisma);
    return { ok: true, data } as const;
  } catch (error) {
    console.error("Prisma client error", error);
    return { ok: false, error: error as Error } as const;
  }
}
