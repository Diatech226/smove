// file: app/blog/[slug]/page.tsx
import Image from "next/image";
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

async function getPost(slug: string) {
  return prisma.post.findFirst({ where: { slug, published: true } });
}

export type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPost(params.slug);

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
  const post = await getPost(params.slug);

  if (!post) {
    notFound();
  }

  const displayDate = post.publishedAt ?? post.createdAt;
  const primaryTag = post.tags?.[0] ?? "Article";

  const [relatedPosts, latestPosts] = await Promise.all([
    prisma.post.findMany({
      where: {
        published: true,
        id: { not: post.id },
        tags: post.tags?.length ? { hasSome: post.tags } : undefined,
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
    }),
    prisma.post.findMany({
      where: { published: true, id: { not: post.id } },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: 3,
    }),
  ]);

  return (
    <div className="bg-slate-950 pb-20 pt-12">
      <Container className="grid gap-12 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-8">
          <div className="space-y-4">
            <SectionHeader eyebrow={primaryTag} title={post.title} subtitle={formatDate(displayDate)} />
            <div className="relative h-64 w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-white/5 via-white/10 to-white/5">
              {post.coverImage ? (
                <Image src={post.coverImage} alt="Illustration de l'article" fill className="object-cover" priority />
              ) : null}
            </div>
          </div>

          {post.videoUrl ? (
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60">
              <div className="aspect-video">
                <iframe
                  title="Vidéo de l'article"
                  src={post.videoUrl}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null}

          <article className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white prose-a:text-emerald-200">
            {(post.body ?? "").split(/\n\n+/).map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </article>

          {post.gallery?.length ? (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Galerie</h3>
              <div className="grid gap-4 md:grid-cols-2">
                {post.gallery.map((image, index) => (
                  <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                    <Image src={image} alt={`Visuel ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <Link href="/blog" className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200">
            ← Retour au blog
          </Link>
        </div>

        <aside className="space-y-8">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h3 className="text-lg font-semibold text-white">Articles liés</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {relatedPosts.length ? (
                relatedPosts.map((item) => (
                  <li key={item.id} className="flex flex-col gap-1">
                    <Link href={`/blog/${item.slug}`} className="font-semibold text-emerald-200 hover:text-emerald-100">
                      {item.title}
                    </Link>
                    <span className="text-xs text-slate-400">{formatDate(item.publishedAt ?? item.createdAt)}</span>
                  </li>
                ))
              ) : (
                <li className="text-slate-400">Pas encore d'articles similaires.</li>
              )}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h3 className="text-lg font-semibold text-white">Dernières publications</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {latestPosts.map((item) => (
                <li key={item.id} className="flex flex-col gap-1">
                  <Link href={`/blog/${item.slug}`} className="font-semibold text-emerald-200 hover:text-emerald-100">
                    {item.title}
                  </Link>
                  <span className="text-xs text-slate-400">{formatDate(item.publishedAt ?? item.createdAt)}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </Container>
    </div>
  );
}
