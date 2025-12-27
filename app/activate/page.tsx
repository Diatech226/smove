"use client";

import { FormEvent, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type StatusState = "idle" | "submitting" | "success" | "error";

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams?.get("token") ?? "", [searchParams]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<StatusState>("idle");
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("submitting");
    setMessage(null);

    if (!token) {
      setStatus("error");
      setMessage("Lien d'activation invalide.");
      return;
    }

    if (password.length < 8) {
      setStatus("error");
      setMessage("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    try {
      const response = await fetch("/api/auth/activate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await response.json();

      if (!response.ok || data?.ok === false) {
        const errorMessage = data?.error || data?.message || "Impossible d'activer le compte.";
        setStatus("error");
        setMessage(errorMessage);
        return;
      }

      setStatus("success");
      setMessage("Compte activé. Vous pouvez maintenant vous connecter.");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage("Une erreur est survenue. Réessayez.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-12 text-white">
      <Card className="w-full max-w-lg border-white/10 bg-white/5 p-8 shadow-2xl shadow-emerald-500/10">
        <h1 className="text-2xl font-semibold">Activation du compte</h1>
        <p className="mt-2 text-sm text-slate-300">
          Choisissez un mot de passe pour activer votre compte et accéder au CMS.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-sm font-semibold" htmlFor="password">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold" htmlFor="confirm-password">
              Confirmer le mot de passe
            </label>
            <input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              required
            />
          </div>

          {message ? (
            <p className={status === "success" ? "text-sm text-emerald-200" : "text-sm text-rose-200"}>
              {message}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={status === "submitting"}>
              {status === "submitting" ? "Activation..." : "Activer le compte"}
            </Button>
            <Button variant="ghost" href="/admin/login" className="border border-white/10">
              Aller au login
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
