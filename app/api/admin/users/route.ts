import { jsonError, jsonOk } from "@/lib/api/response";
import { createRequestId } from "@/lib/api/requestId";
import { requireAdmin } from "@/lib/admin/auth";
import { buildUserOrderBy, buildUserWhere, parseUserQueryParams } from "@/lib/admin/userQueries";
import { safePrisma } from "@/lib/safePrisma";
import { userCreateSchema } from "@/lib/validation/admin";

export async function GET(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();
  const url = new URL(request.url);
  const params = parseUserQueryParams(Object.fromEntries(url.searchParams.entries()));
  const skip = (params.page - 1) * params.limit;

  const [usersResult, countResult] = await Promise.all([
    safePrisma((db) =>
      db.user.findMany({
        where: buildUserWhere(params),
        orderBy: buildUserOrderBy(params),
        skip,
        take: params.limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      }),
    ),
    safePrisma((db) => db.user.count({ where: buildUserWhere(params) })),
  ]);

  if (!usersResult.ok || !countResult.ok) {
    console.error("Failed to fetch users", {
      requestId,
      detail: usersResult.ok ? countResult.message : usersResult.message,
    });
    return jsonError("Database unreachable", {
      status: 503,
      requestId,
      data: { detail: usersResult.ok ? countResult.message : usersResult.message },
    });
  }

  const total = countResult.data;
  const totalPages = Math.max(1, Math.ceil(total / params.limit));

  return jsonOk(
    {
      users: usersResult.data,
      page: params.page,
      total,
      totalPages,
      limit: params.limit,
    },
    { status: 200, requestId },
  );
}

export async function POST(request: Request) {
  const authError = requireAdmin();
  if (authError) return authError;
  const requestId = createRequestId();

  try {
    const json = await request.json().catch(() => null);
    const parsed = userCreateSchema.safeParse(json ?? {});

    if (!parsed.success) {
      const message = parsed.error.issues.at(0)?.message ?? "Payload invalide";
      return jsonError(message, { status: 400, requestId });
    }

    const payload = parsed.data;
    const email = payload.email.trim().toLowerCase();
    const name = payload.name?.trim() || null;
    const role = payload.role ?? "client";
    const status = payload.status ?? "active";

    const createdResult = await safePrisma((db) =>
      db.user.create({
        data: {
          email,
          name,
          role,
          status,
        },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
        },
      }),
    );

    if (!createdResult.ok) {
      const error = createdResult.error as any;
      if (error?.code === "P2002") {
        return jsonError("Un utilisateur utilise déjà cet email.", { status: 400, requestId });
      }
      return jsonError("Database unreachable", {
        status: 503,
        requestId,
        data: { detail: createdResult.message },
      });
    }

    return jsonOk({ user: createdResult.data }, { status: 201, requestId });
  } catch (error: any) {
    console.error("Error creating user", {
      requestId,
      code: error?.code,
      message: error?.message,
    });
    return jsonError("Failed to create user", { status: 500, requestId });
  }
}
