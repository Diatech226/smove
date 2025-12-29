// file: app/admin/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

type StatCard = {
  label: string;
  value: number;
  href: string;
};

type RemoteData<T> = {
  loading: boolean;
  data: T[];
  total: number;
  error?: string | null;
};

const statConfig: Omit<StatCard, "value">[] = [
  { label: "Services", href: "/admin/services" },
  { label: "Projets", href: "/admin/projects" },
  { label: "Articles", href: "/admin/posts" },
  { label: "Événements", href: "/admin/events" },
];

export default function AdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [services, setServices] = useState<RemoteData<any>>({ loading: true, data: [], total: 0 });
  const [projects, setProjects] = useState<RemoteData<any>>({ loading: true, data: [], total: 0 });
  const [posts, setPosts] = useState<RemoteData<any>>({ loading: true, data: [], total: 0 });
  const [events, setEvents] = useState<RemoteData<any>>({ loading: true, data: [], total: 0 });
  const showBootstrapNotice = searchParams?.get("bootstrap") === "1";

  useEffect(() => {
    if (!showBootstrapNotice) return;
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.delete("bootstrap");
    const nextUrl = params.toString() ? `/admin/dashboard?${params.toString()}` : "/admin/dashboard";
    router.replace(nextUrl);
  }, [router, searchParams, showBootstrapNotice]);

  useEffect(() => {
    const fetchAll = async () => {
      const stateSetters = {
        services: setServices,
        projects: setProjects,
        posts: setPosts,
        events: setEvents,
      } as const;
      const endpoints: [keyof typeof stateSetters, string, string][] = [
        ["services", "/api/admin/services?limit=1", "services"],
        ["projects", "/api/admin/projects?limit=1", "projects"],
        ["posts", "/api/admin/posts?limit=1", "posts"],
        ["events", "/api/admin/events?limit=1", "events"],
      ];

      await Promise.all(
        endpoints.map(async ([key, url, payloadKey]) => {
          try {
            stateSetters[key]((prev) => ({ ...prev, loading: true }));
            const response = await fetch(url);
            const json = await response.json();
            if (!response.ok) throw new Error(json.error || "Erreur de chargement");
            const payload = json?.data ?? {};
            stateSetters[key]({
              loading: false,
              data: payload[payloadKey] ?? [],
              total: Number(payload.total) || (payload[payloadKey]?.length ?? 0),
              error: null,
            });
          } catch (error) {
            console.error(error);
            stateSetters[key]({ loading: false, data: [], total: 0, error: "Impossible de charger les données." });
          }
        }),
      );
    };

    fetchAll();
  }, []);

  const stats: StatCard[] = useMemo(
    () => [
      { ...statConfig[0], value: services.total || services.data.length },
      { ...statConfig[1], value: projects.total || projects.data.length },
      { ...statConfig[2], value: posts.total || posts.data.length },
      { ...statConfig[3], value: events.total || events.data.length },
    ],
    [
      services.data.length,
      services.total,
      projects.data.length,
      projects.total,
      posts.data.length,
      posts.total,
      events.data.length,
      events.total,
    ],
  );

  const latestPosts = useMemo(() => posts.data.slice(0, 4), [posts.data]);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Tableau de bord"
        subtitle="Une vue rapide sur l'activité du back-office SMOVE."
        actions={<Button href="/" variant="secondary">Voir le site public</Button>}
      />
      {showBootstrapNotice ? (
        <Card className="border-emerald-400/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          Admin initialisé.
        </Card>
      ) : null}

      <div className="grid gap-4 md:grid-cols-4">
        {stats.map((stat, index) => (
          <StatCardBlock
            key={stat.label}
            stat={stat}
            loading={services.loading && projects.loading && posts.loading && events.loading}
            index={index}
          />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-6">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-10 top-2 h-24 w-24 rounded-full bg-emerald-500/10 blur-3xl" />
          </div>
          <div className="relative mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">Contenus</p>
              <h2 className="text-lg font-semibold text-white">Articles récents</h2>
            </div>
            <Button href="/admin/posts" variant="ghost" className="border border-white/10 px-3 py-2 text-sm">
              Voir tout
            </Button>
          </div>
          <div className="space-y-3">
            {posts.loading ? (
              <SkeletonList rows={3} />
            ) : latestPosts.length ? (
              latestPosts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-medium text-white">{post.title}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(post.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/admin/posts?slug=${post.slug}`}
                    className="text-sm text-emerald-200 transition hover:text-emerald-100"
                  >
                    Modifier
                  </Link>
                </motion.div>
              ))
            ) : (
              <EmptyState message="Aucun article publié pour l'instant." />
            )}
          </div>
        </Card>

        <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-6">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-6 top-0 h-24 w-24 rounded-full bg-cyan-400/10 blur-3xl" />
          </div>
          <div className="relative">
            <h2 className="text-lg font-semibold text-white">Actions rapides</h2>
            <p className="mt-2 text-sm text-slate-300">Accès immédiat aux tâches clés.</p>
            <div className="mt-5 grid gap-3">
              <QuickLink href="/admin/services" label="Ajouter un service" />
              <QuickLink href="/admin/projects" label="Ajouter un projet" />
              <QuickLink href="/admin/posts" label="Publier un article" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

type StatCardBlockProps = {
  stat: StatCard;
  loading: boolean;
  index: number;
};

function StatCardBlock({ stat, loading, index }: StatCardBlockProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.05 * index, ease: "easeOut" }}
    >
      <Card className="relative overflow-hidden border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-white/10 p-5">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-emerald-500/10 blur-2xl" />
        </div>
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-200/80">{stat.label}</p>
            {loading ? (
              <div className="mt-3 h-6 w-14 animate-pulse rounded-lg bg-white/10" />
            ) : (
              <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
            )}
          </div>
          <Button
            href={stat.href}
            variant="ghost"
            className="border border-white/10 px-3 py-2 text-xs text-emerald-100 hover:border-emerald-300/50"
          >
            Gérer
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

type QuickLinkProps = {
  href: string;
  label: string;
};

function QuickLink({ href, label }: QuickLinkProps) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-emerald-300/50 hover:bg-white/10"
    >
      <span>{label}</span>
      <span className="text-emerald-200 transition group-hover:translate-x-0.5">→</span>
    </Link>
  );
}

type SkeletonListProps = {
  rows: number;
};

function SkeletonList({ rows }: SkeletonListProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="h-14 animate-pulse rounded-xl border border-white/5 bg-white/5" />
      ))}
    </div>
  );
}

type EmptyStateProps = {
  message: string;
};

function EmptyState({ message }: EmptyStateProps) {
  return <p className="text-sm text-slate-300">{message}</p>;
}
