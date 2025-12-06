// file: app/api/admin/logout/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "smove_admin_auth";

export async function POST() {
  const cookieStore = cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });

  return NextResponse.json({ success: true });
}

export const dynamic = "force-dynamic";
