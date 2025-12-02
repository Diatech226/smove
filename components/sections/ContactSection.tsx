import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

const fadeIn = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function ContactSection() {
  return (
    <section id="contact" className="bg-blue-900 text-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionHeader
          eyebrow="Contact"
          title="Tell us what you need, we’ll handle the heavy lifting."
          subtitle="Reach us by form, phone, or WhatsApp—whatever is fastest for you."
          tone="light"
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          <motion.div className="space-y-5" variants={fadeIn} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }}>
            <p className="text-base text-blue-50/90">
              Whether it’s daily social content, a launch campaign, or community management, SMOVE steps in with a full team so
              you don’t have to coordinate freelancers.
            </p>
            <div className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-blue-50/90">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-yellow-200">Call or WhatsApp</p>
                <p className="mt-2 text-lg font-semibold text-white">+226 60 67 32 42</p>
                <p className="text-lg font-semibold text-white">+226 67 42 35 40</p>
              </div>
              <p className="text-xs text-blue-100/80">Average response time: under 24 hours.</p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-blue-50/80">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold">
                <span className="h-2 w-2 rounded-full bg-yellow-300" aria-hidden />
                Done-for-you delivery
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold">
                <span className="h-2 w-2 rounded-full bg-yellow-300" aria-hidden />
                Weekly reporting
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 font-semibold">
                <span className="h-2 w-2 rounded-full bg-yellow-300" aria-hidden />
                Social, paid, creative
              </span>
            </div>
          </motion.div>
          <motion.form
            className="grid gap-4 rounded-2xl border border-white/10 bg-white/5 p-6"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <label className="text-sm text-blue-50" htmlFor="name">
              Name
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                className="mt-2 w-full rounded-lg border border-white/15 bg-blue-950/50 px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-200"
              />
            </label>
            <label className="text-sm text-blue-50" htmlFor="email">
              Email or WhatsApp
              <input
                id="email"
                name="email"
                type="text"
                placeholder="you@company.com"
                className="mt-2 w-full rounded-lg border border-white/15 bg-blue-950/50 px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-200"
              />
            </label>
            <label className="text-sm text-blue-50" htmlFor="company">
              Company
              <input
                id="company"
                name="company"
                type="text"
                placeholder="Brand or team name"
                className="mt-2 w-full rounded-lg border border-white/15 bg-blue-950/50 px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-200"
              />
            </label>
            <label className="text-sm text-blue-50" htmlFor="project">
              Project description
              <textarea
                id="project"
                name="project"
                rows={4}
                placeholder="Launch goals, timelines, challenges"
                className="mt-2 w-full rounded-lg border border-white/15 bg-blue-950/50 px-3 py-2 text-sm text-white outline-none transition focus:border-yellow-200"
              />
            </label>
            <button
              type="submit"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-yellow-300 px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-yellow-200/40 transition hover:-translate-y-0.5 hover:bg-yellow-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-100"
            >
              Submit
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
