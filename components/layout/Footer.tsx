import Link from "next/link";

const currentYear = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 text-slate-200">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-sm text-slate-400">
          © {currentYear} SMOVE Communication. Tous droits réservés.
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link className="hover:text-white hover:underline" href="/contact">
            Contact
          </Link>
          <Link className="hover:text-white hover:underline" href="/legal">
            Mentions légales
          </Link>
          <div className="flex items-center gap-3 text-slate-400">
            <span className="text-xs uppercase tracking-wide">Suivez-nous</span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-slate-800 px-2 py-1 text-xs">Facebook</span>
              <span className="rounded-full bg-slate-800 px-2 py-1 text-xs">Instagram</span>
              <span className="rounded-full bg-slate-800 px-2 py-1 text-xs">LinkedIn</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
