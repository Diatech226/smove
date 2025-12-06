// file: components/admin/AdminPageHeader.tsx
import { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
};

export function AdminPageHeader({
  title,
  subtitle,
  actions,
  className,
}: AdminPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-white/5 pb-6 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-2xl font-semibold text-white">{title}</h1>
        {subtitle ? (
          <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="flex gap-3">{actions}</div> : null}
    </div>
  );
}
