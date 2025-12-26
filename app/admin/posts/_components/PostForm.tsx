"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn, slugify } from "@/lib/utils";

export type PostFormValues = {
  title: string;
  slug: string;
  categorySlug?: string | null;
  excerpt?: string | null;
  body?: string | null;
  coverImage?: string | null;
  gallery?: string[];
  videoUrl?: string | null;
  published?: boolean;
  tags?: string[];
};

type PostFormProps = {
  initialValues?: PostFormValues;
  postId?: string;
  mode: "create" | "edit";
  categories?: { slug: string; label: string }[];
};

export function PostForm({ initialValues, postId, mode, categories = [] }: PostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PostFormValues>(
    initialValues ?? {
      title: "",
      slug: "",
      categorySlug: "",
      excerpt: "",
      body: "",
      published: false,
      coverImage: "",
      gallery: [],
      videoUrl: "",
      tags: [],
    },
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [slugLocked, setSlugLocked] = useState<boolean>(Boolean(initialValues?.slug));
  const [slugInput, setSlugInput] = useState<string>(initialValues?.slug ?? "");
  const [slugStatus, setSlugStatus] = useState<{ state: "idle" | "checking" | "available" | "unavailable" | "error"; message?: string }>(
    { state: "idle" },
  );

  useEffect(() => {
    if (initialValues) {
      setForm((current) => ({ ...current, ...initialValues }));
      setSlugLocked(Boolean(initialValues.slug));
      setSlugInput(initialValues.slug);
    }
  }, [initialValues]);

  const isEditing = mode === "edit";

  const computedSlug = useMemo(() => {
    const baseSlug = slugLocked ? slugInput : slugify(form.title);
    return baseSlug.trim();
  }, [form.title, slugInput, slugLocked]);

  useEffect(() => {
    const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

    if (!computedSlug) {
      setSlugStatus({ state: "idle" });
      return undefined;
    }

    if (!slugPattern.test(computedSlug)) {
      setSlugStatus({ state: "error", message: "Le slug doit utiliser des minuscules et des tirets." });
      return undefined;
    }

    setSlugStatus({ state: "checking" });
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const response = await fetch(`/api/admin/slug?type=post&slug=${encodeURIComponent(computedSlug)}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok || data?.success === false) {
          setSlugStatus({ state: "error", message: data?.error || "Impossible de vérifier le slug." });
          return;
        }
        setSlugStatus({ state: data.available ? "available" : "unavailable" });
      } catch (err: any) {
        if (err?.name === "AbortError") return;
        setSlugStatus({ state: "error", message: "Impossible de vérifier le slug." });
      }
    }, 350);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [computedSlug]);

  const gallery = useMemo(() => form.gallery ?? [], [form.gallery]);
  const tags = useMemo(() => form.tags ?? [], [form.tags]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      ...form,
      slug: computedSlug,
      gallery: gallery.filter((item) => item.trim()),
      tags: tags.map((tag) => tag.trim()).filter(Boolean),
    };

    if (!payload.title.trim() || !payload.slug.trim() || !(payload.body ?? "").trim()) {
      setError("Le titre, le slug et le contenu sont obligatoires.");
      return;
    }

    if (slugStatus.state === "unavailable") {
      setError("Ce slug est déjà utilisé. Merci d'en choisir un autre.");
      return;
    }

    try {
      const response = await fetch(isEditing ? `/api/admin/posts/${postId}` : "/api/admin/posts", {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || data?.success === false) {
        const message = data?.error || data?.message || "Impossible d'enregistrer cet article.";
        setError(message);
        return;
      }

      setSuccess(isEditing ? "Article mis à jour." : "Article créé.");
      startTransition(() => {
        router.push("/admin/posts");
        router.refresh();
      });
    } catch (submissionError) {
      console.error(submissionError);
      setError("Une erreur est survenue. Merci de réessayer.");
    }
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title={isEditing ? "Modifier l'article" : "Nouvel article"}
        subtitle={
          isEditing
            ? "Ajustez le contenu, la catégorisation et la publication de l'article."
            : "Rédigez un nouvel insight pour alimenter le blog SMOVE."
        }
      />

      <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="title">
                Titre
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={(event) => {
                  const nextTitle = event.target.value;
                  setForm((prev) => ({
                    ...prev,
                    title: nextTitle,
                  }));
                  if (!slugLocked) {
                    setSlugInput(slugify(nextTitle));
                  }
                }}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="Campagne social media pour les marques lifestyle"
              />
              <p className="text-xs text-slate-300">Le titre sera utilisé pour générer le slug et les balises SEO.</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-white" htmlFor="slug">
                  Slug
                </label>
                <Button
                  type="button"
                  variant="ghost"
                  className="border border-white/10 px-3 py-1 text-[11px]"
                  onClick={() => setSlugLocked((locked) => !locked)}
                >
                  {slugLocked ? "Déverrouiller" : "Verrouiller"}
                </Button>
              </div>
              <input
                id="slug"
                name="slug"
                value={computedSlug}
                onChange={(event) => {
                  setSlugLocked(true);
                  setSlugInput(event.target.value);
                }}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="campagne-social-media"
              />
              <p className="text-xs text-slate-300">
                Modifiez-le si nécessaire. Il doit être unique et descriptif. Le slug est {slugLocked ? "figé" : "mis à jour automatiquement"}.
              </p>
              {slugStatus.state === "checking" ? <p className="text-xs text-amber-200">Vérification du slug...</p> : null}
              {slugStatus.state === "available" ? <p className="text-xs text-emerald-200">Ce slug est disponible.</p> : null}
              {slugStatus.state === "unavailable" ? <p className="text-xs text-rose-200">Ce slug est déjà utilisé.</p> : null}
              {slugStatus.state === "error" && slugStatus.message ? (
                <p className="text-xs text-rose-200">{slugStatus.message}</p>
              ) : null}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="tags">
                Catégories / Tags
              </label>
              <div className="space-y-3">
                <select
                  id="categorySlug"
                  name="categorySlug"
                  value={form.categorySlug ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, categorySlug: event.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="">Sélectionnez une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.slug} value={category.slug}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <input
                  id="tags"
                  name="tags"
                  value={tags.join(", ")}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, tags: event.target.value.split(",").map((tag) => tag.trim()) }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                  placeholder="Stratégie, Design, Marketing digital..."
                />
              </div>
              <p className="text-xs text-slate-300">
                Choisissez une rubrique principale et ajoutez des tags séparés par des virgules.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="published">
                Statut de publication
              </label>
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-slate-900 px-4 py-3">
                <input
                  id="published"
                  name="published"
                  type="checkbox"
                  checked={form.published ?? false}
                  onChange={(event) => setForm((prev) => ({ ...prev, published: event.target.checked }))}
                  className="h-4 w-4 rounded border-white/20 text-emerald-400 focus:ring-emerald-400"
                />
                <label className="text-sm text-slate-200" htmlFor="published">
                  Rendre l'article visible sur le blog public
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="excerpt">
              Extrait
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              value={form.excerpt ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              placeholder="Résumé court qui apparaîtra dans les listes d'articles."
            />
            <p className="text-xs text-slate-300">Idéalement entre 140 et 200 caractères.</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="coverImage">
                Image de couverture
              </label>
              <input
                id="coverImage"
                name="coverImage"
                value={form.coverImage ?? ""}
                onChange={(event) => setForm((prev) => ({ ...prev, coverImage: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="https://..."
              />
              <p className="text-xs text-slate-300">Grande image utilisée sur la page article et les cartes.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="videoUrl">
                Vidéo (YouTube, Vimeo ou MP4)
              </label>
              <input
                id="videoUrl"
                name="videoUrl"
                value={form.videoUrl ?? ""}
                onChange={(event) => setForm((prev) => ({ ...prev, videoUrl: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="https://www.youtube.com/embed/..."
              />
              <p className="text-xs text-slate-300">Affichée sous le header si renseignée.</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-white">Galerie d'images</p>
                <p className="text-xs text-slate-300">Ajoutez plusieurs visuels pour enrichir l'article.</p>
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setForm((prev) => ({ ...prev, gallery: [...gallery, ""] }))}
                className="text-xs"
              >
                Ajouter une image
              </Button>
            </div>

            <div className="space-y-2">
              {gallery.map((image, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    value={image}
                    onChange={(event) => {
                      const next = [...gallery];
                      next[index] = event.target.value;
                      setForm((prev) => ({ ...prev, gallery: next }));
                    }}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                    placeholder="https://..."
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      const next = gallery.filter((_, i) => i !== index);
                      setForm((prev) => ({ ...prev, gallery: next }));
                    }}
                    className="border border-white/10 px-3 py-2 text-xs text-rose-200 hover:text-rose-100"
                  >
                    Retirer
                  </Button>
                </div>
              ))}
              {!gallery.length ? <p className="text-sm text-slate-300">Aucune image dans la galerie.</p> : null}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-white" htmlFor="body">
              Contenu
            </label>
            <textarea
              id="body"
              name="body"
              rows={10}
              value={form.body ?? ""}
              onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              placeholder="Rédigez votre article. Vous pouvez utiliser des paragraphes séparés par des sauts de ligne."
            />
          </div>

          {error ? <p className="text-sm text-rose-200">{error}</p> : null}
          {success ? <p className="text-sm text-emerald-200">{success}</p> : null}

          <div className={cn("flex flex-wrap items-center gap-3", isPending && "opacity-80")}>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => router.push("/admin/posts")}
              className="border border-white/10 px-4 py-2 text-slate-200"
            >
              Annuler
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
