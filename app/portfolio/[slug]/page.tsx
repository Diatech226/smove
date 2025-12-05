type PortfolioPageProps = {
  params: {
    slug: string;
  };
};

export default function PortfolioDetailPage({ params }: PortfolioPageProps) {
  const { slug } = params;

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-6 py-12">
      <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Projet</p>
      <h1 className="text-4xl font-semibold text-white">{slug.replace(/-/g, " ")}</h1>
      <p className="text-lg text-slate-200">
        Page de détail en construction. Nous y ajouterons bientôt le contexte, les livrables, les
        médias et les résultats obtenus pour le client.
      </p>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-slate-200">
        <p className="text-sm text-slate-400">Slug: {slug}</p>
        <p className="mt-2">Contenu détaillé à venir dans une prochaine itération.</p>
      </div>
    </div>
  );
}
