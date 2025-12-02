import Link from "next/link";

const navLinks = [
  { href: "#hero", label: "Home" },
  { href: "#services", label: "Services" },
  { href: "#portfolio", label: "Portfolio" },
  { href: "#process", label: "Process" },
  { href: "#contact", label: "Contact" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-950/70 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="#hero" className="flex items-center gap-2 text-lg font-semibold">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-400 to-violet-500 text-slate-950 font-semibold shadow-lg shadow-cyan-500/30">
            N
          </span>
          <span className="hidden text-base tracking-tight text-slate-100 sm:inline">
            NovaDigital Studio
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-200">
          <ul className="hidden items-center gap-6 md:flex">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition hover:text-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-400"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="#contact"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_25px_rgba(8,145,178,0.25)] transition hover:-translate-y-0.5 hover:border-cyan-200 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
          >
            Book a call
          </Link>
        </nav>
      </div>
    </header>
  );
}
