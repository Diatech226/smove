// file: app/admin/projects/page.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { projects as initialProjects, Project } from "@/lib/config/projects";

const emptyProject: Project = {
  slug: "",
  client: "",
  title: "",
  sector: "",
  summary: "",
  results: [],
};

export default function AdminProjectsPage() {
  const [projectList, setProjectList] = useState<Project[]>(initialProjects);
  const [editing, setEditing] = useState<Project>(initialProjects[0] ?? emptyProject);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isCreating = useMemo(
    () => !initialProjects.some((item) => item.slug === editing.slug),
    [editing.slug],
  );

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing.slug || !editing.title) {
      setStatusMessage("Merci de renseigner au minimum un slug et un titre.");
      return;
    }

    setProjectList((prev) => {
      const existingIndex = prev.findIndex((item) => item.slug === editing.slug);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = editing;
        return updated;
      }
      return [...prev, editing];
    });
    setStatusMessage(isCreating ? "Projet ajouté (non persistant)." : "Projet mis à jour (non persistant).");
  };

  const handleDelete = (slug: string) => {
    setProjectList((prev) => prev.filter((item) => item.slug !== slug));
    setStatusMessage("Projet supprimé (non persistant).");
    setEditing(emptyProject);
  };

  const resultsValue = editing.results?.join("\n") ?? "";

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Projets"
        subtitle="Gérez les études de cas et références clients. Les modifications sont locales à cette session."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              setEditing(emptyProject);
              setStatusMessage(null);
            }}
          >
            Ajouter un projet
          </Button>
        }
      />

      <p className="text-sm text-amber-200/80">
        Les modifications ne sont pas encore sauvegardées de manière permanente (prototype).
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">Liste des projets</h2>
          <div className="mt-4 space-y-3">
            {projectList.map((project) => (
              <div
                key={project.slug}
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
                      setEditing(project);
                      setStatusMessage(null);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-2 text-rose-200 hover:text-rose-100"
                    onClick={() => handleDelete(project.slug)}
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
                value={editing.slug}
                onChange={(event) => setEditing({ ...editing, slug: event.target.value })}
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
                value={editing.title}
                onChange={(event) => setEditing({ ...editing, title: event.target.value })}
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
                  value={editing.client}
                  onChange={(event) => setEditing({ ...editing, client: event.target.value })}
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
                  value={editing.sector}
                  onChange={(event) => setEditing({ ...editing, sector: event.target.value })}
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
                value={editing.summary}
                onChange={(event) => setEditing({ ...editing, summary: event.target.value })}
                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Décrivez brièvement le projet"
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
                  setEditing({ ...editing, results: event.target.value.split("\n").filter(Boolean) })
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
              <Button
                type="button"
                variant="secondary"
                className="justify-center"
                onClick={() => setEditing(emptyProject)}
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
