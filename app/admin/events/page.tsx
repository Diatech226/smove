// file: app/admin/events/page.tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { slugify } from "@/lib/utils";

type AdminEvent = {
  id: string;
  slug: string;
  title: string;
  date: string;
  location?: string | null;
  description?: string | null;
  category?: string | null;
  coverImage?: string | null;
};

const emptyForm: Omit<AdminEvent, "id"> = {
  slug: "",
  title: "",
  date: "",
  location: "",
  description: "",
  category: "",
  coverImage: "",
};

export default function AdminEventsPage() {
  const [items, setItems] = useState<AdminEvent[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCreating = useMemo(() => !editingId, [editingId]);
  const computedSlug = useMemo(() => (form.slug.trim() ? form.slug : slugify(form.title)), [form.slug, form.title]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/events");
        const data = await response.json();
        if (!response.ok || data?.ok === false) {
          setError(data?.error || "Impossible de charger les événements.");
          return;
        }
        setItems(Array.isArray(data?.data?.events) ? data.data.events : []);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Impossible de charger les événements.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setError(null);

    const { title, date, location, description, category, coverImage } = form;
    if (!title || !computedSlug || !date) {
      setStatusMessage("Merci de renseigner le titre, la date et le slug.");
      return;
    }

    const payload = {
      ...form,
      slug: computedSlug,
      date,
      location,
      description,
      category,
      coverImage,
    };

    try {
      const response = await fetch(isCreating ? "/api/admin/events" : `/api/admin/events/${editingId}`, {
        method: isCreating ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        setError(data?.error || "Impossible d'enregistrer cet événement.");
        return;
      }

      setStatusMessage(isCreating ? "Événement créé." : "Événement mis à jour.");
      if (isCreating && data?.data?.event) {
        setItems((prev) => [data.data.event, ...prev]);
      } else if (data?.data?.event) {
        setItems((prev) => prev.map((item) => (item.id === data.data.event.id ? data.data.event : item)));
      }
      resetForm();
    } catch (submitError) {
      console.error(submitError);
      setError("Erreur lors de l'enregistrement.");
    }
  };

  const handleDelete = async (id: string) => {
    setStatusMessage(null);
    setError(null);
    try {
      const response = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        setError(data?.error || "Suppression impossible.");
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage("Événement supprimé.");
      resetForm();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Impossible de supprimer cet événement.");
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Événements"
        subtitle="Programmez et archivez vos temps forts."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              resetForm();
              setStatusMessage(null);
            }}
          >
            Nouvel événement
          </Button>
        }
      />

      {loading ? <p className="text-sm text-slate-200">Chargement des événements...</p> : null}
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">Liste des événements</h2>
          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">{item.title}</p>
                  <p className="text-xs uppercase tracking-wide text-emerald-200/80">{new Date(item.date).toLocaleDateString("fr-FR")}</p>
                  <p className="text-xs text-slate-300">{item.slug}</p>
                  {item.category ? <p className="text-xs text-emerald-200">{item.category}</p> : null}
                  {item.location ? <p className="text-sm text-slate-200">{item.location}</p> : null}
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-1 text-xs"
                    onClick={() => {
                      setEditingId(item.id);
                      setForm({
                        slug: item.slug,
                        title: item.title,
                        date: item.date?.slice(0, 10),
                        location: item.location ?? "",
                        description: item.description ?? "",
                        category: item.category ?? "",
                        coverImage: item.coverImage ?? "",
                      });
                      setStatusMessage(null);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-2 text-rose-200 hover:text-rose-100"
                    onClick={() => handleDelete(item.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
            {!items.length && !loading ? <p className="text-sm text-slate-300">Aucun événement pour le moment.</p> : null}
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">{isCreating ? "Nouvel événement" : "Modifier l'événement"}</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
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

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white" htmlFor="date">
                  Date
                </label>
                <input
                  id="date"
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white" htmlFor="location">
                  Lieu
                </label>
                <input
                  id="location"
                  name="location"
                  value={form.location ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, location: event.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white" htmlFor="category">
                  Catégorie / type
                </label>
                <input
                  id="category"
                  name="category"
                  value={form.category ?? ""}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </div>
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
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description ?? ""}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
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
