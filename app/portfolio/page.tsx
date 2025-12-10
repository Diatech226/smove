// file: app/portfolio/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Portfolio – SMOVE Communication",
  description: "Les projets SMOVE sont désormais disponibles dans la section Projets.",
};

export default function PortfolioRedirectPage() {
  redirect("/projects");
}
