// file: app/not-found.tsx
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function NotFoundPage() {
  return (
    <div className="bg-slate-950 pb-16 pt-24">
      <Container>
        <Card className="mx-auto max-w-3xl space-y-8 text-center">
          <SectionHeader
            title="Page introuvable"
            subtitle="Cette page n'existe pas ou a changé d'adresse. Mais la créativité est toujours là."
            align="center"
          />
          <p className="text-slate-200">
            Revenez à l'accueil pour explorer nos projets, nos services et notre univers. On garde une place pour votre idée !
          </p>
          <div className="flex justify-center">
            <Button href="/">Retourner à l'accueil</Button>
          </div>
        </Card>
      </Container>
    </div>
  );
}
