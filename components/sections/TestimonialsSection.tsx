"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Container } from "@/components/ui/Container";

const testimonials = [
  {
    name: "Aïcha Zongo",
    role: "Founder, Breeze Café",
    quote: "SMOVE pilote nos réseaux et nos campagnes. Résultat : une communauté plus engagée et des ventes en hausse.",
  },
  {
    name: "Marc Diallo",
    role: "Marketing Lead, Solstice Fitness",
    quote: "Production, ads et reporting ont été fluides. Le lancement a dépassé nos objectifs dès le premier mois.",
  },
  {
    name: "Lina Traoré",
    role: "Content Creator",
    quote: "Une équipe réactive qui sublime mes contenus tout en respectant mon univers. Parfait pour rester visible.",
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

export default function TestimonialsSection() {
  return (
    <motion.section
      className="relative overflow-hidden border-b border-white/10 bg-slate-950 py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-30%" }}
    >
      <div className="absolute left-10 top-8 h-24 w-24 rounded-full bg-sky-500/15 blur-3xl" aria-hidden />
      <div className="absolute right-[-6%] bottom-[-8%] h-32 w-32 rounded-full bg-blue-500/20 blur-3xl" aria-hidden />
      <Container className="relative">
        <SectionHeader
          eyebrow="Témoignages"
          title="Des clients qui avancent plus vite avec SMOVE"
          subtitle="Des marques locales aux créateurs indépendants : nous livrons une exécution fiable et des résultats clairs."
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <motion.article
              key={testimonial.name}
              className="flex h-full flex-col gap-4 rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.35)]"
              variants={cardVariants}
              custom={idx}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 220, damping: 18 }}
            >
              <p className="text-lg font-semibold text-white">“{testimonial.quote}”</p>
              <div className="pt-2 text-sm text-slate-400">
                <p className="font-semibold text-sky-200">{testimonial.name}</p>
                <p>{testimonial.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}
