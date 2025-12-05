import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createMetadata, siteConfig } from "@/lib/config/seo";

export const metadata: Metadata = createMetadata({
  title: `${siteConfig.name} – Agence de communication digitale`,
  description: siteConfig.description,
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
