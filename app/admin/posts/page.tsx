// file: app/admin/posts/page.tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AdminPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  tags?: string[];
  publishedAt: string | Date;
};

const emptyForm: Pick<AdminPost, "slug" | "title" | "excerpt" | "body"> & {
  tags?: string[];
  publishedAt?: string;
} = {
  slug: "",
  title: "",
  excerpt: "",
  body: "",
  tags: [],
  publishedAt: new Date().toISOString().slice(0, 10),
};

export default function AdminPostsPage() {
  const [items, setItems] = useState<AdminPost[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCreating = useMemo(() => !editingId, [editingId]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/posts");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Impossible de charger les articles");
        }
        setItems(data.data ?? []);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Impossible de charger les articles. Réessayez plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setError(null);

    const { slug, title, excerpt, body, tags, publishedAt } = form;
    if (!slug || !title || !excerpt || !body || !publishedAt) {
      setStatusMessage("Merci de renseigner le slug, le titre, l'extrait, le contenu et la date de publication.");
      return;
    }

    try {
      const method = isCreating ? "POST" : "PUT";
      const url = isCreating ? "/api/admin/posts" : `/api/admin/posts/${editingId}`;
      const payload = {
        slug,
        title,
        excerpt,
        body,
        tags,
        publishedAt,
      };
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de l'enregistrement");
      }

      setStatusMessage(isCreating ? "Article ajouté." : "Article mis à jour.");
      if (isCreating && data.data) {
        setItems((prev) => [data.data, ...prev]);
      } else if (data.data) {
        setItems((prev) => prev.map((item) => (item.id === data.data.id ? data.data : item)));
      }
      resetForm();
    } catch (submitError) {
      console.error(submitError);
      setError("Impossible d'enregistrer cet article.");
    }
  };

  const handleDelete = async (id: string) => {
    setStatusMessage(null);
    setError(null);
    try {
      const response = await fetch(`/api/admin/posts/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage("Article supprimé.");
      resetForm();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Impossible de supprimer cet article.");
    }
  };

  const tagsValue = (form.tags ?? []).join(", ");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Articles"
        subtitle="Gérez les contenus du blog."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              resetForm();
              setStatusMessage(null);
            }}
          >
            Nouvel article
          </Button>
        }
      />

      {loading ? <p className="text-sm text-slate-200">Chargement des articles...</p> : null}
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">Liste des articles</h2>
          <div className="mt-4 space-y-3">
            {items.map((post) => (
              <div
                key={post.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{post.title}</p>
                  <p className="text-xs text-emerald-200/80">
                    {new Date(post.publishedAt).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{post.excerpt}</p>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-1 text-xs"
                    onClick={() => {
                      setEditingId(post.id);
                      setForm({
                        slug: post.slug,
                        title: post.title,
                        excerpt: post.excerpt,
                        body: post.body,
                        tags: post.tags ?? [],
                        publishedAt: new Date(post.publishedAt).toISOString().slice(0, 10),
                      });
                      setStatusMessage(null);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-2 text-rose-200 hover:text-rose-100"
                    onClick={() => handleDelete(post.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
            {!items.length && !loading ? (
              <p className="text-sm text-slate-300">Aucun article pour le moment.</p>
            ) : null}
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">{isCreating ? "Nouvel article" : "Modifier l'article"}</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                name="slug"
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="title">
                Titre
              </label>
              <input
                id="title"
                name="title"
                value={form.title}
                onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="excerpt">
                Extrait
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={3}
                value={form.excerpt}
                onChange={(event) => setForm((prev) => ({ ...prev, excerpt: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="body">
                Contenu
              </label>
              <textarea
                id="body"
                name="body"
                rows={6}
                value={form.body}
                onChange={(event) => setForm((prev) => ({ ...prev, body: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="tags">
                Tags (séparés par des virgules)
              </label>
              <input
                id="tags"
                name="tags"
                value={tagsValue}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tags: event.target.value.split(",").map((tag) => tag.trim()) }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="publishedAt">
                Date de publication
              </label>
              <input
                type="date"
                id="publishedAt"
                name="publishedAt"
                value={form.publishedAt}
                onChange={(event) => setForm((prev) => ({ ...prev, publishedAt: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-3">
              <Button type="submit">{isCreating ? "Créer" : "Mettre à jour"}</Button>
              {statusMessage ? <p className="text-sm text-emerald-200">{statusMessage}</p> : null}
            </div>
            {error ? <p className="text-sm text-rose-200">{error}</p> : null}
          </form>
        </Card>
      </div>
    </div>
  );
}
