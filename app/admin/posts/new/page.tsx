// file: app/admin/posts/new/page.tsx
import { safePrisma } from "@/lib/safePrisma";

import { PostForm } from "../_components/PostForm";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const categoriesResult = await safePrisma((db) =>
    db.taxonomy.findMany({
      where: { type: "post_category", active: true },
      orderBy: { order: "asc" },
    }),
  );

  return <PostForm mode="create" categories={categoriesResult.ok ? categoriesResult.data : []} />;
}
