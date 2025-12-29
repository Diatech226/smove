// file: app/services/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { safePrisma } from "@/lib/safePrisma";
import { getMediaVariantUrl } from "@/lib/media/utils";
import type { MediaItem } from "@/lib/media/types";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { DatabaseWarning } from "@/components/ui/DatabaseWarning";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/config/seo";
import { CategoryBadge } from "@/components/ui/CategoryBadge";
import { MediaCover } from "@/components/ui/MediaCover";

export const dynamic = "force-dynamic";

type ServiceListItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category?: string | null;
  cover: MediaItem;
};

export const metadata: Metadata = createMetadata({
  title: "Services – SMOVE Communication",
  description:
    "Stratégie, contenus, campagnes média et production audiovisuelle : découvrez les services de l'agence SMOVE Communication.",
  path: "/services",
});

export default async function ServicesPage() {
  const servicesResult = await safePrisma((db) =>
    db.service.findMany({
      orderBy: { createdAt: "asc" },
      include: { cover: true },
    }),
  );
  const services = (servicesResult.ok ? servicesResult.data : []) as ServiceListItem[];
  const loadError = !servicesResult.ok;

  return (
    <div className="relative bg-slate-950 pb-20 pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-10 h-64 w-64 rounded-full bg-sky-500/15 blur-[120px]" />
        <div className="absolute right-10 bottom-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>
      <Container className="relative space-y-12">
        <SectionHeader
          eyebrow="Services"
          title="Nos expertises créatives et digitales"
          subtitle="Une équipe multidisciplinaire pour concevoir, produire et amplifier vos campagnes partout où votre audience se trouve."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {loadError ? (
            <DatabaseWarning message="Les services ne peuvent pas être chargés pour le moment. Vérifiez la connexion à la base de données ou réessayez plus tard." />
          ) : null}
          {services.map((service) => {
            const coverSrc = service.cover
              ? getMediaVariantUrl(service.cover, "sm") ?? service.cover.originalUrl
              : null;

            return (
              <Card
                key={service.id}
                as="article"
                className="group h-full overflow-hidden border-white/10 bg-slate-900/60 p-0"
              >
                <MediaCover
                  src={coverSrc}
                  alt={service.name}
                  className="h-48 w-full rounded-none border-none"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="space-y-4 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-xl font-semibold text-white">{service.name}</h2>
                      <p className="mt-2 text-sm text-slate-200">{service.description ?? "Description à venir."}</p>
                    </div>
                    {service.category ? <CategoryBadge label={service.category} /> : null}
                  </div>
                  <Link
                    href={`/services/${service.slug}`}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-sky-200 transition group-hover:text-sky-100"
                  >
                    Voir le service
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </Card>
            );
          })}
          {!services.length ? <p className="text-slate-200">Aucun service pour le moment.</p> : null}
        </div>
      </Container>
    </div>
  );
}
