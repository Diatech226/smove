// file: app/api/admin/login/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "smove_admin_auth";
const AUTH_COOKIE_VALUE = "smove-admin-session";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const password = body?.password as string | undefined;
  const adminPassword = process.env.SMOVE_ADMIN_PASSWORD;

  if (!adminPassword || password !== adminPassword) {
    return NextResponse.json(
      { success: false, error: "Mot de passe incorrect." },
      { status: 401 },
    );
  }

  const cookieStore = cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: AUTH_COOKIE_VALUE,
    httpOnly: true,
    path: "/",
    sameSite: "lax",
  });

  return NextResponse.json({ success: true });
}

export const dynamic = "force-dynamic";
