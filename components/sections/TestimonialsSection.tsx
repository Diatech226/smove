"use client";

import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import type { SectionKey } from "@/types/sections";

const testimonials = [
  {
    name: "Aïcha Zongo",
    role: "Founder, Breeze Café",
    quote: "SMOVE runs our socials end-to-end. We just approve the calendar and watch regulars show up.",
  },
  {
    name: "Marc Diallo",
    role: "Marketing Lead, Solstice Fitness",
    quote: "They handled creative, ads, and reporting. Our launch hit capacity without extra meetings.",
  },
  {
    name: "Lina Traoré",
    role: "Content Creator",
    quote: "The team jumps on trends fast and keeps my community engaged while I focus on new ideas.",
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.08 },
  }),
};

export default function TestimonialsSection({
  onSectionIn,
}: {
  onSectionIn?: (section: SectionKey) => void;
}) {
  return (
    <motion.section
      className="relative overflow-hidden border-b border-blue-900 bg-gradient-to-br from-yellow-100 via-white to-blue-50"
      id="testimonials"
      onViewportEnter={() => onSectionIn?.("testimonials")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30%" }}
    >
      <div className="absolute left-10 top-8 h-24 w-24 rounded-full bg-yellow-300/40 blur-3xl" aria-hidden />
      <div className="absolute right-[-6%] bottom-[-8%] h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" aria-hidden />
      <motion.div
        className="absolute left-[18%] top-[20%] h-10 w-10 rounded-full bg-blue-700/15"
        animate={{ y: [0, -10, 0], x: [0, 6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <motion.div
        className="absolute right-[22%] top-[30%] h-12 w-12 rounded-full bg-yellow-400/25"
        animate={{ y: [0, 12, 0], rotate: [0, 6, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionHeader
          eyebrow="Testimonials"
          title="Clients who let us handle the work and loved the results."
          subtitle="From cafés to fitness brands to creators, SMOVE keeps content, community, and campaigns moving."
          tone="dark"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <motion.article
              key={testimonial.name}
              className="flex h-full flex-col gap-4 rounded-2xl border border-blue-200/60 bg-white/90 p-6 shadow-[0_18px_60px_rgba(8,47,73,0.12)]"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={idx}
              whileHover={{ y: -6, boxShadow: "0 28px 80px rgba(8,47,73,0.18)" }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <p className="text-lg font-semibold text-slate-900">{testimonial.quote}</p>
              <div className="pt-2 text-sm text-slate-700">
                <p className="font-semibold text-blue-900">{testimonial.name}</p>
                <p>{testimonial.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
