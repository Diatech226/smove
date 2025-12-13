import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ProjectsLoading() {
  return (
    <div className="bg-slate-950 pb-20 pt-12">
      <Container className="space-y-8">
        <SectionHeader eyebrow="Projets" title="Nos réalisations" subtitle="Chargement en cours..." />
        <div className="grid gap-6 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-48 animate-pulse rounded-2xl border border-white/5 bg-white/5/30"
              aria-hidden
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
