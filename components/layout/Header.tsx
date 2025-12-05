// file: components/layout/Header.tsx
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
  { href: "/portfolio", label: "Portfolio" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const toggleMenu = () => setOpen((prev) => !prev);

  return (
    <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight text-white">
          SMOVE Communication
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-slate-200 md:flex" aria-label="Navigation principale">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                className={`relative transition hover:text-white ${isActive ? "text-emerald-300" : ""}`}
                href={link.href}
              >
                {link.label}
                {isActive ? <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-emerald-400" /> : null}
              </Link>
            );
          })}
          <Button href="/contact" className="ml-4" variant="secondary">
            Brief gratuit
          </Button>
        </nav>

        <button
          className="inline-flex items-center justify-center rounded-lg border border-slate-800 px-3 py-2 text-slate-100 md:hidden"
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
            className="border-t border-slate-800 bg-slate-950 md:hidden"
          >
            <Container className="flex flex-col gap-4 py-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`text-sm font-semibold transition hover:text-white ${isActive ? "text-emerald-300" : "text-slate-200"}`}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Button href="/contact" onClick={() => setOpen(false)}>
                Nous écrire
              </Button>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
