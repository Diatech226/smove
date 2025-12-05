// file: components/sections/PortfolioPreviewSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const projects = [
  { title: "Lancement produit tech", client: "Client A" },
  { title: "Campagne social media", client: "Client B" },
  { title: "Identité visuelle", client: "Client C" },
];

type SectionProps = {
  onSectionIn?: () => void;
};

export default function PortfolioPreviewSection({ onSectionIn }: SectionProps) {
  return (
    <motion.section
      className="border-b border-slate-800 bg-slate-950 py-14"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      onViewportEnter={onSectionIn}
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Portfolio</p>
            <h2 className="text-3xl font-semibold text-white">Un aperçu de nos réalisations.</h2>
          </div>
          <Link href="/portfolio" className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200">
            Explorer tous les projets →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-6 text-slate-100 shadow-lg shadow-black/20"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.04 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{project.client}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{project.title}</h3>
              <p className="mt-2 text-sm text-slate-300">
                Résumé du projet avec mise en avant de la valeur ajoutée créative et digitale.
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
