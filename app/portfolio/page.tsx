import Link from "next/link";

const projects = [
  {
    slug: "lancement-produit-tech",
    title: "Lancement produit tech",
    client: "Client A",
    description: "Campagne intégrée pour un lancement produit avec film, social ads et landing page.",
  },
  {
    slug: "campagne-social-media",
    title: "Campagne social media",
    client: "Client B",
    description: "Calendrier éditorial, production de contenus et community management sur 3 mois.",
  },
  {
    slug: "identite-visuelle",
    title: "Identité visuelle",
    client: "Client C",
    description: "Refonte de l'identité et création d'un kit complet prêt à déployer.",
  },
];

export default function PortfolioPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Portfolio</p>
        <h1 className="text-4xl font-semibold text-white">Nos projets</h1>
        <p className="text-lg text-slate-200">
          Une sélection de missions menées par SMOVE. Chaque projet détaille bientôt le contexte, le
          dispositif et les résultats.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.slug}
            className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 shadow-lg shadow-black/20"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">{project.client}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{project.title}</h2>
            <p className="mt-2 text-slate-200">{project.description}</p>
            <Link
              href={`/portfolio/${project.slug}`}
              className="mt-3 inline-flex text-sm font-semibold text-emerald-300 hover:text-emerald-200"
            >
              Voir le détail →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
