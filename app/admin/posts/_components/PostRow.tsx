"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { Button } from "@/components/ui/Button";

import { DeletePostButton } from "./DeletePostButton";
import { StatusQuickActions } from "./StatusQuickActions";

type PostRowProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    tags: string[];
    categoryId?: string | null;
    status: "draft" | "published" | "archived" | "removed";
    publishedAt: string | Date | null;
    createdAt: string | Date;
    updatedAt: string | Date;
  };
  categoryLabel?: string;
};

const STATUS_LABELS: Record<PostRowProps["post"]["status"], string> = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
  removed: "Retiré",
};

const STATUS_STYLES: Record<PostRowProps["post"]["status"], string> = {
  draft: "bg-amber-500/10 text-amber-200",
  published: "bg-emerald-500/10 text-emerald-200",
  archived: "bg-indigo-500/10 text-indigo-200",
  removed: "bg-rose-500/10 text-rose-200",
};

function formatDate(value: string | Date) {
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function PostRow({ post, categoryLabel }: PostRowProps) {
  const [status, setStatus] = useState<PostRowProps["post"]["status"]>(post.status);
  const [publishedAt, setPublishedAt] = useState<string | Date | null>(post.publishedAt);

  const statusBadge = useMemo(() => {
    const label = STATUS_LABELS[status];
    return (
      <span className={`rounded-full px-2 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}>{label}</span>
    );
  }, [status]);
  const handleStatusChange = (nextStatus: PostRowProps["post"]["status"], nextPublishedAt: string | Date | null) => {
    setStatus(nextStatus);
    setPublishedAt(nextPublishedAt);
  };

  return (
    <tr className="hover:bg-white/5">
      <td className="px-3 py-3 text-white">{post.title}</td>
      <td className="px-3 py-3 text-emerald-200">{post.slug}</td>
      <td className="px-3 py-3">{categoryLabel ?? "—"}</td>
      <td className="px-3 py-3">{post.tags?.length ? post.tags.join(", ") : "—"}</td>
      <td className="px-3 py-3 font-semibold">{statusBadge}</td>
      <td className="px-3 py-3 text-slate-300">{publishedAt ? formatDate(publishedAt) : "—"}</td>
      <td className="px-3 py-3 text-slate-300">{formatDate(post.createdAt)}</td>
      <td className="px-3 py-3 text-slate-300">{formatDate(post.updatedAt)}</td>
      <td className="px-3 py-3">
        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <Button asChild variant="secondary" className="px-3 py-1 text-xs">
              <Link href={`/admin/posts/${post.id}`}>Modifier</Link>
            </Button>
            <DeletePostButton postId={post.id} />
          </div>
          <StatusQuickActions postId={post.id} status={status} publishedAt={publishedAt} onStatusChange={handleStatusChange} />
        </div>
      </td>
    </tr>
  );
}
