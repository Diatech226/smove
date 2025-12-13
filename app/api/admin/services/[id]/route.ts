// file: app/api/admin/services/[id]/route.ts
import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";
import { serviceSchema } from "@/lib/validation/admin";

type Params = {
  params: { id: string };
};

export async function PUT(request: Request, { params }: Params) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = serviceSchema.safeParse(json ?? {});

    if (!params.id) {
      return NextResponse.json({ success: false, error: "Service id is required" }, { status: 400 });
    }

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const { name, slug, description, category, image } = parsed.data;

    const updatedResult = await safePrisma((db) =>
      db.service.update({
        where: { id: params.id },
        data: {
          name,
          slug,
          description,
          category: typeof category === "string" ? category : null,
          image: typeof image === "string" ? image : null,
        },
      }),
    );

    if (!updatedResult.ok) {
      const error = updatedResult.error as any;
      if (error?.code === "P2002") {
        return NextResponse.json({ success: false, error: "Un autre service utilise déjà ce slug." }, { status: 400 });
      }
      return NextResponse.json(
        { success: false, error: "Database unreachable", detail: updatedResult.message },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true, service: updatedResult.data });
  } catch (error: any) {
    console.error("Error updating service", {
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      return NextResponse.json({ success: false, error: "Un autre service utilise déjà ce slug." }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    if (!params.id) {
      return NextResponse.json({ success: false, error: "Service id is required" }, { status: 400 });
    }
    const deleteResult = await safePrisma((db) => db.service.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      return NextResponse.json(
        { success: false, error: "Database unreachable", detail: deleteResult.message },
        { status: 503 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error deleting service", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json({ success: false, error: "Failed to delete service" }, { status: 500 });
  }
}
