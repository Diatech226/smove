"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Container } from "@/components/ui/Container";

export default function ContactCtaSection() {
  return (
    <motion.section
      className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 py-16"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <Container>
        <div className="rounded-3xl border border-white/10 bg-slate-900/70 px-6 py-12 text-center shadow-[0_25px_70px_rgba(15,23,42,0.4)]">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-200">Prêt à bouger ?</p>
          <h2 className="mt-3 text-3xl font-semibold text-white">Discutons de votre prochain projet.</h2>
          <p className="mt-2 text-slate-200">
            Un call, un email ou un café : nous cadrons vos besoins et enclenchons la production rapidement.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-sky-500/30 transition hover:-translate-y-0.5 hover:bg-sky-400"
            >
              Contact direct
            </Link>
            <Link
              href="/projects"
              className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-sky-400"
            >
              Voir nos projets
            </Link>
          </div>
        </div>
      </Container>
    </motion.section>
  );
}
