// file: app/projects/[slug]/page.tsx
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
  const projectResult = await safePrisma((db) =>
    db.project.findFirst({
      where: {
        slug: params.slug,
        OR: [{ status: "published" }, { status: null }],
      },
      include: { cover: true },
    }),
  );
  const project = projectResult.ok ? projectResult.data : null;

  if (!project) {
    return createMetadata({
      title: "Projet introuvable – SMOVE Communication",
      description: "Le projet demandé n'est plus disponible.",
      path: `/projects/${params.slug}`,
    });
  }

  return createMetadata({
    title: `${project.title} – ${project.client} – SMOVE Communication`,
    description: project.summary ?? "Découvrez cette réalisation signée SMOVE Communication.",
    path: `/projects/${project.slug}`,
  });
}

export default async function ProjectPage({ params }: Props) {
  const projectResult = await safePrisma((db) =>
    db.project.findFirst({
      where: {
        slug: params.slug,
        OR: [{ status: "published" }, { status: null }],
      },
      include: { cover: true },
    }),
  );
  const project = projectResult.ok ? projectResult.data : null;

  if (!projectResult.ok) {
    return (
      <div className="relative bg-slate-950 pb-20 pt-12">
        <Container className="relative space-y-10">
          <DatabaseWarning message="Impossible d'afficher ce projet. Vérifiez la connexion à la base de données ou réessayez plus tard." />
        </Container>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  const coverSrc = project.cover
    ? getMediaVariantUrl(project.cover, "lg") ?? project.cover.originalUrl
    : null;

  return (
    <div className="relative bg-slate-950 pb-20 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-12 h-64 w-64 rounded-full bg-sky-500/15 blur-[110px]" />
        <div className="absolute right-14 top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-[110px]" />
      </div>
      <Container className="relative space-y-10">
        <SectionHeader eyebrow={project.client} title={project.title} subtitle={`Secteur : ${project.sector}`} />

        <MediaCover
          src={coverSrc}
          alt={project.title}
          className="h-72 w-full"
          sizes="100vw"
          priority
        />

        <Card className="space-y-4">
          {project.summary ? <p className="text-lg text-slate-200">{project.summary}</p> : null}
          {project.body ? <p className="text-slate-300">{project.body}</p> : null}

          {project.results && project.results.length > 0 ? (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Résultats clés</h3>
              <ul className="list-disc space-y-1 pl-5 text-slate-200">
                {project.results.map((result) => (
                  <li key={result}>{result}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </Card>

        <div className="flex flex-wrap gap-3">
          <Button href="/projects" variant="secondary">
            Retour aux projets
          </Button>
          <Button href="/contact">Parler de votre projet</Button>
          <Link href="/services" className="text-sm font-semibold text-sky-200 hover:text-sky-100">
            Découvrir nos services
          </Link>
        </div>
      </Container>
    </div>
  );
}
