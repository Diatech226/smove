import { cookies } from "next/headers";
import { jsonError } from "@/lib/api/response";

const AUTH_COOKIE_NAME = "smove_admin_auth";

export function requireAdmin() {
  const authCookie = cookies().get(AUTH_COOKIE_NAME);
  const adminSecret = process.env.SMOVE_ADMIN_SECRET;

  if (authCookie?.value && adminSecret && authCookie.value === adminSecret) {
    return null;
  }

  return jsonError("Non autorisé", { status: 401 });
}
