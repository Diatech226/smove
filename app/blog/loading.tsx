import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function BlogLoading() {
  return (
    <div className="bg-slate-950 pb-24 pt-14">
      <Container className="space-y-8">
        <SectionHeader
          eyebrow="Smove Insights"
          title="Le regard SMOVE sur la communication"
          subtitle="Chargement des articles..."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-64 animate-pulse rounded-2xl border border-white/5 bg-white/5/30"
              aria-hidden
            />
          ))}
        </div>
      </Container>
    </div>
  );
}
