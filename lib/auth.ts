import { SignJWT, jwtVerify } from "jose";
import type { PrismaClient } from "@prisma/client";

export const AUTH_COOKIE_NAME = "smove_auth";
export const AUTH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 7;

const encoder = new TextEncoder();

export type AuthTokenPayload = {
  sub: string;
  role: "admin" | "client";
};

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET manquant. Ajoutez-le dans le fichier .env.");
  }
  return secret;
}

export async function signAuthToken(payload: AuthTokenPayload): Promise<string> {
  return new SignJWT({ role: payload.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encoder.encode(getJwtSecret()));
}

export async function verifyAuthToken(token: string): Promise<AuthTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(getJwtSecret()));
    if (!payload.sub || typeof payload.sub !== "string") return null;
    if (payload.role !== "admin" && payload.role !== "client") return null;
    return { sub: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export async function getUser(client: PrismaClient, userId: string) {
  return client.user.findUnique({
    where: { id: userId },
  });
}
