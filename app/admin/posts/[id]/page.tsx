// file: app/admin/posts/[id]/page.tsx
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

import { PostForm } from "../_components/PostForm";

export const dynamic = "force-dynamic";

type EditPostPageProps = {
  params: { id: string };
};

export default async function EditPostPage({ params }: EditPostPageProps) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });

  if (!post) {
    notFound();
  }

  return <PostForm mode="edit" postId={post.id} initialValues={post} />;
}
