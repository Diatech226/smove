// file: app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/config/seo";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(dateString));
}

export const metadata: Metadata = createMetadata({
  title: "Blog & Actualités – SMOVE Communication",
  description:
    "Articles, inspirations et coulisses pour suivre les actualités et méthodes de SMOVE Communication au service des marques.",
  path: "/blog",
});

export default async function BlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div className="relative bg-slate-950 pb-20 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-12 h-64 w-64 rounded-full bg-emerald-500/15 blur-[110px]" />
        <div className="absolute right-12 top-24 h-64 w-64 rounded-full bg-pink-500/10 blur-[110px]" />
      </div>
      <Container className="relative space-y-12">
        <SectionHeader
          eyebrow="Actualités"
          title="Le regard SMOVE sur la communication"
          subtitle="Analyses, méthodes et retours d'expérience pour piloter votre visibilité avec impact."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * index, ease: "easeOut" }}
            >
              <Card as="article" className="flex h-full flex-col gap-3 overflow-hidden border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-6 shadow-xl shadow-emerald-500/10 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-emerald-400/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">{formatDate(post.publishedAt)}</p>
                    <h3 className="mt-1 text-2xl font-semibold text-white">{post.title}</h3>
                  </div>
                  {post.tags && post.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.map((tag) => (
                        <span key={tag} className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100">
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                <p className="text-slate-200">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  Lire l'article →
                </Link>
              </Card>
            </motion.div>
          ))}
          {!posts.length ? <p className="text-slate-200">Aucun article pour le moment.</p> : null}
        </div>
      </Container>
    </div>
  );
}
