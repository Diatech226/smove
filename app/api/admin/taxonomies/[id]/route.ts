// file: app/api/admin/taxonomies/[id]/route.ts
import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";
import { taxonomySchema } from "@/lib/validation/admin";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const json = await request.json().catch(() => null);
  const parsed = taxonomySchema.safeParse(json ?? {});

  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }

  const updateResult = await safePrisma((db) =>
    db.taxonomy.update({
      where: { id: params.id },
      data: parsed.data,
    }),
  );

  if (!updateResult.ok) {
    const error = (updateResult.error as any) ?? {};
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, error: "Taxonomie introuvable." }, { status: 404 });
    }
    if (error?.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "Une taxonomie avec ce slug existe déjà pour ce type." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: updateResult.message },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, taxonomy: updateResult.data }, { status: 200 });
}

export async function DELETE(_request: Request, { params }: { params: { id: string } }) {
  const deleteResult = await safePrisma((db) => db.taxonomy.delete({ where: { id: params.id } }));

  if (!deleteResult.ok) {
    const error = (deleteResult.error as any) ?? {};
    if (error?.code === "P2025") {
      return NextResponse.json({ success: false, error: "Taxonomie introuvable." }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: deleteResult.message },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, taxonomy: deleteResult.data }, { status: 200 });
}
