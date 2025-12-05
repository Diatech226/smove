// file: app/page.tsx
import type { Metadata } from "next";
import HomePageContent from "@/components/pages/HomePageContent";
import { createMetadata, siteConfig } from "@/lib/config/seo";

export const metadata: Metadata = createMetadata({
  title: "SMOVE Communication – Agence de communication digitale",
  description: siteConfig.description,
  path: "/",
});

export default function HomePage() {
  return <HomePageContent />;
}
