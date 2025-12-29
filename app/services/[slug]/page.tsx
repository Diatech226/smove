// file: app/services/[slug]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { DatabaseWarning } from "@/components/ui/DatabaseWarning";
import { safePrisma } from "@/lib/safePrisma";
import { getMediaVariantUrl } from "@/lib/media/utils";
import { MediaCover } from "@/components/ui/MediaCover";
import { createMetadata } from "@/lib/config/seo";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const serviceResult = await safePrisma((db) =>
    db.service.findFirst({
      where: {
        slug: params.slug,
        OR: [{ status: "published" }, { status: null }],
      },
      include: { cover: true },
    }),
  );
  const service = serviceResult.ok ? serviceResult.data : null;

  if (!service) {
    return createMetadata({
      title: "Service introuvable – SMOVE Communication",
      description: "Le service demandé n'est plus disponible.",
      path: `/services/${params.slug}`,
    });
  }

  return createMetadata({
    title: `${service.name} – SMOVE Communication`,
    description: service.description ?? "Découvrez notre expertise et nos livrables sur mesure.",
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: Props) {
  const serviceResult = await safePrisma((db) =>
    db.service.findFirst({
      where: {
        slug: params.slug,
        OR: [{ status: "published" }, { status: null }],
      },
      include: { cover: true },
    }),
  );
  const service = serviceResult.ok ? serviceResult.data : null;

  if (!serviceResult.ok) {
    return (
      <div className="relative bg-slate-950 pb-20 pt-12">
        <Container className="relative space-y-10">
          <DatabaseWarning message="Impossible d'afficher ce service. Vérifiez la connexion à la base de données ou réessayez plus tard." />
        </Container>
      </div>
    );
  }

  if (!service) {
    notFound();
  }

  const coverSrc = service.cover
    ? getMediaVariantUrl(service.cover, "lg") ?? service.cover.originalUrl
    : null;

  return (
    <div className="relative bg-slate-950 pb-20 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-12 h-64 w-64 rounded-full bg-sky-500/15 blur-[110px]" />
        <div className="absolute right-14 top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[110px]" />
      </div>
      <Container className="relative space-y-10">
        <SectionHeader
          eyebrow={service.category ?? "Service"}
          title={service.name}
          subtitle="Une expertise construite pour accélérer vos performances et renforcer votre image."
        />

        <MediaCover
          src={coverSrc}
          alt={service.name}
          className="h-72 w-full"
          sizes="100vw"
          priority
        />

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="space-y-4">
            <p className="text-lg text-slate-200">
              {service.description ??
                "Nous construisons un dispositif complet et sur-mesure pour répondre à vos enjeux de visibilité."}
            </p>
            <p className="text-slate-300">
              Notre équipe intervient sur la stratégie, la production et l'activation pour assurer une exécution rapide et cohérente.
            </p>
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-white">Livrables principaux</h3>
              <ul className="list-disc space-y-1 pl-5 text-slate-200">
                <li>Audit et recommandations stratégiques.</li>
                <li>Planification éditoriale et production multi-format.</li>
                <li>Mesure des performances et ajustements continus.</li>
              </ul>
            </div>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Prochaines étapes</h3>
            <p className="text-sm text-slate-300">
              Recevez un plan d'action clair et des budgets adaptés à vos objectifs.
            </p>
            <div className="space-y-2 text-sm text-slate-200">
              <p>• Kick-off stratégique</p>
              <p>• Production & validation créative</p>
              <p>• Déploiement et reporting</p>
            </div>
            <Button href="/contact">Parler du service</Button>
            <Link href="/services" className="text-sm font-semibold text-sky-200 hover:text-sky-100">
              ← Retour aux services
            </Link>
          </Card>
        </div>
      </Container>
    </div>
  );
}
