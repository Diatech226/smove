// file: lib/safePrisma.ts
import { Prisma } from "@prisma/client";

import { prisma } from "./prisma";
import { TimeoutError, withTimeout } from "./withTimeout";

export type SafePrismaErrorType = "DB_UNREACHABLE" | "AUTH_FAILED" | "IP_NOT_ALLOWED" | "INVALID_URL" | "UNKNOWN";

export type SafePrismaResult<T> =
  | { ok: true; data: T }
  | { ok: false; error?: Error; message: string; errorType: SafePrismaErrorType };

const CONNECTION_ERROR_PATTERNS = [
  "Server selection timeout",
  "ReplicaSetNoPrimary",
  "Authentication failed",
  "AuthenticationFailed",
  "SCRAM",
  "TLS",
  "Handshake",
  "I/O error",
  "InternalError",
  "timeout",
];

const AUTH_ERROR_PATTERNS = ["Authentication failed", "AuthenticationFailed", "SCRAM", "bad auth"];

const IP_ERROR_PATTERNS = ["IP address", "not authorized", "whitelist", "Network Access"];

const URL_ERROR_PATTERNS = ["Invalid connection string", "Failed to parse", "invalid scheme", "URI"];

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

function detectErrorType(error: unknown): SafePrismaErrorType {
  const message = error instanceof Error ? error.message : String(error);

  if (AUTH_ERROR_PATTERNS.some((pattern) => message.includes(pattern))) {
    return "AUTH_FAILED";
  }

  if (IP_ERROR_PATTERNS.some((pattern) => message.includes(pattern))) {
    return "IP_NOT_ALLOWED";
  }

  if (URL_ERROR_PATTERNS.some((pattern) => message.includes(pattern))) {
    return "INVALID_URL";
  }

  return isDbConnectivityIssue(error) ? "DB_UNREACHABLE" : "UNKNOWN";
}

export async function safePrisma<T>(
  callback: (client: typeof prisma) => Promise<T>,
  { timeoutMs = 4500 }: { timeoutMs?: number } = {},
): Promise<SafePrismaResult<T>> {
  try {
    const data = await withTimeout(callback(prisma), timeoutMs);
    return { ok: true, data } as const;
  } catch (error) {
    const errorType = detectErrorType(error);
    const message = buildPrismaErrorMessage(error, errorType);
    console.error("Prisma client error", { errorType, message });
    return { ok: false, error: error as Error, message, errorType } as const;
  }
}

function buildPrismaErrorMessage(error: unknown, errorType: SafePrismaErrorType): string {
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
    if (errorType === "AUTH_FAILED") {
      return "Échec d'authentification MongoDB (vérifiez user/mot de passe + encodage URL).";
    }
    if (errorType === "IP_NOT_ALLOWED") {
      return "IP non autorisée sur MongoDB Atlas (ajoutez l'IP dans Network Access).";
    }
    if (errorType === "INVALID_URL") {
      return "URL MongoDB invalide (vérifiez le format mongodb+srv://.../smove et les caractères encodés).";
    }
    return error.message;
  }
  return "Erreur Prisma inconnue";
}
