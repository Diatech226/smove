// file: components/admin/AdminShell.tsx
"use client";

import { ReactNode, useTransition } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { AdminNav } from "@/components/admin/AdminNav";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

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
  className?: string;
};

export function AdminShell({ children, className }: AdminShellProps) {
  const { logout, isPending } = useLogout();

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-72 w-72 rounded-full bg-emerald-500/20 blur-[90px]" />
        <div className="absolute right-[-10%] top-1/4 h-80 w-80 rounded-full bg-indigo-500/20 blur-[90px]" />
        <div className="absolute bottom-[-10%] left-1/3 h-72 w-72 rounded-full bg-cyan-500/10 blur-[80px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col px-4 pb-10 pt-8 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="mb-8 flex items-center justify-between rounded-2xl border border-white/5 bg-white/5/20 px-4 py-3 backdrop-blur"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/70 to-cyan-500/70 text-lg font-semibold text-slate-950 shadow-lg shadow-emerald-500/20">
              S
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">Smove</p>
              <p className="text-sm font-semibold text-white">Back-office créatif</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="border border-white/10 px-4 py-2 text-sm text-slate-200 hover:border-emerald-300/60 hover:bg-white/5"
              onClick={logout}
              disabled={isPending}
            >
              {isPending ? "Déconnexion..." : "Déconnexion"}
            </Button>
          </div>
        </motion.div>

        <div className="grid flex-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-white/5 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-5 shadow-2xl shadow-emerald-500/10 backdrop-blur">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-emerald-200/80">Navigation</p>
                <p className="text-sm text-slate-200">Administration</p>
              </div>
              <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5" />
            </div>
            <AdminNav />
          </aside>

          <main
            className={cn(
              "relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur",
              className,
            )}
          >
            <div className="pointer-events-none absolute inset-0 opacity-70">
              <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
              <div className="absolute left-6 top-6 h-32 w-32 rounded-full bg-emerald-500/10 blur-[70px]" />
            </div>
            <div className="relative">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
