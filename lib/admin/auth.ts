import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "smove_admin_auth";

export function requireAdmin() {
  const authCookie = cookies().get(AUTH_COOKIE_NAME);
  const adminSecret = process.env.SMOVE_ADMIN_SECRET;

  if (authCookie?.value && adminSecret && authCookie.value === adminSecret) {
    return null;
  }

  return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
}
