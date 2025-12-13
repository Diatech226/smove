import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createMetadata, siteConfig } from "@/lib/config/seo";

const baseMetadata = createMetadata({
  title: `${siteConfig.name} – Agence de communication digitale`,
  description: siteConfig.description,
});

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
};

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
