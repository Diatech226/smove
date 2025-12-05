import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/lib/config/projects";
import { Button } from "@/components/ui/Button";

export default function PortfolioPage() {
  return (
    <div className="bg-slate-950 pb-16 pt-10">
      <Container className="space-y-10">
        <SectionHeader
          eyebrow="Portfolio"
          title="Des projets qui font bouger les lignes"
          subtitle="Branding, campagnes, production, expériences digitales : un aperçu des résultats obtenus pour nos clients."
        />

        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <Card key={project.slug} as="article" className="flex flex-col gap-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">{project.client}</p>
                  <h3 className="mt-1 text-2xl font-semibold text-white">{project.title}</h3>
                </div>
                <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-100">
                  {project.sector}
                </span>
              </div>
              <p className="text-slate-200">{project.summary}</p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href={`/portfolio/${project.slug}`}
                  className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
                >
                  Voir le projet →
                </Link>
              </div>
            </Card>
          ))}
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
