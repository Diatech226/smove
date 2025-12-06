// file: app/portfolio/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { createMetadata } from "@/lib/config/seo";

export const metadata: Metadata = createMetadata({
  title: "Portfolio – SMOVE Communication",
  description:
    "Découvrez les projets et campagnes orchestrés par SMOVE Communication pour des clients variés : tech, industrie, services et culture.",
  path: "/portfolio",
});

export default async function PortfolioPage() {
  const projects = await prisma.project.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="relative bg-slate-950 pb-20 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-12 h-64 w-64 rounded-full bg-emerald-500/15 blur-[110px]" />
        <div className="absolute right-12 top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[110px]" />
      </div>
      <Container className="relative space-y-12">
        <SectionHeader
          eyebrow="Portfolio"
          title="Des projets qui font bouger les lignes"
          subtitle="Branding, campagnes, production, expériences digitales : un aperçu des résultats obtenus pour nos clients."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 * index, ease: "easeOut" }}
            >
              <Card as="article" className="flex h-full flex-col gap-3 overflow-hidden border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-6 shadow-xl shadow-emerald-500/10 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-emerald-400/20">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">{project.client}</p>
                    <h3 className="mt-1 text-2xl font-semibold text-white">{project.title}</h3>
                  </div>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100">{project.sector}</span>
                </div>
                <p className="text-slate-200">{project.summary}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Link
                    href={`/portfolio/${project.slug}`}
                    className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                  >
                    Voir le projet →
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
          {!projects.length ? <p className="text-slate-200">Aucun projet pour le moment.</p> : null}
        </div>

        <div className="flex justify-center">
          <Button href="/contact" variant="secondary">
            Discuter de votre projet
          </Button>
        </div>
      </Container>
    </div>
  );
}
