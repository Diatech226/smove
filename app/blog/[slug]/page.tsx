import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { posts } from "@/lib/config/posts";
import { createMetadata } from "@/lib/config/seo";

function formatDate(dateString: string) {
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "long" }).format(new Date(dateString));
}

type BlogPostPageProps = {
  params: { slug: string };
};

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = posts.find((item) => item.slug === params.slug);

  if (!post) {
    return createMetadata({
      title: "Article introuvable – SMOVE Communication",
      description: "Le contenu demandé n'est plus disponible.",
      path: `/blog/${params.slug}`,
      type: "article",
    });
  }

  return createMetadata({
    title: `${post.title} – SMOVE Communication`,
    description:
      post.excerpt || "Découvrez les insights et retours d'expérience de l'équipe SMOVE Communication.",
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = posts.find((item) => item.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-slate-950 pb-16 pt-10">
      <Container className="space-y-8">
        <SectionHeader
          eyebrow="Article"
          title={post.title}
          subtitle={formatDate(post.date)}
        />

        <div className="space-y-4 text-lg text-slate-200">
          <p>{post.content}</p>
          <p>
            Chez SMOVE Communication, nous combinons stratégie éditoriale, production créative et pilotage des campagnes pour
            transformer ces idées en résultats concrets.
          </p>
        </div>
      </Container>
    </div>
  );
}
