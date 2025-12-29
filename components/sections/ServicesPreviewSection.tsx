"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { services } from "@/lib/config/services";
import { Button } from "@/components/ui/Button";
import { useReducedMotionPref } from "@/lib/hooks/useReducedMotionPref";

export default function ServicesPreviewSection() {
  const shouldReduceMotion = useReducedMotionPref();

  return (
    <motion.section
      className="border-b border-white/10 bg-slate-950 py-16"
      initial={shouldReduceMotion ? undefined : { opacity: 0, y: 30 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.8, ease: "easeOut" }}
      viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.3 }}
    >
      <Container>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader
            eyebrow="Services"
            title="Des expertises connectées pour piloter votre croissance"
            subtitle="Stratégie digitale, production, brand design et campagnes média orchestrés par une équipe dédiée."
          />
          <div className="flex justify-start lg:justify-end">
            <Button href="/services" variant="secondary">
              Voir tous les services
            </Button>
          </div>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {services.slice(0, 4).map((service, index) => (
            <motion.div
              key={service.id}
              initial={shouldReduceMotion ? undefined : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={shouldReduceMotion ? { duration: 0 } : { duration: 0.55, ease: "easeOut", delay: index * 0.05 }}
              viewport={shouldReduceMotion ? undefined : { once: true, amount: 0.2 }}
            >
              <Card className="group h-full border-white/10 bg-slate-900/60">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{service.name}</h3>
                    <p className="mt-3 text-sm text-slate-300">{service.description}</p>
                  </div>
                  {service.category ? (
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
                      {service.category}
                    </span>
                  ) : null}
                </div>
                <Link
                  href="/contact"
                  className="mt-5 inline-flex text-sm font-semibold text-sky-200 transition group-hover:text-sky-100"
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
