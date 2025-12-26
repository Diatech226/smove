import { slugify } from "@/lib/utils";

export type SeedCategory = {
  type: "post" | "service" | "project" | "event";
  name: string;
  slug: string;
  order: number;
};

const POST_CATEGORIES = ["Stratégie", "Création", "Social Media", "Production", "Marketing digital"];

export const DEFAULT_CATEGORIES: SeedCategory[] = POST_CATEGORIES.map((name, index) => ({
  type: "post",
  name,
  slug: slugify(name),
  order: index,
}));
