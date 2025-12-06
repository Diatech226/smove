// file: app/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { motion } from "framer-motion";

import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/config/seo";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(dateString));
}

type BlogPostPageProps = {
  params: { slug: string };
};

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });

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
  const post = await prisma.post.findUnique({ where: { slug: params.slug } });

  if (!post) {
    notFound();
  }

  return (
    <div className="relative bg-slate-950 pb-20 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-12 h-64 w-64 rounded-full bg-emerald-500/15 blur-[110px]" />
        <div className="absolute right-12 top-16 h-64 w-64 rounded-full bg-pink-500/10 blur-[110px]" />
      </div>
      <Container className="relative space-y-10">
        <SectionHeader eyebrow="Article" title={post.title} subtitle={formatDate(post.publishedAt)} />

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-4 rounded-2xl border border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-8 text-lg text-slate-200 shadow-xl shadow-emerald-500/10"
        >
          <p>{post.body}</p>
          <p>
            Chez SMOVE Communication, nous combinons stratégie éditoriale, production créative et pilotage des campagnes pour
            transformer ces idées en résultats concrets.
          </p>
        </motion.div>
      </Container>
    </div>
  );
}
