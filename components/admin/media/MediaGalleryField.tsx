"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/Button";
import type { MediaItem } from "@/lib/media/types";
import { getMediaVariantUrl } from "@/lib/media/utils";

import { MediaLibrary } from "./MediaLibrary";

type MediaGalleryFieldProps = {
  label: string;
  description?: string;
  items: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  folder?: string;
};

export function MediaGalleryField({ label, description, items, onChange, folder }: MediaGalleryFieldProps) {
  const [open, setOpen] = useState(false);
  const sortedItems = useMemo(() => items ?? [], [items]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <label className="text-sm font-semibold text-white">{label}</label>
          {description ? <p className="text-xs text-slate-300">{description}</p> : null}
        </div>
        <Button type="button" variant="secondary" className="px-3 py-1 text-xs" onClick={() => setOpen(true)}>
          Ajouter
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sortedItems.map((item) => {
          const preview = getMediaVariantUrl(item, "thumb");
          return (
            <div key={item.id} className="rounded-xl border border-white/10 bg-white/5 p-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-white/10">
                {preview ? <img src={preview} alt="Galerie" className="h-full w-full object-cover" /> : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                className="mt-2 w-full border border-white/10 px-3 py-1 text-xs text-rose-200"
                onClick={() => onChange(sortedItems.filter((media) => media.id !== item.id))}
              >
                Retirer
              </Button>
            </div>
          );
        })}
        {!sortedItems.length ? <p className="text-xs text-slate-400">Aucune image dans la galerie.</p> : null}
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-white/10 bg-slate-950 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Ajouter des images</h3>
              <Button variant="ghost" className="border border-white/10 px-3 py-1 text-xs" onClick={() => setOpen(false)}>
                Fermer
              </Button>
            </div>
            <MediaLibrary
              selectable
              onSelect={(media) => {
                onChange([...sortedItems, media]);
                setOpen(false);
              }}
              initialFolder={folder}
              typeFilter="image"
              showDelete={false}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
