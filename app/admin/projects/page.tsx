// file: app/admin/projects/page.tsx
"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { slugify } from "@/lib/utils";
import type { MediaItem } from "@/lib/media/types";
import { ContentStatusQuickActions, type ContentStatus } from "@/components/admin/ContentStatusQuickActions";
import { MediaPickerField } from "@/components/admin/media/MediaPickerField";

type AdminProject = {
  id: string;
  slug: string;
  title: string;
  client: string;
  sector: string;
  sectorSlug?: string | null;
  summary: string | null;
  body?: string;
  results?: string[];
  category?: string | null;
  categorySlug?: string | null;
  coverMediaId: string;
  cover?: MediaItem | null;
  status?: ContentStatus | null;
};

type ProjectFormValues = {
  slug: string;
  title: string;
  client: string;
  sector: string;
  summary: string;
  body?: string;
  results?: string[];
  category?: string;
  categorySlug?: string;
  sectorSlug?: string;
  coverMediaId?: string;
  status?: ContentStatus;
};

const emptyForm: ProjectFormValues = {
  slug: "",
  title: "",
  client: "",
  sector: "",
  summary: "",
  body: "",
  results: [],
  category: "",
  categorySlug: "",
  sectorSlug: "",
  coverMediaId: "",
  status: "draft",
};

type TaxonomyOption = {
  id: string;
  slug: string;
  label: string;
};

const STATUS_LABELS: Record<ContentStatus, string> = {
  draft: "Brouillon",
  published: "Publié",
  archived: "Archivé",
};

const STATUS_STYLES: Record<ContentStatus, string> = {
  draft: "bg-white/10 text-slate-200",
  published: "bg-emerald-500/20 text-emerald-100",
  archived: "bg-amber-500/20 text-amber-100",
};

export default function AdminProjectsPage() {
  const [items, setItems] = useState<AdminProject[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [coverMedia, setCoverMedia] = useState<MediaItem | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [categoryOptions, setCategoryOptions] = useState<TaxonomyOption[]>([]);
  const [sectorOptions, setSectorOptions] = useState<TaxonomyOption[]>([]);

  const isCreating = useMemo(() => !editingId, [editingId]);
  const computedSlug = useMemo(() => (form.slug.trim() ? form.slug : slugify(form.title)), [form.slug, form.title]);
  const categoryLabelMap = useMemo(
    () => new Map(categoryOptions.map((option) => [option.slug, option.label])),
    [categoryOptions],
  );
  const sectorLabelMap = useMemo(
    () => new Map(sectorOptions.map((option) => [option.slug, option.label])),
    [sectorOptions],
  );

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/projects?page=${page}&limit=${limit}`);
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        const errorMessage = data?.error || data?.message || "Impossible de charger les projets";
        setError(errorMessage);
        setItems([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }
      setError(null);
      const payload = data?.data ?? {};
      setItems(Array.isArray(payload.projects) ? payload.projects : []);
      const nextTotalPages = Number(payload.totalPages) || 1;
      setTotalPages(nextTotalPages);
      setTotal(Number(payload.total) || 0);
      if (page > nextTotalPages) {
        setPage(nextTotalPages);
      }
    } catch (fetchError) {
      console.error(fetchError);
      setError("Impossible de charger les projets. Réessayez plus tard.");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    const fetchTaxonomies = async () => {
      try {
        const [categoryRes, sectorRes] = await Promise.all([
          fetch("/api/admin/taxonomies?type=project_category"),
          fetch("/api/admin/taxonomies?type=project_sector"),
        ]);
        const [categoryJson, sectorJson] = await Promise.all([categoryRes.json(), sectorRes.json()]);
        if (categoryRes.ok) {
          setCategoryOptions(Array.isArray(categoryJson?.data?.taxonomies) ? categoryJson.data.taxonomies : []);
        }
        if (sectorRes.ok) {
          setSectorOptions(Array.isArray(sectorJson?.data?.taxonomies) ? sectorJson.data.taxonomies : []);
        }
      } catch (fetchError) {
        console.error(fetchError);
      }
    };

    fetchTaxonomies();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setDetailLoading(false);
    setCoverMedia(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setError(null);

    const { title, client, sector, sectorSlug, summary, body, results, category, categorySlug, coverMediaId, status } = form;
    if (!computedSlug || !title || !client || !sector || !summary || !coverMediaId) {
      setStatusMessage("Merci de renseigner le slug, le titre, le client, le secteur, le résumé et la couverture.");
      return;
    }

    try {
      const method = isCreating ? "POST" : "PUT";
      const url = isCreating ? "/api/admin/projects" : `/api/admin/projects/${editingId}`;
      const resolvedCategoryLabel = categorySlug ? categoryLabelMap.get(categorySlug) ?? "" : category ?? "";
      const resolvedSectorLabel = sectorSlug ? sectorLabelMap.get(sectorSlug) ?? sector : sector;
      const payload = {
        slug: computedSlug,
        title,
        client,
        sector: resolvedSectorLabel,
        sectorSlug: sectorSlug || null,
        summary,
        body,
        results,
        category: resolvedCategoryLabel || null,
        categorySlug: categorySlug || null,
        coverMediaId,
        status: status ?? "draft",
      };
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        const errorMessage = data?.error || data?.message || "Erreur lors de l'enregistrement";
        setError(errorMessage);
        return;
      }

      setStatusMessage(isCreating ? "Projet ajouté." : "Projet mis à jour.");
      resetForm();
      await fetchProjects();
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
      if (!response.ok || data?.ok === false) {
        const errorMessage = data?.error || data?.message || "Erreur lors de la suppression";
        setError(errorMessage);
        return;
      }
      setStatusMessage("Projet supprimé.");
      resetForm();
      await fetchProjects();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Impossible de supprimer ce projet.");
    }
  };

  const resultsValue = (form.results ?? []).join("\n");

  const handleEdit = async (id: string) => {
    setStatusMessage(null);
    setError(null);
    setEditingId(id);
    setDetailLoading(true);
    try {
      const response = await fetch(`/api/admin/projects/${id}`);
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        setError(data?.error || "Impossible de charger ce projet.");
        setEditingId(null);
        return;
      }
      const project = data?.data?.project as AdminProject;
      setEditingId(project.id);
      setForm({
        slug: project.slug,
        title: project.title,
        client: project.client,
        sector: project.sector,
        sectorSlug: project.sectorSlug ?? "",
        summary: project.summary ?? "",
        body: project.body ?? "",
        results: project.results ?? [],
        category: project.category ?? "",
        categorySlug: project.categorySlug ?? "",
        coverMediaId: project.coverMediaId ?? "",
        status: (project.status ?? "published") as ContentStatus,
      });
      setCoverMedia(project.cover ?? null);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Impossible de charger ce projet.");
      setEditingId(null);
    } finally {
      setDetailLoading(false);
    }
  };

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
            Nouveau projet
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
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-white">{project.title}</p>
                    <span
                      className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                        STATUS_STYLES[(project.status ?? "published") as ContentStatus]
                      }`}
                    >
                      {STATUS_LABELS[(project.status ?? "published") as ContentStatus]}
                    </span>
                  </div>
                  <p className="text-xs uppercase tracking-wide text-emerald-200/80">
                    {project.client} · {sectorLabelMap.get(project.sectorSlug ?? "") ?? project.sector}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                    {project.category || project.categorySlug ? (
                      <span>
                        Catégorie:{" "}
                        {project.category ?? (project.categorySlug ? categoryLabelMap.get(project.categorySlug) : null) ?? "—"}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-sm text-slate-300">{project.summary ?? "—"}</p>
                  <ContentStatusQuickActions
                    endpoint={`/api/admin/projects/${project.id}`}
                    status={(project.status ?? "published") as ContentStatus}
                    onStatusChange={(nextStatus) =>
                      setItems((prev) =>
                        prev.map((item) => (item.id === project.id ? { ...item, status: nextStatus } : item)),
                      )
                    }
                  />
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-1 text-xs"
                    onClick={() => handleEdit(project.id)}
                    disabled={detailLoading && editingId === project.id}
                  >
                    {detailLoading && editingId === project.id ? "Chargement..." : "Modifier"}
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
            {!items.length && !loading ? <p className="text-sm text-slate-300">Aucun projet pour le moment.</p> : null}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
            <p>
              {total} projet(s) • page {page} / {totalPages}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <label className="text-xs text-slate-400" htmlFor="projects-per-page">
                Par page
              </label>
              <select
                id="projects-per-page"
                value={limit}
                onChange={(event) => {
                  setPage(1);
                  setLimit(Number(event.target.value));
                }}
                className="rounded-lg border border-white/10 bg-slate-900 px-2 py-1 text-xs text-white focus:border-emerald-400 focus:outline-none"
              >
                {[6, 12, 24, 36].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
              <Button
                variant="secondary"
                className="px-3 py-1 text-xs"
                disabled={page <= 1}
                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              >
                Précédent
              </Button>
              <Button
                variant="secondary"
                className="px-3 py-1 text-xs"
                disabled={page >= totalPages}
                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              >
                Suivant
              </Button>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">{isCreating ? "Nouveau projet" : "Modifier le projet"}</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
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
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value, slug: prev.slug || slugify(event.target.value) }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="client">
                Client
              </label>
              <input
                id="client"
                name="client"
                value={form.client}
                onChange={(event) => setForm((prev) => ({ ...prev, client: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white" htmlFor="sector">
                  Secteur
                </label>
                {sectorOptions.length ? (
                  <select
                    id="sector"
                    name="sector"
                    value={form.sectorSlug ?? ""}
                    onChange={(event) => {
                      const nextSlug = event.target.value;
                      const nextLabel = sectorLabelMap.get(nextSlug) ?? "";
                      setForm((prev) => ({
                        ...prev,
                        sectorSlug: nextSlug,
                        sector: nextLabel || prev.sector,
                      }));
                    }}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                  >
                    <option value="">Sélectionner un secteur</option>
                    {form.sectorSlug && !sectorOptions.find((option) => option.slug === form.sectorSlug) ? (
                      <option value={form.sectorSlug}>{form.sector}</option>
                    ) : null}
                    {sectorOptions.map((option) => (
                      <option key={option.id} value={option.slug}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    id="sector"
                    name="sector"
                    value={form.sector}
                    onChange={(event) => setForm((prev) => ({ ...prev, sector: event.target.value }))}
                    className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                  />
                )}
                {!sectorOptions.length ? (
                  <p className="text-xs text-slate-400">Ajoutez des secteurs via Admin → Taxonomies.</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white" htmlFor="category">
                  Catégorie / type
                </label>
                <select
                  id="category"
                  name="category"
                  value={form.categorySlug ?? ""}
                  onChange={(event) => {
                    const nextSlug = event.target.value;
                    const nextLabel = categoryLabelMap.get(nextSlug) ?? "";
                    setForm((prev) => ({
                      ...prev,
                      categorySlug: nextSlug,
                      category: nextLabel,
                    }));
                  }}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {form.categorySlug && !categoryOptions.find((option) => option.slug === form.categorySlug) ? (
                    <option value={form.categorySlug}>{form.category ?? form.categorySlug}</option>
                  ) : null}
                  {categoryOptions.map((option) => (
                    <option key={option.id} value={option.slug}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {!categoryOptions.length ? (
                  <p className="text-xs text-slate-400">Ajoutez des catégories via Admin → Taxonomies.</p>
                ) : null}
              </div>
            </div>

            <MediaPickerField
              label="Image de couverture"
              description="Choisissez une image principale pour le projet."
              selected={coverMedia}
              onChange={(media) => {
                setCoverMedia(media);
                setForm((prev) => ({ ...prev, coverMediaId: media?.id ?? "" }));
              }}
              folder="projects"
              typeFilter="image"
            />

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="summary">
                Résumé
              </label>
              <textarea
                id="summary"
                name="summary"
                rows={3}
                value={form.summary}
                onChange={(event) => setForm((prev) => ({ ...prev, summary: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="body">
                Description détaillée
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
              <label className="text-sm font-semibold text-white" htmlFor="results">
                Résultats (un par ligne)
              </label>
              <textarea
                id="results"
                name="results"
                rows={4}
                value={resultsValue}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, results: event.target.value.split("\n").map((item) => item.trim()) }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="status">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={form.status ?? "draft"}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value as ContentStatus }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              >
                {(["draft", "published", "archived"] as const).map((value) => (
                  <option key={value} value={value}>
                    {STATUS_LABELS[value]}
                  </option>
                ))}
              </select>
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
