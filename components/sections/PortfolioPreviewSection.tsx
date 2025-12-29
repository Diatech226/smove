"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/lib/config/projects";
import { Button } from "@/components/ui/Button";
import { useReducedMotionPref } from "@/lib/hooks/useReducedMotionPref";

export default function PortfolioPreviewSection() {
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
            eyebrow="Portfolio"
            title="Des projets pilotés avec précision et élégance"
            subtitle="Des campagnes intégrées qui combinent storytelling, production premium et pilotage média."
          />
          <div className="flex justify-start lg:justify-end">
            <Button href="/projects" variant="secondary">
              Explorer tous les projets
            </Button>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
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
              <Card className="group h-full space-y-4 border-white/10 bg-slate-900/60">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.2em] text-sky-200">{project.client}</p>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-100">
                    {project.sector}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                <p className="text-sm text-slate-300">{project.summary}</p>
                <Link
                  href={`/projects/${project.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-sky-200 transition group-hover:text-sky-100"
                >
                  Voir le projet
                  <span aria-hidden>→</span>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}
