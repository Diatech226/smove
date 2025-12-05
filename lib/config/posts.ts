export type Post = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags?: string[];
  content?: string;
};

export const posts: Post[] = [
  {
    slug: "tendances-social-media-2024",
    title: "Tendances social media 2024",
    date: "2024-01-12",
    excerpt:
      "Les formats courts, l'UGC et l'IA générative redessinent la manière de capter l'attention des audiences.",
    tags: ["social media", "tendances"],
    content:
      "Les communautés recherchent des expériences plus authentiques. Combinez contenus créateurs, angles éditoriaux clairs et une activation media agile pour rester top of mind.",
  },
  {
    slug: "aligner-branding-et-performance",
    title: "Aligner branding et performance",
    date: "2023-12-02",
    excerpt:
      "Branding et performance ne sont pas opposés : avec des assets cohérents, chaque campagne nourrit le capital de marque.",
    tags: ["branding", "acquisition"],
    content:
      "Nous privilégions des messages clairs, des variations créatives testées et un suivi des KPIs pour mesurer l'impact global de chaque activation.",
  },
  {
    slug: "coulisses-tournage-smove",
    title: "Les coulisses d'un tournage SMOVE",
    date: "2023-11-18",
    excerpt:
      "De la pré-prod au montage, un aperçu de notre façon de collaborer avec les équipes marketing et les talents.",
    tags: ["audiovisuel", "making-of"],
    content:
      "Storyboard précis, logistique millimétrée et direction artistique alignée avec la marque : c'est ainsi que nous livrons des tournages efficaces.",
  },
  {
    slug: "refonte-site-b2b",
    title: "Comment réussir une refonte de site B2B",
    date: "2024-02-05",
    excerpt:
      "Un site B2B performant combine preuve sociale, parcours clair et démonstrations concrètes.",
    tags: ["web", "B2B"],
    content:
      "Nous concevons des pages qui rassurent et convertissent : hierarchisation des preuves, CTA visibles et intégration des signaux de confiance.",
  },
];
