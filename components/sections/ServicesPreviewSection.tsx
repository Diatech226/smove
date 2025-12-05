import Link from "next/link";

const services = [
  { title: "Communication digitale", desc: "Social media, campagnes multicanal, influence." },
  { title: "Design & branding", desc: "Identité visuelle, charte, storytelling de marque." },
  { title: "Audiovisuel", desc: "Production vidéo, captation, photographie." },
  { title: "Web & multimédia", desc: "Sites vitrines, landing pages, expériences interactives." },
  { title: "Motion design / 3D", desc: "Animations, motion graphics, environnements 3D." },
];

export default function ServicesPreviewSection() {
  return (
    <section className="border-b border-slate-800 bg-slate-950 py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Services</p>
            <h2 className="text-3xl font-semibold text-white">Tout ce qu'il faut pour faire bouger votre marque.</h2>
          </div>
          <Link
            href="/services"
            className="text-sm font-semibold text-emerald-300 transition hover:text-emerald-200"
          >
            Voir tous les services →
          </Link>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {services.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-slate-800 bg-slate-900/50 px-5 py-6 shadow-lg shadow-black/20"
            >
              <h3 className="text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-2 text-slate-200">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
