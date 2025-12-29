// file: app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { safePrisma } from "@/lib/safePrisma";
import { createMetadata } from "@/lib/config/seo";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { DatabaseWarning } from "@/components/ui/DatabaseWarning";
import { getMediaVariantUrl } from "@/lib/media/utils";
import type { MediaItem } from "@/lib/media/types";
import { MediaCover } from "@/components/ui/MediaCover";

export const dynamic = "force-dynamic";

type BlogListPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  body: string | null;
  tags: string[];
  cover?: MediaItem | null;
  status: "draft" | "published" | "archived" | "removed";
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
  const postsResult = await safePrisma((db) =>
    db.post.findMany({
      where: { status: "published" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      include: {
        cover: true,
      },
    }),
  );

  const posts = (postsResult.ok ? postsResult.data : []) as BlogListPost[];
  const loadError = !postsResult.ok;
  const topPosts = posts.slice(0, 3);
  const remainingPosts = posts.slice(3);

  return (
    <div className="relative bg-slate-950 pb-24 pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-5%] top-10 h-72 w-72 rounded-full bg-sky-500/15 blur-[120px]" />
        <div className="absolute right-[-8%] top-28 h-64 w-64 rounded-full bg-blue-500/15 blur-[110px]" />
      </div>

      <Container className="relative space-y-12">
        <SectionHeader
          eyebrow="Smove Insights"
          title="Le regard SMOVE sur la communication"
          subtitle="Analyses, inspirations et coulisses pour piloter votre visibilité avec méthode."
        />

        {topPosts.length ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-white">Top articles</h2>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Les plus récents</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
              {topPosts.map((post) => {
                const coverSrc = post.cover
                  ? getMediaVariantUrl(post.cover, "sm") ?? post.cover.originalUrl
                  : null;
                return (
                  <Card
                    key={post.id}
                    as="article"
                    className="flex h-full flex-col gap-4 overflow-hidden border-white/10 bg-slate-900/60 p-0 transition duration-200 hover:-translate-y-1 hover:border-sky-400/50"
                  >
                    <MediaCover
                      src={coverSrc}
                      alt={post.title}
                      className="aspect-[16/9] w-full rounded-none border-none"
                      sizes="(min-width: 1024px) 30vw, 100vw"
                    />
                    <div className="space-y-2 px-6 pb-6 pt-4">
                      <div className="flex items-center justify-between">
                        <CategoryBadge label={(post.tags?.[0] ?? "Article").toString()} />
                        <p className="text-xs uppercase tracking-[0.2em] text-sky-200">
                          {formatDate(post.publishedAt ?? post.createdAt)}
                        </p>
                      </div>
                      <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                      <p className="text-sm leading-relaxed text-slate-200">{buildExcerpt(post)}</p>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-sky-200 hover:text-sky-100"
                      >
                        Lire l'article
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-white">Tous les articles</h2>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
              {posts.length} publication{posts.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {loadError ? (
              <DatabaseWarning message="Le blog est momentanément indisponible. Vérifiez la connexion à la base de données ou réessayez plus tard." />
            ) : null}
            {(remainingPosts.length ? remainingPosts : posts).map((post) => {
              const coverSrc = post.cover
                ? getMediaVariantUrl(post.cover, "sm") ?? post.cover.originalUrl
                : null;

              return (
                <Card
                  key={post.id}
                  as="article"
                  className="flex h-full flex-col gap-4 overflow-hidden border-white/10 bg-slate-900/60 p-0 transition duration-200 hover:-translate-y-1 hover:border-sky-400/50"
                >
                  <MediaCover
                    src={coverSrc}
                    alt={post.title}
                    className="aspect-[16/9] w-full rounded-none border-none"
                    sizes="(min-width: 1024px) 30vw, 100vw"
                  />
                  <div className="space-y-2 px-6 pb-6 pt-4">
                    <div className="flex items-center justify-between">
                      <CategoryBadge label={(post.tags?.[0] ?? "Article").toString()} />
                      <p className="text-xs uppercase tracking-[0.2em] text-sky-200">
                        {formatDate(post.publishedAt ?? post.createdAt)}
                      </p>
                    </div>
                    <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                    <p className="text-sm leading-relaxed text-slate-200">{buildExcerpt(post)}</p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-sky-200 hover:text-sky-100"
                    >
                      Lire l'article
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </Card>
              );
            })}
            {!posts.length ? (
              <Card className="border-white/10 bg-slate-900/60 p-6 text-slate-200">
                Aucun article publié pour le moment. Revenez bientôt pour découvrir nos dernières réflexions.
              </Card>
            ) : null}
          </div>
        </section>
      </Container>
    </div>
  );
}
