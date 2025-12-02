export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-100">NovaDigital Studio</p>
          <p className="mt-1 text-xs text-slate-500">
            Crafted for modern brands that want performance and presence.
          </p>
        </div>
        <div className="flex gap-4 text-xs uppercase tracking-wide text-slate-500">
          <a className="transition hover:text-cyan-200" href="#services">
            Services
          </a>
          <a className="transition hover:text-cyan-200" href="#portfolio">
            Portfolio
          </a>
          <a className="transition hover:text-cyan-200" href="#contact">
            Contact
          </a>
        </div>
        <p className="text-xs text-slate-600">© {new Date().getFullYear()} NovaDigital Studio. All rights reserved.</p>
      </div>
    </footer>
  );
}
