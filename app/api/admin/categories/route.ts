// file: app/api/admin/categories/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { DEFAULT_CATEGORIES } from "@/lib/config/categories";
import { safePrisma } from "@/lib/safePrisma";
import { categorySchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;

  const url = new URL(request.url);
  const type = (url.searchParams.get("type") ?? "").trim();

  const categoriesResult = await safePrisma((db) =>
    db.category.findMany({
      where: type ? { type } : undefined,
      orderBy: { order: "asc" },
    }),
  );

  if (!categoriesResult.ok) {
    const traceId = crypto.randomUUID();
    console.error("Failed to load categories", { traceId, detail: categoriesResult.message });
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: categoriesResult.message, traceId },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, categories: categoriesResult.data }, { status: 200 });
}

export async function POST(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;

  const json = await request.json().catch(() => null);

  if (json?.seed) {
    const seedType = typeof json?.type === "string" ? json.type : "post";
    const defaults = DEFAULT_CATEGORIES.filter((category) => category.type === seedType);
    const existingResult = await safePrisma((db) => db.category.count({ where: { type: seedType } }));

    if (!existingResult.ok) {
      const traceId = crypto.randomUUID();
      console.error("Failed to check category seed", { traceId, detail: existingResult.message });
      return NextResponse.json(
        { success: false, error: "Database unreachable", detail: existingResult.message, traceId },
        { status: 503 },
      );
    }

    if (existingResult.data > 0) {
      return NextResponse.json(
        { success: true, categories: [], message: "Des catégories existent déjà pour ce type." },
        { status: 200 },
      );
    }

    if (!defaults.length) {
      return NextResponse.json(
        { success: false, error: "Aucune catégorie par défaut disponible pour ce type." },
        { status: 400 },
      );
    }

    const createResult = await safePrisma((db) =>
      db.category.createMany({
        data: defaults.map((category) => ({
          type: category.type,
          name: category.name,
          slug: category.slug,
          order: category.order,
        })),
      }),
    );

    if (!createResult.ok) {
      const traceId = crypto.randomUUID();
      console.error("Failed to seed categories", { traceId, detail: createResult.message });
      return NextResponse.json(
        { success: false, error: "Database unreachable", detail: createResult.message, traceId },
        { status: 503 },
      );
    }

    const seededResult = await safePrisma((db) =>
      db.category.findMany({ where: { type: seedType }, orderBy: { order: "asc" } }),
    );

    if (!seededResult.ok) {
      const traceId = crypto.randomUUID();
      console.error("Failed to reload seeded categories", { traceId, detail: seededResult.message });
      return NextResponse.json(
        { success: false, error: "Database unreachable", detail: seededResult.message, traceId },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true, categories: seededResult.data }, { status: 201 });
  }

  const parsed = categorySchema.safeParse(json ?? {});
  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  const createdResult = await safePrisma((db) =>
    db.category.create({
      data: {
        type: parsed.data.type,
        name: parsed.data.name,
        slug: parsed.data.slug,
        order: parsed.data.order ?? 0,
      },
    }),
  );

  if (!createdResult.ok) {
    const traceId = crypto.randomUUID();
    const error = createdResult.error as any;
    const message = error?.code === "P2002" ? "Une catégorie avec ce slug existe déjà pour ce type." : "Database unreachable";
    console.error("Failed to create category", { traceId, detail: createdResult.message });
    return NextResponse.json(
      { success: false, error: message, detail: createdResult.message, traceId },
      { status: error?.code === "P2002" ? 400 : 503 },
    );
  }

  return NextResponse.json({ success: true, category: createdResult.data }, { status: 201 });
}
