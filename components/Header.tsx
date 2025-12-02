"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";

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

  const closeMenu = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#hero" className="flex items-center gap-3" onClick={closeMenu}>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-yellow-200 to-white text-base font-semibold text-blue-800 shadow-[0_10px_40px_rgba(234,179,8,0.35)]">
            SM
          </span>
          <div className="leading-tight">
            <p className="text-sm font-semibold text-blue-900">SMOVE Communication</p>
            <p className="text-xs text-slate-500">We do the work for you</p>
          </div>
        </Link>

        <nav className="flex items-center gap-4 text-sm font-medium text-slate-700">
          <ul className="hidden items-center gap-6 lg:flex">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition hover:text-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="#contact"
            className="hidden items-center gap-2 rounded-full bg-blue-800 px-4 py-2 text-sm font-semibold text-yellow-200 shadow-[0_10px_45px_rgba(30,64,175,0.35)] transition hover:-translate-y-0.5 hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-500 lg:inline-flex"
          >
            Book a call
          </Link>
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-300 bg-white text-blue-900 shadow-sm shadow-amber-200/50 transition hover:-translate-y-0.5 hover:border-blue-600 lg:hidden"
            aria-label="Toggle menu"
          >
            <div className="flex flex-col items-center gap-1.5">
              <span className={`h-0.5 w-6 rounded-full bg-current transition ${open ? "translate-y-1.5 rotate-45" : ""}`} />
              <span className={`h-0.5 w-6 rounded-full bg-current transition ${open ? "opacity-0" : ""}`} />
              <span className={`h-0.5 w-6 rounded-full bg-current transition ${open ? "-translate-y-1.5 -rotate-45" : ""}`} />
            </div>
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="lg:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 pb-6 text-base font-medium text-blue-900">
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-5 py-4 text-sm text-slate-700 shadow-lg shadow-yellow-200/50">
                We handle your social, ads, and content so you can stay focused.
              </div>
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-3 shadow-sm shadow-amber-100/80 transition hover:-translate-y-0.5 hover:border-blue-700 hover:text-blue-800"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={closeMenu}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-800 px-5 py-3 text-sm font-semibold text-yellow-200 shadow-lg shadow-blue-500/30 transition hover:-translate-y-0.5 hover:bg-blue-700"
              >
                Book a call
              </Link>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
