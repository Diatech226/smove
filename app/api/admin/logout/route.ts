import { cookies } from "next/headers";

import { createRequestId, jsonWithRequestId } from "@/lib/api/requestId";

const AUTH_COOKIE_NAME = "smove_admin_auth";

export async function POST() {
  const requestId = createRequestId();
  const cookieStore = cookies();
  cookieStore.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
  });

  return jsonWithRequestId({ success: true }, { status: 200, requestId });
}

export const dynamic = "force-dynamic";
