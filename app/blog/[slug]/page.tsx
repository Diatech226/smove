// file: app/blog/[slug]/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/config/seo";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function formatDate(dateValue: string | Date) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(dateValue));
}

type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.post.findFirst({ where: { slug: params.slug, published: true } });

  if (!post) {
    return createMetadata({
      title: "Article introuvable – SMOVE Communication",
      description: "Le contenu demandé n'est plus disponible.",
      path: `/blog/${params.slug}`,
      type: "article",
    });
  }

  return createMetadata({
    title: `${post.title} – SMOVE Communication`,
    description: post.excerpt || "Découvrez les insights et retours d'expérience de l'équipe SMOVE Communication.",
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await prisma.post.findFirst({ where: { slug: params.slug, published: true } });

  if (!post) {
    notFound();
  }

  const displayDate = post.publishedAt ?? post.createdAt;

  return (
    <div className="bg-slate-950 pb-20 pt-12">
      <Container className="space-y-10">
        <div className="space-y-4">
          <SectionHeader eyebrow={post.category || "Article"} title={post.title} subtitle={formatDate(displayDate)} />
          <div className="h-52 w-full rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5" />
        </div>

        <article className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white prose-a:text-emerald-200">
          {(post.body ?? "").split(/\n\n+/).map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>

        <Link href="/blog" className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200">
          ← Retour au blog
        </Link>
      </Container>
    </div>
  );
}
