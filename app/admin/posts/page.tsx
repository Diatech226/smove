// file: app/admin/posts/page.tsx
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildPostOrderBy, buildPostWhere, parsePostQueryParams } from "@/lib/admin/postQueries";
import { safePrisma } from "@/lib/safePrisma";

import { PostRow } from "./_components/PostRow";

type PostListItem = {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  categoryId?: string | null;
  status: "draft" | "published" | "archived" | "removed";
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export const dynamic = "force-dynamic";

type AdminPostsPageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
};

export default async function AdminPostsPage({ searchParams = {} }: AdminPostsPageProps) {
  const params = parsePostQueryParams(searchParams);
  const where = buildPostWhere(params);
  const orderBy = buildPostOrderBy(params);
  const skip = (params.page - 1) * params.limit;

  const [postsResult, countResult, categoriesResult] = await Promise.all([
    safePrisma((db) =>
      db.post.findMany({
        where,
        orderBy,
        skip,
        take: params.limit,
        select: {
          id: true,
          title: true,
          slug: true,
          tags: true,
          categoryId: true,
          status: true,
          publishedAt: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ),
    safePrisma((db) => db.post.count({ where })),
    safePrisma((db) =>
      db.category.findMany({
        where: { type: "post" },
        orderBy: { order: "asc" },
      }),
    ),
  ]);
  const posts = (postsResult.ok ? postsResult.data : []) as PostListItem[];
  const loadError = !postsResult.ok;
  const total = countResult.ok ? countResult.data : posts.length;
  const totalPages = Math.max(1, Math.ceil(total / params.limit));
  const isPrevDisabled = params.page <= 1;
  const isNextDisabled = params.page >= totalPages;
  const categories = categoriesResult.ok ? categoriesResult.data : [];
  const categoryMap = new Map(categories.map((category) => [category.id, category.name]));

  const buildQuery = (next: Partial<typeof params>) => {
    const merged = { ...params, ...next };
    const search = new URLSearchParams();
    if (merged.search) search.set("search", merged.search);
    if (merged.status && merged.status !== "all") search.set("status", merged.status);
    if (merged.category) search.set("category", merged.category);
    if (merged.tag) search.set("tag", merged.tag);
    if (merged.sort) search.set("sort", merged.sort);
    if (merged.page > 1) search.set("page", String(merged.page));
    if (merged.limit !== 10) search.set("limit", String(merged.limit));
    if (merged.from instanceof Date && !Number.isNaN(merged.from.valueOf())) {
      search.set("from", merged.from.toISOString().slice(0, 10));
    }
    if (merged.to instanceof Date && !Number.isNaN(merged.to.valueOf())) {
      search.set("to", merged.to.toISOString().slice(0, 10));
    }
    const query = search.toString();
    return query ? `/admin/posts?${query}` : "/admin/posts";
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Articles"
        subtitle="Gérez la bibliothèque éditoriale du blog."
        actions={
          <Button href="/admin/posts/new">Nouvel article</Button>
        }
      />

      <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Articles & statuts</h2>
            <p className="text-sm text-slate-300">Affinez la recherche, filtrez et pilotez les statuts rapidement.</p>
          </div>
          <div className="text-sm text-slate-300">
            {total} article(s) • page {params.page} / {totalPages}
          </div>
        </div>

        <form className="mt-6 grid gap-4 rounded-xl border border-white/10 bg-slate-950/40 p-4 md:grid-cols-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="search">
              Recherche
            </label>
            <input
              id="search"
              name="search"
              defaultValue={params.search}
              placeholder="Titre, slug, extrait..."
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="status">
              Statut
            </label>
            <select
              id="status"
              name="status"
              defaultValue={params.status}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="all">Tous</option>
              <option value="published">Publié</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archivé</option>
              <option value="removed">Retiré</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="category">
              Rubrique
            </label>
            <select
              id="category"
              name="category"
              defaultValue={params.category}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="">Toutes</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="tag">
              Tag
            </label>
            <input
              id="tag"
              name="tag"
              defaultValue={params.tag}
              placeholder="marketing"
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="from">
              Du
            </label>
            <input
              id="from"
              name="from"
              type="date"
              defaultValue={params.from ? params.from.toISOString().slice(0, 10) : ""}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="to">
              Au
            </label>
            <input
              id="to"
              name="to"
              type="date"
              defaultValue={params.to ? params.to.toISOString().slice(0, 10) : ""}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="sort">
              Tri
            </label>
            <select
              id="sort"
              name="sort"
              defaultValue={params.sort}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="publishedAt">Publié récemment</option>
              <option value="createdAt">Créé récemment</option>
              <option value="updatedAt">Mis à jour</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="limit">
              Par page
            </label>
            <select
              id="limit"
              name="limit"
              defaultValue={params.limit}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              {[10, 20, 30, 40, 50].map((limit) => (
                <option key={limit} value={limit}>
                  {limit}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end gap-2">
            <Button type="submit" className="w-full">
              Filtrer
            </Button>
            <Button href="/admin/posts" variant="ghost" className="border border-white/10 px-4 py-2 text-slate-200">
              Réinitialiser
            </Button>
          </div>
        </form>

        <div className="mt-6 overflow-x-auto">
          {loadError ? (
            <p className="mb-4 text-sm text-amber-200">
              Impossible de charger les articles. Vérifiez l'authentification ou la connexion à la base de données, puis
              réessayez.
            </p>
          ) : null}
          <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
            <thead>
              <tr>
                <th className="px-3 py-2 font-semibold">Titre</th>
                <th className="px-3 py-2 font-semibold">Slug</th>
                <th className="px-3 py-2 font-semibold">Rubrique</th>
                <th className="px-3 py-2 font-semibold">Tags</th>
                <th className="px-3 py-2 font-semibold">Statut</th>
                <th className="px-3 py-2 font-semibold">Publié le</th>
                <th className="px-3 py-2 font-semibold">Créé le</th>
                <th className="px-3 py-2 font-semibold">Mis à jour</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <PostRow
                  key={post.id}
                  post={post}
                  categoryLabel={post.categoryId ? categoryMap.get(post.categoryId) ?? post.categoryId : undefined}
                />
              ))}
              {!posts.length ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-slate-300" colSpan={9}>
                    Aucun article pour le moment. Créez votre premier contenu avec le bouton "Nouvel article".
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <p>
            Page {params.page} sur {totalPages}
          </p>
          <div className="flex items-center gap-2">
            {isPrevDisabled ? (
              <Button variant="secondary" className="px-3 py-1 text-xs" disabled>
                Précédent
              </Button>
            ) : (
              <Button href={buildQuery({ page: Math.max(1, params.page - 1) })} variant="secondary" className="px-3 py-1 text-xs">
                Précédent
              </Button>
            )}
            {isNextDisabled ? (
              <Button variant="secondary" className="px-3 py-1 text-xs" disabled>
                Suivant
              </Button>
            ) : (
              <Button href={buildQuery({ page: Math.min(totalPages, params.page + 1) })} variant="secondary" className="px-3 py-1 text-xs">
                Suivant
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
