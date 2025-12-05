// file: components/sections/BlogPreviewSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { posts } from "@/lib/config/posts";
import { Button } from "@/components/ui/Button";
import { useReducedMotionPref } from "@/lib/hooks/useReducedMotionPref";

type SectionProps = {
  onSectionIn?: () => void;
};

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(dateString));
}

export default function BlogPreviewSection({ onSectionIn }: SectionProps) {
  const shouldReduceMotion = useReducedMotionPref();

  return (
    <motion.section
      className="border-b border-slate-800 bg-slate-950 py-14"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.6, ease: "easeOut" }}
      viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.3 }}
      onViewportEnter={onSectionIn}
    >
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            eyebrow="Actualités"
            title="À la une sur le blog"
            subtitle="Insights stratégiques, coulisses de production et inspirations créatives signés SMOVE."
          />
          <div className="flex justify-start sm:justify-end">
            <Button href="/blog" variant="secondary">
              Lire tous les articles
            </Button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {posts.slice(0, 3).map((post, index) => (
            <motion.article
              key={post.slug}
              className="h-full"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: "easeOut", delay: index * 0.04 }
              }
              viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.2 }}
            >
              <Card className="h-full space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">{formatDate(post.date)}</p>
                <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                <p className="text-sm text-slate-300">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  Lire l'article →
                </Link>
              </Card>
            </motion.article>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}
