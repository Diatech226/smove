// file: components/admin/AdminNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/services", label: "Services" },
  { href: "/admin/projects", label: "Projets" },
  { href: "/admin/posts", label: "Articles" },
  { href: "/admin/settings", label: "Paramètres" },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2 text-sm font-medium text-slate-200">
      {links.map((link) => {
        const active = pathname?.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "rounded-lg px-3 py-2 transition hover:bg-emerald-500/10",
              active
                ? "bg-emerald-500/10 text-emerald-200"
                : "text-slate-200 hover:text-white",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
