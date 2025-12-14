// file: app/api/admin/taxonomies/route.ts
import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";
import { taxonomySchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? undefined;

  const allowedTypes = [
    "service_sector",
    "service_category",
    "project_sector",
    "project_category",
    "post_category",
  ] as const;

  if (type && !allowedTypes.includes(type as (typeof allowedTypes)[number])) {
    return NextResponse.json({ success: false, error: "Type de taxonomie invalide" }, { status: 400 });
  }

  const filter = type ? { where: { type } } : undefined;

  const taxonomiesResult = await safePrisma((db) =>
    db.taxonomy.findMany({
      ...(filter ?? {}),
      orderBy: { order: "asc" },
    }),
  );

  if (!taxonomiesResult.ok) {
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: taxonomiesResult.message },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, taxonomies: taxonomiesResult.data }, { status: 200 });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = taxonomySchema.safeParse(json ?? {});

  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  const { type, slug, label, order, active } = parsed.data;

  const createdResult = await safePrisma((db) =>
    db.taxonomy.create({
      data: { type, slug, label, order: order ?? 0, active: active ?? true },
    }),
  );

  if (!createdResult.ok) {
    const error = (createdResult.error as any) ?? {};
    if (error?.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Une taxonomie avec ce slug existe déjà pour ce type." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: createdResult.message },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, taxonomy: createdResult.data }, { status: 201 });
}
