import { cookies } from "next/headers";

import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";

const AUTH_COOKIE_NAME = "smove_admin_auth";

export async function POST(request: Request) {
  const requestId = createRequestId();
  const body = await request.json().catch(() => ({}));
  const password = (body as { password?: string })?.password;
  const adminPassword = process.env.SMOVE_ADMIN_PASSWORD;
  const adminSecret = process.env.SMOVE_ADMIN_SECRET;

  if (!adminPassword || !adminSecret) {
    return jsonError("Configuration d'authentification manquante.", { status: 500, requestId });
  }

  if (!password) {
    return jsonError("Mot de passe requis", { status: 400, requestId });
  }

  if (password !== adminPassword) {
    return jsonError("Mot de passe incorrect", { status: 401, requestId });
  }

  const response = jsonOk({}, { status: 200, requestId });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: adminSecret,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });

  return response;
}

export const dynamic = "force-dynamic";
