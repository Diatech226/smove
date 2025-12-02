"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import type { SectionKey } from "@/types/sections";

const caseStudies = [
  {
    client: "Breeze Café",
    platforms: "Instagram, TikTok",
    result: "+45% engagement",
    summary: "Daily stories, Reels, and playful promos kept regulars coming back and new visitors curious.",
  },
  {
    client: "Solstice Fitness",
    platforms: "Meta Ads, YouTube",
    result: "3.2x ROAS",
    summary: "Full-funnel paid + motion creative launched a seasonal challenge and filled classes in 3 weeks.",
  },
  {
    client: "Halo Cosmetics",
    platforms: "Instagram, Facebook",
    result: "+62% community replies",
    summary: "Community management and refreshed visuals turned support questions into loyal fans.",
  },
  {
    client: "AgroFresh Markets",
    platforms: "Meta Ads, WhatsApp",
    result: "+38% repeat orders",
    summary: "Promo bursts and conversational replies built trust with neighborhood shoppers.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut", delay: i * 0.08 },
  }),
};

export default function PortfolioSection({
  onSectionIn,
}: {
  onSectionIn?: (section: SectionKey) => void;
}) {
  return (
    <motion.section
      id="portfolio"
      className="border-b border-blue-900/30 bg-gradient-to-br from-blue-900 via-blue-950 to-slate-950 text-white"
      onViewportEnter={() => onSectionIn?.("portfolio")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30%" }}
    >
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(250,204,21,0.16),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(56,189,248,0.18),transparent_30%)]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
          <SectionHeader
            eyebrow="Case studies"
            title="Campaigns that look good and deliver numbers."
            subtitle="A few snapshots from SMOVE engagements across social, paid, and community."
            tone="light"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((study, idx) => (
              <motion.article
                key={study.client}
                className="group flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-blue-800/60 bg-white/5 p-6 shadow-[0_30px_80px_rgba(8,47,73,0.35)]"
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                custom={idx}
                whileHover={{ rotateX: -2, rotateY: 2, y: -8 }}
                transition={{ type: "spring", stiffness: 180, damping: 18 }}
                style={{ transformStyle: "preserve-3d", perspective: 900 }}
              >
                <div className="absolute left-0 top-0 h-1 w-full origin-left scale-x-0 bg-gradient-to-r from-yellow-300 via-yellow-100 to-blue-300 transition duration-300 group-hover:scale-x-100" aria-hidden />
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-blue-100/90">
                    <span>{study.client}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] text-yellow-200">{study.platforms}</span>
                  </div>
                  <p className="text-lg font-semibold text-yellow-100">{study.result}</p>
                  <p className="text-sm text-blue-100/90">{study.summary}</p>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-yellow-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-yellow-300" aria-hidden />
                  <span>Full case study on request</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
