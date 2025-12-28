"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AdminLoginClientProps = {
  bootstrapEnabled: boolean;
};

const appendQueryParam = (url: string, key: string, value: string) => {
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
};

export default function AdminLoginClient({ bootstrapEnabled }: AdminLoginClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok || !result.ok) {
        const errorMessage =
          result.error ?? (response.status === 500 ? "Configuration serveur manquante." : "Mot de passe incorrect.");
        setError(errorMessage);
        setIsSubmitting(false);
        return;
      }

      const redirectTo = searchParams?.get("redirectTo") || "/admin/dashboard";
      const destination = result?.data?.bootstrapCreated ? appendQueryParam(redirectTo, "bootstrap", "1") : redirectTo;
      router.push(destination);
    } catch (submitError) {
      console.error(submitError);
      setError("Impossible de se connecter pour le moment. Réessayez.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-12">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-10%] top-[-10%] h-64 w-64 rounded-full bg-emerald-500/20 blur-[90px]" />
        <div className="absolute right-[-8%] top-20 h-72 w-72 rounded-full bg-indigo-500/20 blur-[80px]" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative w-full max-w-lg"
      >
        <Card className="overflow-hidden border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-10 shadow-2xl shadow-emerald-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Smove Admin</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">Accès sécurisé</h1>
              <p className="mt-2 text-sm text-slate-300">
                Authentifiez-vous pour accéder au centre de commande.
              </p>
              {bootstrapEnabled ? (
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200/80">
                  Admin bootstrap activé
                </p>
              ) : null}
            </div>
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-emerald-400/80 to-cyan-500/70 shadow-lg shadow-emerald-500/30" />
          </div>
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="admin@smove.fr"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="password">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="••••••••"
                required
              />
            </div>
            {error ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-rose-300">
                {error}
              </motion.p>
            ) : null}
            <Button
              type="submit"
              className="w-full justify-center bg-gradient-to-r from-emerald-400 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/20 transition hover:brightness-110"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Connexion..." : "Entrer dans le back-office"}
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
