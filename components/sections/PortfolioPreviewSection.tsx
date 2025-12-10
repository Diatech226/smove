// file: components/sections/PortfolioPreviewSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/lib/config/projects";
import { Button } from "@/components/ui/Button";
import { useReducedMotionPref } from "@/lib/hooks/useReducedMotionPref";

type SectionProps = {
  onSectionIn?: () => void;
};

export default function PortfolioPreviewSection({ onSectionIn }: SectionProps) {
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
            eyebrow="Portfolio"
            title="Un aperçu de nos réalisations"
            subtitle="Des campagnes intégrées qui combinent storytelling, production premium et pilotage media."
          />
          <div className="flex justify-start sm:justify-end">
            <Button href="/projects" variant="secondary">
              Explorer tous les projets
            </Button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {projects.slice(0, 3).map((project, index) => (
            <motion.div
              key={project.slug}
              className="h-full"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={
                shouldReduceMotion
                  ? { duration: 0 }
                  : { duration: 0.55, ease: "easeOut", delay: index * 0.04 }
              }
              viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.2 }}
            >
              <Card className="h-full space-y-3">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">{project.client}</p>
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-slate-300">{project.summary}</p>
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100">
                    {project.sector}
                  </span>
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                  >
                    Voir le projet →
                  </Link>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}
