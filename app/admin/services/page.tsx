// file: app/admin/services/page.tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

type AdminService = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

const emptyForm: Pick<AdminService, "name" | "slug" | "description"> = {
  name: "",
  slug: "",
  description: "",
};

type ToastState = {
  type: "success" | "error";
  message: string;
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<AdminService[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isCreating = useMemo(() => !editingId, [editingId]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/services");
        const data = await response.json();
        if (!response.ok || data?.success === false) {
          const errorMessage = data?.error || data?.message || "Impossible de charger les services";
          setError(errorMessage);
          setItems([]);
          return;
        }
        setItems(Array.isArray(data.services) ? data.services : []);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Impossible de charger les services. Vérifiez votre connexion ou réessayez.");
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatusMessage(null);
    setError(null);

    const { name, slug, description } = form;
    if (!name || !slug || !description) {
      setStatusMessage("Merci de renseigner le nom, le slug et la description.");
      return;
    }

    try {
      const method = isCreating ? "POST" : "PUT";
      const url = isCreating ? "/api/admin/services" : `/api/admin/services/${editingId}`;
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, slug, description }),
      });
      const data = await response.json();
      if (!response.ok || data?.success === false) {
        const errorMessage = data?.error || data?.message || "Erreur lors de l'enregistrement";
        setError(errorMessage);
        return;
      }

      setStatusMessage(isCreating ? "Service ajouté." : "Service mis à jour.");
      if (isCreating && data.service) {
        setItems((prev) => [data.service, ...prev]);
      } else if (data.service) {
        setItems((prev) => prev.map((item) => (item.id === data.service.id ? data.service : item)));
      }
      resetForm();
    } catch (submitError) {
      console.error(submitError);
      setError("Impossible d'enregistrer ce service.");
    }
  };

  const handleDelete = async (id: string) => {
    setStatusMessage(null);
    setError(null);
    try {
      const response = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok || data?.success === false) {
        const errorMessage = data?.error || data?.message || "Erreur lors de la suppression";
        setError(errorMessage);
        return;
      }
      setItems((prev) => prev.filter((item) => item.id !== id));
      setStatusMessage("Service supprimé.");
      resetForm();
    } catch (deleteError) {
      console.error(deleteError);
      setError("Impossible de supprimer ce service.");
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Services"
        subtitle="Gérez la liste des services proposés."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              resetForm();
              setStatusMessage(null);
            }}
          >
            Nouveau service
          </Button>
        }
      />

      {loading ? <p className="text-sm text-slate-200">Chargement des services...</p> : null}
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">Liste des services</h2>
          <div className="mt-4 space-y-3">
            {items.map((service) => (
              <div
                key={service.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-white">{service.name}</p>
                  <p className="text-xs uppercase tracking-wide text-emerald-200/80">{service.slug}</p>
                  <p className="mt-2 text-sm text-slate-300">{service.description}</p>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-1 text-xs"
                    onClick={() => {
                      setEditingId(service.id);
                      setForm({ name: service.name, slug: service.slug, description: service.description });
                      setStatusMessage(null);
                    }}
                  >
                    Modifier
                  </Button>
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-2 text-rose-200 hover:text-rose-100"
                    onClick={() => handleDelete(service.id)}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            ))}
            {!items.length && !loading ? <p className="text-sm text-slate-300">Aucun service pour le moment.</p> : null}
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">{isCreating ? "Nouveau service" : "Modifier le service"}</h2>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="name">
                Nom
              </label>
              <input
                id="name"
                name="name"
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
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
                value={form.slug}
                onChange={(event) => setForm((prev) => ({ ...prev, slug: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-white" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
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
