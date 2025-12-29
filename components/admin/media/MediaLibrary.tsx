"use client";

import { useCallback, useMemo, useState } from "react";
import useSWR from "swr";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { MediaItem, MediaType } from "@/lib/media/types";
import { getMediaPosterUrl, getMediaVariantUrl } from "@/lib/media/utils";
import { cn } from "@/lib/utils";

type MediaLibraryProps = {
  selectable?: boolean;
  onSelect?: (media: MediaItem) => void;
  initialFolder?: string;
  typeFilter?: "all" | MediaType;
  showDelete?: boolean;
};

const fetcher = async (url: string) => {
  const response = await fetch(url);
  const json = await response.json();
  if (!response.ok || json?.ok === false) {
    throw new Error(json?.error || "Impossible de charger la médiathèque.");
  }
  return json?.data ?? json;
};

export function MediaLibrary({ selectable, onSelect, initialFolder, typeFilter = "all", showDelete = true }: MediaLibraryProps) {
  const [folder, setFolder] = useState(initialFolder ?? "");
  const [search, setSearch] = useState("");
  const [type, setType] = useState<"all" | MediaType>(typeFilter);
  const [page, setPage] = useState(1);
  const [limit] = useState(24);
  const [uploading, setUploading] = useState(false);
  const [posterFile, setPosterFile] = useState<File | null>(null);
  const canChangeType = typeFilter === "all";

  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (type !== "all") params.set("type", type);
    if (folder.trim()) params.set("folder", folder.trim());
    if (search.trim()) params.set("search", search.trim());
    params.set("page", String(page));
    params.set("limit", String(limit));
    return `/api/admin/media?${params.toString()}`;
  }, [type, folder, search, page, limit]);

  const { data, error, isLoading, mutate } = useSWR(query, fetcher);
  const items: MediaItem[] = Array.isArray(data?.media) ? data.media : [];
  const totalPages = Number(data?.totalPages) || 1;

  const handleUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || !files.length) return;
      const formData = new FormData();
      Array.from(files).forEach((file) => formData.append("files", file));
      if (folder.trim()) formData.set("folder", folder.trim());
      if (posterFile && files.length === 1 && files[0].type === "video/mp4") {
        formData.set("poster", posterFile);
      }
      setUploading(true);
      try {
        const response = await fetch("/api/admin/media", {
          method: "POST",
          body: formData,
        });
        const json = await response.json();
        if (!response.ok || json?.ok === false) {
          throw new Error(json?.error || "Upload impossible.");
        }
        setPosterFile(null);
        await mutate();
      } catch (uploadError) {
        console.error(uploadError);
      } finally {
        setUploading(false);
      }
    },
    [folder, mutate, posterFile],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      void handleUpload(event.dataTransfer.files);
    },
    [handleUpload],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!showDelete) return;
      const response = await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
      const json = await response.json();
      if (!response.ok || json?.ok === false) {
        console.error(json?.error || "Suppression impossible.");
        return;
      }
      await mutate();
    },
    [mutate, showDelete],
  );

  return (
    <Card className="border-white/10 bg-white/5 p-5 shadow-lg shadow-emerald-500/10">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">Médiathèque</h2>
          <p className="text-sm text-slate-300">Glissez-déposez pour ajouter des fichiers.</p>
        </div>
        <label className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:border-emerald-400/40">
          <input
            type="file"
            className="hidden"
            accept="image/jpeg,image/png,image/webp,video/mp4"
            multiple
            onChange={(event) => handleUpload(event.target.files)}
          />
          {uploading ? "Upload..." : "Ajouter des médias"}
        </label>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="media-search">
            Recherche
          </label>
          <input
            id="media-search"
            value={search}
            onChange={(event) => {
              setPage(1);
              setSearch(event.target.value);
            }}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            placeholder="Nom, dossier..."
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="media-folder">
            Dossier
          </label>
          <input
            id="media-folder"
            value={folder}
            onChange={(event) => {
              setPage(1);
              setFolder(event.target.value);
            }}
            className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            placeholder="services, blog..."
          />
        </div>
        {canChangeType ? (
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400" htmlFor="media-type">
              Type
            </label>
            <select
              id="media-type"
              value={type}
              onChange={(event) => {
                setPage(1);
                setType(event.target.value as "all" | MediaType);
              }}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="all">Tous</option>
              <option value="image">Images</option>
              <option value="video">Vidéos</option>
            </select>
          </div>
        ) : (
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">Type</label>
            <div className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white">
              {type === "video" ? "Vidéos" : "Images"}
            </div>
          </div>
        )}
      </div>

      <div
        className={cn(
          "mt-4 rounded-xl border border-dashed border-white/20 bg-slate-950/40 p-4 text-center text-xs text-slate-400",
          uploading && "opacity-60",
        )}
        onDrop={handleDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        Déposez vos fichiers ici pour les uploader. Formats acceptés : jpg, png, webp, mp4.
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
          <label className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white">
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setPosterFile(event.target.files?.[0] ?? null)}
            />
            Poster vidéo (optionnel)
          </label>
          {posterFile ? <span className="text-xs text-emerald-200">{posterFile.name}</span> : null}
        </div>
      </div>

      {isLoading ? <p className="mt-4 text-sm text-slate-200">Chargement...</p> : null}
      {error ? <p className="mt-4 text-sm text-rose-200">{error.message}</p> : null}

      <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((media) => {
          const preview = media.type === "image" ? getMediaVariantUrl(media, "thumb") : getMediaPosterUrl(media);
          return (
            <div key={media.id} className="rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/5 bg-slate-950/40">
                {media.type === "image" && preview ? (
                  <img src={preview} alt="Aperçu" className="h-full w-full object-cover" />
                ) : null}
                {media.type === "video" ? (
                  <video
                    className="h-full w-full object-cover"
                    src={media.originalUrl}
                    poster={preview ?? undefined}
                    muted
                    playsInline
                  />
                ) : null}
              </div>
              <div className="mt-3 space-y-2 text-xs text-slate-300">
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full bg-white/10 px-2 py-1 uppercase text-[10px]">
                    {media.type}
                  </span>
                  <span>{media.folder || "Sans dossier"}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectable && onSelect ? (
                    <Button
                      variant="secondary"
                      className="px-3 py-1 text-xs"
                      onClick={() => onSelect(media)}
                    >
                      Sélectionner
                    </Button>
                  ) : null}
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-1 text-xs"
                    onClick={async () => {
                      try {
                        await navigator.clipboard.writeText(media.originalUrl);
                      } catch (clipboardError) {
                        console.error(clipboardError);
                      }
                    }}
                  >
                    Copier lien
                  </Button>
                  {showDelete ? (
                    <Button
                      variant="ghost"
                      className="border border-white/10 px-3 py-1 text-xs text-rose-200"
                      onClick={() => handleDelete(media.id)}
                    >
                      Supprimer
                    </Button>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
        {!items.length && !isLoading ? (
          <p className="text-sm text-slate-300">Aucun média trouvé pour ces filtres.</p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
        <p>
          Page {page} / {totalPages}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="secondary" className="px-3 py-1 text-xs" disabled={page <= 1} onClick={() => setPage(page - 1)}>
            Précédent
          </Button>
          <Button
            variant="secondary"
            className="px-3 py-1 text-xs"
            disabled={page >= totalPages}
            onClick={() => setPage(page + 1)}
          >
            Suivant
          </Button>
        </div>
      </div>
    </Card>
  );
}
