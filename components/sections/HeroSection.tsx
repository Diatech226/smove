// file: components/sections/HeroSection.tsx
"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { trackEvent } from "@/lib/analytics";
import { useReducedMotionPref } from "@/lib/hooks/useReducedMotionPref";

const Hero3DCanvas = dynamic(() => import("@/components/three/Hero3DCanvas"), {
  ssr: false,
  loading: () => (
    <div className="h-64 w-full rounded-3xl bg-slate-800/40 md:h-80 lg:h-96">
      <div className="flex h-full items-center justify-center">
        <span className="text-sm text-slate-300">Chargement de la scène 3D...</span>
      </div>
    </div>
  ),
});

type SectionProps = {
  onSectionIn?: () => void;
};

export default function HeroSection({ onSectionIn }: SectionProps) {
  const shouldReduceMotion = useReducedMotionPref();

  return (
    <motion.section
      className="border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-black py-16"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.7, ease: "easeOut" }}
      viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.35 }}
      onViewportEnter={onSectionIn}
    >
      <Container className="flex flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center rounded-full bg-slate-800/60 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-200">
            Agence de communication digitale
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              SMOVE Communication : on pilote vos contenus, vous récoltez les résultats.
            </h1>
            <p className="text-lg text-slate-200">
              Stratégie, production, campagnes et expériences 3D. Nous orchestrons votre visibilité de A à Z. We do the work for
              you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              href="/contact"
              onClick={() => trackEvent({ name: "cta_click", payload: { label: "contact_primary" } })}
            >
              Contact
            </Button>
            <Button
              href="/projects"
              variant="secondary"
              onClick={() => trackEvent({ name: "cta_click", payload: { label: "voir_portfolio" } })}
            >
              Voir le portfolio
            </Button>
            <Button
              href="/services"
              variant="ghost"
              onClick={() => trackEvent({ name: "cta_click", payload: { label: "decouvrir_services" } })}
            >
              Découvrir nos services
            </Button>
          </div>
        </div>
        <div className="w-full max-w-md flex-1">
          <Hero3DCanvas />
        </div>
      </Container>
    </motion.section>
  );
}
