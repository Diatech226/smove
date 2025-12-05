const services = [
  {
    title: "Communication digitale",
    description:
      "Stratégie social media, campagnes multicanal, contenus et influence pour engager vos communautés.",
  },
  {
    title: "Design & branding",
    description: "Identité visuelle, charte graphique, messages et storytelling cohérents sur tous les points de contact.",
  },
  {
    title: "Audiovisuel",
    description: "Production vidéo, interviews, captation d'événements et photographie pour vos campagnes.",
  },
  {
    title: "Web & multimédia",
    description: "Sites vitrines, landing pages et expériences interactives optimisées pour la conversion.",
  },
  {
    title: "Motion design / 3D",
    description: "Animations, motion graphics, environnements 3D et teasers immersifs pour vos lancements.",
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-10 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Services</p>
        <h1 className="text-4xl font-semibold text-white">Nos expertises</h1>
        <p className="text-lg text-slate-200">
          Une équipe multidisciplinaire pour concevoir, produire et distribuer vos contenus partout
          où votre audience se trouve.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        {services.map((service) => (
          <div key={service.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
            <h2 className="text-2xl font-semibold text-white">{service.title}</h2>
            <p className="mt-2 text-slate-200">{service.description}</p>
            <p className="mt-3 text-sm text-slate-400">
              Livrables, processus et études de cas seront détaillés dans les prochaines itérations.
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
