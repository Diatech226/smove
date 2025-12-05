import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export default function ContactPage() {
  return (
    <div className="bg-slate-950 pb-16 pt-10">
      <Container className="space-y-10">
        <SectionHeader
          eyebrow="Contact"
          title="Parlons de vos objectifs"
          subtitle="Un brief, une idée, une urgence ? Écrivons ensemble la prochaine étape de votre communication."
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <form className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white" htmlFor="nom">
                    Nom
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="Votre nom complet"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="vous@email.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white" htmlFor="telephone">
                    Téléphone / WhatsApp
                  </label>
                  <input
                    id="telephone"
                    name="telephone"
                    type="tel"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="+226 ..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-white" htmlFor="sujet">
                    Sujet
                  </label>
                  <input
                    id="sujet"
                    name="sujet"
                    type="text"
                    className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                    placeholder="Campagne social media, tournage..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-white" htmlFor="message">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  required
                  className="w-full rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/40"
                  placeholder="Dites-nous en plus sur votre besoin"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit">Envoyer le message</Button>
              </div>
            </form>
          </Card>

          <Card className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Contact direct</h3>
            <p className="text-slate-200">
              Vous préférez échanger immédiatement ? Appelez-nous ou écrivez-nous sur WhatsApp.
            </p>
            <div className="space-y-2 text-slate-100">
              <p>+226 60 67 32 42</p>
              <p>+226 67 42 35 40</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href="https://wa.me/22660673242" variant="secondary">
                WhatsApp
              </Button>
              <Button href="mailto:contact@smove.agency" variant="ghost">
                contact@smove.agency
              </Button>
            </div>
          </Card>
        </div>
      </Container>
    </div>
  );
}
