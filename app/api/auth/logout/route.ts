import { jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const requestId = createRequestId();
  const response = jsonOk({}, { status: 200, requestId });
  response.cookies.set({
    name: AUTH_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export const dynamic = "force-dynamic";
