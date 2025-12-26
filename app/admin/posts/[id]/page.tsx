// file: app/admin/posts/[id]/page.tsx
import { notFound } from "next/navigation";

import { safePrisma } from "@/lib/safePrisma";

import { PostForm } from "../_components/PostForm";

export const dynamic = "force-dynamic";

type EditPostPageProps = {
  params: { id: string };
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const [postResult, categoriesResult] = await Promise.all([
    safePrisma((db) => db.post.findUnique({ where: { id: params.id } })),
    safePrisma((db) =>
      db.taxonomy.findMany({
        where: { type: "post_category", active: true },
        orderBy: { order: "asc" },
      }),
    ),
  ]);

  if (!postResult.ok) {
    return (
      <div className="space-y-6 text-sm text-amber-200">
        <p>Impossible de charger cet article. Vérifiez la connexion à la base de données ou vos droits d'accès.</p>
      </div>
    );
  }

  const post = postResult.data;

  if (!post) {
    notFound();
  }

  return (
    <PostForm
      mode="edit"
      postId={post.id}
      initialValues={post}
      categories={categoriesResult.ok ? categoriesResult.data : []}
    />
  );
}
