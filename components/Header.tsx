"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen((prev) => !prev);
  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-40 border-b border-amber-200/70 bg-amber-50/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#hero" className="flex items-center gap-3" onClick={close}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-700 text-lg font-bold text-white shadow-lg shadow-blue-500/30">
            S
          </div>
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="text-sm font-semibold text-slate-900">SMOVE Communication</span>
            <span className="text-xs text-blue-800">We do the work for you</span>
          </div>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-slate-900">
          <ul className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition hover:text-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="#contact"
            className="hidden items-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 md:inline-flex"
          >
            Book a call
          </Link>
          <button
            type="button"
            onClick={toggle}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-blue-700/30 bg-white text-blue-800 shadow-sm shadow-blue-500/20 transition hover:-translate-y-0.5 hover:border-blue-700 md:hidden"
            aria-label="Toggle navigation"
            aria-expanded={open}
          >
            <span className="sr-only">Toggle navigation</span>
            <div className="space-y-1.5">
              <span className="block h-0.5 w-6 rounded-full bg-blue-800" />
              <span className="block h-0.5 w-6 rounded-full bg-blue-800" />
              <span className="block h-0.5 w-6 rounded-full bg-blue-800" />
            </div>
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden"
          >
            <div className="mx-auto max-w-6xl px-6 pb-6">
              <div className="rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-lg shadow-amber-200/60">
                <ul className="space-y-3 text-sm font-semibold text-slate-900">
                  {navLinks.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-amber-50"
                        onClick={close}
                      >
                        <span>{item.label}</span>
                        <span className="h-2 w-2 rounded-full bg-blue-700" aria-hidden />
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="#contact"
                  onClick={close}
                  className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-600"
                >
                  Book a call
                </Link>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
