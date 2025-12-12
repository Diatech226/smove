// file: lib/safePrisma.ts
import { Prisma } from "@prisma/client";

import { prisma } from "./prisma";

export type SafePrismaResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: Error; message: string };

export async function safePrisma<T>(
  callback: (client: typeof prisma) => Promise<T>,
): Promise<SafePrismaResult<T>> {
  try {
    const data = await callback(prisma);
    return { ok: true, data } as const;
  } catch (error) {
    const message = buildPrismaErrorMessage(error);
    console.error("Prisma client error", error);
    return { ok: false, error: error as Error, message } as const;
  }
}

function buildPrismaErrorMessage(error: unknown): string {
  if (error instanceof Prisma.PrismaClientInitializationError) {
    return "Connexion à la base de données impossible (initialisation Prisma)";
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Erreur Prisma inconnue";
}
