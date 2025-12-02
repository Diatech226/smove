import { motion } from "framer-motion";
import Hero3DCanvas from "@/components/Hero3DCanvas";

const fadeIn = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function HeroSection() {
  return (
    <section id="hero" className="relative overflow-hidden border-b border-amber-100 bg-amber-50">
      <div className="absolute left-[-10%] top-[-10%] h-64 w-64 rounded-full bg-yellow-200/60 blur-3xl" aria-hidden />
      <div className="absolute right-[-5%] top-10 h-64 w-64 rounded-full bg-blue-500/30 blur-3xl" aria-hidden />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 pb-16 pt-24 md:grid-cols-2 md:items-center md:pt-28">
        <motion.div className="space-y-8" variants={stagger} initial="hidden" animate="visible">
          <motion.div
            className="inline-flex items-center gap-3 rounded-full bg-blue-600 text-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] shadow-lg shadow-blue-500/30"
            variants={fadeIn}
          >
            SMOVE Communication
            <span className="h-2 w-2 rounded-full bg-yellow-300" aria-hidden />
            We do the work for you
          </motion.div>
          <motion.div className="space-y-4" variants={fadeIn}>
            <h1 className="text-4xl font-semibold leading-tight text-slate-900 sm:text-5xl">
              Done-for-you social, campaigns, and creative that keeps your brand moving.
            </h1>
            <p className="max-w-2xl text-lg text-slate-700">
              SMOVE handles the daily grind of content, paid ads, and eye-catching visuals. We plan, produce, and launch so you
              can focus on the business while your presence grows.
            </p>
          </motion.div>
          <motion.div className="flex flex-wrap gap-4" variants={fadeIn}>
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-blue-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:-translate-y-0.5 hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              Book a free strategy call
            </a>
            <a
              href="#portfolio"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-blue-800/50 bg-white/70 px-6 py-3 text-sm font-semibold text-blue-800 transition hover:-translate-y-0.5 hover:border-blue-700 hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500"
            >
              See our work
            </a>
          </motion.div>
          <motion.div className="grid grid-cols-1 gap-3 text-sm text-slate-700 sm:grid-cols-3" variants={fadeIn}>
            <div className="rounded-2xl bg-white/70 p-4 shadow-sm shadow-amber-200/60">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-800">Social-first</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">Content & community</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4 shadow-sm shadow-amber-200/60">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-800">Paid media</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">Meta & Google, done-for-you</p>
            </div>
            <div className="rounded-2xl bg-white/70 p-4 shadow-sm shadow-amber-200/60">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-800">Creative</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">Motion, 3D, brand identity</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div className="relative" variants={fadeIn} initial="hidden" animate="visible" transition={{ delay: 0.2 }}>
          <div className="absolute inset-0 rounded-[32px] bg-gradient-to-tr from-blue-600/20 via-yellow-200/40 to-white/50 blur-3xl" aria-hidden />
          <div className="relative flex h-full min-h-[440px] items-center justify-center rounded-[32px] border border-blue-100/70 bg-white/80 p-4 shadow-[0_30px_120px_rgba(59,130,246,0.18)] backdrop-blur-md">
            <Hero3DCanvas />
          </div>
          <div className="absolute -left-6 -bottom-8 hidden h-32 w-32 rounded-full bg-yellow-300/70 blur-3xl md:block" aria-hidden />
          <div className="absolute -right-10 -top-6 hidden h-28 w-28 rounded-full bg-blue-500/30 blur-3xl md:block" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}
