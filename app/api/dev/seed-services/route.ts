import { NextResponse } from "next/server";

import { safePrisma } from "@/lib/safePrisma";

export async function POST() {
  try {
    const demoResult = await safePrisma((db) =>
      db.service.create({
        data: {
          name: "Demo Service",
          slug: "demo-service",
          description: "Service de démonstration pour tester Prisma + MongoDB.",
        },
      }),
    );

    if (!demoResult.ok) {
      return NextResponse.json(
        {
          success: false,
          message: "Error seeding demo service",
          error: { code: (demoResult.error as any)?.code ?? null, message: demoResult.message },
        },
        { status: 503 },
      );
    }

    return NextResponse.json({ success: true, service: demoResult.data });
  } catch (error: any) {
    console.error("Error seeding demo service:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Error seeding demo service",
        error: {
          code: error?.code ?? null,
          message: error?.message ?? "Unknown error",
        },
      },
      { status: 500 },
    );
  }
}
