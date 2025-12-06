// file: app/admin/services/page.tsx
"use client";

import { FormEvent, useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { services as initialServices, Service } from "@/lib/config/services";

const emptyService: Service = {
  id: "",
  name: "",
  category: "",
  description: "",
};

export default function AdminServicesPage() {
  const [servicesList, setServicesList] = useState<Service[]>(initialServices);
  const [editing, setEditing] = useState<Service>(initialServices[0] ?? emptyService);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const isCreating = useMemo(() => !initialServices.some((item) => item.id === editing.id), [editing.id]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editing.id || !editing.name) {
      setStatusMessage("Merci de renseigner au minimum un identifiant et un nom.");
      return;
    }

    setServicesList((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === editing.id);
      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = editing;
        return updated;
      }
      return [...prev, editing];
    });
    setStatusMessage(isCreating ? "Service ajouté (non persistant)." : "Service mis à jour (non persistant).");
  };

  const handleDelete = (id: string) => {
    setServicesList((prev) => prev.filter((item) => item.id !== id));
    setStatusMessage("Service supprimé (non persistant).");
    setEditing(emptyService);
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Services"
        subtitle="Gérez la liste des services proposés. Les modifications sont locales à cette session."
        actions={
          <Button
            variant="secondary"
            onClick={() => {
              setEditing(emptyService);
              setStatusMessage(null);
            }}
          >
            Ajouter un service
          </Button>
        }
      />

      <p className="text-sm text-amber-200/80">
        Les modifications ne sont pas encore sauvegardées de manière permanente (prototype).
      </p>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">Liste des services</h2>
          <div className="mt-4 space-y-3">
            {servicesList.map((service) => (
              <div
                key={service.id}
                className="flex items-start justify-between gap-3 rounded-xl border border-white/5 bg-white/5 p-4"
              >
                <div>
                  <p className="text-sm font-medium text-white">{service.name}</p>
                  <p className="text-xs uppercase tracking-wide text-emerald-200/80">{service.category}</p>
                  <p className="mt-2 text-sm text-slate-300">{service.description}</p>
                </div>
                <div className="flex flex-col gap-2 text-sm">
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-2"
                    onClick={() => {
                      setEditing(service);
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
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">
            {isCreating ? "Nouveau service" : "Modifier le service"}
          </h2>
          <p className="text-sm text-slate-300">Complétez les informations ci-dessous.</p>
          <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="id">
                Identifiant
              </label>
              <input
                id="id"
                type="text"
                value={editing.id}
                onChange={(event) => setEditing({ ...editing, id: event.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="communication-digitale"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="name">
                Nom
              </label>
              <input
                id="name"
                type="text"
                value={editing.name}
                onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Communication digitale"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="category">
                Catégorie
              </label>
              <input
                id="category"
                type="text"
                value={editing.category ?? ""}
                onChange={(event) => setEditing({ ...editing, category: event.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Stratégie"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-white" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={editing.description}
                onChange={(event) => setEditing({ ...editing, description: event.target.value })}
                className="min-h-[120px] w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
                placeholder="Décrivez le service"
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
                onClick={() => setEditing(emptyService)}
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
