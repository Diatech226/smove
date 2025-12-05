export type Project = {
  slug: string;
  client: string;
  title: string;
  sector: string;
  summary: string;
  results?: string[];
};

export const projects: Project[] = [
  {
    slug: "lancement-application-mobilite",
    client: "MoveCity",
    title: "Lancement d'une application de mobilité urbaine",
    sector: "Tech & mobilité",
    summary:
      "Création de l'identité, campagne social media et production vidéo pour générer de l'adoption dès le lancement.",
    results: [
      "+35% d'inscriptions la première semaine",
      "Campagne vidéo vue 250K fois en organique",
      "Taux de conversion landing page à 6,8%",
    ],
  },
  {
    slug: "rebranding-marque-agro",
    client: "TerraNova",
    title: "Rebranding d'une marque agroalimentaire",
    sector: "Agroalimentaire",
    summary:
      "Refonte globale de la plateforme de marque, design packaging et plan média digital pour moderniser l'image.",
    results: [
      "Identité unifiée sur 40 références",
      "Hausse de 22% de la notoriété assistée",
      "+15% de ventes en GMS sur 3 mois",
    ],
  },
  {
    slug: "campagne-evenementielle",
    client: "Festival Lumières",
    title: "Campagne évènementielle immersive",
    sector: "Culture & événementiel",
    summary:
      "Direction artistique, motion design et activation influenceurs pour une édition record.",
    results: [
      "12M d'impressions sur les réseaux",
      "80% des billets vendus en prévente",
      "+40% d'engagement vs édition précédente",
    ],
  },
  {
    slug: "programme-employee-advocacy",
    client: "Finexa",
    title: "Programme d'employee advocacy",
    sector: "Services financiers",
    summary:
      "Formation, kit de contenus et animation éditoriale pour transformer les équipes en ambassadeurs.",
    results: [
      "x3 sur la portée LinkedIn des dirigeants",
      "Pipeline commercial +18% attribué au social",
    ],
  },
  {
    slug: "experience-3d-produit",
    client: "NovaTech",
    title: "Expérience 3D de démonstration produit",
    sector: "Industrie & innovation",
    summary:
      "Scénarisation 3D temps réel pour permettre aux clients de manipuler le produit en ligne.",
    results: [
      "Temps passé sur page multiplié par 4",
      "+12% de demandes de démo",
    ],
  },
];
