// file: components/sections/ContactCtaSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type SectionProps = {
  onSectionIn?: () => void;
};

export default function ContactCtaSection({ onSectionIn }: SectionProps) {
  return (
    <motion.section
      className="bg-gradient-to-r from-emerald-500/20 via-slate-900 to-slate-950 py-14"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      onViewportEnter={onSectionIn}
    >
      <div className="mx-auto max-w-6xl rounded-3xl border border-emerald-500/30 bg-slate-900/60 px-6 py-12 text-center shadow-emerald-500/20">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-200">Prêt à bouger ?</p>
        <h2 className="mt-3 text-3xl font-semibold text-white">Discutons de votre prochain projet.</h2>
        <p className="mt-2 text-slate-200">
          Un call, un mail ou un café : on s'adapte pour lancer vos campagnes rapidement.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/contact"
            className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
          >
            Contact direct
          </Link>
          <Link
            href="/portfolio"
            className="rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-400"
          >
            Voir nos projets
          </Link>
        </div>
      </div>
    </motion.section>
  );
}
