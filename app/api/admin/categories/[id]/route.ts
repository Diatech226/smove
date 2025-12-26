// file: app/api/admin/categories/[id]/route.ts
import crypto from "crypto";
import { NextResponse } from "next/server";

import { requireAdmin } from "@/lib/admin/auth";
import { safePrisma } from "@/lib/safePrisma";
import { categorySchema } from "@/lib/validation/admin";

type Params = {
  params: { id: string };
};

export async function PATCH(request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;

  const json = await request.json().catch(() => null);
  const parsed = categorySchema.partial().safeParse(json ?? {});

  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  if (!params.id) {
    return NextResponse.json({ success: false, error: "Category id is required" }, { status: 400 });
  }

  const updatedResult = await safePrisma((db) =>
    db.category.update({
      where: { id: params.id },
      data: parsed.data,
    }),
  );

  if (!updatedResult.ok) {
    const traceId = crypto.randomUUID();
    const error = updatedResult.error as any;
    const message = error?.code === "P2002" ? "Une catégorie avec ce slug existe déjà pour ce type." : "Database unreachable";
    console.error("Failed to update category", { traceId, detail: updatedResult.message });
    return NextResponse.json(
      { success: false, error: message, detail: updatedResult.message, traceId },
      { status: error?.code === "P2002" ? 400 : 503 },
    );
  }

  return NextResponse.json({ success: true, category: updatedResult.data }, { status: 200 });
}

export async function DELETE(_request: Request, { params }: Params) {
  const authError = requireAdmin();
  if (authError) return authError;

  if (!params.id) {
    return NextResponse.json({ success: false, error: "Category id is required" }, { status: 400 });
  }

  const deleteResult = await safePrisma((db) => db.category.delete({ where: { id: params.id } }));

  if (!deleteResult.ok) {
    const traceId = crypto.randomUUID();
    console.error("Failed to delete category", { traceId, detail: deleteResult.message });
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: deleteResult.message, traceId },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, category: deleteResult.data }, { status: 200 });
}
