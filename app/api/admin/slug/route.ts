// file: app/api/admin/slug/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";

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

  const url = new URL(request.url);
  const rawType = (url.searchParams.get("model") ?? url.searchParams.get("type") ?? "").trim().toLowerCase();
  const slug = (url.searchParams.get("slug") ?? "").trim();
  const excludeId = (url.searchParams.get("excludeId") ?? "").trim();

  if (!rawType || !(rawType in MODEL_MAP)) {
    return NextResponse.json({ success: false, error: "Type de contenu invalide" }, { status: 400 });
  }

  const parsedSlug = slugSchema.safeParse(slug);
  if (!parsedSlug.success) {
    const message = parsedSlug.error.issues.at(0)?.message ?? "Slug invalide";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  const modelConfig = MODEL_MAP[rawType as SupportedType];

  const lookupResult = await safePrisma((db) =>
    (db as any)[modelConfig.model].findUnique({
      where: { slug },
      select: { id: true, slug: true, [modelConfig.labelField]: true },
    }),
  );
  if (!lookupResult.ok) {
    const traceId = crypto.randomUUID();
    console.error("Slug lookup failed", { traceId, detail: lookupResult.message });
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: lookupResult.message, traceId },
      { status: 503 },
    );
  }

  const match = lookupResult.data;
  if (!match) {
    return NextResponse.json({ success: true, available: true });
  }

  if (excludeId && match.id === excludeId) {
    return NextResponse.json({ success: true, available: true });
  }

  return NextResponse.json({
    success: true,
    available: false,
    conflict: {
      id: match.id,
      slug: match.slug,
      label: (match as any)[modelConfig.labelField] ?? match.slug,
    },
  });
}
