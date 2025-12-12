// file: app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createMetadata } from "@/lib/config/seo";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryBadge } from "@/components/ui/CategoryBadge";

export const dynamic = "force-dynamic";

type BlogListPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  category: string | null;
  coverImage?: string | null;
  published: boolean;
  publishedAt: string | Date | null;
  createdAt: string | Date;
};

function formatDate(dateValue: string | Date) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(dateValue));
}

function buildExcerpt(post: BlogListPost) {
  if (post.excerpt && post.excerpt.trim()) {
    return post.excerpt.trim();
  }

  const body = post.body ?? "";
  const preview = body.replace(/\s+/g, " ").trim().slice(0, 220);
  return preview ? `${preview}${body.length > preview.length ? "…" : ""}` : "À venir très bientôt.";
}

export const metadata: Metadata = createMetadata({
  title: "Blog & Actualités – SMOVE Communication",
  description:
    "Articles, inspirations et coulisses pour suivre les actualités et méthodes de SMOVE Communication au service des marques.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = (await prisma.post.findMany({
    where: { published: true },
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
  })) as BlogListPost[];

  return (
    <div className="relative bg-slate-950 pb-24 pt-14">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-10 h-72 w-72 rounded-full bg-emerald-500/15 blur-[120px]" />
        <div className="absolute right-[-8%] top-28 h-64 w-64 rounded-full bg-indigo-500/15 blur-[110px]" />
      </div>

      <Container className="relative space-y-12">
        <SectionHeader
          eyebrow="Smove Insights"
          title="Le regard SMOVE sur la communication"
          subtitle="Analyses, inspirations et coulisses pour piloter votre visibilité avec méthode."
        />

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.id}
              as="article"
              className="flex h-full flex-col gap-4 overflow-hidden border-white/10 bg-white/5/30 p-0 transition duration-200 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/20"
            >
              <div
                className="relative aspect-[16/9] w-full overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: post.coverImage ? `url(${post.coverImage})` : undefined }}
              >
                {!post.coverImage ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-white/10 to-indigo-500/20" />
                ) : (
                  <div className="absolute inset-0 bg-black/20" />
                )}
              </div>

              <div className="space-y-2 px-6 pb-6 pt-4">
                <div className="flex items-center justify-between">
                  <CategoryBadge label={post.category || "Article"} />
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">
                    {formatDate(post.publishedAt ?? post.createdAt)}
                  </p>
                </div>
                <h3 className="text-2xl font-semibold text-white">{post.title}</h3>
                <p className="text-sm leading-relaxed text-slate-200">{buildExcerpt(post)}</p>
                <div className="mt-auto flex items-center justify-between text-sm font-semibold text-emerald-300">
                  <span className="transition hover:text-emerald-200">
                    <Link href={`/blog/${post.slug}`}>Lire l'article</Link>
                  </span>
                  <span aria-hidden>→</span>
                </div>
              </div>
            </Card>
          ))}
          {!posts.length ? (
            <Card className="border-white/10 bg-white/5/30 p-6 text-slate-200">
              Aucun article publié pour le moment. Revenez bientôt pour découvrir nos dernières réflexions.
            </Card>
          ) : null}
        </div>
      </Container>
    </div>
  );
}
