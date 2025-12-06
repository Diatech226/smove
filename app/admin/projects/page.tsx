// file: app/admin/projects/page.tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Project } from "@prisma/client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const emptyForm: Pick<Project, "slug" | "title" | "client" | "sector" | "summary"> & {
  body?: string;
  results?: string[];
} = {
  slug: "",
  title: "",
  client: "",
  sector: "",
  summary: "",
  body: "",
  results: [],
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<Project[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCreating = useMemo(() => !editingId, [editingId]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/projects");
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Impossible de charger les projets");
        }
        setItems(data.data ?? []);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Impossible de charger les projets. Réessayez plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setError(null);

    const { slug, title, client, sector, summary, body, results } = form;
    if (!slug || !title || !client || !sector || !summary) {
      setStatusMessage("Merci de renseigner le slug, le titre, le client, le secteur et le résumé.");
      return;
    }

    try {
      const method = isCreating ? "POST" : "PUT";
      const url = isCreating ? "/api/admin/projects" : `/api/admin/projects/${editingId}`;
      const payload = {
        slug,
        title,
        client,
        sector,
        summary,
        body,
        results,
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

      setStatusMessage(isCreating ? "Projet ajouté." : "Projet mis à jour.");
      if (isCreating && data.data) {
        setItems((prev) => [data.data, ...prev]);
      } else if (data.data) {
        setItems((prev) => prev.map((item) => (item.id === data.data.id ? data.data : item)));
      }
      resetForm();
    } catch (submitError) {
      console.error(submitError);
      setError("Impossible d'enregistrer ce projet.");
    }
  };

  const handleDelete = async (id: string) => {
    setStatusMessage(null);
    setError(null);
    try {
      const response = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Erreur lors de la suppression");
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage("Projet supprimé.");
      resetForm();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Impossible de supprimer ce projet.");
    }
  };

  const resultsValue = (form.results ?? []).join("\n");

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Projets"
        subtitle="Gérez les études de cas et références clients."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              resetForm();
              setStatusMessage(null);
            }}
          >
            Ajouter un projet
          </Button>
        }
      />

      {loading ? <p className="text-sm text-slate-200">Chargement des projets...</p> : null}
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">Liste des projets</h2>
          <div className="mt-4 space-y-3">
            {items.map((project) => (
              <div
                key={project.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{project.title}</p>
                  <p className="text-xs uppercase tracking-wide text-emerald-200/80">
                    {project.client} · {project.sector}
                  </p>
                  <p className="mt-2 text-sm text-slate-300">{project.summary}</p>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-2"
                    onClick={() => {
                      setEditingId(project.id);
                      setForm({
                        slug: project.slug,
                        title: project.title,
                        client: project.client,
                        sector: project.sector,
                        summary: project.summary,
                        body: project.body ?? "",
                        results: project.results ?? [],
                      });
                      setStatusMessage(null);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-2 text-rose-200 hover:text-rose-100"
                    onClick={() => handleDelete(project.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
            {!items.length && !loading ? (
              <p className="text-sm text-slate-300">Aucun projet pour le moment.</p>
            ) : null}
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">
            {isCreating ? "Nouveau projet" : "Modifier le projet"}
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
                value={form.slug}
                onChange={(event) => setForm({ ...form, slug: event.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="lancement-application-mobilite"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="title">
                Titre
              </label>
              <input
                id="title"
                type="text"
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Lancement d'une application de mobilité urbaine"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white" htmlFor="client">
                  Client
                </label>
                <input
                  id="client"
                  type="text"
                  value={form.client}
                  onChange={(event) => setForm({ ...form, client: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                  placeholder="MoveCity"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-white" htmlFor="sector">
                  Secteur
                </label>
                <input
                  id="sector"
                  type="text"
                  value={form.sector}
                  onChange={(event) => setForm({ ...form, sector: event.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                  placeholder="Tech & mobilité"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="summary">
                Résumé
              </label>
              <textarea
                id="summary"
                value={form.summary}
                onChange={(event) => setForm({ ...form, summary: event.target.value })}
                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Décrivez brièvement le projet"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="body">
                Corps (optionnel)
              </label>
              <textarea
                id="body"
                value={form.body ?? ""}
                onChange={(event) => setForm({ ...form, body: event.target.value })}
                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Détails supplémentaires du projet"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="results">
                Résultats (une ligne par élément)
              </label>
              <textarea
                id="results"
                value={resultsValue}
                onChange={(event) =>
                  setForm({
                    ...form,
                    results: event.target.value.split("\n").filter(Boolean),
                  })
                }
                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder={"+35% d'inscriptions\nCampagne vidéo vue 250K fois"}
              />
            </div>
            {statusMessage ? <p className="text-sm text-emerald-200">{statusMessage}</p> : null}
            <div className="flex gap-3">
              <Button type="submit" className="justify-center">
                {isCreating ? "Ajouter" : "Enregistrer"}
              </Button>
              <Button type="button" variant="secondary" className="justify-center" onClick={resetForm}>
                Réinitialiser
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
