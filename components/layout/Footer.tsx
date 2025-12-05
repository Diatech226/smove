import Link from "next/link";
import { Container } from "@/components/ui/Container";

const currentYear = new Date().getFullYear();

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/legal", label: "Mentions légales" },
];

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 text-slate-200">
      <Container className="grid gap-8 px-6 py-10 md:grid-cols-3">
        <div className="space-y-3">
          <p className="text-lg font-semibold text-white">SMOVE Communication</p>
          <p className="text-sm text-slate-300">
            Agence de communication digitale basée à Ouagadougou. Nous créons des contenus, des expériences et des campagnes
            qui font avancer vos objectifs business.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Navigation</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-200">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link className="transition hover:text-white hover:underline" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-200">Réseaux</h4>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="#" className="rounded-full bg-slate-800 px-3 py-2 transition hover:bg-slate-700">
              Facebook
            </Link>
            <Link href="#" className="rounded-full bg-slate-800 px-3 py-2 transition hover:bg-slate-700">
              Instagram
            </Link>
            <Link href="#" className="rounded-full bg-slate-800 px-3 py-2 transition hover:bg-slate-700">
              LinkedIn
            </Link>
          </div>
          <p className="text-xs text-slate-400">© {currentYear} SMOVE Communication. Tous droits réservés.</p>
        </div>
      </Container>
    </footer>
  );
}
