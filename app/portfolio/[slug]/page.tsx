// file: app/portfolio/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export const dynamic = "force-dynamic";

type PortfolioProject = {
  id: string;
  slug: string;
  client: string;
  title: string;
  sector: string;
  summary: string;
  body?: string | null;
  results: string[];
};

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const project = (await prisma.project.findUnique({ where: { slug: params.slug } })) as PortfolioProject | null;

  if (!project) {
    return {
      title: "Projet introuvable – SMOVE Communication",
    };
  }

  return {
    title: `${project.title} – ${project.client} – SMOVE Communication`,
    description: project.summary,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const project = (await prisma.project.findUnique({ where: { slug: params.slug } })) as PortfolioProject | null;

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
          <Button href="/portfolio" variant="secondary">
            Retour au portfolio
          </Button>
          <Button href="/contact">Parler de votre projet</Button>
        </div>

        <div className="text-sm text-slate-400">
          <p>
            Besoin d'un cas d'usage détaillé?{" "}
            <Link href="/contact" className="text-emerald-300 hover:text-emerald-200">
              Contactez-nous
            </Link>{" "}
            pour recevoir un dossier complet.
          </p>
        </div>
      </Container>
    </div>
  );
}
