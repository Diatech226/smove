// file: app/admin/layout.tsx
"use client";

import { ReactNode } from "react";

import { usePathname } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { Container } from "@/components/ui/Container";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <Container className="flex min-h-screen items-center justify-center py-16">{children}</Container>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
