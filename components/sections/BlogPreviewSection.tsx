"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { posts } from "@/lib/config/posts";
import { Button } from "@/components/ui/Button";
import { useReducedMotionPref } from "@/lib/hooks/useReducedMotionPref";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(dateString));
}

export default function BlogPreviewSection() {
  const shouldReduceMotion = useReducedMotionPref();

  return (
    <motion.section
      className="border-b border-white/10 bg-slate-950 py-16"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
      viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.3 }}
    >
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Blog"
            title="Analyses, tendances et coulisses SMOVE"
            subtitle="Insights stratégiques et retours d'expérience pour piloter votre visibilité avec précision."
          />
          <div className="flex justify-start lg:justify-end">
            <Button href="/blog" variant="secondary">
              Lire tous les articles
            </Button>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
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
              <Card className="group h-full space-y-4 border-white/10 bg-slate-900/60">
                <p className="text-xs uppercase tracking-[0.2em] text-sky-200">{formatDate(post.date)}</p>
                <h3 className="text-xl font-semibold text-white">{post.title}</h3>
                <p className="text-sm text-slate-300">{post.excerpt}</p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-200 transition group-hover:text-sky-100"
                >
                  Lire l'article
                  <span aria-hidden>→</span>
                </Link>
              </Card>
            </motion.article>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}
