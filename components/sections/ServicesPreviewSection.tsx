// file: components/sections/ServicesPreviewSection.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { services } from "@/lib/config/services";
import { Button } from "@/components/ui/Button";

type SectionProps = {
  onSectionIn?: () => void;
};

export default function ServicesPreviewSection({ onSectionIn }: SectionProps) {
  return (
    <motion.section
      className="border-b border-slate-800 bg-slate-950 py-14"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      onViewportEnter={onSectionIn}
    >
      <Container>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <SectionHeader
            eyebrow="Services"
            title="Tout ce qu'il faut pour faire bouger votre marque"
            subtitle="Stratégie, design, production et diffusion : nous synchronisons nos expertises pour délivrer des campagnes complètes."
          />
          <div className="flex justify-start sm:justify-end">
            <Button href="/services" variant="secondary">
              Voir tous les services
            </Button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {services.slice(0, 3).map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.05 }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <Card className="h-full">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                    <p className="mt-2 text-slate-200">{service.description}</p>
                  </div>
                  {service.category ? (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200">
                      {service.category}
                    </span>
                  ) : null}
                </div>
                <Link
                  href="/contact"
                  className="mt-4 inline-flex text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  Planifier un brief →
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      </Container>
    </motion.section>
  );
}
