// file: app/admin/categories/page.tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { slugify } from "@/lib/utils";

type CategoryType = "post" | "service" | "project" | "event";

type CategoryItem = {
  id: string;
  type: CategoryType;
  name: string;
  slug: string;
  order: number;
};

const emptyForm: Pick<CategoryItem, "type" | "name" | "slug" | "order"> = {
  type: "post",
  name: "",
  slug: "",
  order: 0,
};

export default function AdminCategoriesPage() {
  const [items, setItems] = useState<CategoryItem[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<CategoryType>("post");

  const computedSlug = useMemo(() => (form.slug.trim() ? form.slug : slugify(form.name)), [form.slug, form.name]);
  const isCreating = !editingId;

  const loadCategories = async (type: CategoryType) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/categories?type=${type}`);
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        setError(data?.error || "Impossible de charger les catégories.");
        setItems([]);
        return;
      }
      setItems(Array.isArray(data?.data?.categories) ? data.data.categories : []);
    } catch (fetchError) {
      console.error(fetchError);
      setError("Impossible de charger les catégories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCategories(filterType);
  }, [filterType]);

  useEffect(() => {
    if (!editingId) {
      setForm((prev) => ({ ...prev, type: filterType }));
    }
  }, [filterType, editingId]);

  const resetForm = () => {
    setForm((current) => ({ ...emptyForm, type: current.type }));
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setError(null);

    const payload = {
      type: form.type,
      name: form.name.trim(),
      slug: computedSlug,
      order: Number.isFinite(form.order) ? form.order : 0,
    };

    if (!payload.name || !payload.slug) {
      setError("Merci de renseigner le nom et le slug.");
      return;
    }

    try {
      const url = isCreating ? "/api/admin/categories" : `/api/admin/categories/${editingId}`;
      const method = isCreating ? "POST" : "PATCH";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        setError(data?.error || "Erreur lors de l'enregistrement.");
        return;
      }

      setStatusMessage(isCreating ? "Catégorie ajoutée." : "Catégorie mise à jour.");
      resetForm();
      void loadCategories(filterType);
    } catch (submitError) {
      console.error(submitError);
      setError("Impossible d'enregistrer cette catégorie.");
    }
  };

  const handleEdit = (item: CategoryItem) => {
    setEditingId(item.id);
    setForm({ type: item.type, name: item.name, slug: item.slug, order: item.order });
  };

  const handleDelete = async (id: string) => {
    setStatusMessage(null);
    setError(null);
    const confirmed = window.confirm("Supprimer cette catégorie ?");
    if (!confirmed) return;

    try {
      const response = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        setError(data?.error || "Impossible de supprimer cette catégorie.");
        return;
      }
      setStatusMessage("Catégorie supprimée.");
      void loadCategories(filterType);
    } catch (deleteError) {
      console.error(deleteError);
      setError("Impossible de supprimer cette catégorie.");
    }
  };

  const handleSeed = async () => {
    setStatusMessage(null);
    setError(null);
    try {
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seed: true, type: filterType }),
      });
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        setError(data?.error || "Impossible de générer les catégories par défaut.");
        return;
      }
      setStatusMessage("Catégories par défaut créées.");
      setItems(Array.isArray(data?.data?.categories) ? data.data.categories : []);
    } catch (seedError) {
      console.error(seedError);
      setError("Impossible de générer les catégories par défaut.");
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Catégories"
        subtitle="Créez et organisez les catégories utilisées dans le CMS."
      />

      <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Catégories CMS</h2>
            <p className="text-sm text-slate-300">Sélectionnez un type et gérez vos rubriques.</p>
          </div>
          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-300" htmlFor="typeFilter">
              Type
            </label>
            <select
              id="typeFilter"
              value={filterType}
              onChange={(event) => setFilterType(event.target.value as CategoryType)}
              className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="post">Articles</option>
              <option value="service">Services</option>
              <option value="project">Projets</option>
              <option value="event">Événements</option>
            </select>
          </div>
        </div>

        <form className="mt-6 grid gap-4 rounded-xl border border-white/10 bg-slate-950/40 p-4 md:grid-cols-4" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="categoryType">
              Type
            </label>
            <select
              id="categoryType"
              value={form.type}
              onChange={(event) => setForm((prev) => ({ ...prev, type: event.target.value as CategoryType }))}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              <option value="post">Article</option>
              <option value="service">Service</option>
              <option value="project">Projet</option>
              <option value="event">Événement</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="name">
              Nom
            </label>
            <input
              id="name"
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              placeholder="Branding"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="slug">
              Slug
            </label>
            <input
              id="slug"
              value={computedSlug}
              onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              placeholder="branding"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="order">
              Ordre
            </label>
            <input
              id="order"
              type="number"
              value={form.order}
              onChange={(event) => setForm((prev) => ({ ...prev, order: Number(event.target.value) }))}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="flex items-end gap-2 md:col-span-3">
            <Button type="submit" className="px-4 py-2">
              {isCreating ? "Ajouter" : "Mettre à jour"}
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="border border-white/10 px-4 py-2 text-slate-200"
              onClick={resetForm}
            >
              Annuler
            </Button>
          </div>
        </form>

        {statusMessage ? <p className="mt-4 text-sm text-emerald-200">{statusMessage}</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-200">{error}</p> : null}

        <div className="mt-6 space-y-3">
          {loading ? <p className="text-sm text-slate-300">Chargement...</p> : null}
          {!loading && !items.length ? (
            <div className="rounded-lg border border-white/10 bg-slate-900/40 p-4 text-sm text-slate-300">
              <p>Aucune catégorie pour ce type.</p>
              <Button type="button" variant="secondary" className="mt-3 text-xs" onClick={handleSeed}>
                Générer les catégories par défaut
              </Button>
            </div>
          ) : null}
          {items.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 font-semibold">Nom</th>
                    <th className="px-3 py-2 font-semibold">Slug</th>
                    <th className="px-3 py-2 font-semibold">Ordre</th>
                    <th className="px-3 py-2 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-white/5">
                      <td className="px-3 py-3 text-white">{item.name}</td>
                      <td className="px-3 py-3 text-emerald-200">{item.slug}</td>
                      <td className="px-3 py-3">{item.order}</td>
                      <td className="px-3 py-3">
                        <div className="flex flex-wrap gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="px-3 py-1 text-xs"
                            onClick={() => handleEdit(item)}
                          >
                            Modifier
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="border border-white/10 px-3 py-1 text-xs text-rose-200 hover:text-rose-100"
                            onClick={() => handleDelete(item.id)}
                          >
                            Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
