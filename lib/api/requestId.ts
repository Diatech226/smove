import crypto from "crypto";
import { NextResponse } from "next/server";

export function createRequestId() {
  return crypto.randomUUID();
}

export function jsonWithRequestId<T extends Record<string, unknown>>(
  payload: T,
  { status = 200, requestId }: { status?: number; requestId?: string } = {},
) {
  const resolvedRequestId = requestId ?? createRequestId();
  const response = NextResponse.json({ requestId: resolvedRequestId, ...payload }, { status });
  response.headers.set("x-request-id", resolvedRequestId);
  return response;
}
