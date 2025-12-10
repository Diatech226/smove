// file: app/api/admin/login/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "smove_admin_auth";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = (body as { password?: string })?.password;
  const adminPassword = process.env.SMOVE_ADMIN_PASSWORD;
  const adminSecret = process.env.SMOVE_ADMIN_SECRET;

  if (!adminPassword || !adminSecret) {
    return NextResponse.json(
      { success: false, error: "Configuration d'authentification manquante." },
      { status: 500 },
    );
  }

  if (!password) {
    return NextResponse.json({ success: false, error: "Mot de passe requis" }, { status: 400 });
  }

  if (password !== adminPassword) {
    return NextResponse.json(
      { success: false, error: "Mot de passe incorrect" },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ success: true });
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
