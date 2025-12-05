// file: components/sections/HeroSection.tsx
"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { motion } from "framer-motion";

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
  return (
    <motion.section
      className="border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-black py-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.35 }}
      onViewportEnter={onSectionIn}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center rounded-full bg-slate-800/60 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-200">
            Agence créative 360°
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              SMOVE Communication : on pilote votre communication digitale.
            </h1>
            <p className="text-lg text-slate-200">
              Stratégie, contenu, campagnes, production audiovisuelle et activations social media. Nous orchestrons votre
              visibilité de A à Z. We do the work for you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              Contact
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-400"
            >
              Voir le portfolio
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-400"
            >
              Demande de devis
            </Link>
          </div>
        </div>
        <div className="w-full max-w-md flex-1">
          <Hero3DCanvas />
        </div>
      </div>
    </motion.section>
  );
}
