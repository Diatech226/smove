"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";

type PostStatus = "draft" | "published" | "archived" | "removed";

type ToastState = {
  type: "success" | "error";
  message: string;
};

const STATUS_LABELS: Record<PostStatus, string> = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
  removed: "Retiré",
};

type StatusQuickActionsProps = {
  postId: string;
  status: PostStatus;
  publishedAt: string | Date | null;
  onStatusChange: (status: PostStatus, publishedAt: string | Date | null) => void;
};

export function StatusQuickActions({ postId, status, publishedAt, onStatusChange }: StatusQuickActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3000);
    return () => clearTimeout(timer);
  }, [toast]);

  const handleStatusChange = async (nextStatus: PostStatus) => {
    if (nextStatus === status || isUpdating) return;
    const previousStatus = status;
    const previousPublishedAt = publishedAt;
    const optimisticPublishedAt = nextStatus === "published" ? new Date().toISOString() : null;
    onStatusChange(nextStatus, optimisticPublishedAt);
    setIsUpdating(true);

    try {
      const response = await fetch(`/api/admin/posts/${postId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const data = await response.json();

      if (!response.ok || data?.success === false) {
        onStatusChange(previousStatus, previousPublishedAt);
        setToast({ type: "error", message: data?.error || "Impossible de mettre à jour le statut." });
        return;
      }

      onStatusChange(nextStatus, data?.post?.publishedAt ?? optimisticPublishedAt);
      setToast({ type: "success", message: "Statut mis à jour." });
    } catch (error) {
      console.error(error);
      onStatusChange(previousStatus, previousPublishedAt);
      setToast({ type: "error", message: "Une erreur est survenue lors de la mise à jour." });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {(["draft", "published", "archived", "removed"] as const).map((next) => (
          <Button
            key={next}
            type="button"
            variant="ghost"
            className="border border-white/10 px-3 py-1 text-xs text-slate-200 hover:text-white"
            onClick={() => handleStatusChange(next)}
            disabled={isUpdating}
          >
            {STATUS_LABELS[next]}
          </Button>
        ))}
        {isUpdating ? (
          <span className="inline-flex items-center gap-2 text-xs text-emerald-200">
            <span className="h-3 w-3 animate-spin rounded-full border-2 border-emerald-200/70 border-t-transparent" />
            Mise à jour...
          </span>
        ) : null}
      </div>
      {toast ? (
        <div role="status" className={`text-xs ${toast.type === "success" ? "text-emerald-200" : "text-rose-200"}`}>
          {toast.message}
        </div>
      ) : null}
    </div>
  );
}
