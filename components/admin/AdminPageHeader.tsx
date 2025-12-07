// file: components/admin/AdminPageHeader.tsx
"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

type AdminPageHeaderProps = {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  className?: string;
};

export function AdminPageHeader({ title, subtitle, actions, className }: AdminPageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/5 bg-white/5 px-5 py-4 backdrop-blur",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        <div className="absolute right-10 top-3 h-12 w-12 rounded-full bg-emerald-500/10 blur-2xl" />
      </div>
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Administration</p>
          <h1 className="text-2xl font-semibold text-white lg:text-3xl">{title}</h1>
          {subtitle ? <p className="mt-2 text-sm text-slate-300">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
      </div>
    </motion.div>
  );
}
