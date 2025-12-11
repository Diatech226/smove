// file: app/api/admin/projects/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, projects }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching projects", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch projects",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { slug, title, client, sector, summary, body: content, results } = (body as Record<string, unknown>) ?? {};

    const requiredFields = [slug, title, client, sector, summary];

    if (!requiredFields.every((value) => typeof value === "string" && value.trim().length)) {
      return NextResponse.json(
        { success: false, error: "Slug, title, client, sector and summary are required" },
        { status: 400 },
      );
    }

    const created = await prisma.project.create({
      data: {
        slug,
        title,
        client,
        sector,
        summary,
        body: content ?? null,
        results: Array.isArray(results)
          ? results.map((item) => (typeof item === "string" ? item : String(item))).filter(Boolean)
          : [],
      },
    });

    return NextResponse.json({ success: true, project: created }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating project", {
      code: error?.code,
      message: error?.message,
    });
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create project",
      },
      { status: 500 },
    );
  }
}
