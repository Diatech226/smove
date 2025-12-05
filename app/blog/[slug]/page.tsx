type BlogPageProps = {
  params: {
    slug: string;
  };
};

export default function BlogArticlePage({ params }: BlogPageProps) {
  const { slug } = params;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Article</p>
      <h1 className="text-4xl font-semibold text-white">{slug.replace(/-/g, " ")}</h1>
      <p className="text-lg text-slate-200">
        Article en cours de rédaction. Nous partagerons bientôt insights, études de cas et coulisses
        détaillées.
      </p>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-slate-200">
        <p className="text-sm text-slate-400">Slug: {slug}</p>
        <p className="mt-2">Contenu éditorial à venir dans une prochaine itération.</p>
      </div>
    </div>
  );
}
