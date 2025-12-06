// file: app/services/page.tsx
import type { Metadata } from "next";
import { motion } from "framer-motion";

import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/config/seo";

export const metadata: Metadata = createMetadata({
  title: "Services – SMOVE Communication",
  description:
    "Stratégie, contenu, campagnes media et production audiovisuelle : découvrez les services de l'agence SMOVE Communication.",
  path: "/services",
});

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="relative bg-slate-950 pb-20 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-emerald-500/15 blur-[110px]" />
        <div className="absolute right-10 bottom-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-[110px]" />
      </div>
      <Container className="relative space-y-12">
        <SectionHeader
          eyebrow="Services"
          title="Nos expertises créatives et digitales"
          subtitle="Une équipe multidisciplinaire pour concevoir, produire et amplifier vos campagnes partout où votre audience se trouve."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ delay: 0.05 * index, duration: 0.35, ease: "easeOut" }}
            >
              <Card className="group h-full overflow-hidden border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-6 shadow-xl shadow-emerald-500/10 transition duration-300 hover:-translate-y-1 hover:border-emerald-400/40 hover:shadow-emerald-400/20">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{service.name}</h2>
                    <p className="mt-2 text-slate-200">{service.description}</p>
                    <p className="mt-3 text-sm text-slate-400">
                      Livrables, processus et études de cas détaillés sur demande.
                    </p>
                  </div>
                  {service.slug ? (
                    <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                      {service.slug}
                    </span>
                  ) : null}
                </div>
              </Card>
            </motion.div>
          ))}
          {!services.length ? <p className="text-slate-200">Aucun service pour le moment.</p> : null}
        </div>
      </Container>
    </div>
  );
}
