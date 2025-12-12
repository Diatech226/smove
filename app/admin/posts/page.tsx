// file: app/admin/posts/page.tsx
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { safePrisma } from "@/lib/prisma";

import { DeletePostButton } from "./_components/DeletePostButton";

type PostListItem = {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  published: boolean;
  publishedAt: Date | null;
  createdAt: Date;
};

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const postsResult = await safePrisma((db) =>
    db.post.findMany({
      orderBy: [
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
    }),
  );
  const posts = (postsResult.ok ? postsResult.data : []) as PostListItem[];
  const loadError = !postsResult.ok;

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
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Articles publiés et brouillons</h2>
          <p className="text-sm text-slate-300">{posts.length} article(s)</p>
        </div>

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
                <th className="px-3 py-2 font-semibold">Catégories</th>
                <th className="px-3 py-2 font-semibold">Publié</th>
                <th className="px-3 py-2 font-semibold">Publié le</th>
                <th className="px-3 py-2 font-semibold">Créé le</th>
                <th className="px-3 py-2 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-white/5">
                  <td className="px-3 py-3 text-white">{post.title}</td>
                  <td className="px-3 py-3 text-emerald-200">{post.slug}</td>
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
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <Button asChild variant="secondary" className="px-3 py-1 text-xs">
                        <Link href={`/admin/posts/${post.id}`}>Modifier</Link>
                      </Button>
                      <DeletePostButton postId={post.id} />
                    </div>
                  </td>
                </tr>
              ))}
              {!posts.length ? (
                <tr>
                  <td className="px-3 py-4 text-sm text-slate-300" colSpan={7}>
                    Aucun article pour le moment. Créez votre premier contenu avec le bouton "Nouvel article".
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
