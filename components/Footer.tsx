export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-8 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-blue-900">SMOVE Communication</p>
          <p className="mt-1 text-xs text-slate-500">We do the work for you—social, ads, creative, and reporting.</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs uppercase tracking-wide text-slate-500">
          <a className="transition hover:text-blue-800" href="#services">
            Services
          </a>
          <a className="transition hover:text-blue-800" href="#portfolio">
            Portfolio
          </a>
          <a className="transition hover:text-blue-800" href="#testimonials">
            Testimonials
          </a>
          <a className="transition hover:text-blue-800" href="#contact">
            Contact
          </a>
        </div>
        <p className="text-xs text-slate-500">© {new Date().getFullYear()} SMOVE Communication. All rights reserved.</p>
      </div>
    </footer>
  );
}
