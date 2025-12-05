import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function LegalPage() {
  return (
    <div className="bg-slate-950 pb-16 pt-10">
      <Container className="space-y-10">
        <SectionHeader eyebrow="Mentions légales" title="Informations légales" />

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Mentions légales</h3>
            <p className="text-slate-200">
              SMOVE Communication, agence de communication digitale basée à Ouagadougou. Directeur de la publication : Aïcha
              Traoré. Hébergement : plateforme cloud européenne.
            </p>
            <p className="text-slate-300">
              Les contenus présents sur ce site sont la propriété de SMOVE Communication. Toute reproduction est soumise à
              autorisation écrite.
            </p>
          </Card>

          <Card className="space-y-3">
            <h3 className="text-xl font-semibold text-white">Politique de confidentialité</h3>
            <p className="text-slate-200">
              Les formulaires collectent les informations nécessaires pour répondre à vos demandes. Les données ne sont ni
              vendues ni partagées avec des tiers sans votre accord.
            </p>
            <p className="text-slate-300">
              Vous pouvez exercer vos droits d'accès, de rectification et de suppression en nous écrivant à contact@smove.agency.
            </p>
          </Card>
        </div>
      </Container>
    </div>
  );
}
