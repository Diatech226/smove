import { cn } from "@/lib/utils";

export type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
  tone?: "light" | "dark";
};

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
  tone = "light",
}: SectionHeaderProps) {
  const alignment = align === "center" ? "text-center" : "text-left";
  const spacing = align === "center" ? "mx-auto max-w-3xl" : "max-w-4xl";
  const titleColor = tone === "dark" ? "text-slate-900" : "text-white";
  const subtitleColor = tone === "dark" ? "text-slate-700" : "text-slate-200";

  return (
    <div className={cn("space-y-3", alignment, spacing, className)}>
      {eyebrow ? (
        <p className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-emerald-200">
          {eyebrow}
        </p>
      ) : null}
      <h2 className={cn("text-3xl font-semibold sm:text-4xl", titleColor)}>{title}</h2>
      {subtitle ? <p className={cn("text-base", subtitleColor)}>{subtitle}</p> : null}
    </div>
  );
}
