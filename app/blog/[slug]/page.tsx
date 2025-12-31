// file: app/blog/[slug]/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { DatabaseWarning } from "@/components/ui/DatabaseWarning";
import { createMetadata } from "@/lib/config/seo";
import { safePrisma } from "@/lib/safePrisma";
import { getMediaPosterUrl, getMediaVariantUrl } from "@/lib/media/utils";
import type { MediaItem, MediaType } from "@/lib/media/types";
import { Card } from "@/components/ui/Card";
import { MediaCover } from "@/components/ui/MediaCover";

export const dynamic = "force-dynamic";

function formatDate(dateValue: string | Date) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(dateValue));
}

async function getPost(slug: string) {
  const result = await safePrisma((db) =>
    db.post.findFirst({
      where: { slug, status: "published" },
      include: {
        cover: true,
        video: true,
        category: true,
      },
    }),
  );
  return { post: result.ok ? result.data : null, error: result.ok ? null : result.message, errorType: result.ok ? null : result.errorType } as const;
}

export type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { post } = await getPost(params.slug);

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
  const { post, error } = await getPost(params.slug);

  if (error) {
    return (
      <div className="bg-slate-950 pb-20 pt-12">
        <Container className="space-y-6">
          <DatabaseWarning message="Le blog est momentanément indisponible. Vérifiez la connexion à la base de données ou réessayez plus tard." />
          <Link href="/blog" className="text-sm font-semibold text-sky-200 transition hover:text-sky-100">
            ← Retour au blog
          </Link>
        </Container>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  const displayDate = post.publishedAt ?? post.createdAt;
  const primaryTag = post.tags?.[0] ?? post.category?.name ?? "Article";

  const [mostReadResult, latestResult, galleryResult] = await Promise.all([
    safePrisma((db) =>
      db.post.findMany({
        where: {
          status: "published",
          id: { not: post.id },
          ...(post.categoryId ? { categoryId: post.categoryId } : post.tags?.length ? { tags: { hasSome: post.tags } } : {}),
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
        include: { cover: true },
      }),
    ),
    safePrisma((db) =>
      db.post.findMany({
        where: { status: "published", id: { not: post.id } },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        take: 4,
        include: { cover: true },
      }),
    ),
    post.galleryMediaIds?.length
      ? safePrisma((db) => db.media.findMany({ where: { id: { in: post.galleryMediaIds } } }))
      : Promise.resolve({ ok: true as const, data: [] }),
  ]);

  const mostReadPosts = mostReadResult.ok ? mostReadResult.data : [];
  const latestPosts = latestResult.ok ? latestResult.data : [];
  const galleryMedia = galleryResult.ok ? galleryResult.data : [];

  type NormalizableMedia = {
    id: string;
    originalUrl: string;
    mime: string;
    size: number;
    createdAt: Date | string;
    type?: string | null;
    folder?: string | null;
    variants?: MediaItem["variants"] | null | unknown;
    posterUrl?: string | null;
    width?: number | null;
    height?: number | null;
    duration?: number | null;
  };

  const normalizeMediaType = (type?: string | null): MediaType => (type === "video" ? "video" : "image");
  const normalizeMediaItem = (media: NormalizableMedia | null): MediaItem | null => {
    if (!media) return null;
    const { type, variants, ...rest } = media;
    return {
      ...rest,
      variants: variants as MediaItem["variants"],
      type: normalizeMediaType(type),
    };
  };

  const normalizedCover = normalizeMediaItem(post.cover);
  const normalizedVideo = normalizeMediaItem(post.video);
  const normalizedGallery = galleryMedia
    .map((media) => normalizeMediaItem(media))
    .filter((media): media is MediaItem => Boolean(media));

  const heroCover = normalizedCover
    ? getMediaVariantUrl(normalizedCover, "lg") ?? normalizedCover.originalUrl
    : null;

  return (
    <div className="bg-slate-950 pb-20 pt-12">
      <Container className="space-y-12">
        <div className="space-y-6">
          <SectionHeader eyebrow={primaryTag} title={post.title} subtitle={formatDate(displayDate)} />
          <MediaCover
            src={heroCover}
            alt={post.title}
            className="h-72 w-full"
            sizes="100vw"
            priority
          />
        </div>

        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-8">
            {normalizedVideo ? (
              <div className="relative overflow-hidden rounded-2xl border border-white/10">
                <video
                  className="h-full w-full object-cover"
                  src={normalizedVideo.originalUrl}
                  poster={getMediaPosterUrl(normalizedVideo) ?? undefined}
                  controls
                />
              </div>
            ) : null}

            <article className="prose prose-lg prose-invert max-w-none prose-headings:text-white prose-p:text-slate-200 prose-strong:text-white prose-a:text-sky-200">
              {(post.body ?? "").split(/\n\n+/).map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>

            {normalizedGallery.length ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white">Galerie</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {normalizedGallery.map((image, index) => {
                    const src = getMediaVariantUrl(image, "md") ?? image.originalUrl;
                    return (
                      <div key={image.id ?? index} className="relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10">
                        <Image src={src} alt={`Visuel ${index + 1}`} fill className="object-cover" />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <Link href="/blog" className="text-sm font-semibold text-sky-200 transition hover:text-sky-100">
              ← Retour au blog
            </Link>
          </div>

          <aside className="space-y-6">
            <Card className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Les plus lus</h3>
              <div className="space-y-3">
                {(mostReadPosts.length ? mostReadPosts : latestPosts).map((item) => {
                  const cover = normalizeMediaItem(item.cover);
                  const coverSrc = cover
                    ? getMediaVariantUrl(cover, "thumb") ?? cover.originalUrl
                    : null;

                  return (
                    <Link key={item.id} href={`/blog/${item.slug}`} className="group flex items-center gap-3">
                      <div className="relative h-14 w-20 overflow-hidden rounded-lg border border-white/10">
                        {coverSrc ? (
                          <Image src={coverSrc} alt={item.title} fill className="object-cover" />
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-slate-900 via-slate-800 to-sky-900/40" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-100 group-hover:text-white">{item.title}</p>
                        <span className="text-xs text-slate-400">{formatDate(item.publishedAt ?? item.createdAt)}</span>
                      </div>
                    </Link>
                  );
                })}
                {!mostReadPosts.length && !latestPosts.length ? (
                  <p className="text-sm text-slate-400">Pas encore d'articles similaires.</p>
                ) : null}
              </div>
            </Card>

            <Card className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Dernières publications</h3>
              <ul className="space-y-3 text-sm text-slate-200">
                {latestPosts.map((item) => (
                  <li key={item.id} className="flex flex-col gap-1">
                    <Link href={`/blog/${item.slug}`} className="font-semibold text-sky-200 hover:text-sky-100">
                      {item.title}
                    </Link>
                    <span className="text-xs text-slate-400">{formatDate(item.publishedAt ?? item.createdAt)}</span>
                  </li>
                ))}
                {!latestPosts.length ? <li className="text-slate-400">Aucun article récent.</li> : null}
              </ul>
            </Card>
          </aside>
        </div>
      </Container>
    </div>
  );
}
