import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

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
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: "easeOut", delay: i * 0.08 },
  }),
};

export default function PortfolioSection() {
  return (
    <section id="portfolio" className="border-b border-amber-100 bg-amber-100/60">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionHeader
          eyebrow="Case studies"
          title="Campaigns that look good and deliver numbers."
          subtitle="A few snapshots from SMOVE engagements across social, paid, and community."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {caseStudies.map((study, idx) => (
            <motion.article
              key={study.client}
              className="flex h-full flex-col justify-between rounded-2xl border border-amber-200/80 bg-white/80 p-6 shadow-sm shadow-amber-200/70 transition hover:-translate-y-1 hover:shadow-md hover:shadow-amber-200/70"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={idx}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-blue-800">
                  <span>{study.client}</span>
                  <span className="rounded-full bg-blue-700 px-3 py-1 text-[11px] text-white">{study.platforms}</span>
                </div>
                <p className="text-lg font-semibold text-slate-900">{study.result}</p>
                <p className="text-sm text-slate-700">{study.summary}</p>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-blue-800">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-700" aria-hidden />
                <span>Full case study on request</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
