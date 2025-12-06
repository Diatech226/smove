// file: components/admin/AdminShell.tsx
import { ReactNode, useTransition } from "react";

import { useRouter } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

function useLogout() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const logout = async () => {
    await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    startTransition(() => {
      router.replace("/admin/login");
    });
  };

  return { logout, isPending };
}

type AdminShellProps = {
  children: ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const { logout, isPending } = useLogout();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <Container className="grid gap-10 py-10 lg:grid-cols-[240px_1fr]">
        <aside className="rounded-2xl border border-white/5 bg-white/5 p-6 shadow-lg shadow-emerald-500/10 backdrop-blur">
          <div className="mb-6">
            <p className="text-sm uppercase tracking-widest text-emerald-300/80">SMOVE</p>
            <p className="text-lg font-semibold text-white">Back-office</p>
          </div>
          <AdminNav />
          <div className="mt-8 border-t border-white/5 pt-6">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-center border border-white/10 text-slate-200 hover:border-emerald-300/50 hover:text-white"
              disabled={isPending}
            >
              {isPending ? "Déconnexion..." : "Déconnexion"}
            </Button>
          </div>
        </aside>
        <main className="rounded-3xl border border-white/5 bg-white/[0.03] p-8 shadow-2xl shadow-emerald-500/10 backdrop-blur">
          {children}
        </main>
      </Container>
    </div>
  );
}
