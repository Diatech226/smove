// file: app/api/admin/events/route.ts
import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { findAvailableSlug } from "@/lib/admin/slug";
import { safePrisma } from "@/lib/safePrisma";
import { eventSchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  const url = new URL(request.url);
  const rawPage = Number(url.searchParams.get("page") ?? "1");
  const rawLimit = Number(url.searchParams.get("limit") ?? "12");
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1;
  const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? Math.min(50, rawLimit) : 12;
  const skip = (page - 1) * limit;

  const [eventsResult, countResult] = await Promise.all([
    safePrisma((db) =>
      db.event.findMany({
        orderBy: { date: "desc" },
        skip,
        take: limit,
        include: {
          cover: true,
        },
      }),
    ),
    safePrisma((db) => db.event.count()),
  ]);

  if (!eventsResult.ok || !countResult.ok) {
    console.error("Failed to fetch events", { requestId, detail: eventsResult.message });
    return jsonError("Failed to fetch events", {
      status: 503,
      requestId,
      data: { detail: eventsResult.ok ? countResult.message : eventsResult.message },
    });
  }

  const total = countResult.data;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return jsonOk({ events: eventsResult.data, page, total, totalPages, limit }, { status: 200, requestId });
}

export async function POST(request: Request) {
  const authError = await requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  try {
    const json = await request.json().catch(() => null);
    const parsed = eventSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const { slug, title, date, location, description, category, coverMediaId, status } = parsed.data;
    const parsedDate = date instanceof Date ? date : new Date(date);

    const existingResult = await safePrisma((db) => db.event.findUnique({ where: { slug }, select: { id: true } }));
    if (!existingResult.ok) {
      console.error("Failed to validate event slug", { requestId, detail: existingResult.message });
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: existingResult.message },
      });
    }

    if (existingResult.data) {
      const suggestion = await findAvailableSlug("event", slug);
      return jsonError("Un événement utilise déjà ce slug.", {
        status: 400,
        requestId,
        data: { suggestedSlug: suggestion },
      });
    }

    const createdResult = await safePrisma((db) =>
      db.event.create({
        data: {
          slug,
          title,
          date: parsedDate,
          location: typeof location === "string" ? location : null,
          description: typeof description === "string" ? description : null,
          category: typeof category === "string" ? category : null,
          coverMediaId,
          status: status ?? "published",
        },
      }),
    );

    if (!createdResult.ok) {
      const error = (createdResult.error as any) ?? {};
      if (error?.code === "P2002") {
        const suggestion = await findAvailableSlug("event", slug);
        return jsonError("Un événement utilise déjà ce slug.", {
          status: 400,
          requestId,
          data: { suggestedSlug: suggestion },
        });
      }
      return jsonError("Failed to create event", {
        status: 503,
        requestId,
        data: { detail: createdResult.message },
      });
    }

    return jsonOk({ event: createdResult.data }, { status: 201, requestId });
  } catch (error: any) {
    console.error("Error creating event", { code: error?.code, message: error?.message });
    if (error?.code === "P2002") {
      return jsonError("Un événement utilise déjà ce slug.", { status: 400, requestId });
    }
    return jsonError("Failed to create event", { status: 500, requestId });
  }
}
