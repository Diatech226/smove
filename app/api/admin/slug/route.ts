import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { safePrisma } from "@/lib/safePrisma";
import { slugSchema } from "@/lib/validation/admin";

const MODEL_MAP = {
  post: { model: "post", labelField: "title" },
  service: { model: "service", labelField: "name" },
  project: { model: "project", labelField: "title" },
  event: { model: "event", labelField: "title" },
} as const;

type SupportedType = keyof typeof MODEL_MAP;

export async function GET(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  const url = new URL(request.url);
  const rawType = (url.searchParams.get("model") ?? url.searchParams.get("type") ?? "").trim().toLowerCase();
  const slug = (url.searchParams.get("slug") ?? "").trim();
  const excludeId = (url.searchParams.get("excludeId") ?? "").trim();

  if (!rawType || !(rawType in MODEL_MAP)) {
    return jsonError("Type de contenu invalide", { status: 400, requestId });
  }

  const parsedSlug = slugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    const message = parsedSlug.error.issues.at(0)?.message ?? "Slug invalide";
    return jsonError(message, { status: 400, requestId });
  }

  const modelConfig = MODEL_MAP[rawType as SupportedType];

  const lookupResult = await safePrisma((db) =>
    (db as any)[modelConfig.model].findUnique({
      where: { slug },
      select: { id: true, slug: true, [modelConfig.labelField]: true },
    }),
  );
  if (!lookupResult.ok) {
    console.error("Slug lookup failed", { requestId, detail: lookupResult.message });
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: lookupResult.message },
    });
  }

  const match = lookupResult.data;
  if (!match) {
    return jsonOk({ available: true }, { status: 200, requestId });
  }

  if (excludeId && match.id === excludeId) {
    return jsonOk({ available: true }, { status: 200, requestId });
  }

  return jsonOk(
    {
      available: false,
      conflict: {
        id: match.id,
        slug: match.slug,
        label: (match as any)[modelConfig.labelField] ?? match.slug,
      },
    },
    { status: 200, requestId },
  );
}
