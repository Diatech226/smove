import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { services } from "@/lib/config/services";
import { createMetadata } from "@/lib/config/seo";

export const metadata: Metadata = createMetadata({
  title: "Services – SMOVE Communication",
  description:
    "Stratégie, contenu, campagnes media et production audiovisuelle : découvrez les services de l'agence SMOVE Communication.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <div className="bg-slate-950 pb-16 pt-10">
      <Container className="space-y-10">
        <SectionHeader
          eyebrow="Services"
          title="Nos expertises créatives et digitales"
          subtitle="Une équipe multidisciplinaire pour concevoir, produire et amplifier vos campagnes partout où votre audience se trouve."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <Card key={service.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-white">{service.name}</h2>
                  <p className="mt-2 text-slate-200">{service.description}</p>
                  <p className="mt-3 text-sm text-slate-400">
                    Livrables, processus et études de cas détaillés sur demande.
                  </p>
                </div>
                {service.category ? (
                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-200">
                    {service.category}
                  </span>
                ) : null}
              </div>
            </Card>
          ))}
        </div>
      </Container>
    </div>
  );
}
