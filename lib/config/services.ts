export type Service = {
  id: string;
  name: string;
  category?: string;
  description: string;
};

export const services: Service[] = [
  {
    id: "communication-digitale",
    name: "Communication digitale",
    category: "Stratégie",
    description:
      "Stratégie de contenu, gestion des réseaux sociaux, campagnes multicanales.",
  },
  {
    id: "design-branding",
    name: "Design & branding",
    category: "Identité",
    description:
      "Identité visuelle, logos, chartes graphiques et supports de marque.",
  },
  {
    id: "audiovisuel",
    name: "Audiovisuel",
    category: "Production",
    description: "Spots vidéo, capsules sociales, captation d’événements.",
  },
  {
    id: "web-multimedia",
    name: "Web & multimédia",
    category: "Digital",
    description: "Sites vitrines, pages de vente, expériences interactives.",
  },
  {
    id: "motion-3d",
    name: "Motion design & 3D",
    category: "Création",
    description:
      "Animations, habillages vidéo, contenus 3D pour les réseaux sociaux.",
  },
];
