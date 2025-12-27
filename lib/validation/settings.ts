import { z } from "zod";

import { mediaUrlSchema } from "./admin";

const absoluteUrlRegex = /^https?:\/\/[\w.-]+(?:\.[\w.-]+)+(?:[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;

const optionalString = z.string().trim().optional().nullable();

const optionalAbsoluteUrl = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine((value) => !value || absoluteUrlRegex.test(value), {
    message: "URL invalide",
  });

export const socialLinksSchema = z.object({
  facebook: mediaUrlSchema.nullish(),
  instagram: mediaUrlSchema.nullish(),
  linkedin: mediaUrlSchema.nullish(),
  tiktok: mediaUrlSchema.nullish(),
  youtube: mediaUrlSchema.nullish(),
  twitter: mediaUrlSchema.nullish(),
  whatsapp: mediaUrlSchema.nullish(),
});

export const contactSchema = z.object({
  email: optionalString,
  phone: optionalString,
  address: optionalString,
});

export const seoSchema = z.object({
  metadataBase: optionalAbsoluteUrl,
  defaultTitle: optionalString,
  defaultDescription: optionalString,
  ogImage: mediaUrlSchema.nullish(),
});

export const blogSchema = z.object({
  featuredCategory: optionalString,
  postsPerPage: z.coerce.number().int().min(1).max(50).default(9),
});

export const homepageSchema = z.object({
  featuredServicesCategory: optionalString,
  featuredProjectsCategory: optionalString,
});

export const siteSettingsSchema = z.object({
  siteName: z.string().trim().min(1, "Nom du site obligatoire"),
  siteTagline: z.string().trim().min(1, "Accroche obligatoire"),
  logo: mediaUrlSchema.nullish(),
  favicon: mediaUrlSchema.nullish(),
  primaryColor: optionalString,
  secondaryColor: optionalString,
  socialLinks: socialLinksSchema,
  contact: contactSchema,
  seo: seoSchema,
  blog: blogSchema,
  homepage: homepageSchema,
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;
