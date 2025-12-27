import type { Prisma } from "@prisma/client";

type RawParams = Record<string, string | string[] | undefined>;

export type UserQueryParams = {
  search: string;
  role: "all" | "admin" | "client";
  status: "all" | "active" | "disabled" | "pending";
  sort: "createdAt_desc" | "createdAt_asc" | "email_asc" | "email_desc" | "role_asc" | "role_desc" | "status_asc" | "status_desc";
  page: number;
  limit: number;
};

const DEFAULT_LIMIT = 12;

export function parseUserQueryParams(params: RawParams): UserQueryParams {
  const search = readParam(params.q);
  const roleParam = readParam(params.role);
  const statusParam = readParam(params.status);
  const sortParam = readParam(params.sort);
  const pageParam = Number(readParam(params.page) || "1");
  const limitParam = Number(readParam(params.limit) || `${DEFAULT_LIMIT}`);

  const role: UserQueryParams["role"] = roleParam === "admin" || roleParam === "client" ? roleParam : "all";
  const status: UserQueryParams["status"] =
    statusParam === "active" || statusParam === "disabled" || statusParam === "pending" ? statusParam : "all";

  const sort: UserQueryParams["sort"] =
    sortParam === "createdAt_asc" ||
    sortParam === "email_asc" ||
    sortParam === "email_desc" ||
    sortParam === "role_asc" ||
    sortParam === "role_desc" ||
    sortParam === "status_asc" ||
    sortParam === "status_desc"
      ? sortParam
      : "createdAt_desc";

  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 50 ? limitParam : DEFAULT_LIMIT;

  return {
    search,
    role,
    status,
    sort,
    page,
    limit,
  };
}

export function buildUserWhere(params: UserQueryParams): Prisma.UserWhereInput {
  const where: Prisma.UserWhereInput = {};

  if (params.search) {
    where.OR = [
      { email: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.role !== "all") {
    where.role = params.role;
  }

  if (params.status !== "all") {
    where.status = params.status;
  }

  return where;
}

export function buildUserOrderBy(params: UserQueryParams): Prisma.UserOrderByWithRelationInput[] {
  const [field, direction] = params.sort.split("_");
  const order = direction === "asc" ? "asc" : "desc";

  return [
    { [field]: order },
    { createdAt: "desc" },
  ];
}

function readParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}
