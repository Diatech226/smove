// file: app/contact/page.tsx
import type { Metadata } from "next";
import ContactPageContent from "@/components/pages/ContactPageContent";
import { createMetadata } from "@/lib/config/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact – SMOVE Communication",
  description: "Discutons de vos objectifs digitaux : brief, devis ou accompagnement sur mesure, l'équipe SMOVE vous répond.",
  path: "/contact",
});

export default function ContactPage() {
  return <ContactPageContent />;
}
