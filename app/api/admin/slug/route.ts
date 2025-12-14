// file: app/api/admin/slug/route.ts
import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";
import { slugSchema } from "@/lib/validation/admin";

const MODEL_MAP = {
  post: "post",
  service: "service",
  project: "project",
  event: "event",
} as const;

type SupportedType = keyof typeof MODEL_MAP;

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const type = (url.searchParams.get("type") ?? "").trim();
    const slug = (url.searchParams.get("slug") ?? "").trim();

    if (!(type in MODEL_MAP)) {
      return NextResponse.json({ success: false, error: "Type de contenu invalide" }, { status: 400 });
    }

    const parsedSlug = slugSchema.safeParse(slug);
    if (!parsedSlug.success) {
      const message = parsedSlug.error.issues.at(0)?.message ?? "Slug invalide";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const model = MODEL_MAP[type as SupportedType];

    const lookupResult = await safePrisma((db) => (db as any)[model].findUnique({ where: { slug } }));
    if (!lookupResult.ok) {
      return NextResponse.json(
        { success: false, error: "Database unreachable", detail: lookupResult.message },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true, available: !lookupResult.data });
  } catch (error: any) {
    console.error("Error checking slug availability", { code: error?.code, message: error?.message });
    return NextResponse.json({ success: false, error: "Slug check failed" }, { status: 500 });
  }
}
