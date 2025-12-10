// file: app/portfolio/[slug]/page.tsx
import type { Metadata } from "next";
import { redirect } from "next/navigation";

interface ProjectPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  return {
    title: `Projet ${params.slug} – redirection vers /projects/${params.slug}`,
  };
}

export default function LegacyPortfolioRedirect({ params }: ProjectPageProps) {
  redirect(`/projects/${params.slug}`);
}
