// file: app/api/admin/services/route.ts
import { NextResponse } from "next/server";
import { safePrisma } from "@/lib/safePrisma";

export async function GET() {
  const servicesResult = await safePrisma((db) =>
    db.service.findMany({
      orderBy: { createdAt: "desc" },
    }),
  );

  if (!servicesResult.ok) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch services", detail: servicesResult.message },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, services: servicesResult.data }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { name, slug, description, category, image } = (body as Record<string, unknown>) ?? {};

    if (![name, slug, description].every((value) => typeof value === "string" && value.trim().length)) {
      return NextResponse.json({ success: false, error: "Name, slug and description are required" }, { status: 400 });
    }

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
      return NextResponse.json({ success: false, error: "Failed to create service" }, { status: 503 });
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
