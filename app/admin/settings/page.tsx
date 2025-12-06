// file: app/admin/settings/page.tsx
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Card } from "@/components/ui/Card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Paramètres"
        subtitle="Préparez les futures configurations de la plateforme."
      />

      <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
        <h2 className="text-lg font-semibold text-white">Espace à venir</h2>
        <p className="mt-2 text-sm text-slate-300">
          Cette section accueillera bientôt les paramètres de branding, les réglages SEO
          spécifiques et les intégrations (analytics, CRM, email). L'architecture actuelle
          facilite le branchement futur sur une base de données ou un CMS headless.
        </p>
      </Card>
    </div>
  );
}
