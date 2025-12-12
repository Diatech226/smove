// file: app/api/admin/projects/route.ts
import { NextResponse } from "next/server";
import { safePrisma } from "@/lib/safePrisma";

export async function GET() {
  const projectsResult = await safePrisma((db) =>
    db.project.findMany({
      orderBy: { createdAt: "desc" },
    }),
  );

  if (!projectsResult.ok) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects", detail: projectsResult.message },
      { status: 503 },
    );
  }

  return NextResponse.json({ success: true, projects: projectsResult.data }, { status: 200 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const { slug, title, client, sector, summary, body: content, results, category, coverImage } =
      (body as Record<string, unknown>) ?? {};

    const requiredFields = [slug, title, client, sector, summary];

    if (!requiredFields.every((value) => typeof value === "string" && value.trim().length)) {
      return NextResponse.json(
        { success: false, error: "Slug, title, client, sector and summary are required" },
        { status: 400 },
      );
    }

    const createdResult = await safePrisma((db) =>
      db.project.create({
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
          category: typeof category === "string" ? category : null,
          coverImage: typeof coverImage === "string" ? coverImage : null,
        },
      }),
    );

    if (!createdResult.ok) {
      const error = createdResult.error as any;
      if (error?.code === "P2002") {
        return NextResponse.json({ success: false, error: "Un projet utilise déjà ce slug." }, { status: 400 });
      }
      return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 503 });
    }

    return NextResponse.json({ success: true, project: createdResult.data }, { status: 201 });
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
