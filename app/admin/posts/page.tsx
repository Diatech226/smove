// file: app/admin/posts/page.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { posts as initialPosts, Post } from "@/lib/config/posts";

const emptyPost: Post = {
  slug: "",
  title: "",
  date: new Date().toISOString().slice(0, 10),
  excerpt: "",
  tags: [],
  content: "",
};

export default function AdminPostsPage() {
  const [postList, setPostList] = useState<Post[]>(initialPosts);
  const [editing, setEditing] = useState<Post>(initialPosts[0] ?? emptyPost);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isCreating = useMemo(() => !initialPosts.some((item) => item.slug === editing.slug), [editing.slug]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing.slug || !editing.title) {
      setStatusMessage("Merci de renseigner au minimum un slug et un titre.");
      return;
    }

    setPostList((prev) => {
      const existingIndex = prev.findIndex((item) => item.slug === editing.slug);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = editing;
        return updated;
      }
      return [...prev, editing];
    });
    setStatusMessage(isCreating ? "Article ajouté (non persistant)." : "Article mis à jour (non persistant).");
  };

  const handleDelete = (slug: string) => {
    setPostList((prev) => prev.filter((item) => item.slug !== slug));
    setStatusMessage("Article supprimé (non persistant).");
    setEditing(emptyPost);
  };

  const tagsValue = editing.tags?.join(", ") ?? "";

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Articles"
        subtitle="Gérez les contenus du blog. Les modifications sont locales à cette session."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              setEditing(emptyPost);
              setStatusMessage(null);
            }}
          >
            Ajouter un article
          </Button>
        }
      />

      <p className="text-sm text-amber-200/80">
        Les modifications ne sont pas encore sauvegardées de manière permanente (prototype).
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">Liste des articles</h2>
          <div className="mt-4 space-y-3">
            {postList.map((post) => (
              <div
                key={post.slug}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{post.title}</p>
                  <p className="text-xs text-emerald-200/80">
                    {new Date(post.date).toLocaleDateString("fr-FR", {
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
                    className="border border-white/10 px-3 py-2"
                    onClick={() => {
                      setEditing(post);
                      setStatusMessage(null);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-2 text-rose-200 hover:text-rose-100"
                    onClick={() => handleDelete(post.slug)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">
            {isCreating ? "Nouvel article" : "Modifier l'article"}
          </h2>
          <p className="text-sm text-slate-300">Complétez les informations ci-dessous.</p>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="slug">
                Slug
              </label>
              <input
                id="slug"
                type="text"
                value={editing.slug}
                onChange={(event) => setEditing({ ...editing, slug: event.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="tendances-social-media-2024"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="title">
                Titre
              </label>
              <input
                id="title"
                type="text"
                value={editing.title}
                onChange={(event) => setEditing({ ...editing, title: event.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Tendances social media 2024"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white" htmlFor="date">
                  Date
                </label>
                <input
                  id="date"
                  type="date"
                  value={editing.date}
                  onChange={(event) => setEditing({ ...editing, date: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white" htmlFor="tags">
                  Tags (séparés par des virgules)
                </label>
                <input
                  id="tags"
                  type="text"
                  value={tagsValue}
                  onChange={(event) =>
                    setEditing({ ...editing, tags: event.target.value.split(",").map((tag) => tag.trim()).filter(Boolean) })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                  placeholder="social media, tendances"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="excerpt">
                Extrait
              </label>
              <textarea
                id="excerpt"
                value={editing.excerpt}
                onChange={(event) => setEditing({ ...editing, excerpt: event.target.value })}
                className="min-h-[100px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Résumé court de l'article"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="content">
                Contenu
              </label>
              <textarea
                id="content"
                value={editing.content ?? ""}
                onChange={(event) => setEditing({ ...editing, content: event.target.value })}
                className="min-h-[140px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Contenu principal (optionnel)"
              />
            </div>
            {statusMessage ? <p className="text-sm text-emerald-200">{statusMessage}</p> : null}
            <div className="flex gap-3">
              <Button type="submit" className="justify-center">
                {isCreating ? "Ajouter" : "Enregistrer"}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="justify-center"
                onClick={() => setEditing(emptyPost)}
              >
                Réinitialiser
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
