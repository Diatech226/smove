import { safePrisma } from "@/lib/safePrisma";
import { slugify } from "@/lib/utils";

type SlugModel = "post" | "service" | "project" | "event";

const MODEL_LOOKUPS: Record<SlugModel, (slug: string) => ReturnType<typeof safePrisma<{ id: string } | null>>> = {
  post: (slug) => safePrisma((db) => db.post.findUnique({ where: { slug }, select: { id: true } })),
  service: (slug) => safePrisma((db) => db.service.findUnique({ where: { slug }, select: { id: true } })),
  project: (slug) => safePrisma((db) => db.project.findUnique({ where: { slug }, select: { id: true } })),
  event: (slug) => safePrisma((db) => db.event.findUnique({ where: { slug }, select: { id: true } })),
};

export async function findAvailableSlug(model: SlugModel, value: string, excludeId?: string) {
  const baseSlug = slugify(value);
  if (!baseSlug) return null;

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    const lookupResult = await MODEL_LOOKUPS[model](candidate);
    if (!lookupResult.ok) {
      return null;
    }
    if (!lookupResult.data || (excludeId && lookupResult.data.id === excludeId)) {
      return candidate;
    }
  }

  return null;
}

export async function findAvailablePostSlug(value: string, excludeId?: string) {
  return findAvailableSlug("post", value, excludeId);
}
