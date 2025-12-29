// file: app/projects/page.tsx
import Link from "next/link";
import type { Metadata } from "next";
import { safePrisma } from "@/lib/safePrisma";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { DatabaseWarning } from "@/components/ui/DatabaseWarning";
import { getMediaVariantUrl } from "@/lib/media/utils";
import { MediaCover } from "@/components/ui/MediaCover";
import { createMetadata } from "@/lib/config/seo";

export const metadata: Metadata = createMetadata({
  title: "Nos projets – SMOVE Communication",
  description: "Découvrez les projets réalisés par SMOVE Communication.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projectsResult = await safePrisma((db) =>
    db.project.findMany({
      where: {
        OR: [{ status: "published" }, { status: null }],
      },
      orderBy: { createdAt: "desc" },
      include: { cover: true },
    }),
  );
  const projects = projectsResult.ok ? projectsResult.data : [];
  const loadError = !projectsResult.ok;

  return (
    <div className="relative bg-slate-950 pb-20 pt-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-12 h-64 w-64 rounded-full bg-sky-500/15 blur-[120px]" />
        <div className="absolute right-10 top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[120px]" />
      </div>
      <Container className="relative space-y-12">
        <SectionHeader
          eyebrow="Projets"
          title="Nos réalisations"
          subtitle="Une sélection de missions menées avec nos clients, de la stratégie à la diffusion."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {loadError ? (
            <DatabaseWarning message="Les projets ne peuvent pas être affichés. Vérifiez la connexion à la base de données ou réessayez plus tard." />
          ) : null}
          {projects.map((project) => {
            const coverSrc = project.cover
              ? getMediaVariantUrl(project.cover, "sm") ?? project.cover.originalUrl
              : null;

            return (
              <Card
                key={project.id}
                as="article"
                className="group flex h-full flex-col gap-4 overflow-hidden border-white/10 bg-slate-900/60 p-0"
              >
                <MediaCover
                  src={coverSrc}
                  alt={project.title}
                  className="h-48 w-full rounded-none border-none"
                  sizes="(min-width: 1024px) 40vw, 100vw"
                />
                <div className="flex flex-col gap-3 px-6 pb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.2em] text-sky-200">{project.client}</p>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-slate-100">
                      {project.sector}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-slate-300">{project.summary}</p>
                  <div className="mt-auto flex items-center justify-between pt-2 text-sm font-semibold text-sky-200">
                    <span>{new Date(project.createdAt).toLocaleDateString("fr-FR")}</span>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="inline-flex items-center gap-2 text-sky-200 transition group-hover:text-sky-100"
                    >
                      Voir le projet
                      <span aria-hidden>→</span>
                    </Link>
                  </div>
                </div>
              </Card>
            );
          })}
          {!projects.length ? <p className="text-slate-200">Aucun projet pour le moment.</p> : null}
        </div>

        <div className="flex justify-center">
          <Button href="/contact" variant="secondary">
            Discuter de votre projet
          </Button>
        </div>
      </Container>
    </div>
  );
}
