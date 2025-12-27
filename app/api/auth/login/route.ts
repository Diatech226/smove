import bcrypt from "bcryptjs";
import { z } from "zod";

import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { AUTH_COOKIE_NAME, AUTH_TOKEN_TTL_SECONDS, signAuthToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

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

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
        passwordHash: true,
      },
    });

    if (!user || user.status !== "active" || !user.passwordHash) {
      return jsonError("Identifiants invalides", { status: 401, requestId });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return jsonError("Identifiants invalides", { status: 401, requestId });
    }

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
  } catch (error: any) {
    console.error("Login error", { requestId, message: error?.message });
    return jsonError("Impossible de se connecter.", { status: 500, requestId });
  }
}

export const dynamic = "force-dynamic";
