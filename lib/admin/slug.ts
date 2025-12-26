import { safePrisma } from "@/lib/safePrisma";
import { slugify } from "@/lib/utils";

export async function findAvailablePostSlug(value: string, excludeId?: string) {
  const baseSlug = slugify(value);
  if (!baseSlug) return null;

  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;
    const lookupResult = await safePrisma((db) => db.post.findUnique({ where: { slug: candidate } }));
    if (!lookupResult.ok) {
      return null;
    }
    if (!lookupResult.data || (excludeId && lookupResult.data.id === excludeId)) {
      return candidate;
    }
  }

  return null;
}
