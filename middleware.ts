// file: middleware.ts
import { NextRequest, NextResponse } from "next/server";

const AUTH_COOKIE_NAME = "smove_admin_auth";
const LOGIN_PATH = "/admin/login";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin") || pathname.startsWith(LOGIN_PATH)) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get(AUTH_COOKIE_NAME);
  const adminSecret = process.env.SMOVE_ADMIN_SECRET;

  if (authCookie?.value && adminSecret && authCookie.value === adminSecret) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("redirectTo", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};
