"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useReducedMotionPref } from "@/lib/hooks/useReducedMotionPref";
import { Container } from "@/components/ui/Container";

export default function AboutPreviewSection() {
  const shouldReduceMotion = useReducedMotionPref();

  return (
    <motion.section
      className="border-b border-white/10 bg-slate-950 py-16"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
      viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.3 }}
    >
      <Container className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 lg:max-w-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-sky-200">À propos</p>
          <h2 className="text-3xl font-semibold text-white">Une équipe qui fait bouger les marques.</h2>
          <p className="text-slate-200">
            SMOVE Communication réunit stratèges, créatifs et producteurs audiovisuels. Nous transformons vos idées en
            campagnes concrètes, mesurables et cohérentes.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center text-sm font-semibold text-sky-200 transition hover:text-sky-100"
          >
            Découvrir notre histoire →
          </Link>
        </div>
        <div className="grid w-full max-w-xl grid-cols-2 gap-4">
          {[
            "Stratégie",
            "Créativité",
            "Production",
            "Performance",
          ].map((value) => (
            <motion.div
              key={value}
              className="rounded-3xl border border-white/10 bg-slate-900/60 px-4 py-6 text-center text-slate-100"
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.5, ease: "easeOut" }}
              viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.2 }}
            >
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Pilier</p>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}
