"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/about", label: "À propos" },
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projets" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

type HeaderProps = {
  siteName: string;
  logoUrl?: string | null;
};

export default function Header({ siteName, logoUrl }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3 text-lg font-semibold tracking-tight text-white">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-10 w-10 rounded-xl object-contain" />
          ) : (
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-500/15 text-sm font-semibold text-sky-200">
              SM
            </span>
          )}
          <span>{siteName}</span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-slate-200 lg:flex" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                className={`relative transition hover:text-white ${isActive ? "text-sky-200" : ""}`}
                href={link.href}
              >
                {link.label}
                {isActive ? <span className="absolute -bottom-2 left-0 h-0.5 w-full bg-sky-400" /> : null}
              </Link>
            );
          })}
          <Button href="/contact" className="ml-2" variant="primary">
            Lancer un brief
          </Button>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-full border border-white/10 bg-white/5 px-4 py-2 text-slate-100 lg:hidden"
          aria-label={open ? "Fermer la navigation" : "Ouvrir la navigation"}
          aria-expanded={open}
          onClick={toggleMenu}
          type="button"
        >
          {open ? "✕" : "☰"}
        </button>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/10 bg-slate-950 lg:hidden"
          >
            <Container className="flex flex-col gap-4 py-6">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition hover:text-white ${isActive ? "text-sky-200" : "text-slate-200"}`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button href="/contact" onClick={() => setOpen(false)}>
                Parler à l'équipe
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
