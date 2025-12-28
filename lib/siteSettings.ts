import { cache } from "react";

import { siteConfig } from "@/lib/config/seo";
import { safePrisma } from "@/lib/safePrisma";
import type { SiteSettingsInput } from "@/lib/validation/settings";

export type SocialLinks = {
  facebook: string | null;
  instagram: string | null;
  linkedin: string | null;
  tiktok: string | null;
  youtube: string | null;
  twitter: string | null;
  whatsapp: string | null;
};

export type ContactSettings = {
  email: string | null;
  phone: string | null;
  address: string | null;
};

export type SeoSettings = {
  metadataBase: string | null;
  defaultTitle: string | null;
  defaultDescription: string | null;
  ogImage: string | null;
};

export type BlogSettings = {
  featuredCategory: string | null;
  postsPerPage: number;
};

export type HomepageSettings = {
  featuredServicesCategory: string | null;
  featuredProjectsCategory: string | null;
};

export type SiteSettings = {
  siteName: string;
  siteTagline: string;
  logo: string | null;
  favicon: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  socialLinks: SocialLinks;
  contact: ContactSettings;
  seo: SeoSettings;
  blog: BlogSettings;
  homepage: HomepageSettings;
};

type SiteSettingsRecord = {
  siteName: string;
  siteTagline: string;
  logo: string | null;
  favicon: string | null;
  primaryColor: string | null;
  secondaryColor: string | null;
  socialLinks: unknown;
  contact: unknown;
  seo: unknown;
  blog: unknown;
  homepage: unknown;
};

export const SETTINGS_KEY = "default";

const defaultMetadataBase = process.env.NEXT_PUBLIC_SITE_URL ?? siteConfig.url;

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  siteName: siteConfig.name,
  siteTagline: siteConfig.description,
  logo: null,
  favicon: null,
  primaryColor: null,
  secondaryColor: null,
  socialLinks: {
    facebook: null,
    instagram: null,
    linkedin: null,
    tiktok: null,
    youtube: null,
    twitter: null,
    whatsapp: null,
  },
  contact: {
    email: null,
    phone: null,
    address: null,
  },
  seo: {
    metadataBase: defaultMetadataBase,
    defaultTitle: siteConfig.name,
    defaultDescription: siteConfig.description,
    ogImage: "/og-default.png",
  },
  blog: {
    featuredCategory: null,
    postsPerPage: 9,
  },
  homepage: {
    featuredServicesCategory: null,
    featuredProjectsCategory: null,
  },
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settingsResult = await safePrisma(
    (db) => db.siteSettings.findUnique({ where: { key: SETTINGS_KEY } }),
    { timeoutMs: 2000 },
  );

  if (!settingsResult.ok) {
    logSiteSettingsError("load", settingsResult);
    return DEFAULT_SITE_SETTINGS;
  }

  if (!settingsResult.data) {
    const createResult = await safePrisma(
      (db) =>
        db.siteSettings.create({
          data: {
            key: SETTINGS_KEY,
            ...buildSiteSettingsPayload(DEFAULT_SITE_SETTINGS),
          },
        }),
      { timeoutMs: 2000 },
    );

    if (!createResult.ok) {
      logSiteSettingsError("create", createResult);
      return DEFAULT_SITE_SETTINGS;
    }

    return hydrateSiteSettings(createResult.data as SiteSettingsRecord);
  }

  return hydrateSiteSettings(settingsResult.data as SiteSettingsRecord);
});

export function hydrateSiteSettings(record: SiteSettingsRecord): SiteSettings {
  return {
    siteName: normalizeRequiredString(record.siteName, DEFAULT_SITE_SETTINGS.siteName),
    siteTagline: normalizeRequiredString(record.siteTagline, DEFAULT_SITE_SETTINGS.siteTagline),
    logo: normalizeOptionalString(record.logo),
    favicon: normalizeOptionalString(record.favicon),
    primaryColor: normalizeOptionalString(record.primaryColor),
    secondaryColor: normalizeOptionalString(record.secondaryColor),
    socialLinks: mergeObject(record.socialLinks, DEFAULT_SITE_SETTINGS.socialLinks, normalizeOptionalString),
    contact: mergeObject(record.contact, DEFAULT_SITE_SETTINGS.contact, normalizeOptionalString),
    seo: {
      metadataBase: normalizeOptionalString(
        (record.seo as SeoSettings | undefined)?.metadataBase ?? DEFAULT_SITE_SETTINGS.seo.metadataBase,
      ),
      defaultTitle: normalizeOptionalString(
        (record.seo as SeoSettings | undefined)?.defaultTitle ?? DEFAULT_SITE_SETTINGS.seo.defaultTitle,
      ),
      defaultDescription: normalizeOptionalString(
        (record.seo as SeoSettings | undefined)?.defaultDescription ?? DEFAULT_SITE_SETTINGS.seo.defaultDescription,
      ),
      ogImage: normalizeOptionalString(
        (record.seo as SeoSettings | undefined)?.ogImage ?? DEFAULT_SITE_SETTINGS.seo.ogImage,
      ),
    },
    blog: {
      featuredCategory: normalizeOptionalString(
        (record.blog as BlogSettings | undefined)?.featuredCategory ?? DEFAULT_SITE_SETTINGS.blog.featuredCategory,
      ),
      postsPerPage: normalizeNumber(
        (record.blog as BlogSettings | undefined)?.postsPerPage,
        DEFAULT_SITE_SETTINGS.blog.postsPerPage,
      ),
    },
    homepage: {
      featuredServicesCategory: normalizeOptionalString(
        (record.homepage as HomepageSettings | undefined)?.featuredServicesCategory ??
          DEFAULT_SITE_SETTINGS.homepage.featuredServicesCategory,
      ),
      featuredProjectsCategory: normalizeOptionalString(
        (record.homepage as HomepageSettings | undefined)?.featuredProjectsCategory ??
          DEFAULT_SITE_SETTINGS.homepage.featuredProjectsCategory,
      ),
    },
  };
}

export function buildSiteSettingsPayload(settings: SiteSettings | SiteSettingsInput) {
  return {
    siteName: settings.siteName.trim(),
    siteTagline: settings.siteTagline.trim(),
    logo: normalizeOptionalString(settings.logo),
    favicon: normalizeOptionalString(settings.favicon),
    primaryColor: normalizeOptionalString(settings.primaryColor),
    secondaryColor: normalizeOptionalString(settings.secondaryColor),
    socialLinks: normalizeObject(settings.socialLinks, normalizeOptionalString),
    contact: normalizeObject(settings.contact, normalizeOptionalString),
    seo: normalizeObject(settings.seo, normalizeOptionalString),
    blog: {
      featuredCategory: normalizeOptionalString(settings.blog.featuredCategory),
      postsPerPage: normalizeNumber(settings.blog.postsPerPage, DEFAULT_SITE_SETTINGS.blog.postsPerPage),
    },
    homepage: normalizeObject(settings.homepage, normalizeOptionalString),
  };
}

export function normalizeOptionalString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

function normalizeRequiredString(value: unknown, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
}

function normalizeNumber(value: unknown, fallback: number): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

function mergeObject<T extends Record<string, unknown>>(
  value: unknown,
  fallback: T,
  transform: (input: unknown) => unknown,
): T {
  if (!value || typeof value !== "object") {
    return normalizeObject(fallback, transform);
  }
  const entries = Object.entries(fallback).map(([key, defaultValue]) => {
    const nextValue = (value as Record<string, unknown>)[key];
    return [key, transform(nextValue ?? defaultValue)];
  });
  return Object.fromEntries(entries) as T;
}

function normalizeObject<T extends Record<string, unknown>>(value: T, transform: (input: unknown) => unknown): T {
  const entries = Object.entries(value).map(([key, entry]) => [key, transform(entry)]);
  return Object.fromEntries(entries) as T;
}

function logSiteSettingsError(
  action: "load" | "create",
  result: { message: string; errorType: string },
): void {
  const hints: Record<string, string> = {
    AUTH_FAILED: "Vérifiez les identifiants MongoDB et encodez les caractères spéciaux dans l'URI.",
    IP_NOT_ALLOWED: "Ajoutez l'IP du serveur dans Atlas > Network Access.",
    INVALID_URL: "Contrôlez le format mongodb+srv://.../smove et supprimez les guillemets dans .env.",
    DB_UNREACHABLE: "Vérifiez l'état du cluster et l'accès réseau (whitelist).",
  };

  const hint = hints[result.errorType] ?? "Consultez les logs Prisma pour plus de détails.";

  console.error(`[SiteSettings] Failed to ${action} settings`, {
    message: result.message,
    errorType: result.errorType,
    hint,
  });
}
