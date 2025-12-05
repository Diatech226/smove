export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-10 px-6 py-12">
      <header className="space-y-3">
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Contact</p>
        <h1 className="text-4xl font-semibold text-white">Échangeons sur votre projet</h1>
        <p className="text-lg text-slate-200">
          Remplissez le formulaire ou contactez-nous directement par WhatsApp, téléphone ou e-mail.
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <form className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <div className="space-y-1">
            <label className="text-sm text-slate-200" htmlFor="name">
              Nom et prénom
            </label>
            <input
              id="name"
              name="name"
              type="text"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
              placeholder="Votre nom"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-200" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
              placeholder="vous@email.com"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-200" htmlFor="phone">
              Téléphone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
              placeholder="+33"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-slate-200" htmlFor="message">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-white focus:border-emerald-400 focus:outline-none"
              placeholder="Décrivez votre besoin"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
          >
            Envoyer la demande
          </button>
        </form>

        <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 text-slate-200">
          <h2 className="text-2xl font-semibold text-white">Contact direct</h2>
          <p>WhatsApp, téléphone ou e-mail : nous répondons rapidement pour lancer la discussion.</p>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>WhatsApp : +33 6 00 00 00 00</li>
            <li>Téléphone : +33 1 00 00 00 00</li>
            <li>Email : contact@smove.agency</li>
          </ul>
          <div className="pt-2 text-sm text-slate-400">Nous ajoutons la carte et les liens sociaux plus tard.</div>
        </div>
      </section>
    </div>
  );
}
