import Link from "next/link";
import { Container } from "@/components/ui/Container";
import type { ContactSettings, SocialLinks } from "@/lib/siteSettings";

const currentYear = new Date().getFullYear();

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/legal", label: "Mentions légales" },
];

const socialLabels: Record<keyof SocialLinks, string> = {
  facebook: "Facebook",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  youtube: "YouTube",
  twitter: "Twitter",
  whatsapp: "WhatsApp",
};

type FooterProps = {
  siteName: string;
  siteTagline: string;
  socialLinks: SocialLinks;
  contact: ContactSettings;
};

export default function Footer({ siteName, siteTagline, socialLinks, contact }: FooterProps) {
  const socialItems = (Object.keys(socialLabels) as (keyof SocialLinks)[])
    .map((key) => ({
      key,
      label: socialLabels[key],
      href: socialLinks[key],
    }))
    .filter((item) => item.href);

  return (
    <footer className="border-t border-white/10 bg-slate-950/90 text-slate-200">
      <Container className="grid gap-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-xl font-semibold text-white">{siteName}</p>
          <p className="text-sm text-slate-300">{siteTagline}</p>
          <div className="flex flex-wrap gap-3 text-xs text-slate-400">
            {contact.email ? <span>{contact.email}</span> : null}
            {contact.phone ? <span>{contact.phone}</span> : null}
            {contact.address ? <span>{contact.address}</span> : null}
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 text-sm font-semibold text-sky-200 transition hover:text-sky-100"
          >
            Demander un devis →
          </Link>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">Navigation</h4>
          <ul className="mt-4 grid grid-cols-2 gap-2 text-sm text-slate-200">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link className="transition hover:text-white" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-200">Réseaux</h4>
          <div className="flex flex-wrap gap-3 text-sm">
            {socialItems.length ? (
              socialItems.map((item) => (
                <Link
                  key={item.key}
                  href={item.href ?? "#"}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-2 transition hover:border-sky-400/60 hover:text-white"
                >
                  {item.label}
                </Link>
              ))
            ) : (
              <span className="text-xs text-slate-400">Aucun réseau configuré.</span>
            )}
          </div>
          <p className="text-xs text-slate-500">© {currentYear} {siteName}. Tous droits réservés.</p>
        </div>
      </Container>
    </footer>
  );
}
