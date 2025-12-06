// file: app/admin/services/page.tsx
"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import type { Service } from "@prisma/client";
import { motion, AnimatePresence } from "framer-motion";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const emptyForm: Pick<Service, "name" | "slug" | "description"> = {
  name: "",
  slug: "",
  description: "",
};

type ToastState = {
  type: "success" | "error";
  message: string;
};

export default function AdminServicesPage() {
  const [items, setItems] = useState<Service[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);

  const isCreating = useMemo(() => !editingId, [editingId]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/services");
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Impossible de charger les services");
        setItems(data.data ?? []);
      } catch (error) {
        console.error(error);
        setToast({ type: "error", message: "Chargement des services impossible." });
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

    const { name, slug, description } = form;
    if (!name || !slug || !description) {
      setToast({ type: "error", message: "Merci de renseigner le nom, le slug et la description." });
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
      if (!response.ok) throw new Error(data.error || "Erreur lors de l'enregistrement");

      setToast({ type: "success", message: isCreating ? "Service ajouté." : "Service mis à jour." });
      if (isCreating && data.data) {
        setItems((prev) => [data.data, ...prev]);
      } else if (data.data) {
        setItems((prev) => prev.map((item) => (item.id === data.data.id ? data.data : item)));
      }
      resetForm();
    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: "Impossible d'enregistrer ce service." });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Erreur lors de la suppression");
      setItems((prev) => prev.filter((item) => item.id !== id));
      setToast({ type: "success", message: "Service supprimé." });
      resetForm();
    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: "Impossible de supprimer ce service." });
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
              setPanelOpen(true);
              resetForm();
            }}
          >
            Nouveau service
          </Button>
        }
      />

      <AnimatePresence>
        {toast ? <Toast key={toast.message} type={toast.type} message={toast.message} onClose={() => setToast(null)} /> : null}
      </AnimatePresence>

      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <Card className="relative overflow-hidden border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-6">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-10 top-0 h-24 w-24 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>
          <div className="relative mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Catalogue</p>
              <h2 className="text-lg font-semibold text-white">Tous les services</h2>
            </div>
          </div>
          {loading ? (
            <SkeletonTable rows={4} columns={3} />
          ) : items.length ? (
            <div className="overflow-hidden rounded-2xl border border-white/5">
              <div className="grid grid-cols-[1.2fr_1fr_140px] bg-white/5 px-4 py-3 text-xs uppercase tracking-wide text-slate-300">
                <span>Nom</span>
                <span>Slug</span>
                <span className="text-right">Actions</span>
              </div>
              <div className="divide-y divide-white/5">
                {items.map((service) => (
                  <div
                    key={service.id}
                    className="grid grid-cols-[1.2fr_1fr_140px] items-center px-4 py-3 text-sm transition hover:bg-white/5"
                  >
                    <div>
                      <p className="font-medium text-white">{service.name}</p>
                      <p className="text-xs text-slate-400">{service.description}</p>
                    </div>
                    <p className="text-xs uppercase tracking-wide text-emerald-200/90">{service.slug}</p>
                    <div className="flex justify-end gap-2 text-xs">
                      <Button
                        variant="ghost"
                        className="border border-white/10 px-3 py-1"
                        onClick={() => {
                          setEditingId(service.id);
                          setForm({ name: service.name, slug: service.slug, description: service.description });
                          setPanelOpen(true);
                        }}
                      >
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        className="border border-white/10 px-3 py-1 text-rose-200 hover:text-rose-100"
                        onClick={() => handleDelete(service.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState message="Aucun service pour le moment." />
          )}
        </Card>

        <AnimatePresence initial={false}>
          {panelOpen ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
            >
              <Card className="border-white/10 bg-gradient-to-b from-white/10 via-white/5 to-white/10 p-6 shadow-xl shadow-emerald-500/10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">{isCreating ? "Créer" : "Modifier"}</p>
                    <h2 className="text-lg font-semibold text-white">
                      {isCreating ? "Nouveau service" : "Mettre à jour le service"}
                    </h2>
                  </div>
                  <Button
                    variant="ghost"
                    className="border border-white/10 px-3 py-1 text-xs"
                    onClick={() => {
                      setPanelOpen(false);
                      resetForm();
                    }}
                  >
                    Fermer
                  </Button>
                </div>
                <p className="mt-2 text-sm text-slate-300">Complétez les informations ci-dessous.</p>
                <form className="mt-5 space-y-4" onSubmit={handleSubmit}>
                  <InputField
                    id="name"
                    label="Nom"
                    placeholder="Communication digitale"
                    value={form.name}
                    onChange={(value) => setForm({ ...form, name: value })}
                  />
                  <InputField
                    id="slug"
                    label="Slug"
                    placeholder="communication-digitale"
                    value={form.slug}
                    onChange={(value) => setForm({ ...form, slug: value })}
                  />
                  <InputField
                    id="description"
                    label="Description"
                    placeholder="Décrivez le service"
                    value={form.description}
                    onChange={(value) => setForm({ ...form, description: value })}
                    multiline
                  />
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
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}

type ToastProps = ToastState & { onClose: () => void };

function Toast({ type, message, onClose }: ToastProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`fixed right-6 top-6 z-20 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur ${
        type === "success"
          ? "border-emerald-400/40 bg-emerald-500/20 text-emerald-50"
          : "border-rose-400/30 bg-rose-500/15 text-rose-50"
      }`}
    >
      <span className="text-sm font-medium">{message}</span>
      <button className="text-xs text-white/80" onClick={onClose}>
        fermer
      </button>
    </motion.div>
  );
}

type InputFieldProps = {
  id: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
};

function InputField({ id, label, placeholder, value, onChange, multiline }: InputFieldProps) {
  const InputTag = multiline ? "textarea" : "input";
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white" htmlFor={id}>
        {label}
      </label>
      <InputTag
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/50"
        {...(multiline ? { rows: 4 } : { type: "text" })}
      />
    </div>
  );
}

type SkeletonTableProps = {
  rows: number;
  columns: number;
};

function SkeletonTable({ rows, columns }: SkeletonTableProps) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="grid animate-pulse grid-cols-[1.2fr_1fr_140px] gap-3 rounded-xl border border-white/5 bg-white/5 px-4 py-3">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="h-4 rounded-full bg-white/10" />
          ))}
        </div>
      ))}
    </div>
  );
}

type EmptyStateProps = {
  message: string;
};

function EmptyState({ message }: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
      {message}
    </div>
  );
}
