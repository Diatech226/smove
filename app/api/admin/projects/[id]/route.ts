// file: app/api/admin/projects/[id]/route.ts
import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { findAvailableSlug } from "@/lib/admin/slug";
import { safePrisma } from "@/lib/safePrisma";
import { projectSchema } from "@/lib/validation/admin";

type Params = {
  params: { id: string };
};

export async function GET(_request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  if (!params.id) {
    return jsonError("Project id is required", { status: 400, requestId });
  }

  const projectResult = await safePrisma((db) => db.project.findUnique({ where: { id: params.id } }));

  if (!projectResult.ok) {
    console.error("Failed to load project", { requestId, detail: projectResult.message });
    return jsonError("Failed to fetch project", {
      status: 503,
      requestId,
      data: { detail: projectResult.message },
    });
  }

  if (!projectResult.data) {
    return jsonError("Project not found", { status: 404, requestId });
  }

  return jsonOk({ project: projectResult.data }, { status: 200, requestId });
}

export async function PUT(request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  try {
    const json = await request.json().catch(() => null);
    const parsed = projectSchema.safeParse(json ?? {});

    if (!params.id) {
      return jsonError("Project id is required", { status: 400, requestId });
    }

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const { slug, title, client, sector, summary, body: content, results, category, coverImage } = parsed.data;

    const existingResult = await safePrisma((db) => db.project.findUnique({ where: { slug }, select: { id: true } }));
    if (!existingResult.ok) {
      console.error("Failed to validate project slug", { requestId, detail: existingResult.message });
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: existingResult.message },
      });
    }

    if (existingResult.data && existingResult.data.id !== params.id) {
      const suggestion = await findAvailableSlug("project", slug, params.id);
      return jsonError("Un autre projet utilise déjà ce slug.", {
        status: 400,
        requestId,
        data: { suggestedSlug: suggestion },
      });
    }

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
        const suggestion = await findAvailableSlug("project", slug, params.id);
        return jsonError("Un autre projet utilise déjà ce slug.", {
          status: 400,
          requestId,
          data: { suggestedSlug: suggestion },
        });
      }
      console.error("Failed to update project", { requestId, detail: updatedResult.message });
      return jsonError("Failed to update project", {
        status: 503,
        requestId,
        data: { detail: updatedResult.message },
      });
    }

    return jsonOk({ project: updatedResult.data }, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error updating project", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    if (error?.code === "P2002") {
      return jsonError("Un autre projet utilise déjà ce slug.", { status: 400, requestId });
    }
    return jsonError("Failed to update project", { status: 500, requestId });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  try {
    if (!params.id) {
      return jsonError("Project id is required", { status: 400, requestId });
    }
    const deleteResult = await safePrisma((db) => db.project.delete({ where: { id: params.id } }));
    if (!deleteResult.ok) {
      console.error("Failed to delete project", { requestId, detail: deleteResult.message });
      return jsonError("Failed to delete project", {
        status: 503,
        requestId,
        data: { detail: deleteResult.message },
      });
    }
    return jsonOk({}, { status: 200, requestId });
  } catch (error: any) {
    console.error("Error deleting project", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to delete project", { status: 500, requestId });
  }
}
