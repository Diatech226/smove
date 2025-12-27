import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { createMetadata, siteConfig } from "@/lib/config/seo";
import { getSiteSettings } from "@/lib/siteSettings";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const title = settings.seo.defaultTitle ?? settings.siteName;
  const description = settings.seo.defaultDescription ?? settings.siteTagline;
  const metadataBase = settings.seo.metadataBase ?? process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;
  const ogImage = settings.seo.ogImage ?? settings.logo ?? null;

  return {
    ...createMetadata({
      title,
      description,
      metadataBase,
      siteName: settings.siteName,
      ogImage,
    }),
    icons: {
      icon: settings.favicon ?? "/favicon.ico",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSiteSettings();

  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-950 text-slate-50 flex flex-col">
        <Header siteName={settings.siteName} logoUrl={settings.logo} />
        <main className="flex-1">{children}</main>
        <Footer siteName={settings.siteName} siteTagline={settings.siteTagline} socialLinks={settings.socialLinks} />
      </body>
    </html>
  );
}
