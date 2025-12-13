"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type Props = {
  title?: string;
  message: string;
  retryLabel?: string;
};

export function DatabaseWarning({
  title = "Connexion à la base de données instable",
  message,
  retryLabel = "Réessayer",
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRetry = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <Card className="border-amber-300/30 bg-amber-500/10 p-4 text-amber-50">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-amber-200">{title}</p>
          <p className="text-sm text-amber-100/90">{message}</p>
        </div>
        <Button onClick={handleRetry} variant="secondary" disabled={isPending} className="w-full sm:w-auto">
          {isPending ? "Nouvelle tentative…" : retryLabel}
        </Button>
      </div>
    </Card>
  );
}
