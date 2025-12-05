import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { projects } from "@/lib/config/projects";

type ProjectPageProps = {
  params: { slug: string };
};

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = projects.find((item) => item.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="bg-slate-950 pb-16 pt-10">
      <Container className="space-y-10">
        <SectionHeader
          eyebrow={project.client}
          title={project.title}
          subtitle={`Secteur : ${project.sector}`}
        />

        <Card className="space-y-4">
          <p className="text-lg text-slate-200">{project.summary}</p>
          <p className="text-slate-300">
            Notre équipe a conçu la stratégie, produit les assets et orchestré la diffusion pour générer un impact mesurable
            sur les objectifs business du client.
          </p>

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
            Besoin d'un cas d'usage détaillé ? <Link href="/contact" className="text-emerald-300 hover:text-emerald-200">Contactez-nous</Link> pour recevoir un dossier complet.
          </p>
        </div>
      </Container>
    </div>
  );
}
