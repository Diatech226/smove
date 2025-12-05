export default function LegalPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Mentions légales</p>
        <h1 className="text-4xl font-semibold text-white">Mentions légales & confidentialité</h1>
        <p className="text-lg text-slate-200">
          Informations légales et politique de confidentialité de SMOVE Communication. Contenu à
          affiner prochainement.
        </p>
      </header>

      <section className="space-y-3 text-slate-200">
        <h2 className="text-2xl font-semibold text-white">Editeur du site</h2>
        <p>SMOVE Communication – Agence de communication digitale.</p>
        <p>Adresse : à compléter. Contact : contact@smove.agency</p>
      </section>

      <section className="space-y-3 text-slate-200">
        <h2 className="text-2xl font-semibold text-white">Protection des données</h2>
        <p>
          Nous collectons uniquement les informations nécessaires pour répondre à vos demandes.
          Aucun partage à des tiers sans votre accord. Les détails complets seront ajoutés avec les
          futures fonctionnalités.
        </p>
      </section>

      <section className="space-y-3 text-slate-200">
        <h2 className="text-2xl font-semibold text-white">Cookies</h2>
        <p>Pas de suivi avancé pour le moment. La politique sera mise à jour lors de l'ajout d'analytics.</p>
      </section>
    </div>
  );
}
