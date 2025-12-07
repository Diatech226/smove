// file: app/portfolio/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";

export const dynamic = "force-dynamic";

type PortfolioListProject = {
  id: string;
  slug: string;
  client: string;
  title: string;
  sector: string;
  summary: string;
  createdAt: string | Date;
};

export const metadata: Metadata = {
  title: "Nos projets – SMOVE Communication",
  description: "Découvrez les projets réalisés par SMOVE Communication pour ses clients.",
};

export default async function PortfolioPage() {
  const projects = (await prisma.project.findMany({ orderBy: { createdAt: "desc" } })) as PortfolioListProject[];

  return (
    <div className="relative bg-slate-950 pb-20 pt-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-12 h-64 w-64 rounded-full bg-emerald-500/15 blur-[110px]" />
        <div className="absolute right-12 top-20 h-64 w-64 rounded-full bg-cyan-500/10 blur-[110px]" />
      </div>
      <Container className="relative space-y-12">
        <SectionHeader
          eyebrow="Portfolio"
          title="Des projets qui font bouger les lignes"
          subtitle="Branding, campagnes, production, expériences digitales : un aperçu des résultats obtenus pour nos clients."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <Card
              key={project.id}
              as="article"
              className="flex h-full flex-col gap-3 transition duration-200 hover:-translate-y-1 hover:border-emerald-400/50 hover:shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">{project.client}</p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-slate-300">Secteur : {project.sector}</p>
                </div>
              </div>
              <p className="text-slate-200">{project.summary}</p>
              <div className="mt-auto flex items-center justify-between pt-2 text-sm font-semibold text-emerald-300">
                <span>{new Date(project.createdAt).toLocaleDateString("fr-FR")}</span>
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="inline-flex items-center gap-2 text-emerald-300 hover:text-emerald-200"
                >
                  Voir le projet
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </Card>
          ))}
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
