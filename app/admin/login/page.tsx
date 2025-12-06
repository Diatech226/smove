// file: app/admin/login/page.tsx
"use client";

import { FormEvent, useState } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      setError(result.error ?? "Mot de passe incorrect.");
      setIsSubmitting(false);
      return;
    }

    router.push("/admin/dashboard");
  };

  return (
    <Card className="w-full max-w-md border-white/10 bg-white/5 p-8 shadow-2xl shadow-emerald-500/20">
      <div className="mb-6 text-center">
        <p className="text-sm uppercase tracking-widest text-emerald-300/80">SMOVE</p>
        <h1 className="mt-2 text-2xl font-semibold text-white">Accès administrateur</h1>
        <p className="mt-2 text-sm text-slate-300">
          Entrez le mot de passe pour accéder au back-office.
        </p>
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-white" htmlFor="password">
            Mot de passe
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
            placeholder="Votre mot de passe"
            required
          />
        </div>
        {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        <Button type="submit" className="w-full justify-center" disabled={isSubmitting}>
          {isSubmitting ? "Connexion..." : "Se connecter"}
        </Button>
      </form>
    </Card>
  );
}
