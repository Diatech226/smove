import type { Prisma } from "@prisma/client";

type RawParams = Record<string, string | string[] | undefined>;

export type PostQueryParams = {
  search: string;
  status: "all" | "published" | "draft";
  category: string;
  tag: string;
  sort: "publishedAt" | "createdAt" | "updatedAt";
  page: number;
  limit: number;
  from?: Date;
  to?: Date;
};

const DEFAULT_LIMIT = 10;

export function parsePostQueryParams(params: RawParams): PostQueryParams {
  const search = readParam(params.search);
  const statusParam = readParam(params.status);
  const category = readParam(params.category);
  const tag = readParam(params.tag);
  const sortParam = readParam(params.sort);
  const pageParam = Number(readParam(params.page) || "1");
  const limitParam = Number(readParam(params.limit) || `${DEFAULT_LIMIT}`);
  const fromParam = readParam(params.from);
  const toParam = readParam(params.to);

  const status = statusParam === "published" || statusParam === "draft" ? statusParam : "all";
  const sort: PostQueryParams["sort"] =
    sortParam === "createdAt" || sortParam === "updatedAt" ? sortParam : "publishedAt";

  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
  const limit = Number.isFinite(limitParam) && limitParam > 0 && limitParam <= 50 ? limitParam : DEFAULT_LIMIT;

  return {
    search,
    status,
    category,
    tag,
    sort,
    page,
    limit,
    from: parseDateParam(fromParam),
    to: parseDateParam(toParam),
  };
}

export function buildPostWhere(params: PostQueryParams): Prisma.PostWhereInput {
  const where: Prisma.PostWhereInput = {};

  if (params.search) {
    where.OR = [
      { title: { contains: params.search, mode: "insensitive" } },
      { excerpt: { contains: params.search, mode: "insensitive" } },
      { slug: { contains: params.search, mode: "insensitive" } },
    ];
  }

  if (params.status === "published") {
    where.published = true;
  }
  if (params.status === "draft") {
    where.published = false;
  }

  if (params.category) {
    where.categorySlug = params.category;
  }

  if (params.tag) {
    where.tags = { has: params.tag };
  }

  if (params.from || params.to) {
    where.createdAt = {
      ...(params.from ? { gte: params.from } : {}),
      ...(params.to ? { lte: params.to } : {}),
    };
  }

  return where;
}

export function buildPostOrderBy(params: PostQueryParams): Prisma.PostOrderByWithRelationInput[] {
  return [
    { [params.sort]: "desc" },
    { createdAt: "desc" },
  ];
}

function readParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) {
    return value[0] ?? "";
  }
  return value ?? "";
}

function parseDateParam(value: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return undefined;
  return date;
}
