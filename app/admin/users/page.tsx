"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const ROLE_OPTIONS = [
  { value: "all", label: "Tous les rôles" },
  { value: "admin", label: "Admin" },
  { value: "client", label: "Client" },
] as const;

const STATUS_OPTIONS = [
  { value: "all", label: "Tous les statuts" },
  { value: "active", label: "Actif" },
  { value: "disabled", label: "Désactivé" },
  { value: "pending", label: "En attente" },
] as const;

const SORT_OPTIONS = [
  { value: "createdAt_desc", label: "Derniers créés" },
  { value: "createdAt_asc", label: "Premiers créés" },
  { value: "email_asc", label: "Email A → Z" },
  { value: "email_desc", label: "Email Z → A" },
  { value: "role_asc", label: "Rôle A → Z" },
  { value: "role_desc", label: "Rôle Z → A" },
  { value: "status_asc", label: "Statut A → Z" },
  { value: "status_desc", label: "Statut Z → A" },
] as const;

type UserRole = "admin" | "client";

type UserStatus = "active" | "disabled" | "pending";

type AdminUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  inviteExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

type ToastState = {
  type: "success" | "error";
  message: string;
};

type UserFormState = {
  email: string;
  role: UserRole;
};

const emptyForm: UserFormState = {
  email: "",
  role: "client",
};

const formatDate = (value?: string | null) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "-";
  return date.toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const statusStyles: Record<UserStatus, string> = {
  active: "bg-emerald-500/20 text-emerald-100",
  disabled: "bg-rose-500/20 text-rose-100",
  pending: "bg-amber-500/20 text-amber-100",
};

async function fetchWithTimeout(input: RequestInfo, init: RequestInit = {}, timeoutMs = 8000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(input, { credentials: "include", ...init, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeout);
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<(typeof ROLE_OPTIONS)[number]["value"]>("all");
  const [statusFilter, setStatusFilter] = useState<(typeof STATUS_OPTIONS)[number]["value"]>("all");
  const [sort, setSort] = useState<(typeof SORT_OPTIONS)[number]["value"]>("createdAt_desc");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<UserFormState>(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 3500);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set("q", debouncedSearch);
    if (roleFilter !== "all") params.set("role", roleFilter);
    if (statusFilter !== "all") params.set("status", statusFilter);
    if (sort !== "createdAt_desc") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    if (limit !== 12) params.set("limit", String(limit));
    return params.toString();
  }, [debouncedSearch, roleFilter, statusFilter, sort, page, limit]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const url = queryString ? `/api/admin/users?${queryString}` : "/api/admin/users";
      const response = await fetchWithTimeout(url);
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        const errorMessage = data?.error || data?.message || "Impossible de charger les utilisateurs";
        setError(errorMessage);
        setUsers([]);
        setTotal(0);
        setTotalPages(1);
        return;
      }
      setError(null);
      const payload = data?.data ?? {};
      setUsers(Array.isArray(payload.users) ? payload.users : []);
      const nextTotalPages = Number(payload.totalPages) || 1;
      setTotalPages(nextTotalPages);
      setTotal(Number(payload.total) || 0);
      if (page > nextTotalPages) {
        setPage(nextTotalPages);
      }
    } catch (fetchError: any) {
      console.error(fetchError);
      const message = fetchError?.name === "AbortError"
        ? "La requête a expiré. Réessayez."
        : "Impossible de charger les utilisateurs. Vérifiez votre connexion.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, limit, queryString]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const openInviteModal = () => {
    setForm(emptyForm);
    setFormError(null);
    setInviteLink(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setForm(emptyForm);
    setFormError(null);
    setInviteLink(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setFormError(null);

    const payload = {
      email: form.email.trim(),
      role: form.role,
    };

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        const errorMessage = data?.error || data?.message || "Erreur lors de l'enregistrement";
        setFormError(errorMessage);
        return;
      }

      const link = data?.data?.inviteLink as string | undefined;
      if (link) {
        setInviteLink(link);
      }
      setToast({ type: "success", message: "Invitation envoyée." });
      await fetchUsers();
    } catch (submitError) {
      console.error(submitError);
      setFormError("Impossible d'enregistrer cet utilisateur.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (user: AdminUser) => {
    if (!window.confirm(`Supprimer l'utilisateur ${user.email} ?`)) return;
    try {
      const response = await fetch(`/api/admin/users/${user.id}`, { method: "DELETE", credentials: "include" });
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        const errorMessage = data?.error || data?.message || "Erreur lors de la suppression";
        setToast({ type: "error", message: errorMessage });
        return;
      }
      setToast({ type: "success", message: "Utilisateur supprimé." });
      await fetchUsers();
    } catch (deleteError) {
      console.error(deleteError);
      setToast({ type: "error", message: "Impossible de supprimer cet utilisateur." });
    }
  };

  const handleQuickUpdate = async (id: string, update: Partial<Pick<AdminUser, "role" | "status">>) => {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(update),
      });
      const data = await response.json();
      if (!response.ok || data?.ok === false) {
        const errorMessage = data?.error || data?.message || "Impossible de mettre à jour l'utilisateur";
        setToast({ type: "error", message: errorMessage });
        return;
      }
      const updatedUser = data?.data?.user as AdminUser | undefined;
      if (updatedUser) {
        setUsers((prev) => prev.map((user) => (user.id === id ? updatedUser : user)));
      }
      setToast({ type: "success", message: "Utilisateur mis à jour." });
    } catch (updateError) {
      console.error(updateError);
      setToast({ type: "error", message: "Impossible de mettre à jour l'utilisateur." });
    }
  };

  const headerActions = (
    <Button variant="secondary" onClick={openInviteModal}>
      Inviter un user
    </Button>
  );

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Users"
        subtitle="Gérez les comptes clients et administrateurs depuis le CMS."
        actions={headerActions}
      />

      {toast ? (
        <div
          role="status"
          className={`rounded-xl border border-white/10 px-4 py-2 text-sm ${
            toast.type === "success" ? "bg-emerald-500/10 text-emerald-100" : "bg-rose-500/10 text-rose-200"
          }`}
        >
          {toast.message}
        </div>
      ) : null}

      <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Utilisateurs & rôles</h2>
            <p className="text-sm text-slate-300">Recherche, filtres et actions rapides sur les accès.</p>
          </div>
          <div className="text-sm text-slate-300">
            {total} user(s) • page {page} / {totalPages}
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-xl border border-white/10 bg-slate-950/40 p-4 md:grid-cols-4">
          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="user-search">
              Recherche
            </label>
            <input
              id="user-search"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Email"
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="user-role">
              Rôle
            </label>
            <select
              id="user-role"
              value={roleFilter}
              onChange={(event) => {
                setPage(1);
                setRoleFilter(event.target.value as typeof roleFilter);
              }}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="user-status">
              Statut
            </label>
            <select
              id="user-status"
              value={statusFilter}
              onChange={(event) => {
                setPage(1);
                setStatusFilter(event.target.value as typeof statusFilter);
              }}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-300" htmlFor="user-sort">
              Tri
            </label>
            <select
              id="user-sort"
              value={sort}
              onChange={(event) => {
                setPage(1);
                setSort(event.target.value as typeof sort);
              }}
              className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {loading ? <p className="mt-4 text-sm text-slate-200">Chargement des utilisateurs...</p> : null}
        {error ? <p className="mt-4 text-sm text-rose-200">{error}</p> : null}

        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-200">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Rôle</th>
                <th className="px-3 py-2">Statut</th>
                <th className="px-3 py-2">Créé le</th>
                <th className="px-3 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5">
                  <td className="px-3 py-3 font-medium text-white">{user.email}</td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-white/10 px-2 py-1 text-[11px] font-semibold text-white">
                        {user.role}
                      </span>
                      <Button
                        variant="ghost"
                        className="border border-white/10 px-3 py-1 text-xs"
                        onClick={() =>
                          handleQuickUpdate(user.id, {
                            role: user.role === "admin" ? "client" : "admin",
                          })
                        }
                      >
                        Passer {user.role === "admin" ? "client" : "admin"}
                      </Button>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded-full px-2 py-1 text-[11px] font-semibold ${statusStyles[user.status]}`}>
                        {user.status}
                      </span>
                      {user.status === "pending" ? (
                        <Button
                          variant="ghost"
                          className="border border-white/10 px-3 py-1 text-xs"
                          onClick={() => handleQuickUpdate(user.id, { status: "disabled" })}
                        >
                          Désactiver
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          className="border border-white/10 px-3 py-1 text-xs"
                          onClick={() =>
                            handleQuickUpdate(user.id, {
                              status: user.status === "active" ? "disabled" : "active",
                            })
                          }
                        >
                          {user.status === "active" ? "Désactiver" : "Activer"}
                        </Button>
                      )}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-300">{formatDate(user.createdAt)}</td>
                  <td className="px-3 py-3 text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        variant="ghost"
                        className="border border-white/10 px-3 py-1 text-xs text-rose-200 hover:text-rose-100"
                        onClick={() => handleDelete(user)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!users.length && !loading ? (
            <p className="mt-4 text-sm text-slate-300">Aucun utilisateur pour le moment.</p>
          ) : null}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-300">
          <p>
            {total} user(s) • page {page} / {totalPages}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-xs text-slate-400" htmlFor="users-per-page">
              Par page
            </label>
            <select
              id="users-per-page"
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

      {modalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-8">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900 p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Inviter un user</h3>
                <p className="text-sm text-slate-300">Créez un compte en attente et partagez le lien d'activation.</p>
              </div>
              <Button variant="ghost" className="border border-white/10 px-3 py-1 text-xs" onClick={closeModal}>
                Fermer
              </Button>
            </div>
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white" htmlFor="user-email">
                  Email
                </label>
                <input
                  id="user-email"
                  value={form.email}
                  onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                  type="email"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-white" htmlFor="user-role-form">
                  Rôle
                </label>
                <select
                  id="user-role-form"
                  value={form.role}
                  onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value as UserRole }))}
                  className="w-full rounded-lg border border-white/10 bg-slate-950 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                </select>
              </div>
              {inviteLink ? (
                <div className="space-y-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
                  <p className="font-semibold text-emerald-100">Lien d'activation</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <input
                      value={inviteLink}
                      readOnly
                      className="flex-1 rounded-lg border border-emerald-400/40 bg-emerald-950/40 px-3 py-2 text-xs text-emerald-50"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      className="px-3 py-2 text-xs"
                      onClick={async () => {
                        try {
                          await navigator.clipboard.writeText(inviteLink);
                          setToast({ type: "success", message: "Lien copié." });
                        } catch (copyError) {
                          console.error(copyError);
                          setToast({ type: "error", message: "Impossible de copier le lien." });
                        }
                      }}
                    >
                      Copier
                    </Button>
                  </div>
                  <p className="text-xs text-emerald-100/80">Valable 48h pour activer le compte.</p>
                </div>
              ) : null}
              {formError ? <p className="text-sm text-rose-200">{formError}</p> : null}
              <div className="flex items-center gap-3">
                <Button type="submit" disabled={saving}>
                  {saving ? "Invitation..." : "Créer l'invitation"}
                </Button>
                <Button type="button" variant="ghost" className="border border-white/10" onClick={closeModal}>
                  Annuler
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
