"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

export type PostFormValues = {
  title: string;
  slug: string;
  category?: string | null;
  excerpt?: string | null;
  body?: string | null;
  published?: boolean;
};

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

type PostFormProps = {
  initialValues?: PostFormValues;
  postId?: string;
  mode: "create" | "edit";
};

export function PostForm({ initialValues, postId, mode }: PostFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<PostFormValues>(
    initialValues ?? { title: "", slug: "", category: "", excerpt: "", body: "", published: true },
  );
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (initialValues) {
      setForm((current) => ({ ...current, ...initialValues }));
    }
  }, [initialValues]);

  const isEditing = mode === "edit";

  const computedSlug = useMemo(() => {
    if (form.slug.trim()) return form.slug;
    return slugify(form.title);
  }, [form.slug, form.title]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const payload = {
      ...form,
      slug: computedSlug,
    };

    if (!payload.title.trim() || !payload.slug.trim() || !(payload.body ?? "").trim()) {
      setError("Le titre, le slug et le contenu sont obligatoires.");
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
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    title: event.target.value,
                    slug: prev.slug || slugify(event.target.value),
                  }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="Campagne social media pour les marques lifestyle"
              />
              <p className="text-xs text-slate-300">Le titre sera utilisé pour générer le slug et les balises SEO.</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                value={computedSlug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="campagne-social-media"
              />
              <p className="text-xs text-slate-300">Modifiez-le si nécessaire. Il doit être unique et descriptif.</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="category">
                Catégorie
              </label>
              <input
                id="category"
                name="category"
                value={form.category ?? ""}
                onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                placeholder="Stratégie, Design, Marketing digital..."
              />
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
