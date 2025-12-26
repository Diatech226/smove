export default function AdminPostsLoading() {
  return (
    <div className="space-y-8">
      <div className="h-16 animate-pulse rounded-xl bg-white/5" />
      <div className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6">
        <div className="h-6 w-1/3 animate-pulse rounded-lg bg-white/10" />
        <div className="grid gap-3 md:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-10 animate-pulse rounded-lg bg-white/10" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-12 animate-pulse rounded-lg bg-white/10" />
          ))}
        </div>
      </div>
    </div>
  );
}
