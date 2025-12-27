// file: lib/validation/admin.ts
import { z } from "zod";

const urlRegex = /^(https?:\/\/|\/)[^\s/$.?#].[^\s]*$/i;

export const slugSchema = z
  .string({ required_error: "Slug requis" })
  .min(1, "Le slug est obligatoire")
  .max(120, "Le slug ne doit pas dépasser 120 caractères")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Le slug doit utiliser des minuscules et des tirets");

export const mediaUrlSchema = z
  .string()
  .trim()
  .optional()
  .refine((value) => !value || urlRegex.test(value), {
    message: "URL invalide",
  });

export const postSchema = z.object({
  title: z.string().min(1, "Titre obligatoire"),
  slug: slugSchema,
  categoryId: z.string().trim().optional().nullable(),
  excerpt: z
    .string()
    .trim()
    .max(320, "L'extrait ne doit pas dépasser 320 caractères")
    .optional()
    .nullable(),
  body: z
    .string()
    .trim()
    .max(15000, "Le contenu est trop long")
    .optional()
    .nullable(),
  coverImage: mediaUrlSchema.nullish(),
  gallery: z.array(mediaUrlSchema.or(z.literal(""))).max(20).optional(),
  videoUrl: mediaUrlSchema.nullish(),
  status: z.enum(["draft", "published", "archived", "removed"]).optional(),
  tags: z.array(z.string().trim().min(1)).max(12).optional(),
});

export const postUpdateSchema = postSchema.partial();

export const serviceSchema = z.object({
  name: z.string().min(1, "Nom obligatoire"),
  slug: slugSchema,
  description: z.string().min(1, "Description obligatoire"),
  category: z.string().trim().optional().nullable(),
  image: mediaUrlSchema.nullish(),
});

export const projectSchema = z.object({
  client: z.string().min(1, "Client obligatoire"),
  title: z.string().min(1, "Titre obligatoire"),
  slug: slugSchema,
  sector: z.string().min(1, "Secteur obligatoire"),
  summary: z.string().trim().optional().nullable(),
  body: z.string().trim().optional().nullable(),
  results: z.array(z.string().trim().min(1)).max(20).optional(),
  category: z.string().trim().optional().nullable(),
  coverImage: mediaUrlSchema.nullish(),
});

export const eventSchema = z.object({
  title: z.string().min(1, "Titre obligatoire"),
  slug: slugSchema,
  date: z.coerce.date({ invalid_type_error: "Date invalide" }),
  location: z.string().trim().optional().nullable(),
  description: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  coverImage: mediaUrlSchema.nullish(),
});

export const taxonomySchema = z.object({
  type: z
    .enum([
      "service_sector",
      "service_category",
      "project_sector",
      "project_category",
      "post_category",
    ])
    .describe("Type de taxonomie"),
  slug: slugSchema,
  label: z.string().min(1, "Libellé obligatoire"),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export const categorySchema = z.object({
  type: z.enum(["post", "service", "project", "event"]),
  name: z.string().min(1, "Nom obligatoire"),
  slug: slugSchema,
  order: z.number().int().min(0).default(0),
});

export const userRoleSchema = z.enum(["admin", "client"]);
export const userStatusSchema = z.enum(["active", "disabled", "pending"]);

export const userCreateSchema = z.object({
  email: z.string().trim().email("Email invalide"),
  role: userRoleSchema.optional(),
});

export const userUpdateSchema = z.object({
  role: userRoleSchema.optional(),
  status: userStatusSchema.optional(),
});
