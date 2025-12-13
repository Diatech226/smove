import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ServicesLoading() {
  return (
    <div className="bg-slate-950 pb-20 pt-12">
      <Container className="space-y-8">
        <SectionHeader eyebrow="Services" title="Nos expertises créatives et digitales" subtitle="Chargement des services..." />
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-2xl border border-white/5 bg-white/5/30"
              aria-hidden
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
