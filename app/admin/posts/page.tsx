// file: app/admin/posts/page.tsx
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildPostOrderBy, buildPostWhere, parsePostQueryParams } from "@/lib/admin/postQueries";
import { safePrisma } from "@/lib/safePrisma";

import { DeletePostButton } from "./_components/DeletePostButton";
import { PublishToggleButton } from "./_components/PublishToggleButton";

type PostListItem = {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  categorySlug?: string | null;
  published: boolean;
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
      }),
    ),
    safePrisma((db) => db.post.count({ where })),
    safePrisma((db) =>
      db.taxonomy.findMany({
        where: { type: "post_category", active: true },
        orderBy: { order: "asc" },
      }),
    ),
  ]);
  const posts = (postsResult.ok ? postsResult.data : []) as PostListItem[];
  const loadError = !postsResult.ok;
  const total = countResult.ok ? countResult.data : posts.length;
  const totalPages = Math.max(1, Math.ceil(total / params.limit));
  const categories = categoriesResult.ok ? categoriesResult.data : [];
  const categoryMap = new Map(categories.map((category) => [category.slug, category.label]));

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
          <Button asChild>
            <Link href="/admin/posts/new">Nouvel article</Link>
          </Button>
        }
      />

      <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Articles publiés et brouillons</h2>
            <p className="text-sm text-slate-300">Affinez la recherche, filtrez et pilotez la publication rapidement.</p>
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
                <option key={category.slug} value={category.slug}>
                  {category.label}
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
            <Button asChild type="button" variant="ghost" className="border border-white/10 px-4 py-2 text-slate-200">
              <Link href="/admin/posts">Réinitialiser</Link>
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
                <th className="px-3 py-2 font-semibold">Publié</th>
                <th className="px-3 py-2 font-semibold">Publié le</th>
                <th className="px-3 py-2 font-semibold">Créé le</th>
                <th className="px-3 py-2 font-semibold">Mis à jour</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/5">
                  <td className="px-3 py-3 text-white">{post.title}</td>
                  <td className="px-3 py-3 text-emerald-200">{post.slug}</td>
                  <td className="px-3 py-3">{post.categorySlug ? categoryMap.get(post.categorySlug) ?? post.categorySlug : "—"}</td>
                  <td className="px-3 py-3">{post.tags?.length ? post.tags.join(", ") : "—"}</td>
                  <td className="px-3 py-3 font-semibold">
                    {post.published ? (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-1 text-xs text-emerald-200">Oui</span>
                    ) : (
                      <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs text-amber-200">Brouillon</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-slate-300">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-3 py-3 text-slate-300">
                    {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-3 text-slate-300">
                    {new Date(post.updatedAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Button asChild variant="secondary" className="px-3 py-1 text-xs">
                        <Link href={`/admin/posts/${post.id}`}>Modifier</Link>
                      </Button>
                      <PublishToggleButton postId={post.id} published={post.published} />
                      <DeletePostButton postId={post.id} />
                    </div>
                  </td>
                </tr>
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
            <Button
              asChild
              variant="secondary"
              className="px-3 py-1 text-xs"
              disabled={params.page <= 1}
            >
              <Link href={buildQuery({ page: Math.max(1, params.page - 1) })}>Précédent</Link>
            </Button>
            <Button
              asChild
              variant="secondary"
              className="px-3 py-1 text-xs"
              disabled={params.page >= totalPages}
            >
              <Link href={buildQuery({ page: Math.min(totalPages, params.page + 1) })}>Suivant</Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
