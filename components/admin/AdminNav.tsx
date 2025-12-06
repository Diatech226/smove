// file: components/admin/AdminNav.tsx
"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Tableau de bord" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/posts", label: "Articles" },
  { href: "/admin/settings", label: "Paramètres" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 text-sm font-medium text-slate-200">
      {links.map((link, index) => {
        const active = pathname?.startsWith(link.href);
        return (
          <motion.div
            key={link.href}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 * index, duration: 0.25, ease: "easeOut" }}
          >
            <Link
              href={link.href}
              className={cn(
                "group relative flex items-center gap-3 overflow-hidden rounded-xl border border-white/5 px-3 py-2 transition-all duration-200 hover:border-emerald-400/50 hover:bg-white/5",
                active
                  ? "bg-white/10 text-emerald-100 shadow-inner shadow-emerald-500/10"
                  : "text-slate-200",
              )}
            >
              <span
                className={cn(
                  "h-2 w-2 rounded-full bg-white/30 transition group-hover:scale-110 group-hover:bg-emerald-300/90",
                  active && "scale-125 bg-emerald-300",
                )}
              />
              <span>{link.label}</span>
              <span className="ml-auto text-xs text-emerald-100/60 transition group-hover:text-emerald-100">→</span>
              {active ? (
                <motion.span
                  layoutId="admin-active-pill"
                  className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                />
              ) : null}
            </Link>
          </motion.div>
        );
      })}
    </nav>
  );
}
