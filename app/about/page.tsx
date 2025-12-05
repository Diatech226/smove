export default function AboutPage() {
  const valeurs = [
    { title: "Vision", content: "Créer des expériences qui font vivre les marques dans le quotidien des publics." },
    { title: "Mission", content: "Piloter votre communication digitale de bout en bout avec agilité et créativité." },
    { title: "Valeurs", content: "Curiosité, transparence, exigence et goût du travail bien fait." },
  ];

  const equipe = [
    { name: "Sarah", role: "Directrice de création" },
    { name: "Mehdi", role: "Lead stratégie digitale" },
    { name: "Léna", role: "Productrice audiovisuelle" },
    { name: "Kassim", role: "Motion designer / 3D" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-12 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">À propos</p>
        <h1 className="text-4xl font-semibold text-white">SMOVE Communication</h1>
        <p className="text-lg text-slate-200">
          Nous sommes une agence de communication digitale basée sur l'action. Notre promesse :
          "We do the work for you".
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-white">Notre histoire</h2>
        <p className="text-slate-200">
          Née de la rencontre entre créatifs et stratèges, SMOVE accompagne les marques qui veulent
          aller vite tout en gardant une identité forte. Nous avons lancé l'agence pour simplifier la
          production de contenus et de campagnes, en intégrant toutes les expertises sous un même
          toit.
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">Vision, mission, valeurs</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {valeurs.map((item) => (
            <div key={item.title} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
              <h3 className="text-lg font-semibold text-white">{item.title}</h3>
              <p className="mt-2 text-slate-200">{item.content}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-white">L'équipe SMOVE</h2>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {equipe.map((member) => (
            <div key={member.name} className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4 text-center">
              <p className="text-lg font-semibold text-white">{member.name}</p>
              <p className="text-sm text-slate-300">{member.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
