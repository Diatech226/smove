// file: components/sections/AboutPreviewSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type SectionProps = {
  onSectionIn?: () => void;
};

export default function AboutPreviewSection({ onSectionIn }: SectionProps) {
  return (
    <motion.section
      className="border-b border-slate-800 bg-slate-950 py-14"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      onViewportEnter={onSectionIn}
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-4 lg:max-w-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">À propos</p>
          <h2 className="text-3xl font-semibold text-white">Une équipe qui fait bouger les marques.</h2>
          <p className="text-slate-200">
            SMOVE Communication naît de la rencontre entre stratèges, créatifs et producteurs audiovisuels. Notre mission :
            donner du mouvement à vos idées, du concept à la diffusion.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
          >
            Découvrir notre histoire →
          </Link>
        </div>
        <div className="grid w-full max-w-xl grid-cols-2 gap-4">
          {["Stratégie", "Créativité", "Production", "Performance"].map((value) => (
            <motion.div
              key={value}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-6 text-center text-slate-100"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="text-sm uppercase tracking-wide text-slate-400">Pilier</p>
              <p className="mt-2 text-lg font-semibold text-white">{value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
