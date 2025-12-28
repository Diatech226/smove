import bcrypt from "bcryptjs";
import { z } from "zod";

import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_TTL_SECONDS, signAuthToken } from "@/lib/auth";
import { safePrisma } from "@/lib/safePrisma";

const failedLoginAttempts = new Map<
  string,
  {
    count: number;
    firstFailureAt: number;
    lastFailureAt: number;
  }
>();

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_BLOCK_MS = 30_000;
const RATE_LIMIT_MAX_ATTEMPTS = 5;

const loginSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

const BOOTSTRAP_ROLE_VALUES = new Set(["admin", "client"]);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getClientIp = (request: Request) => {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const [first] = forwarded.split(",");
    return first?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") ?? "unknown";
};

const isRateLimited = (ip: string) => {
  const entry = failedLoginAttempts.get(ip);
  if (!entry) return false;
  const now = Date.now();
  if (now - entry.firstFailureAt > RATE_LIMIT_WINDOW_MS) {
    failedLoginAttempts.delete(ip);
    return false;
  }
  return entry.count >= RATE_LIMIT_MAX_ATTEMPTS && now - entry.lastFailureAt < RATE_LIMIT_BLOCK_MS;
};

const recordFailure = (ip: string) => {
  const now = Date.now();
  const entry = failedLoginAttempts.get(ip);
  if (!entry || now - entry.firstFailureAt > RATE_LIMIT_WINDOW_MS) {
    failedLoginAttempts.set(ip, { count: 1, firstFailureAt: now, lastFailureAt: now });
    return;
  }
  entry.count += 1;
  entry.lastFailureAt = now;
  failedLoginAttempts.set(ip, entry);
};

const clearFailures = (ip: string) => {
  failedLoginAttempts.delete(ip);
};

export async function POST(request: Request) {
  const requestId = createRequestId();
  try {
    const json = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const { email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const clientIp = getClientIp(request);

    if (isRateLimited(clientIp)) {
      return jsonError("Trop de tentatives. Réessayez dans quelques instants.", { status: 429, requestId });
    }

    const userResult = await safePrisma((db) =>
      db.user.findUnique({
        where: { email: normalizedEmail },
        select: {
          id: true,
          email: true,
          role: true,
          status: true,
          passwordHash: true,
        },
      }),
    );

    if (!userResult.ok) {
      console.error("Login database error", { requestId, detail: userResult.message });
      return jsonError("Connexion à la base de données impossible.", {
        status: 503,
        requestId,
        data: { detail: userResult.message },
      });
    }

    const user = userResult.data;

    if (user && user.status === "active" && user.passwordHash) {
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (isValid) {
        clearFailures(clientIp);
        const token = await signAuthToken({ sub: user.id, role: user.role });
        const response = jsonOk(
          { user: { id: user.id, email: user.email, role: user.role } },
          { status: 200, requestId },
        );
        response.cookies.set({
          name: AUTH_COOKIE_NAME,
          value: token,
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: AUTH_TOKEN_TTL_SECONDS,
        });

        return response;
      }
    }

    const bootstrapEnabled = process.env.ADMIN_BOOTSTRAP_ENABLED === "true";
    const bootstrapAllowProd = process.env.ADMIN_BOOTSTRAP_ALLOW_PROD === "true";
    const bootstrapEmail = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim().toLowerCase();
    const bootstrapPassword = process.env.ADMIN_BOOTSTRAP_PASSWORD ?? "";
    const bootstrapRoleInput = process.env.ADMIN_BOOTSTRAP_ROLE?.trim().toLowerCase() ?? "admin";
    const bootstrapRole = (BOOTSTRAP_ROLE_VALUES.has(bootstrapRoleInput) ? bootstrapRoleInput : "admin") as
      | "admin"
      | "client";
    const isProd = process.env.NODE_ENV === "production";
    const bootstrapAllowed =
      bootstrapEnabled &&
      Boolean(bootstrapEmail) &&
      bootstrapPassword.length > 0 &&
      (!isProd || bootstrapAllowProd);

    if (bootstrapEnabled && isProd && !bootstrapAllowProd) {
      console.warn("Admin bootstrap login blocked in production", { requestId });
    }

    if (bootstrapAllowed && bootstrapEmail === normalizedEmail) {
      if (bootstrapPassword === password) {
        const shouldCreate = !user;
        const passwordHash = await bcrypt.hash(bootstrapPassword, 12);
        const bootstrapResult = await safePrisma((db) =>
          db.user.upsert({
            where: { email: bootstrapEmail },
            update: {
              role: bootstrapRole,
              status: "active",
              passwordHash,
            },
            create: {
              email: bootstrapEmail,
              role: bootstrapRole,
              status: "active",
              passwordHash,
            },
            select: {
              id: true,
              email: true,
              role: true,
            },
          }),
        );

        if (!bootstrapResult.ok) {
          console.error("Bootstrap admin creation failed", { requestId, detail: bootstrapResult.message });
          return jsonError("Connexion à la base de données impossible.", {
            status: 503,
            requestId,
            data: { detail: bootstrapResult.message },
          });
        }

        const bootstrapUser = bootstrapResult.data;

        if (!isProd) {
          console.warn("Admin bootstrap login used", { requestId, email: bootstrapUser.email });
        }

        clearFailures(clientIp);
        const token = await signAuthToken({ sub: bootstrapUser.id, role: bootstrapUser.role });
        const response = jsonOk(
          {
            user: { id: bootstrapUser.id, email: bootstrapUser.email, role: bootstrapUser.role },
            bootstrapCreated: shouldCreate,
          },
          { status: 200, requestId },
        );
        response.cookies.set({
          name: AUTH_COOKIE_NAME,
          value: token,
          httpOnly: true,
          path: "/",
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: AUTH_TOKEN_TTL_SECONDS,
        });

        return response;
      }
    }

    recordFailure(clientIp);
    await sleep(300);
    return jsonError("Identifiants invalides", { status: 401, requestId });
  } catch (error: any) {
    console.error("Login error", { requestId, message: error?.message });
    return jsonError("Impossible de se connecter.", { status: 500, requestId });
  }
}

export const dynamic = "force-dynamic";
