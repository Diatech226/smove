// file: app/admin/loading.tsx
import { Card } from "@/components/ui/Card";

export default function AdminLoading() {
  return (
    <div className="space-y-6">
      <div className="h-10 w-48 animate-pulse rounded-lg bg-white/10" />
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="h-32 animate-pulse border-white/10 bg-white/5" />
        ))}
      </div>
      <Card className="h-64 animate-pulse border-white/10 bg-white/5" />
    </div>
  );
}
