"use client";

import { useTransition } from "react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/Button";

type DeletePostButtonProps = {
  postId: string;
};

export function DeletePostButton({ postId }: DeletePostButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    const confirmed = window.confirm("Supprimer définitivement cet article ?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
      const data = await response.json();

      if (!response.ok || data?.success === false) {
        const errorMessage = data?.error || data?.message || "Impossible de supprimer cet article.";
        alert(errorMessage);
        return;
      }

      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue lors de la suppression.");
    }
  };

  return (
    <Button
      type="button"
      variant="ghost"
      className="border border-white/10 px-3 py-1 text-xs text-rose-200 hover:text-rose-100"
      onClick={handleDelete}
      disabled={isPending}
    >
      {isPending ? "Suppression..." : "Supprimer"}
    </Button>
  );
}
