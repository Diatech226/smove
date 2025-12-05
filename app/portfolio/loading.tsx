// file: app/portfolio/loading.tsx
import { Container } from "@/components/ui/Container";

export default function LoadingPortfolio() {
  return (
    <Container>
      <div className="space-y-8 py-16">
        <div className="h-8 w-48 rounded bg-slate-800/60" />
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="space-y-3 rounded-xl border border-slate-800/60 bg-slate-900/50 p-4">
              <div className="h-32 rounded-lg bg-slate-800/60" />
              <div className="h-4 w-3/4 rounded bg-slate-800/60" />
              <div className="h-3 w-1/2 rounded bg-slate-800/60" />
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
