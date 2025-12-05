import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { createMetadata } from "@/lib/config/seo";

export const metadata: Metadata = createMetadata({
  title: "À propos – SMOVE Communication",
  description:
    "Découvrez l'équipe SMOVE Communication, notre vision et notre manière d'orchestrer des campagnes créatives et efficaces.",
  path: "/about",
});

const valeurs = [
  { titre: "Vision", texte: "Mettre en mouvement les marques africaines avec des idées qui voyagent et performent." },
  {
    titre: "Mission",
    texte: "Allier créativité, technologie et data pour délivrer des campagnes qui génèrent de l'impact mesurable.",
  },
  {
    titre: "Valeurs",
    texte: "Curiosité, exigence, esprit d'équipe et transparence guident chaque collaboration avec nos clients.",
  },
];

const equipe = [
  {
    nom: "Aïcha Traoré",
    role: "Fondatrice & Directrice de création",
    bio: "Stratège de marque et directrice artistique, elle pilote les concepts créatifs et l'expérience globale.",
  },
  {
    nom: "Marc Kaboré",
    role: "Lead digital & média",
    bio: "Expert social media et paid, il orchestre les plans de diffusion et la performance des campagnes.",
  },
  {
    nom: "Inès Ouédraogo",
    role: "Productrice audiovisuelle",
    bio: "Coordonne les tournages, motion design et post-production pour des livrables prêts à diffuser.",
  },
  {
    nom: "Yann Diallo",
    role: "Designer interactif",
    bio: "Conçoit des expériences web et 3D qui valorisent les produits et les équipes de nos clients.",
  },
];

export default function AboutPage() {
  return (
    <div className="bg-slate-950 pb-16 pt-10">
      <Container className="space-y-12">
        <SectionHeader
          eyebrow="À propos"
          title="L'agence SMOVE Communication"
          subtitle="Nous accompagnons les marques qui veulent passer de l'idée à l'impact, en combinant stratégie, production et pilotage."
        />

        <Card className="space-y-3">
          <h3 className="text-xl font-semibold text-white">Histoire</h3>
          <p className="text-lg text-slate-200">
            Née à Ouagadougou, SMOVE Communication est une agence indépendante qui réunit créatifs, stratèges et technophiles
            autour d'un objectif : raconter des histoires fortes et les rendre visibles auprès des bonnes audiences.
          </p>
          <p className="text-slate-300">
            Nous travaillons avec des entreprises locales et internationales pour imaginer des campagnes qui respectent leur ADN
            tout en osant des dispositifs innovants.
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {valeurs.map((item) => (
            <Card key={item.titre} className="space-y-2">
              <h4 className="text-lg font-semibold text-white">{item.titre}</h4>
              <p className="text-slate-200">{item.texte}</p>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <SectionHeader
            eyebrow="Équipe"
            title="Une équipe agile et complémentaire"
            subtitle="Production, design, stratégie : nous rassemblons les compétences nécessaires pour dérouler vos projets de bout en bout."
          />
          <div className="grid gap-4 md:grid-cols-2">
            {equipe.map((profil) => (
              <Card key={profil.nom} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xl font-semibold text-white">{profil.nom}</h5>
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-200">{profil.role}</span>
                </div>
                <p className="text-slate-200">{profil.bio}</p>
              </Card>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
