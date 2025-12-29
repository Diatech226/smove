// file: lib/config/seo.ts
import type { Metadata } from "next";

export const siteConfig = {
  name: "SMOVE Communication",
  shortName: "SMOVE",
  description:
    "SMOVE Communication est une agence digitale basée au Burkina Faso. Nous concevons des stratégies créatives, des campagnes social media et des expériences immersives pour aider les marques à croître durablement. Notre équipe pilote vos contenus, vos assets et vos performances pour générer des résultats mesurables.",
  url: "https://smove.example.com",
  locale: "fr_FR",
  twitterHandle: "@smovecommunication",
};

type CreateMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  metadataBase?: string;
  siteName?: string;
  ogImage?: string | null;
};

export function createMetadata({
  title,
  description,
  path,
  type = "website",
  metadataBase,
  siteName,
  ogImage,
}: CreateMetadataOptions = {}): Metadata {
  const resolvedTitle = title ?? siteConfig.name;
  const resolvedDescription = description ?? siteConfig.description;
  const baseUrl = resolveUrl(metadataBase ?? siteConfig.url);
  const url = baseUrl ? new URL(path ?? "", baseUrl).toString() : siteConfig.url;
  const resolvedSiteName = siteName ?? siteConfig.name;
  const images = [ogImage ?? "/og-default.png"];

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    metadataBase: baseUrl ?? undefined,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: resolvedSiteName,
      locale: siteConfig.locale,
      type,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      site: siteConfig.twitterHandle,
      images,
    },
  };
}

function resolveUrl(value: string): URL | null {
  try {
    return new URL(value);
  } catch (error) {
    console.warn("Invalid metadata base URL", { value, error });
    return null;
  }
}
