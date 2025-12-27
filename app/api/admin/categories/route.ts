import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { DEFAULT_CATEGORIES } from "@/lib/config/categories";
import { safePrisma } from "@/lib/safePrisma";
import { categorySchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  const url = new URL(request.url);
  const type = (url.searchParams.get("type") ?? "").trim();

  const categoriesResult = await safePrisma((db) =>
    db.category.findMany({
      where: type ? { type } : undefined,
      orderBy: { order: "asc" },
    }),
  );

  if (!categoriesResult.ok) {
    console.error("Failed to load categories", { requestId, detail: categoriesResult.message });
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: categoriesResult.message },
    });
  }

  return jsonOk({ categories: categoriesResult.data }, { status: 200, requestId });
}

export async function POST(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  const json = await request.json().catch(() => null);

  if (json?.seed) {
    const seedType = typeof json?.type === "string" ? json.type : "post";
    const defaults = DEFAULT_CATEGORIES.filter((category) => category.type === seedType);
    const existingResult = await safePrisma((db) => db.category.count({ where: { type: seedType } }));

    if (!existingResult.ok) {
      console.error("Failed to check category seed", { requestId, detail: existingResult.message });
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: existingResult.message },
      });
    }

    if (existingResult.data > 0) {
      return jsonOk({ categories: [], message: "Des catégories existent déjà pour ce type." }, { status: 200, requestId });
    }

    if (!defaults.length) {
      return jsonError("Aucune catégorie par défaut disponible pour ce type.", { status: 400, requestId });
    }

    const createResult = await safePrisma((db) =>
      db.category.createMany({
        data: defaults.map((category) => ({
          type: category.type,
          name: category.name,
          slug: category.slug,
          order: category.order,
        })),
      }),
    );

    if (!createResult.ok) {
      console.error("Failed to seed categories", { requestId, detail: createResult.message });
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: createResult.message },
      });
    }

    const seededResult = await safePrisma((db) =>
      db.category.findMany({ where: { type: seedType }, orderBy: { order: "asc" } }),
    );

    if (!seededResult.ok) {
      console.error("Failed to reload seeded categories", { requestId, detail: seededResult.message });
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: seededResult.message },
      });
    }

    return jsonOk({ categories: seededResult.data }, { status: 201, requestId });
  }

  const parsed = categorySchema.safeParse(json ?? {});
  if (!parsed.success) {
    const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
    return jsonError(message, { status: 400, requestId });
  }

  const createdResult = await safePrisma((db) =>
    db.category.create({
      data: {
        type: parsed.data.type,
        name: parsed.data.name,
        slug: parsed.data.slug,
        order: parsed.data.order ?? 0,
      },
    }),
  );

  if (!createdResult.ok) {
    const error = createdResult.error as any;
    const message = error?.code === "P2002" ? "Une catégorie avec ce slug existe déjà pour ce type." : "Database unreachable";
    console.error("Failed to create category", { requestId, detail: createdResult.message });
    return jsonError(message, {
      status: error?.code === "P2002" ? 400 : 503,
      requestId,
      data: { detail: createdResult.message },
    });
  }

  return jsonOk({ category: createdResult.data }, { status: 201, requestId });
}
