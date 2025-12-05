import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="border-b border-slate-800 bg-gradient-to-b from-slate-900 via-slate-950 to-black py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center rounded-full bg-slate-800/60 px-4 py-2 text-xs font-medium uppercase tracking-wide text-slate-200">
            Agence créative 360°
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl">
              Nous gérons votre communication digitale de A à Z.
            </h1>
            <p className="text-lg text-slate-200">
              SMOVE Communication imagine, produit et déploie vos campagnes digitales.
              We do the work for you.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:-translate-y-0.5 hover:bg-emerald-400"
            >
              Contact
            </Link>
            <Link
              href="/portfolio"
              className="rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-400"
            >
              Voir le portfolio
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-slate-700 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-emerald-400"
            >
              Demande de devis
            </Link>
          </div>
        </div>
        <div className="w-full max-w-md flex-1 rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-800 via-slate-900 to-emerald-500/20 p-6 text-center text-slate-200 shadow-xl shadow-emerald-500/20">
          <div className="flex h-full flex-col items-center justify-center rounded-2xl border border-dashed border-emerald-400/50 bg-slate-950/60 p-6">
            <span className="text-sm uppercase tracking-[0.2em] text-emerald-300">Bientôt</span>
            <p className="mt-3 text-xl font-semibold text-white">Future 3D hero ici</p>
            <p className="mt-2 text-sm text-slate-400">Canvas interactif en cours de préparation</p>
          </div>
        </div>
      </div>
    </section>
  );
}
