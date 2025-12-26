"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

type PublishToggleButtonProps = {
  postId: string;
  published: boolean;
};

export function PublishToggleButton({ postId, published }: PublishToggleButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleToggle = async () => {
    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !published }),
      });
      const data = await response.json();

      if (!response.ok || data?.success === false) {
        const message = data?.error || data?.message || "Impossible de mettre à jour le statut.";
        alert(message);
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="border border-white/10 px-3 py-1 text-xs text-emerald-200 hover:text-emerald-100"
      onClick={handleToggle}
      disabled={isPending}
    >
      {isPending ? "Mise à jour..." : published ? "Dépublier" : "Publier"}
    </Button>
  );
}
