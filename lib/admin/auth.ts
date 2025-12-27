import { cookies } from "next/headers";
import { jsonError } from "@/lib/api/response";
import { getUser, verifyAuthToken, AUTH_COOKIE_NAME } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
  const authCookie = cookies().get(AUTH_COOKIE_NAME);
  if (!authCookie?.value) {
    return jsonError("Non autorisé", { status: 401 });
  }

  const payload = await verifyAuthToken(authCookie.value);
  if (!payload || payload.role !== "admin") {
    return jsonError("Non autorisé", { status: 401 });
  }

  const user = await getUser(prisma, payload.sub);
  if (!user || user.status !== "active") {
    return jsonError("Non autorisé", { status: 401 });
  }

  return null;
}
