// file: components/ui/CategoryBadge.tsx
import { cn } from "@/lib/utils";

type CategoryBadgeProps = {
  label?: string | null;
  className?: string;
};

export function CategoryBadge({ label, className }: CategoryBadgeProps) {
  if (!label) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-sky-200",
        className,
      )}
    >
      {label}
    </span>
  );
}
