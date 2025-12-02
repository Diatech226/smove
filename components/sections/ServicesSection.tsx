import { motion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";

const services = [
  {
    title: "Social media content",
    description: "Story-driven posts, carousels, and shorts tailored to every platform.",
    bullets: ["Weekly content calendars", "Copy + design production", "Platform-native formats"],
  },
  {
    title: "Community management",
    description: "We respond, moderate, and keep conversations healthy across your channels.",
    bullets: ["Inbox + comments", "Tone of voice guardrails", "Crisis-ready playbooks"],
  },
  {
    title: "Paid campaigns",
    description: "Meta + Google ads with clear offers, creative testing, and real reporting.",
    bullets: ["Full-funnel structure", "Creative + landing builds", "Weekly optimizations"],
  },
  {
    title: "Branding & identity",
    description: "Refresh your look with bold, social-ready visuals, type, and motion.",
    bullets: ["Logo + visual toolkit", "Templates for teams", "Motion and 3D touchpoints"],
  },
  {
    title: "Motion & 3D creative",
    description: "Thumb-stopping loops, hero 3D, and product close-ups for campaigns.",
    bullets: ["Storyboard + scripting", "3D production", "Animation optimized for paid"],
  },
  {
    title: "Reporting & insights",
    description: "Transparent dashboards and action items that keep stakeholders aligned.",
    bullets: ["Platform + GA tracking", "Readable weekly recaps", "Clear next moves"],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut", delay: i * 0.06 },
  }),
};

export default function ServicesSection() {
  return (
    <section id="services" className="border-b border-amber-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
        <SectionHeader
          eyebrow="Services"
          title="Everything you need to look sharp online and keep momentum."
          subtitle="Done-for-you delivery across content, community, paid campaigns, and the visuals that make people stop scrolling."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => (
            <motion.article
              key={service.title}
              className="flex h-full flex-col gap-4 rounded-2xl border border-amber-100 bg-white/80 p-6 shadow-sm shadow-amber-200/60 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-amber-200/60"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              custom={idx}
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-xl font-semibold text-slate-900">{service.title}</h3>
                <span className="h-2 w-2 rounded-full bg-blue-700" aria-hidden />
              </div>
              <p className="text-sm text-slate-600">{service.description}</p>
              <ul className="space-y-2 text-sm text-slate-700">
                {service.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600" aria-hidden />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
