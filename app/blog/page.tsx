import Link from "next/link";

const posts = [
  {
    slug: "tendances-social-media-2024",
    title: "Tendances social media 2024",
    date: "15 janvier 2024",
    excerpt: "Ce que nous retenons des nouveaux formats et usages à intégrer dans vos campagnes.",
  },
  {
    slug: "aligner-branding-et-performance",
    title: "Aligner branding et performance",
    date: "10 décembre 2023",
    excerpt: "Comment raconter votre marque tout en générant des résultats mesurables.",
  },
  {
    slug: "coulisses-tournage-smove",
    title: "Dans les coulisses d'un tournage SMOVE",
    date: "2 novembre 2023",
    excerpt: "Organisation, équipe, matériel : aperçu d'une journée type sur un plateau vidéo.",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Blog</p>
        <h1 className="text-4xl font-semibold text-white">Actualités & insights</h1>
        <p className="text-lg text-slate-200">
          Retours d'expérience, tendances et coulisses de l'agence. Les articles détaillés arrivent
          dans les prochaines versions.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-black/20"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{post.date}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{post.title}</h2>
            <p className="mt-2 text-slate-200">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-3 inline-flex text-sm font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Lire l'article →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
