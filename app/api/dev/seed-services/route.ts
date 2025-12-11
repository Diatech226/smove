import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST() {
  try {
    const demo = await prisma.service.create({
      data: {
        name: "Demo Service",
        slug: "demo-service",
        description: "Service de démonstration pour tester Prisma + MongoDB.",
      },
    });

    return NextResponse.json({ success: true, service: demo });
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
