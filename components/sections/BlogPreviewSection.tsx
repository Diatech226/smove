import Link from "next/link";

const posts = [
  { title: "Tendances social media 2024", date: "Jan 2024" },
  { title: "Comment aligner branding et performance", date: "Déc 2023" },
  { title: "Les coulisses d'un tournage SMOVE", date: "Nov 2023" },
];

export default function BlogPreviewSection() {
  return (
    <section className="border-b border-slate-800 bg-slate-950 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Actualités</p>
            <h2 className="text-3xl font-semibold text-white">À la une sur le blog.</h2>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
          >
            Lire tous les articles →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-6 text-slate-100 shadow-lg shadow-black/20"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{post.date}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">{post.title}</h3>
              <p className="mt-2 text-sm text-slate-300">
                Aperçu d'article mettant en avant les astuces, retours d'expérience et insights de
                l'agence.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
