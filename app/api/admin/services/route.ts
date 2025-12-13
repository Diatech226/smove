// file: app/api/admin/services/route.ts
import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";
import { serviceSchema } from "@/lib/validation/admin";

export async function GET() {
  const servicesResult = await safePrisma((db) =>
    db.service.findMany({
      orderBy: { createdAt: "desc" },
    }),
  );

  if (!servicesResult.ok) {
    return NextResponse.json(
      { success: false, error: "Database unreachable", detail: servicesResult.message },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, services: servicesResult.data }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const json = await request.json().catch(() => null);
    const parsed = serviceSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return NextResponse.json({ success: false, error: message }, { status: 400 });
    }

    const { name, slug, description, category, image } = parsed.data;

    const createdResult = await safePrisma((db) =>
      db.service.create({
        data: {
          name,
          slug,
          description,
          category: typeof category === "string" ? category : null,
          image: typeof image === "string" ? image : null,
        },
      }),
    );

    if (!createdResult.ok) {
      const error = (createdResult.error as any) ?? {};
      if (error?.code === "P2002") {
        return NextResponse.json({ success: false, error: "Un service utilise déjà ce slug." }, { status: 400 });
      }
      return NextResponse.json(
        { success: false, error: "Database unreachable", detail: createdResult.message },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true, service: createdResult.data }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating service", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create service",
      },
      { status: 500 },
    );
  }
}
