"use client";

import { FormEvent, useEffect, useState, type ReactNode } from "react";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { SiteSettings } from "@/lib/siteSettings";

const emptyForm: SiteSettingsForm = {
  siteName: "",
  siteTagline: "",
  logo: "",
  favicon: "",
  primaryColor: "",
  secondaryColor: "",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    tiktok: "",
    youtube: "",
    twitter: "",
    whatsapp: "",
  },
  contact: {
    email: "",
    phone: "",
    address: "",
  },
  seo: {
    metadataBase: "",
    defaultTitle: "",
    defaultDescription: "",
    ogImage: "",
  },
  blog: {
    featuredCategory: "",
    postsPerPage: 9,
  },
  homepage: {
    featuredServicesCategory: "",
    featuredProjectsCategory: "",
  },
};

type SiteSettingsForm = {
  siteName: string;
  siteTagline: string;
  logo: string;
  favicon: string;
  primaryColor: string;
  secondaryColor: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    tiktok: string;
    youtube: string;
    twitter: string;
    whatsapp: string;
  };
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  seo: {
    metadataBase: string;
    defaultTitle: string;
    defaultDescription: string;
    ogImage: string;
  };
  blog: {
    featuredCategory: string;
    postsPerPage: number;
  };
  homepage: {
    featuredServicesCategory: string;
    featuredProjectsCategory: string;
  };
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState<SiteSettingsForm>(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/admin/settings");
        const data = await response.json();
        if (!response.ok || data?.success === false) {
          setError(data?.error || "Impossible de charger les paramètres.");
          return;
        }
        setForm(mapSettingsToForm(data.settings));
        setError(null);
      } catch (fetchError) {
        console.error(fetchError);
        setError("Impossible de charger les paramètres. Réessayez plus tard.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setStatusMessage(null);
    setError(null);

    try {
      const payload = {
        ...form,
        blog: {
          ...form.blog,
          postsPerPage: Number(form.blog.postsPerPage) || 1,
        },
      };

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok || data?.success === false) {
        setError(data?.error || "Impossible de sauvegarder les paramètres.");
        return;
      }

      setForm(mapSettingsToForm(data.settings));
      setStatusMessage("Paramètres sauvegardés avec succès.");
    } catch (submitError) {
      console.error(submitError);
      setError("Impossible de sauvegarder les paramètres.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Paramètres"
        subtitle="Configurez l'identité du site, la communication et le SEO."
        actions={
          <Button type="submit" form="settings-form" disabled={saving}>
            {saving ? "Sauvegarde..." : "Enregistrer"}
          </Button>
        }
      />

      {loading ? <p className="text-sm text-slate-200">Chargement des paramètres...</p> : null}
      {error ? <p className="text-sm text-rose-200">{error}</p> : null}
      {statusMessage ? <p className="text-sm text-emerald-200">{statusMessage}</p> : null}

      <form id="settings-form" className="space-y-6" onSubmit={handleSubmit}>
        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">Configuration du site</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Nom du site" id="siteName">
              <input
                id="siteName"
                value={form.siteName}
                onChange={(event) => setForm((prev) => ({ ...prev, siteName: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Accroche" id="siteTagline">
              <input
                id="siteTagline"
                value={form.siteTagline}
                onChange={(event) => setForm((prev) => ({ ...prev, siteTagline: event.target.value }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Logo (URL)" id="logo">
              <input
                id="logo"
                value={form.logo}
                onChange={(event) => setForm((prev) => ({ ...prev, logo: event.target.value }))}
                placeholder="https://.../logo.png"
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Favicon (URL)" id="favicon">
              <input
                id="favicon"
                value={form.favicon}
                onChange={(event) => setForm((prev) => ({ ...prev, favicon: event.target.value }))}
                placeholder="https://.../favicon.ico"
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Couleur principale" id="primaryColor">
              <input
                id="primaryColor"
                value={form.primaryColor}
                onChange={(event) => setForm((prev) => ({ ...prev, primaryColor: event.target.value }))}
                placeholder="#10b981"
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Couleur secondaire" id="secondaryColor">
              <input
                id="secondaryColor"
                value={form.secondaryColor}
                onChange={(event) => setForm((prev) => ({ ...prev, secondaryColor: event.target.value }))}
                placeholder="#0ea5e9"
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">Contact & réseaux sociaux</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Email" id="contactEmail">
              <input
                id="contactEmail"
                value={form.contact.email}
                onChange={(event) => setForm((prev) => ({ ...prev, contact: { ...prev.contact, email: event.target.value } }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Téléphone" id="contactPhone">
              <input
                id="contactPhone"
                value={form.contact.phone}
                onChange={(event) => setForm((prev) => ({ ...prev, contact: { ...prev.contact, phone: event.target.value } }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Adresse" id="contactAddress">
              <input
                id="contactAddress"
                value={form.contact.address}
                onChange={(event) => setForm((prev) => ({ ...prev, contact: { ...prev.contact, address: event.target.value } }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Facebook" id="facebook">
              <input
                id="facebook"
                value={form.socialLinks.facebook}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, facebook: event.target.value },
                  }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Instagram" id="instagram">
              <input
                id="instagram"
                value={form.socialLinks.instagram}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, instagram: event.target.value },
                  }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="LinkedIn" id="linkedin">
              <input
                id="linkedin"
                value={form.socialLinks.linkedin}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, linkedin: event.target.value },
                  }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="TikTok" id="tiktok">
              <input
                id="tiktok"
                value={form.socialLinks.tiktok}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, tiktok: event.target.value },
                  }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="YouTube" id="youtube">
              <input
                id="youtube"
                value={form.socialLinks.youtube}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, youtube: event.target.value },
                  }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Twitter / X" id="twitter">
              <input
                id="twitter"
                value={form.socialLinks.twitter}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, twitter: event.target.value },
                  }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="WhatsApp" id="whatsapp">
              <input
                id="whatsapp"
                value={form.socialLinks.whatsapp}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    socialLinks: { ...prev.socialLinks, whatsapp: event.target.value },
                  }))
                }
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
          <h2 className="text-lg font-semibold text-white">SEO par défaut</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="Metadata base" id="metadataBase">
              <input
                id="metadataBase"
                value={form.seo.metadataBase}
                onChange={(event) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, metadataBase: event.target.value } }))}
                placeholder="https://smove.example.com"
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Titre par défaut" id="defaultTitle">
              <input
                id="defaultTitle"
                value={form.seo.defaultTitle}
                onChange={(event) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, defaultTitle: event.target.value } }))}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Description par défaut" id="defaultDescription">
              <textarea
                id="defaultDescription"
                value={form.seo.defaultDescription}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, seo: { ...prev.seo, defaultDescription: event.target.value } }))
                }
                rows={3}
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
            <Field label="Image Open Graph" id="ogImage">
              <input
                id="ogImage"
                value={form.seo.ogImage}
                onChange={(event) => setForm((prev) => ({ ...prev, seo: { ...prev.seo, ogImage: event.target.value } }))}
                placeholder="https://.../og.png"
                className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
              />
            </Field>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
            <h2 className="text-lg font-semibold text-white">Blog</h2>
            <div className="mt-4 grid gap-4">
              <Field label="Catégorie mise en avant" id="featuredCategory">
                <input
                  id="featuredCategory"
                  value={form.blog.featuredCategory}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, blog: { ...prev.blog, featuredCategory: event.target.value } }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </Field>
              <Field label="Articles par page" id="postsPerPage">
                <input
                  id="postsPerPage"
                  type="number"
                  min={1}
                  max={50}
                  value={form.blog.postsPerPage}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      blog: { ...prev.blog, postsPerPage: Number(event.target.value) || 1 },
                    }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </Field>
            </div>
          </Card>

          <Card className="border-white/10 bg-white/5 p-6 shadow-lg shadow-emerald-500/10">
            <h2 className="text-lg font-semibold text-white">Homepage</h2>
            <div className="mt-4 grid gap-4">
              <Field label="Catégorie services mise en avant" id="featuredServicesCategory">
                <input
                  id="featuredServicesCategory"
                  value={form.homepage.featuredServicesCategory}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      homepage: { ...prev.homepage, featuredServicesCategory: event.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </Field>
              <Field label="Catégorie projets mise en avant" id="featuredProjectsCategory">
                <input
                  id="featuredProjectsCategory"
                  value={form.homepage.featuredProjectsCategory}
                  onChange={(event) =>
                    setForm((prev) => ({
                      ...prev,
                      homepage: { ...prev.homepage, featuredProjectsCategory: event.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-white focus:border-emerald-400 focus:outline-none"
                />
              </Field>
            </div>
          </Card>
        </div>
      </form>
    </div>
  );
}

function mapSettingsToForm(settings: SiteSettings): SiteSettingsForm {
  return {
    siteName: settings.siteName ?? "",
    siteTagline: settings.siteTagline ?? "",
    logo: settings.logo ?? "",
    favicon: settings.favicon ?? "",
    primaryColor: settings.primaryColor ?? "",
    secondaryColor: settings.secondaryColor ?? "",
    socialLinks: {
      facebook: settings.socialLinks.facebook ?? "",
      instagram: settings.socialLinks.instagram ?? "",
      linkedin: settings.socialLinks.linkedin ?? "",
      tiktok: settings.socialLinks.tiktok ?? "",
      youtube: settings.socialLinks.youtube ?? "",
      twitter: settings.socialLinks.twitter ?? "",
      whatsapp: settings.socialLinks.whatsapp ?? "",
    },
    contact: {
      email: settings.contact.email ?? "",
      phone: settings.contact.phone ?? "",
      address: settings.contact.address ?? "",
    },
    seo: {
      metadataBase: settings.seo.metadataBase ?? "",
      defaultTitle: settings.seo.defaultTitle ?? "",
      defaultDescription: settings.seo.defaultDescription ?? "",
      ogImage: settings.seo.ogImage ?? "",
    },
    blog: {
      featuredCategory: settings.blog.featuredCategory ?? "",
      postsPerPage: settings.blog.postsPerPage ?? 9,
    },
    homepage: {
      featuredServicesCategory: settings.homepage.featuredServicesCategory ?? "",
      featuredProjectsCategory: settings.homepage.featuredProjectsCategory ?? "",
    },
  };
}

type FieldProps = {
  label: string;
  id: string;
  children: ReactNode;
};

function Field({ label, id, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-white">
        {label}
      </label>
      {children}
    </div>
  );
}
