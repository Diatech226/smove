import { jsonWithRequestId } from "@/lib/api/requestId";

type JsonResponseOptions = {
  status?: number;
  requestId?: string;
};

export function jsonOk<T>(data: T, options: JsonResponseOptions = {}) {
  return jsonWithRequestId({ ok: true, data }, options);
}

export function jsonError(
  error: string,
  { data = null, ...options }: JsonResponseOptions & { data?: Record<string, unknown> | null } = {},
) {
  return jsonWithRequestId({ ok: false, error, data }, options);
}
