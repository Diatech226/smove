"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { MediaItem, MediaType } from "@/lib/media/types";
import { getMediaPosterUrl, getMediaVariantUrl } from "@/lib/media/utils";

import { MediaLibrary } from "./MediaLibrary";

type MediaPickerFieldProps = {
  label: string;
  description?: string;
  selected?: MediaItem | null;
  onChange: (media: MediaItem | null) => void;
  folder?: string;
  typeFilter?: "all" | MediaType;
};

export function MediaPickerField({ label, description, selected, onChange, folder, typeFilter = "all" }: MediaPickerFieldProps) {
  const [open, setOpen] = useState(false);
  const previewUrl = useMemo(() => {
    if (!selected) return null;
    if (selected.type === "video") return getMediaPosterUrl(selected);
    return getMediaVariantUrl(selected, "thumb");
  }, [selected]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="text-sm font-semibold text-white">{label}</label>
          {description ? <p className="text-xs text-slate-300">{description}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="secondary" className="px-3 py-1 text-xs" onClick={() => setOpen(true)}>
            Choisir
          </Button>
          {selected ? (
            <Button
              type="button"
              variant="ghost"
              className="border border-white/10 px-3 py-1 text-xs text-rose-200"
              onClick={() => onChange(null)}
            >
              Retirer
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="flex min-h-[120px] items-center justify-center border-dashed border-white/20 bg-slate-950/40 p-3">
        {selected && previewUrl ? (
          <div className="relative h-24 w-32 overflow-hidden rounded-lg border border-white/10">
            {selected.type === "image" ? (
              <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
            ) : (
              <video className="h-full w-full object-cover" src={selected.originalUrl} poster={previewUrl ?? undefined} muted />
            )}
          </div>
        ) : (
          <p className="text-xs text-slate-400">Aucun média sélectionné.</p>
        )}
      </Card>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Bibliothèque média</h3>
              <Button variant="ghost" className="border border-white/10 px-3 py-1 text-xs" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </div>
            <MediaLibrary
              selectable
              onSelect={(media) => {
                onChange(media);
                setOpen(false);
              }}
              initialFolder={folder}
              typeFilter={typeFilter}
              showDelete={false}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
