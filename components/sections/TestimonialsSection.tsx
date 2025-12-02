import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

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

export default function TestimonialsSection() {
  return (
    <section className="border-b border-blue-800 bg-blue-800/95" id="testimonials">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionHeader
          eyebrow="Testimonials"
          title="Clients who let us handle the work and loved the results."
          subtitle="From cafés to fitness brands to creators, SMOVE keeps content, community, and campaigns moving."
          tone="light"
          align="center"
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((testimonial, idx) => (
            <motion.article
              key={testimonial.name}
              className="flex h-full flex-col gap-4 rounded-2xl border border-white/15 bg-white/10 p-6 shadow-[0_30px_80px_rgba(59,130,246,0.3)]"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={idx}
            >
              <p className="text-lg font-semibold text-white">{testimonial.quote}</p>
              <div className="pt-2 text-sm text-blue-50/90">
                <p className="font-semibold text-white">{testimonial.name}</p>
                <p>{testimonial.role}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
