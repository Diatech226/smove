// file: app/admin/layout.tsx
"use client";

import { ReactNode, useEffect, useState } from "react";

import { usePathname, useRouter } from "next/navigation";

import { AdminShell } from "@/components/admin/AdminShell";
import { Container } from "@/components/ui/Container";

const AUTH_COOKIE_NAME = "smove_admin_auth";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLogin = pathname === "/admin/login";
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (isLogin) {
      setCheckedAuth(true);
      setAuthorized(true);
      return;
    }

    const hasAuthCookie = document.cookie
      .split(";")
      .some((cookie) => cookie.trim().startsWith(`${AUTH_COOKIE_NAME}=`));

    if (!hasAuthCookie) {
      router.replace("/admin/login");
      return;
    }

    setAuthorized(true);
    setCheckedAuth(true);
  }, [isLogin, router]);

  if (isLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
        <Container className="flex min-h-screen items-center justify-center py-16">{children}</Container>
      </div>
    );
  }

  if (!checkedAuth) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Container className="flex min-h-screen items-center justify-center py-16">
          <p className="text-sm text-slate-300">Vérification de l'accès en cours...</p>
        </Container>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <Container className="flex min-h-screen items-center justify-center py-16">
          <p className="text-sm text-slate-300">Redirection vers la connexion...</p>
        </Container>
      </div>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}
