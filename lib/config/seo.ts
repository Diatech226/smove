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
};

export function createMetadata({
  title,
  description,
  path,
  type = "website",
}: CreateMetadataOptions = {}): Metadata {
  const resolvedTitle = title ?? siteConfig.name;
  const resolvedDescription = description ?? siteConfig.description;
  const url = new URL(path ?? "", siteConfig.url).toString();

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
      type,
      images: ["/og-default.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      site: siteConfig.twitterHandle,
      images: ["/og-default.png"],
    },
  };
}
