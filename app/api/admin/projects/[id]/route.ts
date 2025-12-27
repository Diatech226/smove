// file: app/api/admin/projects/[id]/route.ts
import { createRequestId, jsonWithRequestId } from "@/lib/api/requestId";
import { safePrisma } from "@/lib/safePrisma";
import { projectSchema } from "@/lib/validation/admin";

type Params = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: Params) {
  const requestId = createRequestId();
  if (!params.id) {
    return jsonWithRequestId({ success: false, error: "Project id is required" }, { status: 400, requestId });
  }

  const projectResult = await safePrisma((db) => db.project.findUnique({ where: { id: params.id } }));

  if (!projectResult.ok) {
    console.error("Failed to load project", { requestId, detail: projectResult.message });
    return jsonWithRequestId(
      { success: false, error: "Failed to fetch project", detail: projectResult.message },
      { status: 503, requestId },
    );
  }

  if (!projectResult.data) {
    return jsonWithRequestId({ success: false, error: "Project not found" }, { status: 404, requestId });
  }

  return jsonWithRequestId({ success: true, project: projectResult.data }, { status: 200, requestId });
}

export async function PUT(request: Request, { params }: Params) {
  const requestId = createRequestId();
  try {
    const json = await request.json().catch(() => null);
    const parsed = projectSchema.safeParse(json ?? {});

    if (!params.id) {
      return jsonWithRequestId({ success: false, error: "Project id is required" }, { status: 400, requestId });
    }

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonWithRequestId({ success: false, error: message }, { status: 400, requestId });
    }

    const { slug, title, client, sector, summary, body: content, results, category, coverImage } = parsed.data;

    const updatedResult = await safePrisma((db) =>
      db.project.update({
        where: { id: params.id },
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

    if (!updatedResult.ok) {
      const error = updatedResult.error as any;
      if (error?.code === "P2002") {
        return jsonWithRequestId(
          { success: false, error: "Un autre projet utilise déjà ce slug." },
          { status: 400, requestId },
        );
      }
      console.error("Failed to update project", { requestId, detail: updatedResult.message });
      return jsonWithRequestId(
        { success: false, error: "Failed to update project", detail: updatedResult.message },
        { status: 503, requestId },
      );
    }

    return jsonWithRequestId({ success: true, project: updatedResult.data }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error updating project", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      return jsonWithRequestId(
        { success: false, error: "Un autre projet utilise déjà ce slug." },
        { status: 400, requestId },
      );
    }
    return jsonWithRequestId({ success: false, error: "Failed to update project" }, { status: 500, requestId });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const requestId = createRequestId();
  try {
    if (!params.id) {
      return jsonWithRequestId({ success: false, error: "Project id is required" }, { status: 400, requestId });
    }
    const deleteResult = await safePrisma((db) => db.project.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      console.error("Failed to delete project", { requestId, detail: deleteResult.message });
      return jsonWithRequestId(
        { success: false, error: "Failed to delete project", detail: deleteResult.message },
        { status: 503, requestId },
      );
    }
    return jsonWithRequestId({ success: true }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error deleting project", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    return jsonWithRequestId({ success: false, error: "Failed to delete project" }, { status: 500, requestId });
  }
}
