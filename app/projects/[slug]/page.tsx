// file: app/projects/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    return { title: "Projet introuvable – SMOVE Communication" };
  }

  return {
    title: `${project.title} – ${project.client} – SMOVE Communication`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: Props) {
  const project = await prisma.project.findUnique({
    where: { slug: params.slug },
  });

  if (!project) {
    notFound();
  }

  return (
    <div className="relative bg-slate-950 pb-20 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-12 h-64 w-64 rounded-full bg-emerald-500/15 blur-[110px]" />
        <div className="absolute right-14 top-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-[110px]" />
      </div>
      <Container className="relative space-y-10">
        <SectionHeader eyebrow={project.client} title={project.title} subtitle={`Secteur : ${project.sector}`} />

        <Card className="space-y-4">
          <p className="text-lg text-slate-200">{project.summary}</p>
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
        </div>
      </Container>
    </div>
  );
}
