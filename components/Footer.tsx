export default function Footer() {
  return (
    <footer className="border-t border-amber-200 bg-amber-50/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-700 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-slate-900">SMOVE Communication</p>
          <p className="mt-1 text-xs text-blue-800">We do the work for you.</p>
        </div>
        <div className="flex gap-4 text-xs uppercase tracking-wide text-blue-800">
          <a className="transition hover:text-slate-900" href="#services">
            Services
          </a>
          <a className="transition hover:text-slate-900" href="#portfolio">
            Portfolio
          </a>
          <a className="transition hover:text-slate-900" href="#contact">
            Contact
          </a>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} SMOVE Communication. All rights reserved.</p>
      </div>
    </footer>
  );
}
