// file: app/admin/dashboard/page.tsx
import Link from "next/link";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";
import { services } from "@/lib/config/services";
import { posts } from "@/lib/config/posts";
import { projects } from "@/lib/config/projects";

const stats = [
  { label: "Services", value: services.length, href: "/admin/services" },
  { label: "Projets", value: projects.length, href: "/admin/projects" },
  { label: "Articles", value: posts.length, href: "/admin/posts" },
];

export default function AdminDashboardPage() {
  const latestPosts = [...posts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Vue d'ensemble du back-office SMOVE."
      />

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10"
          >
            <p className="text-sm text-slate-300">{stat.label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{stat.value}</p>
            <Link
              href={stat.href}
              className="mt-4 inline-flex text-sm font-medium text-emerald-200 hover:text-emerald-100"
            >
              Gérer
            </Link>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Articles récents</h2>
            <Link href="/admin/posts" className="text-sm text-emerald-200 hover:text-emerald-100">
              Voir tout
            </Link>
          </div>
          <div className="space-y-4">
            {latestPosts.map((post) => (
              <div
                key={post.slug}
                className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{post.title}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(post.date).toLocaleDateString("fr-FR", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <Link
                  href={`/admin/posts?slug=${post.slug}`}
                  className="text-sm text-emerald-200 hover:text-emerald-100"
                >
                  Modifier
                </Link>
              </div>
            ))}
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">Actions rapides</h2>
          <p className="mt-2 text-sm text-slate-300">
            Raccourcis vers les principales sections du back-office.
          </p>
          <div className="mt-4 space-y-3">
            <QuickLink href="/admin/services" label="Ajouter un service" />
            <QuickLink href="/admin/projects" label="Ajouter un projet" />
            <QuickLink href="/admin/posts" label="Publier un article" />
          </div>
        </Card>
      </div>
    </div>
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
      className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm font-medium text-white transition hover:border-emerald-300/40 hover:text-emerald-50"
    >
      <span>{label}</span>
      <span className="text-emerald-200">→</span>
    </Link>
  );
}
