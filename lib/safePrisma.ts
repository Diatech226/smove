// file: lib/safePrisma.ts
import { Prisma } from "@prisma/client";

import { prisma } from "./prisma";
import { TimeoutError, withTimeout } from "./withTimeout";

export type SafePrismaErrorType = "DB_UNREACHABLE" | "UNKNOWN";

export type SafePrismaResult<T> =
  | { ok: true; data: T }
  | { ok: false; error?: Error; message: string; errorType: SafePrismaErrorType };

const CONNECTION_ERROR_PATTERNS = [
  "Server selection timeout",
  "ReplicaSetNoPrimary",
  "Authentication failed",
  "AuthenticationFailed",
  "TLS",
  "Handshake",
  "I/O error",
  "InternalError",
  "timeout",
];

function isDbConnectivityIssue(error: unknown): boolean {
  if (error instanceof TimeoutError) return true;
  if (error instanceof Prisma.PrismaClientInitializationError) return true;
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return CONNECTION_ERROR_PATTERNS.some((pattern) => error.message.includes(pattern));
  }
  if (error instanceof Error) {
    return CONNECTION_ERROR_PATTERNS.some((pattern) => error.message.includes(pattern));
  }
  return false;
}

export async function safePrisma<T>(
  callback: (client: typeof prisma) => Promise<T>,
  { timeoutMs = 4500 }: { timeoutMs?: number } = {},
): Promise<SafePrismaResult<T>> {
  try {
    const data = await withTimeout(callback(prisma), timeoutMs);
    return { ok: true, data } as const;
  } catch (error) {
    const message = buildPrismaErrorMessage(error);
    const errorType: SafePrismaErrorType = isDbConnectivityIssue(error) ? "DB_UNREACHABLE" : "UNKNOWN";
    console.error("Prisma client error", error);
    return { ok: false, error: error as Error, message, errorType } as const;
  }
}

function buildPrismaErrorMessage(error: unknown): string {
  if (error instanceof TimeoutError) {
    return error.message;
  }
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
