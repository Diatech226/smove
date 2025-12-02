import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

const steps = [
  {
    title: "Discovery",
    detail: "We listen, audit channels, and set targets for engagement, leads, and growth.",
  },
  {
    title: "Strategy",
    detail: "Content pillars, campaign angles, budgets, and the creative we need to win attention.",
  },
  {
    title: "Content production",
    detail: "Scripts, shoots, design, and motion—packaged in a weekly calendar you approve.",
  },
  {
    title: "Launch",
    detail: "Scheduling, community moderation, ad setup, and QA so everything ships right.",
  },
  {
    title: "Optimization & reporting",
    detail: "Readable weekly updates with insights, experiments, and next steps for growth.",
  },
];

const stepVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut", delay: i * 0.05 },
  }),
};

export default function ProcessSection() {
  return (
    <section id="process" className="border-b border-amber-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionHeader
          eyebrow="Process"
          title="A clear path that keeps you in the loop without extra work."
          subtitle="We pair weekly check-ins with async updates so you always know what shipped and what is next."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-[1.15fr,0.85fr] md:items-start">
          <div className="space-y-4">
            {steps.map((step, idx) => (
              <motion.div
                key={step.title}
                className="flex gap-4 rounded-2xl border border-amber-100 bg-white/80 p-5 shadow-sm shadow-amber-200/50"
                variants={stepVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-80px" }}
                custom={idx}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-sm font-semibold text-white shadow-sm shadow-blue-500/30">
                  {idx + 1}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">{step.title}</h3>
                  <p className="text-sm text-slate-700">{step.detail}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div
            className="rounded-3xl border border-blue-100 bg-blue-700 text-white p-6 shadow-lg shadow-blue-500/30"
            variants={stepVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            custom={steps.length}
          >
            <h3 className="text-xl font-semibold">What you get</h3>
            <ul className="mt-4 space-y-3 text-sm text-blue-50/90">
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-300" aria-hidden />
                Weekly strategy + performance recap you can forward to stakeholders.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-300" aria-hidden />
                Shared content calendar with approvals and scheduled publish times.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-yellow-300" aria-hidden />
                Proactive experiments—new hooks, ad angles, and visual styles each month.
              </li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
